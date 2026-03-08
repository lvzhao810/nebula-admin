<template>
  <div class="qr-code" ref="qrCodeRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'

interface Props {
  text: string
  width?: number
  height?: number
  colorDark?: string
  colorLight?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 200,
  height: 200,
  colorDark: '#000000',
  colorLight: '#ffffff',
})

const qrCodeRef = ref<HTMLDivElement>()

async function generateQRCode() {
  if (!qrCodeRef.value) return

  try {
    const url = await QRCode.toCanvas(props.text, {
      width: props.width,
      margin: 2,
      color: {
        dark: props.colorDark,
        light: props.colorLight,
      },
    })

    qrCodeRef.value.innerHTML = ''
    qrCodeRef.value.appendChild(url)
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
}

onMounted(() => {
  generateQRCode()
})

watch(() => props.text, () => {
  generateQRCode()
})
</script>

<style scoped lang="less">
.qr-code {
  display: inline-block;

  canvas {
    display: block;
  }
}
</style>
