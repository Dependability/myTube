import {useState, useEffect} from 'react';
import {storage, db} from '../Firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import {doc, getDoc} from 'firebase/firestore';
import dayjs from 'dayjs';
import '../styles/styles.css';
import relativeTime from 'dayjs/plugin/relativeTime';
import {formatTime} from './helperFunctions';
import {useNavigate} from 'react-router-dom';
import Icon from '@mdi/react';
import {mdiLock} from '@mdi/js';
dayjs.extend(relativeTime);
export default function Thumbnail({id, thumbnail, ownerID, date, title, views, duration, privacy}) {

    
    let [downloadURL, setUrl] = useState("");
    let [authorName, setName] = useState("");
    let [authorpfp, setAuthorPfp] = useState('')
    let timeString = dayjs().to(dayjs(date));
    let navigate = useNavigate();
    useEffect(()=> {
        let download = getDownloadURL(ref(storage, `thumbnail/${thumbnail}`))
        let name = getDoc(doc(db, 'users',ownerID));
        download.then((url)=> {
            setUrl(url);
        })

        name.then((item) => {
            setName(item.data().displayName);
            setAuthorPfp(item.data().photoURL)
        })

    }, [thumbnail, ownerID])

    return <div className='video'>
        <div >
        <div className='imgwrap'>
        <img onClick={()=> {navigate(process.env.PUBLIC_URL + '/watch/' + id)}} src={downloadURL} width='336' height='189' alt='thumbnail'/>
            <div className='time'>
                {formatTime(duration)}
            </div>
            {privacy ? <div className='privateSymbol'><Icon path={mdiLock} color='#FFFFFF'></Icon></div> : ''}
        </div>
        </div>
        <div className='info'>
            <div className='left'>
            <div className='pfp' onClick={()=> {navigate(process.env.PUBLIC_URL + `/channel/${ownerID}`)}}>
                <img src={authorpfp  + '=c-k-c0x00ffffff-no-rj'} alt=''></img>
            </div>
            </div>
            <div className='right'>
            <h2 className='title' onClick={()=> {navigate(process.env.PUBLIC_URL + '/watch/' + id)}}>{title}</h2>
            <p className='author' onClick={()=> {navigate(process.env.PUBLIC_URL + `/channel/${ownerID}`)}}>{authorName}</p>
            <p>{views} {views === 1? ' view' : ' views'} • {timeString}</p>
            </div>
        </div>
        
        
        
        
    </div>
}