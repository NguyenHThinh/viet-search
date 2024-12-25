"use client";

import AnyReactComponent from "@/components/AnyReactComponent/AnyReactComponent";
import Marker from "@/components/AnyReactComponent/Marker";
import { APP_CONFIGS } from "@/config-global";
import { FC, useState } from "react";
import useSupercluster from "use-supercluster";
import GoogleMapReact from "google-map-react";
import MarkPoint from "./MarkPoint";

interface LocationMapProps {
  locationPoints: {
    lat: number;
    lon: number;
  }[];
}

const LocationMap: FC<LocationMapProps> = ({ locationPoints }) => {
  const [bounds, setBounds] = useState<number[] | null>(null);
  const [zoom, setZoom] = useState(17);
  const points = locationPoints.map((result) => ({
    type: "Feature",
    properties: {
      cluster: false,
      crimeId: result?.lat,
      result,
    },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(String(result?.lon)),
        parseFloat(String(result?.lat)),
      ],
    },
  }));

  //set up clusters use in map
  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div className="h-full w-full">
      <GoogleMapReact
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds?.nw?.lng,
            bounds?.se?.lat,
            bounds?.se?.lng,
            bounds?.nw?.lat,
          ]);
        }}
        zoom={zoom}
        center={{
          lat: locationPoints?.[0]?.lat,
          lng: locationPoints?.[0]?.lon,
        }}
        defaultCenter={{
          lat: locationPoints?.[0]?.lat,
          lng: locationPoints?.[0]?.lon,
        }}
        bootstrapURLKeys={{
          key: APP_CONFIGS.googleMapKey,
        }}
        yesIWantToUseGoogleMapApiInternals
      >
        {clusters.map((cluster: any, index: number) => {
          const [longitude, latitude] = cluster?.geometry?.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
            result,
          } = cluster?.properties;

          return (
            <Marker
              key={`crime-${cluster?.properties?.crimeId}`}
              lat={latitude}
              lng={longitude}
            >
              <MarkPoint lat={longitude ?? 0} lng={latitude ?? 0} />
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
};

export default LocationMap;
