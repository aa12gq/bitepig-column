import { createStore, Commit } from 'vuex'
import { currentUser, ColumnProps, PostProps, UserProps } from '@/store/testData'
import { StorageType, StorageHandler } from '@/libs/storage'
import { axios, AxiosRequestConfig } from '@/libs/http'
const storageType = StorageType.Local
const storageHandler = new StorageHandler()
export interface GlobalErrorProps{
  status:boolean;
  message?:string;
}
export interface GlobalDataProps{
  error:GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;

}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: storageHandler.getItem(storageType, 'token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: currentUser
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data
    },
    fetchColumn (state, rawData) {
      console.log(rawData.data)
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.list
    },
    fetchPost (state, rawData) {
      state.posts = [rawData.data]
      // // 更新替换对应post的数据
      // const targetId = rawData.data._id
      // const oldIndex = state.posts.findIndex(c => c._id === targetId)
      // const newPost = rawData.data
      // state.posts.splice(oldIndex, 1, newPost)
    },
    updatePost (state, { data }) {
      state.posts = state.posts.map(post => {
        if (post.id === data.id) {
          return data
        } else {
          return post
        }
      })
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    deletePost (state, { data }) {
      state.posts = state.posts.filter(post => post.id !== data.id)
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
    fetchColumns ({ commit }) {
      return asyncAndCommit('/api/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return asyncAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost ({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/api/current', 'fetchCurrentUser', commit)
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
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/api/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c.id === id)
    },
    getPostsById: (state) => (cid:string) => {
      return state.posts
    },
    getCurrentPost: (state) => (id: string) => {
      console.log('tst', state.posts)

      return state.posts.find(c => c.id === id)
    }
  }
})

export default store
