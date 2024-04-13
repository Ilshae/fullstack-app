import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { DataGrid, enUS, plPL } from "@mui/x-data-grid";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListItemText from "@mui/material/ListItemText";
import { msg } from "../../../../../utils/utils";
import DefaultColumnMenu from "../../../../common/DefaultColumnMenu";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Context } from "../../../../../Wrapper";

const YachtGrid = ({
  yachts,
  handleOverlayDialog,
  setSelectedYacht,
  setDeleteDialog
}) => {
  const context = useContext(Context);
  const intl = useIntl();

  const renderActions = params => {
    return (
      <>
        <Tooltip title={msg("showReservations")}>
          <IconButton
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
            onClick={() => handleOverlayDialog("reservationsList", params.id)}
          >
            <CalendarMonthIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={msg("showPriceList")}>
          <IconButton
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
            onClick={() => handleOverlayDialog("priceList", params.id)}
          >
            <MonetizationOnIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={msg("editYacht")}>
          <IconButton
            component={Link}
            to={"/admin-panel/jachty/" + params.id}
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={msg("deleteYacht")}>
          <IconButton
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
            onClick={() => {
              setSelectedYacht(params.id);
              setDeleteDialog("deleteYacht");
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: intl.formatMessage({ id: "id" }),
      width: 70
    },
    {
      field: "model",
      headerName: intl.formatMessage({ id: "model" }),
      width: 120
    },
    {
      field: "modelNumber",
      headerName: intl.formatMessage({ id: "modelNumber" }),
      width: 120
    },
    {
      field: "name",
      headerName: intl.formatMessage({ id: "name" }),
      width: 280
    },
    {
      field: "actions",
      headerName: intl.formatMessage({ id: "actions" }),
      width: 340,
      renderCell: renderActions,
      sortable: false,
      filterable: false,
      align: "right"
    }
  ];

  return (
    <DataGrid
      sx={{
        marginTop: "10px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "932px"
      }}
      rows={yachts}
      columns={columns}
      density="compact"
      autoHeight={true}
      disableSelectionOnClick={true}
      localeText={
        context.locale === "pl-PL"
          ? plPL.components.MuiDataGrid.defaultProps.localeText
          : enUS.components.MuiDataGrid.defaultProps.localeText
      }
      components={{ ColumnMenu: CustomColumnMenu }}
    />
  );
};

const CustomColumnMenu = props => {
  const { currentColumn } = props;
  if (currentColumn.field === "actions") {
    return (
      <MenuItem
        component={Link}
        to={"/admin-panel/jachty/dodaj-nowy"}
      >
        <ListItemIcon>
          <AddBoxIcon />
        </ListItemIcon>
        <ListItemText>{msg("newYacht")}</ListItemText>
      </MenuItem>
    );
  } else {
    return <DefaultColumnMenu props={props} />;
  }
};

export default YachtGrid;
