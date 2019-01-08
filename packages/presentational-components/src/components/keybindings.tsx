/**
 * Keybindings enable users to create interactions based on user keyboard
 * events. This implementation wraps `blueprintjs` `HotKeys` components to
 * implement keybindings. For more,
 * see `https://blueprintjs.com/docs/#core/components/hotkeys`.
 *
 * To add keybindings to a React component, extend the
 * `@nteract/presentational-components` `Keybindings` class.
 * The class will implement Keybindings `renderHotkeys()`
 * method and attach the appropriate key listeners.
 *
 * Usage:
 *
 * import * as React from "react";
 * import { KeybindingProps, Keybindings } from "@nteract/presentational-components";
 *
 * export interface MyComponentProps {
 *   ...
 *   keybindings: KeybindingProps[];
 * }
 *
 * export class MyComponent extends Keybindings {
 *   public render() {
 *     return <div>Custom content</div>;
 *   }
 * }
 */
import * as React from "react";
import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";

export interface KeybindingProps {
  allowInInput?: boolean;
  className?: string;
  combo: string;
  disabled?: boolean;
  global?: boolean;
  group?: string;
  label: string;
  onKeyDown?: (e: KeyboardEvent) => any;
  onKeyUp?: (e: KeyboardEvent) => any;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export interface KeybindingsProps {
  className?: string;
  tabIndex?: number;
  keybindings: KeybindingProps[];
}

@HotkeysTarget
export class Keybindings extends React.PureComponent<KeybindingsProps, {}> {
  // Should be overwritten by the inheriting component's render method.
  public render() {
    return null;
  }

  public renderHotkeys() {
    const { className, keybindings, tabIndex } = this.props;

    return (
      <Hotkeys className={className} tabIndex={tabIndex}>
        {keybindings.map(props => (
          <Hotkey {...props} />
        ))}
      </Hotkeys>
    );
  }
}
