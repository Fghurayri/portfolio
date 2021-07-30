---
title: "How to Add Internationalization (i18n) Solution"
date: "2021-07-30"
slug: "how-to-add-i18n-solution"
metaDesc: "Discuss what is needed to build a comprehensive internationalization (i18n) solution."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1627615679/faisal.sh/build-i18n-solution/cover.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![The world speaks different languages](https://res.cloudinary.com/fghurayri/image/upload/v1627615679/faisal.sh/build-i18n-solution/cover.jpg)

For many applications, internationalization (i18n) is considered a must-have feature. Product professionals, including software engineers, often use the term "Internationalization" to describe _the expectation_ of having a fully native browsing experience based on the user's language, location, or nationality.

For example, English-speaking Americans expect applications they use to be in American English, including the date format and word choices.

Luckily, many frameworks provide support for such a feature out-of-box. This guide aims to explain the building blocks to deliver this solution should you ever need to build it yourself.

The i18n term coins a technical aspect and a non-technical aspect.

## Technical Aspect

For the lack of a better term, "Internationalization" is the first major building block to deliver a fully native experience. It is the **technical** part with three phases.

### Detect The User Type

First, the application should identify the user's language, location, or nationality to serve them accordingly. Developers can achieve that in many ways:

- Serve a default-language version based on the target audience majority (a best guess). Then, allow the user to change such a setting based on their preference. Finally, save this setting in a cookie, local storage, or the DB for subsequent requests.
- Try to detect the timezone from the browser's settings and derive the needed information. For example, if the timezone is Asia/Riyadh, it is safe to assume that the user's language is Arabic.
- Provide i18ned experience based on the URL of the page. For example, `https://example.com/en-US` is the American-English version, and `https://example.com/ar` is the Arabic version.

### Prepare The Infrastructure

The second phase is building the technical infrastructure to maintain and deliver the internationalized version. Of course, the implementation details are different based on the tool/framework you are building on.

In a nutshell, developers need to take the information from the first phase as input and deliver the relevant text version as output. In addition, developers should take into consideration the rules around dates and plurals.

There are many forms for maintenance and delivery. To name a few:

- JSON files. A developer-friendly solution.
- Content Management System (CMS). The most non-developer-friendly solution.
- Spreadsheets. A hybrid solution to help non-developers in working closely with developers.

### Make The UI Adaptive

The third and last phase is the presentational layer. The text flows in different directions based on the language. For instance, English is a Left-To-Right (LTR) language, and Arabic is a Right-To-Left (RTL) language.

For the lack of a universal solution, developers used different workarounds to build an adaptive UI. For example, you can browse Stackoverflow to check how to make a `padding-left` in English becomes `padding-right` in Arabic.

However, thanks to the latest advancements in CSS, you can use a feature called Logical Properties. [This article](https://elad.medium.com/new-css-logical-properties-bc6945311ce7) excellently expands on this point.

**If you are developing for the web, please use the Logical Properties feature in CSS!**

## Non-Technical Aspect

Localization (L10N) is the **copy/text** part. The team in charge of maintaining the different text versions starts utilizing the built technical infrastructure in the i18n step. Localization is the business-as-usual part. It should not impose any technical difficulty.

In conclusion, there is a good chance that the framework you are using already has i18n as a first-class citizen. However, If that is not the case, then the above pointers should enable you to build a custom solution that does the job.
