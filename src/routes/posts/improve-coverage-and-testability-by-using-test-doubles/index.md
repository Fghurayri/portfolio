---
title: "Improve Coverage & Testability by using Test Doubles"
date: "2021-09-17"
slug: "improve-coverage-and-testability-by-using-test-doubles"
metaDesc: "I share some personal anecdotes around testability and coverage in software engineering."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1631558783/faisal.sh/improve-coverage-and-testability-by-using-test-doubles/cover.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![ambitious motorcrosser](https://res.cloudinary.com/fghurayri/image/upload/v1631558783/faisal.sh/improve-coverage-and-testability-by-using-test-doubles/cover.jpg)

There’s a whole career dedicated to folks who enjoy living by the extremes - the stunt double in the movies industry.

A stunt double is a person who looks like one of the actors that they can step in and perform stunts instead of them. Such scenes may include falling from buildings, rolling within cars, or getting caught on fire. Like the actor, the stunt needs to study the script and talk with others to understand the role. Did you know that Jackie Chan started his acting career as a stunt double?

> You might ask now - what a stunt double got to do with software engineering?

If you think about it, the main reason behind needing a stunt double is getting a perfect shot for the scene while protecting the star actor from potential risks. The success is highly influenced by the quality of shooting and performing the stunt. Any mistakes can cost money and weeks to correct.

In software engineering, the same concept holds correct. There are many positive and negative consequences from rapidly building, deploying, and maintaining software. 

On the plus side, it is exciting to keep improving and iterating. For example, adding new features and fixing critical bugs can eventually help in lowering customer care tickets and increasing monthly revenue. 

However, like other areas in life, there's a diminishing marginal utility with every additive decision. In other words, adding features might increase the technical debt, making it harder to keep iterating without taking a step back. Moreover, performing a successful hotfix might have introduced a newly uncovered regression bug, keeping the team in a vicious cycle.

Thankfully, many excellent software engineering practices help teams to navigate through the pains of maintaining software.

### Test Double

In preparing to write this post, I researched the differences between mocks and stubs since I use them interchangeably. I found [this wonderful article by Martin Fowler](https://martinfowler.com/bliki/TestDouble.html) laying out "Test Double" from Gerard Meszaros.

I immediately stopped researching, decided to take a step back, and focus on the big picture - the difference between stubs and mocks doesn't matter.

> Test double serves as a comparable testing version of an external production system to facilitate the testing. It can be mock, stub, fake, or dummy.

Ideally, as part of internal tooling, engineering teams should prioritize building **test doubles** to improve the testability of their systems. Improved testability means increased coverage and vice versa.

If you want to learn more about this topic, I highly recommend reading the shared article. On the other hand, if you want to know my controversial take on coverage, check out my previous post - [should you care about coverage](https://faisal.sh/posts/should-you-care-about-coverage).

### Personal Anecdotes

Instead of lecturing about the technical details behind test doubles, I want to share some of the pitfalls and the learned lessons. The goal is to spur your thinking about what is currently painful for your team to test and encourage you to fix it (testers will love you!).

Like the real world, integrating with 3rd party systems is not always a pleasurable experience. 

#### When Testing Double Worked

The first story is about a system that was facilitating phone number porting between telecom operators. This system was one of the most complex systems to test and debug in my career for the following reasons:

- There was no environment dedicated for testing. You work on the production.
- To perform the whole journey, there are at least four different external systems for stakeholders at one time. When I say external, I mean governmental agencies and telecom operators.
- Since you work on production, this entails paying real money and using real credentials with every scenario.
- Completing some happy journies takes 1-5 business days for the external stakeholders to process requests.
- Completing unhappy scenarios were almost impossible. We can't ask the government to make a real person teammate deported!
- Not complying with governmental SLAs due to bugs in "our system" resulted in fines.
- Our application was a React Native **JavaScript** mobile application. Mistakes cost much more than conventional web apps since the team will need a new release (with approvals from Apple and Google) with potential force upgrades for every critical bug.
- Our product was relying on this feature to improve its market share.

It was a stressful period. Thankfully, we had a supportive culture, and we waded this together as a team.

After a few months, we got the feature working as expected. However, our team re-raised the concern that they can't maintain and test this crucial part of the application without spending money and waiting for days. Moreover, non of the unhappy test cases are testable.

I volunteered to lead the effort of fixing this issue. The approach was studying the logs since launching the feature, adding more logs to facilitate the debugging, tying logs back to customer care tickets, and reading and fixing our code along the way.

Finally, we have built the **test double** system comprising six different entities to support all the cases requested by the testing team.

After a two-week sprint, the team's morale boosted thanks to enabling to test all the journeys in seconds instead of days and for free instead of using real money. The testing double worked.


#### When Testing Double Wouldn't Work

One technique to generate test cases is traversing the branches of a journey and manipulating all the variables along your way. For example, if you want to test a payment flow, you need test cases to cover every payment method and account for the possible hiccups like not enough balance, double payments, or simple timeouts.

However, in the real world, not all scenarios are testable for various reasons. 

The second story is about a bug in the integration with the payment gateway. At that time, my team couldn't test a scenario where the auto-renew time was due for a customer using a Mada card (a national payment network) with an insufficient balance.

The reason was simply that our local payment gateway provider couldn't provide us with the test data to do the testing. So instead, they responded with an example JSON response for such a case to handle it.

The team decided to take this up to the product leadership. There was an executive decision to deploy and keep an eye on it. Everyone but the testers were happy with that decision. Testers were thinking - how the hell are we going to vet the fix if there was an issue?

After a few months, we found that the shared JSON wasn't accurate. As a result, we have lost money by renewing subscriptions even with unsuccessful payments using Mada with insufficient balance. We fixed it, eventually.

Reflecting on that case, building a **test double** later on wouldn't matter. Like the previous case, we didn't know how the 3rd party would work until we deployed to production. However, the testability pain and the potentially unlocked coverage are incomparable.


### Conclusion

It is important to be pragmatic about when to build a double test or not. I highly recommend investing in internal tooling to improve testability and coverage when there's a value. I hope you found this post useful.
