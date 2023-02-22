import {useState, useEffect} from 'react';
import {storage, db}from '../Firebase';
import { uuidv4 } from '@firebase/util';
import {doc, setDoc, getFirestore, Timestamp} from 'firebase/firestore';
import {getStorage, ref, uploadBytes} from 'firebase/storage';
import {checkImage, checkVideo} from './helperFunctions.js';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import '../styles/styles.css';
import Icon from '@mdi/react';
import { mdiClose, mdiFileImagePlusOutline, mdiUpload } from '@mdi/js';
export default function Upload({user,loading}) {

    const navigate = useNavigate();
    const [videoInfo, setVideoInfo] = useState({private: false});
    const [uploadError, setUploadError] = useState("");
    const [uploadIng, setUploading] = useState([false, "NULL"])
    

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
    }, [loading]) 


    

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
            setUploadError(validity[1])
        } else {
            e.target.setCustomValidity('');
            if (type === 'vid') {
                let sampleVideo = document.createElement('video');
                sampleVideo.setAttribute('src', URL.createObjectURL(file));
                sampleVideo.preload = 'metadata';
                sampleVideo.onloadedmetadata = (e)=> {
                    setVideoInfo((c) => {
                        let copy = {...c};
                        copy.duration = sampleVideo.duration;
                        copy.video = true;
                        copy.title = file.name.substring(0, 100);
                        const nameSplit = file.name.split('.');
                        copy.extension = nameSplit[nameSplit.length - 1];
                        return copy;
                        
                    })
                }
            } else {
                console.log(file)
                setVideoInfo((c) => {
                    let copy = {...c};
                    copy.thumbnail = true;
                    const nameSplit = file.name.split('.');
                    copy.tbExt = nameSplit[nameSplit.length - 1];
                    return copy;
                })

            }
            
        }

    }
    function submit(e) {
        e.preventDefault();
        console.log('uploading...')
        let vidId = uuidv4();
        if (!user) {
            return;
        }
        
        const vidInfo = {
            authorId: user.uid,
            time: Timestamp.fromDate(new Date()),
            likes: [],
            comments: [],
            title: videoInfo['title'],
            description: videoInfo['desc'],
            private: videoInfo['private'],
            duration: videoInfo['duration'],
            views: 0,
            extension: videoInfo['extension'],
            tbExt: videoInfo['tbExt']
        }
        if (!vidInfo['description']) {
            vidInfo["description"] = "";
        }
        let videoForm = document.querySelector('#formVideo');
        let thumbnail = videoForm.thumbnail.files[0];
        let video = videoForm.video.files[0];
        setDoc(doc(db, 'videos', vidId), vidInfo).then(()=> {
            setUploading([true, 'Uploading...']);
            console.log("Data stored.")
            let thumbnailRef = ref(storage, `thumbnail/tn-${vidId}.${thumbnail.name.split('.').pop()}`);
        uploadBytes(thumbnailRef, thumbnail).then(()=> {
            console.log('uploaded thumbnail')
        });
        let vidRef = ref(storage, `video/vid-${vidId}.${video.name.split('.').pop()}`);
        uploadBytes(vidRef, video).then(()=> {
            console.log('uploaded video')
            setUploading([true, 'Uploaded!']);
        });
        }, (e) => {
            

            console.log(e);
        })
        


    }

    



    return <Layout pfp={user ? user.photoURL.split('=')[0] : ''} uid={user ? user.uid : ''}>
        <form style={{'display': 'none'}} id='formVideo'>
            <input type="file" name="video" id="video" required accept='video/*' onChange={(e) => {fileChange(e, 'vid')}} hidden/>
            <input type="file" name='thumbnail' id='thumbnail' required accept='image/*'  onChange={(e) => {fileChange(e, 'img')}} hidden></input>
            <input type='checkbox' name='private' value='private' hidden></input>
        </form>
        <div className='upload-wrap'>
            {!videoInfo['video']? <div className='upload-vid'>
                <header>
                    <h2>Upload video</h2>
                    <Icon path={mdiClose} size ={1} onClick={()=>{navigate('/')}}/>
                </header>
                <div className='body'>
                    
                    <div className='uploadicon-wrap' onClick={()=> {
                        document.querySelector('#formVideo #video').click();
                    }}>
                        <Icon path={mdiUpload}/>
                    </div>
                    <div className='disclaimer'>
                        Your videos will be public when you publish them.
                    </div>
                    <button onClick={()=> {
                        document.querySelector('#formVideo #video').click();
                    }}>SELECT FILE</button>
                    <div className='uploadError'>{uploadError}</div>
                </div>
            </div> : 
        <div className='upload-vid'>
                <header>
                    <h2>{videoInfo["title"]}</h2>
                    <Icon path={mdiClose} size ={1} onClick={()=>{navigate('/')}}/>
                </header>
                <div className='body-mod'>
                    <div className='left'>
                        <h2>Details</h2>
                        <div>
                            <div className='input-surround'>
                            <h4>Title (required)</h4>
                            <textarea htmlFor='title' placeholder='Add a title that describes your video' value={videoInfo['title']} onChange={(e)=> {
                                setVideoInfo((c) => {
                                    let copy = {...c};
                                    copy.title = e.target.value;
                                    return copy
                                })
                            }}>
                                
                            </textarea>
                            </div>
                            <div className='input-surround'>
                            <h4>Description</h4>
                            <textarea htmlFor='desc' placeholder="Tell viewers about your video" value={videoInfo['desc']} onChange={(e)=> {
                                setVideoInfo((c) => {
                                    let copy = {...c};
                                    copy.desc = e.target.value;
                                    return copy
                                })
                            }}>

                            </textarea>
                            </div>
                        </div>
                        <h3>Thumbnail</h3>
                        <p>Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention.</p>
                        <div className='thumbnail-upload'>
                            <div className='upload-first' onClick={()=> {document.querySelector('#thumbnail').click()}}>
                                <Icon path={mdiFileImagePlusOutline} />
                                <p>Upload Thumbnail</p>
                            </div>
                            
                            {videoInfo.thumbnail ? <img src={URL.createObjectURL(document.querySelector('#thumbnail').files[0])} alt='' />: ''}

                        </div>
                        <h3>Visibility</h3>
                        <p>Choose who can see your video.</p>
                        <div className='radio'>
                            Yea WIP
                        </div>
                        
                    </div>
                    <div className='right'>
                        <div className='vid-preview'>
                            <div className='video-prev'>
                                <video preload="auto" controls controlsList='nodownload'  width="100%" src={URL.createObjectURL(document.querySelector('#video').files[0])}></video>
                            </div>
                            <div className='info'>
                                <p className='header'>
                                    Filename
                                </p>
                                <p className='name'>
                                    {document.querySelector('#video').files[0].name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer>
                        {uploadIng[0] ? <div className='status'>{uploadIng[1]}</div> : <button onClick={submit}>Upload</button>}
                    
                </footer>
            </div>}
        </div>
    </Layout>
}   