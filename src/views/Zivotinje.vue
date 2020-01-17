<template>
  <div class="životinje">
    <div class="container">
      <input v-model="searchTerm" class="search form-control mr-sm-2" type="search" placeholder="Broj životinje" aria-label="Search">
      
      
      
      <router-link :to="'dodaj_zivotinju'">
        <button class="btn btn-success">Dodaj zivotinju</button>
      </router-link>
      
      

      <transition name="pokazi">
        <h3 class="obavijest" v-if="obavijest" > Zivotinja obrisana </h3>
      </transition>

      
        <transition-group name="brisanje">
          <ul v-for="zivotinja in filteredCards" :key="zivotinja.id" class="brisanje-group">
            <li class="brisanje-group-item">
              <div class="parametri">Broj: <b>{{zivotinja.broj}}</b></div>
              <div class="parametri">Pasmina: <b>{{zivotinja.pasmina}}</b></div>
              <div class="parametri">Datum rodenja: <b>{{zivotinja.datumRodenja}}</b></div>

              <router-link class="lijecenje" :to="{ name: 'tretmani', params: {brojZivotinje: zivotinja.broj} }">
              <i class="fas fa-notes-medical fa-lg" title="Pregled tretmana"></i>
              </router-link>

              <router-link class="urediZivLink" :to="{ name: 'uredi_zivotinju', params: {id: zivotinja.id } }">
                <i class="fas fa-edit fa-lg" title="Dodatno/ Edit"></i>
              </router-link>

              <i @click="obrisiZivotinju(zivotinja.id, zivotinja.broj, zivotinja.nastamba)" class="fas fa-trash-alt fa-lg" title="Obriši"></i>
              
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
      zivotinje: [],
      obavijest: false,
      searchTerm:''
      
    }
  },
  methods: {
    //metoda za brisanje životinje, prima broj životinje, ime nastambe i id te životinje
    obrisiZivotinju(id, broj, nastamba){

      //biršemo sve tretmane odabrane životinje
      db.collection('tretmani').where('brojZivotinje','==',Number(broj)).get()
        .then((querySnapshot) =>{
          querySnapshot.forEach((doc) =>{
            doc.ref.delete();
          })
        })
          //povečavamo broj slobodnih mjesta nastambi u koju je životinja bila smještne
          db.collection('nastambe').where('ime','==',nastamba.toLowerCase()).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                let idNastambe = doc.id
                let inc = doc.data().slobodnaMjesta
                inc++
                db.collection('nastambe').doc(idNastambe).update({
                  slobodnaMjesta: inc
                })
              })
            })

            //brišemo životinju
            db.collection('zivotinje').doc(id).delete()
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
     citaj(){
       //slušamo tablicu zivotinje
        let ref = db.collection('zivotinje')
          ref.onSnapshot(snapshot =>{
            snapshot.docChanges().forEach( change =>{
              
              //u slučaju da je element dodan renderamo ga na stranici
              if (change.type === "added"){
                let doc = change.doc
                let zivotinja = doc.data()
                zivotinja.id = doc.id
                this.zivotinje.push(zivotinja)
              }
              //u slučaju da je izbrisan brišemo ga stranice
              else if(change.type === "removed"){
                this.zivotinje = this.zivotinje.filter(zivotinje => {
                  return zivotinje.id != change.doc.id
                })
              }              
            })
          })
    
     }
  },
  //u ciklusu created pozivamo funkciju čitaj koja dobavlja sve podatke
  created() {
    this.citaj() 
  },
  computed: {
    filteredCards() {
      return this.zivotinje.filter(zivotinja => zivotinja.broj.includes(this.searchTerm));
    }
  },
   
}
</script>


<style lang="css" scoped>

  .životinje{
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

  .search{
    width: 300px;
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

  .urediZivLink, .lijecenje{
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
