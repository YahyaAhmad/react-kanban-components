import React, { useState, useRef, useEffect, useContext } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import { KanbanContext } from "../..";
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
      onLoadmore,
      pageTotal,
      pageSize,
      currentPage
    },
    ref
  ) => {
    const [editMode, setEditMode] = useState(false);
    const { renderLoadmore } = useContext(KanbanContext);

    const inputRef = useRef();
    let columnClasses = ["Kanban-Column"];

    if (locked) {
      columnClasses.push("Locked");
    }

    useEffect(() => {
      if (editMode) {
        inputRef.current.focus();
        document.execCommand("selectAll", false, null);
      }
    }, [editMode]);

    useEffect(() => {
      if (!editMode) {
        const labelInput = inputRef.current.innerHTML;
        if (!labelInput) {
          inputRef.current.innerHTML = label;
        }
      }
    }, [editMode]);

    const handleEditMode = () => {
      if (editable) {
        setEditMode(true);
      }
    };

    const cancelEditMode = () => setEditMode(false);

    const handleKeydown = e => {
      if (e.which == 13) {
        const labelInput = inputRef.current.innerHTML;
        formSubmit(labelInput);
        return false;
      }
    };

    const formSubmit = label => {
      if (label) {
        onChange(label);
      }

      cancelEditMode();
    };

    const loadmoreVisible = () => {
      const currentItems = pageSize * (currentPage + 1);

      return currentItems < pageTotal;
    };

    return (
      <div className="Kanban-Column-Container">
        <div
          className={columnClasses.join(" ")}
          data-id={id}
          ref={ref}
          style={{ visibility }}
        >
          <h2
            contentEditable={editMode}
            onClick={handleEditMode}
            onBlur={cancelEditMode}
            onKeyDown={handleKeydown}
            className="Kanban-Column-Label"
            ref={inputRef}
            dangerouslySetInnerHTML={{ __html: label }}
          />

          <div className="Kanban-Column-Content">{children}</div>
          {loadmore && (
            <div className="Kanban-Loadmore">
              {loadmoreVisible()
                ? renderLoadmore(onLoadmore, {
                    columnId: id,
                    pageSize,
                    pageTotal
                  })
                : null}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ColumnView;
