# Video Browser
What if you could publish video to the world as easily as you can create a new podcast?

## Getting Started
It's easiest to get started with your desktop browser of choice rather than a TV simulator or device.
We use NextJS to create an ergonomic environment for basic development.
Run the development server to check it out:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you have changes in mind, you want to familiarize yourself with the `components/` directory.
Unlike a typical NextJS app, all navigation is done client-side through a custom router defined in `components/vlink.js`.
You can find out more in #Developing.

To see how the app behaves in an environment closer to a real TV, you need to [install the WebOS tools](https://webostv.developer.lge.com/develop/getting-started/developer-workflow).
One of those tools is [the WebOS simulator](https://webostv.developer.lge.com/develop/tools/simulator-introduction).
With it installed, you can use `npm` to launch it and see the app in a more representative environment:

```bash
npm run webos
```

## Developing
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
It is currently supported on LG/WebOS TVs and deployed as a [basic web app](https://webostv.developer.lge.com/develop/getting-started/web-app-types#basic-web-app).
That means there's no service component and all assets have to be bundled up in the package that run on a TV.

The router used by `vlink` requires a map of paths to Components sourced from `components/component-map.js`.
That file is re-generated every time you run `npm run dev` or `npm run webos`.
**If you are adding a new Component that will be a navigation target, you have to re-run one of those build targets for it to show up**

## WebOS
Quirks of developing on LG's WebOS TVs.

### Emulator
"Simple" apps actually run on the `file://` protocol in the emulator. To make things even more interesting, they are run directly out of your filesystem at the path you started the emulator from. That makes domain-relative URLs weird. Instead of `/` resolving to the root of your app, it resolves to the _root of your local filesystem_. I've used a compbination of `assetPrefix` a custom client-side router in `components/vlink.js` to avoid NextJS's routing machinery because it uses domain-relative URLs extensively.

Simple apps operate in a less restrictive security context than a regular browser app. For instance, CORS headers are not required for cross-domain `fetch` requests in the emulator.
You can disable CORS restrictions by selecting `Develop > Disable Cross-Origin Restricions` in Safari.
It's [a little more complicated in Chrome](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome) but doable.

### Real Devices
Domain-relative URLs (e.g. `"/root-level-doc.html"`) cause the app to crash. Relative URLs are not a problem. Also, routing to the top of a directory does not automatically get resolved to `index.html`; be sure to include that explicitly if that is the intent. As long as you're navigating the app through `vlink`s, you shouldn't have to worry about this too much.

## NextJS

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Licenses
The Silkscreen font is available under the SIL Open Font License:
```
Copyright 2001 The Silkscreen Project Authors (https://github.com/googlefonts/silkscreen)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL
```
