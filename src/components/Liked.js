import {useState, useEffect} from 'react';
import Thumbnail from './Thumbnail';
import '../styles/styles.css';
import {db, storage} from '../Firebase';
import {collection, getDocs, query, where} from 'firebase/firestore';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';

export default function Liked({user, loading}) {
    

    //Get videos from database first.
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
        if (loading) {
            console.log('loading....');
        } else {
            if (!user) {
                console.log('no user...')
                navigate('/sign-in')
            } else {
                console.log('user found: ', user.uid);

                
                const likeQuery = query(collection(db, 'videos'), where('likes', 'array-contains', user.uid) );

                getDocs(likeQuery).then((res)=> {
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
            }
        }
    }, [loading]) 

    


    return <Layout overlay={false} current='liked' pfp={user ? user.photoURL.split('=')[0] : ''}>
        <div className='videos'>
        {videos.map((elem, index)=> <Thumbnail id={elem.id} thumbnail={elem.thumbnail} ownerID={elem.ownerID} title={elem.title} date={elem.date} duration={elem.duration} views = {elem.views}key={index}/>)}
        </div>
        
    </Layout>
}