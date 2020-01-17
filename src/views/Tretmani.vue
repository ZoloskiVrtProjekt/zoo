<template>
  <div class="tretmani">
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
     
      <router-link class="tretman" :to="{ name: 'dodaj_tretman', params: {brojZivotinje: this.$route.params.brojZivotinje } }">
            <button class="btn btn-success">Dodaj tretman</button>
        </router-link>
      

      <transition name="pokazi">
        <h3 class="obavijest" v-if="obavijest" > Lijek obrisan </h3>
      </transition>

      
        <transition-group name="brisanje">
          <ul v-for="tretman in tretmani" :key="tretman.id" class="brisanje-group">
            <li class="brisanje-group-item">
              <div class="parametri">Lijek: <b>{{tretman.lijek}}</b></div>
              <div class="parametri">Datum pocetka: <b>{{tretman.datumPocetka}}</b></div>
              <div class="parametri">Datum zavrsetka: <b>{{tretman.datumZavrsetka}}</b></div>

              <router-link class="urediTretmanLink" :to="{ name: 'uredi_tretman', params: {id: tretman.id } }">
                <i class="fas fa-edit fa-lg" title="Dodatno/ Edit"></i>
              </router-link>

              <i @click="obrisiTretman(tretman.id)" class="fas fa-trash-alt fa-lg" title="Obriši"></i>
              
            </li>
          </ul>
        </transition-group>        
        
        
      
    </div>    

  </div>
</template>

<script>
// @ is an alias to /src
import db from '@/firebase/init'


export default {
  data(){
    return{
      tretmani: [],
      obavijest: false,
      
    }
  },
   methods: {
     //brišemo tretman sa prosljeđenim id-jem u bazi
    obrisiTretman(id){
      db.collection('tretmani').doc(id).delete()
      .then(() =>{
        this.obavijestObrisano()
          //brišemo tretman sa stranice
          this.tretmani = this.tretmani.filter(tretmani => {
            return tretmani.id != id
          })
      })
    },
    obavijestObrisano(){
      setTimeout(() =>{
        this.obavijest = true
       },1000)
      
      setTimeout(() => {
        this.obavijest = false
      }, 3000);
     },
     citaj(){
       // dohvaćamo sve tretmane za odabranu životinju
      db.collection('tretmani').where('brojZivotinje','==',Number(this.$route.params.brojZivotinje))
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {

            if (change.type === "added"){
              let doc = change.doc
              let tretman = doc.data()
              tretman.id = doc.id
              this.tretmani.push(tretman)
            }
            else if(change.type === "removed"){
              this.tretmani = this.tretmani.filter(tretmani => {
                return tretmani.id != change.doc.id
              })
            }

          });
        })
      }

  },
  created() {
       this.citaj()
    
    
  },
   
}
</script>

<style lang="css" scoped>

  .tretmani{
    font-family: 'Roboto', sans-serif;
  }

  .container{
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .nazad{
    text-align:right
  }

  .btn{
    margin-bottom: 10px;
  }

  .brisanje-group{
    padding-inline-start: 0px;
  }

  .brisanje-group-item{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px rgba(2, 117, 21, 0.438) solid;
    border-radius: 5px;
    background-color: rgb(101, 247, 101);
    padding: 15px 10px; 
  }

  .parametri{
    margin: 0 4px;
    width: 25%;
    margin-top: auto;
    margin-bottom: auto;
  }

  i{
    margin-right: 4px;
    margin-top: auto;
    margin-bottom: auto;
    cursor:pointer;  
  }

  i:hover{
    color:#007bff;
  }

  .urediTretmanLink{
    color:black;
    width: 24px;
    height: 22px;
    margin-top: auto;
    margin-bottom: auto;
  }

  .obavijest{
    text-align: center;
    color:red;
    
  }

  .pokazi-enter, .pokazi-leave{
    opacity: 0;
  }

  .pokazi-enter-active, .pokazi-leave-active{
    transition: opacity 1s;
  }
  
  .brisanje-leave-active {
    transition: all 1s;
  }
  
  .brisanje-leave-to /* .brisanje-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(30px);
  }

</style>