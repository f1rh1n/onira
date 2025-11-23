import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-950">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image src="/logo.png" alt="Onira" width={50} height={50} />
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Build Your Portfolio,
            <br />
            Receive Anonymous Reviews
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Create a beautiful portfolio for your business or personal brand.
            Let others leave anonymous reviews that you can moderate and share.
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
      <section id="features" className="py-16 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-slate-800/50 dark:to-purple-900/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Create Your Portfolio</h4>
              <p className="text-foreground/70">
                Set up your profile with your business info, photos, and content.
                Perfect for bakeries, cafes, freelancers, and more.
              </p>
            </div>
            <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Receive Anonymous Reviews</h4>
              <p className="text-foreground/70">
                Anyone can leave a review without creating an account.
                They can use any name they want - completely anonymous.
              </p>
            </div>
            <div className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Moderate & Share</h4>
              <p className="text-foreground/70">
                Choose which reviews to publish publicly.
                Share the best ones directly to your Instagram stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-nav border-t border-foreground/10 py-8">
        <div className="container mx-auto px-4 text-center text-foreground/60">
          <p>&copy; 2024 Onira. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
