function openTab(tabId) {
    // 1. Ẩn tất cả các nội dung tab
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // 2. Xóa trạng thái 'active' khỏi tất cả các nút trên menu
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 3. Hiển thị nội dung tab được chọn
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // 4. Thêm trạng thái 'active' cho nút vừa bấm
    // Tìm nút có onclick chứa tabId tương ứng để active (cách đơn giản)
    // Trong thực tế có thể dùng event.currentTarget, nhưng cách này dễ hiểu cho người mới.
    tabs.forEach(tab => {
        if (tab.getAttribute('onclick').includes(tabId)) {
            tab.classList.add('active');
        }
    });

    
}

/* --- SLIDER LOGIC --- */
const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');

let currentIndex = 0;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let autoPlayInterval;

// 1. Khởi chạy Auto-play
startAutoPlay();

function startAutoPlay() {
    // Tự động chuyển ảnh sau mỗi 3 giây
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 3000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// 2. Xử lý sự kiện kéo (Mouse & Touch)
// Cho chuột (Desktop)
track.addEventListener('mousedown', touchStart);
track.addEventListener('mouseup', touchEnd);
track.addEventListener('mouseleave', () => {
    if (isDragging) touchEnd();
});
track.addEventListener('mousemove', touchMove);

// Cho cảm ứng (Mobile)
track.addEventListener('touchstart', touchStart);
track.addEventListener('touchend', touchEnd);
track.addEventListener('touchmove', touchMove);

function touchStart(index) {
    return function(event) {
        stopAutoPlay(); // Dừng tự động chạy khi người dùng tương tác
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none'; // Tắt transition để kéo cho mượt (real-time)
    }
}

// Hàm gán sự kiện (để gọi đúng context)
track.onmousedown = touchStart(currentIndex);
track.ontouchstart = touchStart(currentIndex);

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    // Nếu kéo đủ xa (lớn hơn 100px) thì chuyển slide
    if (movedBy < -100 && currentIndex < slides.length - 1) {
        currentIndex += 1;
    }
    if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }

    setPositionByIndex();
    track.style.transition = 'transform 0.8s ease-out'; // Bật lại transition
    track.classList.add('bluring');
    startAutoPlay(); // Chạy lại tự động sau khi thả tay
}

function touchMove(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
}

// 3. Chuyển đến vị trí slide cụ thể
function setPositionByIndex() {
    currentTranslate = currentIndex * -track.clientWidth; // Dùng chiều rộng thực tế của container
    prevTranslate = currentTranslate;
    setSliderPosition();
}

// 4. Hàm chuyển slide tự động
function nextSlide() {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Quay về đầu nếu đang ở cuối
    }
    // Khi hiệu ứng trượt kết thúc, gỡ bỏ class làm mờ
    track.addEventListener('transitionend', () => {
    track.classList.remove('bluring');
});
    setPositionByIndex();
}

// Khi hiệu ứng trượt kết thúc, gỡ bỏ class làm mờ
track.addEventListener('transitionend', () => {
    track.classList.remove('bluring');
});