<template>
  <div class="suggestion-container">
    <van-cell v-for="(str, index) in this.suggestions"
              icon="search"
              :key="index" @click="$emit('search', str)">
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [],
      htmlStr: ''
    }
  },
  computed: {},
  watch: {
    // 属性名：要监视的数据名称
    // searchText () {
    //   console.log('dddddddd')
    // }
    searchText: {
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      // async handler () {
      //   const { data } = await getSearchSuggestions(this.searchText)
      //   this.suggestions = data.data.options
      // },
      immediate: true // 初始化就调用1次
    }
  },
  created () {},
  mounted () {},
  methods: {
    highlight (str) {
      return str.replace(RegExp(this.searchText, 'gi'),
        `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped lang="less">

</style>
