import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as Immutable from "immutable";
import urljoin from "url-join";
import {
  actions,
  AppState,
  createKernelspecsRef,
  createKernelRef,
  makeDummyContentRecord,
  makeContentsRecord,
  makeEntitiesRecord,
  makeStateRecord,
  makeHostsRecord,
  makeCommsRecord,
  makeAppRecord,
  createContentRef,
  createHostRef,
  makeJupyterHostRecord
} from "@nteract/core";
import { HostRecord, ContentRecord } from "@nteract/types";

import configureStore from "./store";
import App from "./app";

require("./fonts");

export interface JupyterConfigData {
  token: string;
  page: "tree" | "view" | "edit";
  contentsPath: string;
  baseUrl: string;
  appVersion: string;
  assetUrl: string;
}

function main(rootEl: Element, dataEl: Node | null) {
  // When the data element isn't there, provide an error message
  // Primarily for development usage
  const ErrorPage = (props: { error?: Error }) => (
    <React.Fragment>
      <h1>ERROR</h1>
      <pre>Unable to parse / process the jupyter config data.</pre>
      {props.error ? props.error.message : null}
    </React.Fragment>
  );

  if (!dataEl) {
    ReactDOM.render(<ErrorPage />, rootEl);
    return;
  }

  let config: JupyterConfigData;

  try {
    if (!dataEl.textContent) {
      throw new Error("Unable to find Jupyter config data.");
    }
    config = JSON.parse(dataEl.textContent);
  } catch (err) {
    ReactDOM.render(<ErrorPage error={err} />, rootEl);
    return;
  }

  // Allow chunks from webpack to load from their built location
  __webpack_public_path__ = urljoin(config.assetUrl, "nteract/static/dist/");

  const jupyterHostRecord = makeJupyterHostRecord({
    basePath: config.baseUrl,
    defaultKernelName: "python",
    id: null,
    origin: location.origin,
    token: config.token,
    type: "jupyter"
  });

  const hostRef = createHostRef();
  const contentRef = createContentRef();

  const initialState: AppState = {
    app: makeAppRecord({
      // TODO: Move into core as a "current" host
      host: jupyterHostRecord,
      version: `nteract-on-jupyter@${config.appVersion}`
    }),
    comms: makeCommsRecord(),
    config: Immutable.Map({
      keybindings: [{ combo: "ctrl + s", action: "save" }],
      theme: "light"
    }),
    core: makeStateRecord({
      entities: makeEntitiesRecord({
        contents: makeContentsRecord({
          byRef: Immutable.Map<string, ContentRecord>().set(
            contentRef,
            makeDummyContentRecord({
              filepath: config.contentsPath
            })
          )
        }),
        hosts: makeHostsRecord({
          byRef: Immutable.Map<string, HostRecord>().set(
            hostRef,
            jupyterHostRecord
          )
        })
      })
    })
  };

  const kernelRef = createKernelRef();
  const kernelspecsRef = createKernelspecsRef();

  const store = configureStore(initialState);
  (window as any).store = store;

  store.dispatch(
    actions.fetchContent({
      contentRef,
      filepath: config.contentsPath,
      kernelRef,
      params: {}
    })
  );
  store.dispatch(actions.fetchKernelspecs({ hostRef, kernelspecsRef }));

  ReactDOM.render(
    <Provider store={store}>
      <App contentRef={contentRef} />
    </Provider>,
    rootEl
  );
}

const rootEl = document.querySelector("#root");
const dataEl = document.querySelector("#jupyter-config-data");

if (!rootEl || !dataEl) {
  alert("Something drastic happened, and we don't have config data");
} else {
  main(rootEl, dataEl);
}
