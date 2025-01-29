import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Provider } from "~/components/ui/provider";
import { ColorModeProvider } from "./components/ui/color-mode";
import "remixicon/fonts/remixicon.css";
import Navbar from "./components/navbar";

import "./global.css";

import { Box } from "@chakra-ui/react";
import { Toaster } from "./components/ui/toaster";
import PostHogPageView from "./util/pageview";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://typefaces.chanakancloud.net" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider>
      <ColorModeProvider>
        <Toaster />
        <Box
          css={{
            position: "relative", // Needed for positioning the pseudo-element
            width: "100%",
            height: "100%",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "full",
              minH: "100svh",
              height: "100%",
              zIndex: -1, // Place it behind the content
              background: "#ebfff3",
            },
          }}
        >
          <Navbar />
          <Outlet />
          <PostHogPageView />
        </Box>
      </ColorModeProvider>
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
