document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;

    const showLoader = () => loader.classList.add("show");
    const hideLoader = () => loader.classList.remove("show");
    let hasLoaded = document.readyState === "complete";

    const onLoaded = () => {
        hideLoader();
        hasLoaded = true;
    };

    if (hasLoaded) {
        onLoaded();
    }

    window.addEventListener("load", onLoaded);
    window.addEventListener("pageshow", event => {
        if (event.persisted) {
            onLoaded();
        }
    });

    const internalLinks = Array.from(document.querySelectorAll("a[href]:not([href^='http']):not([href^='mailto:']):not([href^='#']):not([target='_blank'])"));

    internalLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
            event.preventDefault();
            showLoader();
            setTimeout(() => {
                window.location.href = href;
            }, 260);
        });
    });

    setTimeout(() => {
        if (!hasLoaded) {
            showLoader();
        }
    }, 40);

    const setupGallery = (galleryId, buttonSelector) => {
        const openGalleryButton = document.querySelector(buttonSelector);
        const galleryOverlay = document.getElementById(galleryId);
        const closeGalleryButton = galleryOverlay?.querySelector(".modal-close");
        const prevButton = galleryOverlay?.querySelector(".gallery-prev");
        const nextButton = galleryOverlay?.querySelector(".gallery-next");
        const slides = Array.from(galleryOverlay?.querySelectorAll(".gallery-slide") || []);
        let currentSlide = 0;

        if (!openGalleryButton || !galleryOverlay) return;

        const updateGalleryControls = index => {
            if (!prevButton || !nextButton) return;
            prevButton.style.display = index <= 0 ? "none" : "inline-flex";
            nextButton.style.display = index >= slides.length - 1 ? "none" : "inline-flex";
        };

        const setSlide = index => {
            const normalizedIndex = Math.max(0, Math.min(index, slides.length - 1));
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("active", slideIndex === normalizedIndex);
            });
            currentSlide = normalizedIndex;
            updateGalleryControls(currentSlide);
        };

        const openGallery = () => {
            if (!galleryOverlay) return;
            galleryOverlay.classList.add("open");
            galleryOverlay.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            setSlide(currentSlide);
        };

        const closeGallery = () => {
            if (!galleryOverlay) return;
            galleryOverlay.classList.remove("open");
            galleryOverlay.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        };

        openGalleryButton.addEventListener("click", openGallery);
        closeGalleryButton?.addEventListener("click", closeGallery);
        galleryOverlay?.addEventListener("click", event => {
            if (event.target === galleryOverlay) {
                closeGallery();
            }
        });
        prevButton?.addEventListener("click", () => setSlide(currentSlide - 1));
        nextButton?.addEventListener("click", () => setSlide(currentSlide + 1));

        const keyHandler = event => {
            if (!galleryOverlay?.classList.contains("open")) return;
            if (event.key === "Escape") closeGallery();
            if (event.key === "ArrowLeft") setSlide(currentSlide - 1);
            if (event.key === "ArrowRight") setSlide(currentSlide + 1);
        };
        document.addEventListener("keydown", keyHandler);
    };

    setupGallery("towerDefenseGallery", ".btn-gallery[data-gallery='tower-defense']");
    setupGallery("blenderGallery", ".btn-gallery[data-gallery='blender']");


});
