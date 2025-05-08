<script setup>
import styles from './Avatar.module.scss';

const props = defineProps({
  avatar_img: String, // URL аватара
});
</script>

<template>
  <div :class="styles.avatar">
    <img v-if="avatar_img" :src="avatar_img" alt="User Avatar" :class="styles.avatarImage" />
  </div>
</template>
