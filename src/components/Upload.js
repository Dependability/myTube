//import {useState, useEffect} from 'react';

export default function Upload({user}) {
    

    function submit(e) {
        console.log(e.target.files)
        e.preventDefault();
    }

    



    return <>
        <form onSubmit={submit}>
            <label htmlFor="video">Video: <input type="file" name="Video" id="video" required/></label>
            <label htmlFor="thumbnail">Thumbnail: <input type="file" name='thumbnail' id='thumbnail'></input></label>
            <input type="submit"></input>
        </form>
    </>
}   