<template>
  <div class="e-charts-wrapper">
    <div ref="eCharts1" class="charts-content"></div>
    <el-button @click="currentChartsClick">{{ worldCharts ? '世界' : '中国' }}</el-button>
  </div>
</template>

<script>
import ECharts from 'echarts'
import 'echarts/map/js/world.js'
import 'echarts/map/js/china.js'
export default {
  name: 'index',
  data () {
    return {
      worldCharts: true,
      chart1: {}
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.chart1 = ECharts.init(this.$refs['eCharts1'])
      this.setOptions2()
    },

    setOptions1 () {
      let value3 = [
        {name: '美国', value: 87},
        {name: '中国', value: 38},
        {name: '英国', value: 40},
        {name: '瑞士', value: 21},
        {name: '秘鲁', value: 21},
        {name: '德国', value: 15},
        {name: '意大利', value: 13},
        {name: '澳大利亚', value: 11},
        {name: '玻利维亚', value: 11},
        {name: '西班牙', value: 9},
        {name: '印度', value: 7},
        {name: '日本', value: 7},
        {name: '阿根廷', value: 6},
        {name: '荷兰', value: 6},
        {name: '法国', value: 5},
        {name: '土耳其', value: 4},
        {name: '以色列', value: 4},
        {name: '比利时', value: 4},
        {name: '吉尔吉斯斯坦', value: 4},
        {name: '墨西哥', value: 4},
        {name: '哥斯达黎加', value: 3},
        {name: '奥地利', value: 3},
        {name: '瑞典', value: 3},
        {name: '丹麦', value: 3},
        {name: '尼加拉瓜', value: 2},
        {name: '芬兰', value: 2},
        {name: '尼日利亚', value: 2},
        {name: '捷克共和国', value: 2},
        {name: '韩国', value: 2},
        {name: '挪威', value: 2},
        {name: '新加坡', value: 2},
        {name: '新西兰', value: 1},
        {name: '科威特', value: 1},
        {name: '塞尔维亚', value: 1},
        {name: '尼泊尔', value: 1},
        {name: '菲律宾', value: 1},
        {name: '葡萄牙', value: 1},
        {name: '希腊', value: 1},
        {name: '巴基斯坦', value: 1},
        {name: '古巴', value: 1},
        {name: '巴西', value: 1},
        {name: '冰岛', value: 1},
        {name: '埃及', value: 1},
        {name: '乌兹别克斯坦', value: 1},
        {name: '约旦', value: 1},
        {name: '波兰', value: 1},
        {name: '哥伦比亚', value: 1},
        {name: '萨尔瓦多', value: 1},
        {name: '塞浦路斯', value: 1},
        {name: '俄罗斯', value: 1},
        {name: '沙特阿拉伯', value: 1},
        {name: '坦桑尼亚', value: 1}
      ]
      let nameMap = {
        'Afghanistan': '阿富汗',
        'Singapore': '新加坡',
        'Angola': '安哥拉',
        'Albania': '阿尔巴尼亚',
        'United Arab Emirates': '阿联酋',
        'Argentina': '阿根廷',
        'Armenia': '亚美尼亚',
        'French Southern and Antarctic Lands': '法属南半球和南极领地',
        'Australia': '澳大利亚',
        'Austria': '奥地利',
        'Azerbaijan': '阿塞拜疆',
        'Burundi': '布隆迪',
        'Belgium': '比利时',
        'Benin': '贝宁',
        'Burkina Faso': '布基纳法索',
        'Bangladesh': '孟加拉国',
        'Bulgaria': '保加利亚',
        'The Bahamas': '巴哈马',
        'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那',
        'Belarus': '白俄罗斯',
        'Belize': '伯利兹',
        'Bermuda': '百慕大',
        'Bolivia': '玻利维亚',
        'Brazil': '巴西',
        'Brunei': '文莱',
        'Bhutan': '不丹',
        'Botswana': '博茨瓦纳',
        'Central African Republic': '中非共和国',
        'Canada': '加拿大',
        'Switzerland': '瑞士',
        'Chile': '智利',
        'China': '中国',
        'Ivory Coast': '象牙海岸',
        'Cameroon': '喀麦隆',
        'Democratic Republic of the Congo': '刚果民主共和国',
        'Republic of the Congo': '刚果共和国',
        'Colombia': '哥伦比亚',
        'Costa Rica': '哥斯达黎加',
        'Cuba': '古巴',
        'Northern Cyprus': '北塞浦路斯',
        'Cyprus': '塞浦路斯',
        'Czech Republic': '捷克共和国',
        'Germany': '德国',
        'Djibouti': '吉布提',
        'Denmark': '丹麦',
        'Dominican Republic': '多明尼加共和国',
        'Algeria': '阿尔及利亚',
        'Ecuador': '厄瓜多尔',
        'Egypt': '埃及',
        'Eritrea': '厄立特里亚',
        'Spain': '西班牙',
        'Estonia': '爱沙尼亚',
        'Ethiopia': '埃塞俄比亚',
        'Finland': '芬兰',
        'Fiji': '斐',
        'Falkland Islands': '福克兰群岛',
        'France': '法国',
        'Gabon': '加蓬',
        'United Kingdom': '英国',
        'Georgia': '格鲁吉亚',
        'Ghana': '加纳',
        'Guinea': '几内亚',
        'Gambia': '冈比亚',
        'Guinea Bissau': '几内亚比绍',
        'Equatorial Guinea': '赤道几内亚',
        'Greece': '希腊',
        'Greenland': '格陵兰',
        'Guatemala': '危地马拉',
        'French Guiana': '法属圭亚那',
        'Guyana': '圭亚那',
        'Honduras': '洪都拉斯',
        'Croatia': '克罗地亚',
        'Haiti': '海地',
        'Hungary': '匈牙利',
        'Indonesia': '印尼',
        'India': '印度',
        'Ireland': '爱尔兰',
        'Iran': '伊朗',
        'Iraq': '伊拉克',
        'Iceland': '冰岛',
        'Israel': '以色列',
        'Italy': '意大利',
        'Jamaica': '牙买加',
        'Jordan': '约旦',
        'Japan': '日本',
        'Kazakhstan': '哈萨克斯坦',
        'Kenya': '肯尼亚',
        'Kyrgyzstan': '吉尔吉斯斯坦',
        'Cambodia': '柬埔寨',
        'South Korea': '韩国',
        'Kosovo': '科索沃',
        'Kuwait': '科威特',
        'Laos': '老挝',
        'Lebanon': '黎巴嫩',
        'Liberia': '利比里亚',
        'Libya': '利比亚',
        'Sri Lanka': '斯里兰卡',
        'Lesotho': '莱索托',
        'Lithuania': '立陶宛',
        'Luxembourg': '卢森堡',
        'Latvia': '拉脱维亚',
        'Morocco': '摩洛哥',
        'Moldova': '摩尔多瓦',
        'Madagascar': '马达加斯加',
        'Mexico': '墨西哥',
        'Macedonia': '马其顿',
        'Mali': '马里',
        'Myanmar': '缅甸',
        'Montenegro': '黑山',
        'Mongolia': '蒙古',
        'Mozambique': '莫桑比克',
        'Mauritania': '毛里塔尼亚',
        'Malawi': '马拉维',
        'Malaysia': '马来西亚',
        'Namibia': '纳米比亚',
        'New Caledonia': '新喀里多尼亚',
        'Niger': '尼日尔',
        'Nigeria': '尼日利亚',
        'Nicaragua': '尼加拉瓜',
        'Netherlands': '荷兰',
        'Norway': '挪威',
        'Nepal': '尼泊尔',
        'New Zealand': '新西兰',
        'Oman': '阿曼',
        'Pakistan': '巴基斯坦',
        'Panama': '巴拿马',
        'Peru': '秘鲁',
        'Philippines': '菲律宾',
        'Papua New Guinea': '巴布亚新几内亚',
        'Poland': '波兰',
        'Puerto Rico': '波多黎各',
        'North Korea': '北朝鲜',
        'Portugal': '葡萄牙',
        'Paraguay': '巴拉圭',
        'Qatar': '卡塔尔',
        'Romania': '罗马尼亚',
        'Russia': '俄罗斯',
        'Rwanda': '卢旺达',
        'Western Sahara': '西撒哈拉',
        'Saudi Arabia': '沙特阿拉伯',
        'Sudan': '苏丹',
        'South Sudan': '南苏丹',
        'Senegal': '塞内加尔',
        'Solomon Islands': '所罗门群岛',
        'Sierra Leone': '塞拉利昂',
        'El Salvador': '萨尔瓦多',
        'Somaliland': '索马里兰',
        'Somalia': '索马里',
        'Republic of Serbia': '塞尔维亚',
        'Suriname': '苏里南',
        'Slovakia': '斯洛伐克',
        'Slovenia': '斯洛文尼亚',
        'Sweden': '瑞典',
        'Swaziland': '斯威士兰',
        'Syria': '叙利亚',
        'Chad': '乍得',
        'Togo': '多哥',
        'Thailand': '泰国',
        'Tajikistan': '塔吉克斯坦',
        'Turkmenistan': '土库曼斯坦',
        'East Timor': '东帝汶',
        'Trinidad and Tobago': '特里尼达和多巴哥',
        'Tunisia': '突尼斯',
        'Turkey': '土耳其',
        'United Republic of Tanzania': '坦桑尼亚',
        'Uganda': '乌干达',
        'Ukraine': '乌克兰',
        'Uruguay': '乌拉圭',
        'United States of America': '美国',
        'Uzbekistan': '乌兹别克斯坦',
        'Venezuela': '委内瑞拉',
        'Vietnam': '越南',
        'Vanuatu': '瓦努阿图',
        'West Bank': '西岸',
        'Yemen': '也门',
        'South Africa': '南非',
        'Zambia': '赞比亚',
        'Zimbabwe': '津巴布韦'
      }
      let option = {
        timeline: {
          axisType: 'category',
          orient: 'vertical',
          autoPlay: true,
          inverse: true,
          playInterval: 5000,
          left: null,
          right: -105,
          top: 20,
          bottom: 20,
          width: 46,
          data: ['2016']
        },
        baseOption: {
          visualMap: {
            max: 100,
            calculable: true,
            inRange: {
              color: ['#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
          },
          series: [{
            type: 'map',
            map: 'world',
            roam: true,
            nameMap: nameMap
          }]
        },
        options: [{
          title: {
            text: 'SCI国家数据频率',
            subtext: '世界分布图',
            left: 'center',
            top: 'top'
          },
          series: {
            data: value3
          }
        } ]
      }

      this.chart1.setOption(option)
      this.worldCharts = true
    },

    setOptions2 () {
      function randomData () {
        return Math.round(Math.random() * 100)
      }
      var data = [
        {name: '重庆市'},
        {name: '北京市'}
      ]
      var geoCoordMap = {
        '重庆市': [108.384366, 30.439702],
        '北京市': [116.4551, 40.2539]
      }

      var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'

      var dataFrom = '北京市'

      var convertData = function (data) {
        var res = []

        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name]

          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            })
          }
        }

        return res
      }

      var option = {
        title: {
          text: '中国大区分布图',
          subtext: '中国的八大区分布',
          itemGap: 30,
          left: 'center',
          textStyle: { // 主标题样式
            color: '#1a1b4e',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 30
          },

          subtextStyle: { // 副标题样式
            color: '#58d9df',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 16
          }
        },

        tooltip: {
          trigger: 'item'
        },

        visualMap: { // 左下角的那个
          min: 0,
          max: 100,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#ffffff', '#E0DAFF', '#ADBFFF', '#9CB4FF', '#6A9DFF', '#3889FF']
          }
        },
        toolbox: { // 最右侧那三个按钮
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: {
              readOnly: false
            },
            restore: {},
            saveAsImage: {}
          }
        },

        geo: {
          map: 'china',
          zoom: 1.2,
          label: { // 文字样式
            normal: { // 省份名字默认情况
              show: true,
              color: '#000000'
            },
            emphasis: { // 省份名字hover情况
              show: false,
              color: '#ffffff'
            }
          },
          roam: true,
          itemStyle: { // 填充样式
            normal: { // 默认
              areaColor: '#ffffff',
              borderColor: '#b9b4b7'
            },
            emphasis: { // 填充
              areaColor: '#05ff09'
            }
          }
        },
        series: [ // 关于线路
          {
            name: '北京-重庆',
            type: 'lines',
            zlevel: 2,
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              symbol: planePath,
              trailLength: 0,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: '#c60fff',
                width: 2, // 宽度
                opacity: 0.5, // 透明度
                curveness: 0.2 // 弧度
              }
            },
            data: data.map(function (dataItem) {
              return {
                fromName: dataFrom,
                toName: dataItem.name,
                coords: [ // 飞机的起始点和终点
                  geoCoordMap[dataFrom],
                  geoCoordMap[dataItem.name]
                ]
              }
            })
          },
          {
            name: '供需占比',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: 8, // 辐射的那个圈圈
            showEffectOn: 'render',
            rippleEffect: {
              scale: 5,
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#c60fff',
                shadowBlur: 20,
                shadowColor: '#333'
              }
            }
          },
          {
            type: 'map',
            mapType: 'china',
            geoIndex: 0,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: [
              {
                name: '北京',
                value: randomData()
              },
              {
                name: '重庆',
                value: randomData()
              }]
          }
        ]
      }

      this.chart1.setOption(option)

      this.worldCharts = false
    },

    currentChartsClick () {
      this.chart1.dispose()
      this.chart1 = ECharts.init(this.$refs['eCharts1'])
      this.worldCharts ? this.setOptions2() : this.setOptions1()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .e-charts-wrapper{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .charts-content{
      width: 100%;
      height: calc(100% - 50px);
    }
  }
</style>
