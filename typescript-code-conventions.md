# TypeScript Code Conventions

This document defines the TypeScript coding rules and preferences I follow. It is intended to instruct an AI assistant to generate code that matches these standards precisely.

---

## 1. Naming Conventions

### Variables and Constants

- Use `camelCase` for variables and `SCREAMING_SNAKE_CASE` for true module-level constants.
- Prefer descriptive names over abbreviations. Never use single-letter names except in tight loops or generic type parameters.

```typescript
// ✅ Do
const maxRetryCount = 3;
const MAX_RETRY_COUNT = 3;
const userProfileData = await fetchUser(id);

// ❌ Don't
const n = 3;
const d = await fetchUser(id);
const MaxRetryCount = 3;
```

### Functions and Methods

- Use `camelCase`. Name functions after what they do, not what they return. Prefer verb-first names.

```typescript
// ✅ Do
function calculateTotalPrice(items: Item[]): number { ... }
async function fetchUserById(id: string): Promise<User> { ... }

// ❌ Don't
function total(items: Item[]): number { ... }
async function userData(id: string): Promise<User> { ... }
```

### Classes and Constructors

- Use `PascalCase` for class names. Name classes after what they represent, not what they do.

```typescript
// ✅ Do
class OrderProcessor { ... }
class UserRepository { ... }

// ❌ Don't
class processOrder { ... }
class handle_users { ... }
```

### Interfaces and Types

- Use `PascalCase` for both `interface` and `type` names.
- Do **not** prefix interfaces with `I` (e.g., avoid `IUser`).

```typescript
// ✅ Do
interface User { id: string; name: string; }
type UserId = string;

// ❌ Don't
interface IUser { id: string; name: string; }
type user_id = string;
```

### Enums and Enum Members

- Use `PascalCase` for the enum name. Use `PascalCase` for string enum members and `SCREAMING_SNAKE_CASE` for numeric enum members.

```typescript
// ✅ Do
enum Direction { North = "North", South = "South" }
enum StatusCode { Ok = 200, NotFound = 404 }

// ❌ Don't
enum direction { north = "north" }
```

### Generic Type Parameters

- Use single uppercase letters (`T`, `K`, `V`) for simple generics. Use descriptive `PascalCase` names when the parameter has a clear semantic role.

```typescript
// ✅ Do
function identity<T>(value: T): T { return value; }
function getProperty<TObject, TKey extends keyof TObject>(obj: TObject, key: TKey) { ... }

// ❌ Don't
function identity<type>(value: type): type { return value; }
```

### Files and Modules

- Use `kebab-case` for all file names: `user-repository.ts`, `fetch-orders.ts`.
- Match the file name to the primary export it contains.

---

## 2. Type System

### Type vs. Interface

- Use `interface` for defining the shape of objects and class contracts.
- Use `type` for unions, intersections, mapped types, conditional types, and primitives.

```typescript
// ✅ Do — interface for object shape
interface User {
  id: string;
  name: string;
}

// ✅ Do — type for union
type Status = "active" | "inactive" | "pending";

// ❌ Don't — type alias for a plain object shape when interface is clearer
type User = { id: string; name: string };
```

### Explicit vs. Inferred Types

- Let TypeScript infer types for local variables when the type is obvious from the initializer.
- Always annotate function parameters and return types explicitly.

```typescript
// ✅ Do
const count = 0; // inferred as number
function add(a: number, b: number): number { return a + b; }

// ❌ Don't
function add(a, b) { return a + b; } // implicit any
const count: number = 0; // redundant annotation
```

### Union and Intersection Types

- Use union types to express "one of these shapes". Use intersection types to compose types together.
- Prefer discriminated unions over optional properties for variant modeling.

```typescript
// ✅ Do — discriminated union
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ❌ Don't — ambiguous optional properties
type Result<T> = { data?: T; error?: string; success: boolean };
```

### Literal Types

- Use literal types to constrain values to a known set without reaching for an enum.

```typescript
// ✅ Do
type Direction = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// ❌ Don't
const direction: string = "north"; // loses all narrowing
```

### Template Literal Types

- Use template literal types to express string patterns at the type level.

```typescript
// ✅ Do
type EventName = `on${Capitalize<string>}`;
type CssVar = `--${string}`;
```

### Utility Types

- Prefer built-in utility types over rewriting equivalent mapped types manually.

```typescript
// ✅ Do
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutId = Omit<User, "id">;

// ❌ Don't
type PartialUser = { id?: string; name?: string }; // duplicated, fragile
```

