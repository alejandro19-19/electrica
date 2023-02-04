import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ColorLensOutlined } from "@mui/icons-material";
import PlaceIcon from "@mui/icons-material/Place";
import "leaflet/dist/leaflet.css";
import "./location.scss";

const Ubication = ({ type }) => {
  const context = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState(3.423134);
  const [lng, setLng] = useState(-76.546873);
  console.log(context.appState.temporalUser.user.direccion);
  const direccion = "Calle 10 38D";

  //464691bbec21522ec36a86bcb168f7b4

  useEffect(() => {
    const params = {
      access_key: "464691bbec21522ec36a86bcb168f7b4",
      country: "CO",
      region: "Cali",
      query: `${direccion}`,
    };
    console.log(context);
    fetch(
      `http://api.positionstack.com/v1/forward?access_key=464691bbec21522ec36a86bcb168f7b4&country=CO&region=Cali&query= ${context.appState.temporalUser.user.direccion}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setLat(res.data[0].latitude);
        setLng(res.data[0].longitude);
        //latitude: 3.423134, longitude:
        setLoading(false);
        console.log(lat, lng);
      });
  }, []);
  // useEffect(() => {
  //   Geocode.fromAddress(context.appState.temporalUser.direccion).then(
  //     (response) => {
  //       const { lat, lng } = response.results[0].geometry.location;
  //       console.log(lat, lng);
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  //   setLoading(false)
  // }, []);

  return (
    <Box>
      {loading ? (
        <Box
          width={"100%"}
          height={"calc(100% - 90px)"}
          sx={{ display: "flex" }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress color="secondary" size={60} />
        </Box>
      ) : (
        <Box position={"relative"} zIndex={"-100"}>
          <MapContainer
            center={[lat, lng]}
            zoom={13}
            scrollWheelZoom={false}
            className="map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </Box>
      )}
    </Box>
  );
};

export default Ubication;
