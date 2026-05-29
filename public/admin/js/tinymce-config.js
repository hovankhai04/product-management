tinymce.init({
  selector: 'textarea',
  license_key: 'gpl',
  plugins: "advlist link image lists",
  file_picker_callback: function (cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = function () {
      var file = this.files[0];
      var reader = new FileReader();
      reader.onload = function () {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function (e) {
          var width = image.width;
          var height = image.height;
          var ratio = width / height;
          var maxWidth = 300;
          var maxHeight = 300;
          if (ratio > 1) {
            height = maxHeight;
            width = height * ratio;
          } else {
            width = maxWidth;
            height = width / ratio;
          }
          image.width = width;
          image.height = height;
          cb(image.src);
        };
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }
})