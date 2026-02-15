"use client";
import type { forwardLocateByAddress } from "@/app/api/forward-locate/route.js";
import {
  ContentLayout,
  Header,
  Container,
  SpaceBetween,
  FormField,
  Spinner,
} from "@cloudscape-design/components";
import { use, useEffect, useState } from "react";
import { Map, Marker } from "@vis.gl/react-maplibre";
import { getDistanceBetweenTwoPoints } from "calculate-distance-between-coordinates";

function capitalizeFirstLetter(val: String) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const classToEmoji: Record<string, string> = {
  shop: "🛒",

  leisure: "🏝️",

  amenity: "🏪",

  landuse: "🏬",

  healthcare: "🏥",
};

export const InsightsContainer = ({
  address,
}: {
  address: ReturnType<typeof forwardLocateByAddress>;
}) => {
  const { address: addressData } = use(address);
  const { lon, lat } = addressData ?? {};

  const [pois, setPois] = useState<any[]>([]);
  const [walkingScore, setWalkingScore] = useState(0);
  const [drivingScore, setDrivingScore] = useState(0);
  const [urbanSuburbanIndex, setUrbanSuburbanIndex] = useState("");

  const isLoading = pois.length === 0;

  useEffect(() => {
    if (lat && lon) {
      fetch(`/api/nearby?lat=${lat}&lon=${lon}`)
        .then((res) => res.json())

        .then((data) => {
          if (data.pois) {
            setPois(data.pois);

            const addressCoordinate = { lat, lon };

            const walkablePois = data.pois.filter((poi: any) => {
              const poiCoordinate = { lat: poi.lat, lon: poi.lon };

              const distance = getDistanceBetweenTwoPoints(
                addressCoordinate,

                poiCoordinate,
              );

              return distance < 0.35;
            });

            const walkingScore = walkablePois.length / data.pois.length;
            const drivingScore = 1 - walkingScore;

            setWalkingScore(walkingScore);
            setDrivingScore(drivingScore);

            setUrbanSuburbanIndex(
              walkingScore > drivingScore ? "Urban" : "Suburban",
            );
          }
        });
    }
  }, [lat, lon]);

  return (
    <ContentLayout
      header={<Header variant="h1">{addressData?.display_name}</Header>}
    >
      <SpaceBetween direction={"vertical"} size="m">
        <SpaceBetween direction={"horizontal"} size="m">
          <Container header={<Header variant="h2">Map</Header>}>
            <Map
              initialViewState={{
                longitude: lon,

                latitude: lat,

                zoom: 14,
              }}
              style={{ width: 600, height: 400 }}
              mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            >
              <Marker
                longitude={lon ?? 0}
                latitude={lat ?? 0}
                anchor="bottom"
                style={{ fontSize: 32 }}
              >
                📍
              </Marker>

              {pois.map((poi) => (
                <Marker
                  key={poi.place_id + poi.lon}
                  longitude={poi.lon}
                  latitude={poi.lat}
                  anchor="bottom"
                  style={{ fontSize: 20 }}
                >
                  {classToEmoji[poi.class as string] ?? "⭐"}
                </Marker>
              ))}
            </Map>
          </Container>

          <Container header={<Header variant="h2">Scores</Header>}>
            {isLoading ? (
              <Spinner />
            ) : (
              <SpaceBetween size={"l"}>
                <FormField
                  description="Ratio of amenities within walking distance."
                  label="Walking"
                >
                  {walkingScore.toFixed(2)}
                </FormField>

                <FormField
                  description="Ratio of amenities within driving distance."
                  label="Driving"
                >
                  {drivingScore.toFixed(2)}
                </FormField>

                <FormField label="Urban / Suburban Index">
                  {urbanSuburbanIndex}
                </FormField>
              </SpaceBetween>
            )}
          </Container>
        </SpaceBetween>

        <Container header={<Header variant="h2">Nearby Places</Header>}>
          {Object.entries(
            Object.groupBy(
              pois.sort((a, b) => b.distance - a.distance),

              ({ class: poiClass }) => poiClass,
            ),
          ).map(([poiClass, pois]) => (
            <div key={poiClass}>
              <Header variant="h3">{capitalizeFirstLetter(poiClass)}</Header>

              <ul>
                {pois?.map((poi: any) => (
                  <li key={poi.place_id}>{poi.display_name}</li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};
