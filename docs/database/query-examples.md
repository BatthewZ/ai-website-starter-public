# Drizzle Query Examples

### Select all rows

```ts
const db = createDb(c.env.DB);
const allUsers = await db.select().from(user);
```

### Select with filter

```ts
import { eq } from "drizzle-orm";

const result = await db
  .select()
  .from(user)
  .where(eq(user.email, "test@example.com"));
```

### Select specific columns

```ts
const names = await db
  .select({ id: user.id, name: user.name })
  .from(user);
```

### Insert a row

```ts
await db.insert(user).values({
  id: "user_123",
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### Update a row

```ts
import { eq } from "drizzle-orm";

await db
  .update(user)
  .set({ name: "Alice Smith", updatedAt: new Date() })
  .where(eq(user.id, "user_123"));
```

### Delete a row

```ts
import { eq } from "drizzle-orm";

await db.delete(user).where(eq(user.id, "user_123"));
```

### Relational queries (using the query API)

Because the schema is passed to `drizzle()`, you can use the relational query builder:

```ts
const db = createDb(c.env.DB);

// Find a user with their sessions
const result = await db.query.user.findFirst({
  where: eq(user.id, "user_123"),
  with: {
    sessions: true,
  },
});
```

> **Note:** For relational queries with `with`, you need to define `relations` in your schema using Drizzle's `relations()` helper. The current auth schema relies on foreign key constraints but does not yet export explicit Drizzle relations objects. If you need the `with` API, add relations to the schema file.

### Join example

```ts
import { eq } from "drizzle-orm";

const usersWithSessions = await db
  .select({
    userName: user.name,
    sessionToken: session.token,
    expiresAt: session.expiresAt,
  })
  .from(user)
  .innerJoin(session, eq(user.id, session.userId));
```

### Count

```ts
import { count } from "drizzle-orm";

const [result] = await db.select({ total: count() }).from(user);
console.log(result.total);
```
