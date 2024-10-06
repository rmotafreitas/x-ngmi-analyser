import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
  useRouteError,
} from "react-router-dom";
import { HomePage } from "./pages";
import { NotFoundPage } from "./pages/NotFound";
import { AnalyserPage, analyserLoader } from "./pages/Analyser";
import { Suspense } from "react";
function ErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    </div>
  );
}

export function GlobalLoadingFallback() {
  return <p>Loading...</p>;
}
const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/:username",
    element: <AnalyserPage />,
    loader: analyserLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorBoundary />,
  },
];
const router = createBrowserRouter(routes);
export function App() {
  return (
    <Suspense fallback={<GlobalLoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
