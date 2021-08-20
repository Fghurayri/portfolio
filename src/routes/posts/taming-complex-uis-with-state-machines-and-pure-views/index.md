---
title: "Taming Complex UIs with State Machines and Pure Views"
date: "2021-08-20"
slug: "taming-complex-uis-with-state-machines-and-pure-views"
metaDesc: "I introduce state machines and their benefits by showing how to manage a complex interactive map UI."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1629473853/faisal.sh/taming-ui-complexity-with-state-machines/jabal-alfil.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Jabal Alfil (Elephant Rock) - Al Ula, Saudi Arabia](https://res.cloudinary.com/fghurayri/image/upload/v1629473853/faisal.sh/taming-ui-complexity-with-state-machines/jabal-alfil.jpg)

> This article is pretty long. I wrote the step-by-step guide that I wish were available when I started learning XState. It shows how to approach modeling a state machine, how to apply this approach using XState, and finally, how to integrate everything into the UI. I hope the pace will be right for you.

Have you ever built a web form to allow a user to submit data? If yes, do you think this is a simple or a complex task?

I would agree with both answers.

![Payment form](https://res.cloudinary.com/fghurayri/image/upload/v1629338292/faisal.sh/taming-ui-complexity-with-state-machines/form.png)

A form is _simply_ a collection of fields to capture data from the user.

However, the form's complexity starts from a high baseline and exponentially increases by the requirements for each entry. For example, a developer needs to check and communicate to the user the validity of inputs before submissions, handle the submission loading, and gracefully allow the user to correct errors after submission.

Since complexity is a relative term, it is essential to establish a standardized way of simplifying, building, and communicating complex systems. One of the most helpful tools to do that is state machines.

## What are State Machines

If you have studied CS or searched the web for state machines, you will find it explained by something related to math and computation.

If that puts you off, forget such a definition for a bit.

In easy words: a state machine is:

- A blueprint for the several states the app can be in
- to show the expected events that the app should process while being in each state
- and highlight which events are responsible for moving the app between these states

Let take an example of a microwave:

![Microwave State Machine](https://res.cloudinary.com/fghurayri/image/upload/v1629344105/faisal.sh/taming-ui-complexity-with-state-machines/microwave.png)

The above chart is easy to digest.

The squares are the states a microwave can be. The arrows are the events that the machine can process for each state. For this particular chart, all events are causing a transition from a state to another state.

One highlight is that firing the `START_PRESSED` event while the microwave is `cooking` will not do anything - the state machine doesn't account for that.

However, suppose the microwave's product team requested to add 30 seconds when the `START_PRESSED` event happens while `cooking`. Then, it is as simple as adding that transition to allow for it and incrementing 30 seconds when this event occurs.

If a system is deterministic, it is easy to reason about; therefore, it is simpler to extend and maintain.

## UI = State + Event

If you are developing UI using React or a similar tool, you are probably already following a functional programming model in some of your components.

```jsx
function LogLink({ isLoggedIn }) {
  return <nav>{isLoggedIn ? <Logout /> : <Login />}</nav>;
}
```

The view (UI) depends on the state `isLoggedIn` that can get changed by a `LOGIN` or `LOGOUT` events somewhere else in the system.

This pattern increases maintainability - If the logic to determine whether the user is logged in or not changes, it's outside the scope of this view. In addition, it helps with testability - You can quickly test this view by supplying a `true` or `false` to the function. Finally, it is deterministic - You know that you will either see the login link or the logout link. Never both. Never neither.

Here is a [great article](https://www.freecodecamp.org/news/the-revolution-of-pure-views-aed339db7da4/) that expands on the benefits of building pure UIs.

Pure UIs help you to simplify complex views. State machines help you build pure UIs.

## Practical Example for Pure UIs and State Machines

Let's start writing some code and discuss what we are doing. First, picking up from where we ended in my last article, [How to Build Geospatial Apps](https://faisal.sh/posts/how-to-build-geospatial-apps), we have a non-interactive map displayed with a hardcoded marker and a popup.

![Our PoC From the Last Article](https://res.cloudinary.com/fghurayri/image/upload/v1628992108/faisal.sh/geospatial-apps-primitives/react-ui.png)

> Next Door is geospatial app that allows homeowners to list things they no longer need for their community.

Let's lay out our goals:

- Make the map interactive by allowing the user to pan to explore
- When the user opens the app for the first time, automatically start fetching the listings based on the map's viewport
- Allow the user to fetch listings near them by clicking a button
- Only ask for the user's location when they request to fetch listings near them
- Show to the user a loading state when they are fetching listings
- Disallow map interactivity when the user is fetching listings
- Only show a popup if the user clicked a marker
- While showing a popup, disallow map interactivity
- Dismiss the popup if the user clicks again on the marker, the popup, or the map
- Clicking anywhere in the map should show a form to add a new listing in that location
- Show loading state while submitting the listing
- Disallow map interactivity while submitting

That's a sizable list of complex UI requirements. So let's start tackling them using pure UIs and state machines!

### Building The State Machine

A great practice when building UIs is to model the application logic outside the view. Let's model our state machine and start interacting with it before writing a single line of React code. For that, I am going to use XState.

XState is a state machine library in JavaScript and TypeScript. I think it has the best feature set, documentation, and community.

As a test lap, let's model our microwave state machine using XState

```js
import { createMachine } from "xstate";

export const microwaveMachine = createMachine({
  id: "microwave",
  initial: "idle",
  states: {
    idle: {
      on: {
        PRESSED_START: "cooking",
      },
    },
    cooking: {
      on: {
        PRESSED_OFF: "idle",
        DOOR_OPENED: "idle",
        TIMED_OUT: "idle",
      },
    },
  },
});
```

Taking this machine to the [XState visualizer](https://stately.ai/viz) will produce the following interactive diagram.

![Microwave Machine Visualized](https://res.cloudinary.com/fghurayri/image/upload/v1629354677/faisal.sh/taming-ui-complexity-with-state-machines/microwave-machine-viz.gif)

Pretty nice!

> Feel free to copy-paste the machine into the visualizer and play around to feel how things work.

Going back to our app - First of all, let's lay out the high-level states.

Create a new file named `mapMachine.js` and add the following snippet

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {},
  },
});
```

Why do we have an `init` state before the `ready` state?

Since the requirement asks to automatically fetch the listings within the user's viewport when they open the app, we will need an _initialization_ step to allow the app to render the map before we use it. Only then will it be ready for subsequent usage.

Next, let's start digging deeper by expanding the `ready` state.

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {
      initial: "loading",
      states: {
        loading: {},
        viewing: {},
        adding: {},
      },
    },
  },
});
```

Here we are dipping our toes into **statecharts** by utilizing hierarchical states.

Why are we doing nested states now?

To manage the [state explosion](https://statecharts.dev/state-machine-state-explosion.html) problem that is about to start when we go beyond a handful of states with similar characteristics.

> Statecharts extend the state machine concept and add a lot of power in the real world.

Once the transition from `init` to `ready` happens, the map will initially be in the `ready.loading` state.

Let's expand this `ready.loading` state further

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {
      initial: "loading",
      states: {
        loading: {
          initial: "byArea",
          states: {
            byArea: {},
            nearMe: {},
          },
        },
        viewing: {},
        adding: {},
      },
    },
  },
});
```

Here we describe that we should have two different types of loading - either by area (the viewport of the map) or by user's location.

Now, we need a mechanism to perform the search by area.

XState encourages you to write your business logic in `services`. Moreover, to aid in debugging and visualizing, it advises referencing each service by a string representing the service's name.

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {
      initial: "loading",
      states: {
        loading: {
          initial: "byArea",
          states: {
            byArea: {
              invoke: {
                id: "loadingByArea",
                src: "fetchListingsByArea",
                onDone: {
                  actions: "saveListings",
                  target: "viewing",
                },
                onError: {
                  actions: "logError",
                  target: "viewing",
                },
              },
            },
            nearMe: {},
          },
        },
        viewing: {},
        adding: {},
      },
    },
  },
});
```

We introduced two concepts here.

First, how you can write a `service`. XState allows for multiple types of services. You can invoke a promise, a callback, an observer, or even another machine. From XState point of view, it doesn't matter. Any option is just an [actor](https://www.brianstorti.com/the-actor-model/).

To ease the learning curve, I will go with using promises. Observe the `onDone` and `onError` transitions. They are what they look like - each is a destination based on the promise's resolve or rejection. Either way, you will receive the event object with the data returned from the promise.

Second, XState has the concept of `actions`. If you have experience with the reducer pattern by using Redux or useReducer, unlearn that for a bit.

In a nutshell, `actions` are your opportunity to run code at a specific time between transitions. For example, in the above snippet, we save the result of fetched listings when they are resolved or log an error if something went wrong.

Let's keep our momentum and revisit both concepts of `services` and `actions` later on.

Now, If you copy-pasted the above machine into the visualizer, you will see the following error message:

![Error](https://res.cloudinary.com/fghurayri/image/upload/v1629393414/faisal.sh/taming-ui-complexity-with-state-machines/error.png)

The reason for this error is that we are telling the `fetchListingsByArea` service that, after you are finished, regardless if you were a success or not, go to the `viewing` state. This request is fair and expected!

The problem here is that `viewing` is not a sibling for the `byArea` state under the `loading` state. Instead, it is nested up in the state tree.

Judging by the error message, there seems to be a dot notation access to traverse the nested state. Let's use such dot notation and fix that error by assigning an `id` to the `ready` grandparent state. Then we can do the following

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {
      id: "ready",
      initial: "loading",
      states: {
        loading: {
          initial: "byArea",
          states: {
            byArea: {
              invoke: {
                id: "loadingByArea",
                src: "fetchListingsByArea",
                onDone: {
                  actions: "saveListings",
                  target: "#ready.viewing",
                },
                onError: {
                  actions: "logError",
                  target: "#ready.viewing",
                },
              },
            },
            nearMe: {},
          },
        },
        viewing: {},
        adding: {},
      },
    },
  },
});
```

Now, this fix should clear the error!

Let's shift gears into modeling the `viewing` state. Again, as we did with `loading`, there will be multiple nested states.

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {
      id: "ready",
      initial: "loading",
      states: {
        loading: {
          initial: "byArea",
          states: {
            byArea: {
              invoke: {
                id: "loadingByArea",
                src: "fetchListingsByArea",
                onDone: {
                  actions: "saveListings",
                  target: "#ready.viewing",
                },
                onError: {
                  actions: "logError",
                  target: "#ready.viewing",
                },
              },
            },
            nearMe: {},
          },
        },
        viewing: {
          initial: "viewingMap",
          states: {
            viewingMap: {},
            viewingListing: {},
          },
        },
        adding: {},
      },
    },
  },
});
```

