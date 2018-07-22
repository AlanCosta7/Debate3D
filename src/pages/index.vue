<template>
  <q-page >
    <q-layout padding>
      <!-- *** TIMELINE *** -->

      <q-list class="flex-center row items-start">
        <q-item v-for='item in listaDebates' :key='item.id'>  
            <q-card inline class="bigger q-ma-sm ecard">
                <q-card-media>
                    <img :src=item.imageUrl class="imgemCard"/>
                    <q-card-title slot="overlay">
                        {{item.tema}}
                      <span slot="subtitle">{{item.mocao}}</span>
                    </q-card-title>
                </q-card-media>
                <q-card-title class="relative-position">
                    <q-btn @click="entrarDebate(item)" color="positive" 
                    push round icon="lock_open" class="absolute" 
                    style="top: 0; right: 8px; transform: translateY(-60%);">
                   </q-btn>           
                    <q-rating slot="subtitle" v-model="stars" :max="5" />
                    <div slot="right" class="row items-center">
                      <q-icon name="place" /> {{item.local}}
                    </div>
                </q-card-title>
                <q-card-main>
                    <p class="text-faded">{{item.descricao}}</p>
                    <q-chip icon='event'>{{item.datatime}}</q-chip>
                </q-card-main>
                <q-card-actions align="around">
                  <q-btn flat round color="red" icon="favorite" />
                  <q-btn flat round color="orange" icon="bookmark" />
                  <q-btn flat round color="primary" icon="share" />
                </q-card-actions>
              </q-card>
        </q-item>
      </q-list>

      <q-modal v-model="opened" maximized>
       <q-modal-layout>
        <div class="modalprincipal">
        <h4>Agendar Debate</h4>
        <!-- *** Tema *** -->
          <q-field
            name="tema"
            id="tema"
            icon="book"
            label="Tema:"
          >
            <q-input
              type="text"
              v-model="tema"
            />
          </q-field><br>
        <!-- *** Tema *** -->
          <q-field
            name="descricao"
            id="descricao"
            icon="description"
            label="Descrição:"
          >
            <q-input
              type="textarea"
              v-model="descricao"
            />
          </q-field><br>
        <!-- *** Moção *** -->
          <q-field
            name="mocao"
            id="mocao"
            icon="bookmark_border"
            label="Moção:"
          >
            <q-input
              type="textarea"
              v-model="mocao"
            />
          </q-field><br>
          <!-- *** Fonte *** -->
          <q-field
              name="fonte"
              id="fonte"
              icon="link"
              label="Fonte:"
              helper="links importantes para esse debate"
          >
            <q-input
              type="textarea"
              v-model="fonte"
            />
          </q-field><br>
          
          <!-- *** Data *** -->
          <q-field
            icon="event"
            label="Data:"
            helper="Informe o dia e hora do debate"
          >
          <q-datetime  inverted color="purple" v-model="datatime" format type="datetime" />
          </q-field><br>
         
          <!-- *** Tema *** -->
          <q-field
            name="local"
            id="local"
            icon="room"
            label="Local:"
          >
            <q-input
              type="textarea"
              v-model="local"
            />
          </q-field><br>
          <img :src="imageUrl" height="150"><br>  
          <q-btn push color="primary" label="Upload" @click="onPickFile"></q-btn>
          <input type="file" 
                 style="display: none" 
                 ref="fileInput" 
                 accept="image/*"
                 @change="onFilePicked"
          ></input>
          <br><br>
          <q-alert color="primary"
            v-if="!visible" 
            type="positive" 
            :actions="[{ label: 'OK', handler: () => { opened = false } }]">
              Seu debate foi agendado.
          </q-alert>
        </div>
        <div class="btnmodal2 z-top">
            <q-btn
              class="btnSair"
              color="negative"
              @click="opened = false"
              label="Cancelar"
              push
            />
            <q-btn
              push
              class="btnSalvar"
              color="positive"
              @click="salvardebate()"
              label="Salvar"
            />
          </div>
        </q-modal-layout>    
      </q-modal>

      <q-modal v-model="debate3d" maximized v-if="debate3d">
        <q-modal-layout>
          <q-card>
            <q-card-media>
                <q-progress
                class="z-top"
                :percentage="porcent"
                color="green"
                stripe
                animate
                height="10px"
                />
                <img :src=editedItem.imageUrl class="imgTema">
                <q-card-title slot="overlay">
                    <div class="mocao"><h3>{{editedItem.mocao}}<br></h3></div>
                  <span slot="subtitle">Data: {{editedItem.datatime}}</span>
                </q-card-title>
            </q-card-media>
          <div class="z-top"> 
              <div class="timertext z-top"> 
                <q-icon name="alarm" color="green"/> {{Math.trunc(minutes)}}:{{Math.trunc(seconds)}}
              </div>
              <div class="btnTimer timer z-top">
                <q-btn round @click='timer_loop()' color="green" icon='play_arrow' v-show="play"></q-btn>
                <q-btn round @click='mypause()' color="green" icon='pause' v-show="!play"></q-btn>
                <q-btn round @click='myreset()' color="green" icon='restore' v-show="play"></q-btn>
              </div>
          </div>
          <div class="row justify-center flex-gutter-docs">     
           <div class="doc-container with-bg">
                <div style="background: black" v-if="!hidden">
                 <iframe width="100%" height="500px" class="videomobile" :src=editedItem.transmissao frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
            <q-list link >
            <div class="row flex flex-center col-lg-12 col-xl-12">

            <div class="flex flex-center col-lg-3 col-xl-3">

            <!-- *** Defesa 1 *** -->
            <q-card inline v-if="editedItem.defesa1" color="primary" class="col-lg-8 col-xl-8">
              <div class="row cardmidia">
                  <img :src='editedItem.defesa1.image' alt="foto perfil" class="imgCard">
                    <div class="nomedebat flex flex-center">{{editedItem.defesa1.nome}}</div>
                      <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaDef1)}} pts</div>
              </div>
              <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                <q-collapsible label="Feedback">
                  <p class="caption">
                      <span class="chip-container">
                        <q-chip square color="secondary">
                          Defesa 1 - Pts: {{ labeldef1 }}
                        </q-chip>
                      </span>
                  </p>
                <q-slider v-model="labeldef1" :min="50" :max="100" label-always color="orange" />
                <q-field
                    name="feedback"
                    id="feedback"
                    helper="Dicas, opniões e avaliação"
                    count
                >
                <q-input
                    type="textarea"
                    v-model="feedbackdef1"
                    float-label="Nota:"
                />
                </q-field><br>
                </q-collapsible>
              </q-card-main>
            </q-card>

            <!-- *** Oposição 1 *** -->

            <q-card inline  v-if="editedItem.oposicao1" color="negative" class="col-lg-8 col-xl-8 blue">
                <div class="row cardmidia">
                    <img :src='editedItem.oposicao1.image' alt="foto perfil" class="imgCard">
                      <div class="nomedebat flex flex-center">{{editedItem.oposicao1.nome}}</div>
                        <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaOpo1)}} pts</div>
                </div>
                <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                  <q-collapsible label="Feedback">
                    <p class="caption">
                        <span class="chip-container">
                          <q-chip square color="secondary">
                            Oposição 1 - Pts: {{ labelopo1 }}
                          </q-chip>
                        </span>
                    </p>
                  <q-slider v-model="labelopo1" :min="50" :max="100" label-always color="orange" />
                  <q-field
                      name="feedback"
                      id="feedback"
                      helper="Dicas, opniões e avaliação"
                      count
                  >
                  <q-input
                      type="textarea"
                      v-model="feedbackopo1"
                      float-label="Nota:"
                  />
                  </q-field><br>
                  </q-collapsible>
                </q-card-main>
            </q-card>
           </div>
           <div class="flex flex-center col-lg-3 col-xl-3">

            <!-- *** Defesa 2 *** -->

            <q-card inline v-if="editedItem.defesa2" color="primary" class="col-lg-8 col-xl-8 red">
                <div class="row cardmidia">
                    <img :src='editedItem.defesa2.image' alt="foto perfil" class="imgCard">
                      <div class="nomedebat flex flex-center">{{editedItem.defesa2.nome}}</div>
                        <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaDef2)}} pts</div>
                </div>
                <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                  <q-collapsible label="Feedback">
                    <p class="caption">
                        <span class="chip-container">
                          <q-chip square color="secondary">
                            Defesa 2 - Pts: {{ labeldef2 }}
                          </q-chip>
                        </span>
                    </p>
                  <q-slider v-model="labeldef2" :min="50" :max="100" label-always color="orange" />
                  <q-field
                      name="feedback"
                      id="feedback"
                      helper="Dicas, opniões e avaliação"
                      count
                  >
                  <q-input
                      type="textarea"
                      v-model="feedbackdef2"
                      float-label="Nota:"
                  />
                  </q-field><br>
                  </q-collapsible>
                </q-card-main>
            </q-card>
  
            <!-- *** Oposição 2 *** -->
  
            <q-card inline  v-if="editedItem.oposicao2" color="negative" class="col-lg-8 col-xl-8 blue">
                  <div class="row cardmidia">
                      <img :src='editedItem.oposicao2.image' alt="foto perfil" class="imgCard">
                        <div class="nomedebat flex flex-center">{{editedItem.oposicao2.nome}}</div>
                          <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaOpo2)}} pts</div>
                  </div>
                  <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                    <q-collapsible label="Feedback">
                      <p class="caption">
                          <span class="chip-container">
                            <q-chip square color="secondary">
                              Oposição 2 - Pts: {{ labelopo2 }}
                            </q-chip>
                          </span>
                      </p>
                    <q-slider v-model="labelopo2" :min="50" :max="100" label-always color="orange" />
                    <q-field
                        name="feedback"
                        id="feedback"
                        helper="Dicas, opniões e avaliação"
                        count
                    >
                    <q-input
                        type="textarea"
                        v-model="feedbackopo2"
                        float-label="Nota:"
                    />
                    </q-field><br>
                    </q-collapsible>
                  </q-card-main>
            </q-card>
           </div>
           <div class="flex flex-center col-lg-3 col-xl-3">

            <!-- *** Defesa 3 *** -->
            <q-card inline v-if="editedItem.defesa3" color="primary" class="col-lg-8 col-xl-8 red">
                <div class="row cardmidia">
                    <img :src='editedItem.defesa3.image' alt="foto perfil" class="imgCard">
                      <div class="nomedebat flex flex-center">{{editedItem.defesa3.nome}}</div>
                        <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaDef3)}} pts</div>
                </div>
                <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                  <q-collapsible label="Feedback">
                    <p class="caption">
                        <span class="chip-container">
                          <q-chip square color="secondary">
                            Defesa 3 - Pts: {{ labeldef3 }}
                          </q-chip>
                        </span>
                    </p>
                  <q-slider v-model="labeldef3" :min="50" :max="100" label-always color="orange" />
                  <q-field
                      name="feedback"
                      id="feedback"
                      helper="Dicas, opniões e avaliação"
                      count
                  >
                  <q-input
                      type="textarea"
                      v-model="feedbackdef3"
                      float-label="Nota:"
                  />
                  </q-field><br>
                  </q-collapsible>
                </q-card-main>
            </q-card>
  
              <!-- *** Oposição 3 *** -->
  
            <q-card inline  v-if="editedItem.oposicao3" color="negative" class="col-lg-8 col-xl-8 blue">
                  <div class="row cardmidia">
                      <img :src='editedItem.oposicao3.image' alt="foto perfil" class="imgCard">
                        <div class="nomedebat flex flex-center">{{editedItem.oposicao3.nome}}</div>
                          <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaOpo3)}} pts</div>
                  </div>
                  <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                    <q-collapsible label="Feedback">
                      <p class="caption">
                          <span class="chip-container">
                            <q-chip square color="secondary">
                              Oposição 3 - Pts: {{ labelopo3 }}
                            </q-chip>
                          </span>
                      </p>
                    <q-slider v-model="labelopo3" :min="50" :max="100" label-always color="orange" />
                    <q-field
                        name="feedback"
                        id="feedback"
                        helper="Dicas, opniões e avaliação"
                        count
                    >
                    <q-input
                        type="textarea"
                        v-model="feedbackopo3"
                        float-label="Nota:"
                    />
                    </q-field><br>
                    </q-collapsible>
                  </q-card-main>
            </q-card>
            </div>
            <div class="flex flex-center col-lg-3 col-xl-3">

              <!-- *** Defesa 4 *** -->
  
            <q-card inline v-if="editedItem.defesa4" color="primary" class="col-lg-8 col-xl-8 red">
                  <div class="row cardmidia">
                      <img :src='editedItem.defesa4.image' alt="foto perfil" class="imgCard">
                        <div class="nomedebat flex flex-center">{{editedItem.defesa4.nome}}</div>
                          <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaDef4)}} pts</div>
                  </div>
                  <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                    <q-collapsible label="Feedback">
                      <p class="caption">
                          <span class="chip-container">
                            <q-chip square color="secondary">
                              Defesa 4 - Pts: {{ labeldef4 }}
                            </q-chip>
                          </span>
                      </p>
                    <q-slider v-model="labeldef4" :min="50" :max="100" label-always color="orange" />
                    <q-field
                        name="feedback"
                        id="feedback"
                        helper="Dicas, opniões e avaliação"
                        count
                    >
                    <q-input
                        type="textarea"
                        v-model="feedbackdef4"
                        float-label="Nota:"
                    />
                    </q-field><br>
                    </q-collapsible>
                  </q-card-main>
            </q-card>
    
              <!-- *** Oposição 4 *** -->
    
            <q-card inline  v-if="editedItem.oposicao4" color="negative" class="col-lg-8 col-xl-8 blue">
                    <div class="row cardmidia">
                        <img :src='editedItem.oposicao4.image' alt="foto perfil" class="imgCard">
                          <div class="nomedebat flex flex-center">{{editedItem.oposicao4.nome}}</div>
                            <div class="nomedeb flex flex-center">{{Math.trunc(media[0].mediaOpo4)}} pts</div>
                    </div>
                    <q-card-main v-if="!salvar" style="background: #FFF; color: black">
                      <q-collapsible label="Feedback">
                        <p class="caption">
                            <span class="chip-container">
                              <q-chip square color="secondary">
                                Oposição 4 - Pts: {{ labelopo4 }}
                              </q-chip>
                            </span>
                        </p>
                      <q-slider v-model="labelopo4" :min="50" :max="100" label-always color="orange" />
                      <q-field
                          name="feedback"
                          id="feedback"
                          helper="Dicas, opniões e avaliação"
                          count
                      >
                      <q-input
                          type="textarea"
                          v-model="feedbackopo4"
                          float-label="Nota:"
                      />
                      </q-field><br>
                      </q-collapsible>
                    </q-card-main>
              </q-card>
  
            </div> 
            </div>
          </q-list> 
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-fab
              icon="add"
              color="deep-orange-13"
              direction="up"
              round
              push
              size="xl">
              <q-fab-action @click="hidden = !hidden" v-if="!hidden" color="negative" class="white" icon="videocam_off" />
              <q-fab-action @click="hidden = !hidden" v-if="hidden" color="positive" class="white" icon="videocam" />
              <q-fab-action @click="salvarEdtDeb()" color="positive" class="white" icon="done" />
              <q-fab-action @click="sairEdtDeb()" color="negative" class="white" icon="clear" />   
            </q-fab>
        </q-page-sticky>
        </div>
        </q-card> 
      </q-modal-layout>
      </q-modal>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-fab
            icon="add"
            color="deep-orange-13"
            direction="up"
            round
            push
            size="xl">
            <q-fab-action @click="addDebate()" color="deep-orange" class="white" icon="note_add" />
            <q-fab-action @click="personasizar()" color="deep-orange" class="white" icon="person" />
            <q-fab-action @click="mydebates()" color="deep-orange" class="white" icon="assignment" />
            <q-fab-action @click="sair()" color="deep-orange" class="white" icon="exit_to_app" />   
          </q-fab>
      </q-page-sticky> 
    </q-layout>
  </q-page>
