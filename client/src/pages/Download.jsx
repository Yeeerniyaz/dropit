import { Button, Card, Center, Flex, PinInput, Skeleton } from "@mantine/core";
import axios from "../axios";
import React from "react";
import { useParams } from "react-router-dom";

import moment from "moment";
import { notifications } from "@mantine/notifications";

function Download() {
  const { id } = useParams();
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [code, setCode] = React.useState("");

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

  const download = () => {
    if (data?.code) {
      if (code.length < 4) {
        notifications.show({
          title: "Ошибка",
          message: "Код не введен",
          color: "red",
        });
        return;
      }
    }
    axios({
      url: `/share/download/${id}`,
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", data.name);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Ошибка",
          message: "Попробуйте попытку позже",
          color: "red",
        });
      });
  };

  React.useEffect(() => {
    axios
      .get(`/share/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <Center>
      <Card
        withBorder
        mt={50}
        w={500}
        radius="md"
        padding={loading ? "xs" : "md"}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        })}
      >
        <Skeleton radius="md" visible={loading}>
          <Flex direction="column" gap="xs">
            <h3>{data.name}</h3>
            <p>{`Отправитель: ${data?.sender}`}</p>
            <p>{`Получатель: ${data?.receiver || "Не указно"}`}</p>
            <p>{computeTerm(data.createdAt, data.term)}</p>
            <p>{computeSize(data.size)}</p>
            {data?.code && (
              <>
                <p>Что бы скачать файл, введите код:</p>
                <PinInput
                  color="orange"
                  length={4}
                  radius="md"
                  value={code}
                  onChange={(value) => setCode(value)}
                />
              </>
            )}
            <Button
              color="orange"
              fullWidth
              disabled={
                computeTerm(data.createdAt, data.term) === "Ссылка устарела"
              }
              onClick={() => {
                download();
              }}
            >
              Скачать
            </Button>
          </Flex>
        </Skeleton>
      </Card>
    </Center>
  );
}

export default Download;
