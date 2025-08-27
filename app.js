// Page 1- take pictures
const camera = document.getElementById('camera');
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
const techToggle = document.getElementById('tech-toggle');
const cuteToggle = document.getElementById('cute-toggle');

function enterStickerMode() {
    video.style.display = 'none';
    snapBtn.style.display = 'none';
    camera.style.display = 'none';
    addStickerBtn.style.display = 'none';
    stickerControls.style.display = 'block';
    // Animate photostrip
    const photostrip = document.getElementById('photostrip');
    if (photostrip) {
        photostrip.classList.add('sticker-mode');
    }
}


