<template>
  <div >
    <!-- <div class="text-sm">{{ instructionMessage }}</div> -->
    <div class="recording-module">
      <div style="display:flex; align-items:center;">
        <button
          :style="{ 'border-color': buttonColor, 'margin-left': '10px'}"
          v-if="recording"
          name="stop"
          @click="toggleRecording"
        >
          <font-awesome-icon icon="fa-solid fa-stop" size="3x"/>
        </button>
        <button
          :style="{ 'border-color': buttonColor, 'margin-left': '10px'}"
          v-else
          name="mic"
          @click="toggleRecording"
        >
          <font-awesome-icon icon="microphone" size="3x"/>
        </button>
        <div id="recording-time">{{ recordedTime }}</div>
      </div>
      <div style="display:block; text-align:center;" class=ms-10>
        
        <audio controls :src="recordedAudio" type="audio/mpeg">
          Your browser does not support the
          <code>audio</code> element.
        </audio>
       
    
      </div>
    </div>
    <div class="text-sm text-blue-400">{{ successMessage }}</div>
    
    <div class="text-sm text-red-400">{{ errorMessage }}</div>

    <!-- <submit-button @submit="sendData" :color="buttonColor" /> -->
  </div>
</template>

<script>
import Service from "../api/Service";
import Recorder from "../lib/Recorder";
import convertTimeMMSS from "../lib/Utils";
import "../styles/app.css";
// import IconButton from "./IconButton.vue";
// import SubmitButton from "./SubmitButton.vue";

const INSTRUCTION_MESSAGE = "Click icon to start recording message.";
const INSTRUCTION_MESSAGE_STOP = "Click icon again to stop recording.";
const ERROR_MESSAGE =
  "Failed to use microphone. Please refresh and try again and permit the use of a microphone.";
const SUCCESS_MESSAGE = "Successfully recorded message!";
// const SUCCESS_MESSAGE_SUBMIT = "Successfully submitted audio message! Thank you!";
// const ERROR_SUBMITTING_MESSAGE = "Error submitting audio message! Please try again later.";

export default {
  name: "TapirWidget",
  props: {
    // in minutes
    time: { type: Number, default: 1 },
    bitRate: { type: Number, default: 128 },
    sampleRate: { type: Number, default: 44100 },
    backendEndpoint: { type: String },
    buttonColor: { type: String, default: "green" },

    // callback functions
    afterRecording: { type: Function },
    successfulUpload: { type: Function },
    failedUpload: { type: Function },
    customUpload: { type: Function, default: null }
  },
  components: {
    // IconButton,
    // SubmitButton,
  },
  data() {
    return {
      recording: false,
      recordedAudio: null,
      recordedBlob: null,
      recorder: null,
      successMessage: null,
      errorMessage: null,
      instructionMessage: INSTRUCTION_MESSAGE,
    };
  },
  computed: {
    buttonClass() {
      return "mx-auto h-14 w-14 text-black cursor-pointer rounded-50 border-2 m-4 p-2";
    },
    recordedTime() {
      if (this.time && this.recorder?.duration >= this.time * 60) {
        this.toggleRecording();
      }
      return convertTimeMMSS(this.recorder?.duration);
    },
  },
  beforeUnmount() {
    if (this.recording) {
      this.stopRecorder();
    }
  },
  methods: {
    clear(){
      this.recordedAudio = null;
      this.recordedBlob = null;
      this.successMessage = null;
      this.errorMessage = null;
    },
    toggleRecording() {
      this.recording = !this.recording;
      if (this.recording) {
        this.initRecorder();
      } else {
        this.stopRecording();
      }
    },
    initRecorder() {
      this.recorder = new Recorder({
        micFailed: this.micFailed,
        bitRate: this.bitRate,
        sampleRate: this.sampleRate,
      });
      this.recorder.start();
      this.successMessage = null;
      this.errorMessage = null;
      this.instructionMessage = INSTRUCTION_MESSAGE_STOP;
      this.service = new Service(this.backendEndpoint);
    },
    stopRecording() {
      this.recorder.stop();
      const recordList = this.recorder.recordList();
      this.recordedAudio = recordList[0].url;
      this.recordedBlob = recordList[0].blob;
      if (this.recordedAudio) {
        this.successMessage = SUCCESS_MESSAGE;
        this.instructionMessage = null;
      }
      if (this.afterRecording) {
        this.afterRecording();
      }
    },
    async sendData() {
      // if (!this.recordedBlob) {
      //   // not recorded
      //   return;
      // }
    
      // var url = URL.createObjectURL(this.recordedBlob);
      // var li = document.createElement('li');
      // var link = document.createElement('a');


      // //link the a element to the blob
      // link.href = url;
      // link.download = new Date().toISOString() + '.wav';
      // link.innerHTML = link.download;

      // //add the new audio and a elements to the li element
      // li.appendChild(link);

      // //add the li element to the ordered list
      // const recordingsList = document.querySelector('.confirm-content')
      // recordingsList.appendChild(li);

    //   let result = null;
    //   if (this.customUpload) {
    //     console.log("2")
    //     result = await this.customUpload(this.recordedBlob);
    //   } else {
    //     console.log("3")
    //     result = await this.service.postBackend(this.recordedBlob);
    //   }

    //   if (result) {
    //     console.log("4")
    //     this.errorMessage = null;
    //     this.successMessage = SUCCESS_MESSAGE_SUBMIT;
    //     if (this.successfulUpload) {
    //       console.log("5")
    //       this.successfulUpload();
    //     }
    //   } else {
    //     console.log("6")
    //     // error uploading
    //     this.successMessage = null;
    //     this.errorMessage = ERROR_SUBMITTING_MESSAGE;
    //     if (this.failedUpload) {
    //       console.log("7")
    //       this.failedUpload();
    //     }
    //   }
    },
    micFailed() {
      this.recording = false;
      this.instructionMessage = INSTRUCTION_MESSAGE;
      this.errorMessage = ERROR_MESSAGE;
    },
  },
};
</script>

<style>
/* .buttonClass {
  width:50px;
} */
.recording-module{
  padding: 10px;
  display: flex;
}


#recording-time{
  width:40px;
  margin-left:10px;
  margin-right:20px;
}
</style>