<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import styles from "./ProfileEditNav.module.scss";
import {useProfileEditStore} from "~/features/ProfileEdit/ProfileEditNav/module/store/ProfileEditNav";

const router = useRouter();
const route = useRoute();
const store = useProfileEditStore();

const tabs = [
  { key: "manga", label: "Манга" },
  { key: "chapters", label: "главы" },
  { key: "toms", label: "Тома" },
];

const activeTab = ref(store.activeTab);

const handleTabClick = (key: string) => {
  store.setActiveTab(key);
  router.push({ query: { tab: key } });
};

// Следим за изменением параметра в URL
watchEffect(() => {
  const tabParam = route.query.tab as string;
  if (tabs.some((tab) => tab.key === tabParam)) {
    store.setActiveTab(tabParam);
    activeTab.value = tabParam;
  }
});

// Устанавливаем активную вкладку при загрузке
onMounted(() => {
  const tabParam = route.query.tab as string;
  if (tabs.some((tab) => tab.key === tabParam)) {
    store.setActiveTab(tabParam);
    activeTab.value = tabParam;
  }
});
</script>

<template>
  <div :class="styles.root">
    <nav :class="styles.nav">
      <span
          v-for="tab in tabs"
          :key="tab.key"
          :class="[styles.tab, { [styles.active]: activeTab === tab.key }]"
          @click="handleTabClick(tab.key)"
      >
        <NuxtLink :to="{ query: { tab: tab.key } }">{{ tab.label }}</NuxtLink>
      </span>
    </nav>
  </div>
</template>
