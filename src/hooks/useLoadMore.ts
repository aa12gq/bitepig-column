import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'

export interface LoadParams {
  columnId?: string;
  currentPage: number;
  perPage: number;
}

const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 1, perPage: 1 }) => {
  const store = useStore()
  const { currentPage: current, perPage, columnId } = params
  const currentPage = ref(current)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    perPage: perPage,
    columnId: columnId
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / perPage) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
