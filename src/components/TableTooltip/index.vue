<template>
  <span @mouseenter="handleMouseEnter($event)">
    <el-tooltip
      :disabled="showTooltip"
      :content="content"
      :open-delay = "666"
      placement="top">
      <span>{{ content }}</span>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  name: 'TableTooltip',
  props: {
    content: [String, Number]
  },

  data () {
    return {
      // 是否显示Tooltip内容
      showTooltip: false
    }
  },

  methods: {
    /*
    * 鼠标移入的时候判断内容长度是否超出DOM的长度
    * 超出长度则将showTooltip设为true
    * */
    handleMouseEnter (event) {
      const cell = event.target.querySelector('.el-tooltip')
      this.showTooltip = cell.offsetParent.scrollWidth > cell.offsetWidth
    }
  }
}
</script>
