import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { deleteFile, getdisk } from "../redux/slices/disk";

import {
  Table,
  Group,
  Text,
  ActionIcon,
  ScrollArea,
  Skeleton,
} from "@mantine/core";
import { IconTrash, IconVideo } from "@tabler/icons-react";
import { IconMusic } from "@tabler/icons-react";
import { IconFolderFilled } from "@tabler/icons-react";
import { IconFileDescription } from "@tabler/icons-react";
import { IconFileDownload } from "@tabler/icons-react";
import { IconCamera } from "@tabler/icons-react";
import { IconFile } from "@tabler/icons-react";
import { ThemeIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

import moment from "moment";
import "moment/locale/ru";

import axios from "../axios";
import { notifications } from "@mantine/notifications";

export default function DiskTable({ elements, history, setHistory }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.disk);
  const loading = status !== "loaded";

  const momentDate = (date) => {
    return moment(date).calendar();
  };

  const size = (size) => {
    if (size < 1024) {
      return size + " B";
    } else if (size < 1048576) {
      return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1073741824) {
      return (size / 1048576).toFixed(2) + " MB";
    } else {
      return (size / 1073741824).toFixed(2) + " GB";
    }
  };

  const Icon = (mimeTypes) => {
    const type = mimeTypes.split("/")[0];
    switch (type) {
      case "video":
        return <IconVideo size="1rem" />;
      case "audio":
        return <IconMusic size="1rem" />;
      case "text":
        return <IconFileDescription size="1rem" />;
      case "application":
        return <IconFileDownload size="1rem" />;
      case "image":
        return <IconCamera size="1rem" />;
      default:
        return <IconFile size="1rem" />;
    }
  };

  const handleRowClick = (item) => {
    if (item.type === "dir") {
      dispatch(getdisk({id: item._id}));
      setHistory([...history, item]);
    }
  };

  const FileDownload = (item) => {
    axios({
      url: `/disk/download/${item._id}`,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.name);
        document.body.appendChild(link);
        link.click();
        notifications.show({
          title: "Успешно",
          message: "Файл успешно загружен",
          color: "orange",
        });
      })
      .catch((error) => {
        notifications.showNotification({
          title: "Ошибка",
          message: error.response.data.message || "Ошибка загрузки файла",
          color: "red",
        });
      });
  };

  const remove = (item) => {
    dispatch(deleteFile(item._id));
  };

  const rows = elements.map((item, index) => (
    <tr key={index}>
      <td>
        <Group
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleRowClick(item);
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
            onClick={() => {
              handleRowClick(item);
            }}
          >
            {item.type === "dir" ? (
              <ThemeIcon variant="light" color="orange" size="lg">
                <IconFolderFilled size="1rem" />
              </ThemeIcon>
            ) : (
              <ThemeIcon variant="light" color="orange" size="lg">
                {Icon(item.mimeTypes)}
              </ThemeIcon>
            )}

            <div>
              <Text fz="sm" fw={500}>
                {item.name}
              </Text>
            </div>
          </div>
        </Group>
      </td>
      <td
        onClick={() => {
          handleRowClick(item);
        }}
      >
        <Text fz="sm">{momentDate(item.createdAt)}</Text>
      </td>
      <td
        onClick={() => {
          handleRowClick(item);
        }}
      >
        <Text fz="sm">{size(item.size)}</Text>
      </td>
      <td>
        <Group spacing={0} position="right">
          {item.type !== "dir" && (
            <ActionIcon
              onClick={() => {
                FileDownload(item);
              }}
            >
              <IconDownload size="1rem" stroke={1.5} />
            </ActionIcon>
          )}
          <ActionIcon
            onClick={() => {
              remove(item);
            }}
          >
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea
      type="auto"
      h="calc(100vh - 100px)"
      offsetScrollbars
      scrollbarSize={12}
      scrollHideDelay={1000}
    >
      <Skeleton visible={loading} radius="md">
        <Table mb={70}>
          <tbody>{rows}</tbody>
        </Table>
      </Skeleton>
    </ScrollArea>
  );
}