</template>

<script>
import {usuariosRef} from '../components/helpers/firebase/firebaseconfig.js'
import { uid, filter } from 'quasar'
import * as firebase from 'firebase'
import DebateTimer from './time.vue'
import { date } from 'quasar'


export default {
  name: 'PageIndex',
  props: {
        date: {
            type: String
        }
    },
  data () {
    return {
      hidden: false,
      imageUrl:'',
      image: null,
      visible: true,
      editedIndex: -1,
      editedItem: {},
      stars: 3,
      opened: false,
      debate3d: false,
      user: this.$store.getters.user,
      uid: this.$store.getters.user.uid,
      tema: '',
      descricao: '',
      mocao: '',
      fonte: '',
      datatime: new Date(),
      local: '',
      terms: '',
      now: 0,
      count: 0,
      play: true,
      pause: false,
      stop: '',
      min: 50,
      max: 100,
      minn: 0,
      maxx: 7,
      labeldef1: 50,
      labeldef2: 50,
      labeldef3: 50,
      labeldef4: 50,
      labelopo1: 50,
      labelopo2: 50,
      labelopo3: 50,
      labelopo4: 50,
      feedbackdef1: '',
      feedbackdef2: '',
      feedbackdef3: '',
      feedbackdef4: '',
      feedbackopo1: '',
      feedbackopo2: '',
      feedbackopo3: '',
      feedbackopo4: '',
    }
  },
  components: {
      DebateTimer
    },
  mounted() {
    this.$store.dispatch('carregarUsuario') 
    this.$store.dispatch('carregaDebates') 
    this.$store.dispatch('carregaListaUsuario') 
  },
  computed: {
    porcent () {
      return this.minutes*100/7
    },
    media () {
      if (this.debate3d) {
      var media = []  
      var uidposts = this.editedItem.uidposts
      firebase.database().ref('/posts/' + uidposts + '/status/media').on('value', function(snapshot) {
      var item = snapshot.val()
      media.push(item)
      })
      return media     
    } 
    },
    salvar () {
    var status  
    var uidposts = this.editedItem.uidposts
    var uid = this.user.uid
    firebase.database().ref('/posts/' + uidposts + '/status/' + uid + '/salvar').on('value', function(snapshot) {
    var item = snapshot.val()
    status = item
    })
    return status
    }, 
    seconds() {
        return (this.now) % 60
    },
    minutes() {
        return ((this.now) / 60) % 60
    },
    usuario () {
      return this.$store.getters.usuario
    },
    listaDebates () {
      return this.$store.getters.listaDebates
    },
    listaUsuarios () {
      return this.$store.getters.listaUsuarios
    }
  },
  methods: {
    formatarData () {
     let data = this.datatime
     this.datatime = moment(data).format('DD/MM/YYYY')
    },
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
    },
    sair() {
      this.$router.push('/')
      this.$store.dispatch('logout')
    },
    sairEdtDeb () {
      this.debate3d = false
    },
    salvarEdtDeb () {
      this.salvar = true
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      firebase.database().ref('/posts/' + uidposts + '/defesa1/pontos/' + uid).update({labeldef1: this.labeldef1})
      firebase.database().ref('/posts/' + uidposts + '/defesa2/pontos/' + uid).update({labeldef2: this.labeldef2})
      firebase.database().ref('/posts/' + uidposts + '/defesa3/pontos/' + uid).update({labeldef3: this.labeldef3})
      firebase.database().ref('/posts/' + uidposts + '/defesa4/pontos/' + uid).update({labeldef4: this.labeldef4})
      firebase.database().ref('/posts/' + uidposts + '/oposicao1/pontos/' + uid).update({labelopo1: this.labelopo1})
      firebase.database().ref('/posts/' + uidposts + '/oposicao2/pontos/' + uid).update({labelopo2: this.labelopo2})
      firebase.database().ref('/posts/' + uidposts + '/oposicao3/pontos/' + uid).update({labelopo3: this.labelopo3})
      firebase.database().ref('/posts/' + uidposts + '/oposicao4/pontos/' + uid).update({labelopo4: this.labelopo4})
     
      firebase.database().ref('/posts/' + uidposts + '/defesa1/feedback/' + uid).update({feedbackdef1: this.feedbackdef1})
      firebase.database().ref('/posts/' + uidposts + '/defesa2/feedback/' + uid).update({feedbackdef2: this.feedbackdef2})
      firebase.database().ref('/posts/' + uidposts + '/defesa3/feedback/' + uid).update({feedbackdef3: this.feedbackdef3})
      firebase.database().ref('/posts/' + uidposts + '/defesa4/feedback/' + uid).update({feedbackdef4: this.feedbackdef4})
      firebase.database().ref('/posts/' + uidposts + '/oposicao1/feedback/' + uid).update({feedbackopo1: this.feedbackopo1})
      firebase.database().ref('/posts/' + uidposts + '/oposicao2/feedback/' + uid).update({feedbackopo2: this.feedbackopo2})
      firebase.database().ref('/posts/' + uidposts + '/oposicao3/feedback/' + uid).update({feedbackopo3: this.feedbackopo3})
      firebase.database().ref('/posts/' + uidposts + '/oposicao4/feedback/' + uid).update({feedbackopo4: this.feedbackopo4})
     
      this.pontosDef1()    
      this.pontosDef2()    
      this.pontosDef3()    
      this.pontosDef4()
      this.pontosOpo1()
      this.pontosOpo2()
      this.pontosOpo3()
      this.pontosOpo4()    
      this.status()
      this.sairEdtDeb()
    },
    status () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      firebase.database().ref('/posts/' + uidposts + '/status/media').update(
        {
          mediaDef1: this.mediaDef1,
          mediaDef2: this.mediaDef2,
          mediaDef3: this.mediaDef3,
          mediaDef4: this.mediaDef4,
          mediaOpo1: this.mediaOpo1,
          mediaOpo2: this.mediaOpo2,
          mediaOpo3: this.mediaOpo3,
          mediaOpo4: this.mediaOpo4
        })

      firebase.database().ref('/posts/' + uidposts + '/status/' + uid).update({salvar: true})
     
    },
    pontosDef1 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/defesa1/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labeldef1+soma
        len = arr.length
      }
      })
      this.mediaDef1 = soma/len
    },
    pontosDef2 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/defesa2/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labeldef2+soma
        len = arr.length
      }
      })
      this.mediaDef2 = soma/len
    },
    pontosDef3 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/defesa3/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labeldef3+soma
        len = arr.length
      }
      })
      this.mediaDef3 = soma/len
    },
    pontosDef4 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/defesa4/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labeldef4+soma
        len = arr.length
      }
      })
      this.mediaDef4 = soma/len
    },
    pontosOpo1 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/oposicao1/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labelopo1+soma
        len = arr.length
      }
      })
      this.mediaOpo1 = soma/len
    },
    pontosOpo2 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/oposicao2/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labelopo2+soma
        len = arr.length
      }
      })
      this.mediaOpo2 = soma/len
    },
    pontosOpo3 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/oposicao3/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labelopo3+soma
        len = arr.length
      }
      })
      this.mediaOpo3 = soma/len
    },
    pontosOpo4 () {
      var uidposts = this.editedItem.uidposts
      var uid = this.user.uid
      var soma = 0
      var len = 0
      firebase.database().ref('/posts/' + uidposts + '/oposicao4/pontos').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      for (var i = 0; i < arr.length; i++) {
        soma = arr[i].labelopo4+soma
        len = arr.length
      }
      })
      this.mediaOpo4 = soma/len
    },
    personasizar() {
      this.$router.push('/profile')
    },
    addDebate () {
      this.opened = true
    },
    entrarDebate(item) {
      this.editedIndex = this.listaDebates.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.debate3d = true
    },
    salvardebate() {
      this.visible = false
      var uid = this.user.uid 
      var nome = this.usuario.nome
      if (!this.image) {
        return
      }
          var postData = {
          tema: this.tema,
          descricao: this.descricao,
          mocao: this.mocao,
          fonte: this.fonte,
          datatime: this.datatime,
          transmissao: "link",
          image: this.image,
          local: this.local,
          autor: nome,
          uiduser: uid,
          defesa1: {label: 'Nome', value: 'Nome' },
          defesa2: {label: 'Nome', value: 'Nome' },
          defesa3: {label: 'Nome', value: 'Nome' },
          defesa4: {label: 'Nome', value: 'Nome' },
          oposicao1: {label: 'Nome', value: 'Nome' },
          oposicao2: {label: 'Nome', value: 'Nome' },
          oposicao3: {label: 'Nome', value: 'Nome' },
          oposicao4: {label: 'Nome', value: 'Nome' },
          juizes: [{label: 'Nome', value: 'Nome' }]
        }
        
        var newPostKey = firebase.database().ref().child('posts').push().key
        var updates = {}
        updates['/posts/' + newPostKey] = postData

        let imageUrl
        var key = newPostKey
        return firebase.database().ref().update(updates)
          .then((data) => {
            const key = newPostKey
            return key
          })
          .then(key => {
            const filename = this.image.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            firebase.storage().ref('posts/' + key + ext).put(this.image)
            .then(function(snapshot) {
              console.log('Uploaded', snapshot.totalBytes, 'bytes.');
              snapshot.ref.getDownloadURL().then(function(url) {
                console.log('File available at', url)
                firebase.database().ref('posts').child(key).update({imageUrl: url, uidposts: newPostKey})  
              })
            })
            .catch(function(error) {
            // [START onfailure]
            console.error('Upload failed:', error);
            // [END onfailure]
          });
          })
          .catch((error) => {
            console.log(error)
          })
    },
    mydebates () {
      this.$router.push('/mydebates')
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Adicione uma imagem válida!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  }
}
</script>

