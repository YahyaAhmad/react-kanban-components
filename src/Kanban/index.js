import React, { useState, useEffect } from "react";
import KanbanView from "./KanbanView";
import Backend from "react-dnd-html5-backend";
import { reduce, orderBy, find, forEach, map, filter, sumBy } from "lodash";
import { DndProvider } from "react-dnd";

export const KanbanContext = React.createContext(null);

const funNotDefined = () => null;

const promiseFunNotDefined = () =>
  new Promise((resolve, reject) => {
    throw new Error(`Promise function not defined`);
  });

const Kanban = ({
  columns = [],
  cards = [],
  onCardClick = funNotDefined,
  onCardsChange = funNotDefined,
  onColumnAdd = promiseFunNotDefined,
  onColumnsChange = funNotDefined,
  renderLoadmore = null,
  onColumnLoadmore = null,
  onColumnRename = funNotDefined,
  addableColumns = false,
  editableColumns = false,
  onColumnDelete = promiseFunNotDefined,
  confirmMessage = "Are you sure that you want to delete this column?",
  columnDeletionAlertMessage = "You can't delete this column since it has cards in it.",
  columnInputPlaceholder = "Name",
  renderLoader = () => <div class="lds-dual-ring"></div>
}) => {
  const [kanbanColumns, setKanbanColumns] = useState([]);
  const [kanbanCards, setKanbanCards] = useState([]);

  useEffect(() => {
    setColumns(columns);

    // Lock any card in a locked column
    cards = map(cards, card => {
      const column = find(columns, { id: card.columnId });
      if (column.locked) {
        card.locked = true;
      }
      return card;
    });

    setCards(cards);
  }, [columns, cards]);

  const setColumns = columns => {
    handleSimilarWeight(columns);

    // Sort columns
    let sortedColumns = orderBy(columns, ["locked", "weight"], ["desc", "asc"]);
    setKanbanColumns(sortedColumns);
  };

  const handleCardsChange = () => {
    onCardsChange(kanbanCards);
  };

  const handleColumnsChange = () => {
    onColumnsChange(kanbanColumns);
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
        similaritem.weight = parseInt(similaritem.weight) + 1;
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
    let locked = false;

    // Check if the new column is a locked column
    const newColumn = find(kanbanColumns, { id: toColumnId });
    if (newColumn.locked) {
      card.locked = true;
      locked = true;
    }

    setCards(newKanbanCards);
    return locked;
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
      let newColumns = [...kanbanColumns];

      // Get the maxiumum weight to set the new column at the end of the list
      const maxiumumWeight = reduce(
        newColumns,
        (prevWeight, curr) =>
          parseInt(curr.weight) >= parseInt(prevWeight)
            ? parseInt(curr.weight)
            : parseInt(prevWeight),
        1
      );

      let addedColumn = {
        label,
        weight: maxiumumWeight + 1,
        locked: false
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

  const renameColumn = (columnId, label) => {
    const newColumns = [...kanbanColumns];
    let columnToRename = find(newColumns, { id: columnId });
    columnToRename.label = label;
    onColumnRename(columnId, label);
    setColumns(newColumns);
  };

  const deleteColumn = async columnId => {
    // Check if there is any cards in this column
    const cards = filter(kanbanCards, { columnId });
    if (cards.length > 0) {
      alert(columnDeletionAlertMessage);
      return;
    }

    await onColumnDelete(columnId);
    let newColumns = { ...kanbanColumns };
    newColumns = filter(newColumns, column => column.id != columnId);
    setColumns(newColumns);
  };

  const columnLoadmore = (id, page) =>
    new Promise(async resolve => {
      const currentCount = sumBy(kanbanCards, { columnId: id });
      const onColumnLoadmorePromise = onColumnLoadmore(id, page, currentCount);
      if (onColumnLoadmorePromise instanceof Promise) {
        const loadmoreCards = await onColumnLoadmorePromise;
        const newCards = [...kanbanCards, ...loadmoreCards];
        setCards(newCards);
        resolve(newCards);
      } else {
        throw new Error("onColumnLoadmore function should be a promise");
      }
    });

  const isLocked = columnId => {
    const column = find(kanbanColumns, { id: columnId });
    return column.locked;
  };

  const kanbanContextValues = {
    swapColumns,
    swapCards,
    moveCard,
    onCardClick,
    columnLoadmore,
    handleCardsChange,
    handleColumnsChange,
    addColumn,
    renameColumn,
    addableColumns,
    editableColumns,
    deleteColumn,
    renderLoadmore,
    confirmMessage,
    columnInputPlaceholder,
    isLocked,
    renderLoader
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
