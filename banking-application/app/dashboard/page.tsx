import { DarkThemeToggle } from "flowbite-react";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle />
      <h1 className="text-2xl dark:text-white">Dashboard Page</h1>
    </main>
  );
}
