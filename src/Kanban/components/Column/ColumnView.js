import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
const ColumnView = React.forwardRef(
  (
    {
      children,
      label,
      visibility,
      id,
      locked,
      editable,
      onChange,
      loadmore,
      onLoadmore
    },
    ref
  ) => {
    const { register, errors, handleSubmit } = useForm();
    const [editMode, setEditMode] = useState(false);
    const inputRef = useRef();
    let columnClasses = ["Kanban-Column"];

    useEffect(() => {
      if (editMode) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [editMode]);

    if (locked) {
      columnClasses.push("Locked");
    }

    const adjustTextareaHeight = () => {
      inputRef.current.style.height = "5px";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    };

    const handleEditMode = () => {
      if (editable) {
        setEditMode(true);
      }
    };

    const handleKeydown = e => {
      if (e.which == 13) {
        handleSubmit(formSubmit)();
      }
    };

    const formSubmit = values => {
      setEditMode(false);
      onChange(values["label"]);
    };

    const renderLabel = () =>
      editMode ? (
        <textarea
          className="form-control Kanban-Column-Label"
          defaultValue={label}
          onChange={adjustTextareaHeight}
          name="label"
          onKeyDown={handleKeydown}
          ref={e => {
            register(e);
            inputRef.current = e;
          }}
        />
      ) : (
        <h2 onClick={handleEditMode} className="Kanban-Column-Label">
          {label}
        </h2>
      );

    return (
      <div className="Kanban-Column-Container">
        <div
          className={columnClasses.join(" ")}
          data-id={id}
          ref={ref}
          style={{ visibility }}
        >
          {renderLabel()}
          <div className="Kanban-Column-Content">{children}</div>
          {loadmore && (
            <div className="Kanban-Loadmore">
              <button className="Kanban-Loadmore-Button" onClick={onLoadmore}>
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ColumnView;
