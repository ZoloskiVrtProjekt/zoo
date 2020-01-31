<template>
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        <div class="naslov">
            <h2>Dodavanje lijeka</h2>
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
                    <input v-model="lijek.ime" type="string" class="form-control" placeholder="Ime Lijeka">
                </div>
                <div class="col">
                    <input v-model="lijek.tip" type="string" class="form-control" placeholder="Tip lijeka">
                </div>              
            </div>
            <button @click.prevent="upisiPodatke" class="btn btn-primary my-1">Dodaj</button>
        </form>
    </div>
</template> 

<script>
import db from '@/firebase/init'
import slugify from 'slugify'


export default {
    name:'dodaj_lijek',
    data(){
        return{
            error:'',
            success:'',
            dodana:'',
            lijek:{
                tip:'',
                ime:'',
            }
            
        }
    },
    methods: {
        podatciUneseni(){
            for(var key in this.lijek){
                if(!this.lijek[key]){ 
                    return true
                }
            }
            return false
        },

        upisiPodatke(){
            this.success=''
            this.error=''
            
            if(this.podatciUneseni()){
                this.error= 'Sva polja moraju biti popunjena'
            }else{

                //imenu lijeka uklanjamo sve znakove, razmake pretvaramo u - i sve prebacujemo u mala slova
                let id = slugify(this.lijek.ime,{
                    replacement: '-',
                    remove: /[*+~.()'"!:@]/g
                })
                //ako lijek sa unesenim id-em (slug imena) već postoji izbaci nam error
                let ref = db.collection('lijekovi').doc(id)
                ref.get().then((doc) =>{
                if(doc.exists){
                    this.error= 'Lijek već postoji'
                }else{
                    this.error = ''
                    //dodajemo novi lijek
                     db.collection('lijekovi').doc(id).set(this.lijek)
                     .then(() =>{
                        this.success= 'Lijek dodan'
                        
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