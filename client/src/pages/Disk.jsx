import { Container, Flex, ScrollArea } from "@mantine/core";
import React from "react";

import DiskMain from "../components/Disk";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SelectUser } from "../redux/slices/auth.js";

function Disk() {
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
        <ScrollArea
          h="92vh"
          w="100%"
          type="never"
          offsetScrollbars
          scrollbarSize={12}
        >
          <Flex h="89vh" mt={20}>
            <div
              style={{
                width: "100%",
              }}
            >
              <DiskMain />
            </div>
          </Flex>
        </ScrollArea>
      </Container>
    </>
  );
}

export default Disk;
