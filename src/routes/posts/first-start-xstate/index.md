---
title: "First Time Trying XState"
date: "2021-07-08"
slug: "first-start-xstate"
---

<script context="module">
  export const prerender = true;
</script>

<script>
  import { assets } from '$app/paths';
  let slug = "first-start-xstate"
</script>

![XState Vizualizer]({assets}/images/{slug}/viz.jpg)

Last week, I've completed both xstate courses at Frontend Master. I applied my learning by creating a state machine for a magic link login flow in my Sveltekit app.

Pretty awesome!

The visualizer:
https://xstate.js.org/viz/?gist=f3ddb13ea3b8f8b0335097588a623e47

The code:

```svelte
<script lang="ts">
  import { browser } from "$app/env";
  import { useMachine } from "@xstate/svelte";
  import { createMachine, assign } from "xstate";
  import { goto } from "$app/navigation";

  type Context = {
    email: undefined | string;
    token: undefined | string;
  };

  type States =
    | {
        value: "idle" | "loginError";
        context: { email: undefined; token: undefined };
      }
    | {
        value: "loggedIn" | "loggingIn";
        context: { email: string; token: string };
      };

  type Event =
    | { type: "VERIFY_TOKEN"; data: { email: string; token: string } }
    | { type: "LOGIN_SUCCESS_REDIRECT_TO_OFFICE" }
    | { type: "LOGIN_SUCCESS_REDIRECT_TO_ONBOARDING" }
    | { type: "LOGIN_FAILED" }
    | { type: "NO_CREDENTIALS" };

  const verifyMachine = createMachine<Context, Event, States>(
    {
      id: "verify-machine",
      initial: "idle",
      context: {
        email: undefined,
        token: undefined,
      },
      states: {
        idle: {
          on: {
            VERIFY_TOKEN: {
              target: "loggingIn",
              actions: "saveEmailAndToken",
            },
            NO_CREDENTIALS: "loginError",
          },
        },
        loggingIn: {
          invoke: {
            src: "performVerifyToken",
            onError: "loginError",
          },
          on: {
            LOGIN_SUCCESS_REDIRECT_TO_OFFICE: "loggedIn.officeUser",
            LOGIN_SUCCESS_REDIRECT_TO_ONBOARDING: "loggedIn.newUser",
            LOGIN_FAILED: "loginError",
          },
        },
        loggedIn: {
          states: {
            newUser: {
              entry: "redirectToOnboarding",
              type: "final",
            },
            officeUser: {
              entry: "redirectToOffice",
              type: "final",
            },
          },
        },
        loginError: {
          entry: "redirectToLogin",
          type: "final",
        },
      },
    },
    {
      actions: {
        saveEmailAndToken: assign({
          email: (ctx, ev) => ev.data.email,
          token: (ctx, ev) => ev.data.token,
        }),
        redirectToOffice: () => goto("/office"),
        redirectToOnboarding: () => goto("/onboarding"),
        redirectToLogin: () => goto("/auth/check-in"),
      },
      services: {
        performVerifyToken: (ctx) => (send) => {
          const { email, token } = ctx;
          fetch("/auth/verify", {
            method: "post",
            body: JSON.stringify({ email, token }),
          }).then((resp) => {
            if (resp.status === 200) {
              send({ type: "LOGIN_SUCCESS_REDIRECT_TO_OFFICE" });
            } else if (resp.status === 302) {
              send({ type: "LOGIN_SUCCESS_REDIRECT_TO_ONBOARDING" });
            } else {
              send({ type: "LOGIN_FAILED" });
            }
          });
        },
      },
    }
  );

  const { state, send } = useMachine(verifyMachine);

  if (browser) {
    let urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get("email");
    let token = urlParams.get("token");

    if (email && token) {
      send({ type: "VERIFY_TOKEN", data: { email, token } });
    } else {
      send({ type: "NO_CREDENTIALS" });
    }
  }
</script>

{#if $state.matches("loggingIn")}
  <h1>Verifying, you will be redirected shortly...</h1>
{/if}
```

In the first iteration of this machine, I used an invoked promise because I felt it will be more ergonomic to use onDone and onError to report back the result. However, after I found I have 2 types of "resolve" based on different scenarios, I refactored to an invoked callback.

Ideally in the future, I want to use this machine as a part of an app-level machine. However, I am still trying to digest the actor model in the context of state charts and the whole concept of invoking machines in xstate.

If you have been like me (trying to learn xstate for the past year but getting overwhelmed), I highly recommend a concentrated week of learning using these resources:

- Both FM courses
- @mpocock1
  articles & videos (including https://xstate-catalogue.com)
- Carefully reading the docs
