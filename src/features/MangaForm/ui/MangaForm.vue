<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { CustomPicker } from "~/shared/ui/CustomPicker"
import { CustomTextInput } from '~/shared/ui/CustomTextinput'
import { CustomTextarea } from "~/shared/ui/CustomTextarea"
import UploadSection from '~/shared/ui/UploadSection/ui/UploadSection.vue'
import { useUserMangaStore } from '~/entities/ProfileManga/model/module/useUserMangaStore'
import {
  MANGA_STATUS_CHOICES,
  TRANSLATION_STATUS_CHOICES,
  MANGA_TYPES_CHOICES,
} from '~/shared/constants/mangaChoices'
import styles from './MangaForm.module.scss'
import { toast } from 'vue-sonner'

const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false
  }
})

const store = useUserMangaStore()
const router = useRouter()
const route = useRoute()

// Временные списки (будут заменены на данные с API)
const tempCountryChoices = [
  { id: 1, name: 'Япония' },
  { id: 2, name: 'Южная Корея' },
  { id: 3, name: 'Китай' },
  { id: 4, name: 'Россия' }
]

const slug = computed(() => route.params.slug as string)
const buttonText = computed(() => {
  if (store.createMangaLoading) {
    return props.isEditMode ? 'Сохранение...' : 'Добавление...'
  }
  return props.isEditMode ? 'Сохранить изменения' : 'Добавить мангу'
})

onMounted(async () => {
  try {
    store.resetForm()
    // Сначала загружаем список тегов
    await store.fetchTagsList()

    // После загрузки тегов, если мы в режиме редактирования, загружаем данные манги
    if (props.isEditMode && slug.value) {
      await store.fetchMangaForEdit(slug.value)
    }
  } catch (error) {
    console.error('Error initializing form:', error)
    toast.error('Ошибка при инициализации формы')
  }
})


const handleSubmit = async () => {
  try {
    if (props.isEditMode) {
      await store.updateManga(slug.value)
      toast.success("Манга успешно обновлена!")
    } else {
      await store.createManga()
      toast.success("Манга успешно добавлена!")
    }
    router.push('/profile?tab=mangas')
  } catch (error) {
    // Ошибки уже обработаны в store
    console.error('Error with manga:', error)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" :class="styles.mangaForm">

    <div :class="styles.formGroup">
      <CustomTextInput
        id="manga-name"
        label="Название манги"
        :modelValue="store.mangaForm.formData.mangaName"
        @update:modelValue="value => store.updateFormData('mangaName', value)"
        placeholder="Введите название манги..."
        :error="store.mangaForm.fieldErrors.mangaName"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomTextInput
        id="manga-title"
        label="Заголовок манги"
        :modelValue="store.mangaForm.formData.mangaTitle"
        @update:modelValue="value => store.updateFormData('mangaTitle', value)"
        placeholder="Введите заголовок манги..."
        :error="store.mangaForm.fieldErrors.mangaTitle"
      />
    </div>

    <div :class="styles.formGroup">
      <UploadSection
        id="manga-image"
        label="Изображение манги"
        fileType="изображение"
        accept="image/*"
        :isImage="true"
        :file="store.mangaForm.formData.mangaImg || undefined"
        :preview="props.isEditMode ? store.mangaForm.imagePreview : undefined"
        :error="store.mangaForm.imageError"
        @update:file="file => store.updateFormData('mangaImg', file)"
        @update:preview="store.updateImagePreview"
        @update:error="store.updateImageError"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomPicker
        id="manga-status"
        label="Статус манги"
        v-model="store.mangaForm.formData.mangaStatus"
        :items="MANGA_STATUS_CHOICES"
        placeholder="Выберите статус манги..."
        :error="store.mangaForm.fieldErrors.mangaStatus"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomPicker
        id="translation-status"
        label="Статус перевода"
        v-model="store.mangaForm.formData.translationStatus"
        :items="TRANSLATION_STATUS_CHOICES"
        placeholder="Выберите статус перевода..."
        :error="store.mangaForm.fieldErrors.translationStatus"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomPicker
        id="manga-type"
        label="Тип манги"
        v-model="store.mangaForm.formData.mangaType"
        :items="MANGA_TYPES_CHOICES"
        placeholder="Выберите тип манги..."
        :error="store.mangaForm.fieldErrors.mangaType"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomTextarea
        id="note"
        label="Примечание"
        :modelValue="store.mangaForm.formData.note"
        @update:modelValue="value => store.updateFormData('note', value)"
        placeholder="Введите примечание..."
        rows="4"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomPicker
        id="country"
        label="Страна происхождения манги"
        v-model="store.mangaForm.formData.country"
        :items="tempCountryChoices"
        placeholder="Выберите страну..."
        :error="store.mangaForm.fieldErrors.country"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomPicker
        id="tags"
        label="Теги"
        v-model="store.mangaForm.formData.tags"
        :items="store.mangaForm.tagsChoices"
        placeholder="Выберите теги..."
        multiple
        :error="store.mangaForm.fieldErrors.tags"
      />
    </div>

    <button
      type="submit"
      :class="[styles.submitButton, { [styles.loading]: store.createMangaLoading }]"
      :disabled="store.createMangaLoading"
    >
      {{ buttonText }}
    </button>

    <div v-if="store.createMangaError" :class="styles.formError">
      {{ store.createMangaError }}
    </div>
  </form>
</template>
