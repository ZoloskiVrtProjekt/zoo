<template>
    <div class="container">
        <div class="narudzbe-btn">
            <button @click="promjeni('ne')" class="btn btn-light">Ne poslane</button>
            <button @click="promjeni('da')" class="btn btn-light">Poslane</button>
        </div>
        <transition-group name="brisanje">
          <ul v-for="narudzba in orderBy(filtriraneNarudzbe, 'vrijeme', -1)" :key="narudzba.id" class="brisanje-group">
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
                    
                    <div v-if="narudzba.poslano!=='da'" class="row">
                        <button @click="posaljiEmail(narudzba.kupac.email, narudzba.id)" class="btn btn-success">Pošalji</button>
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
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'



export default {
    data(){
    return{
      narudzbe: [],
      obavijest: false,
      error:'',
      search: 'ne'
    }
  },
    mixins: [Vue2Filters.mixin],
    methods:{
        promjeni(val){
            this.search= val
        },
    
        posaljiEmail(email, id){
            db.collection('narudzbe').doc(id).update({
                poslano: 'da'
            })
            var naslov = "Vaša NARUDŽBA je na putu"
            var poruka = "Pošljku možete očekivati unutar 2 radna tjedna, ovisno o mjestu stanovanja"

            var addMessage = firebase.functions().httpsCallable('sendMail');
                    addMessage({mail: email, naslovEmaila: naslov, porukaEmaila: poruka}).then(() => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Email poslan',
                            showConfirmButton: false,
                            timer: 2000
                            })
                    });
        }
    },
    firestore(){
        return{
            narudzbe: db.collection('narudzbe')
        }
    },
    computed:{
        filtriraneNarudzbe(){
            return this.narudzbe.filter(narudzba => narudzba.poslano==this.search);
        }
    }
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

    .narudzbe-btn{
        text-align: center;
    }

    .btn-light{
        margin: 10px 10px
    }

</style>
