import { createStore, Commit } from 'vuex'
import { GlobalDataProps, GlobalErrorProps } from '@/store/types'
import { StorageType, StorageHandler } from '@/libs/storage'
import { axios, AxiosRequestConfig } from '@/libs/http'
import { arrToObj, objToArr } from '@/libs/helper'
const storageType = StorageType.Local
const storageHandler = new StorageHandler()

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
  config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: storageHandler.getItem(storageType, 'token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColumns: {} },
    user: { isLogin: false }
  },
  mutations: {
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { TotalCount, CurrentPage } = rawData.pager
      if (CurrentPage === 3) {
        return
      }
      state.columns = {
        data: { ...data, ...arrToObj(rawData.data) },
        total: TotalCount,
        currentPage: CurrentPage * 1
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data.id] = rawData.data
    },
    updateColumn (state, rawData) {
      state.columns.data = { ...rawData.data }
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      const { data } = state.posts
      const { TotalCount, CurrentPage } = rawData.pager
      state.posts.data = { ...data, ...arrToObj(rawData.data) }
      state.posts.loadedColumns[columnId] = {
        columnId: columnId,
        total: TotalCount,
        currentPage: CurrentPage * 1
      }
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data.id] = rawData.data
    },
    createPost (state, newPost) {
      state.posts.data[newPost.id] = newPost
    },
    updatePost (state, { data }) {
      state.posts.data[data.id] = data
    },
    fetchCurrentUser (state, Data) {
      state.user = { isLogin: true, ...Data.data }
    },
    updateUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    deletePost (state, { data }) {
      delete state.posts.data[data.id]
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e:GlobalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      const { token } = rawData
      state.token = token
      storageHandler.setItem(storageType, 'token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      storageHandler.remove(storageType, 'token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, perPage = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/api/columns?page=${currentPage}&perPage=${perPage}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    updateColumn ({ commit }, payload) {
      return asyncAndCommit('/api/columns', 'updateColumn', commit, {
        method: 'put',
        data: payload
      })
    },
    fetchPosts ({ state, commit }, params = {}) {
      const { columnId, currentPage = 1, perPage = 3 } = params
      const loadedPost = state.posts.loadedColumns[columnId]
      // 如果loadedPost存在 不为 undefined
      if (!loadedPost) {
        if (columnId === undefined) {
          return
        }
        return asyncAndCommit(`/api/columns/${columnId}/posts?page=${currentPage}&perPage=${perPage}`, 'fetchPosts', commit, { method: 'get' }, columnId)
      } else {
        const loadedPostCurrentPage = loadedPost.currentPage || 0
        if (loadedPostCurrentPage < currentPage) {
          return asyncAndCommit(`/api/columns/${columnId}/posts?page=${currentPage}&perPage=${perPage}`, 'fetchPosts', commit, { method: 'get' }, columnId)
        }
      }
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/api/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, {
        method: 'put',
        data: payload
      })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/api/current', 'fetchCurrentUser', commit)
    },
    updateUser ({ commit }, payload) {
      return asyncAndCommit('/api/users', 'updateUser', commit, {
        method: 'put',
        data: payload
      })
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/api/auth/login/using-email', 'login', commit, { method: 'post', data: payload })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    register ({ commit }, payload) {
      return asyncAndCommit('/api/auth/signup/using-email', 'register', commit, { method: 'post', data: payload })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCId: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.columnId === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    },
    getLoadedPost: (state) => (id: string) => {
      return state.posts.loadedColumns[id]
    }
  }
})

export default store
