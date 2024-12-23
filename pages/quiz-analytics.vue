<template>
  <div class="results">
    <Loading v-show="loading" />
    <div v-show="list.length && !loading" class="results-content">
      <participants-table :limit="true" :dataset="list" :score="scoreList" />
      <div class="insights">
        <div class="title">
          <h2>Aggregate Insights</h2>
        </div>
        <div class="box-wrapper">
          <databox
            title="Participants count"
            icon="iconoir:community"
            :number="count" />
          <databox
            title="Average Score"
            icon="ic:round-percentage"
            :number="avg" />
          <databox
            title="Min Score"
            icon="carbon:chart-minimum"
            :number="min" />
          <databox
            title="Max Score"
            icon="icon-park-outline:maximum"
            :number="max" />
          <databox
            title="Median Score"
            icon="carbon:chart-median"
            :number="median" />
          <databox
            title="Standard Deviation"
            icon="mdi:sigma-lower"
            :number="stat.round(sd)" />
          <databox
            title="Mean"
            icon="carbon:arithmetic-mean"
            :number="stat.round(mean)" />
        </div>
      </div>
      <div class="graphs">
        <div class="title">
          <h2>Graphs Analytics</h2>
        </div>
        <div class="chart-wrapper">
          <VChart :option="gradeDist" class="chart" autoresize />
          <VChart :option="option" class="chart" autoresize />
        </div>
      </div>
    </div>
    <Fscreen v-show="!list.length && !loading">
      <h2>no participants yet <Icon name="solar:sad-square-outline" /></h2>
    </Fscreen>
  </div>
</template>

<script setup>
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
echarts.use([TitleComponent, LegendComponent, PieChart, TooltipComponent]);

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
const quiz = useQuiz();
const participant = useParticipant();
const stat = stats();

const score = useScore();
const question = useQuestion();
const loading = ref(false);

const list = ref([]);
const correctCount = ref();
const totalCount = ref();
const min = ref();
const max = ref();
const mean = ref();
const sd = ref();
const grades = ref([]);
const gradeCount = ref();
const gradeDist = ref({
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "horizontal",
    top: "top",
  },
  series: [
    {
      name: "Grade | Count",
      type: "pie",
      radius: "70%",
      data: gradeCount,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

const onPageLoad = async () => {
  loading.value = true;
  if (quiz.id) {
    list.value = await participant.getLimited(quiz.id);
    count.value = await participant.getCount(quiz.id);
    scoreList.value = await participant.getScores(quiz.id);
    if (scoreList.value.length) {
      avg.value = stat.avg(scoreList.value);
      median.value = stat.median(scoreList.value);

      mean.value = stat.mean(scoreList.value);
      sd.value = stat.sd(scoreList.value, mean.value);
      grades.value = stat.grade(scoreList.value, scoreList.value);

      max.value = Math.max(...scoreList.value);
      min.value = Math.min(...scoreList.value);
      gradeCount.value = stat.gradeWithCounts(scoreList.value);
    }
    await question.get(quiz.id);
    correctCount.value = await score.getCorrectCount();
    totalCount.value = await score.getTotaltCount();
  }
  loading.value = false;
};

const count = ref(0);
const scoreList = ref([]);
const avg = ref();
const median = ref();

onMounted(async () => {
  await onPageLoad();
});
watch(
  () => quiz.id,
  async () => {
    await onPageLoad();
  }
);
</script>

<style lang="scss" scoped>
.chart-wrapper {
  display: flex;
  width: 100%;
  height: 30rem;
  .chart {
    height: 100%;
    width: 100%;
  }
}
</style>
