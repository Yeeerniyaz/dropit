import React from "react";
import { useDispatch } from "react-redux";

import { getdisk } from "../redux/slices/disk";

import { Breadcrumbs } from "@mantine/core";

export default function BreadcrumbsItems({ items, setItems }) {
  const dispatch = useDispatch();
  const lastItem = items.slice(-4);

  const handleClick = (item, index) => {
    setItems(items.slice(0, index + 1));
    dispatch(getdisk({ id: item._id }));
  };

  return (
    <>
      <Breadcrumbs>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setItems([]);
            dispatch(getdisk());
          }}
        >
          D:
        </div>
        {items.length > 4 && <div style={{ cursor: "pointer" }}>...</div>}
        {lastItem.map((item, index) => (
          <div
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleClick(item, index);
            }}
          >
            {item.name}
          </div>
        ))}
      </Breadcrumbs>
    </>
  );
}
