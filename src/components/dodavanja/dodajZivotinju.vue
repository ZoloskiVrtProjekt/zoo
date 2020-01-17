<template>
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        
        <div class="naslov">
            <h2>Dodavanje životinje</h2>
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
                    <input v-model="zivotinja.broj" type="number" class="form-control" placeholder="Broj životinje">
                    <input v-model="zivotinja.ime" type="text" class="form-control" placeholder="Ime">
                    <input v-model="zivotinja.pasmina" type="text" class="form-control" placeholder="Pasmina">
                    <input v-model="zivotinja.tezina" type="number" class="form-control" placeholder="Težina">
                </div>
                <div class="col">
                    <select v-model="zivotinja.nastambaOdabir" class="form-control" placeholder="Lijek">
                        <option value="">Odaberite nastambu</option>
                        <option v-for="nastamba in nastambe" :key="nastamba.id">{{capitalizeFirstLetter(nastamba.ime)}}</option>  
                    </select>
                    <input v-model="zivotinja.prehrana" type="text" class="form-control" placeholder="Prehrana">
                    <input v-model="zivotinja.dob" type="date" class="form-control" placeholder="Datum rođenja">
                </div>              
            </div>
            <button @click.prevent="dataPostoji" class="btn btn-primary my-1">Dodaj</button>
        </form>
    </div>
</template> 

<script>
import db from '@/firebase/init'


export default {
    name:'dodaj_zivotinju',
    data(){
        return{
            error:'',
            success:'',
            dodana:'',
            nastambe:[],
            zivotinja:{
                broj:'',
                ime:'',
                pasmina:'',
                nastambaOdabir:'',
                tezina:'',
                prehrana:'',
                dob:'',
                
            }
            
        }
    },
    created() {
        //dohvaćamo sve nastambe u kojima ima slobodnih mjesta
        let ref = db.collection('nastambe').where('slobodnaMjesta','>',0)
            ref.get().then(snapshot => {
                snapshot.forEach(doc => {
                let nastamba = doc.data()
                this.nastambe.push(nastamba)
            });
        })
    },
    methods: {
        //provjeravamo dali su sva polja unesena
        validTest(){
            for(var key in this.zivotinja){
                if(!this.zivotinja[key]){ 
                    return true
                }
            }
            return false
        },

        dataPostoji(){
            this.success=''
            this.error=''
            
            //provjera popunjenost
            if(this.validTest()){
                this.error= 'Sva polja moraju biti popunjena'
            }else{
                //ako životinja sa unesenim brojem već postoji izbaci nam error
                let ref = db.collection('zivotinje').where('broj','==',this.zivotinja.broj)
                ref.get().then((querySnapshot) =>{
                if(!querySnapshot.empty){
                    this.error= 'Životinja sa unesenim brojem već postoji'
                }else{
                    this.error = ''

                    //dodajemo životinju
                    db.collection('zivotinje').add({
                        broj: this.zivotinja.broj,
                        ime: this.zivotinja.ime,
                        pasmina: this.zivotinja.pasmina,
                        tezina: this.zivotinja.tezina,
                        prehrana: this.zivotinja.prehrana,
                        datumRodenja: this.zivotinja.dob,
                        nastamba: this.zivotinja.nastambaOdabir.toLowerCase()
                    }).then(() =>{

                        //smanjujemo broj slobodnih mjesta nastambe u koju smo smjestili životinju
                        db.collection('nastambe').where('ime','==',this.zivotinja.nastambaOdabir.toLowerCase()).get()
                            .then((querySnapshot) =>{
                                querySnapshot.forEach((doc) =>{                             
                                    let id = doc.id
                                    let dec = doc.data().slobodnaMjesta
                                    dec--
                                        db.collection('nastambe').doc(id).update({
                                            slobodnaMjesta: dec
                                        })
                                    
                                })
                            })
                        this.success= 'Zivotinja dodana'
                        
                    })
                }
            })
            }
            
            
        },


        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }


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