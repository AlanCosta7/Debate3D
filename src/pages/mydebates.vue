<template>
    <q-page padding>
        <h3>Meus debates</h3>
        <h6>Edite a arena de debate adicionanando as duplas de debatedores e os juízes, além de integrar o link da transmissão ao vivo.</h6>
        <q-btn to="/index" color="primary" push>Voltar</q-btn><br><br>
        
        <!-- *** TIMELINE *** -->
            <q-list link class="flex flex-center card-examples row items-start">
              <q-item v-for='item in listaMyDebates' :key='item.id'>  
                  <q-card inline class="bigger q-ma-sm">
                      <q-card-media>
                          <img :src=item.imageUrl class="imgemCard">
                          <q-card-title slot="overlay">
                              {{item.tema}}
                            <span slot="subtitle">{{item.mocao}}</span>
                          </q-card-title>
                      </q-card-media>
                      <q-card-title class="relative-position">
                          <q-btn @click="entrarmydebate(item)" color="primary" push round icon="create" class="absolute" style="top: 0; right: 8px; transform: translateY(-60%);"></q-btn>
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

            <q-modal v-model="edtDebate3d" maximized >
                    <q-modal-layout>
                        <q-alert color="primary"
                        v-if="!alertDeb" 
                        type="negative">
                        {{menssagem}}
                        </q-alert>
                     <q-card>
                        <q-card-media>
                            <img :src=editedItem.imageUrl class="imgTema">
                            <q-card-title slot="overlay">
                                {{editedItem.tema}}
                              <span slot="subtitle">{{editedItem.mocao}}<br>
                                {{editedItem.descricao}}<br>
                                {{editedItem.datatime}}</span>
                            </q-card-title>
                        </q-card-media>
                        <q-card-main class="card" v-if="editedIndex != -1">
                          <q-field
                          name="transmissao"
                          id="transmissao"
                          icon="videocam"
                          label="Transmissão:">
                            <q-input type="url" v-model="editedItem.transmissao" prefix="https://youtu.be/"/>
                          </q-field><br>
                          <q-field
                            icon="dns"
                            label="Defesa 1"
                            helper="Adicione a primeira dupla da defesa"
                          >
                          <q-select
                            filter
                            float-label="Defesa 1"
                            image
                            inverted
                            color="blue-10"
                            v-model="editedItem.defesa1"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Defesa 1"
                            image
                            inverted
                            color="blue-10"
                            v-model="editedItem.defesa2"
                            :options="listaUsuarios"
                          />
                          </q-field><br>
                          <q-field
                            icon="dns"
                            label="Oposição 1"
                            helper="Adicione a primeira dupla da oposição"
                          >
                          <q-select
                            filter
                            float-label="Oposição 1"
                            image
                            inverted
                            color="red-10"
                            v-model="editedItem.oposicao1"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Oposição 1"
                            image
                            inverted
                            color="red-10"
                            v-model="editedItem.oposicao2"
                            :options="listaUsuarios"
                          />
                          </q-field><br>
                          <q-field
                            icon="dns"
                            label="Defesa 2"
                            helper="Adicione a segunda dupla da defesa"
                          >
                          <q-select
                            filter
                            float-label="Defesa 2"
                            image
                            inverted
                            color="blue-10"
                            v-model="editedItem.defesa3"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Defesa 2"
                            image
                            inverted
                            color="blue-10"
                            v-model="editedItem.defesa4"
                            :options="listaUsuarios"
                          />
                          </q-field><br>
                          <q-field
                            icon="dns"
                            label="Oposição 2"
                            helper="Adicione a segunda dupla da oposição"
                          >
                          <q-select
                            filter
                            float-label="Oposição 2"
                            image
                            inverted
                            color="red-10"
                            v-model="editedItem.oposicao3"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Oposição 2"
                            image
                            inverted
                            color="red-10"
                            v-model="editedItem.oposicao4"
                            :options="listaUsuarios"
                          />
                          </q-field><br>
                          <q-field
                            icon="gavel"
                            label="Juízes"
                            helper="Adicione os juízes"
                          >
                          <q-select
                            filter
                            float-label="Juíz 1"
                            image
                            inverted
                            color="orange-10"
                            v-model="editedItem.juizes1"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Juíz 2"
                            image
                            inverted
                            color="orange-10"
                            v-model="editedItem.juizes2"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Juíz 3"
                            image
                            inverted
                            color="orange-10"
                            v-model="editedItem.juizes3"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Juíz 4"
                            image
                            inverted
                            color="orange-10"
                            v-model="editedItem.juizes4"
                            :options="listaUsuarios"
                          />
                          <q-select
                            filter
                            float-label="Juíz 5"
                            image
                            inverted
                            color="orange-10"
                            v-model="editedItem.juizes5"
                            :options="listaUsuarios"
                          />
                          </q-field><br>
                        </q-card-main>
                     </q-card>
                      <q-btn
                      color="primary"
                      @click="sairEdtDeb()"
                      label="Sair"
                      />
                      <q-btn
                      color="primary"
                      @click="salvarEdtDeb()"
                      label="Salvar"
                      />
                    </div>
                </q-modal-layout>
            </q-modal>
    </q-page>
