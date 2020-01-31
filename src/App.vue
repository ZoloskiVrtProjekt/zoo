<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light">

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>

      <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul  class="navbar-nav">
          <li v-if="$store.state.logged" class="nav-item">
            <router-link class="nav-link" to="/zivotinje"><strong>Životinje</strong></router-link>
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
            <router-link class="nav-link" to="/"><strong>Webshop</strong></router-link>
          </li>         
          
        </ul>
        <ul class="navbar-nav">
          
        </ul>
        <ul class="navbar-nav">
          <li v-if="$store.state.logged" @click="changePassword" class="nav-link"><strong>Promjeni lozinku</strong></li>

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
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

export default {
  methods: {
    // nakon što se odjavimo u Vuex store-u pozivamo mutatacije postaviPosao i postaviLogged kako bi 
    // postavili da korisnik nije ulogiran te pushali na login stranicu
    signOut(){
      firebase.auth().signOut()
      this.$store.commit("postaviLogged", false);
      this.$store.commit("postaviPosao", false);
      this.$router.push('login')
      return
    },
    changePassword(){
      Swal.fire({
        title: 'Želite li promjeniti lozinku?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Želim'
      }).then((result) => {
        if (result.value) {
          var email = firebase.auth().currentUser.email
          var auth = firebase.auth();
            auth.sendPasswordResetEmail(email)
          Swal.fire(
            'Poslano!',
            'Provjerite svoj email sandučić'
          )
        }
      })
      
    }
  },
}
</script>

<style lang="css" scoped>  
  
#app{
  background-image: linear-gradient( rgba(142, 248, 142, 0.527), rgba(103, 205, 0, 0.521));
  height: 100vh;
  overflow: auto;
}

.navbar{
  background-color: rgba(13, 170, 13, 0.815);
  border: 1px rgba(58, 207, 58, 0.404) solid;
  font-size: 18px; 
}

.nav-link:hover{
  cursor: pointer;
  
}

.nav-link:active{
  border-radius: 25px;
  background-color: rgb(9, 126, 9);

}




strong{
  color:white;
}
</style>
