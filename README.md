<p align="center">
  <img src="client/public/logo.png" alt="SHARP GPT Logo" width="80" />
</p>

<h1 align="center">SHARP GPT</h1>

<p align="center">
  <strong>A Full-Stack AI-Powered Chat Application with Text & Image Generation</strong>
</p>

<p align="center">
  <a href="https://sharp-gpt-arshit.vercel.app">🌐 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠️ Tech Stack</a> •
  <a href="#getting-started">🚀 Getting Started</a> •
  <a href="#api-reference">📡 API Reference</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📖 Overview

**SHARP GPT** is a modern, full-stack AI chat application that allows users to generate both **text responses** and **AI-generated images** through an intuitive conversational interface. Built with a React frontend and a Node.js/Express backend, it integrates Google's **Gemini 3 Flash** model for intelligent text generation and **ImageKit AI** for stunning image generation — all wrapped in a sleek, dark-mode-enabled UI.

Users can manage conversations, search through chat history, purchase credits via **Stripe** payments, share AI-generated images with the community, and toggle between light/dark themes — all deployed seamlessly on **Vercel**.

---

## ✨ Features

### 🤖 AI Chat
- **Text Generation** — Powered by Google Gemini 3 Flash model via the `@google/genai` SDK
- **Image Generation** — AI image generation using ImageKit's prompt-based generation engine
- **Markdown Rendering** — Rich text responses with full Markdown & syntax highlighting (PrismJS)
- **Dual Mode Input** — Toggle between Text and Image generation modes from the chat input

### 💬 Conversation Management
- **Multiple Chats** — Create, switch between, and manage multiple chat sessions
- **Chat History** — Full message persistence with timestamps
- **Search Conversations** — Real-time search across all chat conversations
- **Delete Chats** — Remove individual conversations with confirmation

### 🖼️ Community Gallery
- **Publish to Community** — Option to share AI-generated images publicly
- **Community Images Page** — Browse all published images with creator attribution
- **Full-Size Preview** — Click to view images in full resolution

### 💳 Credit System & Payments
- **Credit-Based Usage** — Text generation costs 1 credit, image generation costs 2 credits
- **20 Free Credits** — New users start with 20 free credits on registration
- **Stripe Integration** — Secure payment processing with three subscription plans:
  | Plan | Price (₹) | Credits | Highlights |
  |------|-----------|---------|------------|
  | **Basic** | ₹900 | 100 | 100 text / 50 image generations |
  | **Pro** | ₹1,800 | 500 | 500 text / 200 image generations, Priority support |
  | **Premium** | ₹2,700 | 1,000 | 1000 text / 500 image generations, VIP support |
- **Webhook Verification** — Stripe webhooks for secure payment confirmation

### 🎨 UI/UX
- **Dark / Light Mode** — Persistent theme toggle with smooth transitions
- **Responsive Design** — Fully mobile-friendly with collapsible sidebar
- **Glassmorphism UI** — Modern backdrop-blur effects and gradient backgrounds
- **Loading Animations** — Smooth loading states and bounce animations
- **Toast Notifications** — Real-time feedback with react-hot-toast

### 🔐 Authentication
- **JWT Authentication** — Secure token-based auth with 30-day expiry
- **Password Hashing** — bcrypt-based password hashing with salt rounds
- **Protected Routes** — Middleware-based route protection

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **React Router DOM 7** | Client-side routing |
| **Axios** | HTTP client |
| **React Markdown** | Markdown rendering |
| **PrismJS** | Code syntax highlighting |
| **Moment.js** | Date/time formatting |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | Web framework |
| **MongoDB + Mongoose 9** | Database & ODM |
| **@google/genai** | Google Gemini AI SDK |
| **ImageKit** | AI image generation & CDN |
| **Stripe** | Payment processing |
| **JSON Web Token** | Authentication |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin resource sharing |

### Deployment
| Service | Usage |
|---|---|
| **Vercel** | Frontend & Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **ImageKit CDN** | Image storage & delivery |

---

## 📁 Project Structure

