import Layout from "./Layout";
import { useNavigate, useParams  } from "react-router-dom";
import {useState, useEffect} from 'react';
import '../styles/styles.css';
import Icon from "@mdi/react";
import { mdiShareOutline, mdiThumbDownOutline, mdiThumbUpOutline,mdiThumbUp} from "@mdi/js";
import {db, storage} from '../Firebase';
import { doc, getDoc, increment, updateDoc,arrayUnion, Timestamp, arrayRemove} from "firebase/firestore";
import {ref, getDownloadURL} from 'firebase/storage';
import Comment from './Comment'

export default function Video({user, loading}) {

    const [videoInfo, setVideoInfo] = useState({title: '' ,description: '', likes: 0, uploadDate: new Date(), views: 0, url:'', viewed: false, liked: false, comments: []});
    const [authorInfo, setAuthorInfo] = useState({displayName: "Author", subscribers: 0, pfp: '', authorId: ''});
    const [commentInfo, setCommentInfo] =useState([]);
    const [subscribed, setSubscribed] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const {vidid} = useParams();
    const navigate = useNavigate();
    console.log(vidid);

    useEffect(()=> {
        if (refresh) {
            setRefresh(false);
            return
        }
        if (loading) {
            console.log('loading....');
        } else {
            if (!user) {
                console.log('no user...')
                navigate('/')
            } else {
                console.log('user found: ', user.uid);
                const docRef = doc(db, "videos", vidid);
        getDoc(docRef).then((docSnap)=> {
            console.log("Document Data: ", docSnap.data());
            const videoData = docSnap.data();
            

            setVideoInfo((c) => {
                let copy = {...c};
                copy.title = videoData.title;
                copy.description = videoData.description;
                copy.uploadDate = videoData.time.toDate();
                copy.likes = videoData.likes.length;
                copy.views = videoData.views;
                copy.liked = videoData.likes.includes(user.uid);



                return copy
                
            });

            setCommentInfo(()=> {
                console.log(videoData.comments)
                let copy = [...videoData.comments];
                copy.reverse();
                console.log(copy);
                return copy;
            })
            let download = getDownloadURL(ref(storage, `video/vid-${vidid}.${videoData.extension}`));
            download.then((url)=> {
                setVideoInfo((c) => {
                    let copy = {...c};
                    copy.url = url;
                    return copy;
                })
                });
            
            
            

            const authorRef = doc(db, 'users', videoData.authorId);
            getDoc(authorRef).then(authorSnap => {
                const authorData = authorSnap.data();
                if (authorData.subscribers.includes(user.uid)) {
                    setSubscribed(true)
                }
                setAuthorInfo((c) => {
                    let copy = {...c};
                    copy.authorId = videoData.authorId
                    copy.displayName = authorData.displayName;
                    copy.subscribers = authorData.subscribers.length;
                    copy.pfp = authorData.photoURL;
                    return copy;
                })
            });
        })
                
            }
        }
    }, [loading, refresh, user, navigate, vidid]) 

    useEffect(()=> {
        

    }, []);

    return  <Layout pfp={user ? user.photoURL.split('=')[0] : ''} uid={user ? user.uid : ''} name={user ? user.displayName : ''}>
        <div className='view-page'>
            <div className='vid'>
            <div className='frame'>
                <video controls width='auto' height='100%' src={videoInfo.url} onPlay={()=> {
                    if (videoInfo.viewed) {
                        return
                    } else {
                        const videoRef = doc(db, 'videos', vidid);
                        updateDoc(videoRef, {views: increment(1)}).then(()=> {
                            setVideoInfo((c) => {
                                let copy = {...c};
                                copy.viewed = true;
                                return copy
                            })
                        });
                        

                    }
                }}></video>
            </div>
            <div className='title'>{videoInfo.title}</div>
            <div className='info-bar'>
                <div className='left'>
                    <div className='pfp' onClick={()=> {navigate(`/channel/${authorInfo.authorId}`)}}>
                        <img src={authorInfo.pfp + '=c-k-c0x00ffffff-no-rj'} alt=''></img>
                    </div>
                    <div className='author'>
                        <div className='author-name' onClick={()=> {navigate(`/channel/${authorInfo.authorId}`)}}>{authorInfo.displayName}</div>
                        <div className='subscriber-count'>{authorInfo.subscribers} subscriber{authorInfo.subscribers === 1 ? "" : "s"}</div>        
                    </div>
                    {user ? (user.uid !== authorInfo.authorId ? <div className={'subscribeBtn' + (subscribed ? ' subbed' : '')} onClick={()=>{  
                        if (!subscribed) {
                            updateDoc(doc(db, 'users', authorInfo.authorId), {
                                subscribers: arrayUnion(user.uid)
                            })
                            updateDoc(doc(db, 'users', user.uid), {
                                subscriptions: arrayUnion(authorInfo.authorId)
                            }).then(()=> {
                                setSubscribed(true);
                                setAuthorInfo((c) => {
                                    let copy = {...c};
                                    copy.subscribers = c.subscribers + 1;
                                    return copy;
                                })
                            })
                        } else {
                            updateDoc(doc(db, 'users', authorInfo.authorId), {
                                subscribers: arrayRemove(user.uid)
                            })
                            updateDoc(doc(db, 'users', user.uid), {
                                subscriptions: arrayRemove(authorInfo.authorId)
                            }).then(()=> {
                                setSubscribed(false);
                                setAuthorInfo((c) => {
                                    let copy = {...c};
                                    copy.subscribers = c.subscribers - 1;
                                    return copy;
                                })
                            })
                        }


                        
                    }}>{subscribed ? 'Subscribed' : 'Subscribe'} </div> : '') : ''}
                    
                </div>
                <div className='right'>
                    <div className='likes'>
                        <div className={'like-btn '} onClick={()=> {
                            if (!videoInfo.liked) {
                                updateDoc(doc(db, 'videos', vidid), {likes: arrayUnion(authorInfo.authorId)}).then((data) => {
                                    setVideoInfo((c) => {
    
                                        let copy = {...c};
                                        copy.likes = c.likes + 1;
                                        copy.liked = true;
                                        return copy;
                                    })
                                })
                            } else {
                                updateDoc(doc(db, 'videos', vidid), {likes: arrayRemove(authorInfo.authorId)}).then((data) => {
                                    setVideoInfo((c) => {
    
                                        let copy = {...c};
                                        copy.likes = c.likes - 1;
                                        copy.liked = false;
                                        return copy;
                                    })
                                })
                            }
                            
                        }}>
                            <Icon path={videoInfo.liked ? mdiThumbUp : mdiThumbUpOutline}></Icon>
                            <div className="like-amount">{videoInfo.likes} </div>
                        </div>
                        <div className='dislike-btn'>
                            <Icon path={mdiThumbDownOutline}></Icon>
                        </div>
                    </div>
                    <div className='share'>
                        <Icon path={mdiShareOutline}></Icon>
                        Share
                    </div>
                </div>
            </div>
            <div className='description'>
                <div className='top'>
                    <div className='views'>{videoInfo.views} {videoInfo.views === 1 ? 'view' : 'views'}</div>
                    <div className='date'>{new Date(videoInfo.uploadDate).toLocaleDateString('en-us', {year: 'numeric', month: 'short', day: 'numeric'})}</div>
                </div>
                <div className='body'>{videoInfo.description}</div>
            </div>
            </div>
            <div className='comment-wrapper'>
                <div className='comment-count'>{commentInfo.length} {commentInfo.length === 1 ? "Comment" : "Comments" }</div>
                <div className='comment-add'>
                    <div className='pfp' onClick={()=> {navigate(`/channel/${user ? user.uid : ''}`)}}>
                        <img src={user ? user.photoURL.split('=')[0] + '=c-k-c0x00ffffff-no-rj' : ''} alt=''></img>
                    </div>
                    <div className='right'>
                        <div className='commentText' contentEditable data-text={"Add a comment..."}></div>
                        <div className='commentButtons'>
                            <div className='cancel'>Cancel</div>
                            <div className='commentBtn' onClick={()=> {
                                let commentBody = document.querySelector('.right .commentText');
                                if (commentBody.textContent !== '') {
                                    updateDoc(doc(db, 'videos', vidid), {comments: arrayUnion({
                                        author: user.uid,
                                        time: Timestamp.fromDate(new Date()) ,
                                        text: commentBody.textContent
                                    })}).then(()=> {
                                        console.log('Comment success');
                                        commentBody.textContent = '';
                                        setRefresh(true);


                                    })
                                    
                                }
                            }}>Comment</div>
                        </div>
                    </div>
                    
                </div>
                <div className='comments'>
                    {commentInfo.map((comment, i) => {
                        return <Comment comment={comment} key={i}/>
                    })}
                   
                </div>
            </div>
        </div>
    </Layout>   
}