We have added two different states to distinguish between viewing the map or viewing the listing.

Why we did that?

Because when we click on the map while _viewing the map_, we need to add a new listing there. However, when we click on the map while _viewing a listing_, we need the relevant opened marker popup to get dismissed.

Finally, before we start filling out our events in each state, let's model the `adding` state.

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {
      id: "ready",
      initial: "loading",
      states: {
        loading: {
          initial: "byArea",
          states: {
            byArea: {
              invoke: {
                id: "loadingByArea",
                src: "fetchListingsByArea",
                onDone: {
                  actions: "saveListings",
                  target: "#ready.viewing",
                },
                onError: {
                  actions: "logError",
                  target: "#ready.viewing",
                },
              },
            },
            nearMe: {},
          },
        },
        viewing: {
          initial: "viewingMap",
          states: {
            viewingMap: {},
            viewingListing: {},
          },
        },
        adding: {
          initial: "editing",
          states: {
            editing: {},
            submitting: {},
          },
        },
      },
    },
  },
});
```

Now we should have the following in the visualizer.

![Checkpoint 1](https://res.cloudinary.com/fghurayri/image/upload/v1629395927/faisal.sh/taming-ui-complexity-with-state-machines/state-machine-viz-1.gif)

Excellent progress!

But as you can see, we can't traverse between different states because we have not yet declared the anticipated events that should result in state transition. So let's start doing that now.

```js
import { createMachine } from "xstate";

