
const socket = io('/')


const videogrid = document.getElementById('video-grid');
const myvideo = document.createElement('video');


const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '8000'
})

myvideo.muted = true;


let videoStream


let constrainObj = {
    audio: true,
    video: true

}



//the below function is a promise that take the permission argument here constrainObj
navigator.mediaDevices.getUserMedia(constrainObj)  //this is the main function that provide media function
    .then(stream => { //then will be used when we keep the promise event to true 
        //here stream will contain the audio and video
        videoStream = stream;
        addvideoStream(myvideo, stream)





        peer.on('call', call => {
            // getUserMedia({ video: true, audio: true }, function (stream) 
            // console.log("getting the call")
            call.answer(stream); // Answer the call with an A/V stream.
            const video = document.createElement('video');

            call.on('stream', userVideoStream => {
                addvideoStream(video, userVideoStream);
            });
        })




        socket.on('user-connected', (userId) => {
            // connectToUser(userId, stream);
            setTimeout(connectToUser, 1000, userId, stream)
        })



        let text = $("input");

        // when press enter send message
        $('html').keydown((e) => {
            if (e.which == 13 && text.val().length !== 0) {
                console.log(text.val());
                socket.emit('message', text.val());
                text.val('')
            }
        });

        socket.on('createMsg', message => {
            console.log('Coming form server ', message)
            $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
            scrollToBottom()
        })

    })




socket.on('user-disconnected', userId => {
    if (peer[userId]) peer[userId].close()
})





peer.on('open', id => {
    console.log(`This is new id connected by the peer for every viwer ${id}`)
    //this will send request to server and socket.on will accept it
    socket.emit('join-room', ROOM_ID, id) //this ROOM_ID variable comes from the ejs fileso than we can send request to join the particular room
})




// socket.on('user-connected', (userId)=>{
//     connectToUser(userId, stream);
// })


const connectToUser = (userId, stream) => {
    // console.log(`new user connected ${userId}`) //i am my stream to the user by call
    // we'll just now call the user using peer
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addvideoStream(video, userVideoStream); //adding the user video stream
        // console.log("call initiated")
    });
}


// const addvideoStream = (video, stream) => {
//     video.srcObject = stream; //video source is the stream that is coming in

//     video.addEventListener('loadedmetadata', () => { //when loadedmetadata has loaded the data the function is fired and we have addded event listener as more than one data will be loaded at the time
//         //loadmetadata shows all the things thats being captured on the webcam
//         video.play();
//     })
//     //now we want the video to add in a particular section here videogrid
//     videogrid.append(video);

// }

const addvideoStream = (video, stream) => {
    video.srcObject = stream; //video source is the stream that is coming in

    video.addEventListener('loadedmetadata', () => { //when loadedmetadata has loaded the data the function is fired and we have addded event listener as more than one data will be loaded at the time
        //loadmetadata shows all the things thats being captured on the webcam
        video.play();
    })
    //now we want the video to add in a particular section here videogrid
    videogrid.append(video);

}

const scrollToBottom = () => {
    var d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = videoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        videoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        videoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `<i style="height: 2rem;" class="fas fa-microphone"></i><span>Mute</span>`
    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `<i style="height: 2rem;" class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`
    document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () => {
    console.log('object')
    let enabled = videoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        videoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        videoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `<i style="height: 2rem;" class="fas fa-video"></i><span>Stop Video</span> `
    document.querySelector('.main_video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `<i style="height: 2rem; color: red" class="stop fas fa-video-slash"></i><span>Play Video</span>`
    document.querySelector('.main_video_button').innerHTML = html;
}