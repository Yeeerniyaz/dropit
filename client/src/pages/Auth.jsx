import { Center } from "@mantine/core";
import React from "react";
import AuthComponent from "../components/Auth";

export default function Auth() {
  return (
    <Center maw={450} h={600} mx="auto" p={12}>
      <AuthComponent />
    </Center>
  );
}
