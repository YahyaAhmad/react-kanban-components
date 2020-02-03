import ReactDOM from "react-dom";
import React from "react";
import TestKanban from "./TestKanban";
import { hot } from "react-hot-loader/root";
const Hot = hot(TestKanban);
ReactDOM.render(<Hot />, document.getElementById("kanban"));
