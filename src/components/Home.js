import {useState, useEffect} from 'react';
import Thumbnail from './Thumbnail';
import '../styles/styles.css';
import {db} from '../Firebase';
import {collection, getDocs, query, where} from 'firebase/firestore';

import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

export default function Home({user, loading}) {
    
    //Get videos from database first.
    const navigate = useNavigate();
    const [videos, setVideos] = useState([])
    useEffect(()=> {
        navigate('/')
        if (loading) {
            console.log('loading....');
        } else {
            if (!user) {
                console.log('no user...')
                
            } else {
                console.log('user found: ', user.uid);
                console.log(user)
        const publicVideoQuery = query(collection(db, 'videos'), where('private', '==', false))
        getDocs(publicVideoQuery).then((res)=> {
            let arr = [];
            res.forEach((vid)=> {
                let date = vid.data().time.toDate();
                let obj = {
                    id: vid.id,
                    thumbnail: `tn-${vid.id}.${vid.data().tbExt}`,
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
        
    }, [loading, user, navigate])

    


    return <Layout overlay={false} current='home' pfp={user ? user.photoURL.split('=')[0] : ''} uid={user ? user.uid : ''} name={user ? user.displayName : ''}>
        <div className='videos'>
        {videos.map((elem, index)=> <Thumbnail id={elem.id} thumbnail={elem.thumbnail} ownerID={elem.ownerID} title={elem.title} date={elem.date} duration={elem.duration} views = {elem.views}key={index}/>)}
        </div>
        
    </Layout>
}