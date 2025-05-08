<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import styles from './TomsCard.module.scss';
import {CustomButton} from "~/shared/ui/CustomButton";

interface Props {
  volume: {
    id: number;
    volume_number: number;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'delete', id: number): void;
}>();
</script>

<template>
  <div :class="styles.card">
    <div :class="styles.info">
      <span :class="styles.number">Том {{ volume.volume_number }}</span>
    </div>
    <CustomButton
      @click="emit('delete', volume.id)"
    >
      Удалить
    </CustomButton>
  </div>
</template>
