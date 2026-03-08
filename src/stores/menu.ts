import { defineStore } from 'pinia'
import type { MenuItem } from '@/types'

interface MenuState {
  menuList: MenuItem[]
  activeMenu: string
  openMenus: string[]
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuList: [],
    activeMenu: '',
    openMenus: [],
  }),

  getters: {
    // 获取扁平化菜单列表
    flatMenuList: (state): MenuItem[] => {
      const result: MenuItem[] = []

      const flatten = (menus: MenuItem[]) => {
        menus.forEach((menu) => {
          result.push(menu)
          if (menu.children && menu.children.length > 0) {
            flatten(menu.children)
          }
        })
      }

      flatten(state.menuList)
      return result
    },
  },

  actions: {
    setMenuList(menus: MenuItem[]) {
      this.menuList = menus
    },

    setActiveMenu(menu: string) {
      this.activeMenu = menu
    },

    setOpenMenus(menus: string[]) {
      this.openMenus = menus
    },

    toggleOpenMenu(menu: string) {
      const index = this.openMenus.indexOf(menu)
      if (index > -1) {
        this.openMenus.splice(index, 1)
      } else {
        this.openMenus.push(menu)
      }
    },

    findMenuByPath(path: string): MenuItem | null {
      function find(menus: MenuItem[]): MenuItem | null {
        for (const menu of menus) {
          if (menu.path === path) return menu
          if (menu.children?.length) {
            const found = find(menu.children)
            if (found) return found
          }
        }
        return null
      }

      return find(this.menuList)
    },
  },
})
