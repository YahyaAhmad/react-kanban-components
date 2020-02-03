import React from "react";
import "./style.css";
const ColumnView = React.forwardRef(
  ({ children, label, visibility, id }, ref) => {
    return (
      <div className="Kanban-Column-Container">
        <div className="Kanban-Column" data-id={id} ref={ref} style={{ visibility }}>
          <div className="Kanban-Column-Label">{label}</div>
          <div className="Kanban-Column-Content">{children}</div>
        </div>
      </div>
    );
  }
);

export default ColumnView;
