import { snowball } from "./snowball";

export type User = {
  username: string;
  ethAddress: string;
  sessionExpiresAt: number;
};

export type AuthStatus =
  | { name: "init"; syncing: boolean }
  | { name: "signed-in"; syncing: boolean; user: User }
  | { name: "signed-out"; syncing: boolean }
  | { name: "signing-in"; syncing: boolean }
  | { name: "signed-up"; syncing: boolean; username: string };

export let status: AuthStatus = { name: "init", syncing: false };

export let syncStatusPromise: Promise<AuthStatus> = Promise.resolve(status);

export function checkStatus() {
  if (status.syncing) return syncStatusPromise;

  let user: User | null = null;
  try {
    user = JSON.parse(localStorage.getItem("user") as any);
    if (!user?.sessionExpiresAt || Date.now() > user.sessionExpiresAt) {
      user = null;
    }
  } catch {
    // ignore
  }

  return (syncStatusPromise = (async () => {
    status.syncing = true;

    status = user
      ? { name: "signed-in", syncing: false, user }
      : { name: "signed-out", syncing: false };

    return status;
  })());
}

export function signIn() {
  if (status.syncing) return syncStatusPromise;

  // TODO: Load from kv
  const username = status.name === "signed-up" ? status.username : "<unknown>";

  status = { name: "signing-in", syncing: true };

  return (syncStatusPromise = (async () => {
    try {
      await snowball.authenticate();
      const DEFAULT_EXP = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7,
      ).getTime();
      const ethAddress = await snowball.getAddress();

      const user: User = {
        username,
        ethAddress,
        sessionExpiresAt: DEFAULT_EXP,
      };

      localStorage.setItem("user", JSON.stringify(user));

      status = { name: "signed-in", syncing: false, user };
      return status;
    } catch (error) {
      console.error(error);
      status = { name: "signed-out", syncing: false };
      return status;
    }
  })());
}

export function signUp(username: string) {
  if (status.syncing) return syncStatusPromise;

  status = { name: "signing-in", syncing: true };

  return (syncStatusPromise = (async () => {
    try {
      await snowball.register(username);
      const DEFAULT_EXP = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7,
      ).getTime();
      const ethAddress = await snowball.getAddress();

      const user: User = {
        username,
        ethAddress,
        sessionExpiresAt: DEFAULT_EXP,
      };

      localStorage.setItem("user", JSON.stringify(user));

      status = { name: "signed-up", syncing: false, username };
      return status;
    } catch (error) {
      console.error(error);
      status = { name: "signed-out", syncing: false };
      return status;
    }
  })());
}

export function signOut() {
  if (status.syncing) return syncStatusPromise;

  status = { name: "signed-out", syncing: false };

  localStorage.removeItem("user");
}
