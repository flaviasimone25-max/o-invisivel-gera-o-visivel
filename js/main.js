(function () {
  var PIX_KEY = "65981325700";

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.top = "0";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      try {
        var ok = document.execCommand("copy");
        document.body.removeChild(field);
        ok ? resolve() : reject();
      } catch (error) {
        document.body.removeChild(field);
        reject(error);
      }
    });
  }

  document.querySelectorAll("[data-copy-pix]").forEach(function (button) {
    button.addEventListener("click", function () {
      var label = button.querySelector("[data-copy-label]");
      var original = label ? label.textContent : button.textContent;
      copyText(PIX_KEY).then(function () {
        if (label) label.textContent = "Chave copiada";
        else button.textContent = "Chave copiada";
        button.classList.add("is-copied");
        window.setTimeout(function () {
          if (label) label.textContent = original;
          else button.textContent = original;
          button.classList.remove("is-copied");
        }, 2200);
      }).catch(function () {
        var num = button.querySelector(".pix-num");
        if (!num) return;
        var range = document.createRange();
        range.selectNodeContents(num);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });
    });
  });

  var countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    var target = new Date(countdown.getAttribute("data-countdown")).getTime();
    var days = countdown.querySelector("[data-d]");
    var hours = countdown.querySelector("[data-h]");
    var minutes = countdown.querySelector("[data-m]");

    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        countdown.hidden = true;
        return;
      }
      days.textContent = String(Math.floor(diff / 86400000));
      hours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
      minutes.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    };

    tick();
    window.setInterval(tick, 30000);
  }

  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
  }

  var bar = document.querySelector(".mobile-bar");
  var hero = document.querySelector(".hero");
  if (bar && hero) {
    var toggleBar = function () {
      var show = window.innerWidth <= 720 && window.scrollY > hero.offsetHeight * 0.72;
      bar.classList.toggle("is-visible", show);
      document.body.classList.toggle("has-mobile-bar", show);
    };
    toggleBar();
    document.addEventListener("scroll", toggleBar, { passive: true });
    window.addEventListener("resize", toggleBar);
  }

  var floatBtn = document.querySelector(".whats-float");
  var inscricao = document.querySelector("#inscricao");
  if (floatBtn && hero) {
    var hideForInscricao = false;
    var placeFloat = function () {
      var pastHero = window.scrollY > hero.offsetHeight * 0.45;
      var narrow = window.innerWidth <= 720;
      var hidden = narrow || hideForInscricao || !pastHero;
      floatBtn.classList.toggle("is-hidden", hidden);
      floatBtn.setAttribute("aria-hidden", hidden ? "true" : "false");
      floatBtn.tabIndex = hidden ? -1 : 0;
    };
    if (inscricao && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          hideForInscricao = entry.isIntersecting;
          placeFloat();
        });
      }, { threshold: 0.2 });
      observer.observe(inscricao);
    }
    placeFloat();
    document.addEventListener("scroll", placeFloat, { passive: true });
    window.addEventListener("resize", placeFloat);
  }
})();
