<template class="timer">
    <q-page>
        <q-knob
          class="flex flex-center"
          v-model="minutes"
          :min="min"
          :max="max"
          color="green"
          readonly
        >
        <q-icon class="on-left" name="alarm" /> {{Math.trunc(minutes)}}:{{Math.trunc(seconds)}}
        </q-knob>
        <div v-if="autorizado">
            <q-btn @click='timer_loop()' color="green" icon='play_circle_filled' v-if="play"></q-btn>
            <q-btn @click='mypause()' color="green" icon='pause_circle_filled' v-if="!play"></q-btn>
            <q-btn @click='myreset()' color="green" icon='refresh' v-if="play"></q-btn>
        </div>
    </q-page>
</template>

<script>
export default {
  props: {
        date: {
            type: String
        }
    },
  data () {
    return {
        now: 0,
        count: 0,
        play: true,
        pause: false,
        stop: '',
        min: 0,
        max: 7,
        usuario: this.$store.getters.usuario,
        autor: this.$store.getters.autor,
        autorizado: false
    }
  },
  created() {
    var autor = this.autor
      if (this.usuario.nome == autor) {
        this.autorizado = true
      }
  },
  methods: {
    timer_loop() {
        this.play = false
        this.count--
        this.now = Math.trunc(420000 / 1000 + this.count)
        this.stop = this.count < 200 && setTimeout(this.timer_loop, 1000)
    },
    mypause () {
        clearTimeout(this.stop)
        this.pause = true
        this.play = true
    },
    myreset () {
        this.count = 0  
        this.now = 0
    }
  },
  computed: {
    seconds() {
        return (this.now) % 60
    },
    minutes() {
        return ((this.now) / 60) % 60
    },
    listaDebates () {
      return this.$store.getters.listaDebates
    },
    listaUsuarios () {
      return this.$store.getters.listaUsuarios
    },
  }
}
</script>


<style>
.timer {
    width: 30;
}
</style>