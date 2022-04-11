import React from "react";
import { styled } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import SessionButton from "../SessionButton";
import { useTheme } from "@mui/styles";
import dynamic from "next/dynamic";

const PREFIX = "Header";

const classes = {
  branding: `${PREFIX}-branding`,
};

const StyledGrid = styled(Grid)(({ theme }: { theme: any }) => ({
  [`& .${classes.branding}`]: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const Branding = dynamic(() => import("./Branding"));

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const theme: Theme = useTheme();

  return (
    <StyledGrid
      container
      justifyContent="space-between"
      direction="row"
      alignItems="center"
    >
      <Grid item>
        <div className={classes.branding}>
          <Branding />
        </div>
      </Grid>
      {!theme.hideLoginButton && (
        <Grid item>
          <SessionButton />
        </Grid>
      )}
    </StyledGrid>
  );
};

export default Header;
