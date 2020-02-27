import React from "react";
import { MdAdd } from "react-icons/md";
import { useForm } from "react-hook-form";
const ColumnAddFormView = ({ showForm = false, onAdd, onSubmit }) => {
  const { handleSubmit, register, errors } = useForm();

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="Kanban-Column-Form">
      <div className="row">
        <div className="col">
          <input
            type="text"
            name="label"
            className="form-control"
            placeholder="Name"
            ref={register({ required: true })}
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" type="submit">
            Add
          </button>
        </div>
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

export default ColumnAddFormView;
