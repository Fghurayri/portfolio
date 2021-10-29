---
title: "How to Solve Port 5000 Denied on Mac OS Monterey"
date: "2021-10-29"
slug: "localhost-access-denied-monterey"
metaDesc: "I share how to debug local networking issues by showing how to solve being denied from port 5000 after upgrading to Mac OS Monterey."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1635523373/faisal.sh/localhost-access-denied-monterey/monterey.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Mac OS Monterey](https://res.cloudinary.com/fghurayri/image/upload/v1635523373/faisal.sh/localhost-access-denied-monterey/monterey.jpg)

> TL;DR - Mac OS Monterey will use port 5000 for [AirPlay](https://developer.apple.com/forums/thread/682332). 

If you are doing full stack web development using different tools, it is sensible that you will use multiple ports simultaneously.

I upgraded my Mac OS to Monterey while working on a Phoenix API on port `4000` and a Svelte SPA on port `5000`. After the OS upgrade is done, I was denied access to my SPA app. I felt personally attacked by being kicked out from my localhost!

![Access Denied](https://res.cloudinary.com/fghurayri/image/upload/v1635524018/faisal.sh/localhost-access-denied-monterey/access-denied.png)

After a quick search, the only things I found were posts from 2016 related to MySQL and using `chmod` to elevate the permissions. They weren't helpful.

To debug the issue, I had a look at the firewall and the proxy settings - they were looking fine.

Then, I looked at my `/etc/hosts` file. It looked fine too.

Then, I ran the following command to see if the `5000` port was already occupied:

![Port is used!](https://res.cloudinary.com/fghurayri/image/upload/v1635524329/faisal.sh/localhost-access-denied-monterey/port-used.png)

I had no idea what occupying the port was, so I opened the Activity Monitor to check the pid, but it wasn’t showing.

Then, I had to search the `ControlCe` command in the web. That is when I found the topic [Why is Control Center on Monterey listening on ports](https://developer.apple.com/forums/thread/682332) created 4 months ago. Finally it made sense.

Switching off the AirPlay listener solved the issue.

I hope this post helped you understand how to approach debugging local networking problems and how to fix this particular issue for Mac OS Monterey.
