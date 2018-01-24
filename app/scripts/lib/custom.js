
$(document).ready(function () {
	modalOverlay();
	overrideBody();
	detectMobileDev();
});
//For completed questions, instruction modal and overlay
function modalOverlay(){
	$("#cpmpletedQuestionsModal, #instructionsModal, #ResetQuestModal").on('show.bs.modal', function () {
				$(".modalOverlay").removeClass("hide");
	});

	$("#cpmpletedQuestionsModal, #instructionsModal, #ResetQuestModal").on('hidden.bs.modal', function () {
	            $(".modalOverlay").addClass("hide");
	});
}
//override body css with adding class in body
function overrideBody() {
	var adminhref = location.href;
	var splitadminHref = adminhref.split("/");
	if (splitadminHref.indexOf("zingoappadmin") > -1) {
		$("body").addClass("adminBody");
    }
    if (splitadminHref.indexOf("login") > -1) {
		$("body").removeClass("adminBody");
    }
    if (splitadminHref.indexOf("game") > -1) {
		$("body").removeClass("adminBody");
    }
}

function detectMobileDev(){
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    if( isMobile.any() ){
        $(".footer-set").addClass("hide");
        $(".right-block").addClass("hide");
        $(".para-message").addClass("hide");
        $(".center-cont").css("width", "80%");
        }
}
