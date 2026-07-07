# Chat Word - Real-time Chat Application

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/supabase-ready-green.svg" alt="Supabase">
  <img src="https://img.shields.io/badge/tailwind-sky%20blue-38B2AC.svg" alt="Tailwind">
</p>

A modern, real-time chat application with beautiful sky blue theme, built with vanilla JavaScript and powered by Supabase for real-time database and authentication.

## ✨ Features

- 💬 **Real-time Chat** - Instant messaging with Supabase real-time subscriptions
- 🎨 **Beautiful UI** - Modern glassmorphism design with sky blue theme
- 🌙 **Dark Mode** - Switch between light and dark themes
- 🌍 **Multi-language** - Support for Myanmar and English
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔐 **User Authentication** - Secure login/signup with Supabase Auth
- 👥 **Online Status** - Real-time user presence tracking
- ⚡ **Fast Performance** - Optimized for speed

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- A Supabase account (free tier available)

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Copy your project URL and anon key from Settings > API

2. **Run Database Schema**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to create all tables and enable RLS

3. **Configure Environment**
   - Copy your Supabase URL and anon key
   - Update these values in `config/firebase-config.js`

### Installation

```bash
# Clone the repository
git clone https://github.com/amkyawdev/chat-word.app.git
cd chat-word.app

# Install dependencies
npm install

# Start the development server
npm run serve
```

### Vercel Deployment

1. **Push to GitHub** (already done)
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the static site

3. **Configure Environment Variables**
   - In Vercel Dashboard > Settings > Environment Variables
   - Add:
     - `SUPABASE_URL` = your Supabase project URL
     - `SUPABASE_ANON_KEY` = your Supabase anon key

4. **Deploy**
   - Click "Deploy" and your site will be live!

## 📁 Project Structure

```
chat-word/
├── index.html              # Loading animation page
├── pages/
│   ├── main.html           # Main chat interface
│   ├── dashboard.html      # Statistics dashboard
│   ├── profile.html        # User profile
│   ├── setting.html        # App settings
│   └── about.html          # About page
├── components/
│   ├── sidebar.js          # Navigation sidebar
│   ├── three.js            # 3D effects
│   ├── friends-list.js     # Online users
│   ├── public-chat.js      # Chat component
│   └── active-user.js      # Activity logs
├── css/
│   ├── style.css           # Main styles
│   ├── tailwind.css        # Tailwind imports
│   └── animations.css       # Custom animations
├── js/
│   ├── app.js              # Main app logic
│   ├── router.js           # Page routing
│   ├── api.js              # API handler
│   ├── utils.js            # Utilities
│   └── theme.js            # Theme manager
├── server/
│   ├── data.json           # App data
│   ├── history.json        # Chat history
│   └── user-logs.js        # Activity logging
├── languages/
│   ├── my.json             # Myanmar
│   └── eng.json            # English
├── config/
│   ├── app-config.js       # App config
│   └── firebase-config.js  # Supabase config
├── supabase-schema.sql     # Database schema
└── package.json
```

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel
- **Fonts**: Inter (Google Fonts)

## 📝 Supabase Database Schema

The application uses the following tables:

- `profiles` - User profiles (extends auth.users)
- `chats` - Chat rooms
- `messages` - Chat messages
- `friendships` - Friend relationships
- `user_settings` - User preferences
- `activity_logs` - Activity tracking

All tables have Row Level Security (RLS) enabled for data protection.

## 🎨 Customization

### Themes

The app supports multiple themes:
- Sky Blue (default) 🩵
- Pink 💗
- Green 💚
- Purple 💜
- Orange 🧡

### Languages

- Myanmar (မြန်မာစာ)
- English

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**Developer** - [amkyawdev](https://github.com/amkyawdev)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Vercel](https://vercel.com) - Hosting platform

---

<p align="center">
  Made with 💙 using Supabase & Vercel
</p>