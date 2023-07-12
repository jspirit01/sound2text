<template>
  <v-container >
    <div class="finish-instruction"> 
    <div>실험에 참여해주셔서 감사드립니다.</div>
    <div>어노테이션을 모두 마치셨다면 아래 링크로 들어가 간단한 설문을 마쳐주세요.</div>
    <div>아래 설문까지 마치셔야 정보 확인 후 실험비를 지급해드리니 꼭 설문에 참여해주세요!!</div>
    
    </div>
    <div class="finish-instruction"> 
    <div>Thank you for participating in the experiment.</div>
    <div>Please follow the link below to complete a short survey</div> 
    <!-- and we will provide you with a confirmation code.</div> -->
    <div>It is important that you complete the survey so that we can process the payment for your participation. Please make sure to participate in the survey!</div>
    </div>
    <div class="finish-div">Your Worker ID: <span>{{workerid}}</span> </div>
    <div class="finish-div">Google Form Link : <a href="https://forms.gle/1VncV7PcCGgf6gTHA" target="_blank">click here!</a></div>

    
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';
import { auth } from '../firebase/init'

export default defineComponent({
    name: 'HomeView',
    
    components: {
        // HelloWorld,
    },

    data: () => ({
        workerid: ""
    }),
    created() {
        const user = auth.currentUser;
        this.workerid = user.displayName
    },
    methods: {
    
    }
});
</script>

<style>
.finish-instruction {
    margin-top: 20px;
    margin-bottom: 20px;
}
.finish-div {
    margin-top: 10px;
}
a:hover {
    background-color: gold;
    color: black;
}
</style>
