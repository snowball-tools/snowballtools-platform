import React from "react";

export interface InputProps {
  setUsername: (username: string) => void;
}

export default function Input({ setUsername }: InputProps) {
  return (
    <input
      className="group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 bg-white p-2 text-sm font-medium text-stone-600  transition-colors placeholder:text-stone-700 focus:border-black focus:ring-stone-700 dark:border-stone-700 dark:bg-black dark:text-stone-400 dark:hover:bg-black"
      onChange={(e) => setUsername(e.target.value)}
      placeholder="ie. Taylor Swift"
    />
  );
}
