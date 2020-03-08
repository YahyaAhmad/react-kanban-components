import React, { useContext } from "react";
import "./style.css";
import { KanbanContext } from "../../../..";

const FormLoader = ({ context = "normal" }) => {
  const { renderLoader } = useContext(KanbanContext);
  return renderLoader(context);
};

export default FormLoader;
