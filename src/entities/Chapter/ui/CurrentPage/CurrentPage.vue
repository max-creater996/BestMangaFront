<script setup lang="ts">
import { defineProps, ref } from "vue";
import s from "./CurrentPage.module.scss";
import Modal from "~/shared/ui/Modal/Modal.vue";

const props = defineProps<{ currentPage: number; totalPages: number }>();

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <span :class="s.currentPage" @click="openModal">
    {{ props.currentPage }}/{{ props.totalPages }}
  </span>

  <Modal v-if="isModalOpen" @close="closeModal">
    <template #header>
      <h2>Выберите страницу</h2>
    </template>
    <template #body>
      <ul>
        <li v-for="page in props.totalPages" :key="page" :class="{ [s.active]: page === props.currentPage }" @click="closeModal">
          <NuxtLink :href="`#${page}`">Стр. {{ page }}</NuxtLink>
        </li>
      </ul>
    </template>
  </Modal>
</template>
