import React from "react";
import moment from "moment";
import "moment/locale/ru";

import {
  PinInput,
  Flex,
  TextInput,
  Button,
  Text,
  Card,
  rem,
  Divider,
} from "@mantine/core";
import { SegmentedControl } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useDispatch, useSelector } from "react-redux";
import { createStyles } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { dropUpload, resetDropIt } from "../redux/slices/dropit";
import { addShare } from "../redux/slices/auth";

export default function DropZoneModal() {
  const { classes } = useStyles();

  const [term, setTerm] = React.useState("7d");
  const [code, setCode] = React.useState("");
  const [receiver, setReceiver] = React.useState("");
  const [file, setFile] = React.useState(null);
  const values = { receiver, term, code };
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("values", JSON.stringify(values));
    if (!file) {
      notifications.show({
        title: "Ошибка",
        message: "Файл не выбран",
        color: "red",
      });
      return;
    }
    const data = await dispatch(dropUpload(formData));
    if (data.payload) {
      dispatch(addShare(data.payload));
    }
  };

  const resetDrop = () => {
    dispatch(resetDropIt());
    setFile(null);
    setCode("");
    setReceiver("");
    setTerm("7d");
  };

  const data = useSelector((state) => state.dropIt.data);
  const isLoading = useSelector((state) => state.dropIt.status);

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
    if (term === 7776000000) {
      return `Ссылка истекает когда скачают 1 раз или  ${moment(dateFuture)
        .endOf("day")
        .fromNow()}`;
    }
    if (dateNow > dateFuture) {
      return "Ссылка устарела";
    } else {
      return (
        moment(dateFuture).endOf("day").fromNow() +
        " cрок действия ссылки истекает"
      );
    }
  };

  return (
    <Card
      h="100%"
      withBorder
      radius="md"
      padding="xl"
      w="100%"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      })}
    >
      <Text fw={700} fz="xl" tt="uppercase">
        Поделись файлом
      </Text>

      <SegmentedControl
        value={term}
        color="orange"
        mt={20}
        onChange={setTerm}
        fullWidth
        data={[
          { label: "1 скачивание", value: "90d" },
          { label: "7 дней", value: "7d" },
          { label: "15 дней", value: "15d" },
          { label: "30 дней", value: "30d" },
        ]}
      />
      <Flex
        mt={20}
        gap="md"
        justify="space-between"
        align="center"
        direction="row"
      >
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          Устоновить Код?
        </Text>

        <PinInput
          color="orange"
          length={4}
          radius="md"
          value={code}
          onChange={(value) => setCode(value)}
        />
      </Flex>

      <TextInput
        placeholder="hello@dropit.kz"
        label="КОМУ"
        radius="xs"
        mt={20}
        value={receiver}
        onChange={(event) => setReceiver(event.currentTarget.value)}
      />

      {data ? (
        <Card bg="none" sx={() => ({ minHeight: rem(220) })}>
          <Flex direction="column" justify="center" h="100%" w="100%">
            <Text fw={700} fz="xl" tt="uppercase">
              {data.name.split("-")[1]}
            </Text>
            <Text fw={700} tt="uppercase">
              {computeSize(data.size)}
            </Text>
            <Divider mt={20} mb={20} />
            <Text fw={700} fz="xl" tt="uppercase">
              {data._id}
            </Text>
            <Text>{computeTerm(data.createdAt, data.term)}</Text>
          </Flex>
        </Card>
      ) : (
        <>
          <Dropzone
            onDrop={(file) => {
              setFile(file[0]);
            }}
            mt={20}
            className={isLoading === "loaded" ? classes.disabled : null}
            loading={isLoading === "loading"}
            sx={(theme) => ({
              minHeight: rem(220),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "md",
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],

              "&[data-accept]": {
                color: theme.white,
                backgroundColor: theme.colors.orange[8],
              },

              "&[data-reject]": {
                color: theme.white,
                backgroundColor: theme.colors.red[6],
              },
            })}
          >
            <Text align="center">Выберите файл или перетащите сюда</Text>
          </Dropzone>
        </>
      )}

      {!data && file && (
        <Text size="sm" align="center" mt="sm">
          Файл: {file.name}
        </Text>
      )}

      {data ? (
        <>
          <Button
            color="orange"
            mt={20}
            uppercase
            fullWidth
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.origin + "/download/" + data._id
              );
              notifications.show({
                title: "Успешно",
                message: "Ссылка скопирована",
                color: "orange",
              });
            }}
          >
            Cкоипировать ссылку
          </Button>
          <Button
            color="orange"
            mt={20}
            uppercase
            fullWidth
            onClick={resetDrop}
          >
            Отправить новый файл
          </Button>
        </>
      ) : (
        <Button
          color="orange"
          mt={20}
          uppercase
          fullWidth
          onClick={handleSubmit}
          loading={isLoading === "loading"}
        >
          Отправить
        </Button>
      )}
    </Card>
  );
}

const useStyles = createStyles((theme) => ({
  disabled: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
    cursor: "not-allowed",

    "& *": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[5],
    },
  },
}));
