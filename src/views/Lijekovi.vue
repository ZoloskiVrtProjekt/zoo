<template>
  <div class="lijekovi">
    <div class="container">
      
      <router-link :to="'dodaj_lijek'">
        <button class="btn btn-success">Dodaj lijek</button>
      </router-link> 
      
      

      <transition name="pokazi">
        <h3 class="obavijest" v-if="obavijest" > Lijek obrisan </h3>
      </transition>

      
        <transition-group name="brisanje">
          <ul v-for="lijek in lijekovi" :key="lijek.id" class="brisanje-group">
            <li class="brisanje-group-item">
              <div class="parametri">Ime: <b>{{lijek.ime}}</b></div>
              <div class="parametri">Tip: <b>{{lijek.tip}}</b></div>

              <i @click="obrisiLijek(lijek.id)" class="fas fa-trash-alt fa-lg" title="Obriši"></i>
              
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
      lijekovi: [],
      obavijest: false,
      
    }
  },
  methods: {
    obrisiLijek(id){
      db.collection('lijekovi').doc(id).delete()
      .then(() =>{
        this.obavijestObrisano()
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

    dohvatiPodatke(){
       // uzmemo tablicu zivotinje, dohvatimo ju i za svaki dokument(element tablice) spremimo podatke i id
      db.collection('lijekovi')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {

          if (change.type === "added"){
            let doc = change.doc
            let lijek = doc.data()
            lijek.id = doc.id
            this.lijekovi.push(lijek)
          }
          else if(change.type === "removed"){
              this.lijekovi = this.lijekovi.filter(lijekovi => {
                return lijekovi.id != change.doc.id
              })
          } 

        })
      })
    }

  },
  created() {
    this.dohvatiPodatke()
  },
  
   
}
</script>

<style lang="css" scoped>

  .lijekovi{
    font-family: 'Roboto', sans-serif;
  }

  .container{
    padding-top: 15px;
    padding-bottom: 15px;
    
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