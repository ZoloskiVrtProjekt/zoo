<template>
    <div class="container">
        <div v-if="success" class="success">
            <h3>{{success}}</h3>
        </div>

        <div v-if="error" class="error">
            <h3>{{error}}</h3>
        </div>

        <input v-model="searchTerm" class="search form-control mr-sm-2" type="search" placeholder="Ime zaposlenika" aria-label="Search">
        <router-link v-if="$store.state.posao=='admin'" :to="'dodaj_zaposlenika'">
            <button class="btn btn-success">Dodaj zaposlenika</button>
        </router-link>

        <transition-group name="brisanje">
            <ul v-for="zaposlenik in filteredCards" :key="zaposlenik.id" class="brisanje-group">
            <li class="brisanje-group-item">
                <div class="parametri">Ime: <b>{{zaposlenik.ime}}</b></div>
                <div class="parametri">Prezime: <b>{{zaposlenik.prezime}}</b></div>
                <div class="parametri">Broj Mobitela: <b>{{zaposlenik.brojMobitela}}</b></div>

                <router-link class="urediZaposlenikaLink" :to="{ name: 'uredi_zaposlenika', params: {id: zaposlenik.id } }">
                    <i class="fas fa-edit fa-lg" title="Dodatno/ Edit"></i>
                </router-link>

                <i @click="obrisiZaposlenika(zaposlenik.email, zaposlenik.password)" class="fas fa-trash-alt fa-lg" title="Obriši"></i>
            </li>
        </ul>
        </transition-group>
        
      
    </div>
</template>


<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
    data(){
        return{
            zaposlenici:[],
            searchTerm:'',
            success:'',
            error:''
        }
    },
    methods: {
        dohvatiPodatke(){
        // uzmemo tablicu zivotinje, dohvatimo ju i za svaki dokument(element tablice) spremimo podatke i id
            let ref = db.collection('zaposlenici')
            ref.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {

                    if (change.type === "added"){
                    let doc = change.doc
                    let zaposlenik = doc.data()
                    zaposlenik.id = doc.id
                    this.zaposlenici.push(zaposlenik)
                    }
                    else if(change.type === "removed"){
                        this.zaposlenici = this.zaposlenici.filter(zaposlenici => {
                            return zaposlenici.id != change.doc.id
                        })
                    } 
                })
            })
        },
        obrisiZaposlenika(email){
            if(firebase.auth().currentUser.email==email || email=='domi@gmail.com'){
                this.error = 'Nemoguće izbrisat korisnika'
                setTimeout(()=>{
                    this.postaviPraznoError()
                },2000)
            }
            else{
                //iz varijable email brišemo sve znakove, umjesto razmaka stavljamo - i pretvaramo sve u mala slova
                this.slug = slugify(email,{
                    replacement:'-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true
                })
                //dohvaćamo tablicu zaposlenici, te odabiremo dokument sa id-jem gore navedenog slug-a
                //te zatim brišemo odabrani dokument
                db.collection('zaposlenici').doc(this.slug).delete().then(() =>{

                    var deleteUser = firebase.functions().httpsCallable('deleteUser');
                        deleteUser({email: email}).then(()=>{
                            this.success = 'Zaposlenik obrisan'
                            setTimeout(()=>{
                                this.postaviPraznoSuccess()
                            },2000)
                        })            
                })
            }     
        },
        postaviPraznoSuccess(){
            this.success = ''
        },
        postaviPraznoError(){
            this.error = ''
        }
    },
    created() {
       this.dohvatiPodatke()
    },

    computed: {
    filteredCards() {
      return this.zaposlenici.filter(zaposlenik => zaposlenik.ime.includes(this.searchTerm));
    }
  },
    
    
}
</script>

<style lang="css" scoped>

    .container{
        padding-top: 15px;
        padding-bottom: 15px;
        font-family: 'Roboto', sans-serif;
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

    .izbrisi{
        float: right;
    }

    .btn{
        margin-bottom: 10px;
    }

    .nazad{
        text-align:right
    }

    .error{
        color:red;
        text-align: center;
    }

    .success{
        color:rgb(6, 209, 6);
        text-align: center;
    }

    .naslov{
        text-align: center;
    }
    
    input{
        margin: 15px 0;
    }

    .search{
        width: 300px;
    }

    select{
        margin:15px 0;
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


  .urediZaposlenikaLink{
    color:black;
    width: 24px;
    height: 22px;
    margin-top: auto;
    margin-bottom: auto;
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