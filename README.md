<h1 align="center">
  <code>@open-kerno/docs</code>
</h1>

<p align="center">
  The global documentation website and <strong>Engineering Standards</strong> reference for the open-kerno ecosystem.
</p>

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Security & Authentication](#security--authentication)
3. [API & Architecture](#api--architecture)
4. [Data Formats & Internationalization](#data-formats--internationalization)
5. [Database & Storage](#database--storage)
6. [CI/CD & Operations](#cicd--operations)
7. [How to Contribute](#how-to-contribute)

---

## Getting Started

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

Starts a local development server and opens a browser window. Most changes are reflected live without restarting.

### Build

```bash
npm run build
```

Generates static content into the `build/` directory, ready to be served by any static hosting service.

### Deployment

```bash
# With SSH
USE_SSH=true npm run deploy

# Without SSH
GIT_USER=<your-github-username> npm run deploy
```

---

## Security & Authentication

### Auth & Authorization

- **Protocols:** JWT, OAuth 2.0, or SAML only.
- **Authorization model:** Role-Based Access Control (RBAC) with the Principle of Least Privilege.
- **Enforcement:** All permission checks must be validated **server-side**; never trust client-asserted roles.

### Token Storage

> **Critical:** Never store JWTs or session IDs in `localStorage` or `sessionStorage`. These are vulnerable to XSS attacks.

Tokens must be stored in cookies with the following flags set:

```http
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict
```

### Encryption Standards

| Concern | Required | Forbidden |
|---|---|---|
| Data at rest | AES-256 | DES, 3DES, MD5, SHA-1 |
| Data in transit | TLS 1.2+ | Unencrypted HTTP for sensitive data |

> **Warning:** MD5 and SHA-1 are cryptographically broken. Any use of these algorithms in new code will be rejected in review.

### CORS

- **No wildcard origins (`*`) in production.**
- Explicitly whitelist allowed origins.
- `Access-Control-Allow-Credentials: true` may only be set for explicitly trusted, whitelisted origins.

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

### Secrets Management

> **Critical:** Hardcoded credentials are never permitted — not in source code, Dockerfiles, CI config, or comments.

- All secrets must be stored and retrieved via a vault manager:
  - **AWS:** AWS Secrets Manager
  - **Self-hosted / multi-cloud:** HashiCorp Vault
- Rotate secrets on a schedule; treat leaked secrets as compromised immediately.

### Injection Prevention

- Use **parameterized queries** or ORM-provided sanitization for all database interactions.
- Raw string query concatenation with user input is never permitted.
- Validate and sanitize all input at system boundaries (API entry points, webhook handlers).

```python
# Correct
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Forbidden
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

### Rate Limiting & Brute-Force Protection

- **Login endpoints:** Rate-limit aggressively to prevent credential stuffing and brute-force attacks.
- **Checkout / payment endpoints:** Apply rate limiting and fraud heuristics.
- Define maximum retry thresholds; lock accounts or require CAPTCHA after threshold is exceeded.

### Credit Card PAN (ISO/IEC 7813)

- Adhere to standard PAN structural lengths (13–19 digits).
- **Never log or persist raw PAN data.** Use tokenization (e.g., via your payment processor).
- Display only last 4 digits to end users.

---

## API & Architecture

### Endpoint Versioning

All API endpoints **must** include a version prefix. Breaking changes require a new version.

```
GET /v1/users
GET /v2/users          # new version for breaking changes
POST /v1/orders
```

### URL Structure

- Use lowercase, hyphen-separated path segments (`/v1/user-profiles`, not `/v1/userProfiles`).
- Resources are plural nouns (`/users`, `/orders`).
- Nested resources reflect ownership (`/v1/users/{userId}/orders`).

### Pagination

All collection endpoints must support cursor-based or offset pagination. Return a consistent envelope:

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 340,
    "next_cursor": "eyJpZCI6MTAwfQ=="
  }
}
```

### Error Handling

All errors must return a unified JSON payload. **Stack traces, database schemas, and internal service details must never be exposed in production responses.**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The field 'email' is required.",
    "request_id": "req_abc123"
  }
}
```

| HTTP Status | Usage |
|---|---|
| `400` | Client validation error |
| `401` | Unauthenticated |
| `403` | Unauthorized (authenticated but no permission) |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error (log detail server-side only) |

### Logging

- **Format:** Structured JSON only — no plain-text log lines in production.
- **Levels:** `DEBUG`, `INFO`, `WARN`, `ERROR` (use consistently; no ad-hoc strings).
- **PII masking:** Email addresses, phone numbers, names, and payment data must be masked or omitted from all logs.

```json
{
  "level": "INFO",
  "timestamp": "2024-11-01T14:32:00Z",
  "service": "order-service",
  "message": "Order placed",
  "order_id": "ord_xyz789",
  "user_id": "usr_abc123"
}
```

---

## Data Formats & Internationalization

### Date & Time

- **Storage:** Always UTC.
- **Wire format:** ISO 8601 (`2024-11-01T14:32:00Z`).
- Never store or transmit timestamps as Unix epoch integers in user-facing APIs (use ISO 8601 for readability and unambiguity).

### Phone Numbers

- **Standard:** E.164
- **Format:** `+` followed by country code and number, no spaces or hyphens.
- **Storage type:** `String`

```
+12125551234    ✓
+573001234567   ✓
(212) 555-1234  ✗
```

### Currency & Money

> **Critical:** Never store monetary values as floating-point numbers. Floating-point arithmetic introduces rounding errors that compound over transactions.

- Store as the **smallest currency unit** (e.g., cents for USD, pesos for COP) as a `BIGINT`/`Long`.
- Carry currency code alongside the amount.

```json
{ "amount": 2999, "currency": "USD" }  // $29.99
```

### Locale & Language Standards

| Standard | Format | Example | Use Case |
|---|---|---|---|
| ISO 639-1 | Two-letter lowercase | `es`, `en`, `fr` | Language codes in APIs |
| BCP 47 | Hyphenated | `es-CO`, `en-US` | System locales, `Accept-Language` header |
| Unicode CLDR | Underscore | `es_CO`, `en_US` | Database locale columns, i18n libraries |

### Geographic & Regional Standards

| Standard | Format | Example | Use Case |
|---|---|---|---|
| ISO 3166-1 alpha-2 | Two-letter uppercase | `US`, `CO`, `MX` | Country codes |
| ISO 3166-2 | `{country}-{subdivision}` | `US-NY`, `CO-DC` | State / department codes |
| UN/LOCODE | Five-letter uppercase | `USNYC`, `ESBCN` | Shipping ports, logistics locations |
| ccTLD | Dot-prefixed lowercase | `.co`, `.mx`, `.es` | Domain suffix mapping |

### Media Types (MIME)

- Validate `Content-Type` headers explicitly on all upload and data-exchange endpoints.
- Reject requests with unexpected or missing MIME types.

```
application/json          # REST API payloads
multipart/form-data       # File uploads
image/png, image/jpeg     # Validated image uploads
```

### Product Barcodes

- Use **EAN-13 / GTIN-13** (13-digit format) for all product identifiers.
- Validate check digit on ingest.

---

## Database & Storage

### ID Strategy

| Type | When to use |
|---|---|
| **UUID / GUID** (v4 or v7) | Distributed systems, public-facing IDs, any ID that may be exposed to clients |
| **Auto-incrementing integer** | Internal join tables, high-write throughput tables where sequence matters and IDs are never exposed externally |

> **Rule:** Never expose auto-incrementing integer IDs in public APIs. They leak row counts and invite enumeration attacks. Use UUIDs for all externally visible identifiers.

### Data Deletion

| Strategy | When to use |
|---|---|
| **Soft delete** (`deleted_at` timestamp) | User-generated content, records subject to audit requirements, compliance-regulated data |
| **Hard delete** | Ephemeral data, GDPR/right-to-erasure requests (after audit log is preserved), cache or session records |

- Soft-deleted records must be excluded from all standard queries by default (use a query scope or view).
- Hard deletes for compliance erasure requests must be logged in an immutable audit trail before execution.

### Dependency Security

- **Pin to fixed versions** in all package manifests (`package.json`, `requirements.txt`, `go.mod`).
- **Commit lockfiles** (`package-lock.json`, `poetry.lock`, `go.sum`) to version control.
- `latest`, `*`, or `^`/`~` wildcards are not permitted in production dependency declarations.
- Run automated vulnerability scanning (e.g., `npm audit`, Dependabot, Snyk) in CI on every pull request.

---

## CI/CD & Operations

### Quality Gates

Every pull request targeting `main` must pass all of the following before merge:

| Gate | Requirement |
|---|---|
| Unit & integration tests | **Minimum 80% line coverage** |
| Static analysis | Passing SonarQube scan with no new critical or blocker issues |
| Dependency audit | No known high/critical CVEs in direct dependencies |
| Secrets scan | No credentials or tokens detected in the diff |

### Pipeline Rules

- Gates are enforced automatically; bypassing them requires explicit approval from a Staff Engineer or above, documented in the PR.
- Coverage drops below 80% fail the build even if all tests pass.

---

## How to Contribute

We welcome contributions to both the documentation site and to these engineering standards. The bar for changing a standard is intentionally higher than for documentation fixes.

### Documentation Fixes & Content

1. Fork the repository and create a branch: `docs/<short-description>`.
2. Make your changes and run `npm start` to preview locally.
3. Open a Pull Request with a clear description of what changed and why.
4. A maintainer will review and merge.

### Proposing a New or Changed Standard

Standards changes affect every team. Use one of the two following processes:

#### RFC (Request for Comments) — for exploratory proposals

1. Create a file under `rfcs/YYYY-MM-DD-short-title.md` using the RFC template (see `rfcs/0000-template.md`).
2. Open a Pull Request. The RFC discussion period is **a minimum of 7 days**.
3. Incorporate feedback and update the RFC.
4. A quorum of maintainers approves → the RFC is accepted and the standard is updated.

#### ADR (Architecture Decision Record) — for decisions already made

Use an ADR to document a decision that has been made (e.g., after an RFC is accepted, or for decisions made in the past that need recording).

1. Create a file under `docs/adr/NNNN-short-title.md` using the ADR template (see `docs/adr/0000-template.md`).
2. ADRs are immutable once merged. If a decision is reversed, a new ADR supersedes the old one; the old one is not deleted.
3. Open a Pull Request for review before merging.

### Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add OAuth 2.0 PKCE support
fix(api): correct pagination envelope field name
docs(standards): update ID strategy to prefer UUID v7
```

---

<p align="center">
  <sub>Maintained by the open-kerno engineering team. Standards are living documents — open an RFC if something doesn't fit your use case.</sub>
</p>
