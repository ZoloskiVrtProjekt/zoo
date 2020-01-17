import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged:'',
    posao:'',
    kosarica:[]
  },
  getters:{
    
  },
  mutations: {
    postaviLoged(state, status) {
      state.logged = status;
    },
    postaviPosao(state, status) {
      state.posao = status;
    },

    addToCart(state, proizvod){
      let naden = false
      if(state.kosarica.length==0){
        state.kosarica.push(proizvod)
      }else{
        for( let i=0; i<state.kosarica.length; i++){

          if(state.kosarica[i].naziv==proizvod.naziv){
            naden = true
            state.kosarica[i].kolicina++
          }
        }
        if(!naden){
          state.kosarica.push(proizvod)
        }
      }
    },
    isprazniKosaricu(state,stanje){
      state.kosarica=stanje    }
  },
  actions: {
  },
  modules: {
  }
})
