import logo from "@/assets/logo.jpeg";
import { Instagram, Linkedin, Youtube, Facebook } from "lucide-react";
import company_log from "@/assets/company_log.png";

export default function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Column 1 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="CRM Job Shopee" className="h-8 w-8 rounded object-cover" />
              <span className="text-lg font-bold text-primary">CRM Job Shopee</span>
            </div>
            <p className="text-sm opacity-70">Job CRM HR Consultancy Services</p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</a></li>
              <li><a href="/profile" className="hover:text-primary transition-colors">My Profile</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li>📧 crmjobshopee.hr@gmail.com</li>
              <li>📞 +91 8939750730</li>
              <li>✉️ Info@crmjobshopee.com</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="mb-3 font-semibold">Follow Us</h4>
            <div className="flex flex-row space-x-4 items-center opacity-70">
              <Linkedin size={30} className="text-blue-600" />
              <Instagram size={30} className="text-pink-500" />
              <Youtube size={30} className="text-red-500" />
              <Facebook size={30} className="text-blue-500" />

              {/* X (Twitter) Official SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
            </div>

            {/* Developed By */}
            <div className="flex items-center justify-start gap-2 mt-6 opacity-100">
              <span className="text-lg font-semibold">Developed by</span>
              <img src={company_log} alt="company logo" className="h-8 w-auto" />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-background/20 pt-4 text-center text-sm opacity-50">
          © 2026 CRM Job Shopee. All rights reserved.
        </div>
      </div>
    </footer>
  );
}