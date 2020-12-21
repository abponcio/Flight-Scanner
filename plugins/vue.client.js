import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Datepicker from 'vuejs-datepicker'

/**
 * Validation Plugin
 * https://github.com/vuelidate/vuelidate
 *
 */
Vue.use(Vuelidate)

/**
 * Vue Datepicker Plugin
 * https://github.com/charliekassel/vuejs-datepicker
 */
Vue.component('Datepicker', Datepicker)
