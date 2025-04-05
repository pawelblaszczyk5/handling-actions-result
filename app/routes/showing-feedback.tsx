import { toasterContext } from "~/context";
import type { Route } from "./+types/showing-feedback";
import { href, useFetcher } from "react-router";

/* 

This is an example where I want to show some user feedback after performing an action and I think I got it working pretty nice.

Technically I could use `fetcher.Form` and cookie/session flashing stuff to make it work without JS (it's not a requirement in most of the stuff I'm building) and don't require experimental middleware but I'm fine with this approach.

Nevertheless, in cases like this it'd be much easier to just to await submit and get the result. Maybe I'm missing something obvious? `fetcher.data` will still be stale when awaiting `fetcher.submit`.

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
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    toaster.error("Something went wrong");
  }
};

const Route = () => {
  const fetcher = useFetcher();

  return (
    <>
      <h1>Hello world</h1>
      <button
        onClick={() => {
          fetcher.submit(null, {
            method: "POST",
            action: href("/showing-feedback"),
          });
        }}
      >
        Submit
      </button>
    </>
  );
};

export default Route;
