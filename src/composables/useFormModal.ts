import { ref, reactive, computed } from 'vue'
import type { FormInstance } from 'ant-design-vue'

export function useFormModal<T extends Record<string, any>>(initialData: T) {
  const visible = ref(false)
  const isEdit = ref(false)
  const formRef = ref<FormInstance>()
  const formData = reactive<T>({ ...initialData })

  const title = computed(() => (isEdit.value ? '编辑' : '新增'))

  function open(data?: Partial<T>) {
    visible.value = true
    if (data) {
      isEdit.value = true
      Object.assign(formData, data)
    } else {
      isEdit.value = false
      resetForm()
    }
  }

  function close() {
    visible.value = false
  }

  function resetForm() {
    Object.assign(formData, initialData)
    formRef.value?.clearValidate()
  }

  async function validate() {
    return await formRef.value?.validate()
  }

  return {
    visible,
    isEdit,
    formRef,
    formData,
    title,
    open,
    close,
    resetForm,
    validate,
  }
}
