import { useEffect, useState } from "react";
import Layout from "./Layout";
import {db} from '../Firebase';
import { doc, getDoc, getDocs, collection, query,where,arrayUnion,arrayRemove,updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import ChannelVideo from './ChannelVideo';
export default function Channel({loading, user}) {
    const [subscribed, setSubscribed] = useState(false);
    const [channel, setChannelInfo] = useState({title: 'Channel Name', subscribers: 0, photoURL: ''});
    const [channelVideos, setChannelVideos] = useState([]);
    const navigate = useNavigate();
    const {channelid} = useParams();

    useEffect(()=> {
        if (loading) {

        } else {
            if (user) {
                console.log('user')
                const authorRef = doc(db, 'users', channelid);
                getDoc(authorRef).then(authorSnap => {
                const authorData = authorSnap.data();
                if (!authorData) {
                    navigate('/');
                    return
                }
                if (authorData.subscribers.includes(user.uid)) {
                    setSubscribed(true);
                }
                setChannelInfo((c) => {
                        let copy = {...c};
                        copy.title = authorData.displayName;
                        copy.subscribers = authorData.subscribers.length;
                        copy.photoURL = authorData.photoURL;
                        return copy;
                    })
                }); 
                let videoQuery = query(collection(db, 'videos'), where('authorId', '==', channelid), where('private','==', false));
                if (user.uid === channelid) {
                    videoQuery = query(collection(db, 'videos'), where('authorId', '==', channelid));
                }
                getDocs(videoQuery).then(videoSnap => {
                    let videoArray = []
                    videoSnap.forEach((vid)=> {
                        const data = vid.data();
                        videoArray.push({title: data.title, duration: data.duration, views: data.views, id: vid.id, thumbnail: `tn-${vid.id}.${data.tbExt}`,date: data.time.toDate(), private: data.private});                  
                        setChannelVideos(videoArray);
                            });
                        });



            } else {
                navigate('/');
            }
        }
    }, [loading, channelid, navigate, user])
    return <Layout pfp={user ? user.photoURL.split('=')[0] : ''} uid={user ? user.uid : ''} name={user ? user.displayName : ''} current={user.uid === channelid ? 'videos' :null}>
        <div className='channel-view'>
            <div className='header'>
                <div className='inner-header'>
                    <div className='channel-info'>
                        <div className='pfp'>
                            <img src={channel.photoURL} alt=''></img>
                        </div>
                        <div className='info'>
                            <div className='name'>{channel.title}</div>
                            <div className='subscribers'>{channel.subscribers} {channel.subscribers === 1 ? 'subscriber' : 'subscribers'}</div>
                        </div>
                        
                    </div>
                    {user.uid !== channelid ? <div className={'subscribeBtn' + (subscribed ? ' subbed' : '')} onClick={()=>{  
                        console.log('subscribe')
                        if (!subscribed) {
                            updateDoc(doc(db, 'users', channelid), {
                                subscribers: arrayUnion(user.uid)
                            })
                            updateDoc(doc(db, 'users', user.uid), {
                                subscriptions: arrayUnion(channelid)
                            }).then(()=> {
                                setSubscribed(true);
                                setChannelInfo((c) => {
                                    let copy = {...c};
                                    copy.subscribers = c.subscribers + 1;
                                    return copy;
                                })
                            })
                        } else {
                            updateDoc(doc(db, 'users', channelid), {
                                subscribers: arrayRemove(user.uid)
                            })
                            updateDoc(doc(db, 'users', user.uid), {
                                subscriptions: arrayRemove(channelid)
                            }).then(()=> {
                                setSubscribed(false);
                                setChannelInfo((c) => {
                                    let copy = {...c};
                                    copy.subscribers = c.subscribers - 1;
                                    return copy;
                                })
                            })
                        }


                        
                    }}>{subscribed ? 'Subscribed' : 'Subscribe'} </div> : ''}
                </div>
                
            </div>
            <div className='selection-bar'>
                <div className='selection'>VIDEOS</div>
            </div>
            <div className='line'></div>
            <div className='channel-videos'>
                {channelVideos.map((video, i)=>{
                    return <ChannelVideo video={video} date={video.date} key={i}/>

                    
                })}
                
            </div>
        </div>
    </Layout>
}