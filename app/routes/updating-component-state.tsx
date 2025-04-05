import { toasterContext } from "~/context";
import type { Route } from "./+types/showing-feedback";
import { href, useFetcher } from "react-router";
import { useState } from "react";

/* 

This is an example where I want to update some component internal state when action fails/passes. Common example is firing actions from popovers/modals/drawers when you want to close the stuff when actions is successfully submitted.

In that case to avoid using effect I can use the trick with tracking previous state and updating state based on the change. It's working, but it's a bit of a pain and really hard to explain to less explained developers.

*/

export const action = ({}: Route.ActionArgs) => {
  if (Math.random() > 0.5) {
    return { success: true };
  }

  return { success: false };
};

export const clientAction = async ({
  context,
  serverAction,
}: Route.ClientActionArgs) => {
  const toaster = context.get(toasterContext);

  try {
    const result = await serverAction();

    if (result.success) {
      toaster.success("It's working");
    } else {
      toaster.error("It has failed");
    }

    return result;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    toaster.error("Something went wrong");

    return { success: false };
  }
};

const Route = () => {
  const [isOpen, setIsOpen] = useState(false);

  const fetcher = useFetcher<typeof clientAction>();

  const [previousFetcherData, setPreviousFetcherData] = useState(fetcher.data);

  if (fetcher.data !== previousFetcherData) {
    setPreviousFetcherData(fetcher.data);

    if (fetcher.data?.success === true) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <h1>Hello world</h1>
      <button onClick={() => setIsOpen(true)}>Open dialog</button>
      <dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <p>Imagine it's a pretty popover/dialog</p>
        <button
          onClick={() => {
            fetcher.submit(null, {
              method: "POST",
              action: href("/updating-component-state"),
            });
          }}
        >
          Submit
        </button>
      </dialog>
    </>
  );
};

export default Route;
