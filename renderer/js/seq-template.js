var SEQController = SEQController || {};

SEQController.constant = {
  qsSEQElement: ".sequencing-content-container",
  bgColors: ["#5DC4F5", "#FF7474", "#F9A817", "#48DCB6", "#5B6066"],
  bgColor: "#5DC4F5"
};

/**
 * enables accessing plugin instance inside SEQController
 * @memberof org.ekstep.questionun  it.mtf.mtftemplate
 */
SEQController.initTemplate = function (pluginInstance) {
  SEQController.pluginInstance = pluginInstance;
  SEQController.constant.bgColor = SEQController.constant.bgColors[_.random(0, SEQController.constant.bgColors.length - 1)];
  SEQController.bgLeftCircleTop = _.random(-6, 6) * 10;
};


SEQController.getQuestionTemplate = function (selectedLayout, availableLayout) {

  SEQController.selectedLayout = selectedLayout;
  var wrapperStart = '<div onload="SEQController.onDomReady()" class="sequencing-content-container" style="background-color:<%= SEQController.constant.bgColor %>">';
  var wrapperEnd = '</div>';
  var getLayout;
  if (availableLayout.horizontal == selectedLayout) {
    getLayout = SEQController.getOptionLayout('horizontal');
  } else {
    getLayout = SEQController.getOptionLayout('vertical');
  }

  return wrapperStart + SEQController.getQuestionStemTemplate() + getLayout + wrapperEnd;
}

SEQController.getQuestionStemTemplate = function () {
  return '\
  <div class="question-container">\
      <div class="hiding-container">\
          <div class="expand-container">\
          <%= question.data.text %>\
          </div>\
      </div>\
      <div class="expand-button" onclick="SEQController.toggleQuestionText()">\
          <img src="<%= SEQController.pluginInstance.getAudioIcon("renderer/assets/down_arrow.png") %>" />\
      </div>\
  </div>\
  ';
}
SEQController.getOptionLayout = function (type) {
  return '\
  <div class="option-container ' + type + '">' + '\
      <div class="option-block-container">\
      <% _.each(question.data.options,function(val,key){ %>\
          <div class="option-block">\
            <span><%= val.text %></span>\
          </div>\
      <% }) %>\
      </div>\
  </div>';
}

SEQController.isQuestionTextOverflow = function () {
  setTimeout(function () {
    if ($('.hiding-container').height() > $('.expand-container').height()) {
        $('.expand-button').css('display', 'none');
    } else {
        $('.expand-button').css('display', 'block');
    }
  }, 1000)
}

SEQController.toggleQuestionText = function () {
  if($('.hiding-container').hasClass('expanded')){
    $('.hiding-container').css('height', '50%');
    $('.hiding-container').removeClass('expanded')
    $(".expand-button img").toggleClass('flip');
    $('.hiding-container').css('padding-bottom', '0px');
    $('.expand-button').css('bottom', '5%');
} else {
    var expandButtonBottom = parseFloat($('.expand-button').css('bottom'));
    $('.hiding-container').addClass('expanded')
    $('.hiding-container').css('height', 'auto');
    $(".expand-button img").toggleClass('flip');
    $('.hiding-container').css('padding-bottom', $(".expand-button").height()+'px');
    expandButtonBottom = expandButtonBottom - ($('.hiding-container').height() - $('.question-container').height());
    $('.expand-button').css('bottom', expandButtonBottom+'px')
}
}

SEQController.onDomReady = function () {
  SEQController.isQuestionTextOverflow();
    $(document).ready(function () {
        $(".option-block-container").sortable();
        $(".option-block-container").disableSelection();
    })
}

/**
 * image will be shown in popup
 * @memberof org.ekstep.questionunit.mtf.mtftemplate
 */
SEQController.showImageModel = function (event, imageSrc) {
  if (imageSrc) {
    var modelTemplate = "<div class='popup' id='image-model-popup' onclick='SEQController.hideImageModel()'><div class='popup-overlay' onclick='SEQController.hideImageModel()'></div> \
  <div class='popup-full-body'> \
  <div class='font-lato assess-popup assess-goodjob-popup'> \
    <img class='qc-question-fullimage' src=<%= src %> /> \
    <div onclick='SEQController.hideImageModel()' class='qc-popup-close-button'>&times;</div> \
  </div></div>";
    var template = _.template(modelTemplate);
    var templateData = template({
      src: imageSrc
    })
    $(SEQController.constant.qsSEQElement).append(templateData);
  }
}

SEQController.hideImageModel = function () {
  $("#image-model-popup").remove();
}

//# sourceURL=SEQController.js