export const mapMachine = createMachine({
  id: "mapMachine",
  initial: "init",
  states: {
    init: {
      on: {
        MAP_LOADED: "ready",
      },
    },
    ready: {
      id: "ready",
      initial: "loading",
      states: {
        loading: {
          initial: "byArea",
          states: {
            byArea: {
              invoke: {
                id: "loadingByArea",
                src: "fetchListingsByArea",
                onDone: {
                  actions: "saveListings",
                  target: "#ready.viewing",
                },
                onError: {
                  actions: "logError",
                  target: "#ready.viewing",
                },
              },
            },
            nearMe: {},
          },
        },
        viewing: {
          initial: "viewingMap",
          states: {
            viewingMap: {
              on: {
                MAP_CLICKED: {
                  target: "#ready.adding",
                  actions: "saveClickedLocation",
                },
                MARKER_CLICKED: {
                  target: "viewingListing",
                  actions: "saveSelectedMarker",
                },
              },
            },
            viewingListing: {
              on: {
                MAP_CLICKED: {
                  target: "viewingMap",
                  actions: "clearSelectedMarker",
                },
                MARKER_CLICKED: {
                  target: "viewingMap",
                  actions: "clearSelectedMarker",
                },
              },
            },
          },
        },
        adding: {
          initial: "editing",
          states: {
            editing: {
              on: {
                SUBMIT: "submitting",
                CANCEL: "#ready.viewing.viewingMap",
              },
            },
            submitting: {
              invoke: {
                id: "addNewListing",
                src: "addNewListing",
                onDone: {
                  target: "#ready.viewing.viewingMap",
                  actions: "saveNewListing",
                },
                onError: {
                  target: "editing",
                  actions: "logError",
                },
              },
            },
          },
        },
      },
    },
  },
});
```

The above increment should allow you to complete the whole flow of:

- Initializing the map
- Automatically performing the search once the map is loaded
- After that, the user can:
  - Click on a marker to view its popup. If the user clicked on the map or on any marker, then dismiss the popup
  - Click on any location to add a new listing in that location
- Surface the loading states for loading listings and adding listings

> In a few lines of code and within a centralized place, we achieved most of the user requirements and graphed the states and transitions using the visualizer!

This is pretty powerful, isn't it!

Now, I want to circle back to the concept of `services` and `actions`.

As you can see, we are hardcoding the name of all services and actions into the machine. Such hardcoding is good to help to make the machine serializable. Moreover, it helps in debugging, visualizing, and providing the ability to reuse this machine with different UIs (React, React Native, Vue, or any different framework).

Eventually, at some point, we need to tell the machine the definition of those functions.

We can achieve that by adding a `configuration` object as a second parameter to the `createMachine` function.

```js
import { createMachine, assign } from "xstate";

