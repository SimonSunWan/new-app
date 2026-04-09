import { reactive } from "vue";

const userStore = reactive({
  isLogin: false,
  userInfo: {},
  accessToken: "",

  setLoginStatus(status) {
    this.isLogin = status;
  },

  setUserInfo(info) {
    this.userInfo = info;
  },

  setToken(token) {
    this.accessToken = token;
    uni.setStorageSync("accessToken", token);
  },

  logout() {
    this.isLogin = false;
    this.userInfo = {};
    this.accessToken = "";
    uni.removeStorageSync("accessToken");
    uni.reLaunch({
      url: "/pages/login/index",
    });
  },
});

export { userStore };
