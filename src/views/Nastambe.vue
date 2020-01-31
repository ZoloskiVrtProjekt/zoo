<template>
  <div class="nastambe">
    <div class="container">
      <input v-model="searchTerm" class="search form-control mr-sm-2" type="search" placeholder="Naziv nastambe" aria-label="Search">
      
      <router-link :to="'dodaj_nastambu'">
        <button class="btn btn-success">Dodaj nastambu</button>
      </router-link>

      <div v-if="error" class="error">
            <h3>{{error}}</h3>
        </div>
      
      

      <transition name="pokazi">
        <h3 class="obavijest" v-if="obavijest" > Nastamba obrisana </h3>
      </transition>

      
        <transition-group name="brisanje">
          <ul v-for="nastamba in filtriraneNastambe" :key="nastamba.id" class="brisanje-group">
            <li class="brisanje-group-item">
              <div class="parametri">Ime: <b>{{nastamba.ime}}</b></div>
              <div class="parametri">Tip: <b>{{nastamba.tip}}</b></div>
              <div class="parametri">Slobodna mjesta: <b>{{nastamba.slobodnaMjesta}}</b></div>


               <router-link class="urediNastmbuLink" :to="{ name: 'uredi_nastambu', params: {id: nastamba.id } }">
                <i class="fas fa-edit fa-lg" title="Dodatno/ Edit"></i>
              </router-link>

              <i @click="obrisiNastambu(nastamba.id, nastamba.ime)" class="fas fa-trash-alt fa-lg" title="Obriši"></i>
              
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
      nastambe: [],
      obavijest: false,
      error:'',
      searchTerm:''
      
    }
  },
  methods: {
    obrisiNastambu(id, ime){
      db.collection('zivotinje').where('nastamba','==',ime.toLowerCase()).get()
        .then((querySnapshot) =>{
          //ako nastamba koju želimo izbrisati nije prazna javlja se error
          if(!querySnapshot.empty){
            this.error = 'U nastambi se nalaze životinje'
          }
          else{
            //u suprotnom se briše
            db.collection('nastambe').doc(id).delete()
              .then(() =>{
                this.obavijestObrisano()
              })
          }
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
      //slušamo tablicu nastambe
      db.collection('nastambe')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {

          //u slučaju da je element dodan renderamo ga na stranici
          if (change.type === "added"){
            let doc = change.doc
            let nastamba = doc.data()
            nastamba.id = doc.id
            this.nastambe.push(nastamba)
          }

          //u slučaju da je izbrisan brišemo ga stranice
          else if(change.type === "removed"){
            this.nastambe = this.nastambe.filter(nastambe => {
              return nastambe.id != change.doc.id
            })
          } 
        });
      })
    }
  },
  computed: {
    filtriraneNastambe() {
      return this.nastambe.filter(nastamba => nastamba.ime.includes(this.searchTerm));
    }
  },
//u ciklusu created pozivamo funkciju čitaj koja dobavlja sve podatke
  created() {
    this.dohvatiPodatke()
  },
   
}
</script>
<style lang="css" scoped>

  .nastambe{
    font-family: 'Roboto', sans-serif;
  }

  .container{
    padding-top: 15px;
    padding-bottom: 15px;
    
  }

  .btn{
    margin-bottom: 10px;
  }

  .search{
    width: 300px;
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

  .urediNastmbuLink{
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
