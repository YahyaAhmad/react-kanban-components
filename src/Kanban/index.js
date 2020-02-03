import React, { useState, useEffect } from "react";
import KanbanView from "./KanbanView";
import Backend from "react-dnd-html5-backend";
import { keyBy, sortBy, find, remove } from "lodash";
import { DndProvider } from "react-dnd";

export const KanbanContext = React.createContext(null);

const Kanban = ({ columns = [] }) => {
  const [kanbanColumns, setKanbanColumns] = useState([]);

  useEffect(() => {
    setColumns(columns);
  }, [columns]);

  const setColumns = columns => {
    const sortedColumns = sortBy(columns, "weight");
    setKanbanColumns(sortedColumns);
  };

  const swapColumns = (
    firstColumnId = "column1",
    secondColumnId = "column2"
  ) => {
    console.log(firstColumnId, secondColumnId);
    let newColumns = { ...kanbanColumns };
    const firstColumn = find(newColumns, { id: firstColumnId });
    const secondColumn = find(newColumns, { id: secondColumnId });
    let tempWeight = firstColumn.weight;
    firstColumn.weight = secondColumn.weight;
    secondColumn.weight = tempWeight;
    console.log(newColumns);
    setColumns(newColumns);
  };

  const moveCard = (cardId, fromColumnId, toColumnId) => {
    let newColumns = { ...kanbanColumns };
    let column = find(newColumns, { id: fromColumnId });
    const toColumn = find(newColumns, { id: toColumnId });
    const card = { ...find(column.content, { id: cardId }) };
    console.log(newColumns);
    remove(column.content, { id: cardId });

    toColumn.content.push(card);
    setColumns(newColumns);

  };

  const kanbanContextValues = {
    swapColumns,
    moveCard
  };
  return (
    <KanbanContext.Provider value={kanbanContextValues}>
      <DndProvider backend={Backend}>
        <KanbanView columns={kanbanColumns} />
      </DndProvider>
    </KanbanContext.Provider>
  );
};

export default Kanban;
