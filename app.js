document.addEventListener("keydown", function(e) {
  // F5 or Ctrl+R (Cmd+R on Mac)
  if (e.key === "F5" || (e.ctrlKey && e.key === "r") || (e.metaKey && e.key === "r")) {
    e.preventDefault();
    if (confirm("Reloading will reset your photocard. Continue?")) {
      location.reload(); // reload only if user clicks OK
    }
  }
});

const homelink = document.getElementById('home-link');
if (homelink) {
    homelink.addEventListener('click', (e) => {
        confirm("Going back to home will reset your photocard. Continue?") || e.preventDefault();
    });
}

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
const scroll = document.getElementById('scroll');
const click = document.getElementById('click');
const overlayLayer = document.getElementById('overlay-layer');
const photostrip = document.getElementById('photostrip');
const photocard = document.getElementById('photocard');
const finalizeBtn = document.getElementById('Finalize');

function enterStickerMode() {
    video.style.display = 'none';
    snapBtn.style.display = 'none';
    camera.style.display = 'none';
    addStickerBtn.style.display = 'none';
    scroll.style.display = 'none';
    click.style.display = 'none';
    stickerControls.style.display = 'block';
    finalizeBtn.style.display = 'block';

    // Animate photostrip
    if (photostrip) {
        photostrip.classList.add('sticker-mode');
    }

    // Show overlay layer
    //if (overlayLayer) {
    //    overlayLayer.style.display = 'block';
    //}
}

const image = document.getElementById('pattern');

// Overlay buttons
const redBtn = document.getElementById('Red-overlay');
const greenBtn = document.getElementById('Green-overlay');
const blueBtn = document.getElementById('Blue-overlay');
const yellowBtn = document.getElementById('Yellow-overlay');
const purpleBtn = document.getElementById('Purple-overlay');
const orangeBtn = document.getElementById('Orange-overlay');
const pinkBtn = document.getElementById('Pink-overlay');
const whiteBtn = document.getElementById('White-overlay');
const blackBtn = document.getElementById('Black-overlay');

const maroonBtn = document.getElementById('maroon-overlay');
const bluecircleBtn = document.getElementById('bluecircle-overlay');
const filmBtn = document.getElementById('film-overlay');
const leavesBtn = document.getElementById('leaves-overlay');
const cloudsBtn = document.getElementById('clouds-overlay');
const tapeBtn = document.getElementById('tape-overlay');

redBtn.addEventListener('click', () => applyOverlay('rgba(178, 43, 39)'));
greenBtn.addEventListener('click', () => applyOverlay('rgba(0, 41, 24)'));
blueBtn.addEventListener('click', () => applyOverlay('rgba(40, 79, 143)'));
yellowBtn.addEventListener('click', () => applyOverlay('rgba(239, 208, 51)'));
purpleBtn.addEventListener('click', () => applyOverlay('rgba(80, 35, 128)'));
orangeBtn.addEventListener('click', () => applyOverlay('rgba(244, 171, 106)'));
pinkBtn.addEventListener('click', () => applyOverlay('rgba(244, 191, 212)'));
whiteBtn.addEventListener('click', () => applyOverlay('rgba(255, 255, 255)'));
blackBtn.addEventListener('click', () => applyOverlay('rgba(0, 0, 0)'));

maroonBtn.addEventListener('click', () => applyPatternOverlay('assets/maroon-overlay.png'));
bluecircleBtn.addEventListener('click', () => applyPatternOverlay('assets/blue-overlay.png').style.height = '760px');
filmBtn.addEventListener('click', () => applyPatternOverlay('assets/casette-overlay.png').style.height = '754px');
leavesBtn.addEventListener('click', () => applyPatternOverlay('assets/leaves-overlay.png'));
cloudsBtn.addEventListener('click', () => applyPatternOverlay('assets/puffy-overlay.png').style.height = '754px');
tapeBtn.addEventListener('click', () => applyPatternOverlay('assets/tapes-overlay.png').style.height = '754px');

function applyOverlay(color) {
    if (overlayLayer) {
        image.style.display = 'none';
        photostrip.style.backgroundColor = color;
        photocard.style.backgroundColor = color;
        image.style.display = 'none';
        overlayLayer.style.backgroundColor = 'transparent';
    }
}

function applyPatternOverlay(src) {
    if (overlayLayer) {
        overlayLayer.style.display = 'block';
        overlayLayer.style.backgroundColor = 'transparent';
        photostrip.style.backgroundColor = 'transparent';
        photocard.style.backgroundColor = 'transparent';
        image.src = src;
        image.style.display = 'block';
    }
}


// Page 3 - Final View
const exportcontrols = document.getElementById('export-controls');
const doublePhotocard = document.getElementById('double-photocard');
const downloadBtn = document.getElementById('download');
const retakeBtn = document.getElementById('retake');

finalizeBtn.addEventListener('click', () => {
    enterFinalMode();
});

function enterFinalMode() {
    // Hide editing UI
    stickerControls.style.display = 'none';
    finalizeBtn.style.display = 'none';

    if (exportcontrols) {
        exportcontrols.classList.add('final-mode');
    }

    if (photostrip) {
        photostrip.classList.add('final-mode');
    }
    if (overlayLayer) {
        overlayLayer.classList.add('final-mode');
    }

    // Show final view
    exportcontrols.style.display = 'block';

    // Get the photostrip element
    const photostripElement = document.getElementById("photostrip");

    // Render the photostrip once into canvas for preview
    html2canvas(photostripElement, { useCORS: true }).then(canvas => {
        const dataURL = canvas.toDataURL("image/png");

        // Put same image twice in diagonal layout
        doublePhotocard.querySelector('.original').innerHTML =
            `<img src="${dataURL}" style="width:100%; border-radius:8px;">`;
        doublePhotocard.querySelector('.clone').innerHTML =
            `<img src="${dataURL}" style="width:100%; border-radius:8px;">`;
    });
}

// Download button handler: download fresh image
downloadBtn.addEventListener('click', () => {
    const photostripElement = document.getElementById("photostrip");
    html2canvas(photostripElement, { useCORS: true }).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "photostrip.png";
        link.click();
    });
});

// Retake button handler: reload the page with warning
retakeBtn.addEventListener('click', () => {
    confirm("Retaking will reset your photocard. Continue?") && location.reload();
});