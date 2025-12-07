function openTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => tab.classList.remove('active'));

    const selectedContent = document.getElementById(tabId);
    if (selectedContent) selectedContent.classList.add('active');

    tabs.forEach(tab => {
        if (tab.getAttribute('onclick').includes(tabId)) tab.classList.add('active');
    });
}

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const toggleBtn = document.getElementById('toggle-history');
const contactHistory = document.querySelector('.contact-history');

//Render contact history
function renderContactHistory() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contactList.innerHTML = '';

    contacts.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `[${item.time}] ${item.name}: ${item.message}`;
        contactList.appendChild(li);
    });

    contactList.scrollTop = contactList.scrollHeight;
}

// Toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0,0,0,0.7)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '10px';
    toast.style.zIndex = 9999;
    toast.style.opacity = 0;
    toast.style.transition = 'opacity 0.3s';

    requestAnimationFrame(() => toast.style.opacity = 1);

    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 500);
    }, 2800);
}

// Submit form
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !message) {
        showToast("Vui lòng điền đầy đủ thông tin trước khi gửi!");
        return;
    }

    const contactData = JSON.parse(localStorage.getItem('contacts')) || [];
    contactData.push({ name, message, time: new Date().toLocaleString() });
    localStorage.setItem('contacts', JSON.stringify(contactData));

    showToast(`Chúng tôi đã nhận thông tin từ "${name}".Cảm ơn "${name}" đã liên hệ với chúng tôi. Chúng tôi sẽ cố gắng phản hồi bạn sớm nhất có thể.`);
    contactForm.reset();

    if (!contactHistory.classList.contains('hidden')) renderContactHistory();
});

// Toggle history
toggleBtn.addEventListener('click', () => {
    contactHistory.classList.toggle('hidden');
    toggleBtn.textContent = contactHistory.classList.contains('hidden') ? 
        'Hiển thị lịch sử liên hệ' : 'Ẩn lịch sử liên hệ';
    if (!contactHistory.classList.contains('hidden')) renderContactHistory();
});
