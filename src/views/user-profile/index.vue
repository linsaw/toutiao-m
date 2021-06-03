<template>
  <div class="user-prifile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <van-cell title="头像" is-link>
      <van-image width="30"
                 height="30"
                 round
                 fit="cover"
                 :src="user.photo"/>
    </van-cell>
    <van-cell title="昵称"
              is-link
              :value="user.name"
              @click="isEditNameShow=true">
    </van-cell>
    <van-cell title="性别"
              is-link
              :value="user.gender === 0 ? '男' : '女'"
              @click="isEditGenderShow=true">
    </van-cell>
    <van-cell title="生日"
              is-link
              :value="user.birthday">
    </van-cell>

    <van-popup v-model="isEditNameShow"
               position="bottom"
               :style="{ height: '100%' }">
      <!-- 当传递给子组件的数据既需要使用又需要修改的时候，可以使用v-model简写 -->
      <!-- :name="user.name"
        @update-name="user.name=$event" -->
      <!-- 上面的可以写成 v-model="user.name"
          默认传一个名字叫做 value 的数据 :value="user.name"
          默认监听 input 事件 @input="user.name=$event" -->
      <!-- 如果有多个属性需要保持同步，使用 .sync 修饰符
           :gender.sync="user.gender"
              :gender="user.gender"
              -->
      <edit-name
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow=false"/>
    </van-popup>

    <van-popup v-model="isEditGenderShow"
               position="bottom">
      <edit-gender
        v-model="user.gender"
        @close="isEditGenderShow=false"/>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import EditName from './components/edit-name'
import EditGender from './components/edit-gender'

export default {
  name: 'UserProfile',
  components: {
    EditName,
    EditGender
  },
  props: {},
  data () {
    return {
      user: {},
      isEditNameShow: false,
      isEditGenderShow: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    }
  }
}
</script>

<style scoped lang="less">
.van-popup {
  background-color: #f5f7f9;
}
</style>
