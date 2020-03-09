import React, { useRef, useEffect } from "react";
import { map, omit, filter } from "lodash";
import Column from "./components/Column";
import "./style.css";
import Card from "./components/Card/Card";
import ColumnForm from "./components/ColumnForm";

const KanbanView = ({ columns, cards }) => {
  const kanbanRef = useRef();
  const renderCards = columnId => {
    const columnCards = filter(cards, { columnId });
    return map(columnCards, card => {
      const Component = card.component;
      if (!Component) {
        throw new Error("There is a card without a component.");
      }
      const cardProps = omit(card, "component");
      return (
        <Card key={card.id} {...cardProps}>
          <Component {...cardProps} />
        </Card>
      );
    });
  };

  useEffect(() => {
    if (kanbanRef.current) {
      kanbanRef.current.addEventListener("wheel", handleScroll, {
        passive: false
      });
    }
  }, [kanbanRef]);

  const renderColumns = () => {
    return map(columns, column => {
      const columnProps = omit(column, "content");
      return (
        <Column key={column.id} {...columnProps}>
          {renderCards(column.id)}
        </Column>
      );
    });
  };

  const handleScroll = (e, delta) => {
    if (kanbanRef.current) {
      const delta = e.deltaY;
      kanbanRef.current.scrollLeft += delta / 1.2;
      e.preventDefault();
    }
  };

  return (
    <div className="Kanban" ref={kanbanRef}>
      {renderColumns()}
      <ColumnForm />
    </div>
  );
};

export default KanbanView;
