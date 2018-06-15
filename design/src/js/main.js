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
  });

  $(".contact__form").on("submit", function(event) {
    event.preventDefault();
    
    var form = $(this);
    var inputs = form.find("input, textarea");
    var sitekey = "6LdFyl4UAAAAALq8_mnxZDyc4SbCj0PQKT9bHI77";
    var size = "invisible";
    var invalid = false;

    if (invalid) {
      return false;
    } else {
      grecaptcha.render("recaptcha", {
        'sitekey': sitekey,
        'size': size,
        'callback': function(token) {
          var btn = form.find("button[type='submit']");
          var method = "POST";
          var url = "http://localhost:8080/contact/send_mail.php";
          var data = {
            g_recaptcha_response: token
          };

          inputs.each(function(index, element) {
            var input = element;
            data[input.name] = input.value;
          });

          $.ajax({
            url: url,
            method: method,
            data: data,
            beforeSend: function () {
              btn.text("Enviando...");
            }
          }).done(function (res) {
            console.log(res);
            // form.reset();

            btn.text("Enviado!");

            setTimeout(function() {
              $(resContainer).slideUp("slow");
              button.textContent = "Enviar";
            }, 5000);
          }).fail(function (xhr) {
            console.log(xhr);
          });
        }
      });

      grecaptcha.execute();
    }
  });
});

function inputValidation (inputs) {
  var invalid = false;

  inputs.each(function (index, element) {
    var input = element;
    var group = input.parent(".form-group");
    var textHelp = group.find(".text-help");

    if (input.val() == "") {
      input.addClass("invalid");
      invalid = true;
    } else {
      if (input.attr("type") == "email") {
        var regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        
        if (!regex.test(input.val())) {
          invalid = true;
          textHelp.text("Forneça um endereço de email válido.");
          input.addClass("invalid");
        } else {
          input.removeClass("invalid");
          textHelp.text("Preencha este campo.");
        }
      } else {
        input.removeClass("invalid");
      }
    }

    return invalid;
  });
}
 
