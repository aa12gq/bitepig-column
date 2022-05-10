<template>
  <div class="row">
    <div v-for="column in list" :key="column.id" class="col-4">
      <img :src="column.avatar" :alt="column.title">
      <h5>{{column.title}}</h5>
      <p>{{column.description}}</p>
      <a href="#">进入专栏</a>
    </div>
  </div>
</template>
<script lang="ts">

import { defineComponent, PropType } from 'vue'
export interface ColumnProps{
  id: number;
  title: string;
  avatar: string;
  description: string;
}
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  }

})

</script>
