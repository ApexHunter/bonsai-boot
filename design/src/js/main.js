$(function(){
  //onInit
  var navItems = $('.nav-item')
  updateMenu()

  //functions
  function updateMenu () {
    var scrollTop = $(window).scrollTop()
    if (scrollTop > 160) {
      $('.navbar').addClass('navbar--fixed')
    }
    switch (true) {
      case scrollTop < 160:
        $('.navbar').removeClass('navbar--fixed')
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(0).addClass("active")
        break
      case scrollTop > 500 && scrollTop < 1000:
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(1).addClass("active")
        break
      case scrollTop > 1000 && scrollTop < 1500:
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(2).addClass("active")
        break
      case scrollTop > 1500 && scrollTop < 2000:
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(3).addClass("active")
        break
      case scrollTop > 2000 && scrollTop < 3200:
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(4).addClass("active")
        break
      case scrollTop > 3400:
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(5).addClass("active")
        break
      default:
        break
    }
  }

  function scrollPage (scrollTo) {
    if($(window).scrollTop() > 160){
      headerSize = 74
    } else {
      headerSize = 160
    }
    $('.navbar-toggler').toggleClass('collapsed')
    $('.navbar-toggler').attr("aria-expanded","false")
    $('.navbar-collapse').toggleClass('show').toggleClass('collapse')
    $('html, body').animate({
      scrollTop: scrollTo.offset().top - headerSize
    }, 1500);
  }

  //events
  $('.nav-link#home').click(function(){
    scrollPage($("header#home"))
  });
  $('.nav-link#about').click(function(){
    scrollPage($("div#about"))
  });
  $('.nav-link#services').click(function(){
    scrollPage($("div#services"))
  });
  $('.nav-link#how-we-work').click(function(){
    scrollPage($("div#how-we-work"))
  });
  $('.nav-link#team').click(function(){
    scrollPage($("div#team"))
  });
  $('.nav-link#contact').click(function(){
    scrollPage($("section#contact"))
  });

  $(window).bind('scroll', function () {
    updateMenu()
  })
})
