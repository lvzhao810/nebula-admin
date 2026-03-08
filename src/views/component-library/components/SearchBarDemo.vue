<template>
  <div class="search-bar-demo">
    <SearchBar
      :model="searchModel"
      :items="searchItems"
      @search="handleSearch"
      @reset="handleReset"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'

const searchModel = ref({
  keyword: '',
  status: undefined,
})

const searchItems = [
  { name: 'keyword', label: '关键词', type: 'input', placeholder: '请输入关键词' },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
]

const handleSearch = () => {
  console.log('搜索', searchModel.value)
}

const handleReset = () => {
  console.log('重置')
}
</script>
