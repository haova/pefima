<template>
  <m-default-layout
    :menuItems="menuItems"
    v-if="isMounted"
  >
    <template v-slot:topbar>
      <input type="file" class="hidden" @change="importFromFile" id="import-from-file">
      <label for="import-from-file" class="p-3 w-12 inline-block text-center cursor-pointer">
        <ion-icon name="cloud-upload-outline"></ion-icon>
      </label>

      <button @click="exportToFile" class="p-3 w-12 inline-block text-center cursor-pointer">
        <ion-icon name="cloud-download-outline"></ion-icon>
      </button>

    </template>

    <Nuxt />
  </m-default-layout>
</template>

<script>
import moment from 'moment';

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default {

  data(){
    return {
      isMounted: false
    }
  },

  computed: {
    menuItems(){
      return [
        { label: 'Transaction', icon: 'diamond', type: 'link', href: '/' },
        { label: 'Future', icon: 'hourglass', type: 'link', href: '/future' }
      ]
    }
  },

  methods: {
    async importFromFile(event){
      const file = event.target.files[0];

      const jsonString = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(){ resolve(reader.result) }
        reader.readAsText(file);
      });

      await this.$db.deleteDB();
      await this.$db.init();

      await this.$db.importDB(jsonString);
      location.reload();
    },

    async exportToFile(){
      download(`pefima - ${moment().format('YYYYMMDD HHmmss')}.json`, await this.$db.exportDB());
      
      this.$noti('success', 'Exported');
    },
  },

  async mounted(){
    await this.$db.init();

    this.isMounted = true;
  }
}
</script>