### `unknown` vs. `any` vs. `never`

- Use `unknown` when the type is not known at compile time. Force callers to narrow before use.
- Never use `any` unless wrapping a third-party library with no types and you cannot improve it.
- Use `never` for exhaustive checks and unreachable code paths.

```typescript
// ✅ Do
function parseJson(raw: string): unknown {
  return JSON.parse(raw);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${value}`);
}

// ❌ Don't
function parseJson(raw: string): any {
  return JSON.parse(raw);
}
```

### Type Assertions and Casting

- Avoid `as` type assertions. When necessary, narrow with a type guard instead.
- Never use double assertions (`x as unknown as T`) to force a cast — fix the types instead.

```typescript
// ✅ Do
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}

// ❌ Don't
const user = response as User; // hides a potential mismatch
```

### Type Guards and Narrowing

- Use `typeof`, `instanceof`, `in`, and custom type predicates to narrow unions.

```typescript
// ✅ Do
function processResult(result: string | number) {
  if (typeof result === "string") {
    return result.toUpperCase();
  }
  return result.toFixed(2);
}
```

### Branded / Nominal Types

- Use branded types to prevent mixing semantically different primitives of the same underlying type.

```typescript
// ✅ Do
type UserId = string & { readonly _brand: "UserId" };
type OrderId = string & { readonly _brand: "OrderId" };

function getUser(id: UserId): Promise<User> { ... }
// getUser(orderId) — compile error, catches bugs at the type level
```

---

## 3. Strict Mode

### Required `tsconfig` Flags

Enable all of the following in every project:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  }
}
```

### `strictNullChecks` Rules

- `strictNullChecks` is included in `"strict": true`. Never disable it.
- Always handle the `null | undefined` case explicitly. Do not use non-null assertion (`!`) as a shortcut.

```typescript
// ✅ Do
function getLength(str: string | null): number {
  if (str === null) return 0;
  return str.length;
}

// ❌ Don't
function getLength(str: string | null): number {
  return str!.length; // runtime crash if str is null
}
```

### `noUncheckedIndexedAccess`

- With this flag enabled, array and index-signature access returns `T | undefined`. Always handle the undefined case.

```typescript
// ✅ Do
const first = items[0];
if (first === undefined) return;
console.log(first.name);

// ❌ Don't
console.log(items[0].name); // unsafe without the check
```

### `exactOptionalPropertyTypes`

- With this flag, `{ prop?: string }` means `prop` can be absent but **not** explicitly `undefined`. Assign accordingly.

```typescript
// ✅ Do
const obj: { name?: string } = {}; // prop absent — ok
const obj2: { name?: string } = { name: "Alice" }; // prop present — ok

// ❌ Don't
const obj3: { name?: string } = { name: undefined }; // error with exactOptionalPropertyTypes
```

---

## 4. Interfaces and Classes

### When to Use a Class vs. a Plain Object

- Use classes when you need encapsulation, methods, inheritance, or `instanceof` checks.
- Prefer plain objects and functions for simple data containers or stateless logic.

```typescript
// ✅ Do — class with behavior
class TokenBucket {
  private tokens: number;
  constructor(private readonly capacity: number) { this.tokens = capacity; }
  consume(): boolean { ... }
}

// ✅ Do — plain object for data
const user: User = { id: "1", name: "Alice" };
```

### Access Modifiers

- Use `private` for implementation details, `readonly` for properties that must not change after construction.
- Prefer `private` over `#` private fields unless you need hard runtime privacy.

```typescript
// ✅ Do
class UserService {
  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
  ) {}
}
```

### Abstract Classes

- Use abstract classes when multiple subclasses share implementation but differ in one or more methods.

```typescript
// ✅ Do
abstract class BaseRepository<T> {
  abstract findById(id: string): Promise<T | null>;
  async findOrThrow(id: string): Promise<T> {
    const result = await this.findById(id);
    if (!result) throw new Error(`Not found: ${id}`);
    return result;
  }
}
```

### Implementing Interfaces

- Explicitly annotate the `implements` clause so TypeScript enforces the contract.

```typescript
// ✅ Do
interface Logger { log(message: string): void; }
class ConsoleLogger implements Logger {
  log(message: string): void { console.log(message); }
}
```

### Constructor Patterns

- Use constructor parameter properties (`private readonly x`) to avoid boilerplate.
- Avoid logic in constructors. Use a static factory method when construction can fail.

