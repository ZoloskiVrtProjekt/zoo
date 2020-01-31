import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

import Zivotinje from '../views/Zivotinje.vue'
import Lijekovi from '../views/Lijekovi.vue'
import Tretmani from '../views/Tretmani.vue'
import Nastambe from '../views/Nastambe.vue'
import Narudzbe from '../views/Narudzbe.vue'
import Zaposlenici from '../views/Zaposlenici.vue'


import webshop from '@/components/webshop/shop'
import dodajItem from '@/components/webshop/dodajItem'
import kosarica from '@/components/webshop/kosarica'

import Login from '../views/Login.vue'

import dodajLijek from '../components/dodavanja/dodajLijek'
import dodajTretman from '../components/dodavanja/dodajTretman'
import dodajZivotinju from '../components/dodavanja/dodajZivotinju'
import dodajNastambu from '../components/dodavanja/dodajNastambu'
import dodajZaposlenika from '../components/dodavanja/dodajZaposlenika'


import urediZivotinju from '../components/uredivanje/uredivanjeZivotinje'
import urediTretman from '../components/uredivanje/uredivanjeTretmana'
import urediNastambu from '../components/uredivanje/uredivanjeNastambe'
import urediZaposlenika from '../components/uredivanje/uredivanjeZaposlenika'

Vue.use(VueRouter)


const routes = [
  {
    path: '/zivotinje',
    name: 'zivotinje',
    component: Zivotinje,
    meta:{
      loged:true,
      title: "Životinje"
    }
  },
  {
    path: '/',
    name: 'webshop',
    component: webshop,
    meta:{
      title: "Webshop"
    }
  },
  {
    path: '/kosarica',
    name: 'kosarica',
    component: kosarica,
    meta:{
      title: "Kosarica"
    }
  },
  {
    path: '/dodaj_item',
    name: 'dodaj_item',
    component: dodajItem,
    meta:{
      loged:true,
      title: "Webshop"
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      title: "Login"
    }
  },
  {
    path: '/lijekovi',
    name: 'lijekovi',
    component: Lijekovi,
    meta:{
      loged:true,
      title: "Lijekovi"
    }
  },
  {
    path: '/narudzbe',
    name: 'narudzbe',
    component: Narudzbe,
    meta:{
      loged:true,
      title: "Narudzbe"
    }
  },
  {
    path: '/dodaj_zivotinju',
    name: 'dodaj_zivotinju',
    component: dodajZivotinju,
    meta:{
      loged:true,
      title: "Dodaj životinju"
    }
  },
  {
    path: '/dodaj_lijek',
    name: 'dodaj_lijek',
    component: dodajLijek,
    meta:{
      loged:true,
      title: "Dodaj lijek"
    }
  },
  {
    path: '/tretmani/:brojZivotinje',
    name: 'tretmani',
    component: Tretmani,
    meta:{
      loged:true,
      title: "Tremani"
    }
  },
  {
    path: '/tretmani/:id',
    name: 'uredi_tretman',
    component: urediTretman,
    meta:{
      loged:true,
      title: "Uredi tretman"
    }
  },
  {
    path: '/tretmani/dodaj_tretman/:brojZivotinje',
    name: 'dodaj_tretman',
    component: dodajTretman,
    meta:{
      loged:true,
      title: "Dodaj tretman"
    }
  },
  {
    path: '/uredi_zivotinju/:id',
    name: 'uredi_zivotinju',
    component: urediZivotinju,
    meta:{
      loged:true,
      title: "Uredi životinju"
    }
  },
  {
    path: '/nastambe',
    name: 'nastambe',
    component: Nastambe,
    meta:{
      loged:true,
      title: "Nastambe"
    }
  },
  {
    path: '/dodaj_nastambu',
    name: 'dodaj_nastambu',
    component: dodajNastambu,
    meta:{
      loged:true,
      title: "Dodaj nastambu"
    }
  },
  {
    path: '/uredi_nastambu/:id',
    name: 'uredi_nastambu',
    component: urediNastambu,
    meta:{
      loged:true,
      title: "Uredi nastambu"
    }
  },
  {
    path: '/zaposlenici',
    name: 'zaposlenici',
    component: Zaposlenici,
    meta:{
      admin:true,
      title: "Zaposlenici"
    }
  },
  {
    path: '/dodaj_zaposlenika',
    name: 'dodaj_zaposlenika',
    component: dodajZaposlenika,
    meta:{
      admin:true,
      title: "Dodaj zaposlenika"
    }
  },
  {
    path: '/uredi_zaposlenika/:id', 
    name: 'uredi_zaposlenika',
    component: urediZaposlenika,
    meta:{
      admin:true,
      title: "Uredi podatke o zaposleniku"
    }
  },
  ]

const router = new VueRouter({

  base: process.env.BASE_URL,
  routes
})




router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  
  if(to.meta.loged){

    if(store.state.logged){
      next()
    }else{
      next('login')
    }

  }else if(to.meta.admin){

    if(store.state.posao == 'admin'){
      next()
    }else{
      next(false)
    }

  }else{
    next()
  }
})

export default router
