// src/components/common/Footer.tsx
import React from 'react';
import { Twitter, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-white border-t">
    {/* Top section with grid links */}
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {/* Brand & Description */}
      <div>
        <h4 className="text-xl font-bold mb-4">PolygonBuilds</h4>
        <p className="text-gray-600">
          High-quality 3D printed creations. Customize your model, track your order,
          and enjoy fast delivery right to your door.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h5 className="font-semibold mb-3">Quick Links</h5>
        <ul className="space-y-2 text-gray-700">
          <li>
            <Link to="/order/new" className="hover:text-gray-900">
              New Order
            </Link>
          </li>
          <li>
            <Link to="/orders" className="hover:text-gray-900">
              Order History
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-gray-900">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/order/:orderId/edit" className="hover:text-gray-900">
              Modify Order
            </Link>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h5 className="font-semibold mb-3">Support</h5>
        <ul className="space-y-2 text-gray-700">
          <li>
            <Link to="/help" className="hover:text-gray-900">
              Help Center
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-900">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/faqs" className="hover:text-gray-900">
              FAQs
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-gray-900">
              Terms & Conditions
            </Link>
          </li>
        </ul>
      </div>

      {/* Social */}
      <div>
        <h5 className="font-semibold mb-3">Follow Us</h5>
        <div className="flex space-x-4">
          <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-gray-900">
            <Twitter size={20} />
          </a>
          <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-gray-900">
            <Facebook size={20} />
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-gray-900">
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom bar with copy & policies */}
    <div className="bg-gray-50 py-4">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PolygonBuilds. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
            Privacy Policy
          </Link>
          <Link to="/cookies" className="text-sm text-gray-500 hover:text-gray-700">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
