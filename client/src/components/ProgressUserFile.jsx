import React from "react";

import { Text, Card, Flex, RingProgress, Skeleton } from "@mantine/core";

import axios from "../axios";
import { useSelector } from "react-redux";

export default function ProgressUserFile() {
  const me = useSelector((state) => state.auth.user);
  const isLoadingMe = useSelector((state) => state.auth.status);
  const [progress, setProgress] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const diskkSpace = me?.diskSpace;

  const computeFileSizePrecent = (fileSize) => {
    return Math.round((fileSize / diskkSpace) * 100);
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

  React.useEffect(() => {
    if (isLoadingMe === "loaded") {
      axios.get("/dashboard").then(({ data }) => {
        setProgress(data.fileSizes);
        setLoading(false);
      });
    }
  }, [isLoadingMe, me]);


  const progressItems = [
    {
      type: "Изображения",
      value: computeFileSizePrecent(progress.image),
      size: progress.image,
    },
    {
      type: "Видео",
      value: computeFileSizePrecent(progress.video),
      size: progress.video,
    },
    {
      type: "Документы",
      value: computeFileSizePrecent(progress.document),
      size: progress.document,
    },
    {
      type: "Архивы",
      value: computeFileSizePrecent(progress.archive),
      size: progress.archive,
    },
    {
      type: "Музыка",
      value: computeFileSizePrecent(progress.audio),
      size: progress.audio,
    },
    {
      type: "Другое",
      value: computeFileSizePrecent(progress.other),
      size: progress.video,
    },
  ];

  return (
    <Skeleton h="100%" radius="md" visible={loading}>
      <Card
        withBorder
        radius="md"
        padding="xl"
        w="100%"
        h="100%"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          Файлы
        </Text>

        {!loading && (
          <RingProgress
            size={190}
            thickness={13}
            roundCaps
            sections={progressItems.map((item) => ({
              value: item.value,
              color:
                item.type === "Изображения"
                  ? "blue"
                  : item.type === "Видео"
                  ? "red"
                  : item.type === "Документы"
                  ? "green"
                  : item.type === "Архивы"
                  ? "yellow"
                  : item.type === "Музыка"
                  ? "purple"
                  : item.type === "Другое"
                  ? "orange"
                  : "gray",
            }))}
          />
        )}

        {progressItems.map((item) => (
          <Flex key={item.type} align="center" justify="space-between" mt="md">
            <Text size="sm" weight={500}>
              {item.type}
            </Text>
            <Text size="sm" weight={500}>
              {computeSize(item.size)}
            </Text>
          </Flex>
        ))}
      </Card>
    </Skeleton>
  );
}
