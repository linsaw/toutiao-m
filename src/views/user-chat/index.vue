<template>
  <div class="chat-container">
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"/>
    <!-- 消息列表 -->
    <van-cell-group class="message-list" ref="message-list">
      <van-cell v-for="(item, index) in messages"
                :key="index"
                :title="item.msg"/>
    </van-cell-group>
    <!-- 输入框 -->
    <van-cell-group class="bottom-bar">
      <van-field
        v-model="message"
        placeholder="输入内容"
        :border="false"/>
      <van-button
        class="send-btn"
        type="primary"
        size="small"
        @click="onSend"
      >发送</van-button>
    </van-cell-group>
  </div>
</template>

<script>
// import io from 'socket.io-client'
import { setStorageItem, getStorageItem } from '@/utils/storage'

export default {
  name: 'UserChatIndex',
  components: {},
  props: {},
  data () {
    return {
      message: '',
      messages: getStorageItem['chat-messages'] || [],
      // messages: [
      //   {
      //     msg: '11大范德萨发111'
      //   },
      //   {
      //     msg: 'sdafsdfa 大风说的'
      //   },
      //   {
      //     msg: '3333的说法定时发送33'
      //   },
      //   {
      //     msg: '444阿水大的的事发地时444'
      //   },
      //   {
      //     msg: '555的说法的说法是打发55'
      //   },
      //   {
      //     msg: '阿斯蒂芬阿道夫666666'
      //   },
      //   {
      //     msg: '77手动阀7777'
      //   },
      //   {
      //     msg: '111发送到11'
      //   },
      //   {
      //     msg: '111是打发斯蒂芬11'
      //   },
      //   {
      //     msg: '1是打发第三方1111'
      //   },
      //   {
      //     msg: '阿斯蒂芬阿道夫666666'
      //   },
      //   {
      //     msg: '77手动阀7777'
      //   },
      //   {
      //     msg: '111发送到11'
      //   },
      //   {
      //     msg: '111是打发斯蒂芬11'
      //   },
      //   {
      //     msg: '1是打发第三方1111'
      //   },
      //   {
      //     msg: '阿斯蒂芬阿道夫666666'
      //   },
      //   {
      //     msg: '77手动阀7777'
      //   },
      //   {
      //     msg: '111发送到11'
      //   },
      //   {
      //     msg: '111是打发斯蒂芬11'
      //   },
      //   {
      //     msg: '1是打发第三方1111'
      //   },
      //   {
      //     msg: '阿斯蒂芬阿道夫666666'
      //   },
      //   {
      //     msg: '77手动阀7777'
      //   },
      //   {
      //     msg: '111发送到11'
      //   },
      //   {
      //     msg: '111是打发斯蒂芬11'
      //   },
      //   {
      //     msg: '1是打发第三方1111'
      //   },
      //   {
      //     msg: '阿斯蒂芬阿道夫666666'
      //   },
      //   {
      //     msg: '77手动阀7777'
      //   },
      //   {
      //     msg: '111发送到11'
      //   },
      //   {
      //     msg: '111是打发斯蒂芬11'
      //   },
      //   {
      //     msg: '1是打发第三方1111'
      //   }
      // ],
      socket: null
    }
  },
  computed: {},
  watch: {
    messages () {
      setStorageItem('chat-messages', this.messages)
      // 如果要操作数据之后吉利影响视图DOM，最后吧代码放在 nextTick 函数中
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created () {
    // 建立连接
    // const socket = io('http://ttapi.research.itcast.cn')
    // this.socket = socket
    // socket.on('connect', () => {
    //   console.log('连接成功')
    // })
    // socket.on('disconnect', () => {
    //   console.log('连接断开')
    // })
    // socket.on('message', data => {
    //   this.messages.push(data)
    // })
  },
  mounted () {},
  methods: {
    onSend () {
      // 发送消息
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      // this.socket.emit('message', data)
      this.messages.push(data)
      this.message = ''
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
.chat-container {
  .message-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
  }
  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 0 14px;
    align-items: center;
    .send-btn {
      width: 60px;
    }
  }
}
</style>
