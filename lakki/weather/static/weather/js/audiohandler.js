var record = document.querySelector('#record');
var stop = document.querySelector('#stop');
var clips = document.querySelector('#clips');
var audioEndpoint = location.protocol + "//" + location.host + "/weather/audio";

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

            /*
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
            */

            /*
            recordRTC.getDataURL(function(dataURL) {
                console.log(dataURL);
            });
            */

            var fd = new FormData();
            fd.append('blob', recordedBlob);

            $.ajax({
                type: "POST",
                url: audioEndpoint,
                data: fd,
                processData: false,
                contentType: false,
            }).done(function(data) {
                console.log("successful!");
                console.log(data);
                var snd = new Audio("data:audio/mpeg;base64," + data.mp3);
                snd.play();
                $("<p>" + data.command + "</p>").appendTo("#returned");
            });

            recordRTC.reset();

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
    console.log("supported");
    navigator.getUserMedia(session, handleSuccess, onError);
} else {
    console.log("not supported");
}
