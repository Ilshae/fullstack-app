import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MUIIconButton from "@mui/material/IconButton";
import { Context } from "../../../Wrapper";
import { drawerWidth, appBarHeight } from "./common.js";
import { useIntl } from "react-intl";

const AppBar = ({ open }) => {
  const intl = useIntl();
  const context = useContext(Context);

  return (
    <StyledAppBar
      position="absolute"
      open={open}
      sx={{
        boxShadow:
          "0px 1px 2px -1px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);",
        height: appBarHeight
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
            width: "100px",
            transition: "all 0.5s ease"
          }}
        >
          JACHTY
        </Typography>
        <IconButton
          data-test={"english"}
          value="en-US"
          onClick={() => context.selectLang("en-US")}
          sx={{ backgroundColor: "inherit", boxShadow: "none" }}
        >
          <img
            src="https://flagcdn.com/w20/gb.png"
            alt={intl.formatMessage({ id: "selectEnglish" })}
          />
        </IconButton>
        <IconButton
          data-test={"polish"}
          value="pl-PL"
          onClick={() => context.selectLang("pl-PL")}
          sx={{ backgroundColor: "inherit", boxShadow: "none" }}
        >
          <img
            src="https://flagcdn.com/w20/pl.png"
            alt={intl.formatMessage({ id: "selectPolish" })}
          />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const IconButton = styled(MUIIconButton)(({ theme }) => ({
  marginLeft: 6,
  marginRight: 6,
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.background.default
      : "#4aa1f7",
  boxShadow:
    "0px 1px 2px -1px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);"
}));

export default AppBar;
