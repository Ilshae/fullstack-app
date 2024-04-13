import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "./components/layout/drawer/Drawer";

class App extends Component {
  render() {
    return (
      <Router>
        <CssBaseline />
        <Drawer />
      </Router>
    );
  }
}

export default App;
