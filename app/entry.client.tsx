import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { toasterContext } from "~/context";

// This usually comes from library and requires context usage, to scope it properly per request
export const useToaster = () => {
  return {
    success: (text: string) => window.alert(`SUCCESS: ${text}`),
    error: (text: string) => window.alert(`ERROR: ${text}`),
  };
};

const RouterWithContext = () => {
  const toaster = useToaster();

  return (
    <HydratedRouter
      unstable_getContext={() => new Map([[toasterContext, toaster]])}
    />
  );
};

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RouterWithContext />
    </StrictMode>
  );
});
