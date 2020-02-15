import React, { useState, useEffect } from "react";
import KanbanView from "./KanbanView";
import Backend from "react-dnd-html5-backend";
import { keyBy, sortBy, find, forEach } from "lodash";
import { DndProvider } from "react-dnd";

export const KanbanContext = React.createContext(null);

const funNotDefined = () => null;

const Kanban = ({
  columns = [],
  cards = [],
  onCardClick = funNotDefined,
  onCardsChange = funNotDefined
}) => {
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

  const handleCardsChange = () => {
    onCardsChange(kanbanCards);
  };

  const setCards = cards => {
    
    const recursiveHandleSimilarWeight = (card, cards) => {
      const similarCard = find(
        cards,
        curCard => curCard.id != card.id && card.weight == curCard.weight
      );
      if (similarCard) {
        similarCard.weight = similarCard.weight + 1;
        recursiveHandleSimilarWeight(similarCard, cards);
      }
    };

    const handleSimilarWeight = cards => {
      forEach(cards, card => {
        recursiveHandleSimilarWeight(card, cards);
      });
    };

    // Sometimes, there are cards with the same weight, this function attempt so solve this problem.
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

  const kanbanContextValues = {
    swapColumns,
    swapCards,
    moveCard,
    onCardClick,
    handleCardsChange
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
