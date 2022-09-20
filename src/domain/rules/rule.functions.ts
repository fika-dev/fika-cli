import { AmongContextRule, IsContextRule } from "./rule.types";

const isA: IsContextRule = key => value => context => context[key.domain][key.field] === value;
const isAmong: AmongContextRule = key => values => context =>
  values.find(v => context[key.domain][key.field]) !== undefined;
