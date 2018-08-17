/**
 *
 * Question Unit plugin to render a MTF question
 * @class org.ekstep.questionunit.seq
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Sivashanmugam Kannan <sivashanmugam.kannan@funtoot.com>
 */
org.ekstep.questionunitmtf = {};
org.ekstep.questionunitmtf.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mtf',
  _isContainer: true,
  _render: true,
  _selectedAnswers: [],
  _dragulaContainers: [],
  _constant: {
    horizontal: "Horizontal",
    vertial : "Vertical"
  },
  setQuestionTemplate: function () {
    SEQController.initTemplate(this);// eslint-disable-line no-undef
  },

  preQuestionShow: function (event) {
    this._super(event);
    this._question.template = SEQController.getQuestionTemplate(this._question.config.layout, this._constant);
    this._question.data.options = _.shuffle(this._question.data.options);
  },
  postQuestionShow: function (event) {
    var instance = this;
  },
  evaluateQuestion: function(event){
    var instance = this;
    var callback = event.target;
    var correctAnswer = true;
    var correctAnswersCount = 0;
    var telemetryValues = [];
    var totalLHS = instance._question.data.option.optionsLHS.length;
    instance._selectedRHS = [];
    $('.rhs-block').each(function(expectedOptionMapIndex, elem){
      var telObj = {
        'LHS':[],
        'RHS':[]
      };
      var selectedOptionMapIndex = parseInt($(elem).data('mapindex')) - 1;
      telObj['LHS'][expectedOptionMapIndex] = instance._question.data.option.optionsLHS[expectedOptionMapIndex];
      telObj['RHS'][selectedOptionMapIndex] = instance._question.data.option.optionsRHS[selectedOptionMapIndex];
      telemetryValues.push(telObj);
      instance._selectedRHS.push(instance._question.data.option.optionsRHS[selectedOptionMapIndex]);
      if(selectedOptionMapIndex == expectedOptionMapIndex){
        correctAnswersCount++;
      } else {
        correctAnswer = false;
      }
    })
    var partialScore = (correctAnswersCount / totalLHS) * this._question.config.max_score;
    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "lhs": this._question.data.option.optionsRHS,
          "rhs": instance._selectedRHS
        }
      },
      score: partialScore,
      values: telemetryValues,
      noOfCorrectAns: correctAnswersCount,
      totalAns: totalLHS
    };
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);
  },
  logTelemetryItemResponse: function (data) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, {"type": "INPUT", "values": data});
  }
});
//# sourceURL=questionunitMTFPlugin.js