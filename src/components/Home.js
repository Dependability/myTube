import {useState, useEffect} from 'react';
import elkVid from './testVids/elkVid.mp4'
import Thumbnail from './Thumbnail';
import '../styles/styles.css';
import elk from './testVids/elk.jpg'
import Upload from './Upload'
import {db, storage} from '../Firebase';
import {collection, getDocs} from 'firebase/firestore';

import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

export default function Home({user, loading}) {
    
    //Get videos from database first.
    const navigate = useNavigate();
    const [videos, setVideos] = useState([])
    useEffect(()=> {
        if (loading) {
            console.log('loading....');
        } else {
            if (!user) {
                console.log('no user...')
                navigate('/sign-in')
            } else {
                console.log('user found: ', user.uid);
        
        getDocs(collection(db, 'videos')).then((res)=> {
            let arr = [];
            res.forEach((vid)=> {
                let date = vid.data().time.toDate();
                console.log(date)
                let obj = {
                    id: vid.id,
                    thumbnail: `tn-${vid.id}.jpg`,
                    ownerID: vid.data().authorId,
                    date: date,
                    title: vid.data().title,
                    views: vid.data().views,
                    duration: vid.data().duration,

                };
                arr.push(obj);
                
            });
            setVideos(arr);
        })
    }}
        
    }, [])

    


    return <Layout overlay={false} current='home' pfp={user ? user.photoURL.split('=')[0] : ''}>
        <div className='videos'>
        {videos.map((elem, index)=> <Thumbnail id={elem.id} thumbnail={elem.thumbnail} ownerID={elem.ownerID} title={elem.title} date={elem.date} duration={elem.duration} views = {elem.views}key={index}/>)}
        </div>
        
    </Layout>
}