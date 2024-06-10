<img src = "https://github.com/mfacecchia/OrtoPlan/assets/86726458/4a83f60c-361e-45b3-8228-721ee043b1be" alt = "OrtoPlan Logo">
<h1 align = "center">OrtoPlan</h1>
<p align = "center">Simple yer useful app to manage plants' care with treatments planning & weather notifications functionalities</p>

<h2>Table of contents</h2>
<a href = "#built-in">Built in - Technologies</a><br>
<a href = "#modules-references">Modules References</a><br>
<a href = "#installing-dependencies">Installing Dependencies</a><br>
<a href = "#environmental-variables">Environmental Variables</a><br>
<a href = "#db-er">Database Entity Relationship model</a><br>
<a href = "#app-routes">App Routes</a><br>
<a href = "#hashing-methods">Hashing methods</a><br>
<a href = "#functionalities-roadmap">Functionalities roadmap</a><br>
<hr>

<h2 id = "built-in">Built in - Technologies</h2>
<img src = "https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt = "HTML">
<img src = "https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt = "CSS">
<img src = "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt = "JavaScript">
<br>
<img src = "https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt = "Node.js">
<img src = "https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" alt = "Express.js">
<br>
<img src = "https://img.shields.io/badge/postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt = "PostCSS">
<img src = "https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt = "TailwindCSS">
<img src = "https://img.shields.io/badge/daisyUI-1ad1a5?style=for-the-badge&logo=daisyui&logoColor=white" alt = "DaisyUI">
<br>
<img src = "https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt = "MySQL">
<img src = "https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt = "Prisma ORM">
<hr>

<h2 id = "modules-references">Technologies References</h2>
<h4>Core Functionalities</h4>
<a href = "https://expressjs.com/en/4x/api.html#express">Express.JS</a> |
<a href = "https://www.npmjs.com/package/cors">CORS</a> |
<a href = "https://ejs.co/">EJS</a> |
<a href = "https://momentjs.com/docs/">Moment.JS</a> |
<a href = "https://postcss.org/">PostCSS</a> |
<a href = "https://tailwindcss.com/docs/installation">Tailwind CSS</a> |
<a href = "https://daisyui.com/">DaisyUI</a> |
<a href = "https://www.prisma.io/docs/getting-started/quickstart">Prisma ORM</a>
<h4>Hashing & security</h4>
<a href = "https://www.npmjs.com/package/argon2">Argon2</a>
<h4>Login Methods</h4>
<a href = "https://www.npmjs.com/package/jsonwebtoken">JWT</a>
<hr>

<h2 id = "installing-dependencies">Installing App Dependencies</h2>
<p>To quickly install all modules used in this project, just run <code>npm install</code> in your terminal and you'll be good to go!</p>
<b>DISCLAIMER: in order to correctly execute this command you will need to install <a href = "https://nodejs.org/en/download/package-manager">Node.JS</a> in your system since it's the main requirement to run the app.</b>
<hr>

<h2 id = "environmental-variables">Environmental Variables</h2>
<p>All the application's related variables such as the DB connection credentials and the JWT Secret are securely stored in the virtual environment (not included in this repository for security purposes since personal data is used).</p>
<p>Below a list and explanation of all the used virtual environment's variables.</p>
<table>
  <tr>
    <th>Variable Name</th>
    <th>Usage</th>
  </tr>
  <tr>
    <td><code>PORT</code></td>
    <td>Express.JS Backend application port.</td>
  </tr>
  <tr>
    <td><code>RAPIDAPI_KEY</code></td>
    <td>RapidAPI Key (used to compile the DB with some sample plants from <a href = "https://rapidapi.com/mnai01/api/house-plants2">HousePlants API</a>)</td>
  </tr>
  <tr>
    <td><code>UNSPLASHAPI_KEY</code></td>
    <td>Unsplash API ClientID (used to get some stock images for plants and plantations). Documentation for this api <a href = "https://unsplash.com/documentation">here</a></td>
  </tr>
  <tr>
    <td><code>JWT_SECRET</code></td>
    <td>Json Web Token's secret used to sign and validate each token received from HTTP requests</td>
  </tr>
  <tr>
    <td><code>DATABASE_URL</code></td>
    <td>URL to connect to database. with Prisma ORM</td>
  </tr>
</table>
<b>NOTE:</b> <span>For this project the database is locally hosted so the environmental value for <code>DATABASE_URL</code> will be something like this: <code>mysql://root@localhost:3306/OrtoPlan</code>.</span>
<hr>

<h2 id = "db-er">Database Entity Relationship model</h2>
<img src = "https://github.com/mfacecchia/OrtoPlan/assets/86726458/3b4d16ae-0810-4002-9358-8b17979819e1" alt = "DB E-R Model">
<p>If you want to test this project yourself, you can compile the <code>Plant</code> and <code>Location</code> tables by just running <code>npm run setupDB</code> and wait for completion.</p>
<b>DISCLAIMER: in order for this to work you have to first set the <code>RAPIDAPI_KEY</code> as well as the <code>UNSPLASHAPI_KEY</code> API Keys since all data obtained comes from external sources.</b>
<hr>

<h2 id = "app-routes">App Routes</h2>
<p>All the main routes for this application start with <code>/api/</code> and are mainly used to retrieve, add, and update values from/to the Database.</p>
<p>The routes responsible for user authentications are <code>/user/login</code>, and <code>/user/signup</code>. Both routes return the final user, obtained from Database Read (in case of login) or new user creation (in case of signup).</p>
<p>To enhance security, all routes starting with <code>/api/</code> require the user to be authenticated; such validation is made by verifying the Bearer Token sent along with the request in the header. If it's not valid or it's valid but the user does not exist anymore, the server returns a <code>401 Unhauthorized</code> status code and the user needs to re-authenticate again with a valid JWT before making any request.</p>
<p>Such token validation is made through the <code>isLoggedIn</code> Middleware, which:
    <ul>
        <li>Checks if the Bearer token is in the <code>req.header</code></li>
        <li>Decodes it and gets the <code>userID</code> field from the Token's Payload</li>
        <li>Makes a <code>findUniqueOrThrow</code> query to the database and checks if the <code>Prisma Promise</code> Resolves or Rejects to consequently return a <code>200 OK</code> status code if it still exists or a <code>402 Unhauthorized</code> in case the Promise Rejects</li>
    </ul>
</p>
<hr>

<h2 id = "hashing-methods">Hashing methods</h2>
<p>All user-related sensitive data such as passwords are securely hashed and stored in the database using the <a href = "https://en.wikipedia.org/wiki/Argon2">Argon2id algorithm</a>. To manage and verify such data, <a href = "https://www.npmjs.com/package/argon2">argon2</a> module is being used, in particular the <code>argon2.hash()</code> and <code>argon2.verify()</code> functions with default memory cost, time complexity, and parallellism values.</p>
<hr>

<h2 id = "functionalities-roadmap">Functionalities Roadmap</h2>
<p>I aim to keep this repository updated for as long as possible, all the future updates, improvements and ideas are listed below:
  <ul>
    <li>Anti-CSRF Token</li>
    <li>Google/GitHub login functionality</li>
    <li>Password recovery functionality</li>
    <li>Plantations sharing and collaboration functionality</li>
    <li>Plant finder with <a href = "https://www.algolia.com/doc/">Algolia Search</a> API</li>
    <li>Plants creation functionality</li>
    <li>General styling improvements</li>
    <li>User deletion confirmation functionality improvement</li>
    <li>And more to come... 👀</li>
  </ul>
</p>