<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CustomTextInput } from '~/shared/ui/CustomTextinput'
import { CustomPicker } from '~/shared/ui/CustomPicker'
import { CustomBoolean } from '~/shared/ui/CustomBoolean'
import { UploadChapterPageSection } from '~/shared/ui/UploadChapterPageSection'
import { useUserChapterStore } from '~/entities/ProfileChapter/model/module/useUserChapterStore'
import { toast } from 'vue-sonner'
import styles from './ChapterForm.module.scss'

interface PageItem {
  id: string
  file: File
  preview: string
  status: string
  pageNumber: number
}

const props = defineProps({
  slug: {
    type: String,
    required: true
  },
  chapter_number: {
    type: String,
    required: false
  }
})

const store = useUserChapterStore()
const router = useRouter()

// Заменяем selectedFiles на pages
const pages = ref<PageItem[]>([])

onMounted(async () => {
  try {
    store.resetForm()
    await store.fetchVolumeChoices(props.slug)

    if (props.chapter_number) {
      await store.fetchChapter(props.slug, props.chapter_number)
    }
  } catch (error) {
    console.error('Error initializing form:', error)
    toast.error('Ошибка при инициализации формы')
  }
})

const validateForm = (): boolean => {
  let isValid = true
  store.formErrors = {
    chapter_title: '',
    chapter_number: '',
    pages: [],
    volume: '',
    release: ''
  }

  if (!store.chapterForm.chapter_title?.trim()) {
    store.formErrors.chapter_title = 'Название главы обязательно'
    isValid = false
  }

  if (!store.chapterForm.volume) {
    store.formErrors.volume = 'Выберите том'
    isValid = false
  }

  if (pages.value.length === 0 && store.isEditMode) {
    store.formErrors.pages = ['Добавьте хотя бы одну страницу']
    isValid = false
  }

  return isValid
}


const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      toast.error('Пожалуйста, исправьте ошибки в форме')
      return
    }

    // Сначала создаем/обновляем главу
    const chapterResponse = await store.createOrUpdateChapter(props.slug, props.chapter_number)

    // Если глава успешно создана/обновлена, обрабатываем страницы
    if (chapterResponse) {
      let hasErrors = false

      console.log('Starting page processing...')

      // Обрабатываем только новые страницы (пропускаем initial и delete)
      const newPages = pages.value.filter(page => !page.status || (page.status !== 'delete' && page.status !== 'initial'))
      console.log('New pages to upload:', newPages)

      if (newPages.length > 0) {
        for (const [index, page] of newPages.entries()) {
          try {
            await store.uploadChapterPage(page.file, page.pageNumber)
            toast.success(`Страница ${index + 1} успешно загружена`)
          } catch (error) {
            console.error('Upload error:', error)
            hasErrors = true
            toast.error(`Ошибка при загрузке страницы ${index + 1}`)
          }
        }
      }

      // После загрузки новых страниц обрабатываем страницы помеченные на удаление
      const deletedPages = pages.value.filter(page => page.status === 'delete')
      if (deletedPages.length > 0) {
        for (const page of deletedPages) {
          try {
            await store.deletePage(Number(page.id))
            toast.success(`Страница ${page.id} успешно удалена`)
          } catch (error) {
            console.error('Delete error:', error)
            hasErrors = true
            toast.error(`Ошибка при удалении страницы ${page.id}`)
          }
        }
      }

      // Если был изменён порядок страниц, отправляем bulk-обновление
      if (store.chapterForm.new_orderliness && store.chapter && store.chapter.id) {
        try {
          const orderData = pages.value
              .filter(page => page.id && page.status !== 'delete')
              .map((page, idx) => ({
                id: Number(page.id),
                page_number: idx + 1
              }))
          await store.updatePagesOrderBulk(store.chapter.id, orderData)
          store.chapterForm.new_orderliness = false
          toast.success('Порядок страниц успешно обновлён')
        } catch (error) {
          hasErrors = true
          toast.error('Ошибка при обновлении порядка страниц')
        }
      }

      console.log('Final hasErrors state:', hasErrors)

      // Проверяем результат всех операций
      if (!hasErrors) {
        console.log('All operations successful...')
        toast.success(store.isEditMode ? "Глава успешно обновлена!" : "Глава успешно добавлена!")
        if (store.isEditMode) {
            window.location.reload()
        }
        else {
            router.back()
        }
      } else {
        console.log('Errors occurred, staying on page...')
        toast.error("Произошли ошибки при обработке страниц. Пожалуйста, проверьте и попробуйте снова.")
      }
    }
  } catch (error) {
    console.error('Main error:', error)
    toast.error(`Ошибка при ${store.isEditMode ? 'обновлении' : 'добавлении'} главы: ${error}`)
  }
}


const handlePagesUpdate = (updatedPages: PageItem[]) => {
  pages.value = updatedPages
  // Добавляем page_number к каждой странице
  store.chapterForm.pages = updatedPages.map((page, index) => ({
    id: page.id,
    image: page.file,
    page_number: index + 1,
    status: page.status
  }))
}
// Обработчик ошибок загрузки
const handleUploadError = (error: string) => {
  store.formErrors.pages = [error]
}
</script>

<template>
  <form @submit.prevent="handleSubmit" :class="styles.chapterForm">
    <div :class="styles.formGroup">
      <CustomTextInput
        id="chapter-title"
        label="Название главы"
        v-model="store.chapterForm.chapter_title"
        placeholder="Введите название главы..."
        :error="store.formErrors.chapter_title"
      />
    </div>

    <div v-if="props.chapter_number" :class="styles.formGroup">
      <CustomTextInput
        id="chapter-number"
        label="Номер главы"
        v-model="store.chapterForm.chapter_number"
        type="number"
        placeholder="Введите номер главы..."
        :error="store.formErrors.chapter_number"
        :disabled="store.isEditMode"
      />
    </div>

    <div :class="styles.formGroup">
      <CustomPicker
        id="volume"
        label="Том"
        v-model="store.chapterForm.volume"
        :items="store.volumeChoices || []"
        placeholder="Выберите том..."
        :error="store.formErrors.volume"
      />
    </div>

    <div v-if="props.chapter_number" :class="styles.formGroup">
      <CustomBoolean
        id="release"
        label="Опубликовать главу"
        v-model="store.chapterForm.release"
        :error="store.formErrors.release"
      />
    </div>

    <div v-if="props.chapter_number"  :class="styles.formGroup">
      <UploadChapterPageSection
        label="Загрузить страницы"
        accept="image/*"
        :error="store.formErrors.pages?.[0] || ''"
        @update:pages="handlePagesUpdate"
        @update:error="handleUploadError"
        :initial-pages="store.chapterForm.pages.length > 0 ? store.chapterForm.pages : []"
      />
      <div v-if="pages.length > 0" :class="styles.selectedFiles">
        <p>Выбрано страниц: {{ pages.length }}</p>
      </div>
    </div>

    <button
      type="submit"
      :class="[styles.submitButton, { [styles.loading]: store.loading }]"
      :disabled="store.loading"
    >
      {{ store.buttonText }}
    </button>
  </form>
</template>
