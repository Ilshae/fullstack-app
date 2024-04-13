import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { Route, Switch } from "react-router-dom";
import AppBar from "./AppBar";
import Menu from "./Menu";
import Yacht from "../../pages/yacht/Yacht";
import Home from "../../pages/home/Home";
import Login from "../../pages/admin/Login";
import AdminPanel from "../../pages/admin/adminPanel/AdminPanel";
import AdminPanelYacht from "../../pages/admin/adminPanel/yacht/Yacht";
import AdminPanelReservation from "../../pages/admin/adminPanel/reservation/Reservation";
import AdminPanelPrice from "../../pages/admin/adminPanel/price/Price";
import AdminPanelUser from "../../pages/admin/adminPanel/user/User";
import AdminPanelPasswordReset from "../../pages/admin/adminPanel/user/PasswordReset";
import NoMatch from "../../pages/noMatch/NoMatch";
import { appBarHeight, DrawerHeader, drawerWidth } from "./common.js";
import "./Drawer.scss";
import { getCurrentUser } from "../../../services/auth.service";

const MiniDrawer = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: `calc(100vh - ${appBarHeight})`
      }}
    >
      <AppBar open={open} />
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          boxShadow:
            "0px 1px 2px -1px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);"
        }}
      >
        <Menu
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          handleDrawerClose={handleDrawerClose}
        />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 1 }}
      >
        <DrawerHeader />
        <Switch>
          <Route
            exact
            path={"/"}
            component={Home}
          />
          <Route
            path="/jachty/:url"
            component={Yacht}
          />
          <Route
            exact
            path="/admin-panel/jachty/dodaj-nowy"
            component={getCurrentUser() ? AdminPanelYacht : Login}
          />
          <Route
            path="/admin-panel/jachty/:id"
            component={getCurrentUser() ? AdminPanelYacht : Login}
          />
          <Route
            exact
            path="/admin-panel/rezerwacje/dodaj-nowa/:yachtId"
            component={getCurrentUser() ? AdminPanelReservation : Login}
          />
          <Route
            path="/admin-panel/rezerwacje/:id"
            component={getCurrentUser() ? AdminPanelReservation : Login}
          />
          <Route
            exact
            path="/admin-panel/ceny/dodaj-nowa/:yachtId"
            component={getCurrentUser() ? AdminPanelPrice : Login}
          />
          <Route
            path="/admin-panel/ceny/:id"
            component={getCurrentUser() ? AdminPanelPrice : Login}
          />
          <Route
            exact
            path="/admin-panel/uzytkownicy/dodaj-nowego"
            component={getCurrentUser() ? AdminPanelUser : Login}
          />
          <Route
            exact
            path="/admin-panel/uzytkownicy/resetuj-haslo/:id"
            component={getCurrentUser() ? AdminPanelPasswordReset : Login}
          />
          <Route
            exact
            path="/admin-panel/uzytkownicy/:id"
            component={getCurrentUser() ? AdminPanelUser : Login}
          />
          <Route
            exact
            path="/admin-panel"
            component={getCurrentUser() ? AdminPanel : Login}
          />
          <Route
            path="*"
            component={NoMatch}
          />
        </Switch>
      </Box>
    </Box>
  );
};

const openedMixin = theme => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});
const closedMixin = theme => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

export default MiniDrawer;
