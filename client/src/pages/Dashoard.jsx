import React from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

import { SelectUser } from "../redux/slices/auth.js";
import DropIt from "../components/DropIt";
import History from "../components/History";
import ProgressUserFile from "../components/ProgressUserFile";
import UsedSpace from "../components/UsedSpace";

export default function Dashboard() {
  const { width } = useViewportSize();
  const isAuth = useSelector(SelectUser);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!window.localStorage.getItem("token") && !isAuth) {
      navigate("/auth");
    }
  }, [isAuth, navigate]);


  return (
    <>
      <Container size="xl">
        <Flex mt="xs" gap="xs" w="100%" direction={width <= 900 && "column"}>
          <Flex
            w={width <= 900 ? "100%" : "30%"}
            h="620px"
            mt="xs"
            gap="xs"
            direction="column"
          >
            <UsedSpace />
            <ProgressUserFile />
          </Flex>

          <Flex
            w={width <= 900 ? "100%" : "29%"}
            h="620px"
            mt="xs"
            gap="xs"
            direction="column"
          >
            <DropIt />
          </Flex>

          <Flex
            w={width <= 900 ? "100%" : "38%"}
            h="620px"
            mt="xs"
            gap="xs"
            direction="column"
          >
            <History />
          </Flex>
        </Flex>
      </Container>
    </>
  );
}
