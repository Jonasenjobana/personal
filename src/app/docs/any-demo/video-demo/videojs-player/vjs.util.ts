export function resolveUrl(url: string) {
    return {
        src: url,
        type: getSourceTypeByUrl(url)
    }
}
export function getSourceTypeByUrl(url: string) {
    if (url.endsWith('.m3u8')) {
        return 'application/x-mpegURL';
    } else if (url.endsWith('.mp4')) {
        return 'video/mp4';
    } else if (url.endsWith('.flv')) {
        if (url.startsWith('ws://')) {
            // ws flv
            return 'video/x-flv';
        }
        return 'video/x-flv';
    } else if (url.startsWith('webrtc://')) {
        return ''
    } else if (url.startsWith('rtmp://')) {
        return 'rtmp/flv'
    }
    return ''
}