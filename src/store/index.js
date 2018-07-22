import Vue from 'vue' 
import Vuex from 'vuex' 

import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      email: '',
      uid: ''
    },
    usuario: {
      email: '',
      uid: '',
      name: '',
      foto: '' 
    },
    listaDebates: [],
    listaUsuarios: [],
    listaMyDebates: [],
    loading: false,
    error: null
  },
  mutations: {
    setUser (state, payload) {
        state.user = payload
      },     
    setUsuario (state, payload) {
        state.usuario = payload
      }, 
    setListaDebates (state, listaDebates) {
        state.listaDebates.push(listaDebates)
      }, 
    setListaMyDebates (state, listaMyDebates) {
        state.listaMyDebates.push(listaMyDebates)
      },  
    setListaUsuarios (state, listaUsuarios) {
        state.listaUsuarios.push(listaUsuarios)
      },   
    setLoading (state, payload) {
        state.loading = payload
      },
    setError (state, payload) {
        state.error = payload
      },
    clearError (state) {
        state.error = null
      }
  },
  actions: {
    signUserUp ({commit}, payload) {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              const newUser = {
                email: user.user.email,
                uid: user.user.uid,
              }
              commit('setUser', newUser)
              
              window.localStorage.setItem('user', JSON.stringify({email: newUser.email, uid: newUser.uid }))  
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
              console.log(error)
            }
          )
    },
    signUserIn ({commit, getters}, payload) {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              var newUser = {
                email: user.user.email,
                uid: user.user.uid,
              }
              commit('setUser', newUser)
              window.localStorage.setItem('user', JSON.stringify({email: newUser.email, uid: newUser.uid})) 
              var user = getters.user
              var useruid = user.uid
              var userlogado = firebase.database().ref('/usuarios/' + useruid + '/user').on('value', function(snapshot) {
              var item = snapshot.val()
              commit('setUsuario', item) 
              window.localStorage.setItem('usuario', JSON.stringify(item))
              })
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
            }
          )
      })
    },
    setarUsuarios ({getters, commit}) {
      var user = getters.user
      var useruid = user.uid
      var userlogado = firebase.database().ref('/usuarios/' + useruid + '/user').on('value', function(snapshot) {
      var item = snapshot.val()
      commit('setUsuario', item) 
      window.localStorage.setItem('usuario', JSON.stringify(item))
      })
    },
    carregarUsuario ({commit}) {
        var userLocal = window.localStorage.getItem('user') 
        commit('setUser', JSON.parse(userLocal))
        var userLocal = window.localStorage.getItem('usuario') 
        commit('setUsuario', JSON.parse(userLocal))
    },
    carregaDebates ({getters, commit}) {
      const listaDebates = getters.listaDebates
      firebase.database().ref('posts').on('value', function(snapshot) {
        var item = snapshot.val()
        var arr = Object.keys(item).map(function (key) { return item[key]})
        listaDebates.length = 0
        for (var j = 0; j < arr.length; j++) {
              var key = Object.keys(arr[j])    
            commit('setListaDebates', arr[j])
            
        }
        
    })
  },
  carregaMyDebates ({getters, commit}) {
    const listaMyDebates = getters.listaMyDebates
    var uid = getters.user.uid
    firebase.database().ref('posts').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]})
      listaMyDebates.length = 0
      for (var j = 0; j < arr.length; j++) {
        if (arr[j].uiduser === uid) {
          commit('setListaMyDebates', arr[j])
          }
      }
      
  })
},
  carregaListaUsuario ({getters, commit}) {
    const listaUsuarios = getters.listaUsuarios
    firebase.database().ref('usuarios').on('value', function(snapshot) {
      var item = snapshot.val()
      var arr = Object.keys(item).map(function (key) { return item[key]; })
      listaUsuarios.length = 0
      for (var j = 0; j < arr.length; j++) {
        commit('setListaUsuarios', arr[j].user) 
        }
  })

},
    logout ({commit}) {
        firebase.auth().signOut()
        commit('setUser', null)
        commit('setUsuario', null)
        window.localStorage.removeItem('user')
        window.localStorage.removeItem('usuario')
    }, 
    clearError ({commit}) {
        commit('clearError')
    }
  },
  getters: {
      user (state) {
        return state.user
      },
      usuario (state) {
        return state.usuario
      },
      listaDebates (state) {
        return state.listaDebates
      },
      listaMyDebates (state) {
        return state.listaMyDebates
      },
      listaUsuarios (state) {
        return state.listaUsuarios
      },
      loading (state) {
        return state.loading
      },
      error (state) {
        return state.error
      }
  }
})