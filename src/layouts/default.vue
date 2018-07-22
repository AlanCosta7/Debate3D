<template>
  <q-layout view="lHh Lpr lFf"> 
      <q-toolbar color="black">
          <q-toolbar-title>
              <img src="../assets/debate3d.png" width="80px" alt="logo">
              <img :src="image" class="imge" v-if="usuario">
          </q-toolbar-title>
      </q-toolbar>     
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  data () {
    return {
    }
  },
  computed: {
    usuario () {
      return this.$store.getters.usuario
    },
    user() {
      return this.$store.getters.user      
    },
    image () {
      return this.$store.getters.usuario.image
    }
  },
  watch: {
    usuario (value) {
          if (value !== null && value !== undefined) {
             this.$store.getters.usuario
          }
        }
  }
}
</script>

<style>
  .imge {
    position: absolute;
    right: 15px;
        background-color: #000;
        border-radius: 100%;
        object-fit: cover;
        width: 30px;
        height: 30px;
    }
</style>
