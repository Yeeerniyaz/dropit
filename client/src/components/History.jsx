import React from "react";
import { useSelector } from "react-redux";
import { Card, Text, SegmentedControl, Skeleton } from "@mantine/core";

import Sender from "./Sender.jsx";
import Receiver from "./Receiver.jsx";

export default function History() {
  const [toggle, setToggle] = React.useState("send");
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.status);

  const sender = user?.shares;
  const receiver = user?.resiver;

  const loading = isLoading !== "loaded";

  return (
    <Card
      withBorder
      h="100%"
      radius="md"
      padding="xl"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      })}
    >
      <Text fw={700} fz="xl" tt="uppercase">
        история
      </Text>
      <SegmentedControl
        value={toggle}
        color="orange"
        tt="uppercase"
        mt={20}
        onChange={setToggle}
        fullWidth
        data={[
          { label: "отправленные", value: "send" },
          { label: "полученные", value: "received" },
        ]}
      />
      <Skeleton h="80%" width="100%" radius="md" visible={loading}>
        {toggle === "send" ? (
          <Sender data={sender} />
        ) : (
          <Receiver data={receiver} />
        )}
      </Skeleton>
    </Card>
  );
}
