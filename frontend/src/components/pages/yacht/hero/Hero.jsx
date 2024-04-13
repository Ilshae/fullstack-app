import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Placeholder from "../../../common/Placeholder";
import { msg, urlifyString } from "../../../../utils/utils";
import ImageGallery from "react-image-gallery";
import "./Hero.scss";

const Hero = ({
  name,
  model,
  modelNumber,
  year,
  people,
  gallery,
  galleryStatus,
  galleryErrorCode
}) => {
  const getItems = () => {
    let items = [];
    Object.values(gallery).map(img => {
      items.push({
        original: img.url,
        thumbnail: img.url,
        altOriginal: img.name,
        description: hasSource()
          ? `https://jachtypruszynski.pl/${urlifyString(model)}-${urlifyString(
              modelNumber
            )}-${urlifyString(name)}`
          : ""
      });
    });
    return items;
  };

  const hasSource = () => {
    return [
      name === "Biały Wilk",
      name === "Skellige",
      name === "Morrigan",
      name === "Artemida",
      name === "Ragnar",
      name === "Morrigan",
      name === "Harpia"
    ].some(Boolean);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "cols",
        pt: 1
      }}
    >
      <Box sx={{ minWidth: "25%", boxShadow: "none" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
        >
          {model} {modelNumber} {name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
        >
          {msg("model")}: {model}
          <br />
          {msg("productionYear")}: {year}
          <br />
          {msg("numberOfPeople")}: {people}
          <br />
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          href={"#reservation-form"}
        >
          {msg("charter")}
        </Button>
      </Box>
      <Box
        sx={{
          boxShadow: "none",
          width: "75%",
          textAlign: "right"
        }}
      >
        <Placeholder
          status={galleryStatus}
          errorCode={galleryErrorCode}
        >
          {gallery && (
            <ImageGallery
              items={getItems()}
              thumbnailPosition="right"
              showFullscreenButton={false}
              showPlayButton={false}
            />
          )}
        </Placeholder>
      </Box>
    </Box>
  );
};

export default Hero;
