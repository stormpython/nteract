// Vendor modules
import { makeEntitiesRecord } from "@nteract/types";
import { combineReducers } from "redux-immutable";

// Local modules
import { contents } from "./contents";
import { hosts } from "./hosts";
import { kernels } from "./kernels";
import { kernelspecs } from "./kernelspecs";
import { messages } from "./messages";
import { modals } from "./modals";
import { transforms } from "./transforms";

export const entities = combineReducers(
  {
    contents,
    hosts,
    kernels,
    kernelspecs,
    messages,
    modals,
    transforms
  },
  makeEntitiesRecord as any
);
