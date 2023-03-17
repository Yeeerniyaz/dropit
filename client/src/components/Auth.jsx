import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectUser } from "../redux/slices/auth.js";
import { useNavigate } from "react-router-dom";

import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";

import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Flex,
  Skeleton,
} from "@mantine/core";

import { fetchLogin, fetchRegister } from "../redux/slices/auth.js";

export default function AuthComponent(props) {
  const isAuth = useSelector(SelectUser);
  const [type, setType] = useToggle(["войдите", "зарегистрируйтесь"]);
  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) =>
        /^\S+@\S+$/.test(val) ? null : "Неверный адрес электронной почты",
      password: (val) =>
        val.length <= 6
          ? "Пароль должен состоять не менее чем из 6 символов"
          : null,
      terms: (val) => (val ? null : "Вы должны согласиться с условиями"),
      firstName: (val) => (val ? null : "Вы должны ввести имя"),
      lastName: (val) => (val ? null : "Вы должны ввести фамилию"),
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit() {
    if (type === "зарегистрируйтесь") {
      const response = await dispatch(fetchRegister(form.values));
      if (response.payload) {
        navigate("/dashboard");
      }
    } else {
      const response = await dispatch(fetchLogin(form.values));
      if (response.payload) {
        navigate("/dashboard");
      }
    }
  }

  const isLoading = useSelector((state) => state.auth.status);
  const loading = isLoading === "loading";

  if (isAuth) {
    return navigate("/");
  }

  return (
    <Paper radius="md" p="md" withBorder {...props}>
      <Skeleton visible={loading}>
        <Text size="lg" weight={400}>
          Добро пожаловать в DROPIT
        </Text>

        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === "зарегистрируйтесь" && (
              <Flex
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
              >
                <TextInput
                  required
                  label="Имя"
                  placeholder="введи имя"
                  value={form.values.firstName}
                  onChange={(event) =>
                    form.setFieldValue("firstName", event.currentTarget.value)
                  }
                  radius="md"
                />

                <TextInput
                  required
                  w={210}
                  label="Фамилия"
                  placeholder="введи фамилию"
                  value={form.values.lastName}
                  onChange={(event) =>
                    form.setFieldValue("lastName", event.currentTarget.value)
                  }
                  radius="md"
                />
              </Flex>
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@dropit.kz"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Неверный адрес электронной почты"}
              radius="md"
            />

            <PasswordInput
              required
              label="Пароль"
              placeholder="введите пароль"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Пароль должен состоять не менее чем из 6 символов"
              }
              radius="md"
            />

            {type === "зарегистрируйтесь" && (
              <Checkbox
                label="Я согласен продать свою душу и частную жизнь этой корпорации"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => setType()}
              size="xs"
            >
              {type === "зарегистрируйтесь"
                ? "У вас уже есть аккаунт? Войти"
                : "У вас нет аккаунта? Зарегистрироваться"}
            </Anchor>
            <Button
              type="submit"
              radius="xl"
              color="orange"
              onClick={handleSubmit}
            >
              {upperFirst(
                type === "зарегистрируйтесь" ? "Зарегистрироваться" : "Войти"
              )}
            </Button>
          </Group>
        </form>
      </Skeleton>
    </Paper>
  );
}
