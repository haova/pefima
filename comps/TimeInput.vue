<template>
  <date-range-picker
    singleDatePicker="single"
    :ranges="false"
    v-model="dateRange"
    @update="$emit('change', dateRange.startDate)"
  >
    <template
      v-slot:input="picker"
      class="w-full"
    >
      {{ picker.startDate | date }}
    </template>
  </date-range-picker>
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'vue2-daterange-picker';

import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';

export default {
  components: { DateRangePicker },
  props: ['value'],

  data(){
    return {
      dateRange: { startDate: this.value ? new Date(this.value) : new Date(), endDate: '' }
    }
  },

  filters: {
    date(value){
      if (!value)
        return '';

      return moment(value).format('YYYY/MM/DD');
    }
  },
}
</script>

<style lang="scss">
.vue-daterange-picker {
  @apply w-full;

  .reportrange-text {
    @apply w-full inline p-0 m-0 border-0;
  }
}
</style>