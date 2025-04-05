import { toasterContext } from "~/context";
import type { Route } from "./+types/showing-feedback";
import { href, useFetcher } from "react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* 

This is basically the same as a previous one, but now the modal with action is refactored to separate component and its open state is controlled from the outside.

Now we can't use the previous trick with tracking previous state, because we can't update parent state while rendering - we can only update current component state during render. So we're forced to use `useEffect` to react to the state changes.

Moreover, the callback isn't stable so to satisfy effect dependencies and avoid stale callback we need to track the latest version with `useRef` and `useLayoutEffect`. In future this could be solved with either currently experimental `useEffectEvent` or even more experimental `fire` stuff related to React Compiler/React Forget.

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

const ModalWithAction = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const fetcher = useFetcher<typeof clientAction>();

  const latestOnOpenChange = useRef(onOpenChange);

  useLayoutEffect(() => {
    latestOnOpenChange.current = onOpenChange;
  });

  useEffect(() => {
    if (fetcher.data?.success) {
      latestOnOpenChange.current(false);
    }
  }, [fetcher.data]);

  return (
    <dialog open={isOpen} onClose={() => onOpenChange(false)}>
      <p>Imagine it's a pretty popover/dialog</p>
      <button
        onClick={() => {
          fetcher.submit(null, {
            method: "POST",
            action: href("/firing-callbacks"),
          });
        }}
      >
        Submit
      </button>
    </dialog>
  );
};

const Route = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <h1>Hello world</h1>
      <button onClick={() => setIsOpen(true)}>Open dialog</button>
      <ModalWithAction
        isOpen={isOpen}
        onOpenChange={(value) => setIsOpen(false)}
      ></ModalWithAction>
    </>
  );
};

export default Route;
