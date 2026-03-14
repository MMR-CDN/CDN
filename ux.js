/**
 * ux.js — Unified UX Scripts
 * Merged from: Claude_v1_2, Gemini_v1_2, Git_v1_0, Intel_X550-T2_v1_1
 *
 * Modules:
 *   1. copyCode()        — clipboard copy for code blocks
 *   2. initTocObserver() — scroll-driven TOC active link highlight
 */

/* =============================================================
   § 01  Code Block Copy
   ============================================================= */

/**
 * Copies the text content of the nearest <pre> sibling to the clipboard.
 * Provides visual feedback on the clicked button for 2 seconds.
 *
 * @param {HTMLButtonElement} button - The copy button element inside .code-header
 * @returns {void}
 */
function copyCode(button) {
    /** @type {HTMLPreElement} */
    const pre = button.closest('.code-header').nextElementSibling;
    const codeText = pre.innerText;

    navigator.clipboard
        .writeText(codeText)
        .then(() => {
            const span = button.querySelector('span');
            const original = span.innerText;

            span.innerText = '복사 완료!';
            button.style.color = 'var(--accent-tertiary)';

            setTimeout(() => {
                span.innerText = original;
                button.style.color = '';
            }, 2000);
        })
        .catch((err) => console.error('[ux.js] copyCode failed:', err));
}

/* =============================================================
   § 02  TOC Active Link — IntersectionObserver
   ============================================================= */

/**
 * Initialises an IntersectionObserver that highlights the TOC link
 * corresponding to the section currently visible in the viewport.
 *
 * Observes all <section> elements with an [id] attribute and toggles
 * the `.active` class on the matching `.toc-nav a` element.
 *
 * @returns {void}
 */
function initTocObserver() {
    /** @type {NodeListOf<Element>} */
    const sections = document.querySelectorAll('section[id]');

    /** @type {NodeListOf<HTMLAnchorElement>} */
    const navLinks = document.querySelectorAll('.toc-nav a');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        },
        {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0,
        },
    );

    sections.forEach((section) => observer.observe(section));
}

/* =============================================================
   § 03  Init
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
    initTocObserver();
});
