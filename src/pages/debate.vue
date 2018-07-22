<template>
    <q-page>
        <DebateTimer></DebateTimer> 
    </q-page>    
</template>

<script>
import DebateTimer from './time.vue'

export default {
    name: 'debate',
  data () {
    return {
    }
  },
    components: {
      DebateTimer
    },
    created () {
      this.$store.dispatch('carregarUsuario') 
    },
}    
</script>