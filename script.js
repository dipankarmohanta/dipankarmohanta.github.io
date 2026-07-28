(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     Footer year
  ---------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Nav: shrink on scroll + active link tracking
  ---------------------------------------------------------- */
  var nav = document.getElementById("nav");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinks.map(function(link){
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  function onScroll(){
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");

    // back to top button
    if (toTop) {
      if (window.scrollY > 700) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }

    // active section
    var pos = window.scrollY + window.innerHeight * 0.3;
    var current = sections[0];
    sections.forEach(function(sec){
      if (sec.offsetTop <= pos) current = sec;
    });
    navLinks.forEach(function(link){
      var target = document.querySelector(link.getAttribute("href"));
      link.classList.toggle("active", target === current);
    });

    updateSpine();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     Mobile menu
  ---------------------------------------------------------- */
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  if (burger && links){
    burger.addEventListener("click", function(){
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  var toTop = document.getElementById("toTop");
  if (toTop){
    toTop.addEventListener("click", function(){
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ----------------------------------------------------------
     Scroll reveal via IntersectionObserver
  ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in-view"); });
  }

  /* ----------------------------------------------------------
     Hero role typewriter
  ---------------------------------------------------------- */
  var roles = ["Web Designer", "Software Developer", "Network Engineer", "Digital Marketer", "YouTuber"];
  var roleEl = document.getElementById("roleType");

  function typewriter(){
    if (!roleEl) return;
    if (reduceMotion){ roleEl.textContent = roles[0]; return; }

    var roleIndex = 0, charIndex = 0, deleting = false;

    function tick(){
      var word = roles[roleIndex];
      if (!deleting){
        charIndex++;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length){
          deleting = true;
          setTimeout(tick, 1500);
          return;
        }
        setTimeout(tick, 70);
      } else {
        charIndex--;
        roleEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0){
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 35);
      }
    }
    tick();
  }
  typewriter();

  /* ----------------------------------------------------------
     Portfolio filter
  ---------------------------------------------------------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".p-card");
  filterBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      filterBtns.forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      cards.forEach(function(card){
        var match = filter === "all" || card.getAttribute("data-cat") === filter;
        card.classList.toggle("hide", !match);
      });
    });
  });

  /* ----------------------------------------------------------
     Signature spine: dot travels the path with scroll progress
  ---------------------------------------------------------- */
  var spinePath = document.getElementById("spinePath");
  var spineDot = document.getElementById("spineDot");
  var pathLength = spinePath ? spinePath.getTotalLength() : 0;

  function updateSpine(){
    if (!spinePath || !spineDot) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    var point = spinePath.getPointAtLength(progress * pathLength);
    spineDot.setAttribute("cx", point.x);
    spineDot.setAttribute("cy", point.y);
  }
  window.addEventListener("resize", updateSpine);

  /* ----------------------------------------------------------
     Contact form (static demo — no backend)
  ---------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      note.textContent = "Thanks — your message is ready to send once this form is connected to a backend or form service.";
      form.reset();
    });
  }

})();
