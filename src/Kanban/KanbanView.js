import React from "react";
import { map, omit, filter } from "lodash";
import Column from "./components/Column";
import "./style.css";
import Card from "./components/Card/Card";

const KanbanView = ({ columns, cards }) => {
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

  return <div className="Kanban">{renderColumns()}</div>;
};

export default KanbanView;
