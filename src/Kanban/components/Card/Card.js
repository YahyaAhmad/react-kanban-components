import React, { useRef, useContext } from "react";
import "./style.css";
import { useDrag, useDrop } from "react-dnd";
import types from "../../../constants/types";
import { KanbanContext } from "../..";

const Card = ({ id, columnId, children, weight }) => {
  const ref = useRef();
  const { swapCards, onCardClick, handleCardsChange } = useContext(KanbanContext);
  const [{ visibility }, dragRef] = useDrag({
    item: { type: types.CARD, id, columnId, weight },
    isDragging: monitor => monitor.getItem().id == id,
    collect: monitor => ({
      visibility: monitor.isDragging() ? "hidden" : null
    }),
    end: item => {
      if (item.weight != weight || item.columnId != columnId) {
        handleCardsChange();
      }
    }
  });

  const [, dropRef] = useDrop({
    accept: types.CARD,
    hover: (item, monitor) => {
      const cardSize = ref.current.getBoundingClientRect();
      const hover = monitor.getClientOffset();
      const middleY = cardSize.top + cardSize.height / 2;
      const hoverY = hover.y;

      if (!item) {
        return;
      }

      if (hoverY > middleY && item.weight > weight) {
        return;
      }

      if (hoverY < middleY && item.weight < weight) {
        return;
      }

      swapCards(id, item.id);
    }
  });

  const handleClick = () => {
    onCardClick(id);
  };

  const cardRef = dropRef(dragRef(ref));
  return (
    <div
      style={{ visibility }}
      ref={cardRef}
      className="Kanban-Card"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default Card;
