import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  role?: 'student' | 'teacher' | 'guest';
}

export default function Footer({ role = 'guest' }: FooterProps) {
  const getQuickLinks = () => {
    if (role === 'teacher') {
      return [
        { href: '/dashboard/teacher/materials', label: 'Materials' },
        { href: '/dashboard/teacher/quizzes', label: 'Quizzes' },
        { href: '/dashboard/teacher/assignments', label: 'Assignments' },
        { href: '/dashboard/teacher/grading', label: 'Grading' },
      ];
    } else if (role === 'student') {
      return [
        { href: '/dashboard/student/materials', label: 'Materials' },
        { href: '/dashboard/student/quizzes', label: 'Quizzes' },
        { href: '/dashboard/student/assignments', label: 'Assignments' },
      ];
    } else {
      return [
        { href: '/login', label: 'Login' },
        { href: '/signup', label: 'Sign Up' },
        { href: '/docs', label: 'Documentation' },
      ];
    }
  };

  const quickLinks = getQuickLinks();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-4 sm:mb-6">
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EduSync
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-600">
              Offline-First Collaborative Learning Platform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="https://github.com/ArhanAnsari/edusync" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            © {new Date().getFullYear()} EduSync. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
            Built with ❤️ by{' '}
            <a 
              href="https://arhanansari.me/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Arhan Ansari
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
