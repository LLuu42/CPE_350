var record = document.querySelector('#record');
var stop = document.querySelector('#stop');
var clips = document.querySelector('#clips');
var url = location.protocol + "//" + location.host + "/weather/audio";

var session = {
  audio: true,
  video: false
};

var recordRTC = null;

function handleSuccess(stream) {
    var options = {
        recorderType: StereoAudioRecorder,
        mimeType: 'audio/wav',
        numberOfAudioChannels: 1,
        desiredSampRate: 16 * 1000,
    };
    recordRTC = RecordRTC(stream, options);
    record.onclick = function() {
        recordRTC.startRecording();
        console.log("recorder started");
        record.style.background = "red";
        record.style.color = "black";
    }

    stop.onclick = function() {
        recordRTC.stopRecording(function(audioURL) {
            var recordedBlob = recordRTC.getBlob();

            var clipName = prompt("Enter a name for your sound clip.");
            var clipContainer = document.createElement('article');
            var clipLabel = document.createElement('p');
            var audio = document.createElement('audio');
            var deleteButton = document.createElement('button');

            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.innerHTML = "Delete";
            clipLabel.innerHTML = clipName;

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            clips.appendChild(clipContainer);

            audio.src = audioURL;

            /*
            recordRTC.getDataURL(function(dataURL) {
                console.log(dataURL);
            });
            */

            var fd = new FormData();
            fd.append('blob', recordedBlob);

            $.ajax({
                type: "POST",
                url: url,
                data: fd,
                processData: false,
                contentType: false,
            }).done(function(data) {
                console.log("successful!");
            });

        });
        console.log("recorder stopped");
        record.style.background = "";
        record.style.color = "";


    }

}

function onError(error) {
    console.log(error);
}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

} else {
    console.log("not supported");
}

navigator.getUserMedia(session, handleSuccess, onError);

/*
recordRTC.stopRecording(function(audioURL) {
    var formData = new FormData();
    formData.append('edition[audio]', recordRTC.getBlob())
    $.ajax({
        type: 'POST',
        url: 'some/path',
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
    })
});


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported!');
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function(stream) {
        var mediaRecorder = new MediaRecorder(stream, {'audioBitsPerSecond' : 16000});
        record.onclick = function() {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            record.style.background = "red";
            record.style.color = "black";
        }

        var chunks = [];

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }

        stop.onclick = function() {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            record.style.background = "";
            record.style.color = "";
        }

        mediaRecorder.onstop = function(e) {

            console.log("recorder stopped");

            var clipName = prompt("Enter a name for your sound clip.");
            var clipContainer = document.createElement('article');
            var clipLabel = document.createElement('p');
            var audio = document.createElement('audio');
            var deleteButton = document.createElement('button');

            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.innerHTML = "Delete";
            clipLabel.innerHTML = clipName;

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            clips.appendChild(clipContainer);


            var blob = new Blob(chunks, {'type' : 'audio/wav; codecs=1'});
            console.log(blob);

            var fd = new FormData();
            fd.append('blob', blob);

            $.ajax({
                type: "POST",
                url: url,
                data: fd,
                processData: false,
                contentType: false,
            }).done(function(data) {
                console.log("successful!");
            });

            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                console.log(reader.result);
            }

            var audioURL = window.URL.createObjectURL(blob);
            console.log(audioURL);

            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "download";
            a.click();
            window.URL.revokeObjectURL(audioURL);
            chunks = [];

            console.log("ajskl;daj;sl");


            var audioURL = window.URL.createObjectURL(blob);
            console.log(audioURL);
            audio.src = audioURL;

            deleteButton.onclick = function(e) {
                var eventTarget = e.target;
                eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
            }


        }

    }).catch(function(err) {
        console.log(err);
    });
} else {
    console.log("Media not supported.");
}

*/
