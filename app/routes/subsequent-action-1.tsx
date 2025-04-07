import type { Route } from "./+types/subsequent-action-1";

export const action = async ({}: Route.ActionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 2_000));

  if (Math.random() < 0.9) {
    return { success: true };
  }

  return { success: false };
};

export const clientAction = async ({
  context,
  serverAction,
}: Route.ClientActionArgs) => {
  try {
    const result = await serverAction();

    return result;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    return { success: false };
  }
};
