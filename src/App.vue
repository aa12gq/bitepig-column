<template>
  <div class="contarner">
    <global-header :user="currentUser"></global-header>
     <validate-form @form-submit="onFormSubmit">
       <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
      <validate-input
        :rules="emailRules"
        v-model="emailVal"
        type="text"
        placeholder="请输入邮箱地址"
        ref="inputRef"
         ></validate-input>
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">密码</label>
<<<<<<< HEAD
      <validate-input
        v-model="passwordVal"
        :rules="passwordRules"
        type="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="请输入密码"
      ></validate-input>
=======
      <validate-input :rules="passwordRules" type="password" class="form-control" id="exampleInputPassword1" placeholder="请输入密码"></validate-input>
>>>>>>> 769ec32aeb3381799c4a026762dfb40db821e7fd
    </div>
    <template #submit>
      <span class="btn btn-primary">提交</span>
    </template>
  </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
// import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { userProps } from './components/GlobalHeader.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'
import ValidateForm from './components/ValidateForm.vue'
// const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const currentUser: userProps = {
  isLogin: true,
  name: '咬楼猪'
}

export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
    ValidateInput,
    ValidateForm
  },
  setup () {
    const inputRef = ref<any>()
    const emailVal = ref('123@test.com')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
<<<<<<< HEAD
    const passwordVal = ref('123')
=======
    const passwordVal = ref('')
>>>>>>> 769ec32aeb3381799c4a026762dfb40db821e7fd
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      console.log('res', inputRef.value.validateInput())
      console.log('1234', result)
    }
    return {
      currentUser,
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
<<<<<<< HEAD
      onFormSubmit,
      inputRef
=======
      onFormSubmit
>>>>>>> 769ec32aeb3381799c4a026762dfb40db821e7fd
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
