import { Hono } from "hono";

import type { AppEnv } from "../env";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./users/users.routes";

const app = new Hono<AppEnv>();

app.route("/", authRoutes);
app.route("/", userRoutes);

export default app;
