import {useState, useEffect} from 'react';
import elkVid from './testVids/elkVid.mp4'
import Thumbnail from './Thumbnail';
import elk from './testVids/elk.jpg'
import Upload from './Upload'
export default function Home() {
    const [videos, setVideos] =  useState([{
        'src': elkVid,
        'owner' : 'Depend',
        'date' : 1997,
        'length' : 9,
        'thumbnail': elk,
        'title': 'Elk Vid'


    },{
        'src': elkVid,
        'owner' : 'Depend',
        'date' : 1997,
        'length' : 9,
        'thumbnail': elk,
        'title': 'Elk Vid'


    }]);



    return <>
        <a href=""> Upload Video!</a>
        <Upload />
        {videos.map((elem, index)=> <Thumbnail thumbnail={elem.thumbnail} owner={elem.owner} title={elem.title} date={elem.date} vid={elem.src} key={index}/>)}
        
        
    </>
}