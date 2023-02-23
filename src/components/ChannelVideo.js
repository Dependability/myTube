import { useEffect, useState } from "react";
import { formatTime } from "./helperFunctions";
import dayjs from "dayjs";
import {storage} from '../Firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiLock } from "@mdi/js";

export default function ChannelVideo({video, date}) {
    const [thumbnailURL, setThumbnail] = useState('');
    const navigate = useNavigate();
    const timeString = dayjs().to(dayjs(date));
   
    useEffect(()=> {
        const download = getDownloadURL(ref(storage, 'thumbnail/'+video.thumbnail));
        download.then((url) => {
            setThumbnail(url);
        })
    },[video] )
    
    
    return <div className='video-child' >
                    <div className="img-wrap" onClick={()=> {navigate(process.env.PUBLIC_URL + '/watch/' + video.id)}}>
                    <img src={thumbnailURL} alt='' />
                    <div className='time'>{formatTime(video.duration)}</div>
                    {video.private ? <div className='privateSymbol'><Icon path={mdiLock} color='#FFFFFF'></Icon></div> : ''}
                    </div>
                    <div className='video-title' onClick={()=> {navigate(process.env.PUBLIC_URL + '/watch/' + video.id)}}>{video.title}</div>
                    <div className="video-info">{video.views} {video.views === 1 ? 'view' : 'views'} • {timeString}</div>

                </div>
}


                    