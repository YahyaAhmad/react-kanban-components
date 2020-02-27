import React, { useState, useEffect } from "react";
import KanbanView from "./KanbanView";
import Backend from "react-dnd-html5-backend";
import { reduce, orderBy, find, forEach } from "lodash";
import { DndProvider } from "react-dnd";

export const KanbanContext = React.createContext(null);

const funNotDefined = () => null;

const promiseFunNotDefined = () =>
  new Promise((resolve, reject) => {
    const newId = Math.floor(10000 * Math.random());
    resolve(newId);
  });

const Kanban = ({
  columns = [],
  cards = [],
  onCardClick = funNotDefined,
  onCardsChange = funNotDefined,
  onColumnAdd = promiseFunNotDefined,
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
    let sortedColumns = orderBy(columns, ["locked", "weight"], ["desc", "asc"]);
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
    const sortedCards = orderBy(cards, "weight", "asc");
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

  const addColumn = label =>
    new Promise(async resolve => {
      console.log("Submit");

      let newColumns = [...kanbanColumns];

      // Get the maxiumum weight to set the new column at the end of the list
      const maxiumumWeight = reduce(
        newColumns,
        (prevWeight, curr) =>
          curr.weight >= prevWeight ? curr.weight : prevWeight,
        1
      );

      let addedColumn = {
        label,
        weight: maxiumumWeight + 1
      };

      let promise = onColumnAdd(label, maxiumumWeight + 1);

      if (!(promise instanceof Promise)) {
        throw new Error("onColumnAdd should return a promise");
      }

      addedColumn.id = await promise;

      newColumns.push(addedColumn);

      resolve(addedColumn);

      setColumns(newColumns);
    });

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
