<template>
  <div class="contarner">
    <global-header :user="currentUser"></global-header>
     <form action="">
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
      <input
        type="text" class="form-control" id="exampleInputEmail1"
        v-model="emailRef.val"
        @blur="validateEmail"
      >
      <div class="form-text" v-if="emailRef.error">{{emailRef.message}}</div>
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">密码</label>
      <input type="password" class="form-control" id="exampleInputPassword1">
    </div>
  </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
// import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { userProps } from './components/GlobalHeader.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const currentUser: userProps = {
  isLogin: true,
  name: '咬楼猪'
}

export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader
  },
  setup () {
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const validateEmail = () => {
      if (emailRef.val.trim() === '') {
        emailRef.error = true
        emailRef.message = 'can not be empty'
      } else if (!emailReg.test(emailRef.val)) {
        emailRef.error = true
        emailRef.message = 'should be valid email'
      }
    }
    return {
      currentUser,
      emailRef,
      validateEmail
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
