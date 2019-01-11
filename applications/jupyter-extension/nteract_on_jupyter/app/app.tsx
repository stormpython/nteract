import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import NotificationSystem, {
  System as ReactNotificationSystem
} from "react-notification-system";
import { createGlobalStyle } from "styled-components";
import * as actions from "@nteract/actions";
import { AppState, ContentRef } from "@nteract/core";
import { themes, GlobalCSSVariables } from "@nteract/presentational-components";
import { BlueprintCSS } from "@nteract/styled-blueprintjsx";
import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";

import { default as Contents } from "./contents";

const GlobalAppStyle = createGlobalStyle`
  :root {
    ${themes.light};
  }

  html {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    font-family: "Source Sans Pro";
    font-size: 16px;
    background-color: var(--theme-app-bg);
    color: var(--theme-app-fg);
    margin: 0;
  }

  #app {
    padding-top: 20px;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  div#loading {
    animation-name: fadeOut;
    animation-duration: 0.25s;
    animation-fill-mode: forwards;
  }
`;

interface Keybindings {
  combo: string;
  action: string;
}

interface AppProps {
  contentRef: ContentRef;
  keybindings: Keybindings[];
}

const mapStateToProps = (
  state: AppState,
  ownProps: { contentRef: ContentRef }
): AppProps => {
  const keybindings = state.config.get("keybindings");

  return {
    contentRef: ownProps.contentRef,
    keybindings
  };
};

// Keyboard shortcut actions available
const mapDispatchToProps = (dispatch: Dispatch) => ({
  save: (payload: actions.save["payload"]) => dispatch(actions.save(payload)),
  saveas: (payload: actions.saveAs["payload"]) =>
    dispatch(actions.saveAs(payload))
});

class App extends React.Component<AppProps> {
  notificationSystem!: ReactNotificationSystem;

  // Implements blueprintjs `Hotkeys` components. For more info, see:
  // https://blueprintjs.com/docs/#core/components/hotkeys
  // renderHotkeys() {
  //   const onKeyDown = (kb: Keybindings) => {
  //     const { contentRef } = this.props;
  //     return (e: KeyboardEvent): void => {
  //       console.log(e);
  //       const action = kb.action.toLowerCase();
  //       return this.props[action]({ contentRef });
  //     };
  //   };

  //   return (
  //     <Hotkeys>
  //       {this.props.keybindings.map((kb: Keybindings) => (
  //         <Hotkey
  //           combo={kb.combo}
  //           global={true}
  //           label={kb.action.toLowerCase()}
  //           onKeyDown={onKeyDown(kb)}
  //         />
  //       ))}
  //     </Hotkeys>
  //   );
  // }

  shouldComponentUpdate(nextProps: { contentRef: ContentRef }) {
    return nextProps.contentRef !== this.props.contentRef;
  }

  render() {
    return (
      // <React.Fragment>
      <div>
        <GlobalCSSVariables />
        <Contents contentRef={this.props.contentRef} />
        <NotificationSystem
          ref={(notificationSystem: ReactNotificationSystem) => {
            this.notificationSystem = notificationSystem;
          }}
        />
        <GlobalAppStyle />
        <BlueprintCSS />
      </div>
      // </React.Fragment>
    );
  }
}

const MyApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const keybindings = [{ combo: "shift + s", action: "save" }];

class StatelessApp extends React.PureComponent {
  // tslint:disable-line max-classes-per-file
  public render() {
    return <MyApp contentRef={""} keybindings={[]} />;
  }
}

function AppWrapper() {} // tslint:disable-line no-empty
AppWrapper.prototype = Object.create(StatelessApp.prototype);
AppWrapper.prototype.renderHotkeys = function() {
  const onKeyDown = (kb: Keybindings) => {
    const { contentRef } = this.props;
    return (e: KeyboardEvent): void => {
      console.log(e);
      const action = kb.action.toLowerCase();
      return this.props[action]({ contentRef });
    };
  };

  return (
    <Hotkeys>
      {this.props.keybindings.map((kb: Keybindings) => (
        <Hotkey
          combo={kb.combo}
          global={true}
          label={kb.action.toLowerCase()}
          onKeyDown={onKeyDown(kb)}
        />
      ))}
    </Hotkeys>
  );
};

export default HotkeysTarget(AppWrapper as any);

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App);
