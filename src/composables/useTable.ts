import { ref, reactive } from 'vue'
import type { TableProps } from 'ant-design-vue'

export function useTable<T = any>(fetchFn: () => Promise<T[]>) {
  const dataSource = ref<T[]>([])
  const loading = ref(false)
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const fetchData = async () => {
    loading.value = true
    try {
      const data = await fetchFn()
      dataSource.value = data
      pagination.total = data.length
    } finally {
      loading.value = false
    }
  }

  const handleTableChange: TableProps['onChange'] = (pag) => {
    pagination.current = pag.current || 1
    pagination.pageSize = pag.pageSize || 10
    fetchData()
  }

  return {
    dataSource,
    loading,
    pagination,
    fetchData,
    handleTableChange,
  }
}
