<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import TomsCard from '../TomsCard/TomsCard.vue';
import styles from './TomsList.module.scss';

interface Props {
  volumes: Array<{
    id: number;
    volume_number: number;
  }>;
  onDelete: (id: number) => void;
}

defineProps<Props>();
</script>

<template>
  <div :class="styles.list">
    <div v-for="volume in volumes" :key="volume.id">
      <TomsCard
        :volume="volume"
        @delete="onDelete"
      />
    </div>
  </div>
</template>
