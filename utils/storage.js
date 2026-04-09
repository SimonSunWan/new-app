const STORAGE_KEYS = {
  REMEMBERED_ACCOUNT: "rememberedAccount",
  REMEMBERED_PASSWORD: "rememberedPassword",
  REMEMBER_PASSWORD_FLAG: "rememberPasswordFlag",
};

export const storage = {
  setRememberedAccount(username, password) {
    uni.setStorageSync(STORAGE_KEYS.REMEMBERED_ACCOUNT, username);
    uni.setStorageSync(STORAGE_KEYS.REMEMBERED_PASSWORD, password);
    uni.setStorageSync(STORAGE_KEYS.REMEMBER_PASSWORD_FLAG, true);
  },

  getRememberedAccount() {
    const username = uni.getStorageSync(STORAGE_KEYS.REMEMBERED_ACCOUNT) || "";
    const password = uni.getStorageSync(STORAGE_KEYS.REMEMBERED_PASSWORD) || "";
    const flag =
      uni.getStorageSync(STORAGE_KEYS.REMEMBER_PASSWORD_FLAG) || false;
    return { username, password, flag };
  },

  clearRememberedAccount() {
    uni.removeStorageSync(STORAGE_KEYS.REMEMBERED_ACCOUNT);
    uni.removeStorageSync(STORAGE_KEYS.REMEMBERED_PASSWORD);
    uni.removeStorageSync(STORAGE_KEYS.REMEMBER_PASSWORD_FLAG);
  },
};
