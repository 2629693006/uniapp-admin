import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('@/views/main/login')
const Index = () =>
    import ('@/views/main/index')
const User = () =>
    import ('@/views/user/user_list')
const Goods = () =>
    import ('@/views/goods/goods')
const GoodsAdd = () =>
    import ('@/views/goods/goods_add')
const GoodsEdit = () =>
    import ('@/views/goods/goods_edit')
const Order = () =>
    import ('@/views/order/order')
const Cate = () =>
    import ('@/views/cate/cate')
const Swi = () =>
    import ('@/views/swi/swi')
const OrderInfo = () =>
    import ('@/views/order/order_info')
Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    {
        path: '/index',
        name: 'Index',
        component: Index,
        children: [
            { path: '/user', name: 'User', component: User },
            { path: '/goods', name: 'Goods', component: Goods },
            { path: '/goods_add', name: 'GoodsAdd', component: GoodsAdd },
            { path: '/goods_edit', name: 'GoodsEdit', component: GoodsEdit },
            { path: '/order', name: 'Order', component: Order },
            { path: '/order/info', name: 'OrderInfo', component: OrderInfo },
            { path: '/cate', name: 'Cate', component: Cate },
            { path: '/swi', name: 'Swi', component: Swi },
        ]
    },

]



const router = new VueRouter({
    routes
})

// 路由导航卫视拦截
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        return next()
    }
    // token值
    var token = window.sessionStorage.getItem('token')
    if (!token) {
        return next('/login')
    } else {
        next()
    }

})

// 防止路由冗余
var originPush = VueRouter.prototype.push
VueRouter.prototype.push = function path(location) {
    return originPush.call(this, location).catch(err => err)
}
export default router