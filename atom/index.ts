import { atom } from "recoil";

export const purposeState = atom<"buy" | "sell">({
  key: "purposeState",
  default: "buy",
});

export const priceState = atom<string>({
  key: "priceState",
  default: "",
});
