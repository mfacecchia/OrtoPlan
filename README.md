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
<hr>

<h2 id = "built-in">Built in - Technologies</h2>
<img src = "https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt = "HTML">
<img src = "https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
" alt = "CSS">
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