$(function(){
  var navItems = $('.nav-item')

  function updateMenu () {
    var scrollTop = $(window).scrollTop()
    switch (true) {
      case scrollTop < 160:
        $('.navbar').removeClass('navbar--fixed')
        for(x=0;x<navItems.length;x++){
          navItems.eq(x).removeClass('active')
        }
        navItems.eq(0).addClass("active")
        break
      case scrollTop > 160 && scrollTop < 500:
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

  $(window).bind('scroll', function () {
    updateMenu()
  });
});