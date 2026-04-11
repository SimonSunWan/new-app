<template>
  <wd-toast />
</template>

<script setup>
import { useToast } from "wot-design-uni";
import { setupGlobalToast } from "@/utils/toast.js";

const toast = useToast();
setupGlobalToast(toast);
</script>

<style lang="scss">
page {
  --wot-input-not-empty-border-color: #dcdfe6;
}
</style>
