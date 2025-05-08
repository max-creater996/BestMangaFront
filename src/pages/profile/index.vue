<script setup lang="ts">

import {MainLayout} from "~/app/layouts";
import {ProfileHeader} from "~/widgets/ProfileHeader";
import ProfileNav from "~/features/Profile/ProfileNav/ui/ProfileNav.vue";
import {ProfileContent} from "~/features/Profile/ProfileContent";
</script>

<template>
<MainLayout>
  <ProfileHeader />

  <ProfileNav />
  <ProfileContent />

</MainLayout>
</template>

<style scoped>

</style>
