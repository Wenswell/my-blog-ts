import { createVNode, render } from 'vue'
import AppearVue from './Message.vue'

export default {
  open(message: string) {
    console.log('AppearVue', AppearVue)
    // 创建 AppearVue 组件的 vnode
    const vnode = createVNode(AppearVue, {
      message,
    })

    // 创建容器元素
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(vnode, container)
  },
}
