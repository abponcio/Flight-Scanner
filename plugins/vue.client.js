import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Datepicker from 'vuejs-datepicker'
import VueToastr from 'vue-toastr'
import VueRangeSlider from 'vue-range-component'
import Multiselect from 'vue-multiselect'

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

/**
 * Vue Range Slider
 * https://github.com/xwpongithub/vue-range-slider
 */
Vue.component('VueRangeSlider', VueRangeSlider)

/**
 * Vue Multiselect
 * https://vue-multiselect.js.org/
 */
Vue.component('multiselect', Multiselect)
