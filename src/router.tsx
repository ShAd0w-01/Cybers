import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Preload route code + data as soon as a link is hovered/focused so
    // navigations feel instant instead of buffering on click.
    defaultPreload: "intent",
    defaultPreloadDelay: 30,
    defaultPreloadStaleTime: 0,
    // Keep the previous page on screen briefly instead of flashing a spinner.
    defaultPendingMs: 400,
    defaultPendingMinMs: 200,

  });

  return router;
};
