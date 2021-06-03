<template>
  <div class="edit-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      left-arrow
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <div class="name-file-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'

export default {
  name: 'EditName',
  components: {},
  props: {
    // name: {
    //   type: String,
    //   required: true
    // }
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // localName: this.name
      localName: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        await editUserProfile({
          name: this.localName
        })
        // this.$emit('update-name', this.localName)
        this.$emit('input', this.localName)
        this.$emit('close')
        this.$toast.success('保存成功')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        } else {
          this.$toast.fail('保存失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.name-file-wrap {
  padding: 10px;
}
</style>
