<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar" safe-area-inset-top>
      <van-button class="search-btn"
                  slot="title"
                  icon="search"
                  type="info"
                  round size="small"
                  to="/search">搜索
      </van-button>
    </van-nav-bar>
    <!-- 频道tab标签栏 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab class="tab-item"
               v-for="channel in channels"
               :key="channel.id"
               :title="channel.name">
        <!-- 文章列表页 -->
        <article-list :channel="channel"></article-list>
      </van-tab>
      <!-- 右侧图标 -->
      <div class="wap-nav-wrap"
           slot="nav-right"
           @click="isChannelEditShow = true">
        <van-icon name="wap-nav"></van-icon>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出页面 -->
    <van-popup class="channel-edit-popup"
               v-model="isChannelEditShow"
               closeable
               safe-area-inset-bottom
               close-icon-position="top-left"
               position="bottom"
               get-container="body"
               style="height: 100%">
      <!-- 频道编辑页面 -->
      <channel-edit :userChannels="channels"
                    :currentActive="active"
                    @popup-close="isChannelEditShow = false"
                    @switch-active="onSwitchTab"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getStorageItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [],
      list: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['userToken'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    // 获取用户的频道列表
    async loadChannels () {
      let channels = []
      if (this.userToken) { // 登录获取线上频道
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else { // 未登录获取本地游客频道
        // 判断是否有游客数据
        const localChannels = getStorageItem('user-channels')
        if (localChannels) {
          channels = localChannels
        } else {
          // 获取默认推荐列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    },
    // 切换频道（也可以直接写 @switch-active="active = $event"）
    onSwitchTab (index) {
      this.active = index
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button_text {
      font-size: 14px;
    }
  }

  .channel-tabs {
    margin-right: 33px; // 设置边距，让右侧展开按钮不会挡住tab表桥
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 20px;
      height: 3px;
      background: #3296fa;
      bottom: 20px;
    }
  }

  .wap-nav-wrap {
    position: fixed;
    right: 0;
    height: 44px;
    width: 33px;
    background-color: #fff;
    opacity: .9;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon {
      font-size: 24px;
    }
    &:before {
      content: '';
      width: 1px;
      height: 29px;
      background-color: #edeff3;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
