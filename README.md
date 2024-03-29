# **ECE5010-Project**
*Group 14's project for ECE-5010 Software Design.*

 **[Follow the instructions here](./Setup.md)** for setup and usage of Scaled.


## _*Final Use Cases*_

Below is a summary of each use case implemented in the final submission. These use cases are fully functional and exceed the initial expectations set out in the group's project proposal.

- User sign up
  - Users can create an account from the signup page by inputting their desired username and password (and confirming their password) and pressing the Sign Up button. They will then be directed to the Login page
- User log in
  - Users can access the website by logging in with an existing account through the Login page by typing in their user credentials and pressing the Log In button
- Search albums using Spotify API
  - From the Home page, users can search for albums or artists that they would like to review by typing their query in the search bar and pressing the Search button
  - Buttons are provided to allow the user to specify if they would like to search for an album or artist
- Search Results page
  - Based on an album search parameter, users can search for albums in the Spotify API that they would like to review.
  - If the album they are looking for does not show up in the first 20 results, the user can click the Next Page button to get the next 20 results from the Spotify API
  - The Search Results page for albums contains the album art, artist(s) credited for corresponding albums and the title of the albums (for each album returned by the search query)
  - The Search Results page for artists contains the artists image used on Spotify and the artist's name
  - Clicking on any of these search results will bring the user to that album/artist's corresponding page
- Album page
  - On this page, users can leave a rating and a review for the selected album using a slider between 0 and 10 as well as a text box
  - The user's review and rating for each album is stored in the database along with the Album ID and the user's UUID 
  - If the user updates their review, the database will reflect the user's changes and the user's review will be updated on this page.
  - Users can also view reviews and ratings from other users for the selected album
- User profile page (Including recents and favourites)
  - Each user's Profile page contains the user's top 4 most recent top-rated albums and the user's 4 most recent top-rated artists.
  - As well, the user's profile page displays the user's username and selected profile picture, with the ability to change and select a profile picture.
- View all reviewed items (Collection page)
  - this page contains all albums and artists rated by the user. The results of this page are sorted from most recent to least recent. The user can click on the album art to view the album or artist and the associated ratings.
- Activity feed
  - Located on the homepage, displays recent ratings from other Scaled users. Presents the user's name, profile picture and rating of the album/artist. The user can also see the associated review by using the "View Review" button. Displays these reviews from most to least recent.
- Artist Page
  - On this page, users can leave a rating and a review for the selected artist using a slider between 0 and 10 as well as a text box
  - The user's review and rating for each artist is stored in the database along with the Artist's ID and the user's UUID 
  - If the user updates their review, the database will reflect the user's changes, and the user's review will be updated on this page.
  - Users can also view reviews and ratings from other users for the selected artist
  - The page displays artist stats such as Spotify followers, average rating, number of ratings and genres.
  - A Spotify button is shown that takes the user to the artist's Spotify page when pressed

  
## _*Tool Documentation*_
### **Frontend**
The frontend utilizes several frameworks and libraries for routing, styling and prebuilt components
- Next.js
  - React-based javascript frontend framework for convenient routing and built-in functionality
  - https://nextjs.org/
- Tailwind CSS
  - Tool for convenient in-line CSS styling of HTML elements
  - https://tailwindcss.com/
- Chakra UI
  - Prebuilt UI components for fast and effective frontend development
  - https://chakra-ui.com/docs/components 
- Formik
  - Provides elements for frontend input form control and validation
  - https://formik.org/ 
- Headless UI
  - Prebuilt UI components from Tailwind that are easily customizable
  - https://headlessui.com/
### **Backend**
the backend utilizes multiple frameworks and libraries to provide data and functionality to the application's front end.
- Node.js and Express.js
  - The main framework that is used in this project to provide routes for data to the front end of the application 
  - https://nodejs.org/
  - https://expressjs.com/
- Axios
  -  Used to make HTTP requests to the Spotify API so Scaled can get data from Spotify's servers
  -  https://axios-http.com/docs/intro
- bcrypt
  - Enables secure hashing of the passwords entered by the user before sending them to the database for storage
  - https://www.npmjs.com/package/bcrypt
- jsonwebtoken (jwt)
  - Used to compare the entered password against the encrypted password stored in the database
  - https://www.npmjs.com/package/jsonwebtoken
- knex
  - Used to manage the database. Provides methods and functions to create SQL calls to the database as well as create and manage tables and seed data in the database
  - https://knexjs.org/
- sqlite3
  - a lightweight database framework that saves the database as a file in the repository instead of hosting the database on a separate server
  - https://sqlite.org/index.html
- uuid
  - used to generate a UUID (Unique User ID) for each user entered into the database. The UUID is stored in the database as a string as well as the username of the user for user validation purposes.
  - https://www.npmjs.com/package/uuid