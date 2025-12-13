# ONIRA Monitoring Dashboard

## Overview
The ONIRA monitoring dashboard provides real-time insights into your platform's performance, user activity, and key metrics.

## Accessing the Dashboard

### URL
```
http://localhost:3000/admin/monitoring (Development)
http://your-domain.com/admin/monitoring (Production)
```

### Features

#### 📊 Key Metrics Cards
- **Total Users**: Shows total registered users with growth rate
  - Last 24 hours signups
  - Last week signups
  - Last month signups

- **Profiles**: Total profile count
  - Published profiles
  - Unpublished profiles

- **Reviews**: Total review count
  - Average rating across all reviews
  - Reviews in last 24 hours
  - Pending reviews awaiting approval

- **Posts**: Total posts count
  - Published vs unpublished
  - Posts created in last 24 hours

#### 💬 Engagement Metrics
- Total likes on all posts
- Total comments on all posts

#### ⚙️ System Status
- Database connection status
- Server uptime

#### 🏆 Top Profiles
Table showing the top 5 profiles ranked by review count, including:
- Username
- Display name
- Number of reviews
- Number of posts

#### 👥 Recent Users
Table showing the 10 most recent user registrations with:
- Username
- Email address
- Profile name (if created)
- Profile status (published/unpublished)
- Registration date and time

### Real-Time Updates

The dashboard features **automatic refresh** functionality:

1. **Auto-Refresh Toggle**: Enable/disable automatic updates
2. **Refresh Interval**: Updates every 30 seconds when enabled
3. **Manual Refresh**: Click the "Refresh" button anytime
4. **Last Updated**: Shows the exact time of last data fetch

### Performance Impact

✅ **Zero impact on main website**:
- Monitoring runs on separate API endpoint
- Queries are optimized for speed
- Read-only database operations
- No impact on user-facing features

### Security Note

**Important**: The monitoring dashboard is currently public. To add authentication:

1. Uncomment lines 11-13 in `app/api/admin/metrics/route.ts`:
```typescript
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

2. Add admin role check if needed for extra security.

## Technical Details

### API Endpoint
```
GET /api/admin/metrics
```

Returns JSON with all metrics data.

### Files Created
1. **API Route**: `app/api/admin/metrics/route.ts`
   - Handles all database queries
   - Returns aggregated metrics

2. **Dashboard Page**: `app/admin/monitoring/page.tsx`
   - Beautiful, responsive UI
   - Dark mode support
   - Real-time updates

### Database Queries
All queries use Prisma with:
- Parallel execution for performance
- Counting operations (fast)
- Limited result sets (top 5, recent 10)
- Indexed fields for quick lookups

## Customization

### Adjusting Refresh Interval
Edit line 81 in `app/admin/monitoring/page.tsx`:
```typescript
const interval = setInterval(fetchMetrics, 30000); // Change 30000 (30 seconds)
```

### Adding More Metrics
Add new queries in `app/api/admin/metrics/route.ts` and display in the dashboard page.

### Changing Color Theme
The dashboard uses Tailwind CSS with dark mode support. Modify classes in `app/admin/monitoring/page.tsx`.

## Troubleshooting

### Dashboard not loading
1. Check if Next.js dev server is running
2. Verify database connection
3. Check browser console for errors

### Metrics showing 0
1. Ensure you have data in the database
2. Check database connection in `.env`
3. Verify Prisma client is generated: `npx prisma generate`

### Auto-refresh not working
1. Check browser console for errors
2. Verify the API endpoint is accessible
3. Ensure you haven't hit rate limits

## Support

For issues or questions:
1. Check application logs
2. Verify database connectivity
3. Test API endpoint directly: `curl http://localhost:3000/api/admin/metrics`

---

**Created for ONIRA** - Real-time monitoring without compromising performance 🚀
