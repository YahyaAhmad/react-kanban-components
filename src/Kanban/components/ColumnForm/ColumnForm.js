import React, { useRef, useEffect } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import FormLoader from "./components/FormLoader";
const ColumnForm = ({
  showForm = false,
  onAdd,
  onSubmit,
  onCancel,
  columnInputPlaceholder,
  loading
}) => {
  const { handleSubmit, register, errors } = useForm();
  const inputRef = useRef();

  useEffect(() => {
    // Focus the input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="Kanban-Column-Form">
      <div className="Kanban-Form-Inputs">
        <input
          type="text"
          name="label"
          className="form-control"
          placeholder={columnInputPlaceholder}
          ref={e => {
            register(e, { required: true });
            inputRef.current = e;
          }}
          autoComplete="off"
        />
      </div>
      <div className="Kanban-Form-Actions">
        <button className="btn btn-primary Kanban-Column-Submit" type="submit">
          {loading ? <FormLoader context="columnForm" /> : <MdAdd />}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-danger Kanban-Column-Delete"
        >
          <MdDelete />
        </button>
      </div>
    </form>
  );
  const renderAddButton = () => (
    <button onClick={onAdd} className="Kanban-Column-Add">
      <MdAdd />
    </button>
  );

  return <div>{showForm ? renderForm() : renderAddButton()}</div>;
};

export default ColumnForm;
