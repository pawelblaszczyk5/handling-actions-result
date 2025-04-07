import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/showing-feedback", "routes/showing-feedback.tsx"),
  route("/updating-component-state", "routes/updating-component-state.tsx"),
  route("/firing-callbacks", "routes/firing-callbacks.tsx"),
  route("/subsequent-actions", "routes/subsequent-actions.tsx"),
  route("/subsequent-action-1", "routes/subsequent-action-1.tsx"),
  route("/subsequent-action-2", "routes/subsequent-action-2.tsx"),
] satisfies RouteConfig;
