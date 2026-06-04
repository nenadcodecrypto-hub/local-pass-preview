const galleryButtons = Array.from(document.querySelectorAll(".partner-gallery button"));
const lightbox = document.querySelector(".gallery-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");
let activeImageIndex = 0;

const getGalleryImage = (index) => {
  const image = galleryButtons[index]?.querySelector("img");
  return {
    alt: image?.alt || "",
    src: image?.src || "",
  };
};

const showImage = (index) => {
  activeImageIndex = (index + galleryButtons.length) % galleryButtons.length;
  const image = getGalleryImage(activeImageIndex);
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
};

const openLightbox = (index) => {
  showImage(index);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  galleryButtons[activeImageIndex]?.focus();
};

if (lightbox && galleryButtons.length > 0) {
  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => showImage(activeImageIndex - 1));
  lightboxNext.addEventListener("click", () => showImage(activeImageIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showImage(activeImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(activeImageIndex + 1);
    }
  });
}
