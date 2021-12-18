---
title: "Following The Actor Model with XState and Elixir"
date: "2021-12-18"
slug: "following-the-actor-model-with-xstate-and-elixir"
metaDesc: "I share a few ideas on following the actor model using XState and Elixir by walking through my recent project."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1638380906/faisal.sh/following-the-actor-model-with-xstate-and-elixir/director.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![The actor model programmer's chair](https://res.cloudinary.com/fghurayri/image/upload/v1638380906/faisal.sh/following-the-actor-model-with-xstate-and-elixir/director.jpg)

It is healthy to challenge your brain with novel stuff from one time to another. The challenge I want to lay for you in this post is how to shift your thinking from OOP, MVC, and n-tier architecture to a different paradigm called The Actor Model.

A big disclaimer is that I am still learning and wrapping my head around this concept. I chose this approach to build my project [Omw - real-time motorcycling trip tracker](https://github.com/Fghurayri/omw) in the backend and the web parts.

## What is the Actor Model?

According to Wikipedia:

> _"The actor model in computer science is a mathematical model of concurrent computation that treats actor as the universal primitive of concurrent computation. In response to a message it receives, an actor can: make local decisions, create more actors, send more messages, and determine how to respond to the next message received. Actors may modify their own private state, but can only affect each other indirectly through messaging (removing the need for lock-based synchronization)."_

That is a mouthful. The gist is that - the actor model is a _methodology_ to program _concurrent_ systems.

Concurrent systems have a unique characteristic of being **busy processing a lot of stuff simultaneously** - Systems like telecommunications, health care, bidding, tracking, booking, chatting, etc.

An actor would be a sizable unit in such systems that can maintain an internal state, receive messages, and send messages. For example, in tracking systems, an actor would be a vehicle that has an internal state (coords), receive messages (notification requesting to stop moving), and send messages (publish a new location change).

Like every other practice that claims they are _like_ the real world like DDD or OOP, this sounds _really_ like the real world, right?

> The actor model requires you to think hierarchically about each unit in the system. 

Instead of keep explaining the concept in shallow terms and exposing my limited understanding to your brain, I will direct you to two excellent resources from experts around the topic. 

The first is [The actor model in 10 minutes](https://www.brianstorti.com/the-actor-model/) - an easy to digest article explaining The Actor Model. 

The second is a recent talk about [Using the Beam to Fight COVID-19](https://www.youtube.com/watch?v=cVQUPvmmaxQ). The team built a product that seems to be the ultimate piece of software, and it has built-in fault-tolerance and distribution. This product implements a little bit from all tools solution architects tend to reach for - database, streaming, caching, CDN, queues, FaaS, and more.

In a nutshell, they have a running BEAM process per patient, not a row in the DB per patient. Each patient is a long-running actor that can run for weeks at a time. It can send messages (notification about taking a medicine), receive messages (admitting into another hospital), and maintain a state (events log). I highly recommend watching it. It's a brain tease! 

If you want to learn more about the BEAM, check out my short explanation in my post [Why Elixir is a Cool and Practical Langauge](https://faisal.sh/posts/why-elixir-is-cool-and-practical-language).

## Using the Actor Model in Omw

Instead of building another CRUD-based 3-tier architecture application, I wanted to challenge myself to think in a new paradigm. 

### The Backend

For the backend, I reached for Elixir to utilize the BEAM. Each tracking session is an Actor and a BEAM process representing a tracked vehicle.

```elixir
defmodule Omw.Tracker do
  import Omw.Tracker.Registry, only: [via: 1]

  alias Omw.Tracker.DynamicSupervisor

  def new(slug) do
    DynamicSupervisor.start_child(slug)
  end

  def update(slug, new_info) do
    GenServer.call(via(slug), {:update, new_info})
  end

  def state(slug) do
    GenServer.call(via(slug), :state)
  end

  def stop(slug) do
    try do
      GenServer.call(via(slug), :stop)
    catch
      :exit, {:normal, _} ->
        :ok

      _ ->
        :error
    end
  end
end
```

This module is the API/interface for dealing with these BEAM processes. 

The `new` function is responsible for creating a new tracking session identifiable for later communication by a `slug`. The `update` function is responsible for updating a tracking session by _sending a message_ to the running BEAM process asking to update its state with new info. In the same way, the `state` function is responsible for reading the tracking session by _sending a message_ to that running BEAM process.

```elixir
defmodule Omw.Tracker.Server do
  use GenServer

  import Omw.Tracker.Registry, only: [via: 1]

  alias Omw.Tracker.Session

  def init(init_arg) do
    {:ok, init_arg}
  end

  def start_link(slug) do
    session = Session.new(slug)
    GenServer.start_link(__MODULE__, session, name: via(slug))
  end

  def handle_call({:update, new_info}, _from, state) do
    new_state = Session.update(state, new_info)
    {:reply, new_state, new_state}
  end

  def handle_call(:state, _from, state) do
    {:reply, state, state}
  end

  def handle_call(:stop, _from, state) do
    {:stop, :normal, state}
  end
end
```

This module is the blueprint for a single BEAM process that will receive all the above messages. It uses the `GenServer` behavior, which means needing me, the developer, to fill in the implementation details for all the required callbacks to deliver such a behavior.

Executing the following snippet in the API/interface function:

```elixir
  def update(slug, new_info) do
    GenServer.call(via(slug), {:update, new_info})
  end
```

Will match with the following handler in the BEAM process:

```elixir
  def handle_call({:update, new_info}, _from, state) do
    new_state = Session.update(state, new_info)
    {:reply, new_state, new_state}
  end
```

Such invocation will cause changing the internal state to the new state. The same applies to `:state` and `:stop`.

Each tracking session is completely isolated thanks to following the actor model and the BEAM in the backend. If one session crashes, other sessions will keep being safe. The system will never be down due to a crash!

The above is a complete OTP application that is embedded into a Phoenix application to utilize its great soft-real time support through Channels.

### The Web Frontend

For the web frontend, I reached for XState to utilize its statecharts capabilities that play nicely with the actor model.

I used it in two different real-time places, the tracking of a session as a motorcyclist wanting to track a trip, and the following of a session as a person wanting to follow a trip.

Both places require establishing a websocket connection with the Phoenix application. The following is the implementation for the `socket` actor that will get spawned by either the tracker or the follower.

```js
export const socketMachine = createMachine({
  id: "socketMachine",
  context: { socket: null, channelsActorRefs: {} },
  initial: "connecting",
  states: {
    connecting: {
      invoke: {
        id: "connectSocket",
        src: "connectSocket",
      },
      on: {
        "SOCKET_CONNECTED": {
          actions: "saveSocket",
          target: "connected",
        },
      }
    },
    connected: {
      entry: "forwardToParent",
      initial: "ready",
      states: {
        ready: {
          on: {
            "JOIN_CHANNEL": {
              actions: "spawnChannelActor",
              target: "joiningChannel",
            },
            "LEAVE_CHANNEL": {
              target: "leavingChannel",
            },
            "PUSH": {
              actions: "forwardToChannel",
            },
            "RECEIVE": {
              actions: "notifyParentResponseReceived"
            }
          }
        },
        joiningChannel: {
          entry: "askChannelToJoin",
          on: {
            "CHANNEL_JOINED": {
              target: "ready",
              actions: "forwardToParent"
            }
          }
        },
        leavingChannel: {
          entry: "askChannelToLeave",
          on: {
            "CHANNEL_LEFT": "ready"
          },
          exit: "stopAndDeleteChannelActor",
        },
      },
    },
  }
})
```

Revisiting the actor model definition, each actor has an internal state, can receive messages, and can send messages.

This actor has an internal state under the `context` key. Once the connection is established with the Phoenix application, it will save a reference to the actual socket object. Moreover, it will save a map for all the joined channels at a later stage. 

Additionally, this actor receives messages. Once a `JOIN_CHANNEL` message is received in the `connected.ready` state, a new channel actor will get spawned and saved into its context.

Finally, this actor sends messages. In the `joiningChannel` state, once the new channel actor gets spawned successfully and joined, it will send a message to the parent actor confirming that a new channel is joined successfully.

The same applies to all the other actors like the geolocation actor and the map actor - each actor will have an internal state and can send or receive messages.

You can check this great Google talk [Architecting Web Apps - Lights, Camera, Action! (Chrome Dev Summit 2018)](https://www.youtube.com/watch?v=Vg60lf92EkM) that goes into more detail in following the actor model in building UIs.

## Conclusion

After building this project, I can say that following the actor model is beneficial to help hierarchically think about the system. I don't know how things would go production in terms of debugging and knowledge sharing with colleagues. However, I see it will be effortless thanks to how everything is isolated and contained.

I hope you enjoyed this brain twist!
