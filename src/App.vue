<template>
  <v-app>
    <v-app-bar>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-toolbar-title >SoundLabels</v-toolbar-title>
      <v-list-item link @click="gohome()">Home</v-list-item>
      <v-list-item link @click="$router.push('/example')">Annotation</v-list-item>
      <!-- <v-list-item link @click="$router.push('/admin')">Admin</v-list-item> -->
      <!-- <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn> -->
      <!-- <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn> -->
      <!-- <v-col cols="auto">
            <v-switch
              inset
              color="info"
              v-model="darkMode"
              @change="toggleTheme()"
              :label="`It's ${darkMode ? 'Dark' : 'Light'}!`"
            ></v-switch>
          </v-col> -->
    </v-app-bar>
    
    <v-main>
      <router-view/>
    </v-main>
    <v-footer color="primary" dark center app class="text-white text-center d-flex flex-column">
      <v-spacer/>Soft Computing & Interaction Lab. | contact: jspirit01@gm.gist.ac.kr
    </v-footer>
  </v-app>
</template>
// <script setup>
// import { ref } from "vue";
// import { useTheme } from "vuetify";

// const theme = useTheme();
// const darkMode = ref(false);

// const toggleTheme = () => {
//   theme.global.name.value = darkMode.value ? "dark" : "light";
//   // Optional: Get value of current theme
//   // console.log(`Current theme is dark? ${theme.global.current.value.dark}`);
// };
// </script>
<script>


export default {
name: 'App',
  components:{
    
  },

  data: () => ({
    //
  }),
  methods: {
    gohome(){
      var result = confirm("홈으로 가면 모든 작업이 초기화됩니다. 그래도 가시겠습니까?")
      if(result){
        this.$router.push('/')
      }
      
    }
  }
  
}
</script>


<style>
@import "https://use.fontawesome.com/releases/v5.12.1/css/all.css";
#app{
  color:white;
  width: 100%;
}
 

 @media(max-width: 580px) {
  #app {
    width: fit-content;
  }
}
</style>