TATTVO TECH Website
Static marketing website for TATTVO TECH, hosted on GitHub Pages at https://tattvotech.com (see CNAME). There is no build step: edit the files and push.

Project Structure
index.html: Homepage (hero, services, agency partnership, portfolio, process, pricing & engagement, about, contact form).

privacy.html / terms.html: Privacy Policy and Terms of Use.

404.html: Custom "page not found" page served by GitHub Pages.

tattvo-vision.html: Tattvo Vision R&D initiative page.

style.css: Custom CSS on top of Tailwind (cards, form fields, focus styles, legal page typography).

script.js: Hero 3D animation, navigation, contact form validation/submission and GA4 event tracking.

consent.js: Analytics cookie banner. Works with the Google Consent Mode defaults set inline in each page's <head>.

assets/img/: Optimised WebP images used by the site. Original source images are kept in assets/.

sitemap.xml / robots.txt: Search engine files. Add new public pages to sitemap.xml.

Contact Form
The inquiry form posts to Formspree (https://formspree.io/f/xyekgdjw). Submissions are forwarded to the inbox configured in the Formspree dashboard. Spam protection uses Formspree's _gotcha honeypot field. Field names (name, email, company, service, budget, contact_method, mobile, description) appear in the emails, so keep them stable.

Analytics
Google Analytics 4 (G-H4D9GLDBT1) with Consent Mode. Analytics storage is denied by default for EEA/UK/CH visitors until they accept. Other visitors can decline through the banner or "Cookie Settings" in the footer.

Run Locally
npm start (or any static server, e.g. python3 -m http.server) and open http://localhost:8080.

Technologies Used
HTML5, Tailwind CSS (CDN), vanilla JavaScript, Three.js (hero animation), Font Awesome (icons), Formspree (form handling).
