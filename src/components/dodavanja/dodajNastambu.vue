<template>
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        <div class="naslov">
            <h2>Dodavanje nastambe</h2>
        </div>
        <div v-if="error" class="error">
            <h3>{{error}}</h3>
        </div>
        <div v-if="success" class="success">
            <h3>{{success}}</h3>
        </div>
        
        
        <form>
            <div class="row">
                <div class="col">
                    <input v-model="nastamba.ime" type="string" class="form-control" placeholder="Ime nastambe">
                </div>
                <div class="col">
                    <input v-model="nastamba.tip" type="string" class="form-control" placeholder="Tip nastambe">
                    <input v-model="nastamba.brojMjesta" type="number" class="form-control" placeholder="Broj mjesta">
                </div>              
            </div>
            <button @click.prevent="dataPostoji" class="btn btn-primary my-1">Dodaj</button>
        </form>
    </div>
</template> 

<script>
import db from '@/firebase/init'




export default {
    name:'dodaj_lijek',
    data(){
        return{
            error:'',
            success:'',
            dodana:'',
            nastamba:{
                ime:'',
                tip:'',
                brojMjesta:''
            }
            
        }
    },
    methods: {
        validTest(){
            for(var key in this.nastamba){
                if(!this.nastamba[key]){ 
                    return true
                }
            }
            return false
        },

        dataPostoji(){
            this.success=''
            this.error=''
            
            if(this.validTest()){
                this.error= 'Sva polja moraju biti popunjena'
            }else{

                //u slučaju da pokušamo dodati nastambu sa već postojećim imenom izbaci nam error
                let ref = db.collection('nastambe').where('ime','==',this.nastamba.ime.toLowerCase())
                ref.get().then((querySnapshot) =>{
                if(!querySnapshot.empty){
                    this.error= 'Nastamba sa unesenim imenom već postoji'

                }else{
                    this.error = ''
                    //dodajemo novu nastambu
                     db.collection('nastambe').add({
                         ime: this.nastamba.ime.toLowerCase(),
                         tip: this.nastamba.tip,
                         brojMjesta: Number(this.nastamba.brojMjesta),
                         slobodnaMjesta: Number(this.nastamba.brojMjesta)
                     }).then(() =>{
                        this.success= 'Nastamba dodana'
                        
                    })
                }
            })
            }
            
            
        },


    },
}
</script>

<style lang="css" scoped>
     
     .container{
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .error{
        color:red;
        text-align: center;
    }

    .success{
        color:rgb(6, 209, 6);
        text-align: center;
    }

    .nazad{
        text-align:right
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