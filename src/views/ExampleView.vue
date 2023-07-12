<template>
<!-- <div class="example-body"> -->
<v-container fluid >
    
    <v-layout class="page-info" style="text-align:center;justify-content:centre">
        <span>{{sampleIdx}}</span> / <span>{{totalSampleNum}}</span>
        <span id='completed' style='color:red;margin-left:20px'>Incomplete</span>
    </v-layout>
    <v-layout class="example-container">
        <v-card class="content-container">
            <div class="video-content">
                <!-- <iframe id="youtube-player" width="560" height="315" :src="sampleInfo['url']" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture controls" allowfullscreen></iframe> -->
                <!-- <div id="youtube-container">
                    </div>
                    <YouTube 
                    id="youtube-player"
                    ref="youtube" 
                    :src="sampleInfo['url']"
                    :vars="playerVars"2
                    @state-change="onStateChanged"
                    /> -->
                <div style="font-size:1.2rem;"
                :style="{'margin-left': '10px', 'margin-bottom': '10px'}">Sample Sound</div>
                <audio id="audio-player"
                    controls type="audio/mpeg"
                    :style="{'margin-left': '10px'}"></audio>
                <!-- <button @click="onPause()"><font-awesome-icon icon="fa-solid fa-play" />STOP</button> -->
                <!-- <div class="tag-content"><v-chip v-for="(tag, idx) in sampleInfo.tags" :key="{idx}" color="secondary" variant="elevated" style="margin-right:7px;">#{{tag}}</v-chip></div> -->
                <!-- <v-btn class="btn-replay" @click="play()" variant="outlined" color="secondary"><font-awesome-icon icon="fa-solid fa-rotate-right" size="2x"/>PLAY</v-btn> -->
            </div>
            <hr>
            <div class="labeling-content">
                <div class="label-question">1. 소리를 듣고 들리는 대로 발음해보세요. <div class="label-question-eng">Record your voice pronouncing it as you hear the sample sound.</div></div>
                <div class="label-recording" style="height:80px;">
                    <!-- <div id="controls">
                    <v-btn id="recordButton" v-model="darkmode">Record</v-btn>
                    <v-btn id="stopButton" disabled>Stop</v-btn>
                    </div> -->
                     <TapirWidget ref="tapirwidget" :time="2" backendEndpoint="https://your-endpoint.com/.netlify/functions/audio-message" 
                buttonColor="green"/>
                </div>
                <div class="label-question">2. 1에서 녹음한 것을 듣고 텍스트로 받아 적어주세요. <div class="label-question-eng">Listen to your recording and write it down in text.</div></div>
                <div class="label-text">
                       <v-text-field
                            id="answer-text" 
                            label="Enter text here"
                            variant="outlined"
                            v-model="label.text"
                        ></v-text-field>
                </div>
                <div class="label-question">3. 이 샘플에 대한 어노테이션 만족도 점수를 매겨주세요.<div class="label-question-eng">Rate satisfaction score for your annotation of this sample.</div></div>
                <div class="label-rating">
    
                    <v-rating
                        v-model="rating"
                        bg-color="orange-lighten-1"
                        color="white"
                        hover
                        ></v-rating>
                        <!-- <v-radio-group 
                            v-model="rating"
                            inline>
                            <v-radio label="1" value="1" style="margin-right: 30px;"></v-radio>
                            <v-radio label="2" value="2" style="margin-right: 30px;"></v-radio>
                            <v-radio label="3" value="3" style="margin-right: 30px;"></v-radio>
                            <v-radio label="4" value="4" style="margin-right: 30px;"></v-radio>
                            <v-radio label="5" value="5" style="margin-right: 30px;"></v-radio>
                        </v-radio-group> -->
                
                </div>
                <!-- <div class="confirm-content">
                    Your annotation data are saved as ...
                    <div class="download-list"></div>
                </div> -->
                
                <v-btn class="btn-submit" @click="submit()" variant="outlined">Submit</v-btn>
            </div>
        </v-card>
        <button @click="back()" class="button-back">
            <img class="btn-back" :src="require('@/assets/back_white.png')" alt="btnImages">
            <!-- <img class="btn-next" v-if="modeCheck()=='light'" :src="require('@/assets/logo.png')" alt="btnImages" class="btnImages"></button> -->
        </button>
        <button @click="next()" class="button-next"><img class="btn-next" :src="require('@/assets/next_white.png')" alt="btnImages"></button>
        <!-- <button @click="test2()">TESTddd</button> -->
    </v-layout>
