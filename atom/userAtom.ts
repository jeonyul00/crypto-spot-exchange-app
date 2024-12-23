import { atom, selector } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: {
    isLogin: false,
    accessToken: "",
  },
});

export const selectorIsLogin = selector({
  key: "selectorIsLogin",
  get: ({ get }) => {
    const { isLogin } = get(userAtom);
    return isLogin;
  },
});
