
import mapImage from "./eu-c-03.png";

export default function Map({yellowUrl}) {
  return(
    <>
        <img src={yellowUrl} alt="the yellow map" />
        <img src={mapImage} alt="the main map" />
    </>
  );
  
}

