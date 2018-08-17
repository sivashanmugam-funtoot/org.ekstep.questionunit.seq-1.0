/*
 * Plugin to create sequencial order question
 * @class org.ekstep.questionunitseq:seqQuestionFormController
 * Sivashanmugam Kannan<sivashanmugam.kannan@funtoot.com>
 */
angular.module('seqApp', ['org.ekstep.question']).controller('seqQuestionFormController', ['$scope', '$rootScope', 'questionServices', function ($scope, $rootScope, questionServices) {
  var generalDataObj = {
    'text': '',
    'image': '',
    'audio': '',
    'audioName': '',
    'hint': ''
  }
  $scope.seqFormData = {
    'question': {},
    'options': []
  };
  $scope.questionMedia = {};
  $scope.optionsMedia = {
    'image': [],
    'audio': []
  };
  $scope.seqFormData.media = [];
  $scope.editMedia = [];

  var questionInput = CKEDITOR.replace('seqQuestion', {// eslint-disable-line no-undef
    customConfig: ecEditor.resolvePluginResource('org.ekstep.questionunit', '1.0', "editor/ckeditor-config.js"),
    skin: 'moono-lisa,' + CKEDITOR.basePath + "skins/moono-lisa/",// eslint-disable-line no-undef
    contentsCss: CKEDITOR.basePath + "contents.css"// eslint-disable-line no-undef
  });
  questionInput.on('change', function () {
    $scope.seqFormData.question.text = this.getData();
  });
  questionInput.on('focus', function () {
    $scope.generateTelemetry({
      type: 'TOUCH',
      id: 'input',
      target: {
        id: 'questionunit-seq-question',
        ver: '',
        type: 'input'
      }
    })
  });
  angular.element('.innerScroll').on('scroll', function () {
    $scope.generateTelemetry({
      type: 'SCROLL',
      id: 'form',
      target: {
        id: 'questionunit-seq-form',
        ver: '',
        type: 'form'
      }
    })
  });
  $scope.init = function () {
    $scope.addOption();
    /**
     * editor:questionunit.seq:call form validation.
     * @event org.ekstep.questionunit.seq:validateform
     * @memberof org.ekstep.questionunit.seq.seq-controller
     */
    $scope.seqPluginInstance = org.ekstep.pluginframework.pluginManager.getPluginManifest("org.ekstep.questionunit.mtf");
    EventBus.listeners['org.ekstep.questionunit.seq:validateform'] = [];
    ecEditor.addEventListener('org.ekstep.questionunit.seq:validateform', function (event, callback) {
      var validationRes = $scope.formValidation();
      callback(validationRes.isValid, validationRes.formData);
    }, $scope);
    /**
     * editor:questionunit.seq:call form edit the question.
     * @event org.ekstep.questionunit.seq:editquestion
     * @memberof org.ekstep.questionunit.seq.seq-controller
     */
    EventBus.listeners['org.ekstep.questionunit.seq:editquestion'] = [];
    ecEditor.addEventListener('org.ekstep.questionunit.seq:editquestion', $scope.editSEQQuestion, $scope);
    ecEditor.dispatchEvent("org.ekstep.questionunit:ready");
  }
  /**
   * for edit flow
   * @memberof org.ekstep.questionunit.seq
   * @param {event} event data.
   * @param {question} data data.
   */
  $scope.editSEQQuestion = function (event, data) {
    var qdata = data.data;
    $scope.seqFormData.question = qdata.question;
    $scope.seqFormData.option = qdata.option;
    $scope.editMedia = qdata.media;
  }
  /**
   * add the pair in seq
   * @memberof org.ekstep.questionunit.seq
   */
  $scope.addOption = function (index) {
    if(index){
      $scope.seqFormData.options[index] = angular.copy(generalDataObj);
    }else {
      $scope.seqFormData.options.push(angular.copy(generalDataObj));
    }
  }
  /**
   * check form validation
   * @memberof org.ekstep.questionunit.seq.seq-controller
   * @returns {Object} question data.
   */
  $scope.formValidation = function () {
    var formConfig = {},
      temp, tempArray = [],
      formValid;
    //check form valid and lhs should be more than 3
    formValid = $scope.seqForm.$valid && $scope.seqFormData.options.length > 2;
     if(!($scope.seqFormData.question.text.length || $scope.seqFormData.question.image.length || $scope.seqFormData.question.audio.length)){
        $('.questionTextBox').addClass("ck-error");
      }else{
        $('.questionTextBox').removeClass("ck-error");
      }
    $scope.submitted = true;
    _.isEmpty($scope.questionMedia.image) ? 0 : tempArray.push($scope.questionMedia.image);
    _.isEmpty($scope.questionMedia.audio) ? 0 : tempArray.push($scope.questionMedia.audio);
    _.each($scope.optionsMedia.image, function (key) {
      tempArray.push(key);
    });
    _.each($scope.optionsMedia.audio, function (key) {
      tempArray.push(key);
    });
    temp = tempArray.filter(function (element) {
      return element !== undefined;
    });
    $scope.editMedia = _.union($scope.editMedia, temp);
    $scope.seqFormData.media = $scope.editMedia;
    formConfig.formData = $scope.seqFormData;
    if (formValid) {
      $scope.selLbl = 'success';
      formConfig.isValid = true;
    } else {
      $scope.selLbl = 'error';
      formConfig.isValid = false;
    }
    return formConfig;
  }
  /**
   * delete the pair in seq
   * @memberof org.ekstep.questionunit.seq.seq-controller
   * @param {Integer} id data.
   */
  $scope.deleteOption = function (id) {
    $scope.seqFormData.options.splice(id, 1);
  }

  /**
   * invokes the asset browser to pick an image to add to either the question or the options
   * @param {string} type if `q` for Question, `LHS` for LHS option, `RHS` for RHS option 
   * @param {string} index if `type` is not `q`, then it denotes the index of either 'LHS' or 'RHS' option
   * @param {string} mediaType `image` or `audio`
   */
  $scope.addMedia = function (type, index, mediaType) {
    var mediaObject = {
      type: mediaType,
      search_filter: {} // All composite keys except mediaType
    }
    //Defining the callback function of mediaObject before invoking asset browser
    mediaObject.callback = function (data) {
      var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
      var media = {
        "id": Math.floor(Math.random() * 1000000000), // Unique identifier
        "src": org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src), // Media URL
        "assetId": data.assetMedia.id, // Asset identifier
        "type": data.assetMedia.type, // Type of asset (image, audio, etc)
        "preload": false // true or false
      };

      if (type == 'q') {
        telemetryObject.target.id = 'questionunit-seq-question-add-' + data.assetMedia.type;
        $scope.seqFormData.question[data.assetMedia.type] = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
        data.assetMedia.type == 'audio' ? $scope.seqFormData.question.audioName = data.assetMedia.name :
          $scope.questionMedia[data.assetMedia.type] = media;
      } else{
        telemetryObject.target.id = 'questionunit-seq-option-add-' + data.assetMedia.type;
        $scope.seqFormData.options[index][data.assetMedia.type] = org.ekstep.contenteditor.mediaManager.getMediaOriginURL(data.assetMedia.src);
        data.assetMedia.type == 'audio' ? $scope.seqFormData.options[index].audioName = data.assetMedia.name : '';
        $scope.optionsMedia[data.assetMedia.type][index] = media;
      }
      if(!$scope.$$phase) {
        $scope.$digest()
      }
      $scope.generateTelemetry(telemetryObject)
    }
    questionServices.invokeAssetBrowser(mediaObject);
  }

  /**
   * Deletes the selected media from the question element (question, options)
   * @param {string} type 
   * @param {Integer} index 
   * @param {string} mediaType 
   */
  $scope.deleteMedia = function (type, index, mediaType) {
    var telemetryObject = { type: 'TOUCH', id: 'button', target: { id: '', ver: '', type: 'button' } };
    if (type == 'q') {
      telemetryObject.target.id = 'questionunit-seq-delete' + mediaType;
      $scope.seqFormData.question[mediaType] = '';
      delete $scope.questionMedia[mediaType];
    } else {
      telemetryObject.target.id = 'questionunit-seq-option-delete-' + mediaType;
      $scope.seqFormData.options[index][mediaType] = '';
      delete $scope.optionsMedia[mediaType][index];
    }
    $scope.generateTelemetry(telemetryObject)
  }

  /**
   * Callbacks object to be passed to the directive to manage selected media
   */
  $scope.callbacks = {
    deleteMedia: $scope.deleteMedia,
    addMedia: $scope.addMedia,
    qtype: 'seq'
  }

  /**
   * Helper function to generate telemetry event
   * @param {Object} data telemetry data
   */
  $scope.generateTelemetry = function (data) {
    if (data) {
      data.plugin = data.plugin || {
        "id": $scope.seqPluginInstance.id,
        "ver": $scope.seqPluginInstance.ver
      }
      data.form = data.form || 'question-creation-seq-form';
      questionServices.generateTelemetry(data);
    }
  }
}]);
//# sourceURL=seq-controller.js