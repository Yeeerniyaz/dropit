import {
  createStyles,
  Image,
  Container,
  Title,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import image from "../image/logo1.png";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(30),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: "orange",
    }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export default function HomeComponent() {
  const { classes } = useStyles();
  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Безопасно <span className={classes.highlight}>передавайте</span>{" "}
              файлы с помощью облачного хранилища{" "}
              <span style={{ color: "#e8590c" }}>DROPIT</span>
            </Title>
            <Text color="dimmed" mt="md">
              Быстрая передача файлов позволяет быстро и легко передавать
              большие файлы между разными устройствами. Это просто и удобно, и
              вы можете передавать файлы без проблем и быстро
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl" color="orange">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Быстрая передача файлов</b> – С помощью облачного хранилища
                DROPIT вы можете быстро и легко передавать большие файлы между
                устройствами.
              </List.Item>
              <List.Item>
                <b>Безопасность</b> – Облачное хранилище DROPIT предоставляет
                вам высокий уровень безопасности для ваших файлов.
              </List.Item>
              <List.Item>
                <b>Удобство</b> – Облачное хранилище DROPIT предоставляет вам
                удобный интерфейс для передачи файлов между устройствами.
              </List.Item>
            </List>

            <Group mt={30} color="orange"></Group>
          </div>
          <Image src={image} className={classes.image} />
        </div>
      </Container>
    </div>
  );
}
