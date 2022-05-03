import * as React from "react";
import { WidgetHelpers, Section } from "components-library";
import { Button, Grid, TextField, Typography } from "@mui/material";
import Settings from "./settings";
import type { WidgetProps } from "@courselit/common-models";

export interface AdminWidgetProps extends WidgetProps {
  auth: any;
  dispatch: any;
}

const AdminWidget = (props: AdminWidgetProps) => {
  const { name, fetchBuilder, auth, dispatch } = props;
  const [settings, setSettings] = React.useState<Settings>({
    tag: "",
    title: "",
    subtitle: "",
  });
  const [newSettings, setNewSettings] = React.useState<Settings>(settings);

  React.useEffect(() => {
    getSettings();
  }, [name]);

  const getSettings = async () => {
    const settings = await WidgetHelpers.getWidgetSettings({
      widgetName: name,
      fetchBuilder,
      dispatch,
    });

    if (settings) {
      onNewSettingsReceived(settings);
    }
  };

  const onNewSettingsReceived = (settings: any) => {
    setSettings(settings);
    setNewSettings(settings);
  };

  const saveSettings = async (event: any) => {
    event.preventDefault();
    const result = await WidgetHelpers.saveWidgetSettings({
      widgetName: name,
      newSettings,
      fetchBuilder,
      auth,
      dispatch,
    });
    onNewSettingsReceived(result);
  };

  const onChangeData = (e: any) => {
    setNewSettings(
      Object.assign({}, newSettings, {
        [e.target.name]: e.target.value,
      })
    );
  };

  const isDirty = (): boolean => {
    return settings !== newSettings;
  };

  return (
    <Section>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Typography variant="body1">
            Display content tagged with a specific term on the top section of
            the landing page.
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Settings</Typography>
        </Grid>
        <Grid item>
          <form onSubmit={saveSettings}>
            <TextField
              variant="outlined"
              label="Tag"
              fullWidth
              margin="normal"
              name="tag"
              value={newSettings.tag || ""}
              onChange={onChangeData}
              required
            />
            <TextField
              variant="outlined"
              label="Section Title"
              fullWidth
              margin="normal"
              name="title"
              value={newSettings.title || ""}
              onChange={onChangeData}
              required
            />
            <TextField
              variant="outlined"
              label="Section subtitle"
              fullWidth
              margin="normal"
              name="subtitle"
              value={newSettings.subtitle || ""}
              onChange={onChangeData}
            />
            <TextField
              variant="outlined"
              label="Background color"
              placeholder="Enter the color's HEX code"
              fullWidth
              margin="normal"
              name="backgroundColor"
              value={newSettings.backgroundColor || ""}
              onChange={onChangeData}
            />
            <Button type="submit" value="Save" disabled={!isDirty()}>
              Save
            </Button>
          </form>
        </Grid>
      </Grid>
    </Section>
  );
};

export default AdminWidget;
