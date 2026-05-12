const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Task Manager. All rights reserved. Built with ❤️ using MERN Stack
        </p>
      </div>
    </footer>
  );
};

export default Footer;
