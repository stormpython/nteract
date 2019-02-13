import { AppState, ContentRef, HostRecord, selectors } from "@nteract/core";
import {
  DirectoryContentRecordProps,
  DummyContentRecordProps,
  FileContentRecordProps,
  NotebookContentRecordProps
} from "@nteract/types";
import { RecordOf } from "immutable";
import { dirname } from "path";
import * as React from "react";
import { connect } from "react-redux";
import urljoin from "url-join";

import { ConnectedDirectory } from "./directory";
import { default as File } from "./file";
import { ConnectedFileHeader as FileHeader, DirectoryHeader } from "./headers";

import { NotebookMenu } from "@nteract/connected-components";

interface IContentsProps {
  appBase: string;
  baseDir: string;
  contentType: "dummy" | "notebook" | "directory" | "file";
  contentRef: ContentRef;
  displayName: string;
  error?: object | null;
  filepath: string | undefined;
  lastSavedStatement: string;
  loading: boolean;
  mimetype?: string | null;
  saving: boolean;
}

interface IContentsState {
  isDialogOpen: boolean;
}
class Contents extends React.PureComponent<IContentsProps, IContentsState> {
  render(): JSX.Element {
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
            >
              {contentType === "notebook" ? (
                <NotebookMenu contentRef={this.props.contentRef} />
              ) : null}
            </FileHeader>
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

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: { appBase: string; contentRef: ContentRef }
) => {
  const host: HostRecord = initialState.app.host;

  if (host.type !== "jupyter") {
    throw new Error("this component only works with jupyter apps");
  }

  const appBase: string = urljoin(host.basePath, "/nteract/edit");

  const mapStateToProps = (state: AppState): IContentsProps => {
    const contentRef: ContentRef = initialProps.contentRef;

    if (!contentRef) {
      throw new Error("cant display without a contentRef");
    }

    const content:
      | RecordOf<NotebookContentRecordProps>
      | RecordOf<DummyContentRecordProps>
      | RecordOf<FileContentRecordProps>
      | RecordOf<DirectoryContentRecordProps>
      | undefined = selectors.content(state, { contentRef });

    if (!content) {
      throw new Error("need content to view content, check your contentRefs");
    }

    return {
      appBase,
      baseDir: dirname(content.filepath),
      contentRef,
      contentType: content.type,
      displayName: content.filepath.split("/").pop() || "",
      error: content.error,
      filepath: content.filepath,
      lastSavedStatement: "recently",
      loading: content.loading,
      mimetype: content.mimetype,
      saving: content.saving
    };
  };

  return mapStateToProps;
};

export default connect<IContentsProps, any, any>(
  makeMapStateToProps,
  null
)(Contents);
