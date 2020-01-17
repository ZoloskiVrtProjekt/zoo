<template>
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        <div class="naslov">
            <h2>Dodaj zaposlenika</h2>
        </div>

        <div v-if="success" class="success">
            <h3>{{success}}</h3>
        </div>

        <div v-if="feedback"> {{feedback}} </div>
        <form>
            <div class="row">
                <div class="col">
                    <input v-model="email" type="text" class="form-control" placeholder="Email">
                    <input v-model="password" type="password" class="form-control" placeholder="Passoword">

                    <select v-model="osoba.posao" class="form-control" placeholder="Posao">
                        <option value="">Odaberite posao</option>
                        <option v-for="posao in poslovi" :key="posao.id">{{posao}}</option>  
                    </select>

                </div>
                <div class="col">
                    <input v-model="osoba.ime" type="text" class="form-control" placeholder="Ime">
                    <input v-model="osoba.prezime" type="text" class="form-control" placeholder="Prezime">
                    <input v-model="osoba.brojMobitela" type="text" class="form-control" placeholder="Broj mobitela">
                    <input v-model="osoba.adresa" type="text" class="form-control" placeholder="adresa">
                </div>              
            </div>
            <button @click.prevent="signUp" class="btn btn-primary my-1">Dodaj</button>
        </form>
    </div>
</template>


<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import slugify from 'slugify'


export default {
    data(){
        return{
            poslovi:['zaposlenik','admin'],
            osoba:{
                ime:'',
                prezime:'',
                brojMobitela:'',
                adresa:'',
                posao:''
            },
            email:'',
            password:'',
            feedback:'',
            success:''
        }
    },
    methods: {
        signUp(){
            if(this.validTest()){
                this.feedback= 'Unesite sva polja'
            }
            else{
                //iz varijable email brišemo sve znakove, umjesto razmaka stavljamo - i pretvaramo sve u mala slova
                this.slug= slugify(this.email,{
                    replacement:'-',
                    remove: /[*+~.()'"!:@]/g,
                    lower: true
                })
                //u slučaju da već postoji zaposlenik sa unesenim emailom izabci error
                const ref = db.collection('zaposlenici').doc(this.slug)
                ref.get().then(doc=>{
                    if(doc.exists){
                        this.feedback= 'Postoji'
                    }else
                    {
                       var createUser = firebase.functions().httpsCallable('createUser');
                        createUser({email: this.email, password: this.password})
                        .then(() => {
                            ref.set({
                                    email: this.email,
                                    password: this.password,
                                    ime:this.osoba.ime,
                                    prezime:this.osoba.prezime,
                                    posao:this.osoba.posao,
                                    adresa:this.osoba.adresa,
                                    brojMobitela: this.osoba.brojMobitela 
                                }).then(()=>{
                                    this.osoba= '',
                                    this.password = '',
                                    this.email = ''
                                    this.success = 'Zaposlenik dodan'
                                    setTimeout(()=>{
                                        this.vrati()
                                    },1500)
                                })
                        });
                    }
                })
            }

            
        },
        vrati(){
            this.$router.go(-1)
        },
        validTest(){
            for(var key in this.osoba){
                if(!this.osoba[key]){ 
                    return true
                }
            }
            return false
        }
    },
}
</script>

<style lang="css" scoped>

    .container{
        padding-top: 15px;
        padding-bottom: 15px;   
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

    select{
        margin:15px 0;
    }
</style>