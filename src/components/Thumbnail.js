import {useState, useEffect} from 'react';
import {storage, db} from '../Firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import {doc, getDoc} from 'firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
export default function Thumbnail({thumbnail, ownerID, date, title, vid, views}) {

    
    let [downloadURL, setUrl] = useState("");
    let [authorName, setName] = useState("");
    let timeString = dayjs().to(dayjs(date));
    useEffect(()=> {

        
        let download = getDownloadURL(ref(storage, `thumbnail/${thumbnail}`))
        let name = getDoc(doc(db, 'users',ownerID));
        
        download.then((url)=> {
            setUrl(url);
        })

        name.then((item) => {
            console.log(item.data())
            setName(item.data().displayName);
        })

    }, [])

    return <div className='video'>
        <a href="/" >
        <div className='imgwrap'>
        <img src={downloadURL} width='336' height='189' alt='thumbnail'/>
            <div className='time'>
                ??:??:??
            </div>
        </div>
        </a>
        <div className='info'>
            <div className='left'>
            <div className='pfp'></div>
            </div>
            <div className='right'>
            <h2 className='title'>{title}</h2>
            <p className='author'>{authorName}</p>
            <p>{views} {views === 1? ' view' : ' views'} • {timeString}</p>
            </div>
        </div>
        
        
        
        
    </div>
}