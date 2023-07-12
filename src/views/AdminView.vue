<template>
<div>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
    <div class="query-content">
        <span> Storage Name </span> 
        <span>
            <select v-model="storageFolder">
            <option v-for="storageFolder in storageFolderList" :key="storageFolder.id" :value="storageFolder.value">{{ storageFolder.value }}</option>
            </select>
        </span>
        <span> Audiofile Name </span>
        <input type="text" placeholder="e.g., 10_ (1).wav" v-model="audiofile">
        <span> Worker ID </span>
        <input type="text" placeholder="" v-model="workerid">
        <v-btn 
            id="btn-load"
            @click="load()"
            variant="tonal"
            density="compact"
            style=""
        ><span class="material-symbols-outlined">search</span>Search
        </v-btn>
        
        <!-- <v-btn 
        id="btn-show"
        @click="showList()"
        variant="outlined"
        style=""
        >Show
        </v-btn> -->
    </div>
    <!-- <button id='download' @click="load()">Load</button>
    <button id='show' @click="showList()">Show</button> -->

    <div>
        <span>Count</span> <span id='search-count'></span>
    </div>

    <div class="result-content">
        <div class='result-item'>
            <div>ID</div>
            <div>WAV DOWNLOAD LINK</div>
            <div>LABEL TEXT</div>
            <div>CLASS</div>
            <div>WORKERID</div>
            <div>SCORE</div>
        </div>
        <!-- <div id='textlabel-list'></div> -->
    </div>
</div>
</template>

<script>
import { storage } from '../firebase/init'
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import audioset from "@/assets/audio2.json";

