---
title: "My First Week Learning Go"
date: "2022-01-12"
slug: "my-first-week-learning-go"
metaDesc: "I share my initial experience and what I have learned after completing a couple of Go courses."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1641889312/faisal.sh/my-initial-impressions-learning-go/zjaqzrqupt56ndvallbh.png"
---

<script context="module">
  export const prerender = true;
</script>

![A gopher with a goatee wearing a Go bandana cruising on a Go motorcycle](https://res.cloudinary.com/fghurayri/image/upload/v1641889312/faisal.sh/my-initial-impressions-learning-go/zjaqzrqupt56ndvallbh.png)

## TL;DR

Go is an enjoyable and simple language. I used the following resources:

- [Youtube video](https://www.youtube.com/watch?v=yyUHQIec83I) course.
- [Stephan Grider's](https://www.udemy.com/course/go-the-complete-developers-guide/) course in Udemy.
- [Youtube channel](https://www.youtube.com/c/packagemain/videos) to see the work of what _I_ think is an expert Go developer.
- Understanding how memory allocation is done in general. It goes over details around the stack and the heap using examples in C++. [video](https://www.youtube.com/watch?v=_8-ht2AKyH4)
- Understanding memory allocation for Go specifically. It answered a lot of my questions around balancing developer experience. For example, should you prioritize code clarity over performance? Should you pass pointers top to bottom or return references bottom to up? How do the GC and the compiler work together? [video](https://www.youtube.com/watch?v=ZMZpH4yT7M0)
- Understanding pointers in Go specifically. It has some nice diagrams and animations to make the concept more approachable. [video](https://www.youtube.com/watch?v=sTFJtxJXkaY)
- Rob Pikes's post explains arrays and slices. It explains how to approach mutations, which indirectly covers pointers. [article](https://go.dev/blog/slices)
- Dissecting pointers in Go by doing all the possible permutations of dereferencing and referencing. [article](https://medium.com/analytics-vidhya/pointers-in-golang-1a679b464849)

## Why am I Learning Go?

I always had the impression that Go, Python, and Ruby are simple languages that are easy to learn. Therefore, I never intended to learn any of them in my free time. Instead, I have been waiting to join a team that uses any of these languages to start learning.

So, I used my free time leveling up my TypeScript skills for my day job and learning Elixir for my pleasure. I produced a couple of posts and projects to cement my learnings. You can check them out in my [Github profile](https://github.com/Fghurayri).

Fast forward to last month; I found a job post at an exciting place that uses Go. One of the requirements to apply for the job is to build a real-time chatting app using Go as the backend (with Docker and PostgreSQL). I took a step back, thought about my strategy, and decided to free myself to learn Go.

The project I'm going to build using Go is a real-time-distributed-team Pomodoro timer. I will embed a chatting feature to satisfy the job requirements. However, I will also use XState to drive home a point about how valuable to think "Logic First. UI Later" by building a CLI client and a Desktop client in TypeScript to that Go server.

## Why am I Sharing my Learnings?

The following [tweet](https://twitter.com/andrestaltz/status/1470440881664765958) deeply resonated with me.

> _If you're a beginner in some tech and would like to write tutorials to teach others but feel unsure about your skills, PLEASE write that tutorial! There exists a sweet spot between "just understood it" and "empathetic to other beginners" that only you can write, not experts._

Moreover, I regret not sharing my initial learnings with Elixir. It helps to show vulnerability from one time to another. Other folks, especially juniors, will feel more comfortable sharing and learning publicly.

Finally, writing helps me to have a deeper understanding of the subject. 40% of this post is from pure research after completing the courses.

## First Week

Last week, I completed a couple of courses to learn Go. I used this fresh [Youtube video](https://www.youtube.com/watch?v=yyUHQIec83I) course to cover the basics, as well as a detailed course from my go-to Udemy instructor, [Stephan Grider](https://www.udemy.com/course/go-the-complete-developers-guide/). I watched in 1.5x speed, coded along and ahead, and maintained a list of observations from all these resources.

> If I were to sum my impressions, Go is enjoyable and easy to learn. Before learning Go, I was fortunate to have learned TypeScript (a multi-paradigm language with types and interfaces) and Elixir (a functional language with structs and concurrency). Many ideas in Go clicked right away!

Instead of showing you how _I_ used my knowledge by comparing and contrasting Go with TypeScript and Elixir, I will try to compile my observations and explain concepts solely for Go.

A big disclaimer is that I'm still learning. Sharing a long-form post will never be as effective as building stuff with Go. So, if you want to learn, I highly encourage you to use the knowledge from this post and build something!

Here is the [repo](https://gitlab.com/nanuchi/go-full-course-youtube) for the Youtube course. And here is the [repo](https://github.com/StephenGrider/GoCasts) for the Udemy course.

### Installing Go

I use [asdf](https://github.com/asdf-vm/asdf) to install and manage the versions of any tool. Therefore, I reached for [asdf-golang](https://github.com/kennyp/asdf-golang). Moreover, I used the Go extension in VS Code to support the language.

### Running Code in Go

Let's take this hello world example.

```go
// main.go
package main

import "fmt"

func main() {
	fmt.Println("Hello World")
}
```

You need to do two or three steps to run any Go code.

First, your `main.go` file should contain a `package main` declaration, as well as a `func main` function that acts as your app's entry point.

Second, you need to build your application by running `go build main.go` in your terminal.

Third, executing the above command will produce an executable file that you can run in your terminal by typing `./main` and clicking enter.

You can combine the second and third steps by running `go run main.go` in your terminal. It will build the app in a _known_ directory for the Go CLI and run the produced build instantly.

### Packages in Go

There are two types of packages in Go.

The first type is the _executable_ package. It is a type of package that helps you execute your code. You can never run your application in the above hello world example without declaring the executable package called `main`.

The second type is the _reusable_ package. It is the type of package that helps you reuse code from other libraries. In the above example, you need to print to the console, so you need to `import` the `fmt` package and invoke the `Println` function. As a developer, you develop and publish reusable packages.

> One highlight is that I was immediately put off by the capital P in `Println`. Later, I learned it's THE way to make a function public and ready to be consumed by other packages.

If the logic is scattered between multiple files that all share the `package main` declaration, you need to include the file names when running the code. For example, you need to execute `go run main.go helpers.go` to run the code in the two files named main and helpers.

A better approach to logically group the code is to distribute the code into reusable packages. When you declare a new reusable package, you need to import it where you use it.

### Variables in Go

There are two levels of variable scoping in Go.

First, there is the local level variable scoping. A variable is declared and used only within its scope, either in a function or a block.

Example:

```go
package main

import "fmt"

func main() {
	name := "Faisal"
	fmt.Println("Hello", name)
}
```

Second, there is the package level scope. A variable is declared and used within that file.

Example:

```go
package main

import "fmt"

var name = "Faisal"

func main() {
	fmt.Println("Hello", name)
}
```

Moreover, when two variables have the same name but have different scoping, the priority will be for the most local variable.

Example:

```go
package main

import "fmt"

var name = "Faisal"

func main() {
	name := "Ali"
	fmt.Println("Hello", name)
}
```

The above code will print `"Ali"` to the console.

One highlight is how to instantiate a variable in Go.

You can either do the `name := "Faisal"` syntax, which is a shorthand for `var name string = "Faisal"`, where the `:=` part says "Here is a new value for this variable, please save it AND infere the type for it".

However, when you declare a global variable, you _have_ to use the `var` approach.

Another highlight is the concept of **Zero Value** in Go.

When you declare a variable, you don't _have_ to store a value in it right away. Instead, Go will store a _zero_ value until you change it later. For `string` it's the empty string `""`. For `int` it's the number `0`. For `bool` it's the `false` boolean value.

One interesting remark from reading some Go code last week is that - it seems to be a convention to choose compact variable names and rely on the function call to convey the context. For example:

```go
package main

func main() {
  // Instead of going with "server" as the variable name, the developer used "s".
  s := newServer()
  go s.run()
}
```

I'm not sure how I feel about this!

Finally, you can use the `make` function to create a new empty array, slice, map, or channel and save it into a variable.

### Types in Go

Go will feel very familiar if you have used a typed language before. Every variable should have a type, either an inferred one or an assigned one. Every function declaration should have either a set type or nothing (void).

In Go, there are mainly two categories of types.

The _interface_ types are the interfaces you develop as a contract to help manage types. You can't use them to instantiate a new variable.

The _concrete_ types are built-in, and you can instantiate a new variable using them. For example, the `string` type is concrete.

Other notable concrete types include slices, arrays, maps, and structs. Take this snippet, for example.

```go
package main

type user struct {
  name string
  id int
}

func main() {
  // array
  as := [4]string{"Faisal", "1", "Ali", "2"}

  // slice
  ss := []string{"Faisal", "1"}
  ss = append(ss, "Ali")
  ss = append(ss, "2")

  // map
  mu := make(map[string]int)
  mu["Faisal"] = 1
  mu["Ali"] = 2

  // struct
  u1 := user{"Faisal", 1}
  // another way to intantiate a struct
  u2 := user{name: "Ali", id: 2}
}
```

Arrays and slices are very similar, with a few differences. Arrays are fixed in size, and slices are flexible in size. The map is the key-value storage data structure in Go, like the object in JavaScript.

To interact with such types, you can use built-in functions like `len` to get the length of an array, slice, or map.

Structs are custom-made types. They allow holding arbitrary types as you please. Moreover, they will enable you to customize functions that only work with such custom types. For example

```go
package main

import "fmt"

type customer struct {
	balance int
}

func main() {
	c1 := customer{balance: 100}
	c1.printBalance()
}

func (c customer) printBalance() {
	fmt.Println("The balance is", c.balance)
}
```

The `printBalance` is a function with a _receiver_ of type customer. Only variables with the type `customer` can invoke this function. The `c` parameter in the `printBalance` function is like the `this` keyword in JavaScript.

### Pointers in Go

I used pointers when I learned about them in C++ in college ~ 10 years ago. When I learned that Go has pointers, I was unsure how I felt.

One part of me wasn't excited to see `*` and `&` again all over the place. Another part was happy to take another stab to learn pointers after accumulating some work experience properly. After a week of learning Go, I can safely say I am delighted that my brain is processing pointers now!

My aggressive desire to get it right made pointers click for me. I watched and read these resources multiple times over two days. Whenever I wake up from sleep, I feel how my brain has been working non-stop to process the information and make sense of it.

The resources are:

- Understanding how memory allocation is done in general. It goes over details around the stack and the heap using examples in C++. [video](https://www.youtube.com/watch?v=_8-ht2AKyH4)
- Understanding memory allocation for Go specifically. It answered a lot of my questions around balancing developer experience. For example, should you prioritize code clarity over performance? Should you pass pointers top to bottom or return references bottom to up? How do the GC and the compiler work together? [video](https://www.youtube.com/watch?v=ZMZpH4yT7M0)
- Understanding pointers in Go specifically. It has some nice diagrams and animations to make the concept more approachable. [video](https://www.youtube.com/watch?v=sTFJtxJXkaY)
- Rob Pikes's post explains arrays and slices. It explains how to approach mutations, which indirectly covers pointers. [article](https://go.dev/blog/slices)
- Dissecting pointers in Go by doing all the possible permutations of dereferencing and referencing. [article](https://medium.com/analytics-vidhya/pointers-in-golang-1a679b464849)

In a nutshell, you can't understand pointers without understanding how memory allocation is done and how stack frames are created and when they are terminated.

For the folks who want a glimpse of how pointers work, I will summarize all my learnings from the above resources.

```go
id := 1
```

The memory is like a **huge** warehouse that has many aisles to store millions of small boxes.

Each box _contains_ a value. In the above code, the value inside the box is the number `1`.

Each box _has_ a label that shows the variable's name, the variable's type, and the address of the box in the warehouse. Reflecting on the above code - the label shows `id` as the name, `int` as the type, and `x00023` or a random value as the address.

Such a system helps to _know_ where each box is in the warehouse, which allows us to quickly and efficiently locate and retrieve the box from our huge warehouse.

Since we have established a very shallow understanding, let's move on to the next concept, the stack, and the heap.

The stack is a fixed size in memory. It is used to hold frames. Each frame reflects code execution at one time, and it contains all the values of variables in that context. Once the execution for that frame is done, it will be automatically cleaned up. There is no need for garbage collection to kick-in. If this fixed-size stack gets overwhelmed, there will be a StackOverflow.

The heap is a dynamic size in memory. It is used to hold too large data to be stored in the stack or data created in a frame but needed at a later stage, but such frame will get terminated. The garbage collection relies on the compiler to analyze if it needs to clear memory or not.

I know some folks see the above statements, but they can't wrap their heads around it. That's fine, so let's clarify with some code.

```go
package main

import "fmt"

func main(){
  n := 2
  d := double(n)
  fmt.Println(d)
}

func double(i int) int {
  twoTimes := 2 * i
  return twoTimes
}
```

Let's put on our line-by-line debugger hat.

What happens when you run `go run main.go`?

First, the main goroutine is created.

Such main goroutine has a dedicated stack memory. Initially, it will be empty.

![empty stack](https://res.cloudinary.com/fghurayri/image/upload/v1641993233/faisal.sh/my-initial-impressions-learning-go/hjs0e3lsisumhvpkbd7v.png)

Then, a new frame for the `main` function will be inserted into the stack. All variables inside the main function will get initialized.

![main frame inserted into the stack](https://res.cloudinary.com/fghurayri/image/upload/v1641993233/faisal.sh/my-initial-impressions-learning-go/cvcjpyuffnk4sk6ierh4.png)

Since the `d` variable's result depends on executing a function, a new frame is needed to calculate the value. The `main` frame will pause while the `double` frame is processed.

![main frame is paused while the double frame is processed](https://res.cloudinary.com/fghurayri/image/upload/v1641993233/faisal.sh/my-initial-impressions-learning-go/hnnvbplhaaxqpf7okcju.png)

One super important note is that - the invoked function will work with a **copy** of the values in the parameters. This is why the stack will also have an allocated variable per each parameter. In the above picture, the `n` variable's value is copied and passed as the `i` parameter in the `double` function. This is important to note when we cover working with structs later.

Then, after the value is calculated and returned, there is no need to keep any variables inside the `double` stack. Therefore, it gets automatically cleared, and the associated memory becomes _invalid_ for consumption.

![exeuction returns to the main frame, and the double frame is discarded and freed](https://res.cloudinary.com/fghurayri/image/upload/v1641993233/faisal.sh/my-initial-impressions-learning-go/ckijxgx2dczphnbyrprh.png)

Since we invoke the `Println` function, a new frame is needed.

![main frame is paused while the Println frame is processed](https://res.cloudinary.com/fghurayri/image/upload/v1641993233/faisal.sh/my-initial-impressions-learning-go/r08kfqdsig2dnk9lfiaz.png)

Finally, the `Println` frame is discarded.

![execution returns to the main frame, and the Println frame is discarded and freed](https://res.cloudinary.com/fghurayri/image/upload/v1641993233/faisal.sh/my-initial-impressions-learning-go/pmypjpesi2b9l3mo20wk.png)

And that's a summary of how Go utilizes the stack to do memory allocation.

What about the heap?

Take this snippet of code.

```go
package main

import "fmt"

func main() {
	n := initNum()
	fmt.Println(*n)
}

func initNum() *int {
	number := 2
	return &number
}
```

Let's debug it line by line to see what happens when we run `go run main.go`

First, an empty main goroutine is created.

![empty stack](https://res.cloudinary.com/fghurayri/image/upload/v1641993233/faisal.sh/my-initial-impressions-learning-go/hjs0e3lsisumhvpkbd7v.png)

Then, the n variable is created with a value that depends on executing the `initNum` function.

![the main stack has the n variable that needs initializing through executing the initNum function](https://res.cloudinary.com/fghurayri/image/upload/v1641999465/faisal.sh/my-initial-impressions-learning-go/ctpqspcm7sof2zqqgbaa.png)

Then, to populate the n variable, we need a new frame in the stack to execute the `initNum` function.

![new frame is added to execute the initNum function](https://res.cloudinary.com/fghurayri/image/upload/v1641999572/faisal.sh/my-initial-impressions-learning-go/jozpdm5rm4fxo92ucrqv.png)

The result of executing the `initNum` function is a **reference** to the variable `number` that holds the value `2`.

![the initNum frame is no longer in use, so it is discarded and freed](https://res.cloudinary.com/fghurayri/image/upload/v1641999783/faisal.sh/my-initial-impressions-learning-go/tj81wkigrndy2u1ykk0x.png)

But, we learned when a function execution is done, the frame in the stack is discarded to be freed! What about the variable `number` that holds the value we need in the following line when executing the `Println` function?

Here is when the Go compiler will pause and think - is this variable going to be referenced in any later stage? Such pause is called the escape analysis.

If not, let it be in the stack and get self-cleaned by terminating the frame once the function execution is done. This is as same as explained in the stack section above.

![the Go compiler reaches for the heap to save the value of the number variable](https://res.cloudinary.com/fghurayri/image/upload/v1642000070/faisal.sh/my-initial-impressions-learning-go/nlsmba8aqps7srhx5kkk.png)

If yes, save the variable inside the heap, and pass back the address for this variable to the `initNum` frame, which will return the same address to the `main` frame.

![if the initNum frame gets discarded, then it's ok. we still have a pointer to where the value is stored](https://res.cloudinary.com/fghurayri/image/upload/v1642000167/faisal.sh/my-initial-impressions-learning-go/zkf2iwhx7xq3uqrdxvsm.png)

Now, when the `initNum` execution is done, the related frame can get safely terminated, and we still have access to the value of `n` by dereferencing the pointer!

Go developers need to balance immutability (saving on the stack) and efficiency (saving on the heap).

Circling back to how invoking a function with parameters takes a copy for each parameter. Take this example using structs:

```go
package main

import "fmt"

type customer struct {
	balance int
}

func main() {
	c1 := customer{balance: 100}
	c1.printBalance() // balance is 100
	c1.deduct(10)
	c1.printBalance() // balance is still 100!
}

func (c customer) printBalance() {
	fmt.Println("The balance is", c.balance)
}

func (c customer) deduct(amount int) {
	c.balance = c.balance - amount
}
```

The `deduct` function will have a _copy_ of the customer, and mutating such copy will not reflect on the _original_ customer.

However, changing the `deduct` function to have a _pointer_ to a value of type customer like this will do the trick:

```go
package main

import "fmt"

type customer struct {
	balance int
}

func main() {
	c1 := customer{balance: 100}
	c1.printBalance() // balance is 100
	c1.deduct(10)
	c1.printBalance() // balance is 90 now!
}

func (c customer) printBalance() {
	fmt.Println("The balance is", c.balance)
}

func (c *customer) deduct(amount int) {
	c.balance = c.balance - amount
}
```

In Go, you need to account for pointers if you pass around variables with _value types_ like `struct`, `int`, `bool`, and `float`.

However, you _don't_ need to account for pointers if you pass around variables with _reference types_ like `string`, `slice`, `map`, `channel`, `function`, and `pointer`.

Writing `*c1` says, "Give me the _value_ of c1 that's stored under THIS address" - Traversing a pointer to read the value of the variable. Writing `&c1` says, "Give me the _address_ of c1 that's stored for THIS value" - Getting a pointer to the value of a variable.

Finally, I see some folks say something like, "Don't worry about the stack VS the heap. Let the compiler and the garbage collection do their work. Only investigate and seek perf improvements when there's an apparent need. Optimize for correctness and clarity over pure performance."

I don't know how to approach this topic, but I feel confident _understanding_ how things work behind the scenes. The only way to move forward is to study others' code and build a few things.

### Concurrency in Go

I think it is wise to question whether thinking about concurrency upfront is an anti-pattern or not. Code is a liability.

With that said, to achieve concurrency in Go, you need to utilize Goroutines.

Each routine is a lightweight thread of execution that's run by the Go scheduler.

Every executed program has a _main_ routine capable of creating _child_ routines. However, the program's execution will stop when the main routine is done, and all associated child routines will be terminated.

Hence, you need to account for the lifetime of the child routines not to allow the main routine to finish prematurely. This is done via communication.

The way to communicate between such routines is through typed _channels_.

The syntax to create a channel is pretty easy:

```go
c := make(chan string)
```

My mental model to communicate using channels is (this is not Go code):

```
here <- c <- "hi"
```

If I want to _send_ a message:

```go
c <- "hi"
```

If I want to _receive_ a message:

```go
msg := <- c
```

A more idiomatic way to receive messages is through a semi-infinite loop that will wait to receive a message before continuing to the next iteration as long as the channel is open:

```go
for msg := range c {
  // msg
}
```

Once the channel is closed, this loop will terminate.

I think there's more to cover for goroutines and concurrent programming in Go. However, this may be too early to think about in my Go journey, and I will explore this area in the future.

### Other Notable Mentions

I liked how type conversion is done in Go. It is simple yet rigorous!

```go
package main

import "fmt"

func main() {
	f := 1.6
	i := int(f)

	fmt.Println(f) // 1.6
	fmt.Println(i) // 1
}
```

However, the following snippet will not work.

```go
package main

import "fmt"

func main() {
	i := 1
	s := string(i)

	fmt.Println(i) // 1
	fmt.Println(s) // nothing
}
```

From my research, I found that Go is a strongly typed language. Unlike JavaScript, where you can cast between any types you want, you can't simply convert between _very_ different types like `string` and `int` in Go. However, you can convert between types that are close to each other, like `byte` and `string`, and `int` and `float`.

(I am not happy about this conclusion, as I don't share factual information, but this will do for now!)

Another remark is the lean tooling around Go:

- The language has a built-in code formatter.
- Installing packages is a simple `go get` command.
- Building an app yields a single executable file.
- You can run tests simply by running `go test`. There is no overhead to set up a test runner, an assertion library, or reporting library.

## Conclusion

I think I'm only getting started with my Go journey. After learning Elixir, a lesson learned for me is to **write and share code** as soon as possible. I will take a break for a couple of days, then dive head down into building Tamata - a real-time-distributed-team Pomodoro timer!
