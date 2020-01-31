<template>
    <div class="container">

        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>

        <div class="naslov">
            <h2>Košarica</h2>
        </div>
        <div v-if="error" class="error">
            <h3>{{error}}</h3>
        </div>
        
        <div class="row">
            <div class="col">
                <div class="proizvodiUKosarici" v-for="proizvod in kosarica" :key="proizvod.id">
                    <div>
                        Naziv: <b>{{proizvod.naziv}}</b>
                    </div>
                    <div>
                        Količina: 
                        <i @click="plus(proizvod)" class="fas fa-plus"></i>
                            <b>{{proizvod.kolicina}}</b>
                        <i @click="minus(proizvod)" class="fas fa-minus"></i>
                    </div>
                    <div>
                        Cijena jednog komada prizvoda: <b>{{proizvod.cijena}} kn</b>
                    </div>
                    <button class="btn btn-danger" @click="izbrisi(proizvod.id, proizvod.cijena, proizvod.kolicina)"> ukloni</button>
                </div>
            </div>
            

            <div class="col">
                Ukupna cijena: <b>{{UkupnaCijena}} kn</b>
                <div class="row">
                    <div class="col">
                        <input v-model="kupac.ime" type="text" class="form-control" placeholder="Ime">
                    </div>
                    <div class="col">
                        <input v-model="kupac.prezime" type="text" class="form-control" placeholder="Prezime">
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <input v-model="kupac.email" type="email" class="form-control" placeholder="E-mail">
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input v-model="kupac.adresa" type="text" class="form-control" placeholder="Adresa">
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <input v-model="kupac.grad" type="text" class="form-control" placeholder="Grad">
                    </div>
                    <div class="col">
                        <input v-model="kupac.postanskiBroj" type="number" class="form-control" placeholder="Postanski Broj">
                    </div>
                </div>
                <button class="naruci btn btn-success" @click="naruci">Naruči</button>
            </div>
        </div>
        
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

export default {
    data(){
        return{
            kosarica: this.$store.state.kosarica,
            UkupnaCijena: 0,
            kupac:{
                ime:'',
                prezime:'',
                adresa:'',
                postanskiBroj:'',
                grad:'',
                email:''
            },
            error: '',
            
            
        }
    },
    methods: {
        dohvatiKosaricu(){
            for( let i=0; i<this.kosarica.length; i++){
                this.UkupnaCijena += this.kosarica[i].kolicina * this.kosarica[i].cijena
            }
        },
        podatciUneseni(){
            for(var key in this.kupac){
                if(!this.kupac[key]){ 
                    return true
                }
            }
            return false
        },
        plus(proizvod){
            if(proizvod.kolicina++<100){
                proizvod.kolicina
                this.UkupnaCijena += 1*proizvod.cijena
            }else{
                proizvod.kolicina=100
            }
        },
        minus(proizvod){
            if(proizvod.kolicina-->1){
                proizvod.kolicina
                this.UkupnaCijena -= 1*proizvod.cijena
            }else{
                proizvod.kolicina=1
            }
        },
        naruci(){
            if(this.podatciUneseni()){
                this.error= 'Sva polja moraju biti popunjena'
            }else{
                    db.collection('narudzbe').add({
                        kosarica: this.kosarica,
                        kupac: this.kupac,
                        ukupnaCijena: this.UkupnaCijena,
                        poslano: 'ne',
                        vrijeme: Date.now()
                    }).then(() =>{

                    var naslov = "Uspješna NARUDŽBA"
                    var poruka = "Zaprimili smo vašu narudžbu, obavjestit ćemo vas kada pošaljemo narudžbu "

                    var addMessage = firebase.functions().httpsCallable('sendMail');
                            addMessage({mail: this.kupac.email, naslovEmaila: naslov, porukaEmaila: poruka}).then(() => {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Provjerite email sandučić',
                                    showConfirmButton: true,

                                    })
                            });

                    this.$store.commit("isprazniKosaricu", []);
                    this.$router.push('/')
                })
            }
            
        },
        izbrisi(id, cijena, kolicina){
            this.UkupnaCijena -= cijena * kolicina
            this.$store.commit("izbaciIzKosarice", id);
            this.kosarica = this.kosarica.filter(kosarica => {
            return kosarica.id != id
          })
        }
    },
    created() {
        this.dohvatiKosaricu()        
    },
}
</script>

<style lang="css">

    .btn{
        margin-top: 10px;
    }

    .kolicina{
        width: 50px
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .container{
        padding: 15px 0;
    }

    .proizvodiUKosarici{
        margin: 10px 0;
    }

    .naruci{
        margin: 5px 0;
    }

    input{
        margin: 5px 0;
    }

    i{
        margin: 0 5px;
    }

    .nazad{
        text-align:right
    }

    .naslov{
        text-align: center;
    }

    .error{
        color:red;
        text-align: center;
    }
</style>