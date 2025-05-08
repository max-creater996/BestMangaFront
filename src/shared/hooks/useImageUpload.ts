import { ref } from 'vue'

interface UseImageUploadOptions {
  onImageUrlChange: (url: string) => void
  onErrorChange: (error: string) => void
}

export const useImageUpload = ({ onImageUrlChange, onErrorChange }: UseImageUploadOptions) => {
  const imageFile = ref<File | null>(null)

  const handleImageUpload = (event: Event | DragEvent) => {
    let file: File | null = null

    if (event instanceof DragEvent && event.dataTransfer) {
      file = event.dataTransfer.files[0]
    } else if (event instanceof Event && event.target instanceof HTMLInputElement) {
      file = event.target.files ? event.target.files[0] : null
    }

    if (file) {
      const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      
      if (!supportedImageTypes.includes(file.type)) {
        onErrorChange('Неверный формат изображения. Разрешены JPG, PNG, GIF, WEBP.')
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        onErrorChange('Размер изображения не должен превышать 50 МБ.')
        return
      }

      onImageUrlChange(URL.createObjectURL(file))
      imageFile.value = file
      onErrorChange('')
    } else {
      onErrorChange('Файл не найден. Попробуйте снова.')
    }
  }

  return {
    imageFile,
    handleImageUpload
  }
} 