```
SHARP_GPT/
├── client/                        # Frontend (React + Vite)
│   ├── public/                    # Static assets (logo, favicon)
│   ├── src/
│   │   ├── assets/                # Images, icons, dummy data, Prism theme
│   │   ├── components/
│   │   │   ├── Chatbox.jsx        # Main chat interface with input & messages
│   │   │   ├── Message.jsx        # Individual message (text/image) renderer
│   │   │   └── Sidebar.jsx        # Navigation, chat list, search, settings
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Global state (auth, chats, theme, API)
│   │   ├── pages/
│   │   │   ├── Community.jsx      # Community image gallery
│   │   │   ├── Credits.jsx        # Credit plans & purchase page
│   │   │   ├── Loading.jsx        # Loading/redirect screen
│   │   │   └── Login.jsx          # Login & registration form
│   │   ├── App.jsx                # Root component with routing
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── vercel.json                # Vercel SPA rewrites config
│   ├── vite.config.js             # Vite configuration
│   └── package.json
│
├── server/                        # Backend (Express + Node.js)
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── gemini.js              # Google Gemini AI SDK config
│   │   ├── imagekit.js            # ImageKit SDK config
│   │   └── openai.js              # OpenAI compatibility config (legacy)
│   ├── controllers/
│   │   ├── chat.controller.js     # Chat CRUD operations
│   │   ├── message.controller.js  # Text & image generation logic
│   │   ├── transaction.controller.js  # Plans & Stripe checkout
│   │   ├── user.controller.js     # Auth & user data
│   │   └── webhooks.js            # Stripe webhook handler
│   ├── middlewares/
│   │   └── auth.js                # JWT authentication middleware
│   ├── models/
│   │   ├── Chat.js                # Chat schema (messages, user, timestamps)
│   │   ├── Transaction.js         # Transaction schema (plan, amount, status)
│   │   └── User.js                # User schema (auth, credits)
│   ├── routes/
│   │   ├── chat.routes.js         # /api/chat routes
│   │   ├── message.routes.js      # /api/message routes
│   │   ├── transaction.routes.js  # /api/transaction routes
│   │   └── user.routes.js         # /api/user routes
│   ├── server.js                  # Express app entry point
│   ├── vercel.json                # Vercel serverless config
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (or local MongoDB)
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)
- **ImageKit Account** — [Sign up](https://imagekit.io/)
- **Stripe Account** — [Sign up](https://stripe.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/arshitgajera24/SHARP_GPT.git
cd SHARP_GPT
```

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=2505
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Stripe
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Start the server:

```bash
npm run dev
```

> Server runs at `http://localhost:2505`

### 3. Client Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:2505
```

Start the client:

```bash
npm run dev
```

> Client runs at `http://localhost:5173`

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/user/register` | Register a new user | ❌ |
| `POST` | `/api/user/login` | Login & get JWT token | ❌ |
| `GET` | `/api/user/data` | Get authenticated user data | ✅ |
| `GET` | `/api/user/published-images` | Get community images | ❌ |

### Chat
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/chat/create` | Create a new chat | ✅ |
| `GET` | `/api/chat/get` | Get all user chats | ✅ |
| `POST` | `/api/chat/delete` | Delete a chat | ✅ |

### Messages
| Method | Endpoint | Description | Auth | Credits |
|--------|----------|-------------|------|---------|
| `POST` | `/api/message/text` | Generate text response | ✅ | 1 |
| `POST` | `/api/message/image` | Generate image response | ✅ | 2 |

### Transactions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/transaction/plans` | Get available credit plans | ✅ |
| `POST` | `/api/transaction/purchase` | Initiate Stripe checkout | ✅ |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/stripe` | Stripe payment webhook |

---

## 🌐 Deployment

The application is deployed on **Vercel** as two separate projects:

| Component | URL |
|---|---|
| **Frontend** | [https://sharp-gpt-arshit.vercel.app](https://sharp-gpt-arshit.vercel.app) |
| **Backend** | Deployed as a separate Vercel serverless project |

### Deploy Your Own

1. **Fork** the repository
2. **Import** both `client/` and `server/` as separate projects in [Vercel](https://vercel.com)
3. Add the respective **environment variables** in each project's Vercel settings
4. Set up the **Stripe webhook** endpoint pointing to your deployed backend URL + `/api/stripe`

---

## 🔐 Environment Variables

### Server (`server/.env`)
| Variable | Description |
|----------|------------|
| `PORT` | Server port (default: 2505) |
| `FRONTEND_URL` | Frontend URL for CORS |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GEMINI_API_KEY` | Google Gemini API key |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### Client (`client/.env`)
| Variable | Description |
|----------|------------|
| `VITE_BACKEND_URL` | Backend API URL |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Arshit Gajera**

- GitHub: [@arshitgajera24](https://github.com/arshitgajera24)

---

<p align="center">
  <strong>⭐ If you found this project useful, please give it a star! ⭐</strong>
</p>
