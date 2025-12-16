# 🐦 Twitter Clone - PERN Stack

A full-featured Twitter clone built with **PostgreSQL/SQLite**, **Express.js**, **React**, and **Node.js**. Features real-time interactions, user authentication, profile picture uploads, and a modern responsive design.

🔗 **Live Demo**: [GitHub Repository](https://github.com/Abhilash9089/Twitter-Clone)

![Twitter Clone](https://img.shields.io/badge/Twitter-Clone-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)
![PERN Stack](https://img.shields.io/badge/PERN-Stack-61DAFB?style=for-the-badge&logo=react&logoColor=black)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Secure password hashing with bcrypt
- Protected routes and middleware

### � eTweet Management
- Create, read, and delete tweets (280 character limit)
- Real-time tweet composer with character counter
- Tweet threading and replies support

### 💖 Social Interactions
- Like and unlike tweets with real-time updates
- Follow and unfollow users
- User discovery and suggestions

### 👤 Profile Management
- **Profile picture upload** with image preview
- Customizable user profiles (bio, location, website)
- Edit profile modal with real-time updates
- User statistics (followers, following, tweets count)

### 🔍 Discovery & Search
- **Enhanced Explore page** with trending topics
- Search tweets by content
- Search users by name or username
- Popular tweets section

### 🎨 User Experience
- Responsive design for mobile and desktop
- Modern Twitter-like UI with dark theme
- Real-time updates across the application
- Loading states and error handling
- Smooth animations and transitions

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd twitter-clone-pern
```

2. **Install backend dependencies:**
```bash
npm install
```

3. **Install frontend dependencies:**
```bash
cd client
npm install
cd ..
```

4. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=twitter_clone
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
```

5. **Set up the database:**
```bash
# Create PostgreSQL database
createdb twitter_clone

# Initialize database with sample data
node init-db.js
```

6. **Start the development servers:**
```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

7. **Access the application:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 🔑 Sample Login Credentials

After running the database initialization script, you can login with any of these accounts:

| Username | Password | Role |
|----------|----------|------|
| `john_doe` | `password123` | Software Developer |
| `jane_smith` | `password123` | Designer |
| `alex_dev` | `password123` | Full-stack Developer |
| `sarah_ui` | `password123` | UI/UX Designer |
| `mike_tech` | `password123` | Tech Entrepreneur |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Tweets
- `GET /api/tweets` - Get all tweets (timeline)
- `POST /api/tweets` - Create a new tweet
- `GET /api/tweets/:id` - Get tweet by ID
- `DELETE /api/tweets/:id` - Delete a tweet
- `GET /api/tweets/search?q=query` - Search tweets

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/me` - Update current user profile
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user
- `GET /api/users/search?q=query` - Search users

### Likes
- `POST /api/likes/:tweetId` - Like a tweet
- `DELETE /api/likes/:tweetId` - Unlike a tweet

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread notifications count
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read
- `PUT /api/notifications/:id/read` - Mark notification as read

## 📸 Screenshots

### Home Timeline
- Clean, Twitter-like interface
- Real-time tweet updates
- Interactive like and retweet buttons

### Profile Management
- Profile picture upload functionality
- Editable user information
- Follow/unfollow capabilities

### Explore Page
- Trending topics section
- Tweet and user search
- Popular content discovery

### Responsive Design
- Mobile-friendly interface
- Adaptive layout for all screen sizes


## 🚀 Deployment

### Quick Deploy Options

#### Option 1: Local Development
```bash
git clone https://github.com/Abhilash9089/Twitter-Clone.git
cd Twitter-Clone
npm run setup
npm run init-db
npm run dev
```

#### Option 2: Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_very_secure_jwt_secret_change_this_in_production
JWT_EXPIRE=7d
```

### Deployment Platforms
- **Heroku**: Ready for Heroku deployment
- **Vercel**: Frontend can be deployed to Vercel
- **Railway**: Full-stack deployment option
- **DigitalOcean**: VPS deployment ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Twitter's user interface and functionality
- Built with modern web development best practices
- Uses industry-standard security measures
- Special thanks to the open-source community

---

⭐ **Star this repository if you found it helpful!**

📧 **Contact**: [Your Email](mailto:your.email@example.com)
🐦 **Twitter**: [@YourHandle](https://twitter.com/yourhandle)
