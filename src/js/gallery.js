$(function () {
  $('.gallery').exists(function() {
    var owlGallery = $(this).children('.carousel-multiple-items');
    var owlIndicators = $(this).find('.gallery--controls').children('.carousel-multiple-items');

    var zoomOptions = {}

    //console.log(owlGallery, owlIndicators);
    owlGallery.bind({
      'dragged.owl.carousel': function(e) {
        var eleTar = e.target;
        changeItems(e, eleTar);
        changeItemsThumb(e, eleTar);
      },
      'changed.owl.carousel': function(e) {
        var eleTar = e.target;

        //console.log(item, owlTarget);
        changeItems(e, eleTar);
        changeItemsThumb(e, eleTar);
      }
    });

    owlIndicators.bind({
      'dragged.owl.carousel': function(e) {
        var eleTar = e.target;
        var item = e.item.index;
        //console.log(item);
        //changeItems(e, eleTar);
      },
      'changed.owl.carousel': function(e) {
        var eleTar = e.target;
        var item = e.item.index;
        //console.log(item);
        //changeItems(e, eleTar);
      }
    });

    //paginação do carousel (thumbs)
    owlIndicators.find('.item').click(function (e) {
        e.preventDefault();
        var owlTarget = $(this).closest('.gallery').children('.carousel-multiple-items:first');
        var owlCarEle = $(owlTarget).children('.owl-carousel:first');
        var owlCarToChange = $(this).closest('.owl-carousel');
        var owlGoTo;

        if (owlCarToChange.hasClass('owl-carousel')) {
          owlCarToChange.find('.owl-item').removeClass('active').children().removeClass('active');
          owlGoTo = $(this).parent().index();
        } else {
          $(this).removeClass('active');
          owlGoTo = $(this).index();
        }
        $(this).addClass('active');

        owlTarget.trigger('to.owl.carousel', [owlGoTo]);
        //return false;

        if (!isMobile.phone && $(this).closest('.gallery').hasClass('zoom')) {
          var zoomOptions = {};
          var zoomActive = false;
          var itemCarousel = $(this).closest('.gallery').find('.owl-stage-outer .owl-item');
          //console.log(itemCarousel);


          if(zoomActive) {
            //itemCarousel.elevateZoom(zoomOptions);//initialise zoom
            element = $(this).closest('.gallery').find('.zoom-item');
            //console.log('active')
            zoomImage(element, tar);
          } else {
            $.removeData(itemCarousel, 'elevateZoom');//remove zoom instance from image
            $('.zoomContainer').remove();// remove zoom container from DOM
          }

          itemCarousel.find('.item').removeClass('zoom-item').promise().done(function () {
            itemCarousel.eq(owlGoTo).find('.item').addClass('zoom-item');
            tar = owlGallery.closest('.gallery.zoom');
            element = $(this).closest('.gallery').find('.zoom-item');
            zoomImage(element, tar);
          });
        }
    });

    //Carousel Galleria com video
    owlGallery.on('changed.owl.carousel', function (e) {
        var pathVideo = $('.gallery').find('.owl-carousel:first .video-gallery');
        pathVideo.each(function (index, el) {
            var video = $(this).data('youtube');
            $(this).attr('src', '');
            $(this).attr('src', video);
        });
    });

    if (!isMobile.phone) {
      owlGallery.find('.item:first').addClass('zoom-item');
    }
    owlGallery.closest('.gallery.zoom').each(function(index, el) {
      tar = owlGallery.closest('.gallery.zoom');
      element = $(this).find('.zoom-item');
      zoomImage(element, tar);
    });
  });


});

function changeItems(e, eleTar) {
  //active nos thumbs
  var owlCar = e.target;
  var owlItem = e.item.index;
  var owlParent = $(owlCar).parent();
  //console.log(owlCar, owlItem, owlParent);
  owlParent.find('.carousel-indicators .item').removeClass('active').promise().done(function () {
    owlParent.closest('.gallery').find('.gallery--controls .item').removeClass('active');
    if (owlParent.hasClass('.owl-carousel')) {
      owlParent.closest('.gallery').find('.gallery--controls .owl-item').eq(owlItem).children().addClass('active');
    } else {
      owlParent.closest('.gallery').find('.gallery--controls .item').eq(owlItem).addClass('active');
    }
  });
  $(eleTar).trigger('to.owl.carousel', [owlItem]);
  //console.log(eleTar);
}

function changeItemsThumb(e, eleTar) {
  var item = e.item.index;
  var owlTarget = $(eleTar).closest('.gallery').find('.gallery--controls').children('.carousel-multiple-items');
  owlTarget.trigger('to.owl.carousel', [item]);
}
