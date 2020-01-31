<template>
    <div class="container">
        <div class="nazad">
            <button class="btn btn-danger" @click="$router.go(-1)">Nazad</button>
        </div>
        <div class="naslov">
            <h2>Uređivanje nastambe</h2>
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
                    <input v-model="nastamba.ime" type="string" class="form-control" placeholder="Ime nastambe" disabled>
                </div>
                <div class="col">
                    <input v-model="nastamba.tip" type="string" class="form-control" placeholder="Tip nastambe">
                    <input v-model="nastamba.brojMjesta" type="number" class="form-control" placeholder="Broj mjesta">
                </div>              
            </div>
            <button @click.prevent="unesiPodatke" class="btn btn-primary my-1">Dodaj</button>
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
            nastamba:{},
            mjestaOld:'',
            nastambe:[]
        }
    },
    created() {
        let nast = db.collection('nastambe').doc(this.$route.params.id)
        nast.get().then((doc) =>{
               this.nastamba = doc.data()
               this.mjestaOld = doc.data().brojMjesta 
        });
     
    },
    methods: {
        podatciUneseni(){
            for(var key in this.zivotinja){
                if(!this.zivotinja[key]){ 
                    return true
                }
            }
            return false
        },
        unesiPodatke(){
            this.success=''
            this.error=''
            let razlika= Number
            
            if(this.podatciUneseni()){
                this.error= 'Sva polja moraju biti popunjena'
            }else{
                        if(this.nastamba.brojMjesta !== this.mjestaOld){
                            razlika = this.nastamba.brojMjesta - this.mjestaOld

                            if((this.nastamba.slobodnaMjesta+razlika)<0){
                                this.error = "Previše životinja u nastambi da bi se toliko smanjilo"
                                return
                            }

                        }else{
                            razlika = 0
                        }
                        this.error = ''
                        db.collection('nastambe').doc(this.$route.params.id).update({
                            tip: this.nastamba.tip,
                            brojMjesta: Number(this.mjestaOld)+ razlika,
                            slobodnaMjesta: Number(this.nastamba.slobodnaMjesta) + razlika
                        }).then(() =>{
                            this.success= 'Lijek dodan'
                        })    
                }
            },
        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }            
    }
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