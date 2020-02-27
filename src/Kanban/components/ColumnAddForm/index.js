import React, { useContext, useState } from "react";
import { KanbanContext } from "../..";
import ColumnAddFormView from "./ColumnAddFormView";

const ColumnAddForm = () => {
  const { addableColumns, addColumn } = useContext(KanbanContext);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleAdd = () => {
    setShowForm(true);
  };

  const handleSubmit = async values => {
    setLoading(true);
    await addColumn(values.label);
    setShowForm(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    addableColumns && (
      <ColumnAddFormView
        showForm={showForm}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onAdd={handleAdd}
        loading={loading}
      />
    )
  );
};

export default ColumnAddForm;
