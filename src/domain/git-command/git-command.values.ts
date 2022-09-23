import { GitCommand } from "./command.types";

export const checkoutCmd: GitCommand = {
  command: "checkout",
};

export const createAndCheckoutCmd: GitCommand = {
  command: "checkout -b",
};
