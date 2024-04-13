import React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { DrawerHeader } from "./common";
import { msg } from "../../../utils/utils";
import MenuLink from "./MenuLink";

const Menu = ({ open, handleDrawerOpen, handleDrawerClose }) => {
  return (
    <>
      <DrawerHeader>
        {!open ? (
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              ...(open && { display: "none" })
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </DrawerHeader>
      <List sx={{ p: 0 }}>
        <Divider />
        {nav.map(({ text, url }) => (
          <span key={url}>
            <MenuLink
              open={open}
              text={text}
              url={url}
              key={url}
            />
            <Divider key={text} />
          </span>
        ))}
      </List>
    </>
  );
};

const nav = [
  { text: msg("sailingYachts"), url: "/" },
  { text: msg("adminPanel"), url: "/admin-panel" }
];

export default Menu;
