import React from "react";
import { Kanban } from "../src";
import Card from "../src/Kanban/components/Card/Card";

const TestKanban = () => {
  const columns = [
    { id: "column1", label: "Column 1", weight: 1 },
    { id: "column2", label: "Column 2", weight: 2 }
  ];
  const cards = [
    {
      id: 1,
      columnId: "column1",
      title: "Something",
      component: Card,
      weight: 1
    },
    {
      id: 2,
      columnId: "column1",
      title: "Something 2",
      component: Card,
      weight: 2
    }
  ];
  return (
    <div>
      <Kanban columns={columns} cards={cards} />
    </div>
  );
};

export default TestKanban;
