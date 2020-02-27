import React, { useContext, useState } from "react";
import { KanbanContext } from "../..";
import ColumnAddFormView from "./ColumnAddFormView";

const ColumnAddForm = () => {
  const { addableColumns, addColumn } = useContext(KanbanContext);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    setShowForm(true);
  };

  const handleSubmit = values => {
    addColumn(values.label);
    setShowForm(false);
  };

  return (
    addableColumns && (
      <ColumnAddFormView
        showForm={showForm}
        onSubmit={handleSubmit}
        onAdd={handleAdd}
      />
    )
  );
};

export default ColumnAddForm;
