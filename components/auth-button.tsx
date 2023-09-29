"use client";

import React from "react";
import LoadingDots from "@/components/icons/loading-dots";
import { useState } from "react";
import { toast } from "sonner";
import { snowball } from "@/lib/snowball";
import { on } from "events";

export enum AuthButtonType {
  Login,
  Register,
}

export interface AuthButtonProps {
  type: AuthButtonType;
  onClick?: () => void;
}

export default function AuthButton({ type, onClick }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // async function authAction() {
  //   setLoading(true);
  //   try {
  //     switch (type) {
  //       case AuthButtonType.Login:
  //         await snowball.authenticate();
  //         const user = await snowball.getAddress();
  //         onAuth(user);
  //         setLoading(false);
  //         break;
  //       case AuthButtonType.Register:
  //         await snowball.register("snowball dashboard");
  //         setLoading(false);
  //         break;
  //     }
  //     setIsAuth(true);
  //   } catch (error) {
  //     toast.error(`Error: ${JSON.stringify(error)}`);
  //     setLoading(false);
  //   }
  // }

  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`${
        loading
          ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {loading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        <>
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            {type === AuthButtonType.Login ? "Login" : "Register"}
          </p>
        </>
      )}
    </button>
  );
}
