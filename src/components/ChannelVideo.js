import { useEffect, useState } from "react";
import { formatTime } from "./helperFunctions";
import dayjs from "dayjs";
import {relativeTime} from 'dayjs/plugin/relativeTime';
import {storage} from '../Firebase';
import {ref, getDownloadURL} from 'firebase/storage';
import { useNavigate } from "react-router-dom";

export default function ChannelVideo({video, date}) {
    const [thumbnailURL, setThumbnail] = useState('');
    console.log(date)
    const navigate = useNavigate();
    const timeString = dayjs().to(dayjs(date));
    const download = getDownloadURL(ref(storage, 'thumbnail/'+video.thumbnail));
    useEffect(()=> {
        download.then((url) => {
            setThumbnail(url);
        })
    },[video])
    
    
    return <div className='video-child' >
                    <div className="img-wrap" onClick={()=> {navigate('/watch/' + video.id)}}>
                    <img src={thumbnailURL} alt='' />
                    <div className='time'>{formatTime(video.duration)}</div>
                    </div>
                    <div className='video-title' onClick={()=> {navigate('/watch/' + video.id)}}>{video.title}</div>
                    <div className="video-info">{video.views} {video.views === 1 ? 'view' : 'views'} • {timeString}</div>

                </div>
}


                    