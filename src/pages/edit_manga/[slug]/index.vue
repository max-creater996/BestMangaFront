<script setup lang="ts">

import {MainLayout} from "~/app/layouts";
import {ProfileEditNav} from "~/features/ProfileEdit/ProfileEditNav";
import {ProfileEditContent} from "~/features/ProfileEdit/ProfileEditContent";


</script>

<template>
  <MainLayout>
    <ProfileEditNav />

    <ProfileEditContent />
  </MainLayout>
</template>

<style scoped>

</style>
