# API_Devs

This is a backend API for a Task Management System that enables users to manage their tasks seamlessly. Users can perform all CRUD (Create, Read, Update, Delete) operations on tasks. The API is designed with scalability and security in mind, featuring robust authentication and authorization to ensure that only authorized users can access or modify their tasks. Additionally, it includes features such as pagination, allowing tasks to be delivered in manageable chunks for improved performance and usability.

### Prerequisites
Ensure you have the following installed:

- Node.js 
- MongoDB or a cloud MongoDB URI
- Git (optional, for cloning)

### Setup Instructions
1. **Clone the repository and navigate into :**

```sh
git clone <repository-url>
cd <project-folder>
```
2. **Install Dependencies:**
```sh
npm install
```
3. **Configure Environment Variables:**

- Create a .env file in the root of your project.
- Add the required environment variables:

```sh
env

PORT=3000
DB_URI=mongodb://localhost:27017/project
JWT_SECRET=your-secret-key
```
### Running the API
1. **Start the Development Server**

```sh
node app.js
or
use nodemon
```

2. ### Test the API

- Open a tool like Postman or thunderclient etc. and navigate to:

```sh
http://localhost:3000/
You should see a response confirming the server is running.
```
### Authentication and Protected Routes
1. ## Obtain a JWT Token
1. **Login Endpoint: POST /auth/login**
1. **Example Request Body:**
```sh
json

{
    "email": "user@example.com",
    "password": "your-password"
}
```
3. **Response:**
```sh
json

{
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```
2. **Access Protected Routes**
- Include the JWT token in the Authorization header of your requests:


Authorization: Bearer <your-token>
- Example: Protected Route Request (GET /api/protected)

```sh
Copy code
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..." http://localhost:3000/api/protected
```
**Response:**

**On success:**
```sh
json

{
    "message": "Access granted",
    "data": [...]
}
```
**On failure:**
```sh
json

{
    "error": "Unauthorized"
}
```
