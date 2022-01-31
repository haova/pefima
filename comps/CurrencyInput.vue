<template>
  <input
    :class="`bg-transparent inline-block w-full focus:outline-none font-bold ${content < 0 ? 'text-red-700' : 'text-green-700'}`"
    :value="formattedValue"
    :readonly="readonly"
    :type="mode === 'input' ? 'tel' : 'text'"
    @focus="mode = (readonly ? 'preview' : 'input')"
    @blur="mode = 'preview'; update()"
    @input="onInput"
    @keydown="onKeyDown"
  >
</template>

<script>
const TIMEOUT = 2000;

export default {
  props: ['value', 'readonly'],

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
    onKeyDown(e){
      if (e.key === '-'){
        e.preventDefault();
        this.content = -(this.content || 0);
        this.pendingUpdate();
      }
    },

    pendingUpdate(){
      this.loop && clearTimeout(this.loop);
      this.loop = setTimeout(() => this.update(), TIMEOUT);
    },

    onInput(e){
      this.$nextTick(() => {
        this.content = parseInt(e.target.value);

        this.pendingUpdate();
      });
    },

    update(){
      this.loop && clearTimeout(this.loop);
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