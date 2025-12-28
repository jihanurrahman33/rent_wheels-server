# Rent Wheels Server 🚗

Backend API server for the Rent Wheels car rental platform, built with Node.js, Express, MongoDB, and Firebase Authentication.

## 🌟 Features

- **Firebase Authentication**: Secure JWT-based authentication using Firebase Admin SDK
- **Car Management**: CRUD operations for managing car listings
- **Booking System**: Book and cancel car rentals
- **User-Specific Operations**: View personal bookings and listings
- **MongoDB Integration**: Persistent data storage with MongoDB
- **CORS Enabled**: Cross-origin resource sharing support
- **Vercel Deployment**: Production-ready deployment configuration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB
- **Authentication**: Firebase Admin SDK
- **Environment Variables**: dotenv
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- MongoDB account and cluster
- Firebase project with Admin SDK credentials
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jihanurrahman33/rent_wheels-server.git
   cd rent_wheels-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. **Add Firebase credentials**
   
   Place your Firebase Admin SDK service account JSON file as `rentwheels-firebase-adminsdk.json` in the root directory.

5. **Start the server**
   ```bash
   node index.js
   ```

   The server will run on `http://localhost:3000`

## 🔐 Authentication

All protected routes require a Firebase JWT token in the Authorization header:

```
Authorization: Bearer <your_firebase_token>
```

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |
| GET | `/all-cars` | Get all available cars |
| GET | `/cars` | Get first 6 cars (limited) |

### Protected Endpoints (Require Authentication)

#### Car Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add-car` | Add a new car listing |
| DELETE | `/cars/:id` | Delete a car by ID |
| GET | `/car-details/:id` | Get detailed car information |

#### Booking Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/book?id=<car_id>` | Book a car (sets status to unavailable) |
| PATCH | `/removeBooking?id=<car_id>` | Cancel a booking (sets status to available) |
| GET | `/my-bookings?email=<user_email>` | Get user's booked cars |

#### User Listings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/my-listing?email=<user_email>` | Get cars listed by the user |

## 📦 Request/Response Examples

### Add a Car
**Request:**
```json
POST /add-car
Headers: {
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
Body: {
  "carModel": "Toyota Camry",
  "dailyRentalPrice": 50,
  "availability": "available",
  "registrationNumber": "ABC-1234",
  "features": ["GPS", "Air Conditioning"],
  "providerEmail": "owner@example.com",
  "carStatus": "available",
  "bookedBy": "none"
}
```

### Book a Car
**Request:**
```json
PATCH /book?id=<car_id>
Headers: {
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "matchedCount": 1
}
```

## 🗄️ Database Schema

### Cars Collection
```javascript
{
  _id: ObjectId,
  carModel: String,
  dailyRentalPrice: Number,
  availability: String,
  registrationNumber: String,
  features: Array,
  providerEmail: String,
  carStatus: String, // "available" | "unavailable"
  bookedBy: String   // User email or "none"
}
```

## 🔒 Security Features

- Firebase JWT token verification middleware
- Email validation for user-specific operations
- Protected routes for sensitive operations
- CORS configuration for cross-origin requests

## 🌐 Deployment

This project is configured for Vercel deployment:

```bash
vercel deploy
```

The `vercel.json` configuration handles routing and serverless function setup automatically.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 3000) | No |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**jihanurrahman33**

- GitHub: [@jihanurrahman33](https://github.com/jihanurrahman33)

## 🐛 Issues

If you encounter any issues or have suggestions, please file an issue on the [GitHub repository](https://github.com/jihanurrahman33/rent_wheels-server/issues).

---

Made with ❤️ for the Rent Wheels platform