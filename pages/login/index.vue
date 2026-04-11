<template>
  <view class="login">
    <wd-toast />
    <view class="logo-container">
      <wd-img :width="100" :height="100" src="/static/logo.png" />
    </view>
    <view class="form-container">
      <wd-form ref="form" :model="formData">
        <wd-cell-group border>
          <wd-input size="large" prop="username" clearable v-model="formData.username" placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]" />
          <wd-input size="large" prop="password" show-password clearable v-model="formData.password" placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]" />
        </wd-cell-group>
        <view class="form-item flex between">
          <wd-checkbox shape="square" v-model="rememberPassword">记住密码</wd-checkbox>
          <wd-button type="text">忘记密码</wd-button>
        </view>
        <view class="form-item">
          <wd-button size="large" type="primary" block :loading="loading" custom-class="custom-shadow"
            @click="handleLogin">
            {{ loading ? '登录中...' : '登录' }}
          </wd-button>
        </view>
        <view class="form-item flex">
          <text>还没有账号？</text><wd-button type="text">注册</wd-button>
        </view>
      </wd-form>
    </view>
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

const formData = reactive({
  username: "",
  password: "",
});

onMounted(() => {
  const rememberedAccount = storage.getRememberedAccount();
  if (rememberedAccount.flag) {
    formData.username = rememberedAccount.username;
    formData.password = rememberedAccount.password;
  }
});

const handleLogin = () => {
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
  .logo-container {
    margin: 160rpx 0 80rpx;
    text-align: center;
  }

  .form-container {
    padding: 0 40rpx;

    .form-item {
      font-size: 28rpx;
      margin: 40rpx auto 0;

      :deep() {
        .custom-shadow {
          box-shadow: 0 6rpx 2rpx -4rpx rgb(0 0 0 / 20%), 0 4rpx 4rpx 0 rgb(0 0 0 / 14%), 0 2rpx 10rpx 0 rgb(0 0 0 / 12%);
        }
      }
    }

    .flex {
      display: flex;
      align-items: center;
    }

    .between {
      justify-content: space-between;
    }
  }

}
</style>
