<template>
  <div 
    class="focus:outline-none"
    contenteditable
    @input="onInput"
  >{{ value }}</div>
</template>

<script>
const TIMEOUT = 2000;

export default {
  props: ['value'],

  data(){
    return {
      content: this.value,
      loop: null
    }
  },
  methods: {
    onInput(e){
      this.$nextTick(() => {
        this.content = e.target.innerText;

        this.loop && clearTimeout(this.loop);
        this.loop = setTimeout(() => this.update(), TIMEOUT);
      });
    },

    update(){
      this.$emit('change', this.content);
    }
  }
}
</script>

<style>

</style>