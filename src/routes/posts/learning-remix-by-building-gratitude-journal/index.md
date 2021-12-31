---
title: "Learning Remix by Building a Gratitude Journal"
date: "2021-12-31"
slug: "learning-remix-by-building-gratitude-journal"
metaDesc: "I share my experience in learning Remix by building a gratitude journal using TypeScript and Prisma with mnemonic-based authentication."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1640855700/faisal.sh/learning-remix-by-building-gratitude-journal/nye4vgtde5ppgcr6ibxo.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Remix 💿](https://res.cloudinary.com/fghurayri/image/upload/v1640855700/faisal.sh/learning-remix-by-building-gratitude-journal/nye4vgtde5ppgcr6ibxo.jpg)

React has surpassed jQuery in StackOverflow's 2021 survey as the most commonly used web framework. Regardless of how realistic such information is, no one can deny the dominant momentum for React among new learners and experienced front-end engineers.

> TL;DR - Thanks to how approachable and solidly fundamental Remix is, I would choose it to teach beginners how to build full-stack applications for the Web using React, TypeScript, and Prisma.

Remix 💿 is the latest addition to the list of React web frameworks. What is outstanding for me is how [Ryan](https://twitter.com/ryanflorence) and [Michael](https://twitter.com/mjackson) took React, the _liberal SPA DIY tool_ that expects you to define everything about your project, and sprinkled a lot of **fundamentally** reasonable opinions to boost your productivity from the get-go.

## Building &nbsp; `Thankful` &nbsp; using Remix

I decided to learn Remix by building [Thankful - Gratitude Journal](https://github.com/Fghurayri/thankful), a trivial CRUD application using Prisma and PostgreSQL with mnemonic-based authentication.

Such minimal scope allowed me to taste the philosophy behind most technical decisions. I will share all my learnings and impressions in this post.

### Up and Running

![npx create-remix@latest](https://res.cloudinary.com/fghurayri/image/upload/v1640870222/faisal.sh/learning-remix-by-building-gratitude-journal/wfnunjgxqm1ns4j3r3vc.png)

When you create a new project using Remix, you will be greeted by the nerdy CLI, asking a few questions to initialize your project. Since Remix is a platform-agnostic serverless web framework, you are required to select where you prefer to deploy your web application.

Currently, the supported targets include Cloudflare workers/pages, Vercel, Netlify, and AWS using the Architect serverless framework.

After completing the onboarding wizard, the CLI will make the proper scaffolding for your project, including a specialized `README.md` file.

In summary, there is almost no friction to get up and running.

### Routing

![Remix Routing](https://res.cloudinary.com/fghurayri/image/upload/v1640871093/faisal.sh/learning-remix-by-building-gratitude-journal/yyv1zi2qoqjvhdjmyfls.png)

In Remix, every file under the `/app/routes` folder is considered a route. One subtly excellent opinion is that - every route can be a page route, an endpoint route, or both. The deciding factor is what you are exporting in each route.

To display a page, you need to export a _default_ function that returns a React component.

To expose a GET endpoint, you export a `loader` function that receives the web request and returns the web response.

To expose other endpoints like POST, PATCH, and DELETE, you export an `action` function with the same request/response types as the `loader` function. You can `switch` on such a request to serve the proper HTTP verb.

Such routing opinion means having your UI code **AND** your server code in the same file. In other words, you don't have to maintain another folder tree with several files for your APIs. Moreover, you don't have to export a large object to map route keys with API URLs.

Moreover, Remix supports nested layouts as a first-class citizen. I built the app with a shared navigation component, which is always mounted during page navigation.

### Styling

To add a CSS file to a page, you need to export a `links` function that returns a list of objects where each object has a `rel` and `href` keys with the corresponding values.

In the web world, links mean caching opportunities!

> _When the route is active, the stylesheet is added to the page. When the route is no longer active, the stylesheet is removed._

I like Tailwind, and I found the related docs very clear and easy to follow. In a nutshell, you need to install the Tailwind CLI and then use `concurrently` to run both the Remix CLI and the Tailwind CLI.

### ENV Variables

Again, I found the documentation and the approach for handling the environment variables reasonable.

In summary, you only need to take care of _setting up_ how to consume the environment variables in the **Development** environment:

- Install the `dotenv` library into the dev dependencies.
- Create `.env` file and gitignore it.
- Tweak the `npm run dev` script to utilize this new setup.

There is no need to change the application code to handle consuming the environment variables between different environments like dev or production.

Moreover, to expose browser-side environment variables like `PUBLIC_API_KEY`, you can use the `loader` function to return the value of such an environment variable. Then, you read that value in the root component's `useLoaderData` . Finally, you add it to the `window` object so you can read it anywhere in your application.

### Authentication

I started building the authentication solution with a conventional username and password approach. I introduced a way to sign-in, sign-up, and reset password.

However, after seeing how already _compact_ the produced code is, I had an irresistible appetite to go even further and refactor into a minimalistic mnemonic-based approach with a single check-in route and logic.

```ts
export async function checkIn(mnemonic: string) {
  const hashedMnemonic = hash(mnemonic);
  await ensureUserByMnemonicExists(hashedMnemonic);
  const session = await getSession();
  session.set(COOKIE_KEY, hashedMnemonic);
  return redirect(APP_ROUTE, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
```

To decide whether a user is supposed to have a valid session when they visit a route, I created a function that reads the cookie, extracts the mnemonic, and checks the validity. Such procedure is done via a one-liner `if` condition in the `loader` or the `action` functions.

```ts
export const loader: LoaderFunction = async ({ request }) => {
  if (await isAlreadySignedIn(request)) return redirect(APP_ROUTE);
  return {};
};
```

The API for handling auth/session is remarkably teachable and small.

### Deploying to Production

![Vercel](https://res.cloudinary.com/fghurayri/image/upload/v1640947045/faisal.sh/learning-remix-by-building-gratitude-journal/ohyla97guqdotgqv0gkf.png)

Finally, I used Vercel to deploy the project. Vercel has built-in detection for Remix applications, and the experience was a seamless push-to-deploy approach.

I am sure other targets should be straightforward, thanks to the excellent documentation from the team.

## Final Remarks

Remix is still in the v1.0 phase. What is already achieved is very impressive!

I remember following my first React tutorial when the author explains how to make forms submission. What is still notable for me is how you need to `e.preventDefaults()` as soon as possible. The reason is to sideline the _platform_ to do your job in a _SPA_ way.

Such deviation from the platform requires you to compensate for what is missing. For example, you need to serialize the form, prevent double submissions, show a spinner, and handle the response. All this additional code is a liability.

Moreover, the SPA approach takes for granted that the user has JavaScript enabled. But does [everyone has JavaScript?](https://kryogenix.org/code/browser/everyonehasjs.html)

The nice thing for me about Remix is following the _progressive_ approach to developing web applications. The developer gets to author React code, and the user gets to enjoy a _native_ web experience, even without having JavaScript enabled.

I decided to see how much mileage I would get in my project without using core React features or reaching for the standard external libraries. I found that I can develop _everything_ without a single hook or even go for external state management like react-query or Zustand.

Not only that, but I found myself learning more about fundamentals, like how to use the `FormData` API, a native Browser API, to read user inputs on the server.

Finally, like any software, I found a few rough edges. I posted them to the discussion section in [the Github repo](https://github.com/remix-run/remix/discussions/1298). I am waiting for the team's confirmation before opening a new issue.

In summary, just like how learning React has made me a better JavaScript developer, I feel learning Remix makes me a better Web developer.
