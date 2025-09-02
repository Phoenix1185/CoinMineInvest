import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-cmc-card border-t border-gray-700 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-cmc-gray">
            <span>© 2025 CryptoMine Pro. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-1 text-cmc-gray text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for crypto miners worldwide</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-cmc-gray">
            <Link href="/privacy-policy" className="hover:text-white transition-colors" data-testid="link-privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors" data-testid="link-terms-of-service">Terms of Service</Link>
            <Link href="/support" className="hover:text-white transition-colors" data-testid="link-support">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}