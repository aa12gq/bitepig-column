<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <global-header :user="currentUser"></global-header>
      <loader v-if="isLoading" text="拼命加载中"  background="rgba(0, 0, 0, 0.8)"></loader>
     <router-view></router-view>
  </div>
  <footer class="text-center py-4 text-secondary bg-light mt-auto">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2022 咬楼猪专栏</li>
          <li class="list-inline-item"><a href="http://github.com/AA12GQ">github</a></li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import Loader from '@/base/Loader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/types'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from '@/components/GlobalHeader.vue'
import createMessage from '@/base/createMessage'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
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
