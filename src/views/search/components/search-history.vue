<template>
  <div class="history-container">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- prop数据如果是引用类型（数组、对象）可以修改，xxx.value = 'xxx'
        但是任何prop数据都不能重新赋值 xxx = xxx 让父组件自己修改 -->
        <span @click="$emit('empty-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else
                name="delete"
                @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell v-for="(str, index) in searchHistories"
              :key="index"
              :title="str" @click="onDelete(index)">
      <van-icon name="close" v-show="isDeleteShow"></van-icon>
    </van-cell>
  </div>
</template>

<script>
// import { setStorageItem } from '@/utils/storage'

export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onDelete (index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 删除本地搜索记录
        // setStorageItem('search-histories', this.searchHistories)
        // 删除服务器搜索记录
      } else {
        this.$emit('search', this.searchHistories[index])
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
