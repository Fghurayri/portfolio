---
title: "SSR Streaming is The Future Web Experience"
date: "2021-07-28"
slug: "ssr-streaming-is-the-future"
metaDesc: "I explain SSR Streaming and discuss why I think it is the future web experience."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1627334209/faisal.sh/ssr-streaming-is-the-future/stairs.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Momo Staircase, Vatican Museums in the Vatican City State](https://res.cloudinary.com/fghurayri/image/upload/v1627334209/faisal.sh/ssr-streaming-is-the-future/stairs.jpg)

# How The Web Evolved in The Last 20 Years

Whenever the server-side rendering (SSR) topic is brought up, you probably agree with how the web dev community has made a 360-degree turn in the last few years. But did they?

When you describe the conventional web development workflow before 20 years, you can safely assume running the LAMP stack and adding sprinkles of JavaScript in the client by using jQuery would be the standard. If you wanted to up your user experience game, you would add AJAX to fetch stuff client-side. A server was behind rendering every page.

Such tooling worked wonderfully until newer innovations started uncovering shortcomings in specific use cases that required highly interactive client-side experiences.

Enter the era of single-page applications (SPAs). Frameworks and libraries like Angular, React, and Vue started attracting more JS developers, popularizing the client/server model, and allowing teams to scale with separate frontend and backend teams.

Then, you guessed it, newer shortcomings for specific use cases like SEO started showing. Moreover, the folks who started their careers learning jQuery and running the LAMP stack started reminiscing about the good ol' days - when the web was more straightforward with fewer broken URLs and more reliable browser back button/history API.

Enter the era of SSR using the SPA primitives - server-side rendering single-page applications. It looks similar to what folks have been doing before 20 years. However, one subtle change is the newly added marginal utility of picking and choosing between different approaches that cater to a specific page. Thanks to Next JS, Nuxt, and SvelteKit, it is not uncommon to have SPA-like experience, SSR, and static experience in the same web app.

So, other than the increased complexity around tooling, deployment, debugging, and other engineering activities, what is the latest _pressing_ shortcomings that we need to solve and how to go about them?

# Classic Example - eCommerce Website

![eCommerce Website](https://res.cloudinary.com/fghurayri/image/upload/v1627343679/faisal.sh/ssr-streaming-is-the-future/ecommerce.png)

Let's take an eCommerce web app as an example. We can safely generalize the above layout for the `/products` URL in an online store. There are static areas on the page, which contain the header and the list of signature products, and other dynamic parts like the list of latest products.

![Timeline for how SPA works](https://res.cloudinary.com/fghurayri/image/upload/v1627336001/faisal.sh/ssr-streaming-is-the-future/spa.png)

SPAs are great for rich and interactive user experiences but not that good for SEO. For example, when the user or the SEO crawler navigates to this page, they will receive a bundle that contains everything but nothing.

To be more precise, the bundle will have the JavaScript needed to build the page. The browser will render the static areas directly, but the dynamic parts will trigger the fetch request to get the latest products. The user's browser will execute all of this JavaScript, but the SEO crawler would not - no SEO for you!

![Timeline for how SSR works](https://res.cloudinary.com/fghurayri/image/upload/v1627336478/faisal.sh/ssr-streaming-is-the-future/ssr.png)

On the other hand, SSR is better for SEO. Following the previous example, both the user and the SEO crawler will see the products when they visit the page immediately. However, _immediately_ is the new **pressing** shortcoming here.

If you squint your eyes at the above picture, you can see that the server is being honest by waiting for the DB to return the list of products before sending the whole thing to the client. However, the `/products` page contains other static information that is useful and actionable by the user, like the header and the list of signature products. These areas need to wait until the DB returns the data so the server can bake everything together and send it to the client.

The magnitude of the problem exponentially increases when you add other dynamic areas to the page. You have to fetch everything before you can show anything.

What if we can ask the server to send those static/known parts of the page, and using the same established TCP connection, we somehow get the list of the products from the DB once they become available. In other words, how about _we render as we fetch_?

# SSR Streaming

Here comes one of the most highly anticipated features of React 18 - SSR streaming. Following the above example, the server will render all static areas of the page and send it to the client _really immediatly_ and **stream** the dynamic data.

The result is a faster user experience and improved SEO.

This concept is already available and can get used in production for a few frameworks like [Vue](https://ssr.vuejs.org/guide/streaming.html) and [Solid](https://www.solidjs.com/docs/latest/api#pipetonodewritable). If you are intrested, I suggest reading [this general guide](https://www.patterns.dev/posts/ssr/) to learn more about the topic. For React's vision in specific, I recommend [this read](https://github.com/reactwg/react-18/discussions/37) by Dan Abramov
