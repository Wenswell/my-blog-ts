<template>
  <section class="charts-box">
    <div ref="echartCateg" class="chart"></div>
    <div ref="echartTag" class="chart"></div>
  </section>
</template>

<script setup lang="ts">
import { getCateg, getTag, ICategItem, ITagItem } from '@/api/index'
import { onMounted, ref } from 'vue'
import * as echarts from "echarts";
import router from '@/router';
type EChartsOption = echarts.EChartsOption
const echartCateg = ref<HTMLElement | null>(null)
const echartTag = ref<HTMLElement | null>(null)
const categList = ref<ICategItem[]>([])
const getCategTagList = async () => {
  const categRes = await getCateg()
  const tagRes = await getTag()
  categList.value = categRes.data
  tagList.value = tagRes.data
}
const tagList = ref<ITagItem[]>([])

import AdminStore from '@/store/index'
const Store = AdminStore()

const MODE = ref<string>(
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
)

const createCharts = (theme = MODE.value) => {
  const DataCateg = {
    legendData: <object[]>[],
    seriesData: <object[]>[],
  }
  const DataTag = {
    legendData: <object[]>[],
    seriesData: <object[]>[],
  }
  const links = <object[]>[]
  const blogName = 'blog'
  categList.value.forEach(t => {
    DataCateg.legendData.push({
      name: t.categoryName
    })
    DataCateg.seriesData.push({
      value: t.count,
      name: t.categoryName
    })
    links.push({
      source: t.categoryName,
      target: blogName,
      value: t.count
    })
  })
  tagList.value.forEach(t => {
    DataTag.legendData.push({
      name: t.tagName
    })
    DataTag.seriesData.push({
      value: t.count,
      name: t.tagName
    })
    links.push({
      source: blogName,
      target: t.tagName,
      value: t.count
    })
  })
  const optionCateg: EChartsOption = {
    title: {
      text: '文章分类统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a}「{b}」<br/> {c} 篇文章 ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: DataCateg.legendData
    },
    series: [
      {
        name: '分类',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: DataCateg.seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  const optionTag: EChartsOption = {
    title: {
      text: '文章标签统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a}「{b}」<br/> {c} 篇文章 ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: DataTag.legendData
    },
    series: [
      {
        name: '标签',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: DataTag.seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  let categChart = echarts.init(echartCateg.value, theme, { renderer: 'svg' })
  categChart.dispose()
  categChart = echarts.init(echartCateg.value, theme, { renderer: 'svg' })

  categChart.setOption({ ...optionCateg })
  categChart.on('click', function (params) {
    router.push('/dash/articles?categoryName=' + encodeURIComponent(params.name))
  });
  let tagChart = echarts.init(echartTag.value, theme, { renderer: 'svg' })
  tagChart.dispose()
  tagChart = echarts.init(echartTag.value, theme, { renderer: 'svg' })

  tagChart.setOption({ ...optionTag })
  tagChart.on('click', function (params) {
    router.push('/dash/articles?tagNameList=' + encodeURIComponent(params.name))
  });
}

Store.$subscribe((_mutation, state) => {
  createCharts(state.config.theme)
})
onMounted(async () => {
  await getCategTagList()
  createCharts()

})

</script>

<style lang="scss" scoped>
.charts-box {
  display: flex;
}

.chart {
  width: 45%;
  height: 18rem;
  max-width: 36rem;
}

@media screen and (max-width: 45rem) {
  .charts-box {
    flex-direction: column;
  }

  .chart {
    width: 95%;
    max-width: 95%;
  }

}
</style>
