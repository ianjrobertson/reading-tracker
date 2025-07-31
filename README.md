# 📖 Reading Tracker App

A modern, responsive web application for tracking your reading sessions and competing with other readers. Built with Next.js, Supabase, and Tailwind CSS.

![Reading Tracker App](https://img.shields.io/badge/Next.js-19-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📊 Reading Session Tracking
- **Add Reading Sessions**: Log your reading progress with pages read and time spent
- **Session History**: View all your past reading sessions with detailed statistics
- **Progress Analytics**: Track total pages, minutes, and session averages
- **Personal Dashboard**: See your reading statistics at a glance

### 🏆 Competitive Features
- **Leaderboard**: Compare your reading progress with other users
- **Rankings**: See where you stand among all readers
- **Public Stats**: View other users' reading achievements

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable reading
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Real-time Updates**: Instant feedback when adding sessions

### 🔐 Authentication & Security
- **User Authentication**: Secure login and registration system
- **Protected Routes**: Personal data is only accessible to authenticated users
- **Supabase Integration**: Robust backend with real-time capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reading-tracker.git
   cd reading-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase Database**
   
   In your Supabase dashboard, create the following tables:

   **users table** (auto-created by Supabase Auth)
   
   **reading_sessions table**:
   ```sql
   CREATE TABLE reading_sessions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     pages_read INTEGER NOT NULL,
     minutes_spent INTEGER NOT NULL,
     session_date DATE DEFAULT CURRENT_DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **leaderboard_view** (for the leaderboard feature):
   ```sql
   CREATE VIEW leaderboard_view AS
   SELECT 
     user_id,
     u.email,
     SUM(pages_read) as total_pages,
     SUM(minutes_spent) as total_minutes,
     COUNT(*) as total_sessions,
     AVG(pages_read) as avg_pages_per_session,
     AVG(minutes_spent) as avg_minutes_per_session,
     MAX(session_date) as last_session_date
   FROM reading_sessions rs
   JOIN auth.users u ON rs.user_id = u.id
   GROUP BY user_id, u.email;
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Adding Reading Sessions
1. Navigate to "Add Session" in the sidebar
2. Enter the number of pages you read
3. Enter the time spent reading (in minutes)
4. Click "Add Session" to save

### Viewing Your Stats
1. Go to "My Stats" to see your reading history
2. View total pages, minutes, and session averages
3. Browse through your past reading sessions

### Checking the Leaderboard
1. Visit the "Leaderboard" page
2. See how you rank against other readers
3. View total pages, minutes, and sessions for all users

## 🛠️ Technology Stack

- **Frontend**: Next.js 19, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel-ready
- **Icons**: Lucide React
- **Theme**: Next-themes for dark/light mode

## 📁 Project Structure

```
reading-tracker/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   ├── protected/                # Protected routes
│   │   ├── add-session/         # Add reading sessions
│   │   ├── sessions/            # View reading history
│   │   └── leaderboard/         # Leaderboard feature
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── ui/                      # UI components (buttons, inputs, etc.)
│   ├── auth-button.tsx          # Authentication component
│   ├── sidebar.tsx              # Navigation sidebar
│   └── theme-switcher.tsx       # Theme toggle
├── lib/                         # Utility libraries
│   ├── supabase/                # Supabase client configuration
│   └── utils.ts                 # Utility functions
└── middleware.ts                # Next.js middleware
```

## 🎨 Features in Detail

### Mobile-Responsive Design
- **Card-based Layout**: Each user's stats are displayed in individual cards
- **Responsive Grid**: Stats adapt from 2 columns on mobile to 4 on desktop
- **Touch-Friendly**: Optimized for mobile interaction
- **Collapsible Sidebar**: Mobile navigation with overlay

### Dark Mode Support
- **Theme Toggle**: Switch between light and dark modes
- **Persistent Preference**: Theme choice is saved across sessions
- **Consistent Styling**: All components support both themes

### Real-time Updates
- **Instant Feedback**: Sessions appear immediately after adding
- **Live Leaderboard**: Updates reflect new reading sessions
- **Optimistic UI**: Interface responds instantly to user actions

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Tailwind CSS** for styling

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ian Robertson**
- GitHub: [@ianjrobertson](https://github.com/ianjrobertson)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Happy Reading! 📚**

Made with ❤️ for the reading community.
