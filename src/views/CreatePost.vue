<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <uploader
    action="/api/upload"
    :beforeUpload="beforeUpload"
    @file-uploaded="onFileUploaded"
    >
    <template #uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url" alt="" width="500">
    </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit" @change.prevent="handleFileChange">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { GlobalDataProps } from '@/store'
import ValidateInput, { RulesProps } from '@/base/ValidateInput.vue'
import ValidateForm from '@/base/ValidateForm.vue'
import { PostProps, ResponseType, ImageProps } from '@/store/testData'
import Uploader from '@/base/Uploader.vue'
import createMessage from '@/base/createMessage'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const titleVal = ref('')
    const titleRules: RulesProps = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProps = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            _id: new Date().getTime().toLocaleString(),
            title: titleVal.value,
            content: contentVal.value,
            column: column,
            createdAt: new Date().toLocaleString()
          }
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }
    const handleFileChange = (e:Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((rep:any) => {
          console.log(rep)
        })
      }
    }
    const beforeUpload = (file:File) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        createMessage('上传图片只能是 JPG 格式', 'error')
      }
      return isJPG
    }
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessage(`上传图片ID ${rawData.data._id}`, 'success')
    }
    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      handleFileChange,
      beforeUpload,
      onFileUploaded
    }
  }
})
</script>

<style scoped>
</style>
