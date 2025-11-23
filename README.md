# Onira - Portfolio & Anonymous Review Platform

Onira is a full-stack web application that allows users to create portfolio-style profiles and receive anonymous reviews that they can moderate and share.

## Features

### For Profile Owners
- **Create Portfolio Profiles**: Set up a beautiful portfolio for your business or personal brand (e.g., bakery, cafe, freelancer)
- **Receive Anonymous Reviews**: Anyone can leave reviews without creating an account
- **Review Moderation**: View all reviews and choose which ones to publish publicly
- **Instagram Sharing**: Share published reviews directly to Instagram stories
- **Custom Profile URL**: Get a unique URL like `onira.com/yourusername`

### For Reviewers
- **No Account Required**: Leave reviews without signing up
- **Anonymous Reviews**: Use any name you want - completely anonymous
- **Star Ratings**: Rate from 1-5 stars
- **Written Feedback**: Share detailed experiences

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
The `.env` file is already created with default values. For production, update:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="your-production-url"
```

3. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Creating Your Profile

1. **Sign Up**: Create an account with email and username
2. **Set Up Profile**: Fill in your business/personal information
   - Display name
   - Business name (optional)
   - Bio/description
   - Contact info (location, phone, website, Instagram)
3. **Publish**: Your profile will be live at `yourusername` URL

### Managing Reviews

1. Go to **Dashboard** → **Manage Reviews**
2. View all reviews (published and pending)
3. **Publish/Unpublish** reviews with one click
4. **Share to Instagram**: Copy review text to share on stories
5. **Delete** unwanted reviews

### Leaving Anonymous Reviews

1. Visit any public profile (no login required)
2. Fill in the review form:
   - Choose any name (anonymous)
   - Select star rating (1-5)
   - Write your review
3. Submit - the review will be sent to the profile owner for moderation

## Project Structure

```
bakery/
├── app/
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── profile/        # Profile management
│   ├── [username]/     # Public profile pages
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── page.tsx        # Homepage
├── components/         # React components
├── lib/               # Utility functions
├── prisma/            # Database schema
└── public/            # Static assets
```

## Database Schema

- **User**: Authentication and account info
- **Profile**: Portfolio/business information
- **Review**: Anonymous reviews with moderation status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Profiles
- `POST /api/profiles` - Create profile
- `PUT /api/profiles` - Update profile
- `GET /api/profiles/my-profile` - Get current user's profile

### Reviews
- `POST /api/reviews` - Submit anonymous review
- `GET /api/reviews/my-reviews` - Get profile owner's reviews
- `PATCH /api/reviews/[reviewId]` - Update review status
- `DELETE /api/reviews/[reviewId]` - Delete review

## Security Features

- Password hashing with bcryptjs
- Session-based authentication with NextAuth.js
- Authorization checks for profile and review operations
- Input validation and sanitization

## Future Enhancements

- Image uploads for profile and cover photos
- Advanced analytics and insights
- Direct Instagram API integration
- Email notifications for new reviews
- Custom themes and templates
- Export reviews as images
- Multi-language support

## Contributing

This is a personal project. Feel free to fork and modify for your own use.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using Next.js and TypeScript
