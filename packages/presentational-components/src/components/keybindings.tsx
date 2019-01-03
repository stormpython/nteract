import * as React from "react";
import { 
  Hotkey, 
  Hotkeys
} from "@blueprintjs/core";

export class Keybindings extends React.Component<{}, {}> {
  public renderHotkeys() {
    return (
      <Hotkeys>
        <Hotkey 
          allowInInput={false}
          combo={"ctrl + s"}
          disabled={false}
          global={true}
          group={""}
          label={"Save Notebook"}
          onKeyDown={(e: KeyboardEvent) => {
            console.log("Saving...")
          }}
          onKeyUp={(e: KeyboardEvent) => {
            // Add code for saving notebook
            console.log("Saved...")
          }}
          preventDefault={false}
          stopPropagation={false}
        />
      </Hotkeys>
    );
  }
}
