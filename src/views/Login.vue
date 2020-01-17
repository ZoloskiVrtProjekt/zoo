<template>
    <div>
        <div v-if="feedback"> {{feedback}} </div>
        <form>
           
                <div class="col-12">
                    <input v-model="email" type="email" class="form-control" placeholder="Email">
                    <input v-model="password" type="password" class="form-control" placeholder="Password">
                    <button @click.prevent="logIn()" class="btn btn-primary my-1">Login</button>
                </div>         
            
            
        </form>
    </div>
</template>


<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    data(){
        return{
            email:'',
            password:'',
            feedback:''
        }
    },
    methods: {
        //metoda za login
        logIn(){
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(cred =>{
                //nakon login-a pozivamo mutaciju postaviLoged i prosljeđujemo mail usera
                this.$store.commit("postaviLoged", cred.user.email);

                //u tablici zaposlenici odabiremo polje sa mailom prijavljenoe osobe
                db.collection('zaposlenici').where('email','==',cred.user.email)
                    .get().then(snapshot => {
                        snapshot.forEach(doc => {
                            //te zovemo mutaciji posatviPosao i prosljeđujemo posao te osobe
                            this.$store.commit("postaviPosao", doc.data().posao);
                            //redirectamo usera na stranicu životinje
                            this.$router.push('/')
                        })
                    })
            })
            //ako postoji error postavimo varijablu feedback kao poruku errora
            .catch(error =>{
                this.feedback = error.message
            })
            

        }
    },
}
</script>

<style lang="css" scoped>
    .container{
        padding-top: 15px;
        padding-bottom: 15px; 
    }
    .col-12{
        margin-left: auto;
        margin-right: auto;
        width: 40%;
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