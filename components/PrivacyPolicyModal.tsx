"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle className="text-2xl font-bold text-primary">Privacy Policy</DialogTitle>
  </DialogHeader>
  <div className="prose max-w-none">
    <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
    <p>
      At Bachata Australia, we value your privacy. This Privacy Policy outlines how we collect, use, store, and protect your personal information when you interact with our website and services.
    </p>

    <h2 className="text-xl font-semibold mt-6">2. Information We Collect</h2>
    <ul>
      <li>Personal Information: Name, email, phone number, gender, location, dance level, availability, and profile image.</li>
      <li>Booking & Event Info: RSVPs, ticket purchases, and accommodation interests.</li>
      <li>Technical Data: IP address, browser type, device data, referral sources, and cookies.</li>
      <li>Usage Data: How you interact with our website (e.g., pages visited, links clicked).</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6">3. How We Use Your Information</h2>
    <ul>
      <li>Display user and event profiles on our site</li>
      <li>Enable event bookings and accommodation arrangements</li>
      <li>Communicate with you (event info, newsletters, offers)</li>
      <li>Improve our services and customize your experience</li>
      <li>Comply with legal obligations</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6">4. Sharing Your Information</h2>
    <p>We do not sell your data. We only share your information with:</p>
    <ul>
      <li>Event organizers or accommodation hosts for relevant bookings</li>
      <li>Service providers that support our site (e.g., Firebase, analytics, email systems)</li>
      <li>Law enforcement or government authorities when required by law</li>
    </ul>

    <h2 className="text-xl font-semibold mt-6">5. Data Security</h2>
    <p>
      We implement safeguards such as encrypted databases, secure servers, and limited access controls. While we strive to protect your data, no online transmission is completely secure.
    </p>

    <h2 className="text-xl font-semibold mt-6">6. Cookies</h2>
    <p>
      Our website uses cookies to:
    </p>
    <ul>
      <li>Remember user preferences</li>
      <li>Track performance and usage for analytics</li>
      <li>Improve functionality</li>
    </ul>
    <p>
      You can choose to disable cookies through your browser settings.
    </p>

    <h2 className="text-xl font-semibold mt-6">7. Data Retention</h2>
    <p>
      We retain your personal data only as long as necessary to:
    </p>
    <ul>
      <li>Fulfill the purposes for which it was collected</li>
      <li>Comply with legal, accounting, or reporting obligations</li>
    </ul>
    <p>Inactive accounts and associated data may be anonymized or deleted after a reasonable period.</p>

    <h2 className="text-xl font-semibold mt-6">8. Your Rights</h2>
    <ul>
      <li>Access, update, or delete your personal data</li>
      <li>Withdraw consent at any time</li>
      <li>Request a copy of the data we hold on you</li>
      <li>Opt out of email marketing and communication</li>
    </ul>
    <p>To exercise any of these rights, contact us directly.</p>

    <h2 className="text-xl font-semibold mt-6">9. Third-Party Links</h2>
    <p>
      Our website may include links to third-party services, such as TryBooking or social media pages. Once you leave our site, we are not responsible for the content or privacy practices of those external platforms. Please review their policies before providing personal data.
    </p>

    <h2 className="text-xl font-semibold mt-6">10. Children’s Privacy</h2>
    <p>
      Our website is not intended for children under 13 years of age. We do not knowingly collect personal data from children.
    </p>

    <h2 className="text-xl font-semibold mt-6">11. Changes to This Policy</h2>
    <p>
      We may update this Privacy Policy periodically. All changes will be posted on this page with an updated revision date.
    </p>

    <h2 className="text-xl font-semibold mt-6">12. Contact Us</h2>
    <p>
      If you have any questions or requests regarding your privacy, feel free to contact us:
      <br />
      Email: bachata.au@gmail.com
      <br />
      Phone: [+61420224360]
      <br />
      Website: <a href="https://www.bachata.au" target="_blank" rel="noopener noreferrer">https://www.bachata.au</a>
    </p>

    <p className="text-sm text-gray-500 mt-8">
      Last updated: {new Date().toLocaleDateString()}
    </p>
  </div>
</DialogContent>

    </Dialog>
  )
} 