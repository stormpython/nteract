import { CellType } from "@nteract/commutable";
import { actions, ContentRef, KernelRef } from "@nteract/core";
import * as React from "react";
import { HotKeys, KeyMap } from "react-hotkeys";
import { connect } from "react-redux";
import { Dispatch } from "redux";

// Show nothing while loading the notebook app
const NotebookPlaceholder = (props: any) => null;

interface State {
  App: React.ComponentType<{ contentRef: ContentRef }>;
}

interface Props {
  contentRef: ContentRef;
  kernelRef: KernelRef;
  addTransform?(component: any): void;
}

interface IDispatchFromProps {
  handlers?: any;
}

interface InitialProps {
  contentRef: ContentRef;
}

type NotebookProps = Props & IDispatchFromProps;

class Notebook extends React.PureComponent<NotebookProps, State> {
  private keyMap: KeyMap = {
    CHANGE_CELL_TYPE: [
      "ctrl+shift+y",
      "ctrl+shift+m",
      "meta+shift+y",
      "meta+shift+m"
    ],
    COPY_CELL: ["ctrl+shift+c", "meta+shift+c"],
    CREATE_CELL_ABOVE: ["ctrl+shift+a", "meta+shift+a"],
    CREATE_CELL_BELOW: ["ctrl+shift+b", "meta+shift+b"],
    CUT_CELL: ["ctrl+shift+x", "meta+shift+x"],
    DELETE_CELL: ["ctrl+shift+d", "meta+shift+d"],
    EXECUTE_ALL_CELLS: ["alt+r a"],
    INTERRUPT_KERNEL: ["alt+r i"],
    KILL_KERNEL: ["alt+r k"],
    PASTE_CELL: ["ctrl+shift+v", "meta+shift+v"],
    RESTART_KERNEL: ["alt+r r", "alt+r c", "alt+r a"],
    SAVE: ["ctrl+s", "ctrl+shift+s", "meta+s", "meta+shift+s"]
  };

  constructor(props: NotebookProps) {
    super(props);
    this.state = {
      App: NotebookPlaceholder
    };
  }

  loadApp(): void {
    import(/* webpackChunkName: "notebook-app-component" */
    "@nteract/notebook-app-component").then(module => {
      this.setState({ App: module.default });
    });
  }

  loadTransforms(): void {
    import(/* webpackChunkName: "plotly" */
    "@nteract/transform-plotly").then(module => {
      this.props.addTransform(module.default);
      this.props.addTransform(module.PlotlyNullTransform);
    });

    import(/* webpackChunkName: "tabular-dataresource" */
    "@nteract/data-explorer").then(module => {
      this.props.addTransform(module.default);
    });

    import(/* webpackChunkName: "jupyter-widgets" */
    "@nteract/jupyter-widgets").then(module => {
      this.props.addTransform(module.WidgetDisplay);
    });

    import("@nteract/transform-model-debug").then(module => {
      this.props.addTransform(module.default);
    });

    import(/* webpackChunkName: "vega-transform" */
    "@nteract/transform-vega").then(module => {
      this.props.addTransform(module.VegaLite1);
      this.props.addTransform(module.VegaLite2);
      this.props.addTransform(module.Vega2);
      this.props.addTransform(module.Vega3);
    });
  }

  componentDidMount(): void {
    this.loadApp();
    this.loadTransforms();
  }

  render(): JSX.Element {
    const App = this.state.App;

    return (
      <React.Fragment>
        <HotKeys keyMap={this.keyMap} handlers={this.props.handlers}>
          <App contentRef={this.props.contentRef} />
        </HotKeys>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: NotebookProps) => {
  const { contentRef, kernelRef } = ownProps;

  console.log(kernelRef);

  return {
    addTransform: (transform: React.ComponentType & { MIMETYPE: string }) => {
      return dispatch(
        actions.addTransform({
          mediaType: transform.MIMETYPE,
          component: transform
        })
      );
    },
    // `HotKeys` handlers object
    // see: https://github.com/greena13/react-hotkeys#defining-handlers
    handlers: {
      CHANGE_CELL_TYPE: (event: KeyboardEvent) => {
        const type: CellType = event.key === "Y" ? "code" : "markdown";
        return dispatch(actions.changeCellType({ to: type, contentRef }));
      },
      COPY_CELL: () => dispatch(actions.copyCell({ contentRef })),
      CREATE_CELL_ABOVE: () =>
        dispatch(actions.createCellAbove({ cellType: "code", contentRef })),
      CREATE_CELL_BELOW: () =>
        dispatch(
          actions.createCellBelow({
            cellType: "code",
            source: "",
            contentRef
          })
        ),
      CUT_CELL: () => dispatch(actions.cutCell({ contentRef })),
      DELETE_CELL: () => dispatch(actions.deleteCell({ contentRef })),
      EXECUTE_ALL_CELLS: () =>
        dispatch(actions.executeAllCells({ contentRef })),
      INTERRUPT_KERNEL: () => dispatch(actions.interruptKernel({ kernelRef })),
      KILL_KERNEL: () => {
        dispatch(
          actions.killKernel({
            kernelRef,
            restarting: false
          })
        );
      },
      PASTE_CELL: () => dispatch(actions.pasteCell({ contentRef })),
      RESTART_KERNEL: (event: KeyboardEvent) => {
        const outputHandling: "None" | "Clear All" | "Run All" =
          event.key === "r"
            ? "None"
            : event.key === "a"
            ? "Run All"
            : "Clear All";

        return dispatch(
          actions.restartKernel({ outputHandling, contentRef, kernelRef })
        );
      },
      SAVE: () => dispatch(actions.save({ contentRef }))
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Notebook);
