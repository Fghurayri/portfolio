---
title: "Should You Care About Coverage"
date: "2021-07-26"
slug: "should-you-care-about-coverage"
metaDesc: "The difference between test coverage VS code coverage and should you care."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1627237027/faisal.sh/should-you-care-about-coverage/reflection.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![The same, only different](https://res.cloudinary.com/fghurayri/image/upload/v1627237027/faisal.sh/should-you-care-about-coverage/reflection.jpg)

> To my friend, mentor, and expert tester; [Joost Rooijmans](https://www.linkedin.com/in/rooymans?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAAGH1QBKSBZXXLN1qjJnAdn8X_s5690960&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BRF90AKZDSGKvr1uvgNNEbQ%3D%3D) - Thank you.

## Communication is not trivial

In their book "A Practical Guide to Testing in DevOps." Katrina Clokie discusses what is needed to adopt a healthy testing culture in multi-disciplinary, highly-skilled, interconnected product teams. The first logical step is establishing a shared context for the whole team to understand what testing _really_ means. I find her approach to achieve this feat to be brilliant.

They suggest conducting a one-hour workshop for the whole team - product managers, designers, developers, operations, support, and testers to gauge the current comprehension around the **implemented** but not necessarily _documented_ testing strategy by visualizing it.

To start, the session leader draws a timeline from **idea** to **production**. Then, they ask the team to name every _testing_ activity and _who_ should perform it by filling up the three differently-colored sticky notes according to the following rules:

- Purple - This type of testing is in our test strategy. We are doing it
- Pink - This type of testing is in our test strategy. **But** we are not doing it
- Yellow - This type of testing **is not in our test strategy** but should be

![Workshop to uncover the different ideas behind testing](https://res.cloudinary.com/fghurayri/image/upload/v1627241366/faisal.sh/should-you-care-about-coverage/workshop.png)

Then, the whole team can reflect on how people will have their other ideas about testing, the types of testing, and when each type should or should not be occurring by answering the following questions:

- Are there groupings that include different colored sticky notes? Why?
- Have people used different terminology to refer to the same type of test activity? Why?
- Are there activities in the documented test strategy that are not implemented? Why?
- What activities are missing from the strategy? Do we want to include these?

I once had conducted this mini-workshop by doing multiple small talks with my colleagues. I was amused by how every person has their ideas around testing.

## But Should We Care About Coverage

I share this fascinating story to make you think about what does _coverage_ means.

Search for the word coverage in the testing dictionary. For example, you can find code coverage, test coverage, path coverage, branch coverage, statement coverage, decision coverage, condition coverage, and _name your criteria_ coverage.

In my opinion, all these types of coverage are the same but different. Moreover, I think there are two types of coverage:

- Can be measured with tools
- Can not be measured with tools

Take this classic example - a division only calculator:

![Division only calculator](https://res.cloudinary.com/fghurayri/image/upload/v1627243777/faisal.sh/should-you-care-about-coverage/division-only-calculator.png)

A programmer can build the logic as follows:

```js
const div = (a, b) => a / b;
```

If you have a _tool_ that measures coverage and you have only the following test, such a tool will yield a 100% _code coverage_

```js
const expected = 5;
const actual = div(10, 2);
assert(expected === actual);
```

However, you can easily spot the defect in the logic. The app will instantly crash if you run `div(10/0)`. Achieving 100% code coverage doesn't mean that you have 100% **test coverage**.

So should you care about coverage? I don't know. Every team should decide the what, how, and why of their testing strategy. In the above example, I uncovered how tool-reported coverage could be deceiving in making assumptions about the state of an application.

Code coverage is beneficial to detect unreachable code and to add confidence about handling what we know. On the other hand, test coverage should widen the surface of things we should know, but you can never truly measure it.

In conclusion, I think this should always be a rhetorical question. However, to make sound decisions, I encourage you to learn more about the [principles of software testing](https://www.guru99.com/software-testing-seven-principles.html).
