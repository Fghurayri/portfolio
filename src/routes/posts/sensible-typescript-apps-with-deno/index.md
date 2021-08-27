---
title: "Sensible JavaScript/TypeScript Apps With Deno"
date: "2021-08-27"
slug: "sensible-typescript-apps-with-deno"
metaDesc: "Some thoughts about Deno and why I think it is the sensible long-term option when developing apps with TypeScript"
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1630084037/faisal.sh/sensible-typescript-with-deno/deno-logo.png"
---

<script context="module">
  export const prerender = true;
</script>

![Deno](https://res.cloudinary.com/fghurayri/image/upload/v1630084037/faisal.sh/sensible-typescript-with-deno/deno-logo.png)


### Node JS is awesome

It is ignorant to dismiss Node JS. 

Many teams swear by having their full-stack application in one language - JavaScript/TypeScript. Not only that but also thanks to how the runtime is designed, it is relatively easy to author performant asynchronous I/O code like serving web requests and accessing DBs.

Moreover, I attribute the recent influx of developers, startups, and boot camps to Node JS. It is powerful to learn one language and build apps for the web, mobile, desktop, and even TVs and other devices.

> It is beautiful to see the barrier to entry lowered by technology, so folks from different backgrounds can join and collaborate in building software.

### What's wrong with Node JS, then?

In his [talk about the design flaws of Node JS](https://www.youtube.com/watch?v=M3BM9TB-8yA), Ryan Dahl, the creator of Node JS, highlighted his opinions, learnings, and regrets about the framework after it has been out for some time.

I want to draw one of his points to highlight why I, day after day, find it hard to recommend Node JS (even with TypeScript) to deliver maintainable, concurrent, and secure systems.

#### The node_modules bloat

![node_modules is a bloated folder](https://res.cloudinary.com/fghurayri/image/upload/v1630099055/faisal.sh/sensible-typescript-with-deno/node-modules.png)

One of the best features of Node JS is the rich ecosystem of libraries. 

However, when coupled with design flaws in resolving, securing, and integrating these dependencies, such abundance is a recipe for software that is harder to maintain.

All modules must be locally installed and live next to your source code to develop and ship applications. The result is wasted network traffic, bloated disks, and additional complexity when you patch a library to fit your needs.

#### The &nbsp `npm install` &nbsp dilemma

![Richard Feldman showing how insecure is npm install command is](https://res.cloudinary.com/fghurayri/image/upload/v1630101562/faisal.sh/sensible-typescript-with-deno/npm-install.png)

Moreover, there’s a unique dilemma in Node JS around keeping your package.json up to date or not, especially when there is no process for vetting third-party dependencies.

On one hand, you want to keep your software updated to get the latest features, bug fixes, and security patches.

On the other hand, thanks to the natural complexity in software development and how modules can run arbitrary code in your computer and network, you can’t trust authors not introducing breaking changes or new security vulnerabilities.

### How is Deno Different than Node in those two points?

Ryan Dahl built Deno with security in mind. For example, by default, any third-party script will run without access to the file system or the network unless the user gives permission, vastly minimizing the attack vector.

Moreover, installing dependencies is as simple as pasting the URL of the library at the start of your file. A cached version will be saved into your machine and never updated unless the user specifically asks for it.

### Extra Nice Things in Deno

A couple of nice things in Deno compared to Node is the stories around developer experience and production deployment.

To deploy and launch your Deno app, you only need to ship a single executable file, which bundles your whole app. No need for the bloated `build` directory.

TypeScript is a fantastic language to make working with JavaScript saner. It is a first-class citizen in Deno, so you don’t need the whole infrastructure to transpile and compile your code.

![Deno on MDN](https://res.cloudinary.com/fghurayri/image/upload/v1630103792/faisal.sh/sensible-typescript-with-deno/mdn.png)

Moreover, one of the principles of Deno, since it started, is to follow web APIs whenever there's an overlap. So, for example, you can use `window.localStorage` in your server, like [documented](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) in MDN!

Here is a [great video by Surma](https://www.youtube.com/watch?v=SYkzk_j3yb0) published a couple of days ago showcasing Deno.

With the increased maturity thanks to lessons learned in the Node ecosystem, all these reasons make me believe that Deno is becoming a more sensible alternative when developing TypeScript applications.

Finally, I think every technical professional should continually adopt [strong loosely held opinions.](https://medium.com/@ameet/strong-opinions-weakly-held-a-framework-for-thinking-6530d417e364). I built this blog using Node JS because it's a simple personal app with one developer! :D 

