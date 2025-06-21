
# TapTalk - A Modern Social Media Platform

A beautiful, full-stack social media application built with Next.js, featuring user authentication, post creation, and engaging interactions.

## 🚀 Features

- **Authentication**: Secure sign-up/sign-in with Clerk
- **User Profiles**: Customizable profiles with avatars and bios
- **Post Creation**: Share text posts with optional images
- **Global Feed**: View all posts in chronological order
- **Clap System**: Medium-style appreciation system
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Seamless user experience with optimistic updates

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Clerk** for authentication

### Backend
- **Next.js API Routes**
- **Prisma** ORM
- **Supabase** (PostgreSQL)
- **Cloudinary** for image uploads

## 📱 Pages

- **Landing Page**: Beautiful hero section with feature highlights
- **Feed**: Global post feed with create post functionality
- **Profile**: User profile management and statistics

## 🎨 Design Features

- Modern gradient backgrounds
- Glass morphism effects
- Smooth hover animations
- Responsive mobile-first design
- Beautiful typography and spacing

## 📊 Database Schema

### Users Table
- User profiles with Clerk integration
- Name, email, bio, profile picture
- Post count and clap statistics

### Posts Table
- Text content and optional images
- Clap count tracking
- User relationship and timestamps

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd microsocial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database
   DATABASE_URL=your_supabase_database_url

   # Cloudinary (for image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🚀 Deployment

This app is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

## 🎯 Key Features Implemented

### Authentication Flow
- Seamless Clerk integration
- Protected routes and middleware
- Automatic user creation in database

### Post Management
- Rich text post creation
- Image upload with Cloudinary
- Optimistic UI updates
- Real-time clap reactions

### User Experience
- Beautiful loading states
- Smooth animations
- Mobile-responsive design
- Intuitive navigation

## 📈 Future Enhancements

- [ ] Comment system
- [ ] User following/followers
- [ ] Post search and filtering
- [ ] Push notifications
- [ ] Direct messaging
- [ ] Content moderation tools

## 🔒 Security Features

- Clerk authentication middleware
- API route protection
- Input validation and sanitization
- Secure database queries with Prisma

## 📱 Mobile Experience

- Fully responsive design
- Touch-friendly interactions
- Optimized for mobile performance
- Progressive Web App capabilities

## 🎨 UI/UX Highlights

- Modern glassmorphism design
- Smooth Framer Motion animations
- Intuitive user interactions
- Beautiful gradient backgrounds
- Consistent design system

Built with ❤️ for modern web development
