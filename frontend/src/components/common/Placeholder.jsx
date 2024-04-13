import React from "react";
import Spinner from "./Spinner";
import Alert from "./Alert";
import { includesErrorStatuses } from "../../utils/utils";

const Placeholder = ({ status, errorCode, children }) => {
  if (status === "loading") return <Spinner />;
  else if (status === "error") return <Alert text={text(errorCode)} />;
  return <>{children}</>;
};

const text = errorCode => {
  if (includesErrorStatuses(errorCode)) return `error${errorCode}`;
  return "noData";
};

export default Placeholder;
