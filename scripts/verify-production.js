// Production Database Verification Script
// ========================================
// This script verifies that the production database is properly configured
// and all required tables exist.
//
// Usage:
//   1. Pull production environment: vercel env pull .env.production
//   2. Run this script: node scripts/verify-production.js

const { PrismaClient } = require('@prisma/client');

async function verifyProduction() {
  console.log('🔍 Verifying Production Database Setup\n');
  console.log('=' .repeat(50));

  const prisma = new PrismaClient();

  try {
    // Check database connection
    console.log('\n📡 Checking database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Check User table
    console.log('\n👤 Checking User table...');
    const userCount = await prisma.user.count();
    console.log(`✅ User table exists (${userCount} users)`);

    // Check Profile table
    console.log('\n📋 Checking Profile table...');
    const profileCount = await prisma.profile.count();
    console.log(`✅ Profile table exists (${profileCount} profiles)`);

    // Check Post table
    console.log('\n📝 Checking Post table...');
    const postCount = await prisma.post.count();
    console.log(`✅ Post table exists (${postCount} posts)`);

    // Check PostLike table (CRITICAL for like functionality)
    console.log('\n💜 Checking PostLike table...');
    const likeCount = await prisma.postLike.count();
    console.log(`✅ PostLike table exists (${likeCount} likes)`);

    // Check PostComment table
    console.log('\n💬 Checking PostComment table...');
    const commentCount = await prisma.postComment.count();
    console.log(`✅ PostComment table exists (${commentCount} comments)`);

    // Check Review table
    console.log('\n⭐ Checking Review table...');
    const reviewCount = await prisma.review.count();
    console.log(`✅ Review table exists (${reviewCount} reviews)`);

    // Check PasswordReset table
    console.log('\n🔐 Checking PasswordReset table...');
    const resetCount = await prisma.passwordReset.count();
    console.log(`✅ PasswordReset table exists (${resetCount} active resets)`);

    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('\n🎉 ALL CHECKS PASSED!');
    console.log('\nYour production database is properly configured.');
    console.log('You can now test the like functionality on your site.');
    console.log('\n' + '=' .repeat(50));

    process.exit(0);
  } catch (error) {
    console.log('\n' + '=' .repeat(50));
    console.error('\n❌ VERIFICATION FAILED\n');
    console.error('Error:', error.message);
    console.error('\nCommon Issues:');
    console.error('  1. DATABASE_URL not set correctly');
    console.error('  2. Database tables not created (run: npx prisma db push)');
    console.error('  3. Wrong Prisma provider in schema.prisma');
    console.error('  4. Network/firewall blocking database connection');
    console.error('\nTroubleshooting:');
    console.error('  1. Check .env.production has correct DATABASE_URL');
    console.error('  2. Run: npx prisma db push');
    console.error('  3. Check Vercel logs for errors');
    console.error('\n' + '=' .repeat(50));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyProduction().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
