import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '数据概览',
          icon: 'DashboardOutlined',
          requiresAuth: true,
        },
      },
      {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('@/views/analytics/index.vue'),
        meta: {
          title: '分析仪表板',
          icon: 'BarChartOutlined',
          requiresAuth: true,
        },
      },
      {
        path: '/components',
        name: 'Components',
        component: () => import('@/views/components/index.vue'),
        redirect: '/components/table/pro-table',
        meta: {
          title: '组件库',
          icon: 'AppstoreOutlined',
          requiresAuth: true,
        },
        children: [
          // 表格组件
          {
            path: '/components/table/pro-table',
            name: 'ProTable',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'ProTable 高级表格', icon: 'TableOutlined', requiresAuth: true },
            redirect: '/components/table/pro-table/index',
            children: [
              {
                path: '/components/table/pro-table/index',
                name: 'ProTableDemo',
                component: () => import('@/views/components/demos/table/ProTableDemo.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
          {
            path: '/components/table/editable-table',
            name: 'EditableTable',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'EditableTable 可编辑表格', icon: 'EditOutlined', requiresAuth: true },
            redirect: '/components/table/editable-table/index',
            children: [
              {
                path: '/components/table/editable-table/index',
                name: 'EditableTableDemo',
                component: () => import('@/views/components/demos/table/EditableTableDemo.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
          {
            path: '/components/table/sortable-table',
            name: 'SortableTable',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'SortableTable 可排序表格', icon: 'OrderedListOutlined', requiresAuth: true },
            redirect: '/components/table/sortable-table/index',
            children: [
              {
                path: '/components/table/sortable-table/index',
                name: 'SortableTableDemo',
                component: () => import('@/views/components/demos/table/SortableTableDemo.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
          {
            path: '/components/table/tree-table',
            name: 'TreeTable',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'TreeTable 树形表格', icon: 'ClusterOutlined', requiresAuth: true },
            redirect: '/components/table/tree-table/index',
            children: [
              {
                path: '/components/table/tree-table/index',
                name: 'TreeTableDemo',
                component: () => import('@/views/components/demos/table/TreeTableDemo.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
          // 表单组件
          {
            path: '/components/form/form-modal',
            name: 'FormModal',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'FormModal 表单弹窗', icon: 'FormOutlined', requiresAuth: true },
            redirect: '/components/form/form-modal/index',
            children: [
              {
                path: '/components/form/form-modal/index',
                name: 'FormModalDemo',
                component: () => import('@/views/components/demos/form/FormModalDemo.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
          {
            path: '/components/form/search-bar',
            name: 'SearchBar',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'SearchBar 搜索栏', icon: 'SearchOutlined', requiresAuth: true },
            redirect: '/components/form/search-bar/index',
            children: [
              {
                path: '/components/form/search-bar/index',
                name: 'SearchBarDemo',
                component: () => import('@/views/components/demos/form/SearchBarDemo.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
          {
            path: '/components/form/toolbar',
            name: 'Toolbar',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'Toolbar 工具栏', icon: 'ToolOutlined', requiresAuth: true },
            redirect: '/components/form/toolbar/index',
            children: [
              {
                path: '/components/form/toolbar/index',
                name: 'ToolbarDemo',
                component: () => import('@/views/components/demos/form/ToolbarDemo.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
          // 文档组件
          {
            path: '/components/document/preview',
            name: 'DocumentPreview',
            component: () => import('@/views/components/layouts/ComponentDetailLayout.vue'),
            meta: { title: 'DocumentPreview 文档预览', icon: 'FileTextOutlined', requiresAuth: true },
            redirect: '/components/document/preview/index',
            children: [
              {
                path: '/components/document/preview/index',
                name: 'DocumentPreviewDemo',
                component: () => import('@/views/demo/DocumentPreview.vue'),
                meta: { hideInMenu: true, requiresAuth: true },
              },
            ],
          },
        ],
      },
      {
        path: '/system',
        name: 'System',
        component: () => import('@/layouts/EmptyLayout.vue'),
        meta: {
          title: '系统管理',
          icon: 'SettingOutlined',
          requiresAuth: true,
        },
        children: [
          {
            path: '/system/user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              icon: 'UserOutlined',
              requiresAuth: true,
            },
          },
          {
            path: '/system/role',
            name: 'SystemRole',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
              title: '角色管理',
              icon: 'TeamOutlined',
              requiresAuth: true,
            },
          },
          {
            path: '/system/menu',
            name: 'SystemMenu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理',
              icon: 'MenuOutlined',
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
]

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/404.vue'),
  meta: {
    title: '页面不存在',
    hideInMenu: true,
  },
}
