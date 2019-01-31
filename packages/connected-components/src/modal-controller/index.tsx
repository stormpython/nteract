import { AppState, selectors } from "@nteract/core";
import * as React from "react";
import { connect } from "react-redux";

import AboutModal from "./about-modal";
import { MODAL_TYPES } from "./constants";
import KeybindingsModal from "./keybindings-modal";

interface Props {
  modalType: string;
}

class ModalController extends React.PureComponent<Props> {
  getModal: () => ConnectedComponentClass<
    typeof AboutModal | KeybindingsModal,
    Pick<Props, never>
  > | null = () => {
    const { modalType } = this.props;
    switch (modalType) {
      case MODAL_TYPES.ABOUT:
        return AboutModal;
      case MODAL_TYPES.KEYBINDING:
        return KeybindingsModal;
      default:
        return null;
    }
  };

  // tslint:disable-next-line typedef
  render() {
    const Modal: JSX.Element | null = this.getModal();
    return Modal;
  }
}

// tslint:disable-next-line typedef
const mapStateToProps = (state: AppState) => ({
  modalType: selectors.modalType(state)
});

export { MODAL_TYPES };

export default connect(mapStateToProps)(ModalController);
