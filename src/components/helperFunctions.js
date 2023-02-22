function checkImage(type, size) {
    const validTypes = [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon"
      ];
    if (!(validTypes.includes(type))) {
        return [false, "Invalid file type."];
    }

    console.log(size)
    if (size > 3000000) {
        return [false, "File size is too large."]
    }

    return [true];
}

function checkVideo(type, size) {
    const validTypes = [
        'video/webm',
        'video/ogg',
        'video/mp4'
    ];
    if (!(validTypes.includes(type))) {
        return [false, "Invalid file type."];
    }

    if (size > 15000000) {
        return [false, "File size is too large."]
    }
    return [true]
}

function formatTime(time) {
    time = Math.round(time);
    //time = 1000
    let hours = Math.floor(time/3600);
    
    time -= (hours * 3600);
    let minutes = Math.floor(time/60);
    time -= (minutes * 60);
    let seconds = time;

    if (hours > 0) {
        return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}`
    } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }


}
export {checkImage, checkVideo, formatTime}