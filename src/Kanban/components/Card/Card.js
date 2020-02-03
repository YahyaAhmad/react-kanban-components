import React from "react";
import "./style.css";
import { useDrag } from "react-dnd";

const Card = ({ title, id, columnId }) => {
  const [{ visibility }, dragRef] = useDrag({
    item: { type: "CARD", id, columnId },
    collect: monitor => ({
      visibility: monitor.isDragging() ? "hidden" : null
    })
  });
  return (
    <div style={{ visibility }} ref={dragRef} className="Kanban-Card">
      <h3>{title}</h3>
    </div>
  );
};

export default Card;
