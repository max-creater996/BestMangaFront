<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import styles from "./ProfileContent.module.scss";
import {useProfileStore} from "~/features/Profile/ProfileNav/module/store/ProfileNav";
import {ProfileManga} from "~/features/Profile/ProfileManga";

const store = useProfileStore();
const activeTab = computed(() => store.activeTab);

const renderComponent = computed(() => {
  switch (activeTab.value) {
    case "main":
      return "";
    case "mangas":
      return ProfileManga;
    default:
      return null;
  }
});
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.content">
      <Suspense >
        <component :is="renderComponent" />
      </Suspense>
    </div>
  </div>
</template>
