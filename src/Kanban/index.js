import React, { useState, useEffect } from "react";
import KanbanView from "./KanbanView";
import Backend from "react-dnd-html5-backend";
import { reduce, sortBy, find, forEach } from "lodash";
import { DndProvider } from "react-dnd";

export const KanbanContext = React.createContext(null);

const funNotDefined = () => null;

const Kanban = ({
  columns = [],
  cards = [],
  onCardClick = funNotDefined,
  onCardsChange = funNotDefined,
  onColumnAdd = funNotDefined,
  addableColumns = false
}) => {
  const [kanbanColumns, setKanbanColumns] = useState([]);
  const [kanbanCards, setKanbanCards] = useState([]);

  useEffect(() => {
    setColumns(columns);
    setCards(cards);
  }, [columns, cards]);

  const setColumns = columns => {
    handleSimilarWeight(columns);
    console.log(columns);

    // Sort columns
    const sortedColumns = sortBy(columns, "weight");
    setKanbanColumns(sortedColumns);
  };

  const handleCardsChange = () => {
    onCardsChange(kanbanCards);
  };

  /**
   * Sometimes, there are items with the same weight, this function attempt so solve this problem.
   *
   */
  const handleSimilarWeight = collection => {
    const recursiveHandleSimilarWeight = (item, collection) => {
      const similaritem = find(
        collection,
        curitem => curitem.id != item.id && item.weight == curitem.weight
      );
      if (similaritem) {
        similaritem.weight = similaritem.weight + 1;
        recursiveHandleSimilarWeight(similaritem, collection);
      }
    };

    forEach(collection, item => {
      recursiveHandleSimilarWeight(item, collection);
    });
  };

  const setCards = cards => {
    handleSimilarWeight(cards);
    // Sort the cards.
    const sortedCards = sortBy(cards, "weight");
    setKanbanCards(sortedCards);
  };

  /**
   * Swap between columns.
   *
   * @param {*} firstColumnId
   * @param {*} secondColumnId
   */
  const swapColumns = (firstColumnId, secondColumnId) => {
    let newColumns = { ...kanbanColumns };
    const firstColumn = find(newColumns, { id: firstColumnId });
    const secondColumn = find(newColumns, { id: secondColumnId });
    let tempWeight = firstColumn.weight;
    firstColumn.weight = secondColumn.weight;
    secondColumn.weight = tempWeight;
    setColumns(newColumns);
  };

  /**
   * Move the card to a different column.
   *
   * @param {*} cardId
   * @param {*} fromColumnId
   * @param {*} toColumnId
   */
  const moveCard = (cardId, fromColumnId, toColumnId) => {
    let newKanbanCards = { ...kanbanCards };
    let card = find(kanbanCards, { id: cardId });
    card.columnId = toColumnId;
    setCards(newKanbanCards);
  };

  /**
   * Swap between two cards.
   *
   * @param {*} firstCardId
   * @param {*} secondCardId
   */
  const swapCards = (firstCardId, secondCardId) => {
    let newKanbanCards = { ...kanbanCards };
    const firstCard = find(newKanbanCards, { id: firstCardId });
    const secondCard = find(newKanbanCards, { id: secondCardId });
    let temp = firstCard.weight;
    firstCard.weight = secondCard.weight;
    secondCard.weight = temp;
    setCards(newKanbanCards);
  };

  const addColumn = label => {
    let newColumns = [...kanbanColumns];

    // Get the maxiumum weight to set the new column at the end of the list
    const maxiumumWeight = reduce(
      newColumns,
      (prevWeight, curr) =>
        curr.weight >= prevWeight ? curr.weight : prevWeight,
      1
    );

    console.log(maxiumumWeight);

    let addedColumn = {
      label,
      weight: maxiumumWeight + 1
    };

    const id = onColumnAdd(label);

    addedColumn.id =
      typeof id === "undefined" ? Math.floor(10000 * Math.random()) : id;

    newColumns.push(addedColumn);

    setColumns(newColumns);
  };

  const kanbanContextValues = {
    swapColumns,
    swapCards,
    moveCard,
    onCardClick,
    handleCardsChange,
    addColumn,
    addableColumns
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