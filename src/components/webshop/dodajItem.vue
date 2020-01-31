<template>
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        <div class="naslov">
            <h2>Dodavanje proizvoda</h2>
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
                    <input v-model="proizvod.naziv" type="string" class="form-control" placeholder="Naziv proizvoda">
                    <input v-model="proizvod.cijena" type="number" class="form-control" placeholder="Cijena proizvoda">
                </div>
                <div class="col">
                    <input type="file" @change="postaviImg" class="form-control" placeholder="Tip nastambe">
                </div>              
            </div>
            <button @click.prevent="upisiPodatke" class="btn btn-primary my-1">Dodaj</button>
        </form>
    </div>
</template> 

<script>
import db from '@/firebase/init'
import firebase from 'firebase'




export default {
    name:'dodaj_proizvod',
    data(){
        return{
            img:'',
            error:'',
            success:'',
            dodana:'',
            proizvod:{
                naziv:'',
                cijena:'',
                urlSlike:'',
                nazivSlike:''
            }
            
        }
    },
    methods: {
        postaviImg(e){
            this.img= e.target.files[0]
        },
        upisiPodatke(){
            var storageRef = firebase.storage().ref('slike/' + this.img.name);

            var uploadTask = storageRef.put(this.img)
            
                uploadTask.on('state_changed', () =>{
                }, 
                (error) =>{
                    this.error = error
                }, 
                () =>{
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{
                        this.proizvod.urlSlike = downloadURL

                        this.success=''
                        this.error=''
                            if(this.validTest()){
                            this.error= 'Sva polja moraju biti popunjena'
                        }else{
                            let ref = db.collection('proizvodi').where('naziv','==',this.proizvod.naziv.toLowerCase())
                            ref.get().then((querySnapshot) =>{
                                if(!querySnapshot.empty){
                                    this.error= 'Proizvod postoji'

                                }else{
                                    this.error = ''
                                    db.collection('proizvodi').add({
                                        naziv: this.proizvod.naziv,
                                        cijena: this.proizvod.cijena,
                                        urlSlike: this.proizvod.urlSlike,
                                        nazivSlike: this.img.name
                                    }).then(() =>{
                                        this.success= 'Proizvod dodan'
                                        
                                        })
                                }
                            })
                        }
                    });
                });
            
        },
        validTest(){
                if(!this.proizvod.naziv){ 
                    return true
                }
            return false
        },


    },
}
</script>

<style lang="css" scoped>
    .container{
        padding: 15px 0;
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