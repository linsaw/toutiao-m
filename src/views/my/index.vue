<template>
  <div class="my-container">
    <van-cell-group v-if="userToken" class="my-info">
      <van-cell class="base-info" :border="false" center>
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="user.photo"
        />
        <div class="nickname" slot="title">{{user.name}}</div>
        <van-button class="update-btn"
                    size="small"
                    round
                    to="/user/profile"
        >编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{user.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{user.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{user.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{user.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <div v-else class="not-login">
      <div @click="$router.push({
        name: 'login',
        query: {
          redirect: '/my'
        }
      })">
        <img class="mobile-icon" src="./mobile.png" alt="">
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="shoucang" text="收藏"/>
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="lishi" text="历史"/>
    </van-grid>
    <van-cell v-if="userToken" title="消息通知" is-link to="/"/>
    <van-cell class="mb-4" title="小智同学" is-link to="/user/chat"/>
    <van-cell v-if="userToken"
              class="logout-cell"
              title="退出登录"
              @click="onLogout"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {} // 当前用户信息
    }
  },
  computed: {
    ...mapState(['userToken'])
  },
  watch: {},
  created () {
    this.loadCurrentUser()
  },
  mounted () {},
  methods: {
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.user = data.data
    },

    onLogout () {
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => {
          // 清除token
          this.$store.commit('setUserToken', null)
        })
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .my-info {
    background: url("./banner.png");
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      background-color: unset;
      height: 115px;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
      }
      .nickname {
        margin-left: 11px;
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 16px;
        font-size: 10px;
        color: #666666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .not-login {
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile-icon {
      width: 66px;
      height: 66px;
    }
    .text {
      color: #fff;
      font-size: 14px;
    }
  }
  .nav-grid {
    /deep/ .nav-grid-item {
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
