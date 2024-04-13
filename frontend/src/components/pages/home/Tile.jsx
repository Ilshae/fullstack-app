import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { getFirstFileByYachtId } from "../../../services/file.service";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { Link } from "react-router-dom";
import { urlifyString } from "../../../utils/utils";
import "./Tile.scss";

const Tile = ({ id, name, model, modelNumber, url }) => {
  const intl = useIntl();
  const [imgName, setImgName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgSource, setImgSource] = useState("");

  const isFromJachtyPruszynski = () => {
    return [
      name === "Biały Wilk",
      name === "Skellige",
      name === "Morrigan",
      name === "Artemida",
      name === "Ragnar",
      name === "Morrigan",
      name === "Harpia",
      name === "Driada",
      name === "Saskia"
    ].some(Boolean);
  };

  useEffect(() => {
    fetchImg(id);
  }, []);

  const fetchImg = async id => {
    const res = await getFirstFileByYachtId(id);
    setImgName(res.data.name);
    setImgUrl(res.data.url);
    if (isFromJachtyPruszynski)
      setImgSource(
        `https://jachtypruszynski.pl/${urlifyString(model)}-${urlifyString(
          modelNumber
        )}-${urlifyString(name)}`
      );
  };

  return (
    <ImageListItem
      component={Link}
      to={`/jachty/${url}`}
    >
      <img
        src={`${imgUrl}`}
        alt={imgName}
      />
      <ImageListItemBar
        title={model + " " + modelNumber}
        subtitle={name}
        actionIcon={
          isFromJachtyPruszynski()
            ? `${intl.formatMessage({ id: "source" })} ${imgSource} `
            : false
        }
      />
    </ImageListItem>
  );
};

export default Tile;
