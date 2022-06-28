<template>
  <div class="create-post-page container">
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" aria-current="page" href="#" :class="isToggle === 0 ? 'active' : ''" @click="isToggle = 0">更新个人资料</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" :class="isToggle === 1 ? 'active' : ''" @click="isToggle = 1">更新个人专栏</a>
      </li>
    </ul>
   <h4>编辑个人资料</h4>
    <uploader
    action="/api/upload"
    class="d-flex align-items-center justify-content-center bg-light text-secondary rounded-circle border my-4 mx-auto"
    :beforeUpload="uploadCheck"
    :uploaded="uploadedData"
    @file-uploaded-success="onFileUploadedSuccess"
    :toggle="isToggle"
    >
    <h3>点击上传头像</h3>
    <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h3>正在上传</h3>
        </div>
      </template>
        <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="dataProps.uploadedData.data.url"/>
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <validate-input
          :rules="titleRules"
          v-model="nickNameVal"
          placeholder="请输入名称"
          type="text"
        />
      </div>
      <div class="mb-3">
        <validate-input
          rows="5"
          tag="textarea"
          placeholder="请输入简介信息"
          :rules="contentRules"
          v-model="descriptionVal"
        />
      </div>
      <template #submit>
         <button class="btn btn-primary btn-large">提交修改</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateInput, { RulesProps } from '@/base/ValidateInput.vue'
import ValidateForm from '@/base/ValidateForm.vue'
import { GlobalDataProps, UserProps, ResponseType, ImageProps, ColumnProps } from '@/store/types'
import Uploader from '@/base/Uploader.vue'
import createMessage from '@/base/createMessage'
import { beforeUploadCheck, addColumnAvatar } from '@/libs/helper'
export default defineComponent({
  name: 'Edit',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const isToggle = ref(0)
    const uploadedData = ref()
    const nickNameVal = ref('')
    const imageId = ref('')
    const columnIdVal = ref('')
    // const column = ref<ColumnProps>()
    const titleRules: RulesProps = [
      { type: 'required', message: '名称不能为空' }
    ]
    const descriptionVal = ref('')
    const contentRules: RulesProps = [
      { type: 'required', message: '简介不能为空' }
    ]
    onMounted(() => {
      store.dispatch('fetchCurrentUser').then((rawData: ResponseType<UserProps>) => {
        const currentUser = rawData.data
        const { avatar, nickName, description, columnId } = currentUser
        columnIdVal.value = columnId || ''
        nickNameVal.value = nickName || ''
        descriptionVal.value = description || ''
        if (avatar) {
          uploadedData.value = { data: avatar }
        }
        store.dispatch('fetchColumn', columnId)
      })
    })
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(columnIdVal.value) as ColumnProps
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })

    watch(() => isToggle.value, (newValue) => {
      if (newValue === 1) {
        const { avatar } = column.value
        nickNameVal.value = column.value.title
        descriptionVal.value = column.value.description
        if (avatar) {
          uploadedData.value = { data: avatar }
        } else {
          isToggle.value = 3
        }
      } else {
        const { nickName, description, avatar } = store.state.user
        nickNameVal.value = nickName || ''
        descriptionVal.value = description || ''
        if (avatar) {
          uploadedData.value = { data: avatar }
        }
      }
    })
    const onFileUploadedSuccess = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data.id) {
        imageId.value = rawData.data.id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const newUser = {
          nickName: nickNameVal.value,
          description: descriptionVal.value,
          avatarId: imageId.value
        }
        const newColumn = {
          title: nickNameVal.value,
          description: descriptionVal.value,
          avatarId: imageId.value
        }
        const actionName = isToggle.value === 0 ? 'updateUser' : 'updateColumn'
        store.dispatch(actionName, isToggle.value === 0 ? newUser : newColumn).then(() => {
          if (isToggle.value === 0) {
            createMessage('修改成功！两秒后跳转到首页', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'home' })
            }, 2000)
          } else {
            createMessage('修改成功！两秒后跳转到专栏', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: columnIdVal.value } })
            }, 2000)
          }
        })
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb!', 'error')
      }
      return passed
    }
    return {
      nickNameVal,
      titleRules,
      descriptionVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      onFileUploadedSuccess,
      uploadedData,
      isToggle
    }
  }
})
</script>

<style>
.create-post-page {
  width: 35%;
}
.create-post-page .file-upload-container {
  width: 200px;
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
