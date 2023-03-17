import { Button, Card, Flex, ScrollArea, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React from "react";
import moment from "moment";

import { IconCopy } from "@tabler/icons-react";

const computeSize = (size) => {
  if (size < 1024) {
    return size + "б";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + "Кб";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(1) + "Мб";
  } else {
    return (size / 1024 / 1024 / 1024).toFixed(1) + "Гб";
  }
};

const computeTerm = (createdAt, term) => {
  const date = new Date(createdAt);
  const dateFuture = new Date(date.getTime() + term);
  const dateNow = new Date();

  if (dateNow > dateFuture) {
    return "Ссылка устарела";
  } else {
    return "До: " + moment(dateFuture).format("ll");
  }
};

function Sender({ data }) {

  const sender = data?.map((item, index) => {
    return (
      <Card key={index} radius="md" shadow="sm" padding="xs" mt="xs">
        <Flex gap="xs" justify="space-between" wrap="wrap">
          <div>
            <Text>{item.name.split("-").slice(1).join("-")}</Text>
            <Text fz="xs" opacity={0.7}>
              {computeTerm(item.createdAt, item.term)} |{" "}
              {computeSize(item.size)}
            </Text>
          </div>
          <Button
            color="orange"
            radius="md"
            p="5"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/download/${item._id}`
              );
              notifications.show({
                title: "Ссылка скопирована",
                message: "Ссылка скопирована в буфер обмена",
                color: "orange",
              });
            }}
          >
            <IconCopy />
          </Button>
        </Flex>
      </Card>
    );
  });

  return (
    <Flex justify="flex-start" direction="column" wrap="wrap">
      <ScrollArea
        h={500}
        type="auto"
        offsetScrollbars
        scrollbarSize={4}
        scrollHideDelay={3000}
      >
        {sender}
      </ScrollArea>
    </Flex>
  );
}

export default Sender;
