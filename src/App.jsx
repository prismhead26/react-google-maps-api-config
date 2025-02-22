import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
// import { useCallback } from "react";

const CustomMap = () => {
  // create state for center and coordsResult
  let coords = [];
  // create state for center and coordsResult
  const [state, setState] = useState({
    center: { lat: 40.014984, lng: -105.270546 },
    coordsResult: [],
  });

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
      console.log("results: ", results);
      console.log("status is", status);

      for (var i = 0; i < results.length; i++) {
        coords.push(results[i]);
      }
      setState({
        center: { lat: 40.014984, lng: -105.270546 },
        coordsResult: coords,
      });
    });
  }, [placesLib, map]);

  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  console.log("state...", state);

  return (
    // render the map

    <Map
      mapId={"map"}
      style={{ width: "100vw", height: "100vh" }}
      defaultCenter={state.center}
      defaultZoom={14}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    >
      {/* add advancedMarker to each coord and display onto map */}
      {state.coordsResult.map((coord, index) => (
        <>
          <AdvancedMarker
            key={index}
            position={coord.geometry.location}
            title={coord.name}
            onClick={() => {
              console.log("clicked on marker", coord);
              handleMarkerClick();
            }}
            ref={markerRef}
          />
          {infoWindowShown && (
            <InfoWindow
              anchor={marker}
              onCloseClick={handleClose}
              options={{ maxWidth: 300 }}
            >
              <div>
                <h1>{coord.name}</h1>
              </div>
            </InfoWindow>
          )}
        </>
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
