---
title: "How to Build a Calendar (and Scheduling) Based Feature"
date: "2021-10-20"
slug: "how-to-build-calendar-scheduling-based-feature"
metaDesc: "I explain the primitives of working with calendar and scheduling features by psuedo building a previous system I've worked on."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1634673851/faisal.sh/how-to-build-calendar-scheduling-based-feature/calendar.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Calendar](https://res.cloudinary.com/fghurayri/image/upload/v1634673851/faisal.sh/how-to-build-calendar-scheduling-based-feature/calendar.jpg)

It's interesting how **time** is a first-class citizen in many applications.

In one of the previous projects I have worked on, there has been a requirement to build a scheduling system to allow customers to choose a delivery slot to receive the merchandise they have bought online.

The requirements were:

- A customer can schedule a delivery slot five ahead.
- The delivery schedule is every day of the week, starting from 8:00 am till midnight. Friday is from 2:00 pm till 10:00 pm.
- Each delivery slot is a 30-minutes window.

We built a custom solution by assembling a few date/time tools, using lots of loops to generate the individual slots, adding specific logic to handle edge cases related to slots nearing the end of the schedule, utilizing a cron job that runs periodically to read and write to the DB and run some code.

It worked great and served its purpose.

..... Until we needed to account for real-life scenarios. For example, adding an exception for a recurring event (a holiday where the courier is not working that day), adding a new onetime event (a replacement for a defective item), adding a onetime recurring rule (Ramadan working hours are different), or even rescheduling an event (the customer is unavailable for pickup).

Our custom solution got overstretched. It was an opportunity for the team to reflect on the why and how of the situation.

Recently, I have been building an application with a similar feature set. Such event (no pun intended) allowed me to revisit the problem from a fresh angle.

My goal from this post is to reflect on how to build a calendar and scheduling-based features. To achieve that, I will pseudo-rebuild the aforementioned scheduling component.

P.S. for my previous team - I approve using this approach to refactor the current solution :p

## The iCal Standard

Like other substantial areas in computer science, there is a standard specification about building and communicating calendars and scheduling information. The [Internet Calendaring and Scheduling Core Object Specification (iCalendar)](https://datatracker.ietf.org/doc/html/rfc5545) spec is a reference that explains such a standard in great detail.

The key takeaway from the spec is the `vevent` component.

### The &nbsp `VEVENT` &nbsp Component

In a nutshell, the `vevent` component represents a single event in the calendar - A meeting in your calendar is an `vevent` item.

If you think about it, each event has a start time and end time or duration. The following is the most succinct `vevent` representation of a 30 minutes meeting at 1:00 pm on Monday.

```
BEGIN:VEVENT
DTSTART:20211025T170000Z
DURATION:P30M
SUMMARY:Lunch and Learn
END:VEVENT
```

Since we are working with a living standard, almost all calendars can interpret the above text as expected. Moreover, manually creating that event in Google Calendar using the UI will yield the following `vevent`:

```
BEGIN:VEVENT
DTSTART:20211025T170000Z
DTEND:20211025T173000Z
DTSTAMP:20211020T002925Z
UID:71con4dflma013h@google.com
CREATED:20211020T002801Z
DESCRIPTION:
LAST-MODIFIED:20211020T002801Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Lunch and Learn
TRANSP:OPAQUE
END:VEVENT
```

### The &nbsp `rrule` &nbsp Property

Being able to represent an event is awesome. However, how can we add recurrence into the mix?

Fortunately, the `vevent` component contains the `rrule` property to communicate a repeating pattern for an event. Updating the above event in Google Calendar to occur every Monday will yield the following:

```
BEGIN:VEVENT
DTSTART:20211025T170000Z
DTEND:20211025T173000Z
RRULE:FREQ=WEEKLY;BYDAY=MO
DTSTAMP:20211020T002925Z
UID:71con4dflma013h@google.com
CREATED:20211020T002801Z
DESCRIPTION:
LAST-MODIFIED:20211020T002801Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Lunch and Learn
TRANSP:OPAQUE
END:VEVENT
```

Observe the line `RRULE:FREQ=WEEKLY;BYDAY=MO` which denotes our recurrence rule.

## Psuedo Building The Scheduling System using The iCal Standard

After setting the stage by explaining the iCal standard, we are ready to discuss the approach I would take to rebuild the scheduling system.

First, we need two DB tables.

The first table `schedules` is responsible for holding the different schedules. It has the following schema:

```
id (auto-inc unique Int primary key) -> The ID for each row
title (Text) -> The title that we want to attach to this schedule
schedule_start (DateTime) -> The DateTime for the first slot to be generated
schedule_end (DateTime) -> The DateTime which denotes when the schedule ends
rrule (Text) -> The `rrule` attribute to represent the recurrence pattern
```

The reason to have a `schedule_start` and `schedule_end` attributes is to ease our life. It should help us when we query a certain schedule based on `schedule_start` time. Moreover, we can retire a schedule by giving a past `schedule_end` date.

The second table `delivery_requests` is responsible for holding the scheduled delivery requests created by the customers. It has the following schema:

```
id (auto-inc unique Int primary key) -> The ID for each row
customer_id (Int) -> Foreign key to represent the customer
schedule_id (Int) -> Foreign key to represent the associated schedule
booked_slot (DateTime) -> The slot occurrence selected by the customer
```

Of course, we can add more metadata like the order, the delivery status, and the timestamps.

Any entry in this table should be considered a _confirmed promise to deliver at this time_. In other words, our scheduling system should be responsible for showing valid slots. No invalid slot should be shown to the customer in the first place.

Second, after finishing up the data layer, we can start filling our `schedules` table with the different schedules.

We have at least two delivery slots/schedules: a weekday slot and a Friday slot.

The reason for this separation is the different delivery windows between these days. In other words, the `rrule` property is different between them.

The following is the weekday slot `rrule` - Every day except Friday, from 8:00 am till midnight, where each slot is a 30 minutes window.

```
RRULE:FREQ=MINUTELY;INTERVAL=30;WKST=MO;BYDAY=MO,TU,WE,TH,SA,SU;BYHOUR=8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23
```

Observe how I have treated each delivery slot as a virtual potential event.

The reason for such treatment is - Feeding this into an iCal rrule based tool like [rSchedule](https://gitlab.com/john.carroll.p/rschedule) will allow for generating a 30-minutes slot everday between 8:00 am till midnight except on Fridays.

```js
const vEvent = VEvent.fromICal(
  `DTSTART:20211025T120000Z;\nRRULE:FREQ=MINUTELY;INTERVAL=30;WKST=MO;BYDAY=MO,TU,WE,TH,SA,SU;BYHOUR=8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23`
)[0];

const slots = vEvent
  .occurrences({ end: fiveDaysFromNow() })
  .toArray()
  .map((date) => date.toISOString());

console.log(slots);
/*
[
  "Mon Oct 25 2021 08:00:00 GMT-0400 (EDT)",
  "Mon Oct 25 2021 08:30:00 GMT-0400 (EDT)",
  "Mon Oct 25 2021 09:00:00 GMT-0400 (EDT)",
  ...,
]
/*
```

Third, after we generate such slots on the fly, we show them to the customer. Then, the customer can select the slot that suits them.

Finally, the selected slot will be saved in the `delivery_requests` table.

If we need to add an exception day to the above schedule, we can add the `exdate` property to the above `rrule` to exclude that day from generating the normal delivery slots.

```
RRULE:FREQ=MINUTELY;INTERVAL=30;WKST=MO;BYDAY=MO,TU,WE,TH,SA,SU;BYHOUR=8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23
EXDATE:20211026
```

Moreover, we can add `rdate` to add a one-time date or `exrule` to except a certain recurrence pattern.

I'm sure many other details need to be ironed out. However, this is a great PoC to test out.

The main benefit of this solution is the far less custom code than most scheduling systems.

There is no need to custom-build a data structure to feed into a function containing a `for` loop to generate each slot.

There is no need to crash into edge cases related to slots nearing the end of the schedule.

There is no need to generate each slot ahead of time, store it in the DB, and change the `status` from `available` to `booked` etc.

Less code is a win!

Another nice thing is that if the product team asked to add an event to the customer’s calendar once they book a slot, either for a recurring purchase or a one time purchase, such a feature should be easier to build and maintain since you are following a standard.

## Further Readings

To get a deeper knowledge about building scheduling systems, I recommend the following resources:

- [The iCalendar RFC - 5545](https://www.kanzaki.com/docs/ical/): Easier version to navigate the spec for working with calendars and schedules
- [Recurrence Overview](https://github.com/bmoeskau/Extensible/blob/master/recurrence-overview.md): Anecdotes on how to build scheduling apps.
- [ice_cube](https://github.com/seejohnrun/ice_cube): A wonderful Ruby gem to support the iCal standard.
