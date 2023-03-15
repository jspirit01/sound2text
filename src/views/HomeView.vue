<template>
  <v-container class="login-body">
    
    <v-form 
      ref="form"
      class="login-form"
    >
    <div style="margin-bottom:20px">Tell me who you are</div>
      <v-text-field
        class="login-field"
        name="login"
        label="E-mail"
        v-model="email"
        type="text"
        hint="ex: nick@example.com"
        variant="outlined"
        persistent-hint
        required
      ></v-text-field>
      
      <v-text-field
        class="login-field"
        id="nickname"
        name="nickname"
        label="Nickname"
        v-model= "nickname"
        type="text"
        hint="ex: nick"
        variant="outlined"
        persistent-hint
        required
      ></v-text-field>
      <v-text-field
        class="login-field"
        id="birth"
        name="birth"
        label="Birth (password)"
        v-model= "birth"
        type="number"
        hint="ex: 950427"
        variant="outlined"
        persistent-hint
        required
      ></v-text-field>
    <v-btn 
      @click="validate()"
      variant="outlined"
      style="margin-top:30px;"
    > 
      START 
    </v-btn>
    </v-form>
    
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';
import { auth } from '../firebase/init'     // 이거로 하면 안됨. ->밑에거로 되다 안되다 함.... 
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";

// Components
// import HelloWorld from '../components/HelloWorld.vue';

export default defineComponent({
  name: 'HomeView',
  
  components: {
    // HelloWorld,
  },

  data: () => ({
    valid: false,
    email: '',
    birth: '',
    nickname: ''
  }),

  methods: {
    validate () {

      // console.log('valid', this.$refs.form.validate())
      


      // const auth = getAuth();
      console.log(auth)
      createUserWithEmailAndPassword(auth, this.email, this.birth, this.nickname).then((result) =>{
        // Sign up

        // set nickname
        updateProfile(result.user, {
          displayName: this.nickname
        })

        alert('Thank you for join !')
        this.$router.replace('example')
      })
      .catch(() => {
        
        // const auth = getAuth();
        signInWithEmailAndPassword(auth, this.email, this.birth).then(() => {
          // Signed in
          alert('Thank you for join !')
          this.$router.replace('example')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
          alert("Check your e-mail or password again.")
        }) 
      });
      
   
      
      
    },
  }
});
</script>

<style>

.login-body{
font-family: arial;
  display: flex;
  justify-content: center;
  align-items: center;
}


.login-form{
  width: 450px;
  height: content;
  /* background-color: red; */
  /* 상하좌우 정중앙 정렬하기 */
  /* /* position: absolute; */
  
  top: 30%; 
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
}

.login-field{
  margin-bottom:15px;
}
</style>

