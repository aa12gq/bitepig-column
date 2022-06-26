<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img :src="fitUrl" :alt="user.nickName" class="rounded-circle img-thumbnail">
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ user.nickName }}</h6>
        <span class="text-truncate text-muted d-block">{{ user.description }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { UserProps } from '@/declareData'
import { addColumnAvatar } from '@/helper'
import { defineComponent, PropType, computed } from 'vue'
export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup (props) {
    const fitUrl = computed(() => {
      // let url = ''
      // if (props.user.avatar && props.user.avatar.url) {
      //   url = props.user.avatar.url
      // } else {
      //   url = require('@/assets/avatar.jpg')
      // }
      // return url
      addColumnAvatar(props.user, 50, 50)
      const { avatar } = props.user
      return avatar && avatar.fitUrl
    })
    return {
      fitUrl
    }
  }
})
</script>

<style scoped>

</style>