```typescript
// ✅ Do
class Config {
  private constructor(private readonly values: Record<string, string>) {}

  static fromEnv(): Config {
    const values = loadEnv(); // can throw
    return new Config(values);
  }
}
```

---

## 5. Generics

### When to Use Generics

- Use generics when a function or class must work with multiple types while preserving type relationships. Do not use generics where a union or `unknown` is simpler.

```typescript
// ✅ Do — generic preserves the relationship
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// ❌ Don't — unnecessary generic
function log<T>(value: T): void { console.log(value); }
// ✅ Better
function log(value: unknown): void { console.log(value); }
```

### Constraints (`extends`)

- Use `extends` to constrain generics to a subset of types that have required properties.

```typescript
// ✅ Do
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Default Type Parameters

- Use default type parameters to make generics ergonomic without losing flexibility.

```typescript
// ✅ Do
type ApiResponse<T = unknown> = { data: T; status: number };
```

### Avoiding Over-Generalization

- Do not introduce generics just to make code look reusable. A concrete type that works is better than a generic that confuses.

```typescript
// ❌ Don't
function wrap<T>(value: T): { value: T } { return { value }; }

// ✅ Do — if you only ever wrap strings
function wrapString(value: string): { value: string } { return { value }; }
```

---

## 6. Enums

### `const enum` vs. Regular `enum`

- Avoid `const enum` in library code or projects using `isolatedModules` — it breaks across module boundaries.
- Prefer string union types or `as const` objects over enums in most cases.

### String Enums vs. Numeric Enums

- If you do use an enum, always use string enums. Numeric enums have reverse-mapping behavior that causes subtle bugs.

```typescript
// ✅ Do
enum Status {
  Active = "active",
  Inactive = "inactive",
}

// ❌ Don't
enum Status { Active, Inactive } // numeric, fragile to reordering
```

### Alternatives to Enums (`as const` + Union)

- Prefer `as const` objects with an inferred union type. They serialize correctly, work with `isolatedModules`, and are easier to iterate.

```typescript
// ✅ Do
const Status = {
  Active: "active",
  Inactive: "inactive",
} as const;

type Status = typeof Status[keyof typeof Status]; // "active" | "inactive"
```

---

## 7. Functions

### Return Type Annotations

- Always annotate return types on exported functions and class methods. Omit them for trivial private helpers where inference is unambiguous.

```typescript
// ✅ Do
export function formatDate(date: Date): string { ... }

// ❌ Don't
export function formatDate(date: Date) { ... } // implicit return type leaks changes silently
```

### Optional and Default Parameters

- Use default parameters instead of checking for `undefined` inside the body.

```typescript
// ✅ Do
function createUser(name: string, role: string = "viewer"): User { ... }

// ❌ Don't
function createUser(name: string, role?: string): User {
  const actualRole = role ?? "viewer";
  ...
}
```

### Rest Parameters and Tuples

- Type rest parameters explicitly. Use labeled tuples for readability.

```typescript
// ✅ Do
function merge<T>(...objects: T[]): T { return Object.assign({}, ...objects); }

type Range = [start: number, end: number];
```

### Overloads

- Use function overloads to describe multiple valid call signatures. Keep the implementation signature unexported.

```typescript
// ✅ Do
function parse(input: string): number;
function parse(input: number): string;
function parse(input: string | number): number | string {
  return typeof input === "string" ? parseInt(input, 10) : String(input);
}
```

### `void` vs. `undefined` Return Types

- Use `void` when the caller must not use the return value. Use `undefined` when you explicitly return `undefined` and callers may check it.

```typescript
// ✅ Do
function logError(error: Error): void { console.error(error); }
function findIndex(arr: number[], val: number): number | undefined { ... }
```

### Arrow Functions vs. Function Declarations

- Use `function` declarations for top-level named functions (hoisted, easier to stack-trace).
- Use arrow functions for callbacks, closures, and class property methods.

```typescript
// ✅ Do
export function processOrder(order: Order): void { ... }
const sorted = items.sort((a, b) => a.price - b.price);
```

---

## 8. Modules and Imports

### Import Ordering

Order imports in the following groups, separated by a blank line:

1. Node built-ins
2. External packages
3. Internal absolute paths (aliases)
4. Relative imports

```typescript
// ✅ Do
import path from "node:path";

import { z } from "zod";

import { UserRepository } from "@/repositories/user-repository";

