<template>
  <div class="personal-center-layout">
    <!-- 顶部区域 -->
    <header class="header">
      <div class="user-info">
        <div class="user-details">
          <h2>{{ username }}</h2>
        </div>
      </div>
      <div class="actions">
        <!-- <a-button type="link" href="/profile/setting">Settings</a-button> -->
        <a-button
          class="logout-button"
          type="primary"
          @click="logout"
        >
          Logout
        </a-button>
      </div>
    </header>

    <!-- 主体布局 -->
    <div class="layout">
      <aside class="sidebar" :class="{ collapsed: state.collapsed }">
        <a-button
          class="collapse-btn"
          type="primary"
          @click="toggleCollapsed"
        >
          <MenuUnfoldOutlined v-if="state.collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>

        <a-menu
          v-model:openKeys="state.openKeys"
          v-model:selectedKeys="state.selectedKeys"
          mode="inline"
          theme="dark"
          :inline-collapsed="state.collapsed"
          :items="items"
        />
      </aside>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { reactive, watch, h } from 'vue'
import {
  HomeOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  CloudOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const username = localStorage.getItem('currentUser') || 'Guest'

const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1']
})

const items = reactive([
  {
    key: '1',
    icon: () => h(HomeOutlined),
    label: 'Home',
    onClick: () => router.push('/')
  },
  {
    key: '2',
    icon: () => h(UserOutlined),
    label: 'Profile',
    onClick: () => router.push('/profile')
  },
  {
    key: '3',
    icon: () => h(CloudOutlined),
    label: 'RefreshCDN',
    onClick: () => router.push('/refreshcdn')
  },
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: 'Navigation One',
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' }
    ]
  },
  {
    key: 'sub2',
    icon: () => h(AppstoreOutlined),
    label: 'Navigation Two',
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' }
    ]
  }
])

watch(
  () => state.openKeys,
  (newVal, oldVal) => {
    state.preOpenKeys = oldVal
  }
)

const toggleCollapsed = () => {
  state.collapsed = !state.collapsed
  state.openKeys = state.collapsed ? [] : state.preOpenKeys
}

const logout = () => {
  localStorage.removeItem('authToken')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.personal-center-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    background-color: #001529;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .user-info {
      display: flex;
      align-items: center;

      .user-details h2 {
        margin: 0;
        font-size: 18px;
        color: #fff;
      }
    }

    .actions {
      display: flex;
      gap: 16px;
    }
  }

  .layout {
    display: flex;
    flex: 1;

    .sidebar {
      width: 200px;
      background-color: #001529;
      color: #fff;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      padding: 16px;

      &.collapsed {
        width: 80px;
      }

      .collapse-btn {
        margin-bottom: 16px;
      }

      .logout-button {
        margin-top: auto;
      }
    }

    .content {
      flex: 1;
      padding: 16px;
      background-color: #f0f2f5;
    }
  }
}
</style>
