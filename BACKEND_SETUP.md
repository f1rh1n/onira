# Onira Backend & Database Setup

Complete documentation for the backend architecture and database configuration.

---

## 📊 Database Architecture

### Technology Stack
- **ORM:** Prisma 5.19.0
- **Development DB:** SQLite (`dev.db`)
- **Production DB:** PostgreSQL (recommended)
- **Supported Databases:** PostgreSQL, MySQL, SQLite

### Database Models

#### User Model
Stores authentication credentials and user accounts.

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // bcrypt hashed
  username      String    @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  profile       Profile?  // One-to-one relation
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `email`: User's email (unique, used for login)
- `password`: Bcrypt hashed password (12 salt rounds)
- `username`: Unique username (URL-friendly)
- `profile`: Optional profile (created separately)

#### Profile Model
Public portfolio/business profile for each user.

```prisma
model Profile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(...)
  displayName   String
  bio           String?
  profileType   String    @default("business")
  businessName  String?
  location      String?
  phone         String?
  website       String?
  instagram     String?
  avatar        String?   // DiceBear avatar ID
  isPublished   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  reviews       Review[]  // One-to-many
  posts         Post[]    // One-to-many
}
```

**Key Features:**
- Instagram-style profile display
- Avatar system (DiceBear API)
- Publish/draft toggle
- Contact information fields
- Cascading deletes (deleting profile deletes reviews and posts)

#### Review Model
Anonymous reviews with moderation system.

