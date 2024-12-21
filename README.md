# Skate Board Shop

## Description
This application is a virtual marketplace designed to simulate a dynamic online store for skateboarding equipment. Built using Node.js, Express.js, and MongoDB, "Skate Board Shop" showcases robust backend functionalities with a clean, intuitive frontend.

### Key Features

- **User Authentication**: Secure login and registration functionality using bcryptjs for password hashing.
- **Data Validation**: Comprehensive input validation across forms to ensure data integrity using express-validator.
- **User Profiles and Interactions**:
  - **Product Listings and Sales**: Users can create listings for skateboards with detailed attributes such as title, condition, price, and an image. Each listing is comprehensive, ensuring buyers have all necessary information to make informed decisions.
  - **Offers and Negotiations**: Supports a dynamic offer system where buyers can place offers on skateboards. Each offer is tracked for status (pending, rejected, accepted), enabling users to negotiate prices effectively.
  - **Security Features**: Robust user authentication with bcryptjs used for secure password hashing.
  - **Data Integrity and Operations**: Mongoose schemas enforce data integrity and structure, including required fields and data types. Custom middleware handles clean-up operations, like removing related offers when a board is deleted.
- **Product Management**: Users can add, edit, and remove products, systematically enhancing the application's capabilities.

## Technological Stack

- **Frontend**: EJS for templating.
- **Backend**: Node.js and Express.js.
- **Database**: MongoDB with Mongoose for data modeling.
- **Middleware**: Method-override for HTTP verb support, morgan for logging, and multer for file uploads.

## Challenges Overcome

- Implementing custom middleware for user authentication and route protection.
- Designing and maintaining a consistent and scalable database schema with Mongoose.

## Installation Instructions

1. Download and unzip `SeckerDrewProject5`.
2. Navigate to the directory in your IDE.
3. Open a terminal in this directory and run: `npm i` to install all dependencies.
4. Execute: `node app.js` to start the server and access the application through `localhost:3000` in your browser.

## Additional Notes

- Ensure MongoDB is running on your machine to connect to the database.
- Configure your environment variables in a `.env` file for database URI, session secrets, etc.
