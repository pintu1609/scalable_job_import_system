
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center">
        <div className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-800">
            Pintu Kumar
          </span>

          <span className="text-gray-400">|</span>

          <a
            href="https://www.linkedin.com/in/pintu-kumar-46b147204/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>

          <span className="text-gray-400">|</span>

          <a
            href="https://github.com/pintu1609/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>

          <span className="text-gray-400">|</span>

          <a
            href="https://pintukumar.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
}
