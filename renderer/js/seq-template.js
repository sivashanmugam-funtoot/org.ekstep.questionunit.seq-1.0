var SEQController = SEQController || {};

SEQController.constant = {
  qsSEQElement: ".sequencing-content-container",
  bgColors: ["#5DC4F5", "#FF7474", "#F9A817", "#48DCB6", "#5B6066"],
  bgColor: "#5DC4F5"
};

/**
 * intializes renderer template html controller and provides renderer plugin data with controller, 
 * @param {Object} pluginInstance
 * @memberof org.ekstep.questionunit.seq.seq-template
 */
SEQController.initTemplate = function (pluginInstance) {
  SEQController.pluginInstance = pluginInstance;
  SEQController.constant.bgColor = SEQController.constant.bgColors[_.random(0, SEQController.constant.bgColors.length - 1)];
  SEQController.bgLeftCircleTop = _.random(-6, 6) * 10;
};

/**
 * returns complete sequence plugin renderer html, 
 * @param {String} selectedLayout selected layout from editor
 * @param {Object} availableLayout provides list of layouts
 * @memberof org.ekstep.questionunit.seq.seq-template
 */
SEQController.getQuestionTemplate = function (selectedLayout, availableLayout) {

  SEQController.selectedLayout = selectedLayout;
  var wrapperStart = '<div  class="sequencing-content-container" style="background-color:<%= SEQController.constant.bgColor %>">';
  var wrapperEnd = '</div><script>SEQController.onDomReady()</script>';
  var getLayout;
  if (availableLayout.horizontal == selectedLayout) {
    getLayout = SEQController.getOptionLayout('horizontal');
  } else {
    getLayout = SEQController.getOptionLayout('vertical');
  }
  return wrapperStart + SEQController.getQuestionStemTemplate() + getLayout + wrapperEnd;
}

/**
 * returns sequence question html , 
 * @memberof org.ekstep.questionunit.seq.seq-template
 */
SEQController.getQuestionStemTemplate = function () {
  return '\
  <div class="question-container">\
      <div class="hiding-container">\
          <div class="expand-container">\
          <%= question.data.question.text %>\
          </div>\
      </div>\
      <div class="expand-button" onclick="SEQController.toggleQuestionText()">\
          <img src="<%= SEQController.pluginInstance.getAudioIcon("renderer/assets/down_arrow.png") %>" />\
      </div>\
  </div>\
  ';
}

/**
 * returns sequence option html layout based it's type, 
 * @param {String} type either `horizotnal` or `vertical`
 * @memberof org.ekstep.questionunit.seq.seq-template
 */
SEQController.getOptionLayout = function (type) {
  return '\
  <div class="option-container ' + type + '">' + '\
      <div class="option-block-container">\
      <% _.each(question.data.options,function(val,key){ %>\
          <div data-seqorder=<%= val.sequenceOrder %> class="option-block">\
            <span><%= val.text %></span>\
          </div>\
      <% }) %>\
      </div>\
  </div>';
}

/**
 * checks whether question text is overflowing the container height, 
 * @memberof org.ekstep.questionunit.seq.seq-template
 */
SEQController.isQuestionTextOverflow = function () {
  setTimeout(function () {
    if ($('.hiding-container').height() > $('.expand-container').height()) {
      $('.expand-button').css('display', 'none');
    } else {
      $('.expand-button').css('display', 'block');
    }
  }, 1000)
}
/**
 * handles expand button click event when question text is overflowing the container height, 
 * @memberof org.ekstep.questionunit.seq.seq-template
 */
SEQController.toggleQuestionText = function () {
  if ($('.hiding-container').hasClass('expanded')) {
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
    $('.hiding-container').css('padding-bottom', $(".expand-button").height() + 'px');
    expandButtonBottom = expandButtonBottom - ($('.hiding-container').height() - $('.question-container').height());
    $('.expand-button').css('bottom', expandButtonBottom + 'px')
  }
}
/**
 * upon document ready will be invoked
 * @memberof org.ekstep.questionunit.seq.seq-template
 */
SEQController.onDomReady = function () {
  SEQController.isQuestionTextOverflow();
  $(document).ready(function () {
    $(".option-block-container").sortable();
    $(".option-block-container").disableSelection();
  })
}

/**
 * image will be shown in popup
 * @memberof org.ekstep.questionunit.seq.seq-template
 */

SEQController.hideImageModel = function () {
  $("#image-model-popup").remove();
}

//# sourceURL=questionunit.seq.renderer.seq-template-controller.js