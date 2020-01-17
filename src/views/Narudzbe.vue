<template>
    <div class="container">
        <transition-group name="brisanje">
          <ul v-for="narudzba in orderBy(narudzbe, 'vrijeme', -1)" :key="narudzba.id" class="brisanje-group">
            <li class="brisanje-group-item">
                
            <div class="row">
                <div class="col">
                    <div v-for="pojedina in narudzba.kosarica" :key="pojedina.id" class="parametri">
                        <div class="detalji">
                            <div>Naziv: <b>{{pojedina.naziv}}</b></div> 
                            <div>Količina: <b>{{pojedina.kolicina}}</b></div> 
                        </div>
                    </div>
                </div>
              
                <div class="col">

                    <div class="row">
                        <div class="col">
                            <div class="parametri">Kupac: <b>{{narudzba.kupac.ime}} {{narudzba.kupac.prezime}}</b></div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div class="parametri">Adresa: <b>{{narudzba.kupac.adresa}}, {{narudzba.kupac.grad}}</b></div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <div class="parametri">Poštanski broj: <b>{{narudzba.kupac.postanskiBroj}}</b></div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <button @click="posalji(narudzba.kupac.email)" class="btn btn-success">Pošalji</button>
                    </div>
                </div>
            </div>
                          
            </li>
          </ul>
        </transition-group>  
    </div>
</template>

<script>
import db from '@/firebase/init'
import Vue2Filters from 'vue2-filters'
import firebase from 'firebase'



export default {
    data(){
    return{
      narudzbe: [],
      obavijest: false,
      error:''
    }
  },
    mixins: [Vue2Filters.mixin],
    methods:{
        citaj(){
            //slušamo tablicu narudzbe
            db.collection('narudzbe')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {

                //u slučaju da je element dodan renderamo ga na stranici
                if (change.type === "added"){
                    let doc = change.doc
                    let nastamba = doc.data()
                    nastamba.id = doc.id
                    this.narudzbe.push(nastamba)
                }

                //u slučaju da je izbrisan brišemo ga stranice
                else if(change.type === "removed"){
                    this.narudzbe = this.narudzbe.filter(narudzbe => {
                    return narudzbe.id != change.doc.id
                    })
                } 
                });
            })
        },
        posalji(email){
            var naslov = "Vaša NARUDŽBA je na putu"
            var poruka = "Pošljku možete očekivati unutar 2 radna tjedna, ovisno o mjestu stanovanja"

            var addMessage = firebase.functions().httpsCallable('sendMail');
                    addMessage({mail: email, naslovEmaila: naslov, porukaEmaila: poruka}).then(() => {
                        alert("Potvrda poslana");
                    });
        }
    },
    created() {
        this.citaj()
    },
}
</script>

<style lang="css">
    .container{
        padding-top: 15px;
        padding-bottom: 15px; 
    }

    .brisanje-group{
        padding-inline-start: 0px;
        list-style-type: none;
    }

    .brisanje-group-item{
        border: 1px rgba(2, 117, 21, 0.438) solid;
        border-radius: 5px;
        background-color: rgb(101, 247, 101);
        padding: 15px 10px;  
    }

    .detalji{
        margin: 5px 0;
        padding: 5px;
    }

</style>