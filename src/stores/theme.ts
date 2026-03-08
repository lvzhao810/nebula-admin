import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'
export type ThemeStyle = 'nebula' | 'ocean' | 'forest' | 'sunset' | 'cherry' | 'midnight'

export interface ThemeConfig {
  mode: ThemeMode
  style: ThemeStyle
}

export const themeStyles = {
  nebula: {
    name: '星云紫',
    primary: '#7c3aed',
    secondary: '#a78bfa',
    gradient: 'from-nebula-500 to-aura-500',
    bgLight: '#f9fafb',
    bgDark: '#0f172a',
    description: '靛蓝 + 紫色渐变，年轻活力',
  },
  ocean: {
    name: '海洋蓝',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-500',
    bgLight: '#f0f9ff',
    bgDark: '#0c4a6e',
    description: '清新蓝 + 青色渐变，宁静致远',
  },
  forest: {
    name: '森林绿',
    primary: '#22c55e',
    secondary: '#10b981',
    gradient: 'from-green-500 to-emerald-500',
    bgLight: '#f0fdf4',
    bgDark: '#064e3b',
    description: '自然绿 + 青绿渐变，清新自然',
  },
  sunset: {
    name: '夕阳橙',
    primary: '#f97316',
    secondary: '#ef4444',
    gradient: 'from-orange-500 to-red-500',
    bgLight: '#fff7ed',
    bgDark: '#450a0a',
    description: '温暖橙 + 红色渐变，热情活力',
  },
  cherry: {
    name: '樱花粉',
    primary: '#ec4899',
    secondary: '#db2777',
    gradient: 'from-pink-500 to-rose-500',
    bgLight: '#fdf2f8',
    bgDark: '#4a044e',
    description: '柔和粉 + 玫瑰渐变，浪漫温馨',
  },
  midnight: {
    name: '午夜蓝',
    primary: '#3b82f6',
    secondary: '#6366f1',
    gradient: 'from-blue-600 to-indigo-600',
    bgLight: '#eff6ff',
    bgDark: '#0f172a',
    description: '深蓝 + 靛蓝渐变，专业稳重',
  },
} as const

const MODE_KEY = 'theme-mode'
const STYLE_KEY = 'theme-style'

function getDarkVars(): Record<string, string> {
  return {
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--bg-tertiary': '#334155',
    '--text-primary': '#f1f5f9',
    '--text-secondary': '#94a3b8',
    '--text-tertiary': '#64748b',
    '--text-disabled': '#475569',
    '--border-color': 'rgba(255, 255, 255, 0.1)',
    '--border-color-light': 'rgba(255, 255, 255, 0.05)',
    '--card-bg': '#1e293b',
    '--card-bg-hover': '#252f44',
    '--hover-bg': '#334155',
    '--hover-bg-active': '#3f4e66',
    '--scrollbar-track': '#1e293b',
    '--scrollbar-thumb': '#475569',
  }
}

function getLightVars(colors: typeof themeStyles[keyof typeof themeStyles]): Record<string, string> {
  return {
    '--bg-primary': '#ffffff',
    '--bg-secondary': colors.bgLight || '#f9fafb',
    '--bg-tertiary': '#f3f4f6',
    '--text-primary': '#1f2937',
    '--text-secondary': '#6b7280',
    '--text-tertiary': '#9ca3af',
    '--text-disabled': '#d1d5db',
    '--border-color': '#e5e7eb',
    '--border-color-light': '#f3f4f6',
    '--card-bg': '#ffffff',
    '--card-bg-hover': '#fafafa',
    '--hover-bg': '#f9fafb',
    '--hover-bg-active': '#f3f4f6',
    '--scrollbar-track': '#f3f4f6',
    '--scrollbar-thumb': '#d1d5db',
  }
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeConfig & { initialized: boolean } => ({
    mode: (localStorage.getItem(MODE_KEY) as ThemeMode) || 'light',
    style: (localStorage.getItem(STYLE_KEY) as ThemeStyle) || 'nebula',
    initialized: false,
  }),

  getters: {
    currentTheme: (state) => ({ mode: state.mode, style: state.style }),
    themeColors: (state) => themeStyles[state.style],
    isDark: (state) => state.mode === 'dark',
  },

  actions: {
    setMode(mode: ThemeMode) {
      this.mode = mode
      localStorage.setItem(MODE_KEY, mode)
      this.applyTheme()
    },

    setStyle(style: ThemeStyle) {
      this.style = style
      localStorage.setItem(STYLE_KEY, style)
      this.applyTheme()
    },

    toggleMode() {
      this.mode = this.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem(MODE_KEY, this.mode)
      this.applyTheme()
    },

    applyTheme() {
      const html = document.documentElement
      const colors = themeStyles[this.style]
      const isDark = this.mode === 'dark'

      html.classList.toggle('dark', isDark)
      html.setAttribute('data-theme', this.style)

      const themeVars: Record<string, string> = {
        '--theme-primary': colors.primary,
        '--theme-secondary': colors.secondary,
        '--theme-gradient': `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        ...(isDark ? getDarkVars() : getLightVars(colors)),
      }

      Object.entries(themeVars).forEach(([key, value]) => {
        html.style.setProperty(key, value)
      })

      window.dispatchEvent(new CustomEvent('theme-change', {
        detail: { mode: this.mode, style: this.style, colors },
      }))
    },

    initTheme() {
      if (this.initialized) return
      this.applyTheme()
      this.initialized = true
    },
  },
})

// Listen for storage changes (multi-tab sync)
window.addEventListener('storage', (e) => {
  if (e.key === MODE_KEY || e.key === STYLE_KEY) {
    location.reload()
  }
})
