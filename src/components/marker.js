import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Autocomplete, Box, TextField } from "@mui/material";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { BiLocationPlus } from "react-icons/bi";
import PickIcon from "../asset/pick.svg";

const center = [51.505, -0.09];
const zoom = 13;

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.setView(center, zoom);
  }, [map]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{" "}
      <button onClick={onClick}>reset</button>
    </p>
  );
}

function ExternalStateExample() {
  const [map, setMap] = useState(null);

  const [options, setOptions] = React.useState([]);
  const [markerY, setMarkerY] = React.useState("-100%");

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "700px", width: "100%" }}
        // scrollWheelZoom={false}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    []
  );

  const onMove = useCallback(() => {
    // console.log();
    //console.log("hello");
    setMarkerY("calc(-100% - 10px)");
  }, [map]); //setMarkerY("-100%")

  useEffect(() => {
    if (map) {
      map.on("move", onMove);
      return () => {
        map.off("move", onMove);
      };
    }
  }, [map, onMove]);

  useEffect(() => {
    if (map) {
      map.on("movestart", () => {
        setMarkerY("calc(-100% - 10px)");
      });
      map.on("moveend", () => {
        setMarkerY("-100%");
      });
    }
  }, [map]);

  return (
    <div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        sx={{ width: "90vw", maxWidth: "400px", mx: "auto", my: 2 }}
        getOptionLabel={(option) => option.address}
        onChange={(e, newValue) => {
          map.flyTo([newValue.latitude, newValue.longitude], 15);
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
      {/* <Marker /> */}
      {map ? <DisplayPosition map={map} /> : null}
      <Box
        sx={{
          position: "relative",
        }}
      >
        {displayMap}
        {map ? (
          <img
            src={PickIcon}
            style={{
              position: "absolute",
              height: "40px",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, ${markerY})`,
              zIndex: 10001,
              fontSize: "2rem",
            }}
          />
        ) : null}
        {map ? (
          <Box
            sx={{
              height: "5px",
              width: "5px",
              background: "#7173be",
              borderRadius: "50%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -100%)`,
              zIndex: 10000,
            }}
          />
        ) : null}
      </Box>
    </div>
  );
}

export default ExternalStateExample;
