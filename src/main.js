import { createApp } from 'vue'
// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import jQuery from 'jquery'

import './styles/app.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import YouTube from 'vue3-youtube'
// import { createManager } from '@vue-youtube/core';
// import YoutubeVue3 from 'youtube-vue3'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

library.add(fas)

loadFonts()
createApp(App)
  .use(router)
  .use(vuetify)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('YouTube', YouTube)
  // .use(createManager())
  // .use(YoutubeVue3)
  .mount('#app')




global.$ = jQuery