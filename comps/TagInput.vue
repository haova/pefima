<template>
  <div class="select-input">
    <multi-select
      :options="localOptions"
      :selected-options="items"
      @select="onSelect"
      @keyup.native="autoValue"
    ></multi-select>
  </div>
</template>

<script>
import { MultiSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'

export default {
  props: [
    'value',
    'options'
  ],

  data(){
    return {
      lastSelectItem: {},
      newValue: null
    }
  },
  
  components: {
    MultiSelect
  },

  computed: {
    localOptions(){
      let isExisted = false;
      const options = [];

      for (let value of this.options || []){
        if (this.newValue && this.newValue.value === value)
          isExisted = true;

        options.push({
          text: value,
          value
        });
      }

      if (this.newValue && !isExisted)
        options.unshift(this.newValue);

      return options;
    },

    items(){
      const items = [];

      for (let value of this.value || []){
        items.push({
          text: value,
          value
        });
      }

      return items;
    }
  },

  methods: {
    onSelect(items){
      this.$emit('change', items.map(i => i.value));
    },

    autoValue(event){
      const newValue = event.target.value;

      if (!newValue)
        this.newValue = null;
      else
        this.newValue = {
          text: `Create "${newValue}"`,
          value: newValue
        }
    },
  }
}
</script>
