document.addEventListener('DOMContentLoaded', function () {
    const initialHeader = document.querySelector('header.main-header');
    const stickyHeader = document.querySelector('header.sticky-header');

    function handleScroll() {
        const headerBottom = initialHeader.offsetTop + initialHeader.offsetHeight;
        if (window.scrollY > headerBottom) {
            stickyHeader.classList.remove('d-none');
        } else {
            stickyHeader.classList.add('d-none');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            handleScroll();
        }
    });
});
 // 下線アニメーションのため
 const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .sticky-header .navbar-nav .nav-link');
 navLinks.forEach(link => {
     link.addEventListener('mouseenter', function() {
         this.classList.add('hovered');
     });
      link.addEventListener('mouseleave', function() {
         this.classList.remove('hovered');
     });
 });
