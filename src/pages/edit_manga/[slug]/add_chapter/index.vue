<script setup lang="ts">
import {ChapterForm} from "~/features/ChapterForm";
import {MainLayout} from "~/app/layouts";

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <MainLayout>
    <ChapterForm :slug="slug" />
  </MainLayout>
</template>
