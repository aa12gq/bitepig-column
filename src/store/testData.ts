export interface ImageProps {
  id?: string;
  url?: string;
  fitUrl?: string;
  createdAt?: string;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  id?: string;
  columnId?: string;
  email?: string;
  description?: string;
  avatar?: ImageProps;
}

export interface PostProps {
  id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  columnId: string;
  authorId?:string;
  author?: string | UserProps;
  isHTML?: boolean;
}

export interface ColumnProps {
  id: string;
  title: string;
  avatar?: ImageProps;
  author?:string;
  description: string;
}

export interface RuleProps {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?:() => boolean;
}
export interface ResponseType<P = any> {
  success: boolean;
  message: string;
  data: P;
}

export const currentUser: UserProps = {
  isLogin: false
}

export const testColumns: ColumnProps[] = [
  {
    id: '1',
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: {
      url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg'
      // url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
    }
  },
  {
    id: '2',
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: '3',
    title: 'test3的专栏',
    description: '这是的test3专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: '4',
    title: 'test4的专栏',
    description: '这是的test4专栏，有一段非常有意思的简介，可以更新一下欧'
  }
]

export const testPosts: PostProps[] = [
  {
    id: '1',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    // image: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100',
    createdAt: '2020-06-11 10:34:22',
    columnId: '1'
  },
  {
    id: '2',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    // image: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100',
    createdAt: '2020-06-11 10:34:22',
    columnId: '1'
  },
  {
    id: '1',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    createdAt: '2020-06-11 10:34:22',
    columnId: '2'
  }
]
