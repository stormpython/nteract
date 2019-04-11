import { ContentRef, KernelRef } from "@nteract/core";
import * as React from "react";
import NotificationSystem, {
  System as ReactNotificationSystem
} from "react-notification-system";

import { default as Contents } from "./contents";

class App extends React.Component<{
  contentRef: ContentRef;
  kernelRef: KernelRef;
}> {
  notificationSystem!: ReactNotificationSystem;

  shouldComponentUpdate(nextProps: {
    contentRef: ContentRef;
    kernelRef: KernelRef;
  }): boolean {
    return (
      nextProps.contentRef !== this.props.contentRef ||
      nextProps.kernelRef !== this.props.kernelRef
    );
  }

  render(): JSX.Element {
    const { contentRef, kernelRef } = this.props;

    return (
      <React.Fragment>
        <Contents contentRef={contentRef} kernelRef={kernelRef} />
        <NotificationSystem
          ref={(notificationSystem: ReactNotificationSystem) => {
            this.notificationSystem = notificationSystem;
          }}
        />
      </React.Fragment>
    );
  }
}

export default App;
