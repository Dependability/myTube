import {useState, useEffect} from 'react';
import {storage, db}from '../Firebase';
import { uuidv4 } from '@firebase/util';
import {doc, setDoc, getFirestore, Timestamp} from 'firebase/firestore';
import {getStorage, ref, uploadBytes} from 'firebase/storage';
import {checkImage, checkVideo} from './helperFunctions.js';
import { useNavigate } from 'react-router-dom';
export default function Upload({user,loading}) {

    const navigate = useNavigate();

    useEffect(()=> {
        if (loading) {
            console.log('loading....');
        } else {
            if (!user) {
                console.log('no user...')
                navigate('/sign-in')
            } else {
                console.log('user found: ', user.uid)
            }
        }
    }) 
    

    function fileChange(e, type) {
        e.preventDefault();
        let file = e.target.files[0];
        if (!file) {
            console.log('bruh...');
            return
        }
        let validity;
        switch (type ){
            case 'vid':
                validity = checkVideo(file.type, file.size);
                break;
            default:
                validity = checkImage(file.type, file.size);
                break;
        }
        if (!validity[0]) {
            e.target.setCustomValidity(validity[1]);
            e.target.reportValidity();
        } else {
            e.target.setCustomValidity('');
        }

    }
    function submit(e) {
        e.preventDefault();
        console.log('uploading...')
        let vidId = uuidv4();
        const videoInfo = {
            authorId: user.uid,
            time: Timestamp.fromDate(new Date()),
            likes: [],
            comments: [],
            title: e.target.title.value,
            description: e.target.description.value,
            private: e.target.private.value === 'private'
        }
        let thumbnail = e.target.thumbnail.files[0];
        let video = e.target.video.files[0];
        setDoc(doc(db, 'videos', vidId), videoInfo).then(()=> {
            console.log("Data stored.")
            let thumbnailRef = ref(storage, `thumbnail/tn-${vidId}.${thumbnail.name.split('.').pop()}`);
        uploadBytes(thumbnailRef, thumbnail).then(()=> {
            console.log('uploaded thumbnail')
        });
        let vidRef = ref(storage, `video/vid-${vidId}.${video.name.split('.').pop()}`);
        uploadBytes(vidRef, video).then(()=> {
            console.log('uploaded video')
        });
        }, (e) => {
            

            console.log(e);
        })
        


    }

    



    return <>
        <form onSubmit={submit}>
            <label htmlFor="video">Video: <input type="file" name="video" id="video" required accept='video/*' onChange={(e) => {fileChange(e, 'vid')}}/></label>
            <label htmlFor="thumbnail">Thumbnail: <input type="file" name='thumbnail' id='thumbnail' required accept='image/*'  onChange={(e) => {fileChange(e, 'img')}}></input></label>
            <label>Title <input type='text' name='title' required minLength='3' maxLength='75'></input></label>
            <label>Description <textarea name='description'></textarea></label>
            <label>Private <input type='checkbox' name='private' value='private'></input></label>
            <input type="submit"></input>
        </form>
    </>
}   