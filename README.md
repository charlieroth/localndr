# `localndr`

Experimental local-first calendar

## Roadmap

- [ ] Pages
  - [ ] Day
  - [ ] Individual Event
  - [ ] Week
  - [ ] Month
- [ ] CRUD calendar events
- [ ] Export Single Calendar to ICS file
- [ ] Import single calendar from ICS file
- [ ] Multiple calendar support
- [ ] Export one or more calendars to ICS file

## Technical Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn](https://ui.shadcn.com/)
- [Electric SQL](https://electric-sql.com/)

## Setup

Start the backend services using Docker Compose:

```bash
pnpm backend:up
```

Start the write path server:

```bash
pnpm run write-server
```

Start the dev server:

```bash
pnpm dev
```

When done, stop the backend services:

```bash
pnpm backend:down
```

## Current State

![Application Screenshot](./images/screenshot.png)