import React, { useRef, useContext } from "react";
import ColumnView from "./ColumnView";
import { useDrag, useDrop } from "react-dnd";
import types from "../../../constants/types";
import { KanbanContext } from "../../";
const Column = ({ children, weight, label, id }) => {
  const ref = useRef(null);
  const { swapColumns, moveCard } = useContext(KanbanContext);
  const [{ visibility }, dragRef] = useDrag({
    item: { type: types.COLUMN, id },
    collect: monitor => ({
      visibility: monitor.isDragging() ? "hidden" : "visible"
    })
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

      if (weight < item.weight && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging upwards
      if (item.weight > weight && hoverClientX > hoverMiddleX) {
        return;
      }
      console.log(dragIndex, hoverIndex);

      // Time to actually perform the action
      swapColumns(dragIndex, hoverIndex);
    }
  });
  dropRef(dragRef(ref));
  return (
    <ColumnView id={id} visibility={visibility} ref={ref} label={label}>
      {children}
    </ColumnView>
  );
};

export default Column;
