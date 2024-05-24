import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";
// import { useCallback } from "react";

const CustomMap = () => {
  let coords = [];

  // create state for center and coordsResult
  const state = {
    center: { lat: 40.014984, lng: -105.270546 },
    coordsResult: [],
  };

  // const request = {
  //   textQuery: "Hiking trails near me",
  //   fields: ["displayName", "location", "businessStatus"],
  //   includedType: "hiking_area",
  //   locationBias: { lat: 40.014984, lng: -105.270546 },
  //   isOpenNow: true,
  //   language: "en-US",
  //   maxResultCount: 8,
  //   minRating: 3.2,
  //   region: "us",
  //   useStrictTypeFiltering: false,
  // };

  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !map) return;

    const request = {
      query: "Hiking trails near me",
      location: { lat: 40.014984, lng: -105.270546 },
      radius: 500,
      type: "hiking_area",
      region: "us",
    };

    const svc = new placesLib.PlacesService(map);
    console.log("svc....", svc);

    svc.textSearch(request, (results, status) => {
      console.log("res", results);
      console.log("stat", status);
      for (var i = 0; i < results.length; i++) {
        coords.push(results[i]);
      }
      state.center = results[0].geometry.location;
      state.coordsResult = coords;
      console.log("state", state);
    });
  }, [placesLib, map]);

  // svc.findPlaceFromQuery(request, (results, status) => {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //     for (var i = 0; i < results.length; i++) {
  //       coords.push(results[i]);
  //     }

  //     this.setState({
  //       center: results[0].geometry.location,
  //       coordsResult: coords,
  //     });
  //   }
  // });

  return (
    // using advanced marker to display the results on the map
    <Map center={state.center} zoom={14}>
      {state.coordsResult.map((coord, index) => (
        <AdvancedMarker
          map={map}
          key={index}
          position={coord.geometry.location}
          title={coord.name}
          onClick={() => {
            console.log("Marker clicked", coord);
          }}
        />
      ))}
    </Map>
  );
};

export default function App() {
  //   const onLoad = useCallback(function onLoad(map) {
  //     const request = {
  //       location: loc,
  //     };
  //     console.log("location", loc);

  //     function callback(results, status) {
  //       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
  //         console.log(results);
  //       }
  //     }

  //     let service = new window.google.maps.places.PlacesService(map);
  //     service.nearbySearch(request, callback);
  //   });
  return (
    // create APIProvider to provide the API key as well as the map library
    <APIProvider apiKey={"AIzaSyA1pDFcj5Ge7lM9Gpj4-b4aI874D0aG7iA"}>
      <CustomMap />
    </APIProvider>
  );
}
