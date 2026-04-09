<template>
  <view>
    <wd-toast />
    <view>
      <text>NEW APP</text>
    </view>

    <view>
      <view>
        <wd-input
          v-model="formData.username"
          placeholder="请输入账号"
          clearable
          no-border
          prefix-icon="user"
        />
      </view>

      <view>
        <wd-input
          v-model="formData.password"
          placeholder="请输入密码"
          show-password
          clearable
          no-border
          prefix-icon="lock-on"
        />
      </view>

      <view>
        <view>
          <wd-checkbox v-model="rememberPassword" @change="onRememberChange">记住密码</wd-checkbox>
        </view>
      </view>

      <wd-button
        type="primary"
        block
        size="large"
        :loading="loading"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </wd-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "wot-design-uni";
import { login, getUserInfo } from "@/api/userApi.js";
import { userStore } from "@/store/userStore.js";
import { HttpError } from "@/utils/request.js";
import { storage } from "@/utils/storage.js";

const toast = useToast();
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

const onRememberChange = ({ value }) => {
  if (!value) {
    storage.clearRememberedAccount();
  }
};

const handleLogin = async () => {
  const username = formData.username?.trim();
  const password = formData.password?.trim();

  if (!username || !password) {
    toast.warning("请输入账号和密码");
    return;
  }

  loading.value = true;

  try {
    const loginResponse = await login({
      userName: username,
      password: password,
    });

    const { accessToken, tokenType } = loginResponse;
    userStore.setToken(`${tokenType} ${accessToken}`);

    const userInfo = await getUserInfo();
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
  } catch (error) {
    toast.error(error instanceof HttpError ? error.message : "登录失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};
</script>


