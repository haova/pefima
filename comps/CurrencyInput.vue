<template>
  <input
    :class="`inline-block w-full focus:outline-none font-bold ${content < 0 ? 'text-red-700' : 'text-green-700'}`"
    :value="formattedValue"
    @focus="mode = 'input'"
    @blur="mode = 'preview'"
    @input="onInput"
  >
</template>

<script>
const TIMEOUT = 2000;

export default {
  props: ['value'],

  data(){
    return {
      mode: 'preview',
      content: this.value
    }
  },

  computed: {
    formattedValue(){
      if (typeof this.content !== 'number')
        return '';

      if (this.mode === 'input')
        return this.content;
      
      return this.$utils.formatCurrency(this.content);
    }
  },

  methods: {
    onInput(e){
      this.$nextTick(() => {
        this.content = parseInt(e.target.value);

        this.loop && clearTimeout(this.loop);
        this.loop = setTimeout(() => this.update(), TIMEOUT);
      });
    },

    update(){
      this.$emit('change', this.content);
    }
  },

  watch: {
    value(){
      if (this.content === this.value)
        return;

      this.content = this.value;
    }
  }
}
</script>

<style>

</style>