export const mapMachine = createMachine(
  {
    // ... the previous machine definition
  },
  {
    actions: {
      logError: (ctx, ev) => console.log("Error", ev),
      saveListings: assign({
        markers: (ctx, ev) => ev.data.features,
      }),
      saveClickedLocation: assign({
        clickedLocation: (ctx, ev) => ev.clickedLocation,
      }),
      clearClickedLocation: assign({
        clickedLocation: (ctx, ev) => ({ lng: undefined, lat: undefined }),
      }),
      saveSelectedMarker: assign({
        selectedMarker: (ctx, ev) => ev.marker,
      }),
      clearSelectedMarker: assign({
        selectedMarker: (ctx, ev) => {},
      }),
      saveNewListing: assign({
        markers: (ctx, ev) => ctx.markers.concat(ev.data),
      }),
    },
    services: {
      fetchListingsByArea: async (ctx, ev) => {
        // The network call to fetch by area
        const data = { features: [] };
        return Promise.resolve(data);
      },
    },
  }
);
```

Here we are introducing a couple of new things.

First is the assign action - a special XState action that allows us to save data into the machine. So, for example, the `saveListings` action gets executed because the `fetchListingsByArea` was just resolved with `{features: []}`, allowing us to save these listings into the machine.

Second is the `context`, which I abbreviated above as `ctx` - where the above `assign` function will save things to. You can provide an initial context in the machine definition. Let's do that:

```js
import { createMachine, assign } from "xstate";

export const mapMachine = createMachine(
  {
    // the initial context
    context: {
      markers: [],
      clickedLocation: { lng: undefined, lat: undefined },
      selectedMarker: undefined,
    },
    // ... the machine definition
  },
  {
    actions: {
      logError: (_ctx, ev) => console.log("Error", ev),
      saveListings: assign({
        markers: (_ctx, ev) => ev.data.features,
      }),
      saveClickedLocation: assign({
        clickedLocation: (ctx, ev) => ev.clickedLocation,
      }),
      clearClickedLocation: assign({
        clickedLocation: (_ctx, ev) => ({ lng: undefined, lat: undefined }),
      }),
      saveSelectedMarker: assign({
        selectedMarker: (_ctx, ev) => ev.marker,
      }),
      clearSelectedMarker: assign({
        selectedMarker: (_ctx, _ev) => {},
      }),
      saveNewListing: assign({
        markers: (ctx, ev) => ctx.markers.concat(ev.data),
      }),
    },
    services: {
      fetchListingsByArea: async (_ctx, _ev) => {
        // The network call to fetch by area
        const data = { features: [] };
        return Promise.resolve(data);
      },
    },
  }
);
```

Let's have a new checkpoint. Here is the latest code for our `mapMachine.js` file:

```js
import { createMachine, assign } from "xstate";

