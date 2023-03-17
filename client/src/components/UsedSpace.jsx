import React from "react";
import { useSelector } from "react-redux";

import { Text, Progress, Card, Skeleton } from "@mantine/core";

export default function UsedSpace() {
  const me = useSelector((state) => state.auth.user);
  const isLoadingMe = useSelector((state) => state.auth.status);

  const diskSpace = me?.diskSpace;
  const usedSpace = me?.usedSpace;

  const computeUsedSpacePrecent = (usedSpace) => {
    return Math.round((usedSpace / diskSpace) * 100);
  };

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

  const usedSpacePrecent = computeUsedSpacePrecent(usedSpace);
  const usedSpaceSize = computeSize(usedSpace);
  const diskSpaceSize = computeSize(diskSpace);

  const loading = isLoadingMe !== "loaded";

  return (
    <Skeleton radius="md" visible={loading}>
      <Card
        withBorder
        radius="md"
        padding="xl"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          память
        </Text>
        <Text fz="lg" fw={500}>
          Использовано {usedSpaceSize} из {diskSpaceSize}
        </Text>
        <Progress
          value={usedSpacePrecent}
          mt="md"
          size="lg"
          radius="xl"
          color="orange"
        />
      </Card>
    </Skeleton>
  );
}
