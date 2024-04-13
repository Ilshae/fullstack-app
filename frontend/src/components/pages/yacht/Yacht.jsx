import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getYachtByUrl } from "../../../services/yacht.service";
import { getFilesByYachtId } from "../../../services/file.service";
import { getDisabledDatesByYachtId } from "../../../services/reservation.service";
import { getCharterPrice } from "../../../services/price.service";
import Hero from "./hero/Hero";
import TechnicalData from "./technicalData/TechnicalData";
import Equipment from "./equipment/Equipment";
import Reservation from "./reservation/Reservation";
import Placeholder from "../../common/Placeholder";
import { formatDate, formatRangeToDatesList } from "../../../utils/utils";
import Box from "@mui/material/Box";
import "./Yacht.scss";

const Yacht = ({ match }) => {
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: null,
      endDate: new Date(""),
      key: "selection"
    }
  ]);
  const [reservationForm, setReservationForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    postCode: "",
    street: "",
    streetNumber: "",
    city: "",
    message: ""
  });

  const yachtData = useQuery({
    queryKey: ["yachtData"],
    queryFn: async () => await getYachtByUrl(match.params.url),
    refetchOnWindowFocus: false
  });

  const yachtId = yachtData.data?.yacht?.id;

  const gallery = useQuery({
    queryKey: ["gallery", yachtId],
    queryFn: async () => await getFilesByYachtId(yachtId),
    refetchOnWindowFocus: false,
    enabled: !!yachtId
  });

  const disabledDates = useQuery({
    queryKey: ["disabledDates", yachtId],
    queryFn: async () =>
      await getDisabledDatesByYachtId(yachtId).then(res =>
        formatRangeToDatesList(res)
      ),
    refetchOnWindowFocus: false,
    enabled: !!yachtId,
    refetchInterval: 10000
  });

  const price = useQuery({
    queryKey: ["price"],
    queryFn: async () => {
      const startDate = formatDate(selectedDates[0].startDate);
      const endDate = formatDate(selectedDates[0].endDate);
      return await getCharterPrice({
        yachtId,
        startDate,
        endDate
      });
    },
    refetchOnWindowFocus: false,
    enabled:
      !!yachtId && !!selectedDates[0]?.startDate && !!selectedDates[0]?.endDate
  });

  return (
    <Box
      sx={{
        pl: 8,
        pr: 8,
        width: "1400px",
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      <Placeholder
        status={yachtData.status}
        errorCode={yachtData?.error?.response?.status}
      >
        <Hero
          galleryStatus={gallery.status}
          galleryErrorCode={gallery?.error?.response?.status}
          gallery={gallery?.data}
          {...yachtData.data?.yacht}
        />
        <Box sx={{ display: "flex", flexDirection: "cols", mt: 10 }}>
          <TechnicalData {...yachtData.data?.technicalData} />
          <Equipment {...yachtData.data?.equipment} />
        </Box>
        <Placeholder
          status={disabledDates.status}
          errorCode={disabledDates?.error?.response?.status}
        >
          <Reservation
            disabledDates={disabledDates.data}
            price={price?.data}
            fetchDisabledDates={() => disabledDates.refetch()}
            fetchPrice={() => price.refetch()}
            reservationForm={reservationForm}
            selectedDates={selectedDates}
            setReservationForm={setReservationForm}
            setSelectedDates={setSelectedDates}
            yachtId={yachtId}
          />
        </Placeholder>
      </Placeholder>
    </Box>
  );
};

export default Yacht;
