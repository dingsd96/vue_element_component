<template>
  <span @mouseenter="handleMouseEnter($event)">
    <el-tooltip
      :disabled="showTooltip"
      :content="content+''"
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
    /*
    * 设置格式为数字或字符串类型
    * 但al-tooltip只接收字符串
    * 我能怎么办
    * 我也很无奈呀
    * 还是要在赋值的时候强行变成字符串╮(╯﹏╰）╭
    * 但为什么我这里还要设置接收两种类型的值呢
    * ‘抬头一片苍茫月，是我生生不死心’
    * 对
    * 就是我不死心
    * */
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
