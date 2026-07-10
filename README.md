<h1 align="center">
  <code>@open-kerno/docs</code>
</h1>

<p align="center">
  The global documentation website and <strong>Engineering Standards</strong> reference for the open-kerno ecosystem.
</p>

---

## Getting Started

### Installation

```bash
bun install
```

### Local Development

```bash
bun run start
```

Starts a local development server and opens a browser window. Most changes are reflected live without restarting.

### Build

```bash
bun run build
```

Generates static content into the `build/` directory, ready to be served by any static hosting service.

### Deployment

```bash
# With SSH
USE_SSH=true bun run deploy

# Without SSH
GIT_USER=<your-github-username> bun run deploy
```
