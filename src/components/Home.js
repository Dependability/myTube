import {useState, useEffect} from 'react';
import elkVid from './testVids/elkVid.mp4'
import Thumbnail from './Thumbnail';
import elk from './testVids/elk.jpg'
import Upload from './Upload'
import {db, storage} from '../Firebase';
import {collection, getDocs} from 'firebase/firestore';

import Layout from './Layout';

export default function Home({user}) {
    
    //Get videos from database first.
    const [videos, setVideos] = useState([])
    useEffect(()=> {
        
        getDocs(collection(db, 'videos')).then((res)=> {
            let arr = [];
            res.forEach((vid)=> {
                let date = vid.data().time.toDate();
                console.log(date)
                let obj = {
                    thumbnail: `tn-${vid.id}.jpg`,
                    ownerID: vid.data().authorId,
                    date: date,
                    title: vid.data().title,
                    views: vid.data().views

                };
                arr.push(obj);
                
            });
            setVideos(arr);
        })
        
        
    }, [])

    


    return <Layout>
        <div className='videos'>
        {videos.map((elem, index)=> <Thumbnail thumbnail={elem.thumbnail} ownerID={elem.ownerID} title={elem.title} date={elem.date} vid={elem.src} views = {elem.views}key={index}/>)}
        </div>
        
    </Layout>
}