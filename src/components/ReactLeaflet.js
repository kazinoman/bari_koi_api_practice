import React from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Popup,
  TileLayer,
  Pane,
  Circle,
  useMapEvent,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useAutocomplete } from "@mui/base/AutocompleteUnstyled";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";

// import Marker from "./marker";
import useGeoLocation from "../hooks/useGeoLocation";

import {
  Autocomplete,
  InputBase,
  TextField,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

function GetIcon(size) {
  return new L.Icon({
    iconUrl: require("../asset/15_Place_Optimization-512-2684663089.png"),
    iconSize: size,
  });
}

// const iconPlace = new L.Icon({
//   iconUrl: require("../asset/15_Place_Optimization-512-2684663089.png"),
//   // iconRetinaUrl: require("../img/marker-pin-person.svg"),
//   // iconAnchor: null,
//   // popupAnchor: null,
//   // shadowUrl: null,
//   // shadowSize: null,
//   // shadowAnchor: null,
//   iconSize: 40,
//   // className: "leaflet-div-icon",
// });

const places = [
  { name: "east", position: [23.75528018022509, 90.36895890694483] },
  { name: "west", position: [23.75310016001263, 90.3709544704621] },
  { name: "west", position: [23.753217999858364, 90.38636107899119] },
  // { name: "west", position: [1.35735, 103.232] },
  // { name: "west", position: [1.35735, 103.944] },
];

const ReactLeaflet = () => {
  // const map = useMapEvent();
  // const position = [51.505, -0.09];
  const loc = useGeoLocation();
  console.log(loc);

  const [draggable, setDraggable] = React.useState(false);
  const [position, setPosition] = React.useState([
    loc.coordinates.lat,
    loc.coordinates.lng,
  ]);
  const markerRef = React.useRef(null);

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  const toggleDraggable = React.useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  const [options, setOptions] = React.useState([]);
  const [choosed, setChoosed] = React.useState([
    23.75528018022509, 90.36895890694483,
  ]);
  return (
    <div>
      <h1>React leaflet</h1>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        sx={{ width: "90vw", maxWidth: "400px", mx: "auto", my: 2 }}
        getOptionLabel={(option) => option.address}
        onChange={(e, newValue) => {
          console.log(newValue.latitude);
          setChoosed([newValue.latitude, newValue.longitude]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Location"
            onChange={async (e) => {
              // console.log(e.target.value);
              if (e.target.value)
                try {
                  const response = await axios.get(
                    `https://barikoi.xyz/v1/api/search/autocomplete/MzM4MDozT0cxNEFOREtU/place?q=${e.target.value}`
                  );
                  if (response.status === 200) {
                    setOptions(response.data.places);
                  }
                } catch (error) {
                  console.error(error);
                }
            }}
          />
        )}
      />
      <MapContainer
        center={choosed}
        zoom={13}
        style={{ height: "700px", width: "100%" }}
        className={{}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=MBndmmhzKk6ny86wbZ85"
        />

        {places.map((data) => (
          <Marker
            position={data.position}
            LeafletEventHandlerFnMap={false}
            eventHandlers={{
              click: () => {
                console.log("marker clicked");
                // console.log(map.locate());
              },
            }}
            icon={GetIcon(30)}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable..
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ReactLeaflet;
