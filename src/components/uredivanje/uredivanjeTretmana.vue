<template>
    <div class="container">

        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        <form>
            <div class="row">
                <div class="col">
                    <input v-model="tretman.lijek" type="text" class="form-control" placeholder="Broj životinje" disabled>
                </div>
                <div class="col">
                    <input v-model="tretman.datumPocetka" type="date" class="form-control" placeholder="Prehrana">
                    <input v-model="tretman.datumZavrsetka" type="date" class="form-control" placeholder="Datum rođenja">
                </div>              
            </div>
            <button @click.prevent="unesiPodatke" class="btn btn-primary my-1">Spremmi</button>
        </form>
    </div>
</template>


<script>
import db from '@/firebase/init'

export default {
    data() {
        return {
            tretman:{}
        }
    },
    created() {
        let ref = db.collection('tretmani').doc(this.$route.params.id)
        ref.get().then((doc) =>{
               this.tretman = doc.data()
      });
            
     
    },
    methods: {
        unesiPodatke(){
            db.collection('tretmani').doc(this.$route.params.id).update({
                         datumPocetka: this.tretman.datumPocetka,
                         datumZavrsetka: this.tretman.datumZavrsetka
                     }).then(() =>{
                        this.$router.go(-1)
                        
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

    .btn{
    margin-bottom: 10px;
  }
</style>