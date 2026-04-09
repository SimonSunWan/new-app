import { createSSRApp } from "vue";
import App from "./App";

export function createApp() {
  return { app: createSSRApp(App) };
}
