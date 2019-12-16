
import { request } from '@/utils'
import { requestURL } from '@/config'
export default {

    //     title 组件名
    // type  组件类型（组件真实类名）
    // can_place 组件是否可以包含子组件
    // children 组件的子组件，数组类型
    // is_native 组件是否是原生 html 元素
    // config  组件可用的配置信息
    // props 组件配置信息的值，包含样式和属性等
    namespace: 'app',

    state: {
        name: 'store',
        dom: {}
    },
    reducers: {
        CHANGELAYOUT (state, action) {
            return {
                ...state,
                dom: action.data
            }
        },
        GETBLOGS (state, action) {              //注意顺序，state在前面
            return {
                ...state,
                blogs: action.blogs
            }
        },
        DELETEBLOG (state, action) {
            return {
                ...state,

            }
        },
        USERLOGIN (state, action) {
            return {
                ...state,
                user: {
                    ...state.user,
                    isLogin: action.payload.isLogin,
                    email: action.payload.email
                }
            }
        },
        USERLOGOUT (state, action) {
            return {
                ...state,
                user: {
                    ...state.user,
                    isLogin: 0,
                    email: ''
                }
            }
        }
    },
    subscriptions: {

    },

    effects: {

        *getBlogs (action, { call, put }) {
            const response = yield call(request, action.payload, requestURL.blog);
            yield put({
                type: 'GETBLOGS',
                blogs: response.data,
            });
        },
        *changeLayout (action, { call, put }) {

        }
    },
};