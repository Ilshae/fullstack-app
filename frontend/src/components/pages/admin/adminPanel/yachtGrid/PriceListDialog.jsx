import React, { useContext } from "react";
import { msg, Transition } from "../../../../../utils/utils";
import DefaultColumnMenu from "../../../../common/DefaultColumnMenu";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Placeholder from "../../../../common/Placeholder";
import Box from "@mui/material/Box";
import { DataGrid, enUS, plPL } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import { Context } from "../../../../../Wrapper";
import { useIntl } from "react-intl";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListItemText from "@mui/material/ListItemText";
import { useQuery } from "@tanstack/react-query";
import { getYachtName } from "../../../../../services/yacht.service";

const PriceListDialog = ({
  setSelectedPrice,
  setDeleteDialog,
  handleOverlayDialog,
  prices,
  yachtId,
  status,
  errorCode
}) => {
  const context = useContext(Context);
  const intl = useIntl();

  const yachtName = useQuery({
    queryKey: ["yachtName"],
    queryFn: async () => await getYachtName(yachtId),
    refetchOnWindowFocus: false
  });

  const renderActions = params => {
    return (
      <>
        <Tooltip title={msg("editPrice")}>
          <IconButton
            component={Link}
            to={"/admin-panel/ceny/" + params.id}
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={msg("deletePrice")}>
          <IconButton
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
            onClick={() => {
              setSelectedPrice(params.id);
              setDeleteDialog("deletePrice");
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  const columns = [
    { field: "id", headerName: intl.formatMessage({ id: "id" }), width: 70 },
    {
      field: "date",
      headerName: intl.formatMessage({ id: "date" }),
      width: 120
    },
    {
      field: "price",
      headerName: `${intl.formatMessage({ id: "price" })} [zł]`,
      width: 80
    },
    {
      field: "actions",
      headerName: intl.formatMessage({ id: "actions" }),
      width: 160,
      renderCell: renderActions,
      sortable: false,
      filterable: false,
      align: "right"
    }
  ];

  const CustomColumnMenu = props => {
    const { currentColumn } = props;
    if (currentColumn.field === "actions") {
      return (
        <>
          <MenuItem
            component={Link}
            to={"/admin-panel/ceny/dodaj-nowa/" + yachtId}
          >
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText>{msg("newPrice")}</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedPrice("all");
              setDeleteDialog("deletePrice");
            }}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>{msg("deletePrices")}</ListItemText>
          </MenuItem>
        </>
      );
    } else {
      return <DefaultColumnMenu props={props} />;
    }
  };

  return (
    <Dialog
      open={true}
      fullScreen
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => handleOverlayDialog("initial")}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1 }}
            variant="h6"
            component="div"
          >
            {msg("priceList")}&nbsp;&nbsp;&nbsp;
            {yachtName.data?.model} {yachtName.data?.modelNumber}{" "}
            {yachtName.data?.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Placeholder
        status={status}
        errorCode={errorCode}
      >
        <Box sx={{ width: "100%" }}>
          <DataGrid
            sx={{
              marginTop: "10px",
              marginLeft: "auto",
              marginRight: "auto",
              width: "420px"
            }}
            rows={prices}
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
        </Box>
      </Placeholder>
    </Dialog>
  );
};

export default PriceListDialog;
