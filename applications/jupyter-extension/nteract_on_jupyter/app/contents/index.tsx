import * as React from "react";
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { hot } from "react-hot-loader";
>>>>>>> moving keybinding functionality to Content component
import { connect } from "react-redux";
import { dirname } from "path";
import * as actions from "@nteract/actions";
import { AppState, ContentRef, selectors } from "@nteract/core";
import urljoin from "url-join";
=======
import { connect } from "react-redux";
import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";
import { selectors, AppState, ContentRef } from "@nteract/core";

import { ThemedLogo } from "../components/themed-logo";
import { Nav, NavSection } from "../components/nav";
>>>>>>> moving keybinding functionality to Content component

import { ConnectedDirectory } from "./directory";
import { DirectoryHeader, ConnectedFileHeader as FileHeader } from "./headers";
import { default as File } from "./file";

interface IContentsProps {
  appBase: string;
  baseDir: string;
  changeContentName: (value: actions.ChangeContentName) => {};
  contentType: "dummy" | "notebook" | "directory" | "file";
  contentRef: ContentRef;
  displayName?: string;
  error?: object | null;
  lastSavedStatement: string;
  loading: boolean;
  mimetype?: string | null;
  saving: boolean;
}

interface IContentsState {
  isDialogOpen: boolean;
}

class Contents extends React.PureComponent<IContentsProps, IContentsState> {
  render() {
    const {
      appBase,
      baseDir,
      contentRef,
      contentType,
      displayName,
      error,
      loading,
      saving
    } = this.props;

    switch (contentType) {
      case "notebook":
      case "file":
      case "dummy":
        return (
          <React.Fragment>
            <FileHeader
              appBase={appBase}
              baseDir={baseDir}
              contentRef={contentRef}
              displayName={displayName}
              error={error}
              loading={loading}
              saving={saving}
            />
            <File contentRef={contentRef} appBase={appBase} />
          </React.Fragment>
        );
      case "directory":
        return (
          <React.Fragment>
            <DirectoryHeader appBase={appBase} />
            <ConnectedDirectory appBase={appBase} contentRef={contentRef} />
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <DirectoryHeader appBase={appBase} />
            <div>{`content type ${contentType} not implemented`}</div>
          </React.Fragment>
        );
    }
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: { contentRef: ContentRef }
) => {
  const contentRef = ownProps.contentRef;
  const host = state.app.host;
  const comms = selectors.communication(state, ownProps);

  if (!comms) {
    throw new Error("CommunicationByRef information not found");
  }

  if (host.type !== "jupyter") {
    throw new Error("this component only works with jupyter apps");
  }

  if (!contentRef) {
    throw new Error("cant display without a contentRef");
  }

  const content = selectors.content(state, { contentRef });

  if (!content) {
    throw new Error("need content to view content, check your contentRefs");
  }

  return {
    appBase: urljoin(host.basePath, "/nteract/edit"),
    baseDir: dirname(content.filepath),
    contentRef,
    contentType: content.type,
    displayName: content.filepath.split("/").pop(),
    error: comms.error,
    lastSavedStatement: "recently",
    loading: comms.loading,
    mimetype: content.mimetype,
    saving: comms.saving
  };
};

<<<<<<< HEAD
export default connect(mapStateToProps)(Contents);
=======
<<<<<<< HEAD
=======
@HotkeysTarget
class Contents extends React.PureComponent<ContentsProps> {
  // Implements blueprintjs Hotkeys. For more info, see:
  // https://blueprintjs.com/docs/#core/components/hotkeys
  renderHotkeys() {
    return (
      <Hotkeys>
        {this.props.keybindings.map(kb => (
          <Hotkey global={true} combo={kb.combo} onKeyDown={kb.action} />
        ))}
      </Hotkeys>
    );
  }

  render() {
    const appBase = this.props.appBase;

    switch (this.props.contentType) {
      case "notebook":
      case "file":
      case "dummy":
        return <File contentRef={this.props.contentRef} appBase={appBase} />;
      case "directory":
        return (
          <ConnectedDirectory
            contentRef={this.props.contentRef}
            appBase={appBase}
          />
        );
      default:
        return (
          <React.Fragment>
            <Nav contentRef={this.props.contentRef}>
              <NavSection>
                <a href={urljoin(this.props.appBase)} title="Home">
                  <ThemedLogo />
                </a>
              </NavSection>
            </Nav>
            <div>
              {`content type ${this.props.contentType} not implemented`}
            </div>
          </React.Fragment>
        );
    }
  }
}

>>>>>>> moving keybinding functionality to Content component
export default connect(mapStateToProps)(hot(module)(Contents));
>>>>>>> moving keybinding functionality to Content component
