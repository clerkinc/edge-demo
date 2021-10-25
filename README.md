# Clerk Authentication at the edge

This demo features authentication at the edge using [Clerk](https://clerk.dev/?utm_source=nextjs&utm_medium=edge-authentication).

## Demo

https://edge.clerk.app/

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-customer-feedback%2Fedge-functions%2Ftree%2Fmain%2Fexamples%2Fclerk-authentication&env=NEXT_PUBLIC_CLERK_FRONTEND_API,CLERK_API_KEY,CLERK_JWT_KEY&project-name=clerk-authentication&repo-name=clerk-authentication)

## Getting Started

You'll need to have an account with [Clerk](https://clerk.dev/?utm_source=nextjs&utm_medium=edge-authentication). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the settings of your Clerk application. It should look something like this (replace the values with your own Clerk's dashboard):

```bash
NEXT_PUBLIC_CLERK_FRONTEND_API=foo.bar.lcl.dev
CLERK_API_KEY=test_lcyh0EbavaYPZBnyUbRBGtSo1dELNxJSLC
CLERK_JWT_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArORRXR/gmiLWsocjb3sJZafaKE59Z7iaQK73c/S27aKaji686LLKPO+c57BThYGKl2obm5gG0q2QFsuxP/QOiHx/YEa+EVkNZBXTA9Er6M8pgzV953ZhLlj8w9PghsNTlmwXB87UJjRZpjZ773X63ykouqao0W9x8fE68R8L59Rv4iLtZ/u4CIx3djPKUF4ebVcK7rAexxvs9WGT+Ds01a1wfCBqcGVo0wA47xg63ym+XqFCTaEExNC1EZycIBq6aXw9fs6XG4x4gRshGV8NgqjKC5ETEJJy0A24lNbX284BcPg6HqOEnQegvhXyWhcRK3EdE3EuoajhV1PpAeJiAwIDAQAB
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```
