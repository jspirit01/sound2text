<template>
<!-- <div class="example-body"> -->
<v-container fluid >
    
    <v-layout class="page-info" style="text-align:center;justify-content:cnete">
        <span>{{sampleIdx}}</span> / <span>{{totalSampleNum}}</span>
    
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
                    :vars="playerVars"
                    @state-change="onStateChanged"
                    /> -->
                <div style="font-size:1.5rem;"
                :style="{'margin-left': '10px', 'margin-bottom': '10px'}">Sample Sound</div>
                <audio id="audio-player"
                    controls :src="sampleAudio" type="audio/mpeg"
                    :style="{'margin-left': '10px'}"></audio>
                <!-- <button @click="onPause()"><font-awesome-icon icon="fa-solid fa-play" />STOP</button> -->
                <!-- <div class="tag-content"><v-chip v-for="(tag, idx) in sampleInfo.tags" :key="{idx}" color="secondary" variant="elevated" style="margin-right:7px;">#{{tag}}</v-chip></div> -->
                <!-- <v-btn class="btn-replay" @click="play()" variant="outlined" color="secondary"><font-awesome-icon icon="fa-solid fa-rotate-right" size="2x"/>PLAY</v-btn> -->
            </div>
            <v-spacer/>
            <hr>
            <div class="labeling-content">
                <div class="label-question">1. 소리를 듣고 들리는 대로 발음해보세요.</div>
                <div class="label-recording" style="height:80px;">
                    <!-- <div id="controls">
                    <v-btn id="recordButton" v-model="darkmode">Record</v-btn>
                    <v-btn id="stopButton" disabled>Stop</v-btn>
                    </div> -->
                     <TapirWidget ref="tapirwidget" :time="2" backendEndpoint="https://your-endpoint.com/.netlify/functions/audio-message" 
                buttonColor="green"/>
                </div>
                <div class="label-question">2. 1에서 녹음한 것을 듣고 텍스트로 받아 적어주세요.</div>
                <div class="label-text">
                       <v-text-field
                            id="answer-text" 
                            label="Enter text here"
                            variant="outlined"
                            v-model="label.text"
                        ></v-text-field>
                </div>
                <div class="confirm-content">
                    Your annotation data are saved as ...
                    <!-- <div id="confirm-text">여기에 저장될 텍스트가 뜹니다</div> -->
                    <div class="download-list"></div>
                </div>
                
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

import { collection, addDoc } from "firebase/firestore"
import { auth, db, storage } from '../firebase/init'
// import TapirWidget from 'vue-audio-tapir';
// import 'vue-audio-tapir/dist/vue-audio-tapir.css';
import TapirWidget from '../components/TapirWidget.vue';

// import YouTube from "vue3-youtube";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getAuth } from "firebase/auth";

import audioset from "@/assets/audio2.json";
// import Vue from 'vue';


export default {
    name: 'ExampleView',
    components: {
        TapirWidget,
        // YouTube,

    },
    data() {
        return {

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
            sampleBlob : null
        }
    },

    created() {
        this.sampleInfo= this.items[0];
        this.totalSampleNum = this.items.length;
        this.loadAudio();
    },
    methods: {
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
            console.log(this.sampleInfo.audio_file)
            const storageRef = ref(storage, 'esc/'+ this.sampleInfo.audio_file);
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
        back(){
            if(this.sampleIdx > 1) { 
                this.sampleIdx -= 1; 
                this.sampleInfo = this.items[this.sampleIdx-1]

                this.loadAudio();
                this.clear();
            } else {
                alert("You are in the first sample!")
                
            }
        },
        next(){
            if(this.sampleIdx < this.totalSampleNum) { 
                this.sampleIdx += 1; 
                this.sampleInfo = this.items[this.sampleIdx-1]
                
                this.loadAudio();
                this.clear();
            } else {
                alert("You completed all samples!")
            }
            
        },
        clear(){
            // clear user's annotation
            // $('#confirm-text').text('');
            $('#answer-text').val('');
            var linkDiv = document.querySelector('.download-list')
            linkDiv.replaceChildren();
            // this.$refs.tapirwidget.initRecorder();
            // this.$refs.tapirwidget.recordedBlob =null
            this.$refs.tapirwidget.clear();

            
            
        },
        submit(){
            // this.clear()


            const blob = this.$refs.tapirwidget.recordedBlob;               // annotated recording blob
            // const text = document.querySelector('#confirm-text');           // annotated text
            // text.innerHTML = this.label.text;

            console.log(blob)
            console.log(this.label.text)
            // 레코드가 안 되어있으면 submit 하지 않음
            if (!blob || this.label.text == '') {
                console.log("Df")
                alert("You must answered all items.")
                return;
            }



            
            // const auth = getAuth();
            const user = auth.currentUser;  //현재 로그인한 유저의 객체를 가져옴
            const nickname = user.displayName
            

            this.recording_file_name = this.sampleInfo.class +'_'+ nickname
            
            
            const metadata_storage = {
                customMetadata: {
                    'sampleId': this.sampleInfo.id,
                    'class': this.sampleInfo.class,
                    'annotator': nickname,
                    'text': this.label.text
                }
            }

            var url = URL.createObjectURL(blob);
            var linkDiv = document.querySelector('.download-list')
            if(linkDiv.hasChildNodes())
                linkDiv.replaceChildren();
            var li = document.createElement('li');
            var li2 = document.createElement('li');
            var link = document.createElement('a');
            var link2 = document.createElement('a');
            
            link.href = url;
            link.download = this.recording_file_name+'.wav';
            link.innerHTML = link.download;
            link.click();

            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metadata_storage.customMetadata));
            link2.setAttribute("href", dataStr);
            link2.setAttribute("download", this.recording_file_name+".json");
            link2.innerHTML = link2.download;
            link2.click();

            li.appendChild(link);
            li2.appendChild(link2);    
            linkDiv.appendChild(li); 
            linkDiv.appendChild(li2);    
            
            
            console.log(metadata_storage)
            // upload storage
            const storageRef = ref(storage, 'esc/'+ this.recording_file_name+'.wav');
            console.log("storage info : " ,storageRef)
            uploadBytes(storageRef, blob, metadata_storage).then(() => {
                console.log('Uploaded a blob or file!');
            });

            console.log("#1")
            // const storage = getStorage();
            getDownloadURL(storageRef).then((geturl) => {
                console.log(geturl)
                const metadata = {
                    sampleId: this.sampleInfo.id,
                    class: this.sampleInfo.class,
                    annotator: nickname,
                    recording_url: geturl,
                    text: this.label.text
                }
                this.sendFireStore(metadata)

                

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
                return url
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
       
        async sendFireStore(metadata){
            try {
                const docRef = await addDoc(collection(db, "labels"), metadata);
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
    margin:30px;
    font-size: 1.5em;
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
    width:5rem;
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
    width:5rem;
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