export const mapMachine = createMachine(
  {
    id: "mapMachine",
    context: {
      markers: [],
      clickedLocation: { lng: undefined, lat: undefined },
      selectedMarker: undefined,
    },
    initial: "init",
    states: {
      init: {
        on: {
          MAP_LOADED: "ready",
        },
      },
      ready: {
        id: "ready",
        initial: "loading",
        states: {
          loading: {
            initial: "byArea",
            states: {
              byArea: {
                invoke: {
                  id: "loadingByArea",
                  src: "fetchListingsByArea",
                  onDone: {
                    actions: "saveListings",
                    target: "#ready.viewing",
                  },
                  onError: {
                    actions: "logError",
                    target: "#ready.viewing",
                  },
                },
              },
              nearMe: {},
            },
          },
          viewing: {
            initial: "viewingMap",
            states: {
              viewingMap: {
                on: {
                  MAP_CLICKED: {
                    target: "#ready.adding",
                    actions: "saveClickedLocation",
                  },
                  MARKER_CLICKED: {
                    target: "viewingListing",
                    actions: "saveSelectedMarker",
                  },
                },
              },
              viewingListing: {
                on: {
                  MAP_CLICKED: {
                    target: "viewingMap",
                    actions: "clearSelectedMarker",
                  },
                  MARKER_CLICKED: {
                    target: "viewingMap",
                    actions: "clearSelectedMarker",
                  },
                },
              },
            },
          },
          adding: {
            initial: "editing",
            states: {
              editing: {
                on: {
                  SUBMIT: "submitting",
                  CANCEL: "#ready.viewing.viewingMap",
                },
              },
              submitting: {
                invoke: {
                  id: "addNewListing",
                  src: "addNewListing",
                  onDone: {
                    target: "#ready.viewing.viewingMap",
                    actions: "saveNewListing",
                  },
                  onError: {
                    target: "editing",
                    actions: "logError",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      logError: (_ctx, ev) => console.log("Error", ev),
      saveListings: assign({
        markers: (_ctx, ev) => ev.data.features,
      }),
      saveClickedLocation: assign({
        clickedLocation: (ctx, ev) => ev.clickedLocation,
      }),
      clearClickedLocation: assign({
        clickedLocation: (_ctx, ev) => ({ lng: undefined, lat: undefined }),
      }),
      saveSelectedMarker: assign({
        selectedMarker: (_ctx, ev) => ev.marker,
      }),
      clearSelectedMarker: assign({
        selectedMarker: (_ctx, _ev) => {},
      }),
      saveNewListing: assign({
        markers: (ctx, ev) => ctx.markers.concat(ev.data),
      }),
    },
    services: {
      fetchListingsByArea: async (_ctx, _ev) => {
        // The network call to fetch by area
        const data = { features: [] };
        return Promise.resolve(data);
      },
    },
  }
);
```

And here is what the visualizer looks like (it's a large gif, I suggest opening it in a new tab)

![Checkpoint 2](https://res.cloudinary.com/fghurayri/image/upload/v1629404895/faisal.sh/taming-ui-complexity-with-state-machines/state-machine-viz-2.gif)

Now, our machine is 80% ready to be used. We are missing a few things like allowing the user to manually fetch listings and controlling when the user should or shouldn't pan the map. We will fill those gaps as we go.

Let's go ahead and shift our focus to the UI and circle back to the machine when we need that.

### Building the UI

Let's start developing our UI and connecting it to the machine.

From where we stopped at, we have three components:

**Map**

Responsible for rendering a map and showing all markers and popups

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL from "react-map-gl";
import Marker from "./Marker";
import Popup from "./Popup";

export function Map() {
  return (
    <ReactMapGL
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      height="100%"
      width="100%"
      longitude={-80.897662}
      latitude={35.484788}
      zoom={13}
    >
      <Marker />
      <Popup />
    </ReactMapGL>
  );
}
```

**Marker**

Responsible for showing a marker on the map.

```jsx
import { Marker as ReactMapGLMarker } from "react-map-gl";

export function Marker() {
  return (
    <ReactMapGLMarker longitude={-80.897662} latitude={35.484788}>
      <div
        style={{
          height: "2rem",
          width: "2rem",
          borderRadius: "50%",
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ⌨️
      </div>
    </ReactMapGLMarker>
  );
}
```

**Popup**

Responsible for showing a popup on the map.

```jsx
import { Popup as ReactMapGLPopup } from "react-map-gl";

export function Popup() {
  return (
    <ReactMapGLPopup longitude={-80.897662} latitude={35.484788}>
      <div>
        <pre>Almost new Apple keyboard</pre>
      </div>
    </ReactMapGLPopup>
  );
}
```

And finally, the `/pages/index.js` to render everything

```jsx
import { Map } from "../lib/components/Map";

export default function Page() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Map />
    </div>
  );
}
```

Here is how we are looking so far

![Our PoC From the Last Article](https://res.cloudinary.com/fghurayri/image/upload/v1628992108/faisal.sh/geospatial-apps-primitives/react-ui.png)

Since we want to utilize our state machine to centralize state, data, and events, let's move the hardcoded coordinates that resemble the center of the map from the `<Map />` to the `context` of the `mapMachine`.

```js
export const mapMachine = createMachine(
  {
    context: {
      viewport: {
        height: "100%",
        width: "100%",
        longitude: -80.897662,
        latitude: 35.484788,
        zoom: 13,
      },
      markers: [],
      clickedLocation: { lng: undefined, lat: undefined },
      selectedMarker: undefined,
    },
    // machine definition
  },
  {
    // machine configuration
  }
);
```

Next, to read this viewport, I need to somehow have access to it inside the `<Map />` component.

To achieve that, let's update the parent page component `pages/index.js` file. I will bring in the machine, pass down the `state` that holds all the information, and the `send` function, which we can use to trigger the events.

Moreover, I will add a log statement to see how the state is going to change when an event is triggered.

```jsx
import { useMachine } from "@xstate/react";
import { Map } from "./Map";
import { mapMachine } from "./mapMachine";

export default function Page() {
  const [state, send] = useMachine(mapMachine);
  console.log(state.value);
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Map state={state} send={send} />
    </div>
  );
}
```

Now, in the `Map.js` component, I will have access to the saved viewport by accessing the context from the state

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL from "react-map-gl";
import { Marker } from "./Marker";
import { Popup } from "./Popup";

export function Map({ state, send }) {
  return (
    <ReactMapGL
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      {...state.context.viewport}
    >
      <Marker />
      <Popup />
    </ReactMapGL>
  );
}
```

If you refresh the app, you should see the same result. This means our latest refactor is successful!

However, by checking the console, you will see that the app is always in the `init` state. Let change that by triggering the `MAP_LOADED` event.

Now, since the map library doesn't expose a reliable API to execute some code once the map is loaded and ready, let's work around that by writing a `setTimout` inside a `useEffect` to trigger the `MAP_LOADED` event.

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect } from "react";
import ReactMapGL from "react-map-gl";
import { Marker } from "./Marker";
import { Popup } from "./Popup";

export function Map({ state, send }) {
  useEffect(() => {
    setTimeout(() => {
      send("MAP_LOADED");
    }, 500);
  }, []);

  return (
    <ReactMapGL
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      {...state.context.viewport}
    >
      <Marker />
      <Popup />
    </ReactMapGL>
  );
}
```

Check the console and observe how once the above event is triggered, the transition from `init` to `ready: {loading: "byArea"}` will happen. Moreover, a transition from `ready: {loading: "byArea"}` to `ready: {viewing: "viewingMap"}` will automatically happen too as expected!

We are sailing! ⛵️

Remember - we haven't yet implemented the logic to fetch the listings based on the viewport. Instead, we are returning an empty array.

Let's fix that next.

The map library exposes an API to get the current map bounds (the lower-left and upper-right points). We can use this information to extract a polygon representing the viewport area. Only then will we be able to call our API to fetch the listings based on this area.

In other words, we need to have a `ref` for the map inside the service. Eventually, the service is responsible for fetching the listings within the machine. We can save the `mapRef` inside the machine context by utilizing the `MAP_LOADED` event.

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import ReactMapGL from "react-map-gl";
import { Marker } from "./Marker";
import { Popup } from "./Popup";

export function Map({ state, send }) {
  const mapRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      send({
        type: "MAP_LOADED",
        mapRef,
      });
    }, 500);
  }, []);

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      {...state.context.viewport}
    >
      <Marker />
      <Popup />
    </ReactMapGL>
  );
}
```

Let's update our machine to welcome the `mapRef` and save it to the context:

```js
import { createMachine, assign } from "xstate";

export const mapMachine = createMachine(
  {
    // other definition
    states: {
      init: {
        on: {
          MAP_LOADED: {
            target: "ready",
            actions: "saveMapRef",
          },
        },
      },
    },
  },
  {
    actions: {
      saveMapRef: assign({
        mapRef: (ctx, ev) => ev.mapRef,
      }),
      // other actions
    },
    // other config
  }
);
```

Now, the service can access the `mapRef` through the context.

```js
import { createMachine, assign } from "xstate";

export const mapMachine = createMachine(
  {
    // definition
  },
  {
    // other configuration
    services: {
      fetchListingsByArea: async (ctx, _ev) => {
        const map = ctx.mapRef.current.getMap();
        const bounds = map.getBounds();
        const polygon = convertBoundToPolygon(bounds);
        return await getListingsByArea(polygon);
      },
    },
  }
);
```

If you refresh the page, you will see that a network call is done at the right time, and the listings are fetched successfully!

However, we are displaying the hardcoded marker.

Let's fix this.

In the `Map.js` component, update it to step over the list of fetched markers. Temporarily disable `<Popup />` too.

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import ReactMapGL from "react-map-gl";
import { Marker } from "./Marker";
import { Popup } from "./Popup";

export function Map({ state, send }) {
  const mapRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      send({
        type: "MAP_LOADED",
        mapRef,
      });
    }, 500);
  }, []);

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      {...state.context.viewport}
    >
      {state.context.markers.map((marker) => (
        <Marker key={marker._id} marker={marker} />
      ))}
      {/* <Popup /> */}
    </ReactMapGL>
  );
}
```

Then, in the `Marker.js` file, remove the hardcoded values and replace them with the values passed from the props

```jsx
import { Marker as ReactMapGLMarker } from "react-map-gl";

export function Marker({ marker }) {
  return (
    <ReactMapGLMarker
      longitude={marker.geometry.coordinates[0]}
      latitude={marker.geometry.coordinates[1]}
    >
      <div
        style={{
          height: "2rem",
          width: "2rem",
          borderRadius: "50%",
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {marker.properties.emoji}
      </div>
    </ReactMapGLMarker>
  );
}
```

You should now see at least two listings displayed!

![Listings Fetched Successfully](https://res.cloudinary.com/fghurayri/image/upload/v1629416004/faisal.sh/taming-ui-complexity-with-state-machines/two-listings.png)

Next, let's make the map interactive by allowing the user to pan.

The map library exposes an API called `onViewportChange`, which will track how the user is panning the map and report the updated viewport. Such API is perfect for making the map feel interactive.

First, let's update our machine to allow for `UPDATE_VIEWPORT` event. Remeber, the user is allowed to pan the map only in the `viewingMap` state.

```js
import { createMachine, assign } from "xstate";
import { getListingsByArea } from "../../services/listings";
import { convertBoundToPolygon } from "../../services/map";

export const mapMachine = createMachine(
  {
    // other defintion
    states: {
      // other states
      ready: {
        states: {
          viewing: {
            states: {
              viewingMap: {
                on: {
                  UPDATE_VIEWPORT: {
                    actions: "saveNewViewport",
                  },
                  // other viewingMap events
                },
                // other viewing states
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      saveNewViewport: assign({
        viewport: (ctx, ev) => ev.newViewport,
      }),
      // other actions
    },
    // other config
  }
);
```

And in the UI side, let's add the event

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import ReactMapGL from "react-map-gl";
import { Marker } from "./Marker";
import { Popup } from "./Popup";

export function Map({ state, send }) {
  const mapRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      send({
        type: "MAP_LOADED",
        mapRef,
      });
    }, 500);
  }, []);

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(newViewport) =>
        send({ type: "UPDATE_VIEWPORT", newViewport })
      }
      {...state.context.viewport}
    >
      {state.context.markers.map((marker) => (
        <Marker key={marker._id} marker={marker} />
      ))}
      {/* <Popup /> */}
    </ReactMapGL>
  );
}
```

Now, since the map already reads the viewport from the context, such viewport will get updated by the user's panning. In other words, you will be able to pan through the map as expected!

Next, let's improve the UI by showing a loading state while the map is initializing and when we are fetching the listings. I will do that in the `pages/index.js`

```jsx
import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { Map } from "./Map";
import { mapMachine } from "./mapMachine";

