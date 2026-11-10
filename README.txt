DUCKY DAVINCI WEBSITE — QUICK SETUP

FILES
- index.html: website structure
- styles.css: colours, layout and responsive styling
- products.js: edit product names, descriptions, prices and image paths
- app.js: cart, language toggle, order form and WhatsApp number
- images/: put your product photos here

BEFORE PUBLISHING
1) Open app.js and the store WhatsApp number is already set to 201229101276.
   Use Egypt country code format without +, spaces, or leading zero. Example format: 2010xxxxxxx.
2) Open products.js and set each product price in EGP (number only, e.g. 450).
3) Put each product image in images/ using product-01.jpg through product-20.jpg.
   If an image is missing, a coloured placeholder appears.
4) Edit product names/descriptions in products.js.
5) Open index.html in a browser to preview.

ORDER FLOW
Customers add products to cart, enter contact and delivery details, then WhatsApp opens with the full order message. No online payment is collected.
Cart contents are stored in the visitor's browser. Orders are not saved to a central database; the customer must press Send in WhatsApp.

PUBLISH FREE
Recommended: Cloudflare Pages with Git integration.
- Create a free GitHub account and a new repository.
- Upload these files to the repository root.
- In Cloudflare Dashboard choose Workers & Pages > Create application > Pages > Connect to Git.
- Connect GitHub, choose the repository, leave build command empty, set output directory to / (or the repository root as prompted), then deploy.
- Cloudflare provides a free *.pages.dev address.

IMPORTANT
This is a static storefront. It does not have an admin dashboard or central order database. Product edits are made in products.js and images folder, then redeployed. For a visual product editor/admin panel later, a separate backend or CMS is needed.
