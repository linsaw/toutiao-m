<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 输入框 -->
    <!-- 使用van-form组件包裹表单项 -->
    <van-form @submit="onlogin"
              ref="login-form"
              :show-error="false"
              :show-error-message="false"
              validate
              @failed="onRulesFailed">
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        center
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down v-if="isCountDownShow"
                          :time="1000 * 60"
                          format="ss s"
                          @finish="isCountDownShow = false"></van-count-down>
          <van-button v-else
                      class="send-btn"
                      size="small"
                      round
                      :loading="isSendSmsCodeLoading"
                      @click.prevent="onSendSmsCode">获取验证码
          </van-button>
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button class="login-btn"
                    type="info"
                    block>登录
        </van-button>
      </div>
    </van-form>
    <div>
      <p>账号：13911111111 13922222222</p>
      <p>验证码：246810</p>
    </div>
  </div>
</template>

<script>
import { login, sendSmsCode } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isSendSmsCodeLoading: false,
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 表单校验失败
    onRulesFailed (error) {
      console.log(error)
      if (error.errors[0]) {
        this.$toast(error.errors[0].message)
      }
    },
    // 获取验证码
    async onSendSmsCode () {
      try {
        // 校验手机号
        await this.$refs['login-form'].validate('mobile')
        // 验证手机号通过，请求验证码
        this.isSendSmsCodeLoading = true
        await sendSmsCode(this.user.mobile)
        // 显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 短信发送失败
          message = '发送太频繁了，请稍后再试'
        } else if (err.name === 'mobile') {
          // 表单验证失败
          message = err.message
        } else {
          message = '发送失败，请稍后再试'
        }
        // try里面的任何代码错误都会进入catch
        // 不同的错误需要不同的提示，需要进行判断
        this.$toast(message)
      }
      this.isSendSmsCodeLoading = false
    },
    // 登录
    async onlogin () {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await login(this.user)
        this.$toast.success('登录成功')
        // 存储用户登录Token
        this.$store.commit('setUserToken', data.data)
        // 清除layout的缓存，重新渲染页面
        this.$store.commit('removeCachePage', 'LayoutIndex')
        // 跳转页面
        // this.$router.back()
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        console.log(err)
        this.$toast.success('登录失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 80px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
