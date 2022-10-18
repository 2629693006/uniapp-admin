const serve = 'http://127.0.0.1:3001'
const v1 = serve + '/admin/'
module.exports = {
    BASE_API_DEFAULT: serve,
    // 登录
    BASE_API_LOGIN: v1 + 'login',
    // 退出
    BASE_API_BACK: v1 + 'back',
    // 用户信息
    BASE_API_USER_LIST: v1 + 'user',
    // 删除用户
    BASE_API_USER_DEL: v1 + 'del',
    // 修改用户数据
    BASE_API_USER_EDIT: v1 + 'user/edit',
    // 添加用户
    BASE_API_ADD_USER: v1 + 'user/add',
    // 添加商品
    BASE_API_GOODS_ADD: v1 + 'goods/add',
    // 获取商品数据
    BASE_API_GOODS_INFO: v1 + 'goods/info',
    // 提交修改商品数据
    BASE_API_GOODS_EDIT: v1 + 'goods/edit',
    // 下架商品
    BASE_API_GOODS_LOWER: v1 + 'goods/lower',
    // 删除商品
    BASE_API_GOODS_DEL: v1 + 'goods/remove',
    // 获取商品数据
    BASE_API_GOODS_LIST: v1 + 'goods/list',
    // 添加分类
    BASE_API_GOODS_CATE_ADD: v1 + 'cate/add',
    // 添加二级分类
    BASE_API_ER_CATE_ADD: v1 + 'cate/er/add',
    // 获取分类
    BASE_API_GOODS_CATE_LIST: v1 + '/cate/list',
    // 删除一级分类
    BASE_API_GOODS_CATE_DEL: v1 + 'cate/remove',
    // 删除二级分类
    BASE_API_ER_CATE_DEL: v1 + 'er/cate/remove',
    // 修改分类
    BASE_API_GOODS_CATE_EDIT: v1 + 'cate/edit',
    // 修改二级分类
    BASE_API_ER_CATE_EDIT: v1 + 'er/cate/edit',
    // 搜索商品
    BASE_API_GOODS_SEARCH: v1 + 'goods/search',
    // 添加焦点图
    BASE_API_SWI_ADD: v1 + 'swi/add',
    // 获取轮播图数据
    BASE_API_SWI_LIST: v1 + 'swi/list',
    // 获取编辑焦点图数据
    BASE_API_SWI_INFO: v1 + 'swi/info',
    // 编辑焦点图数据
    BASE_API_SWI_EDIT: v1 + 'swi/edit',
    // 删除轮播图
    BASE_API_SWI_DEL: v1 + 'swi/remove',
    // 获取订单数据
    BASE_API_ORDER_LIST: v1 + 'order/list',
    // 删除订单数据
    BASE_API_ORDER_DEL: v1 + 'order/remove',
    // 获取订单详情信息
    BASE_API_ORDER_KEY_INFO: v1 + 'order/info',
    // 进行发货
    BASE_API_ORDER_DELIVER: v1 + 'order/deliver',
    // 搜索订单
    BASE_API_ORDER_SEARCH: v1 + 'order/search',
    // 获取商品信息提供给焦点图进行商品关联
    BASE_API_RELATION_GOODS_LIST: v1 + 'relation/goods/list',
    // 进行焦点图和商品进行关联
    BASE_API_RELATION_GOODS_KEY: v1 + 'relation/goods',





    // 单个文件上传
    BASE_API_GOODS_IMG_SMALL_UPLOAD: v1 + 'upload',
    // 多个文件上传
    BASE_API_GOODS_IMG_MOER_UPLOAD: v1 + 'upload/moer'
}