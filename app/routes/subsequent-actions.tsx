import type { Route } from "./+types/showing-feedback";
import { href, useFetcher } from "react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clientAction as subsequentAction1 } from "~/routes/subsequent-action-1";
import type { clientAction as subsequentAction2 } from "~/routes/subsequent-action-2";

/* 

This is an example where I want to chain multiple actions while updating client state in meanwhile - hence I can't just chain them at action/serverAction level. Also in this hypothetical scenario they make sense as separate actions at the backend level, e.g. uploading file and then doing something with the uploaded file - it doesn't need to be "transaction" - it's fine if only file upload passes.

In that case similarly I can't use the trick with tracking previous data. And the `useEffect` chain is event more tedious and inconvenient. Obviously in this contrived example, the `currentAction` state could be derived in render function from fetchers `data` but it's not always possible, sometimes it's also firing callbacks or updating some global-ish state.

I removed error handling from this example for brevity so it'd be even more complicated in the reality. I think if we'd compare this with hypothetical world where `fetcher.submit` returns `Promise<some data>` it'd be sooo much easier 😄

*/

const Route = () => {
  const [currentAction, setCurrentAction] = useState("Not started yet");

  const subsequentAction1Fetcher = useFetcher<typeof subsequentAction1>();
  const subsequentAction2Fetcher = useFetcher<typeof subsequentAction2>();

  const submit2ndAction = () => {
    subsequentAction2Fetcher.submit(null, {
      action: href("/subsequent-action-2"),
      method: "POST",
    });
  };

  const latestSubmit2ndAction = useRef(submit2ndAction);

  useLayoutEffect(() => {
    latestSubmit2ndAction.current = submit2ndAction;
  }, [submit2ndAction]);

  useEffect(() => {
    if (subsequentAction1Fetcher.data?.success) {
      setCurrentAction("2 in progress");
      latestSubmit2ndAction.current();
    }
  }, [subsequentAction1Fetcher.data]);

  useEffect(() => {
    if (subsequentAction2Fetcher.data?.success) {
      setCurrentAction("Chain successfully went through");
    }
  }, [subsequentAction2Fetcher.data]);

  return (
    <>
      <h1>Hello world</h1>
      <button
        onClick={() => {
          setCurrentAction("1 in progress");
          subsequentAction1Fetcher.submit(null, {
            action: href("/subsequent-action-1"),
            method: "POST",
          });
        }}
      >
        Start actions chain
      </button>
      <p>Current action: {currentAction}</p>
    </>
  );
};

export default Route;
