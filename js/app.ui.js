const textView = $(".text-div"),
   overlay = $(".overlay"),
   intervalSet = $(".interval-set"),
   intervalSlider = $(".slider"),
   faviconDrop  = $(".favicon-drop"),
   dropDown = $(".drop-down");

function textViewState(state) {
   if (state) {
      textView.find("h1").text(state);
      textView.fadeIn(100);
   } else {
      textView.fadeOut(100);
   }
}

function animateObjects(element, type, callback) {
   var animation = "animate__animated animate__" + type;
   element.addClass(animation);

   element.on("animationend", () => {
      element.removeClass(animation);
   });
   if (callback) {
      callback();
   }
}

function createAlert(obj) {
   console.log(obj);
   if (obj.image) {
      obj.image = `<img class="alert-image" src="${obj.image}">`;
   }
   if (obj.title) {
      obj.title = `${obj.title}</h1>`;
   }
   if (obj.message) {
      obj.message = `<p class="alert-abstract">${obj.message}</p>`;
   }
   var new_html = `
    <div class="alert-overlay overlay center">
        <div class="alert-inner center">
        <div class="close-overlay center clo">
            <i class="bi-x"></i>
        </div>
        <div class="alert-content">
            <img class="loading-image" src="src/assets/images/loading.gif" alt="" />
        </div>
        </div>
    </div>
    `;

   const dynamicOverlay = $(".dynamic-overlay");

   dynamicOverlay.html(new_html);

   const alertContent = $(".alert-content"),
      loadImage = $(".loading-image");

   if (obj.title) {
      alertContent.append(`
            <div class="news-text">
                <h1 class="alert-title">${obj.title}</h1>
                <p class="alert-abstract">${obj.message}</p>
            </div>
        `);
   }

   if (obj.image) {
      alertContent.append(`
        <div class="image-section center">
            <div class="close-overlay center">
            <i class="bi-x"></i>
            </div>
            ${obj.image}
        </div>
        `);
   }

   loadImage.remove();
}

function switchActionBtn(action) {
   if (action !== false) {
      $(".action-btn").attr("action", action);
      $(".action-cont").show().css("display", "flex");
   } else {
      $(".action-cont").hide();
   }
}

$(".action-btn").click(function () {
   var action = $(this).attr("action");
   if (action) {
      services[action]().then((data) => {
         msg.text = "Okay!";
         window.speechSynthesis.cancel();
         window.speechSynthesis.speak(msg);
         createAlert(data);
      });
   }
});

$("body").on("click", ".close-overlay", function () {
   $("body .overlay").fadeOut(500).remove();
});

intervalSet.on("click", function () {
   loadOverlay.fadeOut(1000).remove();
   startVideo();
   infoText.text("Processing. Look at the camera, not here!");
});

intervalSlider.on("input", function () {
   var int = intervalSlider.val() || 1000;
   localStorage.setItem("interval", int);
});

faviconDrop.on("click", function () {
  $(document).off("click")
  dropDown.fadeIn();
  setTimeout(() => {
    $(document).on("click", function (e) {
      dropDown.fadeOut();
    })
  },1000)
});


$(document).keyup(function(e) {
  if (e.key === "Escape") { // escape key maps to keycode `27`
     overlay.fadeOut(500).remove();
     dropDown.fadeOut(500);
 }
});