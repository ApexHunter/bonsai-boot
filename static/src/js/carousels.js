$(function () {
  $('.carousel-multiple-items').exists(function() {
    var owlTheme; //adiciona o thema
    var owlItems; //number 0,1,2... //adiciona a quantidade de itens
    var owlWid; //feito // true ou false, determina se é automatico ou não o tamanho da div relacionada ao conteudo
    var owlMargin; //feito //number, define o tamanho da margin entre os itens
    var owlLoop; //feito //true ou false, se tem loop ou não
    var owlNav; //feito //true ou false, se tem navegação por elementos
    var owlResponsive; //feito //string que é transformada em objeto json, usa o modelo "{resolucao maxima}:{items},"
    var owlNavText; //feito //string que é transformada em objeto json, usa o modelo "{prev}, {next}"
    var owlDots; //feito //true ou false, mostra a navegação com contadores em bolinhas (dots)
    var owlCenter;
    var mouseDrag;
    var touchDrag;
    var pullDrag;
    var lazyLoad;
    var autoplay;
    var autoplayTimeout;
    var animateOut;
    var animateInClass;

    this.each(function(index, el) {
      owlTheme = $(this).data('theme');
      owlItems = $(this).data('items');
      owlWid = $(this).data('width');
      owlMargin = $(this).data('margin');
      owlLoop = $(this).data('loop');
      owlResponsive = $(this).data('responsive');
      owlNav = $(this).data('nav');
      owlNavText = $(this).data('nav-text');
      owlDots = $(this).data('dots');

      if (!owlTheme) {
        owlTheme = 'owl-theme';
      }
      if (!owlItems) {
        owlItems = 1;
      }
      if (!owlWid) {
        owlWid = false;
      }
      if (owlLoop === true) {
        owlLoop = true;
      } else {
        owlLoop = false;
      }
      if (owlMargin === null || owlMargin === '' || owlMargin === undefined) {
        owlMargin = 10;
      } else if (owlMargin === '0') {
        owlMargin = 0;
      }
      if (!owlResponsive) {
        responsiveConfig = {
          0:{
            items: owlItems
          },
          600:{
            items: owlItems
          },
          1000:{
            items: owlItems
          }
        }
      } else {
        var itemsJson = [];
        var stringConfig = '';
        //jsonObj = JSON.parse(jsonRespon);
        splitViews = owlResponsive.split(',');
        for (var i = 0; i < splitViews.length; i++) {
          splitArray = splitViews[i].split(':');
          itemsPage = splitArray[1];
          viewportPage = splitArray[0];

          if (i+1 < splitViews.length) {
            stringConfig += viewportPage+':{"items": "'+itemsPage+'"},';
          } else {
            stringConfig += viewportPage+':{"items": "'+itemsPage+'"}';
          }
        }
        stringConfig = '{'+stringConfig+'}';
        var jsonConfig = JSON.stringify(eval("(" + stringConfig + ")"));
        var responsiveConfig = JSON.parse(jsonConfig);
      }
      if (owlNav === undefined) {
        owlNav = true;
      }
      if (owlDots === undefined) {
        owlDots = true;
      }
      if (!owlNavText) {
        owlNavText = [
          'Anterior',
          'Próximo  '
        ];
      } else if (owlNavText == 'chevron') {
        owlNavText = [
          '<div class="icon icon-chevron-left"></div>',
          '<div class="icon icon-chevron-right"></div>'
        ];
      } else {
        var splitNavs = owlNavText.split(',');
        var obj = [];
        for (var i = 0; i < splitNavs.length; i++) {
          obj.push(splitNavs[i]);
        }
        owlNavText = obj;
      }
      //Monta o carrossel
      var itemsInter = $(this).children('.item').length;
      //console.log(itemsInter, owlItems, responsiveConfig[0].items);
      //var found = getValues(responsiveConfig, 'items');
      //console.log(found);

      var widOwl = $(window).width();
      //console.log(widOwl);
      //navega pelo objeto do responsivo
      var count = Object.keys(responsiveConfig).length;
      //console.log(count);
      var numberElements;

      $.each(responsiveConfig, function(i, v) {
        var lastItem = Object.keys(responsiveConfig).pop();
        var valueToShow;
        if (lastItem < widOwl) {
          valueToShow = lastItem;
        }
        //console.log(v.items, i, lastItem, getItem(responsiveConfig[i], i, 1));
        //console.log('lastItem', lastItem);
        //console.log('achou maior', i, responsiveConfig[i].items, widOwl, lastItem);
        if (lastItem < widOwl) {
          //console.log('pega o tamanho do ultimo responsivo: ', lastItem, ' i:', i, responsiveConfig[i].items);
          numberElements = responsiveConfig[i].items;
          return false; // stops the loop
        } else {
          //console.log('pega o tamanho da tela: ', widOwl, ' i:', i)

          if (i < widOwl) {
            numberElements = i;
            //console.log('dentro', i)
          } else {
            var arr = Object.keys(responsiveConfig);
            b = closest(widOwl, arr);
            numberElements = responsiveConfig[b].items;
            //console.log('maior', i, 'b: '+b, numberElements);

            // for (var b in responsiveConfig) {
            //   console.log(b + ' = ' +  responsiveConfig[b].items);
            // }
            //a = responsiveConfig[i];
          }
          //return false; // stops the loop
        }
      });
      countItems = numberElements;
      //console.log(itemsInter, countItems);
      //console.log(numberElements, b, widOwl, responsiveConfig);
      if (itemsInter > countItems) {
        $(this).addClass('owl-carousel ' +owlTheme).owlCarousel({
          loop: owlLoop,
          margin: owlMargin,
          nav: owlNav,
          dots: owlDots,
          responsive: responsiveConfig,
          autoWidth: owlWid,
          navText: owlNavText
        });
      } else {
        divideWid = round((100/countItems), 0);
        $(this).addClass('owl-carosel-static').children('.item').css('width', divideWid+'%');
        $(this).addClass('owl-carosel-static').children('.item:first').addClass('active');

        if (countItems == 1) {
          $(this).children('.item').addClass('zoom-product');
        }
      }
    });
  });
});

//return an array of keys that match on a certain value
function getItem(items, key, i) {
  var keys = Object.keys(items).sort(function(a,b){return a-b;});
  var index = keys.indexOf(key);
  if ((i==-1 && index>0) || (i==1 && index<keys.length-1)) {index = index+i;}
  return items[keys[index]];
}

function closest (num, arr) {
  var curr = arr[0];
  var diff = Math.abs (num - curr);
  for (var val = 0; val < arr.length; val++) {
      var newdiff = Math.abs (num - arr[val]);
      if (newdiff < diff) {
          diff = newdiff;
          curr = arr[val];
      }
  }
  return curr;
}

function round(d, decimals) {
   var x = Math.pow(10, decimals)
   return Math.floor(d * x)/x
}