import { formatDate } from "./utils";
```

### Barrel Files (`index.ts`)

- Use barrel files only at the boundary of a module/feature to define its public API.
- Do not create deep barrel chains that re-export everything — they slow down bundlers and hide dependencies.

```typescript
// ✅ Do — src/users/index.ts
export { UserRepository } from "./user-repository";
export type { User } from "./user.types";
```

### Re-exports

- Use named re-exports. Avoid wildcard re-exports (`export * from`) as they obscure the public surface.

```typescript
// ❌ Don't
export * from "./user-repository";

// ✅ Do
export { UserRepository } from "./user-repository";
```

### Path Aliases

- Configure path aliases in `tsconfig.json` and use them for cross-feature imports. Use relative paths only within the same feature folder.

```json
{ "paths": { "@/*": ["./src/*"] } }
```

### Circular Dependency Avoidance

- Never create circular imports. Structure modules so dependencies flow in one direction: `utils → domain → services → controllers`.

---

## 9. Async and Error Handling

### `async`/`await` vs. Promises

- Always use `async`/`await`. Avoid `.then()/.catch()` chains except at the outermost call site.

```typescript
// ✅ Do
async function getUser(id: string): Promise<User> {
  const user = await db.findById(id);
  return user;
}

// ❌ Don't
function getUser(id: string): Promise<User> {
  return db.findById(id).then(user => user);
}
```

### Typed Error Handling Patterns

- Wrap operations that can fail in a `try/catch`. Type the caught value as `unknown` and narrow it.

```typescript
// ✅ Do
try {
  await riskyOperation();
} catch (err: unknown) {
  if (err instanceof AppError) handleAppError(err);
  else throw err;
}

// ❌ Don't
} catch (err) {
  console.log(err.message); // err is any — unsafe
}
```

### `Result` / `Either` Patterns

- For expected failure cases (validation, not-found), return a `Result` type instead of throwing.

```typescript
// ✅ Do
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function findUser(id: string): Promise<Result<User, "NOT_FOUND">> {
  const user = await db.findById(id);
  if (!user) return { ok: false, error: "NOT_FOUND" };
  return { ok: true, value: user };
}
```

### Error Class Conventions

- Extend `Error` for custom errors. Always set `this.name` and call `super(message)`.

```typescript
// ✅ Do
class ValidationError extends Error {
  readonly name = "ValidationError";
  constructor(
    message: string,
    public readonly field: string,
  ) {
    super(message);
  }
}
```

### Never Swallowing Errors Silently

- Never catch an error and do nothing. At minimum, re-throw or log.

```typescript
// ❌ Don't
try { await op(); } catch { /* silent */ }

// ✅ Do
try { await op(); } catch (err: unknown) { logger.error(err); throw err; }
```

---

## 10. Null and Undefined

### Nullish Coalescing (`??`) and Optional Chaining (`?.`)

- Use `??` to provide defaults for `null | undefined`. Do not use `||` — it also swallows `0`, `""`, and `false`.
- Use `?.` to safely traverse nullable chains.

```typescript
// ✅ Do
const name = user?.profile?.name ?? "Anonymous";
const port = config.port ?? 3000;

// ❌ Don't
const port = config.port || 3000; // falsy on port 0
```

### When to Allow `null` vs. `undefined`

- Use `undefined` for optional properties and missing values (aligns with TypeScript's optional `?` syntax).
- Use `null` only when interfacing with APIs or databases that return `null` explicitly.
- Do not mix both in the same domain — pick one convention and stick to it.

### Non-Null Assertion Operator (`!`) Rules

- Treat `!` as a last resort. Use it only when you have proof the value cannot be null/undefined that the type system cannot express. Add a comment explaining why.
- Never use `!` to silence a `strictNullChecks` error you have not actually reasoned about.

```typescript
// ✅ Do — justified with comment
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// We control the HTML and this element is always present on this page.

// ❌ Don't
const canvas = document.getElementById("canvas")!; // hides a potential null
```

---

## 11. Objects and Arrays

### Immutability

- Mark object properties `readonly` when they must not change after construction.
- Use `as const` for static lookup objects and configuration.
- Use `Readonly<T>` and `ReadonlyArray<T>` in function signatures to signal you do not mutate inputs.

```typescript
// ✅ Do
const CONFIG = { timeout: 5000, retries: 3 } as const;
function process(items: ReadonlyArray<Item>): void { ... }
```

### Destructuring Conventions

- Destructure at the top of a function for readability. Avoid destructuring deeply nested objects inline — create an intermediate variable.

```typescript
// ✅ Do
function greet({ name, role }: User): string {
  return `Hello ${name}, you are a ${role}`;
}

