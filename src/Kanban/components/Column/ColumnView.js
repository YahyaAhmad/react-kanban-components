import React, { useState, useRef, useEffect, useContext } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import { KanbanContext } from "../..";
import { MdRemove, MdRemoveFromQueue, MdClear } from "react-icons/md";
import FormLoader from "../ColumnForm/components/FormLoader";
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
      currentPage,
      renderLoadmore,
      onColumnDelete,
      loading
    },
    ref
  ) => {
    const [editMode, setEditMode] = useState(false);

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
      if (!editMode && inputRef.current) {
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

    const renderContent = () => (
      <>
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
      </>
    );

    const renderHeader = () => (
      <div className="Kanban-Column-Header">
        <h2
          contentEditable={editMode}
          onClick={handleEditMode}
          onBlur={cancelEditMode}
          onKeyDown={handleKeydown}
          className="Kanban-Column-Label"
          ref={inputRef}
          dangerouslySetInnerHTML={{ __html: label }}
        />
        <div>
          {!locked && (
            <a className="Kanban-Column-Delete" onClick={onColumnDelete}>
              <MdClear />
            </a>
          )}
        </div>
      </div>
    );

    return (
      <div className="Kanban-Column-Container">
        <div
          className={columnClasses.join(" ")}
          data-id={id}
          ref={ref}
          style={{ visibility }}
        >
          {loading ? (
            <FormLoader />
          ) : (
            <>
              {renderHeader()}
              {renderContent()}
            </>
          )}
        </div>
      </div>
    );
  }
);

export default ColumnView;
