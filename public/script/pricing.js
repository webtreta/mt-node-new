document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 1.1,
      spaceBetween: 20,
      navigation: true,
      breakpoints: {
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3 }
      }
    });
  });
  