import React from "react";
import { map, omit } from "lodash";
import Column from "./components/Column";
import "./style.css";

const KanbanView = ({ columns }) => {
  const renderCards = (cards = [], columnId) => {
    return map(cards, card => {
      const Card = card.component;
      if (!Card) {
        // return null;
      }
      const cardProps = omit(card, "component");
      return <Card key={card.id} {...cardProps} columnId={columnId} />;
    });
  };

  const renderColumns = () => {
    console.log(columns);
    return map(columns, column => {
      const columnProps = omit(column, "content");
      return (
        <Column key={column.id} {...columnProps}>
          {renderCards(column.content, column.id)}
        </Column>
      );
    });
  };

  return <div className="Kanban">{renderColumns()}</div>;
};

export default KanbanView;
