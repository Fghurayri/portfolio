---
title: "Tauri - Build Lean Desktop Apps"
date: "2021-07-07"
slug: "build-desktop-apps-with-tauri"
---

<script context="module">
  export const prerender = true;
</script>

<script>
  import { assets } from '$app/paths';
</script>

![JWT Decoder App]({assets}/images/{slug}/jwt-decoder-app.jpg)

Tauri is a toolkit built in Rust to help developers build desktop apps using any web frontend framework. I rebuilt an Electron app in Tauri to check the app's size/memory differences.

| Metric | Electron | Tauri |
| ------ | -------- | ----- |
| Size   | 177MB    | 7MB   |
| Memory | 116MB    | 44MB  |

Pretty promising!

Links:

- [Tauri docs](https://t.co/9QjLSYNn6E?amp=1)
- [The Electron app repo](https://github.com/Fghurayri/jwt-decoder)
- [The Tauri app repo](https://github.com/Fghurayri/tauri-jwt-decoder)
