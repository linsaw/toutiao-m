<template>
  <div class="result-container">
    <van-list v-model="loading"
              :finished="finished"
              finished-text="一滴也没有了"
              @load="onLoad">
      <van-cell v-for="(article, index) in list"
               :key="index"
               :title="article.title"></van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      const { data } = await getSearchResult({
        page: this.page,
        per_page: this.per_page,
        q: this.searchText
      })

      const { results } = data.data
      this.list.push(...results)

      this.loading = false
      //
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.result-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
}
</style>
