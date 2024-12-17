<template>
  <div class="calendar-container">
    <!-- 日历头部 -->
    <div class="calendar-header">
      <button @click="changeMonth(-1)">← 上个月</button>
      <h2>{{ currentDate.format('YYYY年MM月') }}</h2>
      <button @click="changeMonth(1)">下个月 →</button>
    </div>

    <!-- 跳转到今天和日期选择 -->
    <div class="calendar-actions">
      <button @click="goToToday">跳转到今天</button>
      <input type="date" v-model="selectedDateInput" @change="onDateChange" />
    </div>

    <!-- 日历主体 -->
    <div class="calendar-grid">
      <!-- 星期标题 -->
      <div class="calendar-cell header" v-for="day in weekDays" :key="day">
        {{ day }}
      </div>

      <!-- 日历日期 -->
      <div
        class="calendar-cell"
        v-for="date in calendarDays"
        :key="date.format('YYYY-MM-DD')"
        :class="{ 'current-day': isToday(date), 'selected-day': isSelectedDate(date) }"
        @click="viewDetails(date)"
      >
        <div class="date-info">
          <!-- 阳历 -->
          <span class="gregorian">{{ date.date() }}</span>
          <!-- 阴历 -->
          <span class="lunar" v-if="lunarData[date.format('YYYY-MM-DD')]">
            {{ lunarData[date.format('YYYY-MM-DD')].lunar }}
          </span>
        </div>
      </div>
    </div>

    <!-- 选中日期详情 -->
    <div class="date-details" v-if="selectedDateDetails">
      <h3>{{ selectedDateDetails.date }}</h3>
      <p>农历: {{ selectedDateDetails.lunar }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import 'dayjs/locale/zh-cn'

dayjs.extend(weekday)
dayjs.locale('zh-cn')

// 当前显示的月份
const currentDate = ref(dayjs())

// 用户选择的日期
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedDateInput = ref(dayjs().format('YYYY-MM-DD'))

// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 农历数据
const lunarData = ref<Record<string, { lunar: string }>>({})

// 当前选中日期的详细信息
const selectedDateDetails = ref<{ date: string; lunar: string } | null>(null)

// 生成当前月份的日历数据
const calendarDays = computed(() => {
  const start = currentDate.value.startOf('month').weekday(0) // 月开始的星期天
  const end = currentDate.value.endOf('month').weekday(6) // 月结束的星期六
  const days = []

  for (let date = start; date.isBefore(end); date = date.add(1, 'day')) {
    days.push(date)
  }
  return days
})

// 是否是今天
const isToday = (date: dayjs.Dayjs) => date.isSame(dayjs(), 'day')

// 是否是选中的日期
const isSelectedDate = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD') === selectedDate.value

// 切换月份
const changeMonth = (offset: number) => {
  currentDate.value = currentDate.value.add(offset, 'month')
  fetchLunarData()
}

// 跳转到今天
const goToToday = () => {
  currentDate.value = dayjs()
  selectedDate.value = dayjs().format('YYYY-MM-DD')
  selectedDateInput.value = dayjs().format('YYYY-MM-DD')
  fetchLunarData()
  viewDetails(dayjs())
}

// 用户手动选择日期
const onDateChange = () => {
  const date = dayjs(selectedDateInput.value)
  currentDate.value = date
  selectedDate.value = date.format('YYYY-MM-DD')
  fetchLunarData()
  viewDetails(date)
}

// 请求农历数据
const fetchLunarData = async () => {
  lunarData.value = {} // 清空旧数据
  try {
    const start = currentDate.value.startOf('month').format('YYYY-MM-DD')

    const response = await fetch(`http://www.sojson.com/open/api/lunar/?date=${start}`)
    const json = await response.json()

    if (json.status === 200) {
      const lunarList = json.data.list
      lunarList.forEach((day: any) => {
        lunarData.value[day.date] = { lunar: day.cnDay }
      })
    }
  } catch (error) {
    console.error('Failed to fetch lunar data:', error)
  }
}

// 查看某日期的详细信息
const viewDetails = (date: dayjs.Dayjs) => {
  const dateKey = date.format('YYYY-MM-DD')
  const lunarInfo = lunarData.value[dateKey]
  selectedDate.value = dateKey
  selectedDateInput.value = dateKey
  if (lunarInfo) {
    selectedDateDetails.value = {
      date: date.format('YYYY年MM月DD日'),
      lunar: lunarInfo.lunar
    }
  } else {
    selectedDateDetails.value = null
  }
}

// 初始化加载
onMounted(() => {
  fetchLunarData()
  viewDetails(dayjs()) // 显示当前日期的详情
})
</script>

<style scoped>
.calendar-container {
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
  padding: 16px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-header h2 {
  margin: 0;
}

.calendar-actions {
  text-align: center;
  margin-bottom: 16px;
}

.calendar-actions input[type='date'] {
  margin-left: 10px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-cell {
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.calendar-cell.header {
  font-weight: bold;
  background-color: #f0f0f0;
}

.date-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gregorian {
  font-size: 16px;
  font-weight: bold;
}

.lunar {
  font-size: 12px;
  color: #888;
}

.current-day {
  border: 2px solid #007bff;
  background-color: #e7f3ff;
}

.selected-day {
  background-color: #f0f8ff;
  border: 2px solid #008b8b;
}

.date-details {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
}

.date-details h3 {
  margin: 0 0 8px;
}

.date-details p {
  margin: 4px 0;
}
</style>
