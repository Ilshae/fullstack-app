import React from "react";
import {
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems
} from "@mui/x-data-grid";

const DefaultColumnMenu = ({ props }) => {
  const { hideMenu, currentColumn, color, ...other } = props;
  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      ownerState={{ color }}
      {...other}
    >
      <SortGridMenuItems
        onClick={hideMenu}
        column={currentColumn}
      />
      <GridFilterMenuItem
        onClick={hideMenu}
        column={currentColumn}
      />
    </GridColumnMenuContainer>
  );
};

export default DefaultColumnMenu;
