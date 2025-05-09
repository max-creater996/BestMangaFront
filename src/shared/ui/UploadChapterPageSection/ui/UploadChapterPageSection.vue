<script setup lang="ts">
import { ref, watch } from 'vue'
import { ErrorText } from '../../ErrorText'
import { useImageUpload } from '@/shared/hooks/useImageUpload'
import { toast } from 'vue-sonner'
import styles from './UploadChapterPageSection.module.scss'
import { useUserChapterStore } from '~/entities/ProfileChapter/model/module/useUserChapterStore'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  accept: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  },
  initialPages: {
    type: Array as () => any[],
    default: () => []
  }
})

const emit = defineEmits<{
  (e: 'update:pages', pages: any[]): void
  (e: 'update:error', error: string): void
}>()

const dragOver = ref(false)
const pages = ref<any[]>([])
const localError = ref(props.error || '')
const uploadId = `upload-${crypto.randomUUID()}`
const store = useUserChapterStore()

watch(() => props.initialPages, (newPages) => {
  if (newPages.length > 0 && pages.value.length === 0) {
    pages.value = newPages.map((page, index) => ({
      ...page,
      pageNumber: page.page_number,
    }))
    emit('update:pages', pages.value)
  }
})

watch(() => props.error, (newError) => {
  localError.value = newError
})

// Функция для создания превью изображения
const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}

// Функция для проверки размеров изображения
const validateImageDimensions = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve(img.height >= 400)
    }
    img.src = URL.createObjectURL(file)
  })
}

// Функция для обработки файлов
const processFiles = async (files: FileList | File[]) => {
  try {
    for (const file of files) {
      // Проверяем тип файла (исключаем SVG)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        const errorMsg = 'Разрешены только форматы: JPEG, PNG, GIF, WEBP'
        localError.value = errorMsg
        emit('update:error', localError.value)
        toast.error(errorMsg)
        continue
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB
        const errorMsg = 'Размер файла не должен превышать 50MB'
        localError.value = errorMsg
        emit('update:error', localError.value)
        toast.error(errorMsg)
        continue
      }

      // Проверяем размеры изображения
      const isValidDimensions = await validateImageDimensions(file)
      if (!isValidDimensions) {
        const errorMsg = 'Высота изображения должна быть не менее 400 пикселей'
        localError.value = errorMsg
        emit('update:error', localError.value)
        toast.error(errorMsg)
        continue
      }

      const preview = await createImagePreview(file)
      const newPage: any = {
        id: crypto.randomUUID(),
        file,
        preview,
        pageNumber: pages.value.length + 1
      }
      pages.value.push(newPage)
      toast.success(`Страница ${pages.value.length} успешно добавлена`)
    }
    emit('update:pages', pages.value)
    localError.value = ''
    emit('update:error', '')
  } catch (error) {
    const errorMsg = 'Ошибка при обработке файла'
    localError.value = errorMsg
    emit('update:error', localError.value)
    toast.error(errorMsg)
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  if (e.dataTransfer?.files) {
    await processFiles(e.dataTransfer.files)
  }
}

const handleImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    await processFiles(target.files)
    // Очищаем input, чтобы можно было загрузить тот же файл повторно
    target.value = ''
  }
}

const removePage = (pageId: string) => {
  const pageIndex = pages.value.findIndex(page => page.id === pageId)
  if (pageIndex === -1) return

  const page = pages.value[pageIndex]

  if (page.status === 'initial') {
    // Если статус initial - помечаем на удаление
    pages.value[pageIndex] = {
      ...page,
      status: 'delete'
    }
    toast.success(`Страница ${pageIndex + 1} помечена на удаление`)
  } else if (page.status === 'delete') {
    // Если страница уже помечена на удаление - восстанавливаем её
    pages.value[pageIndex] = {
      ...page,
      preview: page.preview,
      status: 'initial'
    }
    toast.success(`Страница ${pageIndex + 1} восстановлена`)
  } else {
    // В остальных случаях удаляем страницу полностью
    pages.value = pages.value.filter(page => page.id !== pageId)
    toast.success(`Страница ${pageIndex + 1} удалена`)
  }

  emit('update:pages', pages.value)
}

const reorderPages = (fromIndex: number, toIndex: number) => {
  const pageToMove = pages.value[fromIndex]
  pages.value.splice(fromIndex, 1)
  pages.value.splice(toIndex, 0, pageToMove)
  // Обновляем номера страниц после перемещения
  pages.value = pages.value.map((page, index) => ({
    ...page,
    pageNumber: index + 1
  }))
  emit('update:pages', pages.value)
  // Устанавливаем флаг new_orderliness в true при изменении порядка страниц
  store.chapterForm.new_orderliness = true
}
</script>

<template>
  <div>
    <div
      :class="[styles.uploadSection, { [styles.dragOver]: dragOver }]"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <label :for="uploadId" :class="styles.uploadButton">
        {{ label }}
      </label>
      <input
        :id="uploadId"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        @change="handleImageUpload"
        :class="styles.uploadInput"
        multiple
      />
      <p>Перетащите страницу манги сюда или выберите файл.</p>
      <p>
        Поддерживаемые форматы: JPEG, PNG, GIF, WEBP. Размер файла не должен превышать 50 МБ.
        Минимальная высота изображения: 500 пикселей.
      </p>
      <ErrorText :error="localError" />
    </div>

    <div v-if="pages.length > 0" :class="styles.pagesGrid">
      <div
        v-for="(page, index) in pages"
        :key="page.id"
        :class="styles.pageItem"
      >
        <div :class="styles.pageNumber">{{ index + 1 }}</div>
        <img
        v-if="page.status !== 'delete'"
        :src="page.preview"
        :alt="`Страница ${index + 1}`"
        :class="styles.imagePreview"
      />
      <div v-else :class="styles.deletedPage">
        Страница помечена на удаление
      </div>
        <div :class="styles.pageControls">
          <button
            :class="styles.moveButton"
            :disabled="index === 0"
            type="button"
            @click.prevent="reorderPages(index, index - 1)"
          >
            ↑
          </button>
          <button
            :class="styles.moveButton"
            :disabled="index === pages.length - 1"
            type="button"
            @click.prevent="reorderPages(index, index + 1)"
          >
            ↓
          </button>
          <button
            :class="[styles.deleteButton, { [styles.restoreButton]: page.status === 'delete' }]"
            type="button"
            @click="removePage(page.id)"
          >
            {{ page.status === 'delete' ? 'Восстановить' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


