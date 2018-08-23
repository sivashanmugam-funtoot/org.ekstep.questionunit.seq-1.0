var SEQController = SEQController || {};
SEQController.constant = {
  qContainerElement: ".sequencing-content-container",
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
  var wrapperStart = '<div class="sequencing-content-container plugin-content-container" style="background-color:<%= SEQController.constant.bgColor %>">';
  var wrapperStartQuestionComponent = '<div class="question-content-container">';
  var wrapperEndQuestionComponent = '</div>';
  var wrapperEnd = '</div><script>SEQController.onDomReady()</script>';
  var getLayout;
  if (availableLayout.horizontal == selectedLayout) {
    getLayout = SEQController.getOptionLayout('horizontal');
  } else {
    getLayout = SEQController.getOptionLayout('vertical');
  }
  return wrapperStart + wrapperStartQuestionComponent + org.ekstep.questionunit.questionComponent.generateQuestionComponent(SEQController.pluginInstance._manifest.id) + wrapperEndQuestionComponent + getLayout + wrapperEnd;
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

SEQController.onDomReady = function () {
  $(document).ready(function () {
    $(".option-block-container").sortable();
    $(".option-block-container").disableSelection();
  })
}

//# sourceURL=questionunit.seq.renderer.seq-template-controller.js