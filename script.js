/**
 * Future Guidance Section - Auto Slide Carousel Logic
 * NewSkyEdu Project
 */

document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('future-guidance-slide');
    if (!sliderContainer) return;

    const wrapper = sliderContainer.querySelector('.fg-slider-wrapper');
    const slides = sliderContainer.querySelectorAll('.fg-slide');
    const dots = sliderContainer.querySelectorAll('.fg-dot');
    const prevBtn = sliderContainer.querySelector('.fg-prev-btn');
    const nextBtn = sliderContainer.querySelector('.fg-next-btn');

    if (!wrapper || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    const intervalTime = 4000; // 4 seconds per slide
    let slideInterval;

    // Transition wrapper offset, toggle active dot and active classes for captions animations
    function goToSlide(index) {
        // Clamp and wrap index
        currentIndex = (index + totalSlides) % totalSlides;
        
        // Calculate offset (each slide takes 100/totalSlides % of the wrapper width)
        const offsetPercent = currentIndex * (100 / totalSlides);
        wrapper.style.transform = `translateX(-${offsetPercent}%)`;

        // Update active class on slides for text overlay entrance animations
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update active class on dot indicators
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Auto Play Controls
    function startAutoPlay() {
        stopAutoPlay(); // Prevent duplicate intervals
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Event Listeners for Controls
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Reset timer on manual click
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Reset timer on manual click
        });
    }

    // Event Listeners for Dots Indicators
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoPlay(); // Reset timer on manual click
        });
    });

    // Pause on Hover
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);

    // Initialize Auto Play
    startAutoPlay();
});
