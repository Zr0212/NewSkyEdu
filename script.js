/* ==========================================================================
   01. Future Guidance Slider
   ========================================================================== */

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



/* ==========================================================================
   02. Consultation Form
   ========================================================================== */

const scriptURL = "https://script.google.com/macros/s/AKfycbz-zipFKCZznl8MeWZ2WH289Oq1BBbzTK2JhT_KWbSkaHmK7QGj1bzAof5Z63pgNu7-/exec";

const forms = document.querySelectorAll(".js-consultation-form");

forms.forEach(form => {
    form.addEventListener("submit", submitConsultationForm);
});

/**
 * Hàm xử lý gửi form tư vấn
 * - Validate dữ liệu
 * - Gửi dữ liệu lên Google Sheet
 * - Hiển thị SweetAlert
 */
async function submitConsultationForm(e) {

    e.preventDefault();

    const form = e.currentTarget;

    const fullname = form.querySelector(".js-fullname").value.trim();
    const phone = form.querySelector(".js-phone").value.trim();
    const email = form.querySelector(".js-email").value.trim();
    const course = form.querySelector(".js-course").value;

    // ===== Validate Họ tên =====
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;

    if (fullname.length < 2) {
        Swal.fire({
            icon: "warning",
            title: "Thiếu thông tin",
            text: "Vui lòng nhập họ và tên."
        });
        return;
    }

    if (!nameRegex.test(fullname)) {
        Swal.fire({
            icon: "error",
            title: "Họ tên không hợp lệ",
            text: "Họ tên không được chứa số hoặc ký tự đặc biệt."
        });
        return;
    }

    // ===== Validate SĐT =====
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

    if (!phoneRegex.test(phone)) {
        Swal.fire({
            icon: "error",
            title: "Số điện thoại không hợp lệ",
            text: "Vui lòng nhập đúng số điện thoại Việt Nam."
        });
        return;
    }

    // ===== Validate Email =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Email không hợp lệ",
            text: "Vui lòng kiểm tra lại email."
        });
        return;
    }

    // ===== Validate Khóa học =====
    if (!course) {
        Swal.fire({
            icon: "warning",
            title: "Chưa chọn khóa học",
            text: "Vui lòng chọn khóa học bạn quan tâm."
        });
        return;
    }

    const submitBtn = form.querySelector(".submit-btn");

    submitBtn.disabled = true;

    submitBtn.innerHTML = `
        <span class="spinner"></span>
        Đang gửi...
    `;

    try {

        const response = await fetch(scriptURL, {
            method: "POST",
            body: new FormData(form)
        });

        const result = await response.text();

        if (result === "Success") {

            Swal.fire({
                icon: "success",
                title: "Đăng ký thành công!",
                text: "Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
                confirmButtonText: "Đóng",
                confirmButtonColor: "#0B6E4F"
            });

            form.reset();

            // Nếu form nằm trong popup thì đóng popup
            if (form.closest(".consultation-modal")) {
                closeModal();
            }

        } else {

            Swal.fire({
                icon: "error",
                title: "Gửi thất bại",
                text: result
            });

        }

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Không thể kết nối",
            text: "Vui lòng thử lại sau."
        });

    } finally {

        submitBtn.disabled = false;

        submitBtn.innerHTML = `
            Nhận tư vấn
            <iconify-icon icon="tabler:send-2" style="font-size:20px;"></iconify-icon>
        `;

    }

}



/* ==========================================================================
   03. Navigation Active
   ========================================================================== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("#top-nav-bar a");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            navLinks.forEach(link => {
                link.classList.remove("active");

                if (link.getAttribute("href") === "#" + entry.target.id) {
                    link.classList.add("active");
                }
            });

        }
    });
}, {
    threshold: 0.4
});

sections.forEach(section => observer.observe(section));


/* ==========================================================================
   04. Scroll To Top
   ========================================================================== */

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 400){
        scrollBtn.classList.add("show");
    }else{
        scrollBtn.classList.remove("show");
    }

});

scrollBtn.addEventListener("click",()=>{

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

});


/* ==========================================================================
   05. Consultation Popup
   ========================================================================== */
const consultationModal = document.querySelector(".consultation-modal");

const openButtons = document.querySelectorAll(".open-consultation-modal");

const closeButton = document.querySelector(".modal-close");

const overlay = document.querySelector(".consultation-modal-overlay");

// Chỉ lấy select trong popup
const courseSelect = consultationModal.querySelector(".js-course");

function openModal(button) {

    consultationModal.classList.add("show");
    document.body.style.overflow = "hidden";

    const course = button.dataset.course;

    if (course) {
        courseSelect.value = course;
    } else {
        courseSelect.selectedIndex = 0;
    }

}

function closeModal() {

    consultationModal.classList.remove("show");
    document.body.style.overflow = "";

}

// Mở popup
openButtons.forEach(button => {

    button.addEventListener("click", () => {
        openModal(button);
    });

});

// Đóng popup bằng nút X
closeButton.addEventListener("click", closeModal);

// Đóng popup khi bấm nền tối
overlay.addEventListener("click", closeModal);

// Đóng popup bằng ESC
document.addEventListener("keydown", (e) => {

    if (
        e.key === "Escape" &&
        consultationModal.classList.contains("show")
    ) {
        closeModal();
    }

});
