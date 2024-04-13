import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { msg } from "../../../../utils/utils";
import {
  getAdminContent,
  getUsers,
  logout
} from "../../../../services/auth.service";
import {
  deleteYacht as deleteYachtAPI,
  getYachts
} from "../../../../services/yacht.service";
import {
  deleteReservation as deleteReservationAPI,
  deleteReservationsByYachtId,
  getReservationsByYachtId
} from "../../../../services/reservation.service";
import {
  deletePrice as deletePriceAPI,
  deletePricesByYachtId,
  getPricesByYachtId
} from "../../../../services/price.service";
import { deleteUser as deleteUserAPI } from "../../../../services/auth.service";
import ReservationDialog from "./yachtGrid/ReservationDialog";
import PriceListDialog from "./yachtGrid/PriceListDialog";
import YachtGrid from "./yachtGrid/YachtGrid";
import UserGrid from "./userGrid/UserGrid";
import DeleteDialog from "../../../common/Dialog";
import Snackbar from "../../../common/Snackbar";
import Placeholder from "../../../common/Placeholder";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const AdminPanel = () => {
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [overlayDialog, setOverlayDialog] = useState("initial");
  const [deleteDialog, setDeleteDialog] = useState("initial");

  const adminPanel = useQuery({
    queryKey: ["adminPanel"],
    queryFn: async () => await getAdminContent(),
    refetchOnWindowFocus: false
  });

  const yachts = useQuery({
    queryKey: ["adminPanelYachts"],
    queryFn: async () => await getYachts(),
    enabled: !!adminPanel.isSuccess,
    refetchInterval: 10000
  });

  const users = useQuery({
    queryKey: ["adminPanelUsers"],
    queryFn: async () => {
      const res = await getUsers();
      return mergeRolesFromResponse(res);
    },
    enabled: !!adminPanel.isSuccess,
    refetchInterval: 10000
  });

  const reservations = useQuery({
    queryKey: ["adminPanelReservations", selectedYacht],
    queryFn: async () => await getReservationsByYachtId(selectedYacht),
    enabled:
      !!selectedYacht &&
      deleteDialog === "initial" &&
      overlayDialog === "reservationsList",
    refetchInterval: 10000
  });

  const prices = useQuery({
    queryKey: ["adminPanelPrices", selectedYacht],
    queryFn: async () => await getPricesByYachtId(selectedYacht),
    enabled:
      !!selectedYacht &&
      deleteDialog === "initial" &&
      overlayDialog === "priceList",
    refetchInterval: 10000
  });

  const deleteYacht = useQuery({
    queryKey: ["deleteYacht"],
    queryFn: async () => await deleteYachtAPI(selectedYacht),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const deleteUser = useQuery({
    queryKey: ["deleteUser"],
    queryFn: async () => await deleteUserAPI(selectedUser),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const deleteReservation = useQuery({
    queryKey: ["deleteReservation"],
    queryFn: async () => await deleteReservationAPI(selectedReservation),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const deleteReservations = useQuery({
    queryKey: ["deleteReservations"],
    queryFn: async () => await deleteReservationsByYachtId(selectedYacht),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const deletePrice = useQuery({
    queryKey: ["deletePrice"],
    queryFn: async () => await deletePriceAPI(selectedPrice),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const deletePrices = useQuery({
    queryKey: ["deletePrices"],
    queryFn: async () => await deletePricesByYachtId(selectedYacht),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const handleDeleteReservation = async () => {
    if (selectedReservation === "all") await deleteReservations.refetch();
    else await deleteReservation.refetch();
    await setDeleteDialog("initial");
    await setSelectedReservation(null);
    reservations.refetch();
  };

  const handleDeletePrice = async () => {
    if (selectedPrice === "all") await deletePrices.refetch();
    else await deletePrice.refetch();
    await setDeleteDialog("initial");
    await setSelectedPrice(null);
    prices.refetch();
  };

  const handleDeleteYacht = async () => {
    await setDeleteDialog("initial");
    await deleteYacht.refetch();
    await setSelectedYacht(null);
    yachts.refetch();
  };

  const handleDeleteUser = async () => {
    await setDeleteDialog("initial");
    await deleteUser.refetch();
    await setSelectedUser(null);
    users.refetch();
  };

  const handleOverlayDialog = async (value, id) => {
    if (value === "initial") {
      await setSelectedYacht(null);
      setOverlayDialog("initial");
    } else await setSelectedYacht(id);
    if (value === "reservationsList") {
      await setOverlayDialog(value);
      await reservations.refetch();
    } else if (value === "priceList") {
      await setOverlayDialog(value);
      await prices.refetch();
    }
  };

  const queries = {
    deleteYacht,
    deleteUser,
    deleteReservation,
    deleteReservations,
    deletePrice,
    deletePrices
  };

  const queriesTime = {
    deleteYacht: queryUpdatedAt(deleteYacht),
    deleteUser: queryUpdatedAt(deleteUser),
    deleteReservation: queryUpdatedAt(deleteReservation),
    deleteReservations: queryUpdatedAt(deleteReservations),
    deletePrice: queryUpdatedAt(deletePrice),
    deletePrices: queryUpdatedAt(deletePrices)
  };

  const queriesFetching = () => {
    const queriesBeingFetched = Object.values(queries).filter(
      query => query.isFetching
    );
    if (queriesBeingFetched?.length) return queriesBeingFetched[0];
    return false;
  };

  const freshestQuery = () => {
    let freshiestQuery = Object.keys(queriesTime)[0];
    let freshiestQueryTime = Object.values(queriesTime)[0];

    Object.entries(queriesTime).map(([key, value]) => {
      if (freshiestQueryTime < value) {
        freshiestQuery = key;
        freshiestQueryTime = value;
      }
    });

    freshiestQuery = queries[freshiestQuery];
    if (queriesFetching()) return queriesFetching();
    return freshiestQuery;
  };

  const handleCancel = () => {
    if (deleteDialog === "deleteYacht")
      return () => {
        setSelectedYacht(null);
        setDeleteDialog("initial");
      };
    else if (deleteDialog === "deleteUser")
      return () => {
        setSelectedUser(null);
        setDeleteDialog("initial");
      };
    else if (deleteDialog === "deleteReservation")
      return () => {
        setSelectedReservation(null);
        setDeleteDialog("initial");
      };
    else if (deleteDialog === "deletePrice")
      return () => {
        setSelectedPrice(null);
        setDeleteDialog("initial");
      };
  };

  const handleOk = () => {
    if (deleteDialog === "deleteYacht") return handleDeleteYacht;
    else if (deleteDialog === "deleteUser") return handleDeleteUser;
    else if (deleteDialog === "deleteReservation")
      return handleDeleteReservation;
    else if (deleteDialog === "deletePrice") return handleDeletePrice;
  };

  const handleText = () => {
    if (deleteDialog === "deleteYacht") return "confirmDeleteYacht";
    else if (deleteDialog === "deleteUser") return "confirmDeleteUser";
    else if (deleteDialog === "deleteReservation")
      return selectedReservation === "all"
        ? "confirmDeleteReservations"
        : "confirmDeleteReservation";
    else if (deleteDialog === "deletePrice")
      return selectedPrice === "all"
        ? "confirmDeletePrices"
        : "confirmDeletePrice";
  };

  const openSnackbar = !!Object.values(queries).find(
    query => query.isFetching || query.isSuccess || query.isError
  );

  return (
    <Box sx={{ pl: 2, pr: 2, display: "flex", flexDirection: "column" }}>
      <Box sx={{ alignSelf: "flex-end", display: "flex" }}>
        <Button
          variant="contained"
          onClick={() => logout()}
          type="submit"
        >
          {msg("logOut")}
        </Button>
      </Box>
      <Placeholder
        status={adminPanel.status}
        errorCode={adminPanel?.error?.response?.status}
      >
        <Placeholder
          status={yachts.status}
          errorCode={yachts?.error?.response?.status}
        >
          <YachtGrid
            yachts={yachts?.data ? yachts?.data : []}
            setSelectedYacht={setSelectedYacht}
            setDeleteDialog={setDeleteDialog}
            handleOverlayDialog={handleOverlayDialog}
          />
        </Placeholder>
        <Placeholder
          status={users.status}
          errorCode={users?.error?.response?.status}
        >
          <UserGrid
            users={users?.data ? users?.data : []}
            setSelectedUser={setSelectedUser}
            setDeleteDialog={setDeleteDialog}
          />
        </Placeholder>
        <Snackbar
          open={openSnackbar}
          action="delete"
          status={freshestQuery().status}
          errorCode={freshestQuery()?.error?.response?.status}
        />
        {deleteDialog !== "initial" && (
          <DeleteDialog
            handleCancel={handleCancel()}
            handleOk={handleOk()}
            text={handleText()}
          />
        )}
        {overlayDialog === "reservationsList" && (
          <ReservationDialog
            setSelectedReservation={setSelectedReservation}
            setDeleteDialog={setDeleteDialog}
            handleOverlayDialog={handleOverlayDialog}
            reservations={reservations.data}
            yachtId={selectedYacht}
            status={reservations.status}
            errorCode={reservations?.error?.response?.status}
          />
        )}
        {overlayDialog === "priceList" && (
          <PriceListDialog
            setSelectedPrice={setSelectedPrice}
            setDeleteDialog={setDeleteDialog}
            handleOverlayDialog={handleOverlayDialog}
            prices={prices.data}
            yachtId={selectedYacht}
            status={prices.status}
            errorCode={prices?.error?.response?.status}
          />
        )}
      </Placeholder>
    </Box>
  );
};

const mergeRolesFromResponse = res => {
  return Object.values(
    res.reduce((r, o) => {
      r[o.id] = r[o.id] || {
        id: o.id,
        email: o.email,
        username: o.username,
        roles: []
      };
      r[o.id]["roles"].push(o.roles);
      return r;
    }, {})
  );
};

const queryUpdatedAt = query =>
  query.dataUpdatedAt >= query.errorUpdatedAt
    ? query.dataUpdatedAt
    : query.errorUpdatedAt;

export default AdminPanel;
