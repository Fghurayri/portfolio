---
title: "Build Lean Desktop Apps with Tauri"
date: "2021-07-19"
slug: "build-desktop-apps-with-tauri"
metaDesc: "Tauri vs Electron for building desktop apps."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1626943421/faisal.sh/build-desktop-apps-with-tauri/cover.webp"
---

<script context="module">
  export const prerender = true;
</script>

![Kazbegi, Georgia](https://res.cloudinary.com/fghurayri/image/upload/v1626943421/faisal.sh/build-desktop-apps-with-tauri/cover.webp)

Tauri is a toolkit built in Rust to help developers build desktop apps using any web frontend framework. It is currently in Beta. I rebuilt an Electron app in Tauri to check the app's size/memory differences.

| Metric | Electron | Tauri |
| ------ | -------- | ----- |
| Size   | 177MB    | 7MB   |
| Memory | 116MB    | 44MB  |

Pretty promising!

Links:

- [Tauri docs](https://t.co/9QjLSYNn6E?amp=1)
- [The Electron app repo](https://github.com/Fghurayri/jwt-decoder)
- [The Tauri app repo](https://github.com/Fghurayri/tauri-jwt-decoder)
- [A great and well-paced overview of Tauri by building an app utilizes Rust through the bridge](https://css-tricks.com/how-i-built-a-cross-platform-desktop-application-with-svelte-redis-and-rust/)