</v-container>

</template>

<script>

import { collection, addDoc, writeBatch, doc, query, where, getDocs, runTransaction } from "firebase/firestore"
import { auth, db, storage } from '../firebase/init'
// import TapirWidget from 'vue-audio-tapir';
// import 'vue-audio-tapir/dist/vue-audio-tapir.css';
import TapirWidget from '../components/TapirWidget.vue';

// import YouTube from "vue3-youtube";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getAuth } from "firebase/auth";

import audioset from "@/assets/ESC_50.json";
// import Vue from 'vue';


export default {
    name: 'ExampleView',
    components: {
        TapirWidget,
        // YouTube,

    },
    data:() => ({

            mode: 'dark',
            sampleIdx : 1,
            totalSampleNum: 0,
            items: audioset,
            // items:[
            //     {
            //         id: 1,
            //         audio_file: "9_8.wav",
            //         url: "https://youtube.com/embed/0KKTw8pfNjg?start=283&end=293&controls=0",
            //         // video_id: '_7R1SiWNnSs',
            //         // start: 5,
            //         // end: 10,
            //         class: "Fire alarm",
            //         tags: ['Fire alarm']
            //     },
            //     {
            //         id: 2,
            //         audio_file: "9_71.wav",
            //         url: "https://youtube.com/embed/-qxw8nbLj_0?start=5&end=10&controls=0",
            //         // video_id: 'qORaYudQ7Zc',
            //         // start: 5,
            //         // end: 10,
            //         class: "Waterfall",
            //         tags: ['Waterfall']
            //     },
            //     {
            //         id: 3,
            //         audio_file: "9_9.wav",
            //         url: "https://youtube.com/embed/tA8yqkwNp_M?start=5&end=10&controls=0",
            //         // video_id: 'tA8yqkwNp_M',
            //         // start: 5,
            //         // end: 10,
            //         class: "bike",
            //         tags: ['공부음악','lofi']
            //     }
            // ],
            label: {
                record: "",
                text: ""
            },
            rating: "",
            sampleInfo : "",
            recording_file_name : null,
            videoId: 'qORaYudQ7Zc',
            playerVars: {
                autoplay: 0,
                // loop:true,
                fs: 0,  // allow full screen 
                start: 5,
                end: 10
                // modestbranding: 1
                // controls: 0
                
            },
            sampleBlob : null,
            submitted: false,
            
        
    }),

    created() {
        this.InitSamplesCollection() // 배포 전에 한번만 실행!!
        this.getIncompleteSamples()
            .then((querySnapshot) => {
                this.randomSamples(querySnapshot, 2)   // sampling 
                this.sampleInfo= this.items[0];
                this.totalSampleNum = this.items.length;
                this.loadAudio();
                this.submitted = Array.from({length: this.totalSampleNum}, () => 0);
            })
            .catch(() => {
                alert("어노테이션이 모두 완료되어 더이상 어노테이션할 오디오가 없습니다.")
                this.$router.replace('finish')
            })
    },
    mounted(){ 
        // this.loadAudio();
    },
    methods: {
        async InitSamplesCollection(){
            console.log("init sample collection")
            const batch = writeBatch(db);
            this.items.forEach(function(elem) {
                var data = {
                    audio_file: elem.audio_file,
                    id: elem.id,
                    class: elem.class,
                    complete_sum: 0
                };
                const docRef = doc(db, "samples_esc50", elem.audio_file);
                batch.set(docRef, data);            
            }, this)
            await batch.commit();
        },
        async updateSampleDoc(audio_file){
            const sfDocRef = doc(db, "samples_esc50", audio_file);
            try {
                await runTransaction(db, async (transaction) => {
                    const sfDoc = await transaction.get(sfDocRef);
                    if (!sfDoc.exists()) {
                    throw "Document does not exist!";
                    }

                    const new_complete_sum = sfDoc.data().complete_sum + 1;
                    transaction.update(sfDocRef, { complete_sum: new_complete_sum });
                });
                console.log("Transaction successfully committed!");
            } catch (e) {
                console.log("Transaction failed: ", e);
            }
        },
        async getIncompleteSamples(){
            console.log("getIncompleteSamples")
            // 카테고리가 기타(etc)인 모든 posts 데이터를 가져오는 쿼리
            // const q = query(collection(db, "samples_fsd50k"), where("complete_sum", "!=", 5));
            const q = query(collection(db, "samples_esc50"), where("complete_sum", "!=", 1));

            // getDocs 함수에 위에 정의한 쿼리를 적용해서 모든 문서들을 가져온다.
            const querySnapshot = await getDocs(q);
        
            // 가져온 모든 문서들을 확인하고, json object로 변환
            var incompleteItems = []
            var i = 0 
            querySnapshot.forEach((doc) => {
                incompleteItems[i] = {
                    "audio_file": doc.data().audio_file, 
                    "id": doc.data().id, 
                    "class": doc.data().class,
                    "complete_sum": doc.data().complete_sum
                }
                i++;
            });
            return incompleteItems
        },
        randomSamples(arr, count) {
            console.log("random index")
            console.log('arr', arr)
            // arr.sort(()=> Math.random() - 0.5);
            
            if (arr.length < count){
                throw 'samples length is shorter then sampling count';
            }
            var new_arr = []
            for(var i=0; i<count; i++){
                const random_idx = Math.floor(Math.random() * arr.length)
                console.log(random_idx)
                new_arr.push(arr[random_idx])
            }
            this.items = new_arr
            
            console.log("random index done")
            console.log('total samples length', this.items.length)
            
        },
        onStateChanged(){
            // if(this.$refs.youtube.player.playerInfo.currentTime > this.sampleInfo.end)
            console.log(this.$refs.youtube.player)
            // console.log(this.$refs.youtube.player.getCurrentTime())
            if(this.$refs.youtube.player.PlayerState.PLAYING)
                 console.log((this.sampleInfo.end - this.sampleInfo.start) * 1000)
            // setTimeout(this.onPause, 10000);
        },
        // play(){
        //     // for youtube player    
        //     $('#youtube-player')[0].src = this.sampleInfo.url + "&autoplay=1"
        //     console.log($('#youtube-player')[0].src)
            
        // },
        loadAudio(){
            
            const audioElem = document.getElementById('audio-player')
            console.log(audioElem)

            // for local collection (load audio from local storage)
            // console.log(require('../assets/pilot/'+this.sampleInfo.audio_file))
            // audioElem.src= require('../assets/pilot/'+this.sampleInfo.audio_file)

            // for online collection (load audio from Firebase storage)
            const storageRef = ref(storage, 'ESC50/'+ this.sampleInfo.audio_file);
            console.log(storageRef)
            getDownloadURL(storageRef).then((geturl) => {
                console.log(geturl);
                
                // This can be downloaded directly:
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    const blob = xhr.response;
                    console.log(blob)
                    
                    var blobUrl = URL.createObjectURL(blob);
                    this.sampleBlob = blobUrl;
                    const audioElem = document.getElementById('audio-player')
                    audioElem.src = this.sampleBlob
                    // $('#audio-player').setAttribute('src', this.sampleBlob)
                };
                xhr.open('GET', geturl);
                xhr.send();
            });
          
        },
        onPlay() {
            // console.log(this.sampleInfo.start)
            this.$refs.youtube.player.seekTo(this.sampleInfo.start);
            this.$refs.youtube.player.playVideo();
            // this.$refs.youtube.seekTo(this.sampleInfo.start)
            // this.$refs.youtube.playVideo()
            console.log(this.$refs.youtube)
        },
        onPause() {
            this.$refs.youtube.player.pauseVideo();
            // this.$refs.youtube.seekTo(this.sampleInfo.start)        //이것 없으면 시작시간이 0으로 돼서, onPlay하면 0초부터 시작함.
            // this.$refs.youtube.
        },
        changeBtnColor() {
            const theme = useTheme();
            const mode = theme.global.name.value;
            console.log(mode)

            if(mode == 'dark'){
                $('.btn-back').attr("src", "require('@/assets/back.png')")
                $('.btn-next').attr("src", "require('@/assets/back.png')")
            }
            else{
                $('.btn-back').attr("src", "require('@/assets/logo.png')")
                $('.btn-next').attr("src", "require('@/assets/logo.png')")
            }
            return mode
        },
        async createLableCollection() {
          try {
            const docRef = await addDoc(collection(db, "labels"), {
                sampleId: "SAMPLE_ID",
                class: "CLASS_NAME",
                annotator: "USER_NAME",
                recording_url: "RECORDING_FILE_URL",
                text: "ANNOTATION_TEXT"
            });

            console.log("Document written with ID: ", docRef.id);
            } catch (e) {
            console.error("Error adding document: ", e);
            }
        },
        checkCompleted(){
            const completedSpan = document.getElementById('completed')
            if(this.submitted[this.sampleIdx]){
                completedSpan.style.color = 'green'
                completedSpan.innerText = 'Complete'
            }
            else{
                completedSpan.style.color = 'red'
                completedSpan.innerText = 'Incomplete'
            }
        },
        back(){
            if(this.sampleIdx > 1) { 
                this.sampleIdx -= 1; 
                this.sampleInfo = this.items[this.sampleIdx-1]

                this.loadAudio();
                this.clear();
                this.checkCompleted()
            } else {
                alert("It's the first sample!")
                
            }
        },
        next(){
            // submit check
            // if(this.submitted[this.sampleIdx] == 0){
            //     alert("Submit before next")
            //     return
            // }

            if(this.sampleIdx < this.totalSampleNum) { 
                this.sampleIdx += 1; 
                this.sampleInfo = this.items[this.sampleIdx-1]
                
                this.loadAudio();
                this.clear();
                this.checkCompleted()
            } else {
                // [MTURK] 할 땐 주석 풀 것
                // const add = arr => arr.reduce((a, b) => a + b, 0);
                // if(add(this.submitted) == this.totalSampleNum){
                //     alert("You completed all samples!")
                //     this.$router.replace('finish')
                // }
                // else{
                //     alert("It's the last sample!")
                // }
                alert("It's the last sample!")
            }
            
        },
        clear(){
            // clear user's annotation
            // $('#confirm-text').text('');
            $('#answer-text').val('');

            
            // var linkDiv = document.querySelector('.download-list')
            // linkDiv.replaceChildren();


            // this.$refs.tapirwidget.initRecorder();
            // this.$refs.tapirwidget.recordedBlob =null
            this.$refs.tapirwidget.clear();

            this.rating = 0;
            
        },
        submit(){
            // this.clear()


            const blob = this.$refs.tapirwidget.recordedBlob;               // annotated recording blob
            // const text = document.querySelector('#confirm-text');           // annotated text
            // text.innerHTML = this.label.text;

            // console.log(blob)
            // console.log(this.label.text)
            console.log(this.rating)
            // 레코드가 안 되어있으면 submit 하지 않음
            if (!blob || this.label.text == '' || this.rating == 0) {
                alert("You must answer all the questions.")
                // alert("모든 항목에 응답했는지 확인해주세요.")
                return;
            }



            
            // const auth = getAuth();
            const user = auth.currentUser;  //현재 로그인한 유저의 객체를 가져옴
            const nickname = user.displayName
            

            // this.recording_file_name = this.sampleInfo.class +'_'+ this.sampleInfo.id + '_' + nickname
            this.recording_file_name = this.sampleInfo.audio_file+'_'+nickname
            
            
            // (( 1st pilot ))
            // const metadata_storage = {
            //     customMetadata: {
            //         'sampleId': this.sampleInfo.id,
            //         'class': this.sampleInfo.class,
            //         'annotator': nickname,
            //         'text': this.label.text
            //     }
            // }
            const metadata_storage = {
                customMetadata: {
                    'audio_file': this.sampleInfo.audio_file,
                    'id': this.sampleInfo.id,
                    'class': this.sampleInfo.class,
                    'workerid': nickname,
                    'text': this.label.text,
                    'satisfy_score': this.rating
                }
            }

            // // (( local save link ))
            // var url = URL.createObjectURL(blob);
            // var linkDiv = document.querySelector('.download-list')
            // if(linkDiv.hasChildNodes())
            //     linkDiv.replaceChildren();
            // var li = document.createElement('li');
            // var li2 = document.createElement('li');
            // var link = document.createElement('a');
            // var link2 = document.createElement('a');
            
            // link.href = url;
            // link.download = this.recording_file_name+'.wav';
            // link.innerHTML = link.download;
            // link.click();

            // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metadata_storage.customMetadata));
            // link2.setAttribute("href", dataStr);
            // link2.setAttribute("download", this.recording_file_name+".json");
            // link2.innerHTML = link2.download;
            // link2.click();

            // li.appendChild(link);
            // li2.appendChild(link2);    
            // linkDiv.appendChild(li); 
            // linkDiv.appendChild(li2);    
            
            
            // upload storage
            const storageRef = ref(storage, 'esc50_annotated/'+ this.recording_file_name+'.wav');
            console.log("storage info : " ,storageRef)
            uploadBytes(storageRef, blob, metadata_storage).then(() => {
                console.log('Uploaded a blob or file!');
            });

            console.log("#1")
            // const storage = getStorage();
            getDownloadURL(storageRef).then((geturl) => {
                console.log(geturl)
                const metadata = {
                    // (( 1st pilot ))
                    // sampleId: this.sampleInfo.id,
                    // class: this.sampleInfo.class,
                    // annotator: nickname,
                    // recording_url: geturl,
                    // text: this.label.text
                    audio_file: this.sampleInfo.audio_file,
                    id: this.sampleInfo.id,
                    class: this.sampleInfo.class,
                    workerid: nickname,
                    text: this.label.text,
                    satisfy_score: this.rating,
                    recording_url: geturl

                }
                this.sendFireStore("labels_esc50", metadata)

                console.log(this.sampleInfo.audio_file)
                console.log("update", this.sampleIdx)
                this.updateSampleDoc(this.sampleInfo.audio_file).then(()=>
                {
                    // if user submitted, enable to next
                    this.submitted[this.sampleIdx] = 1
                    this.next()}
                )

                

                // const samplestate = {
                //     audio_file: this.sampleInfo.audio_file,
                //     id: this.sampleInfo.id,
                //     class: this.sampleInfo.class,
                //     complete_sum: 
                // }
                // this.sendFireStore("samples_exc50", , this.sampleInfo.id)



                // // This can be downloaded directly:
                // const xhr = new XMLHttpRequest();
                // xhr.responseType = 'blob';
                // xhr.onload = () => {
                //     const blob = xhr.response;
                //     console.log(blob)
                //     var url = URL.createObjectURL(blob);
                //     var li = document.createElement('li');
                //     var link = document.createElement('a');

                //     //link the a element to the blob
                //     link.href = url;
                //     link.download = this.recording_file_name;
                //     console.log(link.download)
                //     link.innerHTML = link.download;

                //     //add the new audio and a elements to the li element
                //     li.appendChild(link);
                // };
                // xhr.open('GET', url);
                // xhr.send();
                // return url
            });
            console.log("#2")
            
            
            



            // add Firestore
            
            
            
            // add Storage
            // const storage = getStorage();
           
            // const message = 'This is my message.';
            // uploadString(storageRef, message).then(() => {
            // console.log('Uploaded a raw string!');
            // });
            // try{
            //     // 'file' comes from the Blob or File API
            //     uploadBytes(storageRef, blob);
            // }catch(error){
            //     console.log(error);

            // }            

        },
       
        async sendFireStore(collection_name, data){
          
            try {
                const docRef = await addDoc(collection(db, collection_name), data);
                console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                console.error("Error adding document: ", e);
                }
          
        },
        test2(){

            $('#youtube-player')[0].src += "&autoplay=1"
            // var html = '<iframe width="620" height="320" src="'+ this.videoId +'?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>';
            // document.getElementById('youtube-container').innerHTML += html;
// const iframe= document.getElementById('youtube-player')
// iframe.play()
          

// const iframe= document.getElementById('youtube-player')
// console.log(iframe)
// console.log(iframe.contentWindow)
// const video = iframe.contentWindow.document.getElementsByTagName("video")[0];
// video.play()
        //     $.getScript("https://www.youtube.com/iframe_api", function() {
        //      window.YT.ready(function(){

        //          console.log(this.videoId)
        //         new window.YT.Player("youtube-container", {
        //         height: "390",
        //         width: "640",
        //         videoId: "M7lc1UVf-VE",
        //         events: {
        //             onPlay: onPlayerReady,
        //             onStateChange: onPlayerStateChange
        //         }
        //         });
        //     })

            
        //      function onPlayerReady(event) {
        //         event.target.playVideo();
        //     }

        //     function onPlayerStateChange(event) {
        //         var videoStatuses = Object.entries(window.YT.PlayerState)
        //         console.log(videoStatuses.find(status => status[1] === event.data)[0])
        //     }
          
        // });
            

        }
           
    }
}
</script>

