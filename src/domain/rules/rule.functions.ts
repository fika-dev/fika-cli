import { AmongContextRule, IsContextRule } from "./rule.types";

const isAmong: AmongContextRule = key => values => context =>
  values.find(v => context[key.domain][key.field]) !== undefined;
