<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light">

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>

      <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul  class="navbar-nav">
          <li v-if="$store.state.logged" class="nav-item">
            <router-link class="nav-link" to="/"><strong>Životinje</strong></router-link>
          </li>

          <li v-if="$store.state.logged" class="nav-item" >
           <router-link class="nav-link" to="/lijekovi"><strong>Lijekovi</strong></router-link>
          </li>

         <li v-if="$store.state.logged" class="nav-item">
            <router-link class="nav-link" to="/nastambe"><strong>Nastambe</strong></router-link>
          </li>

         <li v-if="$store.state.logged" class="nav-item">
            <router-link class="nav-link" to="/narudzbe"><strong>Narudžbe</strong></router-link>
          </li>

         <li v-if="$store.state.posao=='admin'" class="nav-item">
            <router-link  class="nav-link" to="/zaposlenici"><strong>Zaposlenici</strong></router-link>
          </li> 
          <li class="nav-item">
            <router-link class="nav-link" to="/webshop"><strong>Webshop</strong></router-link>
          </li>         
          
        </ul>
        <ul class="navbar-nav">
          
        </ul>
        <ul class="navbar-nav">
          <li v-if="$store.state.logged" class="nav-item">
            <button class="btn btn-light my-2 my-sm-0 mr-2" @click.prevent="signOut">Odjava</button>
          </li>
          <li v-if="!$store.state.logged" class="nav-item">
            <router-link :to="'login'">
              <button class="btn btn-light">Log in</button>
            </router-link>
          </li>
        </ul>
     
      </div>
      
      
    </nav>
    
    <router-view/>
     
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  methods: {
    // nakon što se odjavimo u Vuex stor-u pozivamo mutatacije postaviLoged i postaviLoged kako bi 
    // postavili da korisnik nije ulogiran te pushali na login stranicu
    signOut(){
      firebase.auth().signOut()
      this.$store.commit("postaviLoged", false);
      this.$store.commit("postaviPosao", false);
      this.$router.push('login')
      return
  }
  },
}
</script>

<style lang="css" scoped>  
  
#app{
  background-image: linear-gradient( rgba(142, 248, 142, 0.527), rgba(58, 100, 58, 0.527));
  height: 100vh;
  overflow: auto;
}

.navbar{
  background-color: rgba(101, 247, 101, 0.692);
  border: 1px rgba(148, 228, 148, 0.404) solid;
  font-size: 18px; 
}
</style>
