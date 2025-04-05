import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/showing-feedback", "routes/showing-feedback.tsx"),
  route("/updating-component-state", "routes/updating-component-state.tsx"),
  route("/firing-callbacks", "routes/firing-callbacks.tsx"),
] satisfies RouteConfig;
