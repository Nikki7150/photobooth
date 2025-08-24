// Page 1- take pictures
const video = document.getElementById('video');
const snapBtn = document.getElementById('snap');
const slots = document.querySelectorAll('.slot');
let currentSlot = 0;

const addStickerBtn = document.getElementById('add-sticker');
addStickerBtn.style.display = 'none';

// access camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing camera: ", err);
    });

// Capture photo into next slot
snapBtn.addEventListener('click', () => {
    if (currentSlot < slots.length) {
        const ctx = slots[currentSlot].getContext('2d');
        ctx.drawImage(video, 0, 0, slots[currentSlot].width, slots[currentSlot].height);
        currentSlot++;

        if (currentSlot === slots.length) {
            addStickerBtn.style.display = 'block';
        }
    }
    else {
        alert("All 4 slots are filled!");
    }
});

addStickerBtn.addEventListener('click', () => {
    enterStickerMode();
});

// Page 2 - Add Stickers
const stickerControls = document.getElementById('sticker-controls');
const stickerPanel = document.getElementById('sticker-panel');
const techToggle = document.getElementById('tech-toggle');
const cuteToggle = document.getElementById('cute-toggle');

const techStickers = ['tech1.png', 'tech2.png', 'tech3.png'];
const cuteStickers = ['cute1.png', 'cute2.png', 'cute3.png'];

function enterStickerMode() {
     video.style.display = 'none';
     snapBtn.style.display = 'none';
    addStickerBtn.style.display = 'none';
    stickerControls.style.display = 'block';
    loadStickers('tech'); // default mode
}

function loadStickers(mode) {
    stickerPanel.innerHTML = '';
    const stickers = mode === 'tech' ? techStickers : cuteStickers;
    stickers.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('sticker');
        img.draggable = false;
        makeDraggable(img);
        stickerPanel.appendChild(img);
    });
}

techToggle.addEventListener('click', () => loadStickers('tech'));
cuteToggle.addEventListener('click', () => loadStickers('cute'));

// Dragging functions
function makeDraggable(el) {
    el.addEventListener('mousedown', function(e) {
        e.preventDefault();
        const cardRect = document.querySelector('.photocard').getBoundingClientRect();
        let shiftX = e.clientX - el.getBoundingClientRect().left;
        let shiftY = e.clientY - el.getBoundingClientRect().top;

        el.style.position = 'absolute';
        el.style.zIndex = 1000;
        document.body.appendChild(el);

        function moveAt(pageX, pagey) {
            let x = pageX - shiftX;
            let y = pageY - shiftY;

            x = Math.max(cardRect.left, Math.min(x, cardRect.right - el.offsetWidth));
            y = Math.max(cardRect.top, Math.min(y, cardRect.bottom - el.offsetHeight));
           
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        }

        moveAt(e.pageX, e.pageY);

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        el.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            el.onmouseup = null;
        }
    });

    el.ondragstart = () => false;
}