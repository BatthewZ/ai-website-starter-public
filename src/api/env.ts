import type { Session, User } from "better-auth/types";

export type AppBindings = {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  TRUSTED_ORIGINS?: string;
  ASSETS: Fetcher;
};

export type AuthVariables = {
  user: User | null;
  session: Session | null;
};

export type AppVariables = AuthVariables & {
  requestId: string;
};

export type AppEnv = {
  Bindings: AppBindings;
  Variables: AppVariables;
};
