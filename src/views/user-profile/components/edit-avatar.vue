<template>
  <div class="edit-avatat">
    <div class="image-preview">
      <img class="image" :src="image" alt="" ref="image">
    </div>
    <van-nav-bar
      class="bottom-nav"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"/>
  </div>
</template>

<script>
import { editUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'EditAvatar',
  components: {},
  props: {
    file: {
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          resolve(blob)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // // 如果要求Content-Type 是 multipart/form-data 一定要提交FormDate
      // const fd = new FormData()
      // fd.append('photo', this.file)
      const { data } = await editUserPhoto(fd)
      console.log(data)
      //
      this.$toast.success('保存成功')
      //
      // this.$emit('update-avatar', this.image)
      this.$emit('update-avatar', window.URL.createObjectURL(file))
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.edit-avatat {
  .image {
    display: block;
    max-width: 100%;
  }
  .bottom-nav {
    background-color: black;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
