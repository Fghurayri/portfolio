---
title: "How to Deploy Sveltekit on Heroku"
date: "2021-07-22"
slug: "deploy-sveltekit-on-heroku"
metaDesc: "How to deploy Sveltekit on Heroku using the Node adapter."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1626943532/faisal.sh/deploy-sveltekit-on-heroku/cover.webp"
---

<script context="module">
  export const prerender = true;
</script>

![Gatlinburg, TN, USA](https://res.cloudinary.com/fghurayri/image/upload/v1626943532/faisal.sh/deploy-sveltekit-on-heroku/cover.webp)

[Sveltekit](https://kit.svelte.dev/) is a framework for building Svelte apps. It has an unopinionated approach for production deployment through **_adapters_** for different deployment targets/platforms. I found it pretty intuitive to deploy to Heroku by using the [Node adapter](https://github.com/sveltejs/kit/tree/master/packages/adapter-node).

To deploy a Sveltekit app to Heroku, you need to do the following:

First, install the adapter as a dev dependency:

```sh
npm i -D @sveltejs/adapter-node@next
```

Next, to help Heroku in running the app after it builds it, add a `start` command to the `package.json` file:

```diff
  "scripts": {
    "dev": "svelte-kit dev",
    "build": "svelte-kit build",
    "preview": "svelte-kit preview",
+   "start": "node build/index.js",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "prettier --check --plugin-search-dir=. . && eslint --ignore-path .gitignore .",
    "format": "prettier --write --plugin-search-dir=. ."
  },
```

Finally, in the `svelte.config.js` file, use the node adapter and configure the port to read from Heroku's environment port: (delete the `|` from the `process|.env.port`)

```diff
+ import node from "@sveltejs/adapter-node";
  import preprocess from "svelte-preprocess";

  /** @type {import('@sveltejs/kit').Config} */
  const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: preprocess(),

    kit: {
      // hydrate the <div id="svelte"> element in src/app.html
      target: "#svelte",
+     adapter: node({ env: { port: process|.env.PORT } }),
    },
  };

  export default config;
```

That's all!
