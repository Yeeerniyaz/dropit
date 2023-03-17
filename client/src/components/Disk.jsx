import React from "react";
import { Card, Divider } from "@mantine/core";
import Breadcrumbs from "./Breadcrumbs";
import DiskHeader from "./DiskHeader";
import { useSelector } from "react-redux";
import DiskTable from "./DiskTable";

export default function DiskMain() {
  const [BreadcrumbsItems, setBreadcrumbsItems] = React.useState([]);
  const { files } = useSelector((state) => state.disk);

  return (
    <Card
      withBorder
      radius="md"
      padding="md"
      h="100%"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      })}
    >
      <DiskHeader items={BreadcrumbsItems} />
      <Breadcrumbs items={BreadcrumbsItems} setItems={setBreadcrumbsItems} />
      <Divider my="sm" />
      <DiskTable
        elements={files}
        setHistory={setBreadcrumbsItems}
        history={BreadcrumbsItems}
      />
    </Card>
  );
}
