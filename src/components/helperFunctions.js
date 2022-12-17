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
        console.log(type)
        return [false, "Invalid file type."];
    }

    if (size > 15000000) {
        return [false, "File size is too large."]
    }
    return [true]
}

export {checkImage, checkVideo}