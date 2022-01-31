<template>
  <div 
    class="focus:outline-none"
    contenteditable
    ref="input"
    @input="onInput"
    @blur="update"
  ></div>
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
      this.loop && clearTimeout(this.loop);
      this.$emit('change', this.content);
    },

    updateContent(){
      this.$refs.input.innerHTML = this.content;
    }

  },

  mounted(){
    this.updateContent();
  },

  watch: {
    value(){
      if (this.value === this.content)
        return;

      this.content = this.value;
      this.updateContent();
    }
  }
}
</script>

<style>

</style>