<template>
  <div class="article-container">
    <van-nav-bar class="app-nav-bar"
                 title="文章详情"
                 left-arrow
                 @click-left="$router.back()">
    </van-nav-bar>
    <div class="article-wrap">
      <h1 class="title">{{article.title}}</h1>
      <van-cell class="user-info" center>
        <div slot="title" class="name">{{article.aut_name}}</div>
        <van-image slot="icon"
                   class="avatar"
                   fit="cover"
                   round
                   :src="article.aut_photo">
        </van-image>
        <div slot="label" class="time">{{article.pubdate | relativeTime}}</div>
        <van-button class="follow-btn"
                    round
                    :type="article.is_followed ? 'default' : 'info'"
                    :icon="article.is_followed ? '' : 'plus'"
                    size="small"
                    :loading="followLoading"
                    @click="onFollow">
          {{article.is_followed ? '已关注' : '关注'}}
        </van-button>
      </van-cell>
      <div class="markdown-body"
           v-html="article.content"
           ref="article-content">
      </div>
    </div>
    <div class="article-bottom">
      <van-button class="comment-btn"
                  type="default"
                  round
                  size="small"
      >写评论</van-button>
      <van-icon name="comment-o" info="123" color="#777"/>
      <van-icon :name="article.is_collected ? 'star' : 'star-o'"
                :color="article.is_collected ? 'orange' : '#777'"
                @click="onCollect"/>
      <van-icon name="good-job-o" color="#777"/>
      <van-icon name="share" color="#777"/>
    </div>
  </div>
</template>

<script>
// 组件中获取动态路由参数
// this.$route.params.xxx
// props 传参（推荐）
import './github-markdown.css'
import { getArticleDetail, addCollect, deleteCollect } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},
      followLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticleDetail()
  },
  mounted () {},
  methods: {
    async loadArticleDetail () {
      const { data } = await getArticleDetail(this.articleId)
      this.article = data.data
      // 数据改变影响视图更新，不是立即的，
      // 如果需要在修改数据之后，马上操作视图DOM，需要将代码放在$nextTick中
      // 获取文章内容DOM容器
      this.$nextTick(() => {
        this.perviewImages()
      })
    },
    perviewImages () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index,
            loop: false
          })
        }
      })
    },
    async onFollow () {
      // 开启按钮的 loading 状态
      this.followLoading = true
      try {
        // 如果已关注，则取消关注
        const authorId = this.article.aut_id
        if (this.article.is_followed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }
        // 更新视图
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
      // 关闭按钮的 loading 状态
      this.followLoading = false
    },
    async onCollect () {
      this.$toast.loading('操作中...')
      try {
        const authorId = this.articleId
        if (this.article.is_collected) {
          await addCollect(authorId)
        } else {
          await deleteCollect(authorId)
        }
        this.article.is_collected = !this.article.is_collected
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .article-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
    .title {
      font-size: 20px;
      color: #3a3a3a;
      padding: 14px;
      background-color: #fff;
      margin: 0;
    }
    .user-info {
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .name {
        font-size: 12px;
        color: #333333;
      }
      .time {
        font-size: 10px;
        color: #b4b4b4;
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }
    .markdown-body {
      padding: 14px;
      background-color: white;
    }
  }
  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 11px;
        background-color: #e22829;
      }
    }
  }
}
</style>
