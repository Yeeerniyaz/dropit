import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout, SelectUser } from "../redux/slices/auth";

export default function NavBar() {
  const dispatch = useDispatch();
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useStyles();

  const isAuth = useSelector(SelectUser);

  const mainLinks = [
    { label: "Главная", link: "/" },
    { label: "Панель управления", link: "/dashboard" },
    { label: "хранилище", link: "/disk" },
    !isAuth && { label: "Войти", link: "/auth" },
  ];

  const clickLogout = () => {
    dispatch(logout());
  };

  const mainItems = mainLinks.map((item, index) => (
    <NavLink
      to={item.link}
      key={index}
      className={({ isActive }) =>
        classes.mainLink + " " + (isActive && classes.mainLinkActive)
      }
    >
      {item.label}
    </NavLink>
  ));

  return (
    <Header mb={0}>
      <Container size="xl" className={classes.inner}>
        <Text size={27} weight={700} color="orange">
          DROPIT
        </Text>

        <div className={classes.links}>
          <Group spacing={0}>
            {mainItems}
            {isAuth && (
              <NavLink
                to="/"
                onClick={clickLogout}
                className={classes.mainLink}
              >
                Выйти
              </NavLink>
            )}
          </Group>
        </div>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
      </Container>
    </Header>
  );
}

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  links: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  mainLink: {
    textTransform: "uppercase",
    fontSize: `${rem(13)}`,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[6],
    padding: `${rem(10)} ${rem(0)}`,
    marginRight: `${rem(10)}`,
    fontWeight: 700,
    borderBottom: `${rem(2)} solid transparent`,
    transition: "border-color 100ms ease, color 100ms ease",

    "&:hover": {
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      textDecoration: "none",
    },
  },

  mainLinkActive: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottomWidth: rem(4),
    borderBottomColor:
      theme.colors["orange"][theme.colorScheme === "dark" ? 9 : 6],
  },
}));
