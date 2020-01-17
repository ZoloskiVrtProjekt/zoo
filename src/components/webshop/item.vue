<template>
        <div class="col-3">
            <div class="card">
                <img class="card-img-top img-fluid" :src="info.urlSlike" alt="Card image cap">
                <div class="card-block">
                    <p class="card-title">{{info.naziv}}</p>
                    <p class="card-text"> {{info.cijena}} Kn</p>
                    <i v-if="$store.state.logged" @click="obrisiProizvod(info.id)" class="fas fa-trash-alt fa-lg" title="Obriši"></i>
                    <i v-if="!$store.state.logged" @click="dodajUKosaricu" class="fas fa-plus fa-lg" title="Dodaj u košaricu"></i>
                </div>
            </div>
        </div>
</template>

<script>
import db from '@/firebase/init'


export default {
    data(){
        return{
            obavijest:''
        }
    },
    props:["info"],
    methods: {
        obrisiProizvod(id){
            db.collection('proizvodi').doc(id).delete()
            .then(() =>{
                this.obavijestObrisano()
            })
        },
        obavijestObrisano(){
            setTimeout(() =>{
                this.obavijest = true
            },1000)
            
            setTimeout(() => {
                this.obavijest = false
            }, 3000);
        },
        dodajUKosaricu(){
            let pro = {}
            pro.id = this.info.id
            pro.naziv = this.info.naziv
            pro.cijena = this.info.cijena
            pro.nazivSlike = this.info.nazivSlike
            pro.urlSlike = this.info.urlSlike
            pro.kolicina = 1
            this.$store.commit("addToCart", pro);
        }
    }
}
</script>



<style lang="css">

    .card-img-top{
        width: 100%;
        height: 200px;
        object-fit:fill;
    }

    .card-block{
        border-top: 1.5px rgba(31, 63, 31, 0.404) solid;
        background-color: rgb(101, 247, 101);
        text-align: center;
    }

    .card-title{
        margin-bottom: 0px;
    }

    .card{
        width: 25vw;
        margin-top: 15px;
        border: 2px rgba(18, 36, 18, 0.555) solid;
        box-shadow: 4px 5px #4e4e4e44;
    }


    i{
        margin-right: 4px;
        margin-top: auto;
        margin-bottom: auto;
        cursor:pointer;
    }

    i:hover{
        color:#007bff;
    }

    p{
        text-align: center;
        font-size: 21px;
        margin-left: 5px;
        margin-bottom: 5px;
    }


    .row > div[class*='col-'] {
    display: flex;
}

</style>