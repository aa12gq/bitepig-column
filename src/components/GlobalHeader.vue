<template>
  <nav class="navbar navbar-dark bg-primary justify-content-beween mb-4 px-4">
    <a class="navbar-brand" to="/">咬楼猪专栏</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link>
        </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <dropdown :title="`你好 ${user.nickName}`">
         <dropdown-item>
            <router-link to="/create" class="dropdown-item">新建文章</router-link>
          </dropdown-item>
          <dropdown-item><a href="#" class="dropdown-item">编辑资料</a></dropdown-item>
           <dropdown-item><a href="#" class="dropdown-item" @click.prevent="handleLogout">退出登录</a></dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from '@/base/Dropdown.vue'
import DropdownItem from '@/base/DropdownItem.vue'
import { UserProps } from '@/store/testData'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import createMessage from '@/base/createMessage'
export default defineComponent({
  name: 'GlobalHeader',
  components: { Dropdown, DropdownItem },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const handleLogout = () => {
      console.log('handleLogout')
      store.commit('logout')
      createMessage('退出成功!', 'success')
      router.push({ name: 'home' })
    }
    return {
      handleLogout
    }
  }

})
</script>
