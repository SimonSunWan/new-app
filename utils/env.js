const ENV_MAP = {
  development: {
    API_BASE_URL: "http://127.0.0.1:8000/api",
  },
  production: {
    API_BASE_URL: "https://donglidianchi.com.cn/api",
  },
};

let env = "development";
// #ifdef MP-WEIXIN
const accountInfo = wx.getAccountInfoSync();
if (accountInfo.miniProgram.envVersion === "release") env = "production";
// #endif

export default { ...ENV_MAP[env], isDev: env === "development" };
