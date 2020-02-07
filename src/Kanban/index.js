import React, { useState, useEffect } from "react";
import KanbanView from "./KanbanView";
import Backend from "react-dnd-html5-backend";
import { keyBy, sortBy, find, remove } from "lodash";
import { DndProvider } from "react-dnd";

export const KanbanContext = React.createContext(null);

const Kanban = ({ columns = [], cards = [] }) => {
  const [kanbanColumns, setKanbanColumns] = useState([]);
  const [kanbanCards, setKanbanCards] = useState([]);

  useEffect(() => {
    setColumns(columns);
    setCards(cards);
  }, [columns, cards]);

  const setColumns = columns => {
    const sortedColumns = sortBy(columns, "weight");
    setKanbanColumns(sortedColumns);
  };

  const setCards = cards => {
    const sortedCards = sortBy(cards, "weight");
    setKanbanCards(sortedCards);
  };

  const swapColumns = (
    firstColumnId = "column1",
    secondColumnId = "column2"
  ) => {
    let newColumns = { ...kanbanColumns };
    const firstColumn = find(newColumns, { id: firstColumnId });
    const secondColumn = find(newColumns, { id: secondColumnId });
    let tempWeight = firstColumn.weight;
    firstColumn.weight = secondColumn.weight;
    secondColumn.weight = tempWeight;
    setColumns(newColumns);
  };

  const moveCard = (cardId, fromColumnId, toColumnId) => {
    let newKanbanCards = { ...kanbanCards };
    let card = find(kanbanCards, { id:cardId });
    card.columnId = toColumnId;
    setCards(newKanbanCards);
  };

  const kanbanContextValues = {
    swapColumns,
    moveCard
  };
  return (
    <KanbanContext.Provider value={kanbanContextValues}>
      <DndProvider backend={Backend}>
        <KanbanView columns={kanbanColumns} cards={kanbanCards} />
      </DndProvider>
    </KanbanContext.Provider>
  );
};

export default Kanban;
