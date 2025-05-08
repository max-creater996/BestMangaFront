<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTomsStore } from '~/entities/Toms/model/module/useTomsStore';
import styles from './ProfileEditToms.module.scss';
import CustomButton from '~/shared/ui/CustomButton/ui/CustomButton.vue';
import TomsList from '~/entities/Toms/ui/TomsList/TomsList.vue';
import { toast } from 'vue-sonner'

const route = useRoute();
const tomsStore = useTomsStore();

onMounted(async () => {
  const slug = route.params.slug as string;
  await tomsStore.fetchToms(slug);
});

const handleAddVolume = async () => {
  const slug = route.params.slug as string;
  const lastVolume = tomsStore.data.length > 0
    ? Math.max(...tomsStore.data.map(volume => volume.volume_number))
    : 0;
  await tomsStore.createVolume(slug, lastVolume + 1);
};

const handleDeleteVolume = async (volumeId: number) => {
  const slug = route.params.slug as string;
  try {
    await tomsStore.deleteVolume(slug, volumeId);
  } catch (e: any) {
    console.log("asdasdas")
    toast.error(
      e?.response?.data?.detail ||
      e?.message ||
      "Ошибка при удалении тома"
    );
  }
};
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.content">
      <div :class="styles.header">
        <h2 :class="styles.title">Тома</h2>
        <div :class="styles.addButton">
          <CustomButton variant="primary" @click="handleAddVolume">
            Добавить том
          </CustomButton>
        </div>
      </div>

      <div v-if="tomsStore.loading" :class="styles.loading">
        Загрузка...
      </div>

      <TomsList
        v-else
        :volumes="tomsStore.data"
        :on-delete="handleDeleteVolume"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
