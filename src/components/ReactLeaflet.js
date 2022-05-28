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

import { Autocomplete, TextField } from "@mui/material";

const ReactLeaflet = () => {
  // const map = useMapEvent();
  // const position = [51.505, -0.09];

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
        style={{ height: "700px", width: "100%" }}
        center={choosed}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=MBndmmhzKk6ny86wbZ85"
        />
        <Centerize position={choosed} />
      </MapContainer>
    </div>
  );
};

function Centerize({ position }) {
  const map = useMapEvent("click", () => {
    map.setCenter(position);
  });
  return null;
}

export default ReactLeaflet;
