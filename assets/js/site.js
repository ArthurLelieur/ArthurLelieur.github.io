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
});
