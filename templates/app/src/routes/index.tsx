import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-canvas p-6">
      <h1 className="text-heading font-medium text-strong">Your app</h1>
    </main>
  );
}