</template>
                          
<script>
import {usuariosRef} from '../components/helpers/firebase/firebaseconfig.js'
import { uid, filter } from 'quasar'
import firebase from 'firebase'

export default {
  name: 'PageMyDebates',
  data () {
    return {
      alertDeb: true,
      menssagem: '',
      editedIndex: -1,
      editedItem: {},
      stars: 3,
      edtDebate3d: false,
      user: this.$store.getters.user,
      tema: '',
      descricao: '',
      mocao: '',
      fonte: '',
      datatime: '',
      local: '',
      usuario: this.$store.getters.usuario,
      listaMyDebates: this.$store.getters.listaMyDebates,
      listaUsuarios: this.$store.getters.listaUsuarios,
      terms: '',
      transmissao: '',
      prefix: 'https://www.youtube.com/embed/',
      sufix: '',
      juizes1: {},
      juizes2: {},
      juizes3: {},
      juizes4: {},
      juizes5: {},    
      defesa1: {},
      defesa2: {},
      defesa3: {},
      defesa4: {},
      oposicao1: {},
      oposicao2: {},
      oposicao3: {},
      oposicao4: {}
    }
  },
  mounted() {
    this.$store.dispatch('carregarUsuario') 
    this.$store.dispatch('carregaMyDebates') 
    this.$store.dispatch('carregaListaUsuario') 
  },
  methods: {
    entrarmydebate(item) {
      this.editedIndex = this.listaMyDebates.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.edtDebate3d = true
    },
    sairEdtDeb () {
      this.edtDebate3d = false
    },
    salvarEdtDeb () {
      var def1 = {}
      var def2 = {}
      var def3 = {}
      var def4 = {}
      var opo1 = {}
      var opo2 = {}
      var opo3 = {}
      var opo4 = {}
      var jui1 = {}
      var jui2 = {}
      var jui3 = {}
      var jui4 = {}
      var jui5 = {}

      for (var a = 0; a < this.listaUsuarios.length; a++) {
        if (this.editedItem.defesa1 === this.listaUsuarios[a].uid) {
          def1 = this.listaUsuarios[a]
        }
      }
      for (var b = 0; b < this.listaUsuarios.length; b++) {
        if (this.editedItem.defesa2 === this.listaUsuarios[b].uid) {
          def2 = this.listaUsuarios[b]
        }
      }
      for (var c = 0; c < this.listaUsuarios.length; c++) {
        if (this.editedItem.defesa3 === this.listaUsuarios[c].uid) {
          def3 = this.listaUsuarios[c]
        }
      }
      for (var d = 0; d < this.listaUsuarios.length; d++) {
        if (this.editedItem.defesa4 === this.listaUsuarios[d].uid) {
          def4 = this.listaUsuarios[d]
        }
      }  
      for (var e = 0; e < this.listaUsuarios.length; e++) {
        if (this.editedItem.oposicao1 === this.listaUsuarios[e].uid) {
          opo1 = this.listaUsuarios[e]
        }
      }
      for (var f = 0; f < this.listaUsuarios.length; f++) {
        if (this.editedItem.oposicao2 === this.listaUsuarios[f].uid) {
          opo2 = this.listaUsuarios[f]
        }
      }
      for (var g = 0; g < this.listaUsuarios.length; g++) {
        if (this.editedItem.oposicao3 === this.listaUsuarios[g].uid) {
          opo3 = this.listaUsuarios[g]
        }
      }
      for (var h = 0; h < this.listaUsuarios.length; h++) {
        if (this.editedItem.oposicao4 === this.listaUsuarios[h].uid) {
          opo4 = this.listaUsuarios[h]
        }
      }   
      for (var h = 0; h < this.listaUsuarios.length; h++) {
        if (this.editedItem.juizes1 === this.listaUsuarios[h].uid) {
          jui1 = this.listaUsuarios[h]
        }
      }
      for (var h = 0; h < this.listaUsuarios.length; h++) {
        if (this.editedItem.juizes2 === this.listaUsuarios[h].uid) {
          jui2 = this.listaUsuarios[h]
        }
      }
      for (var h = 0; h < this.listaUsuarios.length; h++) {
        if (this.editedItem.juizes3 === this.listaUsuarios[h].uid) {
          jui3 = this.listaUsuarios[h]
        }
      }
      for (var h = 0; h < this.listaUsuarios.length; h++) {
        if (this.editedItem.juizes4 === this.listaUsuarios[h].uid) {
          jui4 = this.listaUsuarios[h]
        }
      }
      for (var h = 0; h < this.listaUsuarios.length; h++) {
        if (this.editedItem.juizes5 === this.listaUsuarios[h].uid) {
          jui5 = this.listaUsuarios[h]
        }
      }

      if (this.editedIndex > -1) {
        var listaMyDebates = this.listaMyDebates
          Object.assign(listaMyDebates[this.editedIndex], this.editedItem)
          for (var i = 0; i < listaMyDebates.length; i++) {
            if (listaMyDebates[i].uidposts == this.editedItem.uidposts) {
              var uidpos = listaMyDebates[i].uidposts
              firebase.database().ref('posts/' + uidpos).update({
                defesa1: def1,
                defesa2: def2,
                defesa3: def3,
                defesa4: def4, 
                oposicao1: opo1,
                oposicao2: opo2,
                oposicao3: opo3,
                oposicao4: opo4,
                juizes1: jui1,
                juizes2: jui2,
                juizes3: jui3,
                juizes4: jui4,
                juizes5: jui5,
                transmissao: this.prefix + this.editedItem.transmissao})
              firebase.database().ref('/posts/' + uidpos + '/status/media').update(
                                                                                  {
                                                                                    mediaDef1: 50,
                                                                                    mediaDef2: 50,
                                                                                    mediaDef3: 50,
                                                                                    mediaDef4: 50,
                                                                                    mediaOpo1: 50,
                                                                                    mediaOpo2: 50,
                                                                                    mediaOpo3: 50,
                                                                                    mediaOpo4: 50
                                                                                  }) 
            } 
          }
      } 
      this.alertDeb = true
      this.sairEdtDeb()
    }
  }
}
</script>

<style>
    .cab {
      background-color: #ccc;
    }
    .card-examples
    .q-card {
      width: 300px;
      border-radius: 1em
    }
    .card {
      padding: 3%;
      margin: 5%
    }
    .imgemCard {
      object-fit: cover;
      width: auto;
      height: 10em;
      border-radius: 1em
    }

</style>