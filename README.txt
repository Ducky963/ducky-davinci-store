DUCKY DAVINCI — REDESIGNED STOREFRONT

Included:
- index.html, styles.css, app.js: bilingual colourful storefront
- products.js: catalogue data (21 starter entries; edit/remove placeholders)
- admin.html, admin.css, admin.js: visual product dashboard
- images/: upload product photos here

WhatsApp:
The order number is set in app.js as 201229101276 (international format without +).
Orders are not paid online. Customer details and cart are composed into a WhatsApp message; the customer must press Send in WhatsApp.

Dashboard workflow:
1. Open your published site and go to /admin.html.
2. Add/edit/delete products. Set English and Arabic names, category, price, descriptions, details and image path.
3. Dashboard changes are stored only in that browser's local storage.
4. Click Export products.js to download the updated catalogue.
5. In GitHub, open products.js in your repository. Use Add file > Upload files to upload the downloaded products.js and commit the change (or replace the file using the GitHub editor).
6. Upload product photos separately into the images folder. Use paths such as images/product-01.jpg.
7. Your GitHub-connected static hosting should redeploy automatically after commit.

Important:
This is a static site. The dashboard is a local visual editor, not a private cloud admin system. Edits are not automatically shared with other devices or visitors until the exported products.js is committed to GitHub. Anyone who knows /admin.html can open the editor; do not enter confidential information there. A genuinely private dashboard with instant shared updates requires authentication and a database/backend.
The images folder is intentionally empty: insert your actual product photos. Placeholder designs use colourful graphic artwork until photos are uploaded.
