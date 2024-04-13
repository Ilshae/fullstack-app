import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { getCurrentUser } from "../../../../../services/auth.service";
import { DataGrid, enUS, plPL } from "@mui/x-data-grid";
import { Context } from "../../../../../Wrapper";
import Tooltip from "@mui/material/Tooltip";
import { msg } from "../../../../../utils/utils";
import IconButton from "@mui/material/IconButton";
import PasswordIcon from "@mui/icons-material/Password";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListItemText from "@mui/material/ListItemText";
import DefaultColumnMenu from "../../../../common/DefaultColumnMenu";

const UserGrid = ({ users, setSelectedUser, setDeleteDialog }) => {
  const context = useContext(Context);
  const intl = useIntl();

  const renderActions = params => {
    return (
      <>
        <Tooltip title={msg("resetPassword")}>
          <IconButton
            component={Link}
            to={"/admin-panel/uzytkownicy/resetuj-haslo/" + params.id}
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
          >
            <PasswordIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={msg("editUser")}>
          <IconButton
            component={Link}
            to={"/admin-panel/uzytkownicy/" + params.id}
            variant="contained"
            size="small"
            style={{ marginLeft: 6 }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        {getCurrentUser().id !== params.id && (
          <Tooltip title={msg("deleteUser")}>
            <IconButton
              variant="contained"
              size="small"
              style={{ marginLeft: 6 }}
              onClick={() => {
                setSelectedUser(params.id);
                setDeleteDialog("deleteUser");
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </>
    );
  };

  const renderRoles = params => {
    return params.row.roles.join(", ");
  };

  const columns = [
    {
      field: "id",
      headerName: intl.formatMessage({ id: "id" }),
      width: 70
    },
    {
      field: "username",
      headerName: intl.formatMessage({ id: "username" }),
      width: 280
    },
    {
      field: "email",
      headerName: intl.formatMessage({ id: "email" }),
      width: 180
    },
    {
      field: "roles",
      headerName: intl.formatMessage({ id: "roles" }),
      width: 180,
      renderCell: renderRoles
    },
    {
      field: "actions",
      headerName: intl.formatMessage({ id: "actions" }),
      width: 220,
      renderCell: renderActions,
      sortable: false,
      filterable: false,
      align: "right"
    }
  ];

  return (
    <DataGrid
      sx={{
        marginTop: "100px",
        marginLeft: "auto",
        marginRight: "auto",
        width: "932px"
      }}
      rows={users}
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
        to={"/admin-panel/uzytkownicy/dodaj-nowego"}
      >
        <ListItemIcon>
          <AddBoxIcon />
        </ListItemIcon>
        <ListItemText>{msg("newUser")}</ListItemText>
      </MenuItem>
    );
  } else {
    return <DefaultColumnMenu props={props} />;
  }
};

export default UserGrid;
