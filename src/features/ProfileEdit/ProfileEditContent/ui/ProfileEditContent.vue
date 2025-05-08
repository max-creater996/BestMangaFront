<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import styles from "./ProfileEditContent.module.scss";

import {useProfileEditStore} from "~/features/ProfileEdit/ProfileEditNav/module/store/ProfileEditNav";
import { MangaForm } from "~/features/MangaForm";
import ProfileEditChapters from "../../ProfileEditChapters/ui/ProfileEditChapters.vue";
import {ProfileEditToms} from "~/features/ProfileEdit/ProfileEditToms";

const store = useProfileEditStore();
const activeTab = computed(() => store.activeTab);

const renderComponent = computed(() => {
  switch (activeTab.value) {
    case "manga":
      return MangaForm;
    case "chapters":
      return ProfileEditChapters;
    case "toms":
      return ProfileEditToms
    default:
      return null;
  }
});
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.content">
      <Suspense>
        <component :is="renderComponent" :isEditMode="true" />
      </Suspense>
    </div>
  </div>
</template>