export default {
    name: 'AdminView',
    components: {

    },
    data() {
        return {
            storageFolder: "",
            audiofile: "",
            workerid: "",
            items: audioset,
            metaDataItems: [],
            storageFolderList: [
                {
                id:1,
                value: "esc50",
                },
                {
                id:2,
                value: "esc50_annotated",
                },
                {
                id:3,
                value: "fsd50k_annotated",
                }
            ],
            
            
            
        }
    },
    methods: {
        load(){
            console.log(this.audiofile)
            const listRef = ref(storage, this.storageFolder);
            console.log("storage info : " ,listRef)

            // this.loadMetadataObjectsByClass(listRef, this.audiofile)
            this.loadMetadataObjectsByClass(listRef, this.workerid)
        },
        showList(){

            var countElem = document.getElementById('search-count')
            countElem.innerHTML = this.metaObjects.length
            console.log(this.metaObjects)
            var li_container = document.getElementById('textlabel-list');
            this.metaObjects.forEach(function(elem) {
                
                var li = document.createElement('li');
                
                console.log(elem.text)
                //link the a element to the blob
                li.innerHTML = elem.text;
                // li.innerHTML 
                // link.click();

                //add the new audio and a elements to the li element
                // li.appendChild(link);
                li_container.appendChild(li);
            });
        },
        loadMetadataObjectsByClass(storageRef, target){
            return new Promise((resolve) => {
                this.metaObjects = []
                listAll(storageRef).then((res) => {
                    res.items.forEach((itemRef) => {
                        getMetadata(itemRef).then((metadata) => {
                            try{
                                // if (metadata.customMetadata.audio_file == target){
                                if (metadata.customMetadata.workerid == target){
                                    console.log(metadata.customMetadata)
                                    this.metaObjects.push(metadata.customMetadata)
                                    var label_text = metadata.customMetadata.text
                                    var workerid = metadata.customMetadata.workerid
                                    var satisfy_score = metadata.customMetadata.satisfy_score
                                    var classid = metadata.customMetadata.class
                                    this.createDownloadLink(itemRef, this.metaObjects.length, label_text, workerid, classid, satisfy_score)
                                }
                                }
                                catch(err){
                                    console.log(err)
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                        });
                })
                .catch((error) =>{
                    console.log(error);
                });
                resolve(true);
               
            })
        },
        // loadMetadataObjectsByClass(storageRef, class_id){
        //     return new Promise((resolve) => {
        //         this.metaObjects = []
        //         listAll(storageRef).then((res) => {
        //             res.items.forEach((itemRef) => {
        //                 getMetadata(itemRef).then((metadata) => {
        //                     try{
        //                         if (metadata.customMetadata.class == class_id){
        //                             this.metaObjects.push(metadata.customMetadata)
        //                             this.createDownloadLink(itemRef)
        //                         }
        //                         }
        //                         catch(err){
        //                             //...
        //                         }
        //                     })
        //                     .catch((error) => {
        //                         console.log(error)
        //                     })
        //                 });    
        //         })
        //         .catch((error) =>{
        //             console.log(error);
        //         });
        //         resolve(true);
        //     })
        // },
        createDownloadLink(storageRef, idx, label_text, workerid, classid, satisfy_score){
             getDownloadURL(storageRef).then((geturl) => {
                console.log(geturl)
                // This can be downloaded directly:
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    const blob = xhr.response;
                    console.log(blob)
                    var url = URL.createObjectURL(blob);

                    var result_item = document.createElement('div');
                    result_item.classList.add("result-item");

                    var numberDiv = document.createElement('div')
                    var wavDiv = document.createElement('div')
                    var textDiv = document.createElement('div')
                    var workerDiv = document.createElement('div')
                    var classDiv = document.createElement('div')
                    var satisfyDiv = document.createElement('div')
                    // numberDiv.classList.add("number")
                    // wavDiv.classList.add("wav")
                    // textDiv.classList.add("text")

                    var link = document.createElement('a');
                    link.href = url;
                    link.download = storageRef.name;
                    link.innerHTML = link.download;
                    wavDiv.appendChild(link)

                    numberDiv.innerHTML = idx;
                    textDiv.innerHTML = label_text;
                    workerDiv.innerHTML = workerid;
                    classDiv.innerHTML = classid;
                    satisfyDiv.innerHTML = satisfy_score;

                    result_item.appendChild(numberDiv)
                    result_item.appendChild(wavDiv)
                    result_item.appendChild(textDiv)
                    result_item.appendChild(classDiv)
                    result_item.appendChild(workerDiv)
                    result_item.appendChild(satisfyDiv)

                    var result_content = document.querySelector('.result-content')
                    result_content.appendChild(result_item)
                    // var text_li_container = document.getElementById('textlabel-list');
                    // var wav_li_container = document.getElementById('download-list');
                    // var text_li = document.createElement('li');
                    // var wav_li = document.createElement('li');
                    // var link = document.createElement('a');
                    
                    // //link the a element to the blob
                    
                    // link.href = url;
                    // link.download = storageRef.name;
                    // link.innerHTML = link.download;
                    // // link.click();

                    // //add the new audio and a elements to the li element
                    // wav_li.appendChild(link);
                    // wav_li_container.appendChild(wav_li);

                    // text_li.innerHTML = label_text;
                    // text_li_container.appendChild(text_li);
                    
                    
                
                };
                xhr.open('GET', geturl);
                xhr.send();

                return geturl
            });
        }
    }

    
}
</script>

<style>

.result-content{
    display: block;
}

#download-list{
    margin:10px;
    padding:30px;
    width: 300px;
    height: 300px;
    background-color: rgba(255, 255, 255, 0.212);
}
#textlabel-list{
    margin:10px;
    padding:30px;
    width: 300px;
    height: 300px;
    background-color:rgba(255, 255, 255, 0.212);
}

.result-item{
    display: grid;
	grid-template-columns: 50px 300px 300px 200px 200px 200px;
	grid-template-rows: 10px 10px;

    width:100%;
    height: 30px;
    margin:10px;
    padding:5px;
    background-color: rgba(255, 255, 255, 0.212);;
}


</style>