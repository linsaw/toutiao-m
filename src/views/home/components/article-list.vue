<template>
  <div class="article-list">
    <van-pull-refresh v-model="isRefreshLoading"
                      @refresh="onRefresh"
                      :success-text="refreshSuccessText"
                      :success-duration="1000">
      <van-list
        ref="article-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-list-cell v-for="(article, index) in articles"
                           :key="index"
                           :article="article"/>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticlesList } from '@/api/article'
import ArticleListCell from '@/components/article-list-cell'
import { debounce } from 'lodash'

export default {
  name: 'ArticleList',
  components: {
    ArticleListCell
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的 loading 状态
      refreshSuccessText: '更新成功', // 下拉刷新成功的提示文本
      scrollTop: 0 // 列表滚动到顶部的距离
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  deactivated () {
    console.log('组件失去活动了')
  },
  methods: {
    async onLoad () {
      const { data } = await getArticlesList({
        channel_id: this.channel.id,
        timestamp: self.timestamp || Date.now(),
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 取出结果来使用
      const { results } = data.data
      this.articles.push(...results)

      // 加载状态结束
      this.loading = false

      // 判断数据加载完成
      if (results.length) {
        // 获取下一页的时间戳
        this.timestamp = data.data.pre_timestamp
      } else {
        // 否则数据加载完成
        this.finished = true
      }
    },
    // 下来刷新
    async onRefresh () {
      const { data } = await getArticlesList({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 取出结果来使用
      const { results } = data.data
      this.articles.unshift(...results)
      // 结束刷新状态
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
