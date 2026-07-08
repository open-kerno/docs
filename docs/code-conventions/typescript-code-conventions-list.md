---
sidebar_position: 1
title: TypeScript Code Conventions
description: Section outline for TypeScript code conventions — naming, types, strict mode, generics, async patterns, and project structure standards.
tags: [standards, typescript, conventions, code-style]
---


# TypeScript Code Conventions — Section Outline

1. **Naming Conventions**
   - Variables and constants
   - Functions and methods
   - Classes and constructors
   - Interfaces and types
   - Enums and enum members
   - Generic type parameters
   - Files and modules

2. **Type System**
   - Type vs. interface
   - Explicit vs. inferred types
   - Union and intersection types
   - Literal types
   - Template literal types
   - Utility types (`Partial`, `Pick`, `Omit`, etc.)
   - `unknown` vs. `any` vs. `never`
   - Type assertions and casting
   - Type guards and narrowing
   - Branded / nominal types

3. **Strict Mode**
   - Required `tsconfig` flags
   - `strictNullChecks` rules
   - `noUncheckedIndexedAccess`
   - `exactOptionalPropertyTypes`

4. **Interfaces and Classes**
   - When to use a class vs. a plain object
   - Access modifiers (`public`, `private`, `protected`, `readonly`)
   - Abstract classes
   - Implementing interfaces
   - Constructor patterns

5. **Generics**
   - When to use generics
   - Constraints (`extends`)
   - Default type parameters
   - Avoiding over-generalization

6. **Enums**
   - `const enum` vs. regular `enum`
   - String enums vs. numeric enums
   - Alternatives to enums (union types, `as const`)

7. **Functions**
   - Return type annotations
   - Optional and default parameters
   - Rest parameters and tuples
   - Overloads
   - `void` vs. `undefined` return types
   - Arrow functions vs. function declarations

8. **Modules and Imports**
   - Import ordering
   - Barrel files (`index.ts`)
   - Re-exports
   - Path aliases
   - Circular dependency avoidance

9. **Async and Error Handling**
   - `async`/`await` vs. Promises
   - Typed error handling patterns
   - `Result` / `Either` patterns
   - Error class conventions
   - Never swallowing errors silently

10. **Null and Undefined**
    - Nullish coalescing (`??`) and optional chaining (`?.`)
    - When to allow `null` vs. `undefined`
    - Non-null assertion operator (`!`) rules

11. **Objects and Arrays**
    - Immutability (`readonly`, `as const`, `Readonly<T>`)
    - Destructuring conventions
    - Spread usage rules

12. **Comments and Documentation**
    - JSDoc usage rules
    - Inline comment standards
    - `@deprecated` and `@internal` tags
    - Avoiding self-evident comments

13. **File and Project Structure**
    - File naming and casing
    - Folder organization
    - Module boundaries
    - Co-location rules

14. **Formatting and Style**
    - Indentation and spacing
    - Semicolons
    - Quotes (single vs. double)
    - Trailing commas
    - Line length limits
    - Prettier / ESLint configuration

15. **Testing Conventions**
    - Type-safe test utilities
    - Mocking typed dependencies
    - Asserting types in tests
