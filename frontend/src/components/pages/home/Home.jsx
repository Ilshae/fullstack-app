import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getModels, getYachtsFilter } from "../../../services/yacht.service";
import FilterCard from "./FilterCard";
import Tile from "./Tile";
import Placeholder from "../../common/Placeholder";
import Alert from "../../common/Alert";
import { filterCardWidth } from "./common";
import { formatDate } from "../../../utils/utils";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";

const Home = () => {
  const [filters, setFilters] = useState({
    model: null,
    startDate: null,
    endDate: null,
    maxPrice: ""
  });

  const models = useQuery({
    queryKey: ["models"],
    queryFn: async () => await getModels(),
    refetchOnWindowFocus: false
    // refetchInterval: 10000
  });

  const yachts = useQuery({
    queryKey: ["yachts"],
    queryFn: async () => {
      const {
        model,
        startDate: _startDate,
        endDate: _endDate,
        maxPrice
      } = filters;
      let startDate = null;
      let endDate = null;
      if (_startDate) startDate = formatDate(_startDate.$d);
      if (_endDate) endDate = formatDate(_endDate.$d);
      return await getYachtsFilter({
        model,
        startDate,
        endDate,
        maxPrice
      });
    },
    refetchOnWindowFocus: false,
    refetchInterval: 10000
  });

  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ pt: 1 }}
    >
      <Placeholder
        status={models.status}
        errorCode={models?.error?.response?.status}
      >
        {models.data && (
          <FilterCard
            refetch={() => yachts.refetch()}
            models={models.data}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        <Placeholder
          status={yachts.status}
          errorCode={yachts?.error?.response?.status}
        >
          {yachts?.data?.length ? (
            <ImageList
              data-test={"tiles"}
              cols={3}
              sx={{ margin: 0, width: `calc(100% - ${filterCardWidth})` }}
            >
              {yachts.data.map(item => (
                <Tile
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  model={item.model}
                  modelNumber={item.modelNumber}
                  url={item.url}
                />
              ))}
            </ImageList>
          ) : (
            <Alert
              styles={{ margin: 0, width: `calc(100% - ${filterCardWidth})` }}
            />
          )}
        </Placeholder>
      </Placeholder>
    </Box>
  );
};

export default Home;
