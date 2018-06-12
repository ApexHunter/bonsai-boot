$(function(){
  var navItems = $('.nav-item')

  $(window).bind('scroll', function () {
    var scrollTop = $(window).scrollTop()
    console.log(scrollTop)
    switch (true) {
      case scrollTop < 50:
        $('.navbar').removeClass('navbar--fixed')
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(0).addClass("active")
        break
      case scrollTop > 50 && scrollTop < 500:
        $('.navbar').addClass('navbar--fixed')
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
      case scrollTop > 2000 && scrollTop < 2500:
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(4).addClass("active")
        break
      default:
        break
    }
  });
});