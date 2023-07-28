<template>
  <!-- 使用 teleport 避免层叠上下文问题 -->
  <teleport to="body">
    <!-- 使用 transition-group 为每个消息添加动画 -->
    <transition-group name="message">
      <message
        v-for="item in messages"
        :key="item.id"
        v-bind="item"
        @close="handleClose"
      />
    </transition-group>
  </teleport>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, render, createVNode } from 'vue'
import Message from './Message.vue'

// 消息项接口
interface MessageItem {
  id: number
  content: string
  duration?: number
  visible: boolean
  zIndex: number
}

// 消息列表
const messages = ref<MessageItem[]>([])

let messageVm: any // Message 组件实例

// 显示消息方法
function add(options: {
  content: string
  duration?: number
  singleton?: boolean
}) {
  if (options.singleton && messages.value.length > 0) return

  // 构造新的消息数据
  const newMessage = {
    ...options,
    visible: true,
    id: Date.now(),
    zIndex: 2000 + messages.value.length,
  }

  // 添加到列表
  messages.value.push(newMessage)

  // 显示下一条消息
  showNext()
}
// MessageContainer

// 显示下一条消息
function showNext() {
  if (!messageVm && messages.value.length > 0) {
    const { content, duration = 3000 } = messages.value[0]

    // 创建容器元素
    const div = document.createElement('div')
    document.body.appendChild(div)

    // 渲染 Message 组件
    messageVm = createVNode(Message, {
      content,
      duration,
      onClose: () => {
        // 关闭时移除消息并显示下一条
        messages.value.shift()
        showNext()
      },
    })

    render(messageVm, div)
  }
}

// 处理消息关闭
function handleClose(id: number) {
  const index = messages.value.findIndex((m) => m.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

onMounted(showNext) // 初始化显示第一条消息

onUnmounted(() => {
  // 卸载时销毁 Message 组件
  messageVm && render(null, messageVm.el)
})

export default {
  messages,
  data: function () {
    return {
      messages,
    }
  },
  methods: {
    handleClose,
    info(content: any) {
      add({
        content,
      })
    },
    success(content: any) {
      add({
        content,
      })
    },
    warning(content: any) {
      add({
        content,
      })
    },
    error(content: any) {
      add({
        content,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
