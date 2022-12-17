import {useState, useEffect} from 'react';
import {storage, db} from '../Firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import {doc, getDoc} from 'firebase/firestore';
export default function Thumbnail({thumbnail, ownerID, date, title, vid}) {

    
    let [downloadURL, setUrl] = useState('');
    let [authorName, setName] = useState('');
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

    return <>
        <a href="/" >
        
        <img src={downloadURL} width='192' height='108' alt='thumbnail'/>
        </a>
        <h2>{title}</h2>
        <p>By: {authorName}</p>
        <p>Uploaded {date}</p>
        
    </>
}