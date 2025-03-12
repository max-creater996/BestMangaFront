import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // ✅ Pinia должен быть установлен перед вызовом useMangaStore()
app.mount("#app");
