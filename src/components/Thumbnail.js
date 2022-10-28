import {useState} from 'react';

export default function Thumbnail({thumbnail, owner, date, title, vid}) {

    



    return <>
        <a href={vid}>
        <img src={thumbnail} width='192' height='108' />
        </a>
        <h2>{title}</h2>
        <p>{owner}</p>
        <p>Created on {date}</p>
        
    </>
}