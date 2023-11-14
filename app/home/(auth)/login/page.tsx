"use client";

import Image from "next/image";
import { Suspense } from "react";
import AuthButton, { AuthButtonType } from "@/components/auth-button";
import { useState } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import { snowball } from "@/lib/snowball";
import Input from "@/components/input";

enum RegistrationState {
  Default,
  Registering,
  Registered,
}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [registrationState, setIsRegistering] = useState(
    RegistrationState.Default,
  );

  const handleLogin = async () => {
    try {
      switch (registrationState) {
        case RegistrationState.Registering:
          await snowball.register(username);
          setIsRegistering(RegistrationState.Registered);
          return;
        case RegistrationState.Registered:
        case RegistrationState.Default:
          await snowball.authenticate();
          break;
      }

      const address = await snowball.getAddress();
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, username }),
      });
      // TODO: Save the token securely ie HttpOnly cookie
      // For now, we'll save it in localStorage (not recommended for production)
      localStorage.setItem("token", await response.text());
      redirect("/dashboard");
    } catch (err) {
      setError(`Error: ${JSON.stringify(err)}`);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col rounded-lg py-10 shadow-md">
      <Image
        alt="Snowball Logo"
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border-stone-400"
        src="/logo.svg"
      />
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        Snowball
      </h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
        Build and deploy dapps
      </p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          {registrationState === RegistrationState.Registering ? (
            <Input setUsername={setUsername} />
          ) : (
            <AuthButton type={AuthButtonType.Login} onClick={handleLogin} />
          )}

          {registrationState === RegistrationState.Registered ? (
            <></>
          ) : (
            <AuthButton
              type={AuthButtonType.Register}
              onClick={() => {
                registrationState && username !== ""
                  ? handleLogin()
                  : setIsRegistering(RegistrationState.Registering);
              }}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default LoginPage;
