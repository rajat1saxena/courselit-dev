import React from "react";
import { FetchBuilder } from "utils";
import { useTheme } from "@mui/material";
import { connect } from "react-redux";
import type { Address } from "common-models";
import type { AppState } from "state-management";

interface Component {
  caption: string;
  component: any;
  icon?: string;
}

interface DetailsProps {
  name: string;
  component: Component;
  address: Address;
}

const Details = ({ name, component, address }: DetailsProps) => {
  const theme = useTheme();
  const fetch = new FetchBuilder()
    .setUrl(`${address.backend}/api/graph`)
    .setIsGraphQLEndpoint(true);
  const { component: Component } = component;

  return <Component name={name} fetchBuilder={fetch} theme={theme} />;
};

const mapStateToProps = (state: AppState) => ({
  address: state.address,
});

export default connect(mapStateToProps)(Details);