<style>
    .timer {
      position: absolute;
      object-fit: cover;
      border-radius: 100%;
    }
    .timertext {
      position: absolute;
      color: green;
      top: 10px;
      left: 2px;
    }
    .btnTimer {
      position: absolute;
      top: 10px;
      right: 0;
      width: 100px;
      height: 30px;
    }
    .entrarlogo {
      width: 50px
    }
    .modalprincipal {
      padding: 5%
    }
    .col-lg-8   {
      border-radius: 0.5em;
      margin: 1%
    }
    .cab {
      background-color: rgb(255, 255, 255);
    }
    .imgTema {
      object-fit: cover;
      width: 100%;
      height: 10em;
    }
    .imgCard {
      object-fit: cover;
      border-radius: 100%;
      width: 3em;
      height: 3em;
    }
    .imgemCard {
      object-fit: cover;
      border-radius: 0.5em;
      width: 300px;
      height: 10em;
    }
    .ecard {
      width: 300px;
    }
    .videopc {
      position: absolute;
      width: 65%;
      height: 70%;
      left: 4%;
    }
    .videomobile {
      width: 100%;
      height: 300px;
    }
    .btnmodal {
      padding: 2%
    }
    .btnSair {
      margin: 2%
    }
    .mocao {
      text-align: center
    }
    .nomedebat {
      font-family:Arial, Helvetica, sans-serif;
      font-size: 1em;
      color: white;
      padding-left: 10%
    }
    .nomedeb {
      font-family:Arial, Helvetica, sans-serif;
      font-size: .75em;
      right: 45px;
      color: white;
      padding-left: 10%
    }
    .cardmidia {
      padding: 3%
    }
  </style>