# Public URL
`https://address-insights-flax.vercel.app`

# Problem solving

## API 

Given the requirements to search for nearby points, I chose LocationIQ as the api provider for this project. We will use the Forward Geocoding and the Points of Interest APIs. These apis will be accessed server-side, to prevent abuse of the api key.

## Web application

The web application will be structured as two separate pages. One page will contain a search box and the other will load the given address via query parameters.

The insights page will then load the given address into the Forward Geocoding service. 

## Features 

Once we have the latitude and longitude, we can use the Points of Interest api to load additional information to display. 

We will load the points of interest and calculate a ratio of items that are >0.35 mile in distance. This ratio will give us our walking score, and driving scores.  We will then give it a urban/suburban index depending on which score is highest.

# What I built

## Search Page

The search page consists of an form with an input field and a combobox. The form once submitted saves the entered address into history and navigates the user to the details page. 

### Search history

I instructed Gemini to 
```
Implement a history API. This is intended to store a list of strings in localstorage, and provide a way to append and delete at index
```

It generated appropriate tests (`history.test.ts`) and was easy to integrate with the existing search page.

## Details Page

The details page contains two main components, the score overlay and the map. 

### Loading details

I created a server function that receives an address as input and proxies the response from the LocationIQ api. This approach uses `<Suspense>` to keep the initial navigation fast, and the data is streamed to the details page.

### Map

I implemented `react-maplibre` and used a free open source tileset. The component loads the details of the given address (latitude and longitude) and centers the map at the resulting coordinates.

#### Populating the points of interest

Instructed Gemini to copy the existing implementation of the `forward-locate` and create a `nearby` API that proxies the LocationIQ points of interest API.

Code was generated for fetching, then listing the pois and rendering them on the map.

### Score overlay

The score overlay is calculated by obtaining the ratio of pois that are farther than 0.35 mile (12 minute walk) using haversine distance. This gives us an estimate of how many locations are within walking distance vs driving distance. 

#### Details

The distance is obtained using `calculate-distance-between-coordinates`, and we divide the nearby items by the total. We then use the inverse for the driving score. 


