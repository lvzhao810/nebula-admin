<template>
  <span class="count-to">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'

interface Props {
  startVal?: number
  endVal: number
  duration?: number
  decimals?: number
  autoplay?: boolean
  prefix?: string
  suffix?: string
  useEasing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  startVal: 0,
  duration: 2000,
  decimals: 0,
  autoplay: true,
  prefix: '',
  suffix: '',
  useEasing: true,
})

const emit = defineEmits<{
  'on-end': []
}>()

const displayValue = ref(props.startVal.toFixed(props.decimals))
let startTime: number | null = null
let rafId: number | null = null

const easing = (t: number) => t * (2 - t)

const update = (timestamp: number) => {
  if (!startTime) startTime = timestamp
  const progress = timestamp - startTime
  const rate = Math.min(progress / props.duration, 1)
  const easedRate = props.useEasing ? easing(rate) : rate
  const currentVal = props.startVal + (props.endVal - props.startVal) * easedRate

  displayValue.value = currentVal.toFixed(props.decimals)

  if (rate < 1) {
    rafId = requestAnimationFrame(update)
  } else {
    emit('on-end')
  }
}

const start = () => {
  startTime = null
  rafId = requestAnimationFrame(update)
}

const reset = () => {
  displayValue.value = props.startVal.toFixed(props.decimals)
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

onMounted(() => {
  if (props.autoplay) start()
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

watch(() => props.endVal, () => {
  reset()
  start()
})

defineExpose({ start, reset })
</script>

<style scoped lang="less">
.count-to {
  font-variant-numeric: tabular-nums;
}
</style>
