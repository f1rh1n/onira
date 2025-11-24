import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  // Random background image
  const backgroundImages = [
    '/photos/0e958fc52e2041a181dd5f5e5db5e240.jpg',
    '/photos/2f44b645f350e5ab5b0af515eca2765c.jpg',
    '/photos/38f176db36e57fed2b2aff43b7295e25.jpg',
    '/photos/41f267491032c24bbf9c9ccec7e5a691.jpg',
    '/photos/f476c829853e16534c9b857cffd1f128.jpg',
  ];
  const randomBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url(${randomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="transition-transform hover:scale-105 text-3xl font-bold tracking-wider">
            <span className="text-purple-600">O</span>
            <span className="text-purple-600">N</span>
            <span className="text-blue-500">I</span>
            <span className="text-purple-600">R</span>
            <span className="text-purple-600">A</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-foreground/80 hover:text-foreground transition">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-purple-pink text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl md:text-6xl font-heading mb-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Get Anonymous Reviews
            <br />
            For Your Business
          </h2>
          <p className="text-xl font-body-bold text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Let your customers share honest feedback anonymously.
            Build trust and showcase authentic reviews on your profile.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-gradient-purple-pink text-white px-8 py-3 rounded-full text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-block"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="glass border-2 border-primary-400 text-primary-600 dark:text-primary-400 px-8 py-3 rounded-full text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-heading text-center mb-12 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 dark:bg-gray-900/90">
              <div className="text-4xl mb-4">🔗</div>
              <h4 className="text-xl font-serif-elegant mb-2 text-foreground">Share Your Link</h4>
              <p className="font-body-bold text-foreground/80">
                Get your unique review link and share it with customers.
                Perfect for businesses, services, and professionals.
              </p>
            </div>
            <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 dark:bg-gray-900/90">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-xl font-serif-elegant mb-2 text-foreground">Collect Anonymous Feedback</h4>
              <p className="font-body-bold text-foreground/80">
                Customers leave honest reviews without creating accounts.
                They choose any name they want - completely anonymous.
              </p>
            </div>
            <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 dark:bg-gray-900/90">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-xl font-serif-elegant mb-2 text-foreground">Publish & Share</h4>
              <p className="font-body-bold text-foreground/80">
                Display reviews on your public page and share the best ones
                directly to your Instagram stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-nav border-t border-foreground/10 py-8">
        <div className="container mx-auto px-4 text-center text-foreground/60">
          <p>&copy; 2025 Onira. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
