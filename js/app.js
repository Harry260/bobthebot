const app = {
   models: "src/models/face-models",
   inervalSet: false,
   tts: false,
};

if ("speechSynthesis" in window) {
   app.tts = true;
   var msg = new SpeechSynthesisUtterance();
}

const //Variable
   video = document.querySelector(".temp-video"),
   textHero = $(".sentance-hero"),
   infoText = $(".info-text"),
   loadOverlay = $(".load-overlay");

var expressionEmojis = {
   happy: "😄",
   sad: "😢",
   angry: "😡",
   neutral: "😐",
   surprised: "😮",
   fearful: "😱",
};

Promise.all([
   faceapi.nets.tinyFaceDetector.loadFromUri(app.models),
   faceapi.nets.faceRecognitionNet.loadFromUri(app.models),
   faceapi.nets.faceExpressionNet.loadFromUri(app.models),
]).then(function () {
   var int = localStorage.getItem("interval") || 1000;
   intervalSlider.val(int);
   loadOverlay.fadeOut(1000);
});

// Functions //
function startVideo() {
   navigator.mediaDevices
      .getUserMedia({
         video: true,
      })
      .then(function (stream) {
         video.srcObject = stream;
      })
      .catch(function (err) {
         textViewState("Something went wrong.");
         if (err.name == "NotAllowedError") {
            var errTxt = "Permission for camera is denied. I can't see you!";
            infoText.text(errTxt);
            speak(errTxt);
         } else if (err.name == "NotFoundError") {
            var errTxt =
               "Camera not found. Please check your camera and try again.";
            infoText.text(errTxt);
            speak(errTxt);
         } else {
            infoText.text(
               "Something happened realated to Camera (" + err.name + ")"
            );
         }
      });
}

function generateSentece(expression, callback) {
   window.speechSynthesis.cancel();
   var availableExpressions = [
      "happy",
      "sad",
      "angry",
      "neutral",
      "surprised",
      "fearful",
   ];

   if (!availableExpressions.includes(expression.toLowerCase())) {
      callback(false);
      return;
   }

   $.get("src/models/text/sentence.json", function (data) {
      var senteceLength = data[expression].length;
      var randomSentence = Math.floor(Math.random() * senteceLength);
      var sentence = data[expression][randomSentence];

      if (sentence[0] === "[") {
         var functionId = sentence.substring(
            sentence.indexOf("[") + 1,
            sentence.lastIndexOf("]")
         );

         sentence = sentence.split("]")[1];
         switchActionBtn(functionId);
      } else {
         switchActionBtn(false);
      }
      console.log("sad", sentence);
      callback(sentence);
      speak(sentence);
   });
}

video.addEventListener("play", () => {
   var interval = localStorage.getItem("interval") || 1000;
   var prevExpression;
   var idle = false;
   setInterval(async () => {
      try {
         const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

         var data = detections[0].expressions;
         let maxValue = Object.entries(data).sort((x, y) => y[1] - x[1])[0];
         //console.log(maxValue);

         if (maxValue[0] !== prevExpression) {
            prevExpression = maxValue[0];
            generateSentece(maxValue[0], textViewState);
         }
         infoText.text(maxValue[0] + " " + expressionEmojis[maxValue[0]]);
         
      } catch (error) {
         textViewState(false);
         infoText.text("Can't see you, Look at the camera!");
         prevExpression = false;
         switchActionBtn(false);
      }
   }, interval);
});

function speak(text) {
   if(app.tts){
      msg.text = text;
   window.speechSynthesis.speak(msg);
   }
}
