<template>
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        <div class="naslov">
            <h2>Uređivanje podataka</h2>
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
                    <input v-model="zivotinja.broj" type="number" class="form-control" placeholder="Broj životinje" disabled>
                    <input v-model="zivotinja.ime" type="text" class="form-control" placeholder="Ime">
                    <input v-model="zivotinja.pasmina" type="text" class="form-control" placeholder="Pasmina">
                    <input v-model="zivotinja.tezina" type="number" class="form-control" placeholder="Težina">
                </div>
                <div class="col">
                    
                    <select v-model="zivotinja.nastamba" class="form-control" placeholder="Lijek">
                        <option selected hidden>{{this.zivotinja.nastamba}}</option>
                        <option value="">Odaberite nastambu</option>
                        <option v-for="nastamba in nastambe" :key="nastamba.id">{{capitalizeFirstLetter(nastamba.ime)}}</option>  
                    </select>
                    <input v-model="zivotinja.prehrana" type="text" class="form-control" placeholder="Prehrana">
                    <input v-model="zivotinja.datumRodenja" type="date" class="form-control" placeholder="Datum rođenja">
                    <input v-model="zivotinja.datumDolazka" type="date" class="form-control" placeholder="Datum dolazka u zoo">
                </div>              
            </div>
            <button @click.prevent="upisiPodatke" class="btn btn-primary my-1">Spremmi</button>
        </form>
    </div>
</template>


<script>
import db from '@/firebase/init'

export default {
    data() {
        return {
            error:'',
            success:'',
            zivotinja:{},
            nastambaOld:'',
            nastambe:[]
        }
    },
    created() {
        this.dohvatiZivotinju
    },
    methods: {
        dohvatiZivotinju(){
            let ziv = db.collection('zivotinje').doc(this.$route.params.id)
            ziv.get().then((doc) =>{
                this.zivotinja = doc.data()
                this.nastambaOld = doc.data().nastamba 
            });
            let nast = db.collection('nastambe').where('slobodnaMjesta','>',0)
                nast.get().then(snapshot => {
                    snapshot.forEach(doc => {
                    let nastamba = doc.data()
                    this.nastambe.push(nastamba)
                });
            }) 
        },
        podatciUneseni(){
            for(var key in this.zivotinja){
                if(!this.zivotinja[key]){ 
                    return true
                }
            }
            return false
        },
        upisiPodatke(){
            if(this.podatciUneseni()){
                this.error= 'Sva polja moraju biti popunjena'
            }
            else{
                if(this.nastambaOld !== this.zivotinja.nastamba){
                    db.collection('nastambe').where('ime','==',this.nastambaOld.toLowerCase()).get()
                        .then((querySnapshot) =>{
                            querySnapshot.forEach((doc) =>{                             
                                let id = doc.id
                                let inc = doc.data().slobodnaMjesta
                                inc++
                                    db.collection('nastambe').doc(id).update({
                                        slobodnaMjesta: inc
                                    })
                                    
                            })
                        })
                    db.collection('nastambe').where('ime','==',this.zivotinja.nastamba.toLowerCase()).get()
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
                }
                db.collection('zivotinje').doc(this.$route.params.id).update(this.zivotinja)
                .then(() =>{
                    this.$router.push('/')
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
</style>