import React from "react";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SailingIcon from "@mui/icons-material/Sailing";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InfoIcon from "@mui/icons-material/Info";
import PaidIcon from "@mui/icons-material/Paid";

const MenuLink = ({ open, text, url }) => {
  const theme = useTheme();
  return (
    <ListItem
      key={text}
      component={Link}
      to={url}
      disablePadding
      sx={{
        display: "block",
        color: theme.palette.text.primary
      }}
      data-test={`nav-${url}`}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center"
          }}
        >
          <IconHandler text={text.props.id} />
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{ opacity: open ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default MenuLink;

const IconHandler = ({ text }) => {
  if (text === "information") return <InfoIcon />;
  if (text === "prices") return <PaidIcon />;
  if (text === "adminPanel") return <AdminPanelSettingsIcon />;
  return <SailingIcon />;
};
