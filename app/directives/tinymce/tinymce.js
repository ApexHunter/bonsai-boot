wyseditor.$inject = ['$timeout'];
function wyseditor($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, $attrs, ngModel) {
            $timeout(function () {
              tinymce.remove();
              tinymce.init({
                selector: '.editor',
                toolbar: 'undo redo | styleselect | bold italic | link image',
                language_url: 'js/tinymce/langs/pt_BR.js',
                init_instance_callback: function (editor) {
                  editor.on('blur', function (e) {
                    var newValue = tinymce.activeEditor.getContent();
                    ngModel.$setViewValue(newValue);
                    ngModel.$render();
                  });
                }
              });
          }, 100);
        }
    };
}
