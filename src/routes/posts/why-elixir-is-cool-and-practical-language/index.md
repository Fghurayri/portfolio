---
title: "Why Elixir is a Cool and Practical Langauge"
date: "2021-11-30"
slug: "why-elixir-is-cool-and-practical-language"
metaDesc: "elixir"
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1638202998/faisal.sh/why-elixir-is-cool-and-practical-language/iceberg.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Iceberg](https://res.cloudinary.com/fghurayri/image/upload/v1638202998/faisal.sh/why-elixir-is-cool-and-practical-language/iceberg.jpg)

## Getting Out The Local Maxima

Almost all programming languages are **Turing complete**. That means that, as long as your language of choice enables you to have variables, branching, and repetition, you can almost solve any logical problem. 

In theory, learning a single language is enough. There are engineers like [Levelsio](https://twitter.com/levelsio) who (claimes?) how a single file `index.php` is OK to run a lean, profitable, and scalable business. On the other hand, savvy polyglots swear by choosing the right tool for the job and will never settle for a single language.

I see myself in between these views. I will never always go for a single language because I am an expert on it. And I will never be a binary thinker who will see things either right or wrong. Choosing a programming language for a project is a complex problem where you need to consider the business itself, the market (competitors and pool of talents), the team's experience, etc.

In this post, I aim to brain dump all my learnings about Elixir and why I think it is a cool _and_ practical language to build stateful backend applications. I will not focus on how to declare a variable or how to write an if-statement. Instead, I will walk you through the spectacular features of the language by explaining a few concepts and sharing some snippets from my latest project [Omw - real-time motorcycling trip tracker](https://github.com/Fghurayri/omw).

> Even after two years of learning Elixir, I am still feeling excited about the novelty around it. I tried to be objective and only share facts. However, take everything that seems too lovely with a grain of salt and feel free to research it yourself.

## Erlang, The Living Battle-Tested Ancestor

To fully understand how Elixir was born, you should know a bit about the story of Erlang.

In the 1980s, Ericsson (the telecommunication company) assigned a team of three computer scientists to run an R&D lab (research and development) to help the company deal with the challenges of the domain.

![Telephone Switch](https://res.cloudinary.com/fghurayri/image/upload/v1638207410/faisal.sh/why-elixir-is-cool-and-practical-language/telephone-switches.png)

The problem was how hard it was to build and maintain the telephone switching systems. The general system's goal was to connect and maintain the connection between 2 or more phones to conduct a call.

The requirement was _simply_ to have a concurrent and fault-tolerant system. 

The system should behave the same whether there is a single ongoing call or millions of calls. Moreover, a failure in a call shouldn't impact other calls. Finally, the system should never be down, even for software upgrades. You can't tell people, "Hey folks, don't do calls the next hour. We need to upgrade our switches."

And that's how Erlang was born - out of a critical business continuity necessity. And it worked successfully. It helped achieve nine nines of service reliability. That's less than a second of downtime in 20 years. More on that [here](https://stackoverflow.com/questions/8426897/erlangs-99-9999999-nine-nines-reliability).

More on the story about Erlang is in this [short documentary by the three scientists](https://www.youtube.com/watch?v=BXmOlCy0oBM).

> Did you know that in Erlang, instead of using a semi-colon ";" to end a statement, you use a full stop "."?

In 2015, Whatsapp was able to support 900 million customers with a lean team of 50 engineers. More on that [here](https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/).

## Closer Look on the BEAM

There are many cool things to explore about Erlang. For example, when you follow certain practices like declarative, functional programming, immutability, and the actor model, then supporting concurrency and fault-tolerance will be a piece of cake.

However, the solid ground that enables all of the above is the VM that runs the byte code.

![BEAM VM](https://res.cloudinary.com/fghurayri/image/upload/v1638210287/faisal.sh/why-elixir-is-cool-and-practical-language/beam.png)

Thanks to the BEAM, your application will use all the cores available in the CPU out of the box. The above blue circles are lightweight processes spawned by the application. Each process has an internal state that is not shared with any other process. Each process has a mailbox to receive messages from other processes. I will cover this more in a later section.

The BEAM will attach a _preemtive scheduler_ for each CPU core. The "preemptive" part means that the scheduler will only assign a limited amount of processing time for each task. In other words, your application will never get blocked by something. Such processing style is a critical characteristic for a highly available system.

For your operating system, there is one BEAM process. For your application running inside the BEAM, you can have as many as 268,435,456 lightweight processes. Moreover, each process can get spawned in microseconds. Processes can send and receive messages among each other in microseconds. Since each process is isolated, garbage collection is a highly efficient per-process basis, not the whole VM.

Vertically scaling on the BEAM is more economical than other runtimes like [Node JS](https://stackoverflow.com/a/61894823). Moreover, horizontally scaling on the BEAM is easy too. The clustering and discovery of nodes are built-in into the VM.

> Nowadays, to achieve the above, you need to have Docker and Kubernetes and change how to build your app to be cloud-native.

That is it. 

There is no need to think about threading, mutex, or other complex concurrent programming jargon to utilize the CPU. Moreover, there is no need to run multiple app instances and introduce a load balancer or a reverse proxy to orchestrate the work. In addition, there is no need to introduce a potential accidental complexity early in the project because you need a background job processor or a caching layer to improve the performance.

I can't think about a better monolith setup.

Many folks in the community think this talk is mandatory to see the value of BEAM in building concurrent systems: [Saša Jurić - Solid Ground](https://www.youtube.com/watch?v=pO4_Wlq8JeI)

## Enter Elixir

[José Valim](https://twitter.com/josevalim) was (and still is) a well-known figure in the Ruby on Rails community before creating Elixir. He created [Devise](https://github.com/heartcombo/devise) - an authentication solution for Rails.

In 2012, he was frustrated by how hard it was to capture the value of multi-core CPUs while developing concurrent applications in Ruby and other languages. He researched the topic and found about Erlang and the BEAM. Then, he decided to start working to have a new language called Elixir work on top of the BEAM. More on the story in this [short documentary](https://www.youtube.com/watch?v=lxYFOM3UJzo)

In theory, you can do everything that Erlang does in Elixir. Elixir uses the same VM that powers Erlang.

So, besides being on top of the BEAM, why do I think Elixir is a cool and practical language for stateful back-end applications?

### OTP (Open Telecom Platform)

[OTP](https://elixir-lang.org/getting-started/mix-otp/introduction-to-mix.html) is a set of tools and practices to help build scalable and fault-tolerant distributed systems _in the application layer_. It is unfortunate to have the "telecom" part in the acronym as nothing about telecom is related.

To demonstrate what it means by "fault-tolerance" in the application layer, let's discuss the concept of a software crash.

In simple words, each running application will have a corresponding process in the operating system. Suppose such a process receives a crash-related signal like SIGKILL anytime for any reason. In that case, it will immediately get terminated in the operating system, and the associated state will get lost.

In the Node JS world, an example of a software crash would be the event of an unhandled promise rejection. That is why you always see `try` and `catch` blocks wrapping critical parts of the code to not let the app crash due to an unhandled promise rejection - thus providing fault-tolerance in the application layer. 

Moreover, you rarely see folks running Node JS production apps without a process manager like PM2, a container with a restart policy like Docker, or even a containers orchestrator like Kubernetes. Such additional tools help monitor and restart the application through crashes, providing the fault-tolerance in the infrastructure layer.

However, in the BEAM and Elixir land, a set of tools allow you to build a **Supervision Trees**. Such trees help you have fault tolerance in the application layer. Let's take a look at how I utilized OTP in Omw.

#### Isolated Processes

In Omw, I have used OTP to have fault-tolerance on three parts of the system. The first part is the **Dictionary**. It is responsible for providing mnemonics that can be used as a session identifier. Here is a snippet of that module.

```elixir
defmodule Omw.Dictionary do
  use Agent

  alias Omw.Dictionary.Words

  def start_link(_init_arg) do
    Agent.start_link(&prepare_dictionary/0, name: __MODULE__)
  end

  def get_random_slug() do
    __MODULE__
    |> Agent.get(&Enum.take_random(&1, 2))
    |> Enum.join("-")
  end

  defp prepare_dictionary() do
    Words.all()
  end
end
```

The `start_link` function will `spawn` a new process into the BEAM. The initial internal state of that process will contain all the words thanks to calling `prepare_dictionary/0` function. We can communicate with this process either by the returned `pid` (process id) or by the assigned name when spawning the process. In our case, it is `__MODULE__`, which is the module's name.

Now, without writing any extra code, we introduced the first block of fault-tolerance, process isolation. If this process crashes for any reason, other parts of the system will remain working as expected. We don't have to wrap `try` and `catch` anywhere in our code to protect our running application.


#### Supervision Trees

The second block of fault-tolerance introduces a supervisor who monitors a process and restarts it if it crashes. Here is a snippet of how to achieve that.

```elixir
defmodule Omw.Application do
  use Application

  def start(_type, _args) do
    children = [
      Omw.Dictionary,
    ]

    opts = [strategy: :one_for_one, name: Omw.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

We defined a list of children under a supervisor with a restart policy or `strategy` as `:one_for_one`. If the dictionary crashes, it will be automatically restarted by our supervisor!

#### Dynamic Supervisor

What we achieved in a few lines of code is fantastic. However, the dictionary is a static and known part of the system. What about the tracking sessions that can get dynamically created and terminated?

Here comes the second part of Omw - providing fault-tolerance on the **Tracking** part.

To achieve that, I have used a dynamic supervisor.

```elixir
defmodule Omw.Tracker.DynamicSupervisor do
  use DynamicSupervisor

  alias Omw.Tracker.Server

  def start_link(init_arg) do
    DynamicSupervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  def start_child(slug) do
    spec = %{
      id: Server,
      start: {Server, :start_link, [slug]},
      restart: :transient
    }

    DynamicSupervisor.start_child(__MODULE__, spec)
  end

  def init(_init_arg) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end
end
```

The `Server` is a `GenServer` with a `start_link` function similar to the Dictionary above. The `:transient` restart policy means "If this process is terminated abnormally, then restart it immediately. If the termination was a normal exit, then don't restart it".

With that, I can expose an API to create a process per each tracking session dynamically.

```elixir
defmodule Omw.Tracker do

  alias Omw.Tracker.DynamicSupervisor

  def new(slug) do
    DynamicSupervisor.start_child(slug)
  end

end
```

To make everything work, I can take this dynamic supervisor and tuck it under the root supervisor.

```elixir
defmodule Omw.Application do
  use Application

  def start(_type, _args) do
    children = [
      Omw.Dictionary,
      Omw.Tracker.DynamicSupervisor
    ]

    opts = [strategy: :one_for_one, name: Omw.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

And now I have fault tolerance and isolation for each tracking session! Still not a single `try` and `catch` statement!

#### Process Registry

So far, the only shortcoming is how we can reference a `pid` for a tracking session using the mnemonic. To achieve that, we need key-value storage to store the mnemonic and the associated `pid`. Preferably an in-memory one like Redis.

Luckily, in Elixir, you have access to all Erlang modules. One great module is ETS (Erlang Term Storage). It is in-memory key-value storage - it is like having Redis embedded into your programming language. Using Redis when you have the BEAM is slower! Remember, in the BEAM; you can send and receive messages in microseconds.

Even more luckily, Elixir has a module called `Registry`. It is a specialized in-memory key-value process storage that is responsible for holding a reference to a pid.

The following is the implementation of our third part of the supervision tree, the **Registry**.

```elixir
defmodule Omw.Tracker.Registry do
  def via(slug) do
    {:via, Registry, {__MODULE__, slug}}
  end
end
```

And here is how we utilize the registry whenever we want to communicate with a process.

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

Finally, we tuck our registry under the root supervision tree.

```elixir
defmodule Omw.Application do

  use Application

  def start(_type, _args) do
    children = [
      {Registry, keys: :unique, name: Omw.Tracker.Registry},
      Omw.Dictionary,
      Omw.Tracker.DynamicSupervisor
    ]

    opts = [strategy: :one_for_one, name: Omw.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

And that was the last piece to build a fault-tolerance OTP application.

### The Phoenix Framework

Phoenix is the most popular web application framework in Elixir. Ruby on Rails developers will feel at home with the batteries-included approach and the familiar syntax.

In Phoenix, you have many code generators for MVC workflows, authentication, websockets, database migrations, and more.

Many frameworks are saying we are the Rails for `x` language. The real nice thing about Phoenix, though, is that - All the above great stuff about OTP is already used in building and running Phoenix. Every web request is a spawned process. Out of the box, you get amazing fault-tolerance and isolation!

I can run the `:observer` and see the glorious supervision tree for the whole application.

![The BEAM Observer](https://res.cloudinary.com/fghurayri/image/upload/v1638222312/faisal.sh/why-elixir-is-cool-and-practical-language/observer.png).

Phoenix is extremely fast and efficient. Many engineering teams reported dramatically lower bills thanks to migrating from a Ruby on Rails stack to Phoenix. In 2015, [the Phoenix team shared](https://phoenixframework.org/blog/the-road-to-2-million-websocket-connections) their experiment about having 2,000,000 live websocket connections in a single beefy machine.

I have deployed the Omw project on a free 256MB VM in [fly.io](https://fly.io) with a 120MB baseline memory usage. The application is snappy, and I see requests served in microseconds.

## Conclusion

For all the above reasons, I think Elixir is a cool and practical language. It gives you the superpowers of Erlang in an approachable syntax. Moreover, the tooling provided by the community is mature and solid. You see libraries running in production for years without reaching version 1.0. You can go a long way with Phoenix alone without the need to introduce the performance-increasing techniques that folks from other frameworks need early on.

When I first learned about Elixir, I was like: "Why do no more engineers know about Elixir and functional programming? It can solve many engineering struggles around OOP and design patterns, background jobs, caching, deployment with Docker, and scaling with Kubernetes". I still have some of these thoughts. But I am now more realistic about the world. 

Many folks learned to program and are working at jobs that require them to apply OOP. Shifting into FP (functional programming) is not easy for them, as it requires unlearning a lot. Working on an FP approach needs executive support from the CTO.

I still see the value of Docker and Kubernetes, especially for providing things the BEAM can't cover. [This article](https://dashbit.co/blog/kubernetes-and-the-erlang-vm-orchestration-on-the-large-and-the-small) is great to learn how to mesh these technologies togehter. I appreciate the [twelve-factor app](https://12factor.net) approach and think it is great even when you build apps with Phoenix.

I hope that I inspired you to learn more about Elixir. There are many other great things around developer joy like pattern matching, pipelines, mix, and hex. Elixir is used in Heroku, Discord, Supabase, and many other great places with millions of users. These are the best resources to learn more:

- [Official website](https://elixir-lang.org)
- [Book: Elixir in Action](https://www.manning.com/books/elixir-in-action-second-edition)
- [Book: Programming Phoenix](https://pragprog.com/titles/phoenix14/programming-phoenix-1-4/)
- [Video Courses: Pragmatic Studio](https://pragmaticstudio.com)
- [Podcast: Thinking Elixir](https://thinkingelixir.com/the-podcast/)
- [Podcast: BEAM Radio](https://www.beamrad.io)

To learn more about Erlang and the Concurrency Oriented Programming, I recommend these resources from Joe Armstrong, one of creators of Erlang:

- [Short slides deck from a talk in 2002](https://www.rabbitmq.com/resources/armstrong.pdf)
- [The Ph.D. thesis: Making reliable distributed systems in the presence of sodware errors](https://erlang.org/download/armstrong_thesis_2003.pdf)
