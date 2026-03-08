<template>
  <div class="ellipsis-text">
    <span v-if="!isExpanded || !needExpand" class="text-content">
      {{ displayText }}
    </span>
    <span v-else class="text-content">{{ text }}</span>
    <a v-if="needExpand" class="expand-btn" type="link" @click="toggleExpand">
      {{ isExpanded ? '收起' : '展开' }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useTemplateRef } from 'vue'

interface Props {
  text: string
  maxLength?: number
  lines?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 50,
  lines: 2,
})

const isExpanded = ref(false)
const needExpand = ref(false)
const containerRef = useTemplateRef<HTMLElement>('containerRef')

const displayText = computed(() =>
  props.text.length <= props.maxLength
    ? props.text
    : props.text.substring(0, props.maxLength) + '...'
)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const checkNeedExpand = () => {
  if (!props.lines) {
    needExpand.value = props.text.length > props.maxLength
    return
  }

  const element = containerRef.value?.querySelector('.text-content') as HTMLElement
  if (element) {
    const lineHeight = parseInt(getComputedStyle(element).lineHeight)
    needExpand.value = element.scrollHeight > lineHeight * props.lines
  }
}

onMounted(() => {
  checkNeedExpand()
  window.addEventListener('resize', checkNeedExpand)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkNeedExpand)
})
</script>

<style scoped lang="less">
.ellipsis-text {
  .text-content {
    display: inline;
  }

  .expand-btn {
    margin-left: 4px;
  }
}
</style>
