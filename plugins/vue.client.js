import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Datepicker from 'vuejs-datepicker'
import VueToastr from 'vue-toastr'

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

/**
 * Vue Toast plugin
 * https://github.com/s4l1h/vue-toastr
 */
Vue.use(VueToastr, {
  defaultTimeout: 5000,
})
