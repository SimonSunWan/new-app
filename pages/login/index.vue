<template>
  <view class="login">
    <wd-toast />
    <wd-navbar title="登录" safe-area-inset-top></wd-navbar>

    <wd-form ref="form" :model="formData" custom-style="margin-top: 120rpx">
      <wd-cell-group border>
        <wd-input size="large" prefixIcon="user" prop="username" clearable v-model="formData.username"
          placeholder="请输入用户名" :rules="[{ required: true, message: '请输入用户名' }]" />
        <wd-input size="large" prefixIcon="lock-on" prop="password" show-password clearable v-model="formData.password"
          placeholder="请输入密码" :rules="[{ required: true, message: '请输入密码' }]" />
      </wd-cell-group>
      <view class="form-item">
        <wd-checkbox shape="square" v-model="rememberPassword">记住密码</wd-checkbox>
      </view>
      <view class="form-item">
        <wd-slide-verify :width="slideVerifyWidth" @success="verifySuccess" />
      </view>
      <view class="form-item">
        <wd-button size="large" type="primary" block :loading="loading" @click="handleLogin">
          {{ loading ? '登录中...' : '登录' }}
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { login, getUserInfo } from "@/api/userApi.js";
import { userStore } from "@/store/userStore.js";
import { storage } from "@/utils/storage.js";
import { useToast } from "wot-design-uni";

const toast = useToast();
const form = ref(null);
const loading = ref(false);
const rememberPassword = ref(true);
const verified = ref(false);
const slideVerifyWidth = ref(350);

const verifySuccess = () => {
  verified.value = true;
};

const formData = reactive({
  username: "",
  password: "",
});

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync();
  slideVerifyWidth.value = (700 / 750) * sysInfo.windowWidth;

  const rememberedAccount = storage.getRememberedAccount();
  if (rememberedAccount.flag) {
    formData.username = rememberedAccount.username;
    formData.password = rememberedAccount.password;
  }
});

const handleLogin = () => {
  if (!verified.value) {
    toast.warning("请先完成滑动验证");
    return;
  }

  form.value.validate().then(({ valid }) => {
    if (!valid) return;

    const username = formData.username?.trim();
    const password = formData.password?.trim();
    loading.value = true;

    login({ userName: username, password: password })
      .then((loginResponse) => {
        const { accessToken, tokenType } = loginResponse;
        userStore.setToken(`${tokenType} ${accessToken}`);
        return getUserInfo();
      })
      .then((userInfo) => {
        userStore.setUserInfo(userInfo);
        userStore.setLoginStatus(true);

        if (rememberPassword.value) {
          storage.setRememberedAccount(username, password);
        } else {
          storage.clearRememberedAccount();
        }
        toast.success("登录成功");
        setTimeout(() => {
          uni.reLaunch({ url: "/pages/home/index" });
        }, 1000);
      })
      .catch(() => { })
      .finally(() => {
        loading.value = false;
      });
  });
};
</script>

<style lang="scss" scoped>
.login {
  .form-item {
    width: 700rpx;
    margin: 32rpx auto 0;
  }
}
</style>
