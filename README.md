# Video Browser
What if you could publish video to the world as easily as you can create a new podcast?
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## WebOS
Quirks of developing on LG's WebOS TVs.

### Emulator
"Simple" apps actually run on the `file://` protocol in the emulator. To make things even more interesting, they are run directly out of your filesystem at the path you started the emulator from. That makes domain-relative URLs weird. Instead of `/` resolving to the root of your app, it resolves to the _root of your local filesystem_. I've used `assetPrefix` and `basePrefix` in [next.config.js](next.config.js) to adjust internal paths appropriately.

Simple apps operate in a less restrictive security context than a regular browser app. For instance, CORS headers are not required for cross-domain `fetch` requests in the emulator.

### Real Devices
Domain-relative URLs (e.g. `"/root-level-doc.html"`) cause the app to crash. Relative URLs are not a problem. Also, routing to the top of a directory does not automatically get resolved to `index.html`; be sure to include that explicitly if that is the intent.

## NextJS

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Licenses
The Silkscreen font is available under the SIL Open Font License:
```
Copyright 2001 The Silkscreen Project Authors (https://github.com/googlefonts/silkscreen)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL
```
