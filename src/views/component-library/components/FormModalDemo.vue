<template>
  <div class="form-modal-demo">
    <a-button type="primary" @click="showModal = true">
      点击打开表单弹窗
    </a-button>
    <FormModal
      v-model:visible="showModal"
      title="用户表单"
      :form-data="formData"
      :form-items="formItems"
      @ok="handleOk"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormModal from '@/components/common/FormModal.vue'

const showModal = ref(false)
const formData = ref({
  username: '',
  email: '',
})

const formItems = [
  { name: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
  { name: 'email', label: '邮箱', type: 'input', placeholder: '请输入邮箱' },
]

const handleOk = () => {
  showModal.value = false
}
</script>

<style scoped lang="less">
.form-modal-demo {
  padding: 20px;
  text-align: center;
}
</style>