export default function Page() {
  const [state, send] = useMachine(mapMachine);

  const isLoading = useMemo(() => {
    return state.matches("init") || state.matches("ready.loading");
  }, [state.value]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {isLoading && (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            background: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Loading
        </div>
      )}
      <Map state={state} send={send} />
    </div>
  );
}
```

We are using the `matches()` function to ask the state machine if something matches its state. With that, the loading feature is done!

Next, let's allow the user to click on a marker to view the popup. Moreover, let's handle clicking on the map, the marker, or the popup to close it.

The map library doesn't expose an API to report when a marker is clicked. So let's work around that by manually adding a click listener on the marker.

```jsx
import { Marker as ReactMapGLMarker } from "react-map-gl";

export function Marker({ marker, send }) {
  return (
    <ReactMapGLMarker
      longitude={marker.geometry.coordinates[0]}
      latitude={marker.geometry.coordinates[1]}
    >
      <div
        style={{
          height: "2rem",
          width: "2rem",
          borderRadius: "50%",
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => send({ type: "MARKER_CLICKED", marker })}
      >
        {marker.properties.emoji}
      </div>
    </ReactMapGLMarker>
  );
}
```

The machine is already configured to receive and process the above event.

Let's go back to the `Map.js` component to show the popup only when a marker is selected.

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef } from "react";
import ReactMapGL from "react-map-gl";
import { Marker } from "./Marker";
import { Popup } from "./Popup";

export function Map({ state, send }) {
  const mapRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      send({
        type: "MAP_LOADED",
        mapRef,
      });
    }, 500);
  }, []);

  const isViewingListing = useMemo(() => {
    return state.matches("ready.viewing.viewingListing");
  }, [state.value]);

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(newViewport) =>
        send({ type: "UPDATE_VIEWPORT", newViewport })
      }
      {...state.context.viewport}
    >
      {state.context.markers.map((marker) => (
        <Marker key={marker._id} marker={marker} send={send} />
      ))}
      {isViewingListing && (
        <Popup listing={state.context.selectedMarker} send={send} />
      )}
    </ReactMapGL>
  );
}
```

Finally, update the popup to read from the prop

```jsx
import { Popup as ReactMapGLPopup } from "react-map-gl";

export function Popup({ listing, send }) {
  return (
    <ReactMapGLPopup
      longitude={listing.geometry.coordinates[0]}
      latitude={listing.geometry.coordinates[1]}
      onClose={() => send({ type: "MARKER_CLICKED" })}
    >
      <div>
        <pre>{listing.properties.description}</pre>
      </div>
    </ReactMapGLPopup>
  );
}
```

Here is what we got now

![Clicking and Dismissing Markers](https://res.cloudinary.com/fghurayri/image/upload/v1629426126/faisal.sh/taming-ui-complexity-with-state-machines/clicking-marker.gif)

So far, so good! Two more requirements to go - adding a listing and searching near the user's location.

Let's handle adding a new listing by showing a form when the user clicks on the map in `viewingMap` state.

First, let's fire an event when the map is clicked.

```jsx
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef } from "react";
import ReactMapGL from "react-map-gl";
import { Marker } from "./Marker";
import { Popup } from "./Popup";

export function Map({ state, send }) {
  const mapRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      send({
        type: "MAP_LOADED",
        mapRef,
      });
    }, 500);
  }, []);

  const isViewingListing = useMemo(() => {
    return state.matches("ready.viewing.viewingListing");
  }, [state.value]);

  return (
    <ReactMapGL
      ref={mapRef}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onClick={({ lngLat }) =>
        send({
          type: "MAP_CLICKED",
          clickedLocation: { lng: lngLat[0], lat: lngLat[1] },
        })
      }
      onViewportChange={(newViewport) =>
        send({ type: "UPDATE_VIEWPORT", newViewport })
      }
      {...state.context.viewport}
    >
      {state.context.markers.map((marker) => (
        <Marker key={marker._id} marker={marker} send={send} />
      ))}
      {isViewingListing && (
        <Popup listing={state.context.selectedMarker} send={send} />
      )}
    </ReactMapGL>
  );
}
```

Next, let's listen for state change in the parent component and render the form when the state changes to what we expect

```jsx
import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { Map } from "./Map";
import { mapMachine } from "./mapMachine";

export default function Page() {
  const [state, send] = useMachine(mapMachine);

  const isLoading = useMemo(() => {
    return state.matches("init") || state.matches("ready.loading");
  }, [state.value]);

  const isAddingListing = useMemo(() => {
    return state.matches("ready.adding");
  }, [state.value]);

  const isSubmittingListing = useMemo(() => {
    return state.matches("ready.adding.submitting");
  }, [state.value]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {isLoading && (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            background: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Loading
        </div>
      )}
      {isAddingListing && (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            background: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <form
            style={{ display: "flex", flexDirection: "column", color: "black" }}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData);
              const { lng, lat } = state.context.clickedLocation;
              send({
                type: "SUBMIT",
                data: {
                  ...data,
                  lng,
                  lat,
                },
              });
            }}
          >
            <input
              style={{ margin: "5px", padding: "5px" }}
              required
              disabled={isSubmittingListing}
              name="emoji"
              placeholder="offer emoji (🛶)"
            />
            <input
              style={{ margin: "5px", padding: "5px" }}
              required
              disabled={isSubmittingListing}
              name="price"
              type="number"
              placeholder="price (0 for free)"
            />
            <input
              style={{ margin: "5px", padding: "5px" }}
              required
              disabled={isSubmittingListing}
              name="description"
              placeholder="short description"
            />
            <button
              style={{ margin: "5px", background: "white", color: "black" }}
              disabled={isSubmittingListing}
              type="submit"
            >
              {isSubmittingListing ? "⏳" : "Add"}
            </button>
          </form>
        </div>
      )}
      <Map state={state} send={send} />
    </div>
  );
}
```

Here we are utilizing the state machine by:

- Determining whether to show the form or not by matching with the `ready.adding` state
- When the user fills the form and clicks submit, we will have access to the context, which holds the coordinates of the clicked location. We use this information as part of the user's submission
- Handle loading the form submission by matching with the `ready.adding.submitting` state

One missing part here is to add the `addNewListing` service into the machine config.

```js
import { createMachine, assign } from "xstate";
import { addListing, getListingsByArea } from "../../services/listings";
import { convertBoundToPolygon } from "../../services/map";

export const mapMachine = createMachine(
  {
    // machine definition
  },
  {
    // other config
    services: {
      addNewListing: async (ctx, ev) => {
        return await addListing(ev.data);
      },
      // other services
    },
  }
);
```

With that done, our form is ready! Let's add a new listing

![New listing added](https://res.cloudinary.com/fghurayri/image/upload/v1629428546/faisal.sh/taming-ui-complexity-with-state-machines/offer-added.gif)

Amazing! 🥳

Finally, I saved the most elegant code to the last - manually fetching listings near user's location.

Let's go back and fill everything related to this feature into the state machine.

```js
import { createMachine, assign } from "xstate";
import { addListing, getListingsByArea } from "../../services/listings";
import { convertBoundToPolygon } from "../../services/map";

export const mapMachine = createMachine(
  {
    id: "mapMachine",
    context: {
      // ... other context
      userLocation: { lat: undefined, lng: undefined },
    },
    states: {
      // ... other state
      ready: {
        id: "ready",
        states: {
          loading: {
            states: {
              byArea: {
                // ... already covered
              },
              nearMe: {
                invoke: {
                  id: "loadingNearMe",
                  src: "fetchListingsNearMe",
                  onDone: {
                    target: "#ready.viewing.viewingMap",
                    actions: ["saveListings", "jumpToUserLocation"],
                  },
                  onError: {
                    target: "#ready.viewing.viewingMap",
                    actions: "logError",
                  },
                },
              },
            },
          },
          viewing: {
            initial: "viewingMap",
            states: {
              viewingMap: {
                on: {
                  SEARCH_NEAR_ME: [
                    {
                      cond: "isUserLocationAcquired",
                      target: "#ready.loading.nearMe",
                    },
                    "#ready.acquiringUserLocation",
                  ],
                },
              },
            },
          },
          acquiringUserLocation: {
            invoke: {
              id: "getUserLocation",
              src: "getUserLocation",
              onDone: {
                target: "#ready.loading.nearMe",
                actions: "saveUserLocation",
              },
              onError: {
                target: "#ready.viewing.viewingMap",
                actions: "logError",
              },
            },
          },
        },
      },
    },
  },
  {
    guards: {
      isUserLocationAcquired: (ctx, _ev) =>
        ctx.userLocation.lng !== undefined &&
        ctx.userLocation.lat !== undefined,
    },
    actions: {
      // ... other actions
      saveUserLocation: assign({
        userLocation: (_ctx, ev) => ev.data.userLocation,
      }),
      jumpToUserLocation: assign({
        viewport: (ctx, _ev) => ({
          ...ctx.viewport,
          longitude: ctx.userLocation.lng,
          latitude: ctx.userLocation.lat,
          zoom: 14,
        }),
      }),
    },
    services: {
      // ... other services
      fetchListingsNearMe: async (ctx, _ev) => {
        return await getListingsNearMe(ctx.userLocation);
      },
      getUserLocation: async (_ctx, _ev) => {
        return await getUserLocation();
      },
    },
  }
);
```

We have a lot of great things to unpack.

First, when the `SEARCH_NEAR_ME` event is triggered, there is a check to see if the location of the user is already acquired or not. This is achieved by utilizing a `guard` (or a `cond`).

If this condition evaluates to true, the transition to the `#ready.loading.nearMe` state will happen, and we will start fetching listings near the user.

However, if this is not true, the next element of the array will be evaluated. In this case, a transition to a new state called `acquiringUserLocation` will happen.

In that state, we are invoking a service that will ask the user for permission to access the browser's geolocation API to determine their location. If things go wrong, the user will be taken back to the `#ready.viewing.viewingMap` state.

However, If things go well, a transition back to the `#ready.loading.nearMe` state will happen with the user's location, and the API request to fetch listings near the user will be made successfully! Not only that - we will also jump to the user's location to show them the listings near them automatically! 🤯

Look at that again.

No if statements.

No `setState`, multiple `dispatch`, or scattered middleware.

The UI's job was just to send the event `SEARCH_NEAR_ME`, and the state machine took care of orchestrating the rest in a few lines of code! ❤️

That is all that I want to share. Here is the [final viz](https://stately.ai/viz?id=492b1a76-2270-499b-9ccb-cff342eb5a23#) if you want to play with the state machine.

If you want to see a more organized version of this code that is optimized for React, check the [repo](https://github.com/Fghurayri/next-door). In summary, instead of `useMachine`, I opted to go with `interpret`, which will return a `service` that never changes so I can pass it around using React Context and access it using `useSelector`. This greatly helps to minimize wasted rerenders. I also hide a lot of the logic behind custom hooks.
