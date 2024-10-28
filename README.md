# courier-app-backend

Here's a `README.md` file for the Courier App, explaining its purpose, setup instructions, and usage. It also includes details on the structure, endpoints, and validation rules.

---

# Seller Registration API

This project provides an API for a seller registration system. It allows users to sign up, verify their phone number using OTP sent via WhatsApp (using Twilio), and store personal information, including their business details. The project follows an MVC structure and uses Mongoose for MongoDB data modeling, Joi for request validation, and JWT for authentication.

---

## Features

- **OTP-based Authentication**: Users verify their phone number via an OTP sent through WhatsApp using Twilio.
- **MVC Architecture**: Separation of concerns for better maintainability.
- **Unique Phone Number Validation**: Ensures each seller is unique by enforcing a unique constraint on phone numbers.
- **Error Handling**: Custom error messages and validation checks using Joi.
- **Automatic Timestamps**: Automatically adds `createdAt` and `updatedAt` timestamps for each seller document in MongoDB.

## Project Structure

```plaintext
.
├── app.js                  # App configuration and initialization
├── server.js               # Server startup
├── routes/
│   └── authRoutes.js       # Route definitions for authentication
├── controllers/
│   └── authController.js   # Controllers for OTP and seller info
├── services/
│   └── otpService.js       # Logic for generating and verifying OTP
│   └── sellerService.js    # Business logic for seller data management
├── models/
│   └── sellerModel.js      # Mongoose schema for Seller
├── middleware/
│   └── validateRequest.js  # Middleware for Joi validation
├── validators/
│   └── authValidator.js    # Joi schemas for request validation
├── config/
│   └── logger.js           # Logger setup (optional, using Winston)
├── .env                    # Environment variables
└── README.md               # Project documentation
```

---

## Prerequisites

1. **Node.js** and **npm** installed on your system.
2. A **MongoDB** instance (local or cloud).
3. A **Twilio** account with WhatsApp enabled.

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   PORT=3000
   DATABASE_URL=<Your MongoDB connection string>
   JWT_SECRET=<Your JWT secret key>
   TWILIO_ACCOUNT_SID=<Your Twilio Account SID>
   TWILIO_AUTH_TOKEN=<Your Twilio Auth Token>
   TWILIO_WHATSAPP_NUMBER=whatsapp:+<Your Twilio WhatsApp-enabled number>
   ```

4. Start the application:

   ```bash
   npm start
   ```

   The server will run at `http://localhost:3000` by default.

---

## API Endpoints

### 1. Request OTP

- **Endpoint**: `POST /api/auth/request-otp`
- **Description**: Sends an OTP to the provided phone number via WhatsApp for verification.
- **Request Body**:

  ```json
  {
    "phone": "+1234567890"
  }
  ```

- **Validation**:
  - `phone`: Must be in the format `+<country code><number>` and contain 10-15 digits.

### 2. Verify OTP

- **Endpoint**: `POST /api/auth/verify-otp`
- **Description**: Verifies the OTP sent to the user’s phone number.
- **Request Body**:

  ```json
  {
    "phone": "+1234567890",
    "otp": "1234"
  }
  ```

- **Validation**:
  - `phone`: Must be in international format.
  - `otp`: Must be a 4-digit number.

### 3. Save Seller Information

- **Endpoint**: `POST /api/auth/save-info`
- **Description**: Saves the seller's personal information, including their business details.
- **Request Body**:

  ```json
  {
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "businessName": "John's Bakery"
  }
  ```

- **Validation**:
  - `phone`: Must be unique, in the format `+<country code><number>`, with 10-15 digits.
  - `firstName`: Min 2 and max 50 characters; only letters and spaces allowed.
  - `lastName`: Min 2 and max 50 characters; only letters and spaces allowed.
  - `businessName`: Min 2 and max 100 characters; can contain letters, numbers, spaces, and limited special characters (`' - .`).

## Error Handling

- **Duplicate Phone Number**: If the phone number already exists, a `400` status with message `"Phone number already registered"` is returned.
- **Validation Errors**: All request validation errors (e.g., incorrect format, missing fields) return a `400` status with a descriptive error message.
- **Server Errors**: Unexpected server issues return a `500` status with a general error message.

## Technologies Used

- **Express**: Web framework for Node.js.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **Joi**: Schema validation for request data.
- **Twilio**: OTP delivery via WhatsApp.
- **JWT**: Token-based authentication for secure API access.
- **Winston** (Optional): Logging for error tracking and debugging.

---

## Example .env File

```plaintext
PORT=3000
DATABASE_URL=mongodb://localhost:27017/sellerdb
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

## Additional Notes

- **Security**: Store sensitive information, such as the JWT secret key and Twilio credentials, securely using environment variables.
- **Database Indexing**: The `phone` field in the `Seller` model is indexed as unique to ensure that each seller has a unique phone number.
- **Logging**: The project includes optional logging with Winston. Logs can be found in `logs/app.log` and `logs/error.log` if logging is enabled.
