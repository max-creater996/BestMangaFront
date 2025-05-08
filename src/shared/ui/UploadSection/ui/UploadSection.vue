<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ErrorText } from '../../ErrorText'
import { useImageUpload } from '@/shared/hooks/useImageUpload'
import styles from './UploadSection.module.scss'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  accept: {
    type: String,
    required: true
  },
  isImage: {
    type: Boolean,
    default: true
  },
  file: {
    type: File,
    default: null
  },
  preview: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'update:file', file: File | null): void
  (e: 'update:preview', url: string): void
  (e: 'update:error', error: string): void
}>()

const dragOver = ref(false)
const localPreview = ref(props.preview || '')
const localError = ref(props.error || '')

// Наблюдаем за изменением входящих свойств
watch(() => props.preview, (newPreview) => {
  if (newPreview) {
    localPreview.value = newPreview
  }
})

watch(() => props.error, (newError) => {
  localError.value = newError
})

const { imageFile, handleImageUpload: handleImageFileUpload } = useImageUpload({
  onImageUrlChange: (url) => {
    localPreview.value = url
    emit('update:preview', url)
  },
  onErrorChange: (errorMessage) => {
    localError.value = errorMessage
    emit('update:error', errorMessage)
  }
})

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragOver.value = false
  handleImageFileUpload(e)
}

const handleImageUpload = (e: Event) => {
  handleImageFileUpload(e)
  emit('update:file', imageFile.value)
}
</script>


<template>
  <div
    :class="[styles.uploadSection, { [styles.dragOver]: dragOver }]"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <label :for="id" :class="styles.uploadButton">
      {{ label }}
    </label>
    <input
      :id="id"
      type="file"
      :accept="accept"
      @change="handleImageUpload"
      :class="styles.uploadInput"
    />
    <p>Перетащите {{ fileType }} сюда или выберите файл.</p>
    <p>
      Это должен быть формат {{ accept }}, размер которого не должен превышать {{ isImage ? '50 МБ' : '1024 МБ' }}.
    </p>
    <img v-if="localPreview && isImage" :src="localPreview" alt="Preview" :class="styles.imagePreview" />
    <video v-if="localPreview && !isImage" :src="localPreview" controls :class="styles.videoPreview" />
    <ErrorText :error="localError" />
  </div>
</template>



