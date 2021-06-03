<template>
  <div class="edit-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
export default {
  name: 'EditGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onConfirm () {
      //
    }
  }
}
</script>

<style scoped lang="less">

</style>
