---
title: "How to Build Geospatial Apps"
date: "2021-08-15"
slug: "how-to-build-geospatial-apps"
metaDesc: "I explain the primitives of working with geospatial apps by building an app using Next JS and MongoDB."
cover: "https://res.cloudinary.com/fghurayri/image/upload/v1627712307/faisal.sh/geospatial-apps-primitives/cover.jpg"
---

<script context="module">
  export const prerender = true;
</script>

![Hvalfjarðarsveit, Iceland](https://res.cloudinary.com/fghurayri/image/upload/v1627712307/faisal.sh/geospatial-apps-primitives/cover.jpg)

Building an app with geospatial capabilities is always fun!

I aim to share everything I know about developing geospatial apps by introducing the theory and the practice by building a small app.

> The associated code repo is [here](https://github.com/Fghurayri/next-door). In addition, the live example app is [here](https://next-door.lab.faisal.sh).

# The Theory

Like other substantial areas in computer science, there is a standard specification about communicating geospatial information. The [GeoJSON](https://geojson.org/) spec is a 28-page reference that explains such a standard in great detail.

Understanding the specification should empower you to build geospatial apps using many languages, analytical tools, and databases.

To simplify this guide, I will cover the 20% subset of the specs that should provide 80% of the value.

## The GeoJSON Object

```ts
type GeoJSONType = "Point" | "LineString" | "Polygon";
type Point = [longitude: number, latitude: number];

interface GeoJSON {
  type: GeoJSONType;
  coordinates: Point | Point[];
}
```

The heart of the GeoJSON spec is the above `GeoJSON` object.

Each option of the `GeoJSONType` is a **geometry**.

Let's cover them in more detail by providing an example for each.

### Point

```JSON
{
  "type": "Point",
  "coordinates": [1, 0]
}
```

The point is the most concise example for a GeoJSON object. The coordinates tuple hosts the longitude (north to south) and latitude (west to east) of a point/location. The goal is to represent any location with the most excellent precision.

### Line String

```JSON
{
  "type": "LineString",
  "coordinates": [
    [1, 0],
    [1, 1]
  ]
}
```

The line string takes it up a notch by listing two points in the coordinates array. The goal is to represent a line between two points. Therefore, A navigation route between two or more points is a collection of line strings.

### Polygon

```JSON
{
  "type": "Polygon",
  "coordinates": [
    [
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
      [1, 0]
    ]
  ]
}
```

Finally, I think the polygon is one of the most powerful GeoJSON objects. The goal is to represent an area by connecting multiple line strings around it. Therefore, the first point should always match the last point to enclose an area properly.

## The Geospatial Tooling

Like web development, there is an abundance of tools to satisfy different needs. I reached the following conclusion about distinguishing between use cases:

- Simple:
  - Show a **finite number of markers on a map** and allow the user to **filter them based on a set of known non-geospatial criteria**.
  - Example: Show branches location for a local coffee shop on a map and allow the user to filter based on vegetarian options.
- Intermediate:
  - Show a **dynamic** number of markers on a map **based on the user's location** and allow the user to **search by interacting with the map**.
  - Example: Allow the user to look for real estate listings in any area using a map.
- Advanced
  - All the previous use cases and running an advanced/specialized geospatial analysis.
  - Example: Interactive map for COVID-19 geospatial analysis on a map.

> Usually, simple use cases only need client-side tooling. However, intermediate use cases will require a full-stack solution and may need DB-level support for the `GeoJSON` standard. Finally, advanced use cases will require such specialized DB support and maybe other specialized plugins.

### Client-Side Toolings

When building apps with map capabilities, you will need a map source and a map library.

The map source is the geographic data source that hosts the metadata about a location or an area on the map - for example, **knowing** the street and city names for a specific `point` in the map.

The map library renders such map source and glues your application's logic with the map - for example, **showing** the street and city name and **allowing** the user to click on a marker.

Google Maps, Mapbox, and Here maps are examples of map sources that provide map libraries. OpenStreetMaps is an example of an open-source map source. Leaflet is an example of an open-source map library. You can mix and match a map source with a map library, but it is usually better to use the complete solution.

With any of the above tooling, you should be able to:

- Display a blank map
- Fill the map with a list of markers with small popups
- Allow the user to click on, add, or remove markers
- Establish 2-way binding between your business logic and the map

Advanced use cases for geospatial analysis require specialized tooling. Turf.js is an example of such a tool.

### Server-Side Tooling

The client-side tooling looks comprehensive.

However, in addition to persisting such geospatial information, the reason you may need to add server-side geospatial tooling is the exact reason why you need pagination and full-text search.

For example, if the user is browsing the map looking for real estate listings in Manhatten, New York, you need only to show the listings based on the map's viewport. You should not dump everything to the user and rely on the client-side tool to filter out what is outside the search criteria.

There are two levels of server-side tooling:

- Simple:
  - You _don't_ want/need to use the DB's geospatial capabilities.
  - Instead, you will retrieve everything from the DB and run your query/filter using your server code.
  - Example: Deciding whether a location is serviceable or not based on the user's location.
- Advanced:
  - You want/need to utilize the DB's geospatial capabilities.
  - You will set up the DB accordingly and utilize the geospatial features while performing queries and writes to the DB.
  - Example: Allowing the user to look for real estate listings using a map.

For the simple use cases, you can use any geospatial tool that runs server-side. For the advanced use cases, most reputable DBs have built-in support for the `GeoJSON` spec. If not, then such support can be provided using a plugin.

That's a lot to digest, so let's stop the theory and build something!

# The Practice

> "Geospatial Applications involves the ability to integrate geography (maps) and information (data) and then access, manipulate and utilize the results via systems (computers)."

Let's slice the above definition into more accessible terms by building an application.

![Next Door App](https://res.cloudinary.com/fghurayri/image/upload/v1628986966/faisal.sh/geospatial-apps-primitives/next-door-app.jpg)

The application we will build should allow any homeowner to list things they no longer need to sell or giveaway to their community.

The MVP should contain the following features:

- As a homeowner, I want to list things I no longer need.
  - Each listed item will have an emoji and short description.
  - Each listed item can be priced or for free.
- As a community member, I want to see all the listings in my neighborhood.
- As a community member, I want to filter the listings within a 2 miles walking distance from me.

## Technology Stack

Judging by our features set, I see we are going to need:

- Client-side tooling to display a map and allow for user interactivity
- Server-side tooling with DB-level support for `GeoJSON` spec to allow for dynamically searching

> Authentication and authorization are out of scope to keep the app concise.

I am going with React using Next JS since it is the most popular full-stack JS web framework. As for the DB, I will go with MongoDB since it has built-in support for `GeoJSON` and is one of the most approachable DB options for JS developers.

## Getting Started

Ensure you have all the prerequisites to run Next JS. I will use a free cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and connect to it locally. [This guide](https://www.mongodb.com/developer/how-to/nextjs-building-modern-applications/#setting-up-our-mongodb-database) is a good reference if you need help with setting up both.

Moreover, I am going to use [Mapbox](https://www.mapbox.com/) map source and [react-map-gl](https://github.com/visgl/react-map-gl) map library. You will need to have an API key (free) to have the map solution working.

With the above prerequisites met, go ahead and initialize a new Next JS application. Name the project `next-door` when asked. Finally, install `mongoose`, the MongoDB database driver, and `react-map-gl`, our map library.

```bash
npx create-next-app
cd next-door
npm i mongoose react-map-gl
```

Your project structure should now look like this:

```bash
.
├── README.md
├── node_modules
│   └── ***
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── pages
│   ├── _app.js
│   ├── index.js
│   └── api
└── styles
    ├── Home.module.css
    └── globals.css
```

### Building the API

Let's start with connecting our Next JS app with the MongoDB database.

#### Connecting to the MongoDB Database

First, we need to store our MongoDB connection string in an environment variable for good security hygiene.. And while we are at it, let's add the Mapbox API key too.

So, create a `local.env` file in the root of the project with the following snippet:

```
MONGODB_URI=<your MongoDB connection string>
NEXT_PUBLIC_MAPBOX_KEY=<your mapbox API key>
```

Then, create the following file `lib/api/db.js` to host instantiating the DB client. Add the following snippet:

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

We are doing a verbose instantiation. This approach (maintaining a cached connection instance) is performant, especially in serverless environments like Vercel.

Now you should be good to go to the next step.

#### The Data Model

Let's build a simple data model for the listing according to the `GeoJSON` spec.

From the project's root directory, create the following file `lib/api/models/listing.js` and add the following snippet:

```js
import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "Feature",
    },
    properties: {
      emoji: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    geometry: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

ListingSchema.index({ geometry: "2dsphere" });

const model =
  mongoose.models.Listing || mongoose.model("Listing", ListingSchema);

export default model;
```

The `GeoJSON` spec expects you to provide the thing you want to represent geospatially as a [Feature](https://datatracker.ietf.org/doc/html/rfc7946#section-3.2). The shape of this feature is what we have modeled above.

For MongoDB, the key point in this model is how we set up the `geometry` field in the schema. The highlight is adding the `2dsphere` indexes, which tells MongoDB to consider this as a `GeoJSON` object.

> The `2dsphere` is the way to tell MongoDB that we want this field to consider the special shape of the entire Earth - a sphere. If we don't do this, all subsequent calculations will not be accurate.

On to the next step!

#### The Service

Let's build a service to be responsible for interacting with the above model.

From the project's root directory, create the following file `lib/api/services/listing.js` and add the following snippet:

```js
import Listing from "../models/listing";
import dbConnect from "../db";

export async function addListing({ lat, lng, price, description, emoji }) {
  await dbConnect();
  return await Listing.create({
    properties: {
      emoji,
      description,
      price: Number(price),
    },
    geometry: { coordinates: [lng, lat] },
  });
}

export async function getListingsNearLocation(
  { lng, lat },
  maxDistance = 2 * 1000 * 1.6 // 2 miles in meters
) {
  await dbConnect();
  return await Listing.find({
    geometry: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
  });
}

export async function getListingsInArea(polygon) {
  await dbConnect();
  return await Listing.find({
    geometry: {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: polygon,
        },
      },
    },
  });
}
```

The key point is how we utilized the special query keys `$near` and `$geoWithin` to use MongoDB's geospatial capabilities when searching within an area or near a point! 🥳

#### The Endpoints

Finally, with the model and service ready, let's expose a few API routes.

> Ideally, in production apps, you should never trust the user input. Therefore, you can properly apply a few middlewares to handle the different cases and sanitize the user input. However, such practice is out of the scope of this guide.

Let's support adding a new listing. Create the following file `pages/api/listings/index.js` and add the following snippet:

```js
import { addListing } from "../../../lib/api/services/listings";

export default async function handler(req, res) {
  try {
    switch (req.method.toLowerCase()) {
      case "post":
        return handleAddingListing(req, res);
      default:
        return res.status(404).json({});
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({});
  }
}

async function handleAddingListing(req, res) {
  const body = JSON.parse(req.body);
  const { lng, lat, price, description, emoji } = body;
  const listing = await addListing({ lat, lng, price, description, emoji });
  return res.status(201).json(listing);
}
```

Next, let's support searching near a given location. Create the following file `pages/api/listing/near-me.js` and add the following snippet:

```js
import { getListingsNearLocation } from "../../../lib/api/services/listings";

export default async function handler(req, res) {
  try {
    switch (req.method.toLowerCase()) {
      case "post":
        return handleGettingListingsNearMe(req, res);
      default:
        return res.status(404).json({});
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({});
  }
}

async function handleGettingListingsNearMe(req, res) {
  const body = JSON.parse(req.body);
  const { lng, lat } = body;
  const listings = await getListingsNearLocation({ lng, lat });
  const geoJSONResponse = {
    type: "FeatureCollection",
    features: listings,
  };
  return res.status(200).json(geoJSONResponse);
}
```

Finally, let's support searching in a given area. Create the following file `pages/api/listing/area.js` and add the following snippet:

```js
import { getListingsInArea } from "../../../lib/api/services/listings";

export default async function handler(req, res) {
  try {
    switch (req.method.toLowerCase()) {
      case "post":
        return handleGettingListingsInArea(req, res);
      default:
        return res.status(404).json({});
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({});
  }
}

async function handleGettingListingsInArea(req, res) {
  const body = JSON.parse(req.body);
  const { polygon } = body;
  const listings = await getListingsInArea(polygon);
  const geoJSONResponse = {
    type: "FeatureCollection",
    features: listings,
  };
  return res.status(200).json(geoJSONResponse);
}
```

Observe the `geoJSONResponse` object shape in the last two endpoints! Both are following the `GeoJSON` spec when exposing geospatial APIs.

Let's fire up Insomnia (or your preferred API testing client) to interact with our API to ensure everything is tied up.

Run the following requests in the order below. You should always get a successful response with the listing you are going to add.

| Operation            | Method | URL                     | Body        |
| -------------------- | ------ | ----------------------- | ----------- |
| Add Listing          | `post` | `/api/listings`         | check below |
| Get Listings Near Me | `post` | `/api/listings/near-me` | check below |
| Get Listings in Area | `post` | `/api/listings/area`    | check below |

Example for the body to add a listing:

```json
{
  "lng": -80.897662,
  "lat": 35.484788,
  "emoji": "⌨️",
  "price": "99",
  "description": "Almost new Apple keyboard"
}
```

Example for the body to get listings near me:

```json
{
  "lng": -80.897662,
  "lat": 35.484788
}
```

Example for the body to get listings in area:

```json
{
  "polygon": [
    [
      [-80.919399, 35.496561],
      [-80.890239, 35.495596],
      [-80.889982, 35.469737],
      [-80.91955, 35.47117],
      [-80.919399, 35.496561]
    ]
  ]
}
```

### Building The Frontend

This section will follow the spirit of building a PoC (proof of concept) - how fast can we show a marker and a popup on a map!

To utilize the [react-map-gl](https://visgl.github.io/react-map-gl/) library, you will need to pull from it the following three components:

- Interactive Map: The main container that will render the map
- Marker: A child component that will represent a location
- Popup: A child component that will represent information relevant to a marker

Go ahead and create each one of the above components using hardcoded values from the already posted listing as follows:

The popup at `lib/components/Popup.js`

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

The marker at `lib/components/Marker.js` (styling is mandatory to render something on the screen)

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

And finally, the map with its children at `lib/components/Map.js`

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

Then, go ahead and import the Map into `pages/index.js`.

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

If we wired up everything correctly, you should see this rendered on the index page

![Checkpoint!](https://res.cloudinary.com/fghurayri/image/upload/v1628992108/faisal.sh/geospatial-apps-primitives/react-ui.png)

Hooray!! 🥳

Beyond this point (consuming APIs and showing a form) is idiomatic React. If you want to check the full version, which has Tailwind for CSS and XState for state management, here is [the repo](https://github.com/Fghurayri/next-door) for the final code. If you are interested to know how I built the UI, [this article](https://faisal.sh/posts/taming-complex-uis-with-state-machines-and-pure-views) goes into more detail.

I hope you found this guide helpful.
