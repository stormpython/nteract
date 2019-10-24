import * as React from "react";
import { connect } from "react-redux";
import { selectors, AppState } from "@nteract/core";

import Manager from "./manager";
import { WidgetModel } from "@jupyter-widgets/base";

interface JupyterWidgetData {
  model_id: string;
  version_major: number;
  version_minor: number;
}

interface Props {
  data: JupyterWidgetData;
  model: WidgetModel;
}

export class WidgetDisplay extends React.Component<Props> {
  static MIMETYPE = "application/vnd.jupyter.widget-view+json";

  render() {
    return (
      <Manager model={this.props.model} model_id={this.props.data.model_id} />
    );
  }
}

const mapStateToProps = (state: AppState, props: Props) => {
  const {
    data: { model_id }
  } = props;
  return {
    model: selectors.modelById(state, { commId: model_id })
  };
};

export default connect(
  mapStateToProps,
  null
)(WidgetDisplay);
