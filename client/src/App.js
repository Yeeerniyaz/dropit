import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { NavigationProgress } from "@mantine/nprogress";
import { Notifications } from "@mantine/notifications";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Disk from "./pages/Disk";
import Download from "./pages/Download";

import { fetchAuth } from "./redux/slices/auth";
import { getdisk } from "./redux/slices/disk";
import Dashboard from "./pages/Dashoard";
import NavBar from "./components/NavBar";

function View() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchAuth());
      dispatch(getdisk());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/disk" element={<Disk />} />
        <Route path="/download/:id" element={<Download />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NavigationProgress color="orange" />
        <Notifications />
        <View />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
