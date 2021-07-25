---
title: "My Developer Tools (uses)"
date: "2021-07-24"
slug: "my-developer-tools"
metaDesc: "I share the tools I use for my daily work as a developer."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1627162062/faisal.sh/my-developer-tools/cover.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Carpenter Tools](https://res.cloudinary.com/fghurayri/image/upload/v1627162062/faisal.sh/my-developer-tools/cover.jpg)

> "Give me six hours to chop down a tree, and I will spend the first four sharpening the ax." - Abraham Lincoln.

# The TLDR

I daily use the following tools for web and mobile development.

**Hardware**

- Laptop: 2018 Macbook Pro 15" with 32GB of RAM (with the sticccky keyboard)
- Monitors: 2x 24" LG 24UD58-B 4K IPS
- Keyboards: Apple Keyboard and Keychron K1 (blue switches)
- Mouse: Logitech MX3 Master
- Headphone: Bose QC30
- Microphone: Antlion ModMic Wireless
- Desk: L-Shaped FEZIBO Adjustable Standing Desk
- Treadmill: Rhythm Fun Under Desk Foldable Treadmill

**Software**

- I use VS Code as my primary text editor with the vim extension, Serendipity light theme, and PT Mono font
- I use Firefox Developer Edition with Sidebery vertical tabs, multiple containers, and Vimium
- I use the standard white Apple terminal with ZSH shell and powerlevelk10 theme
- I use Raycast as my app launcher and productivity tool (instead of Alfred)

<br/>
<br/>

# Context

After ~ 7 years into my tech career, I decided to take a sabbatical from my full-time job. At the same time, my wife received a scholarship to pursue her P.hD. at Charlotte, NC, USA. So we decided to move from our home in Riyadh, Saudi Arabia.

The relocation allowed me to start from scratch in building my home office. Instead of opting to get the latest and greatest stuff, I went with more pragmatic budget-conscious options. I only kept my headphones and machine. I got everything else after relocating from Amazon.

## Hardware

### Machine

I used to have a sweet 2016 14" 16GB Macbook Pro that worked until I started developing full-stack apps using Docker, Node JS, and React Native. Then, I needed to upgrade the RAM to run the whole stack with iOS and Android simulators.

So, in 2018, I pulled the trigger on a refurbished 2018 Macbook Pro with 32GB. I still use it till today, but it started showing its age with the battery swelling and the sticky keyboard. So, I am eyeing a 16" M2 Macbook Pro next year.

### Monitors

In the past, I have used many monitor sizes/configurations.

| Monitors | Physical       | Laptop  | Horizontal | Vertical | **Rating** |
| -------- | -------------- | ------- | ---------- | -------- | ---------- |
| 3        | 3 (21")        | 0       | 3          | 0        | **7/10**   |
| 3        | 3 (21")        | 0       | 2          | 1        | **8/10**   |
| 3        | 2 (24")        | 1 (14") | 2          | 1        | **6/10**   |
| 2        | 2 (24")        | 0       | 2          | 0        | **9/10**   |
| 2        | 1 (34" curved) | 1 (16") | 2          | 0        | **6/10**   |
| 1        | 1 (34" curved) | 0       | 1          | 0        | **7/10**   |

Reflecting on my above experience, I found that the sweet spot for me is not using my laptop monitor but use two full external monitors on VESA spring-loaded arm mount to customize the rotation. So I researched the best monitor size, and I found the LG 24UD58-B 24-Inch 4K IPS to be the finest option from dimensions and resolution perspective.

I pulled the trigger after watching [this developer-focused review](https://www.youtube.com/watch?v=HBKULwX4Q4M) on it, especially after his comments on PPI and scaling for text-based workflows. I can confidently say that it is the best configuration I have ever had.

### Keyboard

I am not proud about the frequency of changing my keyboards - On average, I get a new keyboard every year. I have tried almost every brand, including the obscure Kinesis Advantage2. My short fingers couldn't get comfortable with any offering other than Apple's keyboard and the DAS mechanical keyboard with the blue switches.

Currently, I use the Apple keyboard when my wife is in the same room or the Keychron K1 with the blue switches when I'm working alone. I picture the ideal keyboard as silent and compact as the Apple keyboard and as fun and tactile as the blue mechanical switches.

### Mouse

The easiest one. I am a loyal customer of Logitech's mice. I have been using the MX Master lineup since it launched. Now I have the MX Master 3.

### Audio (Speaker and Mic)

The second easiest. I still use my Bose QC30 since I bought it five years ago. As for the mic, I have tried a couple of USB ones, but I found them to pick up noise pretty aggressively. I researched what non-hardcore gamers/streamers use, and I found the Antlion ModMic Wireless to be the best option in terms of portability and performance. I often receive compliments on how crisp and clear my voice is.

### Desk

Standing desks are better than conventional desks because it is easier to maintain a better posture while standing. However, standing all the time (or not moving for a long time) is not healthy. When I explored the treadmill desks area, most of the offerings were pretty bulky and expensive. So I went with an adjustable L-shaped standing desk with a compact foldable under-desk treadmill.

I think all desk-based jobs should offer a similar setup. It forces you to always keeping moving, even at low speeds. Constant moving is much healthier due to increased blood flow. It also forces you to take more frequent breaks.

## Software

### Text Editor

![My VS Code Setup](https://res.cloudinary.com/fghurayri/image/upload/v1627170790/faisal.sh/my-developer-tools/VSCode.png)

I was an early adopter of VS Code since early 2016. I like how I can do everything I need for my development workflow in one place. Things like accessing a terminal to run commands related to the task in hand, running a debugger to x-ray a problem, controlling other relevant external tools via extensions, and effortlessly searching/replacing/renaming stuff. I think VS Code offers the best JavaScript/TypeScript DX while handling other languages pretty well due to the rich ecosystem of extensions.

I find the light Serendipity theme to be the most calming option. I used to have the Fira Code font with ligatures enabled. However, nowadays, I use the PT Mono font with no ligatures. I enjoy using Vim keybindings to improve my text editing experience too.

### Browser

![My Firefox Browser Setup](https://res.cloudinary.com/fghurayri/image/upload/v1627171794/faisal.sh/my-developer-tools/Firefox.png)

Firefox Developer Edition is my go-to browser for the development environment and general browsing activities. I merged two features to have unmatched DX and UX.

The first feature is running separate containers in the same window, where each container has its sandbox environment. For example, I have four different containers: personal, work, school, and others. Each container has a signed-in Google account, a unique icon and color indicator, and a cluster of the same-context open tabs.

The second feature is the vertical tabs with the Sidebery extension. I am very liberated about the count of long-lived open tabs, so vertical tabs suites me well. I rarely have the sidebar opened, though, as I usually navigate between tabs the same way I use VS Code - `cmd + p` in VS Code and `shift + t` in Firefox to search-open files/tabs.

By combining these two features, along with the seamless integration of Vimium to enable Vim keybindings and 1Password to manage my password, I don't see myself changing my browser anytime soon.

### Terminal, Productivity, and Apps Launcher

![My Terminal and Productivity Setup](https://res.cloudinary.com/fghurayri/image/upload/v1627172525/faisal.sh/my-developer-tools/terminal.png)

I have been a long-time user of iTerm2. Once I noticed how little I use the external terminal outside VS Code, I decided to roll back to the minimal Mac OSX terminal. I still got to enjoy the ZSH shell with the powerlevel10k theme there. In addition, I have been using Alfred for a long time as my productivity/apps launcher. I decided to give Raycast a try, and so far, it matches all stuff offered by Alfred with a more elegant UI.
