var record = document.querySelector('#record');
var stop = document.querySelector('#stop');
var clips = document.querySelector('#clips');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported!');
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function(stream) {
        var mediaRecorder = new MediaRecorder(stream);
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
            /*
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
            */

            var blob = new Blob(chunks, {'type' : 'audio/wav'});
            console.log(blob);
            chunks = [];

            $.ajax({
                type: "POST",
                url: url,
                data: {
                    "input": text,
                    "session": session
                },
                beforeSend: function(xhr) {
                    textarea.val('');
                    $("#returned").empty();
                    $("<p>loading...</p>").appendTo("#returned");
                    console.log(text);
                }

            }).done(function(data) {
                console.log("successful!");
            });

            /*
            var audioURL = window.URL.createObjectURL(blob);
            console.log(audioURL);
            audio.src = audioURL;

            deleteButton.onclick = function(e) {
                var eventTarget = e.target;
                eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
            }
            */

        }

    }).catch(function(err) {
        console.log(err);
    });
} else {
    console.log("Media not supported.");
}

/*
var handleSuccess = function(stream) {
    var context = new AudioContext();
    var source = context.createMediaStreamSource(stream);
    var processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
      // Do something with the data, i.e Convert this to WAV
      console.log(e.inputBuffer);
    };
};
*/