// ❌ Don't
function greet(user: User): string {
  return `Hello ${user.name}, you are a ${user.role}`;
}
```

### Spread Usage Rules

- Use spread for shallow clones and merging. Never use spread where mutation is required (it creates a copy).
- Do not use spread to pass large objects — be explicit about what you need.

```typescript
// ✅ Do
const updated = { ...user, name: "Alice" };

// ❌ Don't
updateUser({ ...entireGiantObject }); // pass only what is needed
```

---

## 12. Comments and Documentation

### JSDoc Usage Rules

- Document all exported functions, classes, and types that are not self-explanatory.
- Use `@param`, `@returns`, and `@throws` tags. Keep prose short.

```typescript
// ✅ Do
/**
 * Fetches a user by ID. Returns null if not found.
 * @throws {DatabaseError} if the query fails
 */
export async function findUser(id: UserId): Promise<User | null> { ... }
```

### Inline Comment Standards

- Write comments that explain **why**, not **what**. If the code is clear, no comment is needed.

```typescript
// ✅ Do
// Retry up to 3 times to handle transient network errors from the payment gateway.
for (let i = 0; i < 3; i++) { ... }

// ❌ Don't
// Loop 3 times
for (let i = 0; i < 3; i++) { ... }
```

### `@deprecated` and `@internal` Tags

- Mark deprecated exports with `@deprecated` and a migration note.
- Mark internal helpers with `@internal` so tooling and humans know not to rely on them.

```typescript
/** @deprecated Use `findUserById` instead. Will be removed in v3. */
export function getUser(id: string): Promise<User> { ... }
```

### Avoiding Self-Evident Comments

- Do not comment code that reads like English already. Every comment must add information the code itself cannot convey.

```typescript
// ❌ Don't
// Increment i by 1
i++;

// ❌ Don't
// Return the user
return user;
```

---

## 13. File and Project Structure

### File Naming and Casing

- All files use `kebab-case`: `user-service.ts`, `create-order.handler.ts`.
- Test files mirror the source file with a `.test.ts` or `.spec.ts` suffix: `user-service.test.ts`.

### Folder Organization

- Organize by feature/domain, not by type. Avoid flat `controllers/`, `services/`, `models/` directories at the top level.

```
src/
  users/
    user.types.ts
    user-repository.ts
    user-service.ts
    user.test.ts
    index.ts
  orders/
    ...
```

### Module Boundaries

- Each feature folder owns its domain. Cross-feature access goes through the public `index.ts`. No feature directly imports from another feature's internals.

### Co-location Rules

- Keep tests, types, and helpers next to the code they support. Do not have a top-level `__tests__` folder — tests live beside their source.

---

## 14. Formatting and Style

### Indentation and Spacing

- 2 spaces. No tabs.

### Semicolons

- Always use semicolons.

### Quotes

- Single quotes for strings. Template literals only when interpolating.

```typescript
// ✅ Do
const name = 'Alice';
const greeting = `Hello, ${name}`;
```

### Trailing Commas

- Use trailing commas on multi-line objects, arrays, function parameters, and generics (`"trailingComma": "all"` in Prettier).

```typescript
// ✅ Do
const user = {
  id: '1',
  name: 'Alice',
};
```

### Line Length Limits

- 100 characters maximum per line.

### Prettier / ESLint Configuration

- Prettier handles all formatting — no manual style debates. ESLint handles correctness rules.
- Do not disable ESLint rules inline without a comment explaining why.

```typescript
// ✅ Do
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- wrapping untyped legacy SDK
const sdk: any = legacyInit();
```

---

## 15. Testing Conventions

### Type-Safe Test Utilities

- Use typed factory functions to create test fixtures. Avoid raw object literals spread across tests — they break silently when types change.

```typescript
// ✅ Do
function buildUser(overrides: Partial<User> = {}): User {
  return { id: 'test-id', name: 'Alice', role: 'viewer', ...overrides };
}

const user = buildUser({ role: 'admin' });
```

### Mocking Typed Dependencies

- Use typed mocks. When mocking a class or interface, use a cast through `as` only after ensuring all required methods are present.

```typescript
// ✅ Do
const mockRepo: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
};
```

### Asserting Types in Tests

- Use `expectTypeOf` (via `vitest`) or `tsd` to assert type-level correctness in addition to runtime behavior.

```typescript
// ✅ Do
import { expectTypeOf } from 'vitest';

expectTypeOf(findUser('1')).toEqualTypeOf<Promise<User | null>>();
```
