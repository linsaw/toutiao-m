<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button type="danger"
                  plain round
                  size="mini"
                  @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item class="grid-item"
                     :class="{active: index === currentActive}"
                     :icon="(isEdit && index !== 0) ? 'clear' : ''"
                     v-for="(channel, index) in userChannels"
                     :key="channel.id"
                     :text="channel.name"
                     @click="onUserChannelClick(channel, index)"></van-grid-item>
    </van-grid>
    <van-cell center :border="false">
      <div slot="title" class="channel-title">推荐频道</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item class="grid-item"
                     v-for="channel in recommendChannels"
                     :key="channel.id"
                     :text="channel.name"
                     @click="onAddChannel(channel)"></van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setStorageItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    currentActive: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    ...mapState(['userToken']),
    // 推荐的频道
    recommendChannels () {
      // 所有 - 我的 = 剩下推荐
      return this.allChannels.filter(channel => {
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAddChannel (channel) {
      this.userChannels.push(channel)

      if (this.userToken) {
        // 如果登录了，数据存储线上
        await addUserChannel({
          channels: [
            { id: channel.id, seq: this.userChannels.length }
          ]
        })
      } else {
        // 否则存本地
        setStorageItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        this.deleteChannel(channel, index)
      } else {
        this.switchChannel(index)
      }
    },
    async deleteChannel (channel, index) {
      // 如果删除是当前激活频道之前的频道
      if (index <= this.currentActive) {
        // 更新激活频道
        this.$emit('switch-active', this.currentActive - 1)
      }
      this.userChannels.splice(index, 1)

      if (this.userToken) {
        // 如果登录了，数据存储线上
        await deleteUserChannel(channel.id)
      } else {
        // 否则存本地
        setStorageItem('user-channels', this.userChannels)
      }
    },
    switchChannel (index) {
      // 切换频道
      this.$emit('switch-active', index)
      // 关闭弹框
      this.$emit('popup-close')
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333333;
  }
  .grid-item {
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
