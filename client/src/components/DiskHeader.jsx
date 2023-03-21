import React from "react";
import { useDispatch } from "react-redux";

import { InputBase, NativeSelect } from "@mantine/core";
import { Input } from "@mantine/core";
import { Group } from "@mantine/core";
import { Flex } from "@mantine/core";
import { Button } from "@mantine/core";
import { Modal } from "@mantine/core";

import { createDir, getdisk } from "../redux/slices/disk";
import { uploadFile } from "../redux/slices/disk";

export default function DiskHeader({ items }) {
  const [createDirModal, setCreateDirModal] = React.useState(false);
  const [createDirName, setCreateDirName] = React.useState("");
  const [sort, setSort] = React.useState("type");
  const fileRef = React.useRef();

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createDir({
        name: createDirName,
        parent: items.length > 0 ? items[items.length - 1]._id : undefined,
        type: "dir",
      })
    );
    setCreateDirName("");
    setCreateDirModal(false);
  };

  React.useEffect(() => {
    dispatch(getdisk({ sort }));
  }, [sort, dispatch]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    dispatch(
      uploadFile({
        file,
        parent: items.length > 0 ? items[items.length - 1]._id : undefined,
      })
    );
  };

  return (
    <Flex mb={10} justify="space-between" direction="row" wrap="wrap" gap={10}>
      <Group>
        <Button
          color="orange"
          size="xs"
          compact
          uppercase
          onClick={() => {
            setCreateDirModal(true);
          }}
        >
          Создать папку
        </Button>
        <Button
          variant="default"
          compact
          uppercase
          size="xs"
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          Загрузить файл
        </Button>
      </Group>

      <Group align="self-end">
        <Input
          variant="filled"
          size="xs"
          placeholder="Поиск"
          styles={(theme) => ({
            input: {
              "&:focus-within": {
                borderColor: theme.colors.orange[7],
              },
            },
          })}
        />
        <NativeSelect
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          data={[
            { label: "По типу", value: "type" },
            { label: "По названию", value: "name" },
            { label: "По дате", value: "date" },
            { label: "По размеру", value: "size"}
          ]}
          variant="filled"
          size="xs"
        />
      </Group>

      <Modal
        opened={createDirModal}
        onClose={() => {
          setCreateDirModal(false);
        }}
        title="Создание папки"
        size="md"
        radius="md"
      >
        <InputBase
          required
          label="Название папки"
          color="orange"
          value={createDirName}
          onChange={(e) => setCreateDirName(e.target.value)}
        />
        <Group position="right">
          <Button color="orange" mt="md" onClick={handleSubmit}>
            Создать
          </Button>
        </Group>
      </Modal>
      <input type="file" ref={fileRef} onChange={handleFileUpload} hidden />
    </Flex>
  );
}
