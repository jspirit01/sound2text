<template>
  <v-container class="login-body">
  
    <v-form 
      ref="form"
      class="login-form"
    >
    <div style="margin-bottom:5px">본 실험에서는 효과음 등의 소리를 의성어 형태로 텍스트로 전사하는 모델 학습을 위한 데이터셋 어노테이션을 수행합니다. 수집된 데이터셋은 외부로 공개되지 않으며 연구 목적으로만 사용됩니다.</div>
    <div style="margin-bottom:30px">(In this experiment, you perform data annotation for training a model that transcribes sound into onomatopoeic expressions. The collected dataset will NOT be publicly released and will be used for research purposes only.)</div>
    
    <div style="margin-bottom:10px; color:#f75b5b;">
      <span>** 어노테이션 시 유의사항 (Notes for annotation) **</span>
      <li>음성 녹음 시, 샘플 오디오와 <b>'같은 길이'</b>로 녹음해주세요. (Record your voice 'the same length' as the sample audio.)</li>
      <li>텍스트 입력 시, 최소한 <b>자음+모음</b> 이상의 조합으로 작성해주세요. (Write text with a combination of consonants and vowels.)
       <br>ex) "와ㅏㅏㅏ"(X) &#8594; "와아아아"(O)</li>
      <li>성의 없는 어노테이션에 대해서는 실험비 지급이 제한될 수 있으니 성실히 수행해주세요. (Participation Reward may be limited for careless annotation, so please perform the task diligently.)</li>
      <li>텍스트 입력 시, 언어는 상관 없습니다. (You can use any language. (Korean or English)) </li>
    </div>

    <div style="margin-top:40px; margin-bottom:20px">참여자 이름을 입력하고 'START'를 누르세요. <br>(Please enter your name as a participant and press 'START'.)</div>
      <!-- <v-text-field
        class="login-field"
        name="login"
        label="E-mail"
        v-model="email"
        type="text"
        hint="ex: nick@example.com"
        variant="outlined"
        persistent-hint
        required
      ></v-text-field> -->
      
      <v-text-field
        class="login-field"
        id="nickname"
        name="nickname"
        label="이름 (Name)"
        v-model= "nickname"
        type="text"
        variant="outlined"
        persistent-hint
        required
      ></v-text-field>
      <!-- <v-text-field
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
      ></v-text-field> -->
    <v-btn 
      @click="validate()"
      variant="outlined"
      style="margin-top:10px;"
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

// import { signInAnonymously } from 'firebase/auth'
// import { signInWithCustomToken } from 'firebase/auth'


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

      // (( Anonymously ))
      //  signInAnonymously(auth)
      //   .then(() => { 
      //     // Signed in..
      //     // updateProfile(result.user, {
      //     //   displayName: this.nickname
      //     // })

      //     alert('Thank you for join !')
      //     this.$router.replace('example')
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     console.log(errorCode, errorMessage)
      //     // ...
      //   });


      // (( Email + password ))
      // createUserWithEmailAndPassword(auth, this.email, this.birth, this.nickname).then((result) =>{
      //   // Sign up

      //   // set nickname
      //   updateProfile(result.user, {
      //     displayName: this.nickname
      //   })

      //   alert('Thank you for join !')
      //   this.$router.replace('example')
      // })
      // .catch(() => {
        
      //   // const auth = getAuth();
      //   signInWithEmailAndPassword(auth, this.email, this.birth).then(() => {
      //     // Signed in
      //     alert('Thank you for join !')
      //     this.$router.replace('example')
      //     // ...
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     console.log(errorCode, errorMessage)
      //     alert("Check your e-mail or password again.")
      //   }) 
      // });
      

      // (( HACK (nickname + password) ))
       createUserWithEmailAndPassword(auth, this.nickname+'@sound2text.com', "20235371", this.nickname).then((result) =>{
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
        signInWithEmailAndPassword(auth, this.nickname+'@sound2text.com', "20235371").then(() => {
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
  font-size: 1rem
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

li{
    list-style-position : inside;
    margin-left: 18px;
    text-indent: -18px;
    /* list-style-position : outside : 기본값 */
    margin-bottom: 10px;
}
</style>

