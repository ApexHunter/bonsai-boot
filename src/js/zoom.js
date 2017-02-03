$(function () {
  $('.zoom-image').exists(function() {
    if (!isMobile.phone) {
      e = $(this);
      zoomImage(e, e)
    };
  });
});
//zoom na imagem - Plugin elevateZoom
function zoomImage(e, tar){
  var tar = tar;
  var options = options;
  var locate;
  var zoomCursor;
  var zoomWindowFadeIn;
  var zoomWindowFadeOut;
  var zoomWindowPosition;
  var zoomWindowOffetx;
  var zoomScrollZoom;
  var zoomEasing;
  var zoomLensColour;
  var zoomLensOpacity;
  var zoomBorderColour;
  var zoomLensBorderSize;
  var zoomTint;
  var zoomTintColour;
  var zoomTintOpacity;
  var zoomTintFadeIn;
  var zoomTintFadeOut;
  var zoomLenszoom;
  var zoomContainLensZoom;

  // //options = {};
  // optionsSize = Object.keys(zoomOptions).length;
  // if (optionsSize > 0) {
  //   console.log('tem coisa', optionsSize);
  // } else {
  //   //console.log('tem nada', optionsSize);
  // }

  var zoomOptions = {
    cursor: 'crosshair',
    zoomWindowFadeIn: 500,
    zoomWindowFadeOut: 750,
    zoomWindowPosition: 1,
    zoomWindowOffetx: 4,
    scrollZoom : false,
    easing : true,
    lensColour: '#b10061', //colour of the lens background
    lensOpacity: 0.4, //opacity of the lens
    borderColour: '#b10061',
    lensBorderSize: 0,
    tint: false,
    tintColour: '#b10061',
    tintOpacity: 0.5,
    zoomTintFadeIn: 'true',
    zoomTintFadeOut: 0.5,
    lenszoom: false,
    containLensZoom: false
  }

  locate = $(e);
  if ($(e).closest('.zoom') && !$(e).hasClass('zoom-image')) {
    console.log('zoom', locate)
    locate = $(e).closest('.zoom');
  } else {
    locate = $(e);
    console.log('zoom', locate)
  }

  zoomCursor = $(locate).data('zoomCursor');
  zoomWindowFadeIn = $(locate).data('zoomFadein');
  zoomWindowFadeOut = $(locate).data('zoomFadeout');
  zoomWindowPosition = $(locate).data('zoomPosition');
  zoomWindowOffetx = $(locate).data('zoomWindowOffset');
  zoomScrollZoom = $(locate).data('zoomScroll');
  zoomEasing = $(locate).data('zoomEasing');
  zoomLensColour = $(locate).data('zoomLensColor');
  zoomLensOpacity = $(locate).data('zoomLensOpacity');
  zoomBorderColour = $(locate).data('zoomBorderColor');
  zoomBorderSize = $(locate).data('zoomBorderSize');
  zoomLensBorderSize = $(locate).data('zoomLensBorderSize');
  zoomTint = $(locate).data('zoomTint');
  zoomTintColour = $(locate).data('zoomTintColor');
  zoomTintOpacity = $(locate).data('zoomTintOpacity');
  zoomTintFadeIn = $(locate).data('zoomTintFadein');
  zoomTintFadeOut = $(locate).data('zoomTintFadeout');
  zoomLenszoom = $(locate).data('zoomTintLenszoom');
  zoomContainLensZoom = $(locate).data('zoomTintContainlenszoom');

  console.log(zoomScrollZoom);

  //console.log(zoomCursor);
  if (zoomCursor) {
    zoomOptions.cursor = zoomCursor;
  }
  if (zoomWindowFadeIn) {
    zoomOptions.zoomWindowFadeIn = zoomWindowFadeIn;
  }
  if (zoomWindowFadeOut) {
    zoomOptions.zoomWindowFadeOut = zoomWindowFadeIn;
  };
  if (zoomWindowPosition) {
    zoomOptions.zoomWindowPosition = zoomWindowPosition;
  }
  if (zoomWindowOffetx) {
    zoomOptions.zoomWindowOffetx = zoomWindowOffetx;
  };
  if (zoomScrollZoom) {
    zoomOptions.scrollZoom = zoomScrollZoom;
  };
  if (zoomEasing) {
    zoomOptions.easing = zoomEasing;
  };
  if (zoomLensColour) {
    zoomOptions.lensColour = zoomLensColour;
  };
  if (zoomLensOpacity) {
    zoomOptions.lensOpacity = zoomLensOpacity;
  };
  if (zoomBorderColour) {
    zoomOptions.borderColour = zoomBorderColour;
  };
  if (zoomBorderSize) {
    zoomOptions.borderSize = zoomBorderSize;
  };
  if (zoomLensBorderSize) {
    zoomOptions.lensBorderSize = zoomLensBorderSize;
  };
  if (zoomTint) {
    zoomOptions.tint = zoomTint;
  };
  if (zoomTintColour) {
    zoomOptions.tintColour = zoomTintColour;
  };
  if (zoomTintOpacity) {
    zoomOptions.tintOpacity = zoomTintOpacity;
  };
  if (zoomTintFadeIn) {
    zoomOptions.zoomTintFadeIn = zoomTintFadeIn;
  };
  if (zoomTintFadeOut) {
    zoomOptions.zoomTintFadeOut = zoomTintFadeOut;
  };
  if (zoomLenszoom) {
    zoomOptions.lenszoom = zoomLenszoom;
  };
  if (zoomContainLensZoom) {
    zoomOptions.containLensZoom = zoomContainLensZoom;
  };

  //console.log(zoomOptions);

  $(e).elevateZoom(zoomOptions);

  // $(e).elevateZoom({
  //   //zoomType: 'Lens',
  //   cursor: zoomCursor,
  //   zoomWindowFadeIn: zoomWindowFadeIn,
  //   zoomWindowFadeOut: zoomWindowFadeOut,
  //   zoomWindowPosition: zoomWindowPosition,
  //   zoomWindowOffetx: zoomWindowOffetx,
  //   scrollZoom : zoomScrollZoom,
  //   easing : zoomEasing,
  //   lensColour: zoomLensColour, //colour of the lens background
  //   lensOpacity: zoomLensOpacity, //opacity of the lens
  //   borderColour: zoomBorderColour,
  //   lensBorderSize: zoomLensBorderSize,
  //   tint: zoomTint,
  //   tintColour: zoomTintColour,
  //   tintOpacity: zoomTintOpacity,
  //   zoomTintFadeIn: zoomTintFadeIn,
  //   zoomTintFadeOut: zoomTintFadeOut,
  //   lenszoom: zoomLenszoom,
  //   containLensZoom: zoomContainLensZoom
  // });


};
