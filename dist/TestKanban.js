import React from "react";
import { Kanban } from "../src";
import CardTest from "./CardTest";

const TestKanban = () => {
  const columns = [
    { id: "column1", label: "Column 1", weight: 1, locked: true },
    { id: "column2", label: "Column 2", weight: 2 },
    { id: "column3", label: "Column 3", weight: 3 }
  ];
  const cards = [
    {
      id: 1,
      columnId: "column1",
      title: "Something",
      description: "This is an ordinary 4.",
      component: CardTest,
      weight: 1
    },
    {
      id: 13,
      columnId: "column1",
      title: "Something",
      description: "This is an ordinary 3.",
      component: CardTest,
      weight: 1
    },
    {
      id: 42,
      columnId: "column1",
      title: "Something",
      description: "This is an ordinary 2.",
      component: CardTest,
      weight: 1
    },
    {
      id: 14,
      columnId: "column1",
      title: "Something",
      description: "This is an ordinary 1.",
      component: CardTest,
      weight: 1
    },
    {
      id: 2,
      columnId: "column2",
      title: "Something 2",
      description:
        "Wtf did you just say to me you little bitch, I'll have you know that I...",
      component: CardTest,
      weight: 2
    }
  ];
  return (
    <div>
      <Kanban
        columns={columns}
        cards={cards}
        onCardClick={cardId => console.log(cardId)}
        onCardsChange={cards => console.log(cards)}
      />
    </div>
  );
};

export default TestKanban;