```prisma
model Review {
  id            String    @id @default(cuid())
  profileId     String
  profile       Profile   @relation(...)
  reviewerName  String    // Anonymous chosen name
  reviewerAvatar String?  // DiceBear avatar ID
  rating        Int       // 1-5 stars
  comment       String
  isPublished   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Key Features:**
- No authentication required to submit
- Profile owner must approve (isPublished)
- Anonymous reviewer with chosen name/avatar
- 5-star rating system

#### Post Model
Blog posts and portfolio content.

```prisma
model Post {
  id            String    @id @default(cuid())
  profileId     String
  profile       Profile   @relation(...)
  title         String
  content       String
  excerpt       String?
  coverImage    String?
  images        String?   // JSON array
  category      String?
  tags          String?   // JSON array
  isPublished   Boolean   @default(true)
  views         Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Key Features:**
- Multiple images support (JSON array)
- Category and tags system
- View counter
- Cover image support
- Publish/draft toggle

### Data Relationships

```
User (1) ←→ (1) Profile
                 ↓
     ┌───────────┴────────────┐
     ↓                        ↓
Review (*)               Post (*)
```

- One User has exactly one Profile (1:1)
- One Profile has many Reviews (1:many)
- One Profile has many Posts (1:many)
- Cascade delete: Deleting profile removes all reviews and posts

---

## 🔐 Authentication System

### NextAuth Configuration

**Provider:** Credentials (Email/Password)
**Strategy:** JWT-based sessions (stateless)
**File:** `lib/auth.ts`

#### Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - User submits email, username, password
   - System validates uniqueness
   - Password hashed with bcrypt (12 rounds)
   - User record created
   - Returns user object (password excluded)

2. **Login** (NextAuth)
   - User submits email and password
   - System queries database for user
   - Password verified with bcrypt
   - JWT token generated with user data
   - Session created

3. **Session Management**
   - JWT token stored in HTTP-only cookie
   - Token includes: id, username, email
   - Automatic session refresh
   - Middleware protection on routes

#### Password Security
```javascript
// Hashing (registration)
const hashedPassword = await bcrypt.hash(password, 12);

// Verification (login)
const isValid = await bcrypt.compare(password, user.password);
```

### Protected Routes
Routes requiring authentication:
- `/dashboard/*` - All dashboard pages
- `/profile/edit` - Profile editing
- `/profile/setup` - Profile creation
- `POST /api/profiles` - Create/update profile
- `POST /api/posts` - Create posts
- `PATCH /api/reviews/:id` - Publish reviews
- `DELETE /api/reviews/:id` - Delete reviews

---

## 🛣️ API Routes

All API routes are in `app/api/` following Next.js 14 App Router conventions.

### Authentication Endpoints

#### `POST /api/auth/register`
**Purpose:** Create new user account
**Authentication:** None required
**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```
**Response:** User object (password excluded)
**Validation:**
- Email format and uniqueness
- Username uniqueness and format
- Password minimum length (6 characters)

#### `POST /api/auth/signin` (NextAuth)
**Purpose:** User login
**Authentication:** None required
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```
**Response:** Session object with JWT token

### Profile Endpoints

#### `POST /api/profiles`
**Purpose:** Create user profile
**Authentication:** Required
**Request Body:**
```json
{
  "displayName": "John Doe",
  "businessName": "Doe's Bakery",
  "bio": "Best bakery in town",
  "location": "New York, NY",
  "phone": "+1234567890",
  "website": "https://example.com",
  "instagram": "@johndoe",
  "avatar": "adventurer-neutral",
  "isPublished": true
}
```

#### `PUT /api/profiles`
**Purpose:** Update existing profile
**Authentication:** Required
**Request Body:** Same as POST

#### `GET /api/profiles/my-profile`
**Purpose:** Get current user's profile
**Authentication:** Required
**Response:**
```json
{
  "profile": {
    "id": "...",
    "displayName": "John Doe",
    "_count": {
      "reviews": 15,
      "posts": 8
    }
  }
}
```

### Review Endpoints

#### `POST /api/reviews`
**Purpose:** Submit anonymous review
**Authentication:** None required (anonymous)
**Request Body:**
```json
{
  "profileId": "clx...",
  "reviewerName": "Happy Customer",
  "reviewerAvatar": "bottts-neutral",
  "rating": 5,
  "comment": "Excellent service!"
}
```
**Note:** Creates review with `isPublished: false` (awaiting approval)

#### `GET /api/reviews/my-reviews`
**Purpose:** Get all reviews for user's profile
**Authentication:** Required
**Response:** Array of review objects

#### `PATCH /api/reviews/:id`
**Purpose:** Toggle review publication status
**Authentication:** Required (must own profile)
**Request Body:**
```json
{
  "isPublished": true
}
```

#### `DELETE /api/reviews/:id`
**Purpose:** Delete review
**Authentication:** Required (must own profile)
**Response:** Success message

### Post Endpoints

#### `POST /api/posts`
**Purpose:** Create blog post
**Authentication:** Required
**Request Body:**
```json
{
  "title": "My First Post",
  "content": "Post content here...",
  "excerpt": "Short description",
  "coverImage": "base64...",
  "images": "[\"url1\", \"url2\"]",
  "category": "News",
  "tags": "[\"bakery\", \"news\"]",
  "isPublished": true
}
```

#### `GET /api/posts/my-posts`
**Purpose:** Get all user's posts
**Authentication:** Required

#### `PUT /api/posts/:id`
**Purpose:** Update existing post
**Authentication:** Required (must own post)

#### `DELETE /api/posts/:id`
**Purpose:** Delete post
**Authentication:** Required (must own post)

---

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Database Connection
DATABASE_URL="postgresql://user:pass@host:5432/db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-32-character-string"
NEXTAUTH_URL="https://your-domain.com"
```

### Development vs Production

**Development (SQLite):**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
```

**Production (PostgreSQL):**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
```

---

## 🚀 Database Commands

### Initial Setup
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Start development server
npm run dev
```

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Prisma Studio (Database GUI)
```bash
npx prisma studio
```
Opens visual database editor at `http://localhost:5555`

---

## 📊 Performance Considerations

### Database Indexes
Consider adding indexes for:
- `User.email` (already unique)
- `User.username` (already unique)
- `Profile.userId` (already unique)
- `Review.profileId` (for faster queries)
- `Post.profileId` (for faster queries)
- `Post.createdAt` (for sorting)

### Connection Pooling
For production PostgreSQL, use connection pooling:
- Vercel Postgres: Built-in pooling
- Supabase: Use "Session mode" URL
- Self-hosted: Use PgBouncer

### Query Optimization
Prisma queries include:
- Relation counting (`_count`)
- Selective field selection
- Proper ordering (`orderBy`)
- Cascading deletes (automatic)

---

## 🔒 Security Best Practices

### Implemented
✅ Password hashing with bcrypt
✅ JWT session tokens
✅ HTTP-only cookies
✅ Owner verification for updates/deletes
✅ Input validation on all routes
✅ Unique constraint enforcement

### Recommended Additions
- [ ] Rate limiting on auth routes
- [ ] Email verification
- [ ] Password reset functionality
- [ ] CSRF protection (NextAuth provides this)
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (Next.js handles this)

---

## 🐛 Common Issues & Solutions

### "Prisma Client not found"
**Solution:**
```bash
npx prisma generate
```

### "Can't reach database server"
**Check:**
- `DATABASE_URL` is correct
- Database is running
- Firewall allows connections
- SSL settings if required

### "Unique constraint failed"
**Cause:** Trying to create duplicate email/username
**Solution:** Use unique validation before insert

### "Foreign key constraint failed"
**Cause:** Trying to reference non-existent record
**Solution:** Verify referenced record exists first

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Bcrypt npm package](https://www.npmjs.com/package/bcryptjs)

---

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
