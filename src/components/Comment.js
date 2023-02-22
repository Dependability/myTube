import Layout from "./Layout";
import { useNavigate, useParams  } from "react-router-dom";
import {useState, useEffect} from 'react';
import '../styles/styles.css';
import Icon from "@mdi/react";
import dayjs from 'dayjs';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";


export default function Comment({comment}) {
    let [commentInfo, setCommentInfo] = useState({name: 'Name', pfp: ''})
    
    useEffect(()=> {
        getDoc(doc(db, 'users', comment.author)).then((doc)=> {
            let data = doc.data();
            setCommentInfo((c) => {
                let copy = {...c};
                copy.pfp = data.photoURL;
                copy.name = data.displayName;
                return copy
            })
        })
    }, [comment])
    return <div className='comment'>
    <div className='pfp'>
        <img src={commentInfo.pfp} alt='' />
    </div>
    <div className='right'>
        <div className='info'>
            <div className='name'>{commentInfo.name}</div>
            <div className='timeago'>{dayjs().to(dayjs(comment.time.toDate()))}</div>
        </div>
        <div className='text'>{comment.text}</div>
    </div>

    </div>
}