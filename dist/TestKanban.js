import React from "react";
import { Kanban } from "../src";
import Card from "../src/Kanban/components/Card/Card";

const TestKanban = () => {
  const columns = [
    {
      id: "column1",
      weight: 0,
      label: "Column Test",
      content: [
        {
          id: "1",
          title: "My only advancements",
          component: Card
        }
      ]
    },
    {
      id: "column2",
      weight: 1,
      label: "Column Test 2",
      content: [
        {
          id: "34",
          title: "My only aa",
          component: Card
        }
      ]
    },
    {
      id: "column3",
      weight: 2,
      label: "Column Test 3",
      content: [
        {
          id: "3",
          title: "My only aa",
          component: Card
        }
      ]
    }
  ];
  return (
    <div>
      <Kanban columns={columns} />
    </div>
  );
};

export default TestKanban;
