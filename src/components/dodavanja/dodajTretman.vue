<template>
    <div class="container">

        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>

        <div class="naslov">
            <h2>Dodavanje tretmana</h2>
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
                    <select v-model="tretman.lijek" class="form-control" placeholder="Lijek">
                        <option value="">Odaberite lijek</option>
                        <option v-for="lijek in lijekovi" :key="lijek">{{lijek}}</option>  
                    </select>
                </div>
                <div class="col">
                    <input v-model="tretman.datumPocetka" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" class="form-control" placeholder="Datum pocetka">
                    <input v-model="tretman.datumZavrsetka" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" class="form-control" placeholder="Datum zavrsetka">
                </div>              
            </div>
            <button @click.prevent="upisiPodatke" class="btn btn-primary my-1">Dodaj</button>
        </form>
    </div>
</template> 

<script>
import db from '@/firebase/init'


export default {
    name:'dodaj_tretman',
    data(){
        return{
            error:'',
            success:'',
            dodana:'',
            lijekovi:[],
            tretman:{
                datumPocetka:'',
                datumZavrsetka:'',
                lijek:'',
                
            }
            
        }
    },
    methods: {
        podatciUneseni(){
            for(var key in this.tretman){
                if(!this.tretman[key]){ 
                    return true
                }
            }
            return false
        },

        upisiPodatke(){
            this.success=''
            this.error=''
            //u slučaju da se pokuša dodati tretman za nepostojeću životinju nas redirecta na stranicu životinje
            db.collection('zivotinje').where('broj','==',this.$route.params.brojZivotinje).get()
            .then((querySnapshot) =>{
                console.log(querySnapshot)
                if(querySnapshot.empty){
                    this.error= 'Životinja više ne postoji'
                     setTimeout(() =>{
                        this.$router.push( '/' )
                    },1500)
                    
                    
                }else if(this.podatciUneseni()){
                this.error= 'Sva polja moraju biti popunjena'
                }
                //datum početka tretmana ne može biti nakon završetka
                else if(this.tretman.datumPocetka>this.tretman.datumZavrsetka){
                    this.error="Datum početka ne može biti veći od datuma kraja"
                }
                else{
                    this.error = ''
                    //u tablicu tretmani dodajemo novi tretman
                     db.collection('tretmani').add({
                         brojZivotinje: Number(this.$route.params.brojZivotinje),
                         lijek: this.tretman.lijek,
                         datumPocetka: this.tretman.datumPocetka,
                         datumZavrsetka: this.tretman.datumZavrsetka,
                     }).then(() =>{
                        this.success= 'Tretman dodan'
                        
                    })
                }
            })
            
            
            
            
            
            
        },


    },

    created() {
        //u ciklusu created dohvaćamo sve ljekove
        db.collection('lijekovi').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let lijek = doc.data().ime
                this.lijekovi.push(lijek)
            });
        })
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