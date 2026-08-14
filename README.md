# Express Boilerplate

## Tech Stack

- express
- prisma
- debug
- mysql
- multer
- morgan
- jsonwebtoken
- yup

## Features

- Native ES Modules
- Import alias

## Requirements

- Node.js LTS
- PNPM latest

## Setup

Install dependencies and generate Prisma Client before starting the server:

```sh
pnpm install
pnpm generate
pnpm start
```

Prisma 7 no longer generates the client or runs seed data automatically during
migrations. Regenerate the client after schema changes and run seeds explicitly:

```sh
pnpm generate
pnpm seed
```