<script setup>
import { useTheme } from "vuetify";
// import { createCommentVNode } from 'vue';



</script>
<style lang="scss">
.vbox {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.vbox > * { outline: 1px solid #4f80ff; } /* 이렇게 가이드 선을 그어둘 수 있게 하면 좋다. */


.active{
    background-color: yellow;
}
.text-red {
    color:red;
}


.example-body {
    // background-color: #ffd6d6 !important;
    color: rgb(0, 0, 0);
    
}

.page-info{
    justify-content: center;
    align-items: center;
    
    margin:5px;
    font-size: 1.4em;
}

.example-container{
    position:absolute;
    display:flex;
    width:100%;
    height:100%;
    
    justify-content: center;
    align-items: center;
    // background-color: #1d1d1d !important;
    // margin: 0 auto;
    
}


.content-container{
    // width: 100%;
    display: block;
    padding:1rem;
    // text-align: center;
    align-items: center;
    // background-color: #ddf2ff !important;
    // margin: 0 auto;
    
    
}

.video-content {
    display:block;
    // width:50%;
    

    justify-content: center;
    margin-bottom:50px;
}

.tag-content{
    margin-top:20px;

}

.labeling-content{
    display: block;
    width:500px;
    padding-left:30px;
    height:fit-content;

}

.label-question {
    // font-weight: 900;
    margin-top: 2rem;
    margin-bottom: 10px;
}

.label-question-eng{
    font-size: 0.8rem
}
.btn-submit {
    margin-top:50px;
    display:flex;
    position: relative;
    left: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
    // justify-content: center;
    // align-items: center;
}


$colors: (
  fill: #a972cb,
  pulse: #ef6eae, 
  close: #ff7f82, 
  raise: #ffa260, 
  up: #e4cb58, 
  slide: #8fc866, 
  offset: #19bc8b
);


// .btnImages{
//     width:30%;
//     &:focus {
//        box-shadow: inset 6.5em 0 0 0 3;
//     }
//     &:hover {
//       transform: scale(1.05);
//     }
// }


.btn-back{
    width:3rem;
    position: absolute;
    left:10px;
    &:focus {
       box-shadow: inset 6.5em 0 0 0 3;
    }
    &:hover {
      transform: scale(1.05);
    }
}

.btn-next{
    width:3rem;
    position: absolute;
    right:10px;
    &:focus {
       box-shadow: inset 6.5em 0 0 0 3;
    }
    &:hover {
      transform: scale(1.05);
    }
}

.btn-replay{
    margin-top:20px;
    font-size: 1rem;
}

.confirm-content{
    margin-top:20px;
    height:50px;
}



</style>