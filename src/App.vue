<template>
  <div class="contarner">
    <global-header :user="currentUser"></global-header>
    <!-- <h1>{{error.message}}</h1> -->
    <!-- <message type="error" :message="error.message" v-if="error.status"></message> -->
      <loader v-if="isLoading" text="拼命加载中"  background="rgba(0, 0, 0, 0.8)"></loader>
     <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2022 咬楼猪专栏</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue'
import Loader from '@/base/Loader.vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from '@/components/GlobalHeader.vue'
import Message from '@/base/Message.vue'
import createMessage from '@/base/createMessage'
import axios from '@/libs/http'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
</style>
