<template>
  <div class="search-container">
    <form action="/">
      <van-search v-model="searchText"
                  placeholder="请输入搜索关键词"
                  show-action
                  @search="onSearch(searchText)"
                  @cancel="$router.back()"
                  @focus="isResultShow = false">
      </van-search>
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow"
                   :search-text="searchText" />
    <!-- 搜索联想建议 -->
    <search-suggestion v-else-if="searchText.length"
                       :search-text="searchText"
                       @search="onSearch"/>
    <!-- 搜索历史 -->
    <search-history v-else
                    :search-histories="searchHistories"
                    @search="onSearch"
                    @empty-histories="searchHistories = $event"/>
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setStorageItem, getStorageItem } from '@/utils/storage'
import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false, // 搜索结果显示
      searchHistories: []
    }
  },
  computed: {
    ...mapState(['userToken'])
  },
  watch: {
    // 监视搜索历史变化
    searchHistories () {
      setStorageItem('search-histories', this.searchHistories)
    }
  },
  created () {
    this.loadSearchHistories()
  },
  mounted () {},
  methods: {
    onSearch (searchText) {
      this.searchText = searchText
      // 记录搜索记录
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(searchText)
      // 搜索记录存本地
      // setStorageItem('search-histories', this.searchHistories)
      // 展示搜索结果
      this.isResultShow = true
    },
    async loadSearchHistories () {
      let histories = getStorageItem('search-histories') || []
      if (this.userToken) {
        const { data } = getSearchHistories()
        histories = [...new Set([...histories, ...data.data.keywords])]
      }
      this.searchHistories = histories
    }
  }
}
</script>

<style scoped lang="less">

</style>
