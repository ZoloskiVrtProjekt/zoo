<template>
 <div class="container">

    <router-link v-if="$store.state.logged" :to="'dodaj_item'">
        <button class="btn btn-success">Dodaj item</button>
    </router-link>

    <div  class="kosaricaIkona">
        <router-link :to="'kosarica'">
            <i class="fas fa-shopping-basket fa-2x"></i>
        </router-link>  
    </div>

    <div class="row">
        <item v-for="proizvod in proizvodi" :key="proizvod.id"
            :info="proizvod" />
    </div>
</div>
</template>

<script>
import item from '@/components/webshop/item'
import db from '@/firebase/init'
// import firebase from 'firebase'


export default {
    data(){
        return{
            proizvodi:[]
        }
    },
    components:{
        item
    },
    methods: {
        
        citaj(){
        db.collection('proizvodi')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
            if (change.type === "added"){
                let doc = change.doc
                let proizvod = doc.data()
                proizvod.id = doc.id
                this.proizvodi.push(proizvod)
            }
            else if(change.type === "removed"){

                this.proizvodi = this.proizvodi.filter(proizvodi => {
                return proizvodi.id != change.doc.id
                })
            } 
            });
        })
     },
     
    },
    created() {
        this.citaj()
    },
}
</script>


<style lang="css" scoped>

    .btn{
        margin-top: 10px;
    }

    .kosaricaIkona{
        text-align: right;
    }

    .container{
        padding-top: 15px;
        padding-bottom: 15px;
        font-family: 'Roboto', sans-serif;
    }   

    .row {
    display: flex;
    flex-wrap: wrap;
    }

    i{
    color: black;
    }

    i:hover{
        color:#007bff;
    }



</style>