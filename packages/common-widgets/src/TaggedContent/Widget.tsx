import * as React from "react";
import { Grid, Typography, Button, Theme } from "@mui/material";
import Item from "./Item";
import { makeStyles } from "@mui/styles";
import { WidgetHelpers, Section } from "@courselit/components-library";
import Link from "next/link";
import Settings from "./Settings";
import type { WidgetProps } from "@courselit/common-models";

const useStyles = ({ backgroundColor }: Settings) =>
  makeStyles((theme: Theme) => ({
    content: {
      background: backgroundColor || "inherit",
    },
    header: {},
    headerTop: {
      marginBottom: theme.spacing(1),
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    callToAction: {},
  }));

export interface FeaturedWidgetProps extends WidgetProps {
  dispatch: any;
}

const Widget = (props: FeaturedWidgetProps) => {
  const { fetchBuilder, utilities, config, dispatch, name } = props;
  const [posts, setPosts] = React.useState([]);
  const [postsOffset] = React.useState(1);
  const BTN_LOAD_MORE = "View all";
  const [settings, setSettings] = React.useState<Settings>({
    tag: "",
    title: "",
    subtitle: "",
  });
  const classes = useStyles(settings)();

  React.useEffect(() => {
    getSettings();
    getPosts();
  }, [postsOffset]);

  const getPosts = async () => {
    const query = `
    query {
      courses: getCourses(offset: 1, tag: "${settings.tag}") {
        id,
        title,
        cost,
        featuredImage {
          file
        },
        slug,
        courseId,
        isBlog
      }
    }
    `;

    const fetch = fetchBuilder.setPayload(query).build();
    try {
      dispatch({ type: "NETWORK_ACTION", flag: true });
      const response = await fetch.exec();
      if (response.courses) {
        setPosts([...posts, ...response.courses]);
      }
    } catch (err) {
    } finally {
      dispatch({ type: "NETWORK_ACTION", flag: false });
    }
  };

  const getSettings = async () => {
    const settings: any = await WidgetHelpers.getWidgetSettings({
      widgetName: name,
      fetchBuilder,
      dispatch,
    });

    if (settings) {
      setSettings(settings);
    }
  };

  return posts.length > 0 ? (
    <Section>
      <Grid item xs={12} className={classes.content}>
        <Grid container spacing={2}>
          <Grid item container className={classes.header} spacing={1}>
            <Grid item xs={12} className={classes.headerTop}>
              <Typography variant="h2">{settings.title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary">
                {settings.subtitle}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {posts.map((post, index) => (
                <Item
                  key={index}
                  appUtilities={utilities}
                  appConfig={config}
                  course={post}
                />
              ))}
            </Grid>
          </Grid>
          {posts.length > 0 && (
            <Grid item xs={12}>
              <Button disableElevation className={classes.callToAction}>
                <Link href="/featured">
                  <a className={classes.link}>{BTN_LOAD_MORE}</a>
                </Link>
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Section>
  ) : (
    <></>
  );
};

export default Widget;
