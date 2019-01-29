import { Dialog } from "@blueprintjs/core";
import * as React from "react";

interface IKeybindingsModalProps {
  onClose: (event?: React.SyntheticEvent<HTMLElement>) => void;
  isOpen: boolean;
}

class KeybindingsModal extends React.PureComponent<IKeybindingsModalProps, {}> {
  // tslint:disable-next-line typedef
  render() {
    return (
      <Dialog
        autoFocus
        canEscapeKeyClose
        canOutsideClickClose
        enforceFocus
        icon={"key"}
        isCloseButtonShown
        lazy
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={"Keyboard Shortcuts"}
        usePortal
      >
        <table>
          <tbody>
            <tr>
              <td>
                <strong>File actions</strong>
              </td>
              <td />
            </tr>
            <tr>
              <td>Open</td>
              <td>Ctrl+O</td>
            </tr>
            <tr>
              <td>Save</td>
              <td>Ctrl+S</td>
            </tr>
            <tr>
              <td>Save As</td>
              <td>Ctrl+Shift+S</td>
            </tr>
            <tr>
              <td>
                <strong>Edit and notebook navigation</strong>
              </td>
              <td />
            </tr>
            <tr>
              <td>Edit menu: redo</td>
              <td>Ctrl+Shift+Z</td>
            </tr>
            <tr>
              <td>Edit menu: undo</td>
              <td>Ctrl+Z</td>
            </tr>
            <tr>
              <td>notebook:copy-cell</td>
              <td>Ctrl+Shift+C (nteract can also drag/drop cells)</td>
            </tr>
            <tr>
              <td>notebook:cut-cell</td>
              <td>Ctrl+Shift+X</td>
            </tr>
            <tr>
              <td>notebook:delete-cell</td>
              <td>Ctrl+Shift+D</td>
            </tr>
            <tr>
              <td>Paste Cell(s) Below</td>
              <td>Ctrl+Shift+V</td>
            </tr>
            <tr>
              <td />
              <td />
            </tr>
            <tr>
              <td>notebook:change-cell-to-code</td>
              <td>Ctrl+Shift+Y</td>
            </tr>
            <tr>
              <td>notebook:change-cell-to-markdown</td>
              <td>Ctrl+Shift+M</td>
            </tr>
            <tr>
              <td>Run Cell and Select Next</td>
              <td>Shift+Enter</td>
            </tr>
            <tr>
              <td>Cell menu: run-all</td>
              <td>Alt+R, A</td>
            </tr>
            <tr>
              <td>Notebook: move-cursor-down-1</td>
              <td>ArrowDown</td>
            </tr>
            <tr>
              <td>Notebook: move-cursor-up-1</td>
              <td>ArrowUp</td>
            </tr>
            <tr>
              <td>Notebook: run-cell</td>
              <td>Ctrl+Enter</td>
            </tr>
            <tr>
              <td>notebook:insert-cell-above</td>
              <td>Ctrl+Shift+A</td>
            </tr>
            <tr>
              <td>notebook:insert-cell-below</td>
              <td>Ctrl+Shift+B</td>
            </tr>
            <tr>
              <td>
                <strong>Runtime kernel actions</strong>
              </td>
              <td />
            </tr>
            <tr>
              <td>Interrupt Kernel</td>
              <td>Alt+R, I</td>
            </tr>
            <tr>
              <td>Shutdown Kernel</td>
              <td>Alt+R, K</td>
            </tr>
            <tr>
              <td>Restart Kernel</td>
              <td>Alt+R, R</td>
            </tr>
            <tr>
              <td>Restart Kernel and Clear</td>
              <td>Alt+R, C</td>
            </tr>
            <tr>
              <td>Restart Kernel and Run All</td>
              <td>Alt+R, A</td>
            </tr>
          </tbody>
        </table>
        <div />
      </Dialog>
    );
  }
}

export default KeybindingsModal;
