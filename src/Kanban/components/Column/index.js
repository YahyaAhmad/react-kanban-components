import React, { useRef, useContext, useState } from "react";
import ColumnView from "./ColumnView";
import { useDrag, useDrop } from "react-dnd";
import types from "../../../constants/types";
import { KanbanContext } from "../../";
import Card from "../Card/Card";
const Column = ({
  children,
  weight,
  label,
  id,
  locked,
  loadmore,
  pageTotal,
  pageSize
}) => {
  const ref = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const {
    swapColumns,
    moveCard,
    handleColumnsChange,
    editableColumns,
    renameColumn,
    columnLoadmore
  } = useContext(KanbanContext);
  const [{ visibility }, dragRef] = useDrag({
    item: { type: types.COLUMN, id },
    collect: monitor => ({
      visibility: monitor.isDragging() ? "hidden" : "visible"
    }),
    end: item => {
      if (item.weight != weight) {
        handleColumnsChange();
      }
    }
  });

  const [{}, dropRef] = useDrop({
    accept: [types.COLUMN, "CARD"],
    hover: (item, monitor) => {
      if (item.type == "CARD") {
        if (item.columnId != id) {
          moveCard(item.id, item.columnId, id);
          item.columnId = id;
        }
        return;
      }
      const dragIndex = item.id;
      const hoverIndex = id;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (locked) {
        return;
      }

      if (weight < item.weight && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging upwards
      if (item.weight > weight && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      swapColumns(dragIndex, hoverIndex);
    }
  });

  const handleNameChange = label => {
    renameColumn(id, label);
  };

  const handleLoadmore = async () => {
    const newPage = currentPage + 1;
    const promise = columnLoadmore(id, newPage);
    promise.then(() => {
      setCurrentPage(newPage);
    });
    return promise;
  };

  if (locked) {
    dropRef(ref);
  } else {
    dropRef(dragRef(ref));
  }

  return (
    <ColumnView
      id={id}
      visibility={visibility}
      ref={ref}
      label={label}
      locked={locked}
      editable={editableColumns}
      onChange={handleNameChange}
      loadmore={loadmore}
      onLoadmore={handleLoadmore}
      pageSize={pageSize}
      pageTotal={pageTotal}
      currentPage={currentPage}
    >
      {children}
    </ColumnView>
  );
};

export default Column;
