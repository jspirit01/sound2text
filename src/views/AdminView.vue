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
    </div>
    <div class="query-content">
        <span> Firestore Name </span>
        <input type="text" placeholder="" v-model="firestore_name">
        <span> Complete Sum </span>
        <input type="number" placeholder="0~3" v-model="complete_sum">
        <v-btn
            id="btn-complete"
            @click="showCompleteAudioFile()"
            variant="tonal"
            density="compact"
            color='blue'
            >
            <span class="material-symbols-outlined">search</span>FIND
        </v-btn>
    </div>
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
import { storage, db } from '../firebase/init'
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { collection, query, where, getDocs } from "firebase/firestore"
import audioset from "@/assets/audio2.json";

export default {
    name: 'AdminView',
    components: {

    },
    data() {
        return {
            storageFolder: "",
            audiofile: "",
            firestore_name: "samples_esc50",
            complete_sum: 3,
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
            $('.result-content').children('.result-item').remove();
            var title_row = `<div class='result-item'>
                <div>ID</div>
                <div>WAV DOWNLOAD LINK</div>
                <div>LABEL TEXT</div>
                <div>CLASS</div>
                <div>WORKERID</div>
                <div>SCORE</div>
                </div>`
            $('.result-content').append(title_row);

            // console.log(this.audiofile)
            const listRef = ref(storage, this.storageFolder);
            // console.log("storage info : " ,listRef)

            // this.loadMetadataObjectsByClass(listRef, this.audiofile)
            this.loadMetadataObjectsByClass(listRef, this.workerid)
        },
        showList(){

            var countElem = document.getElementById('search-count')
            countElem.innerHTML = this.metaObjects.length
            // console.log(this.metaObjects)
            var li_container = document.getElementById('textlabel-list');
            this.metaObjects.forEach(function(elem) {
                
                var li = document.createElement('li');
                
                // console.log(elem.text)
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
                                    // console.log(metadata.customMetadata)
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
                
                // This can be downloaded directly:
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    const blob = xhr.response;
                    
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
        },
        async getCompleteSamples(){
            
            console.log("getCompleteSamples")
            // 카테고리가 기타(etc)인 모든 posts 데이터를 가져오는 쿼리
            // const q = query(collection(db, "samples_fsd50k"), where("complete_sum", "!=", 5));
            const q = query(collection(db, this.firestore_name), where("complete_sum", "==", this.complete_sum));       // 실제 검색시 에는 숫자 변경

            // getDocs 함수에 위에 정의한 쿼리를 적용해서 모든 문서들을 가져온다.
            const querySnapshot = await getDocs(q);
        
            // 가져온 모든 문서들을 확인하고, json object로 변환
            var completeItems = []
            var i = 0 
            querySnapshot.forEach((doc) => {
                completeItems[i] = {
                    "audio_file": doc.data().audio_file, 
                    "id": doc.data().id, 
                    "class": doc.data().class,
                    "complete_sum": doc.data().complete_sum
                }
                i++;
            });
            return completeItems
            
        },
        showCompleteAudioFile(){
            console.log(this.firestore_name, typeof(this.complete_sum))
            this.getCompleteSamples()
            .then((completeItems) => {
                $('.result-content').children('.result-item').remove();
                var title_row = `<div class='result-item'>
                <div>ID</div>
                <div>AUDIO FILE NAME</div>
                <div>CLASS</div>
                <div>ID</div>
                <div># OF ANNOTATIONS</div>
                </div>`
                $('.result-content').append(title_row);

                var result_content = document.querySelector('.result-content')
                completeItems.forEach((item, number) => {
                    if(number > 10) return      // 실제 검색시에는 지우기
                var result_item = document.createElement('div');
                result_item.classList.add("result-item");

                var numberDiv = document.createElement('div')
                var audiofileDiv = document.createElement('div')
                var classDiv = document.createElement('div')
                var idDiv = document.createElement('div')
                var sumDiv = document.createElement('div')


                numberDiv.innerHTML = number;
                audiofileDiv.innerHTML = item.audio_file;
                classDiv.innerHTML = item.class;
                idDiv.innerHTML = item.id;
                sumDiv.innerHTML = item.complete_sum;

                result_item.appendChild(numberDiv)
                result_item.appendChild(audiofileDiv)
                result_item.appendChild(classDiv)
                result_item.appendChild(idDiv)
                result_item.appendChild(sumDiv)

                result_content.appendChild(result_item)
                })

            })
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