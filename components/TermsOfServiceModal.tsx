"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TermsOfServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Bachata Australia's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Description of Service</h2>
          <p>
            Bachata Australia provides a platform to discover Bachata events, festivals, instructors, schools, and accommodations across Australia. We also offer features such as event booking, a leaderboard, and a shop.
          </p>

          <h2 className="text-xl font-semibold mt-6">3. User Responsibilities</h2>
          <p>As a user of our services, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information when required</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use our services in compliance with all applicable laws</li>
            <li>Respect the rights and privacy of other users</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Content Guidelines</h2>
          <p>When submitting content to our platform, you agree that:</p>
          <ul>
            <li>You have the right to share the content</li>
            <li>The content is accurate and not misleading</li>
            <li>The content does not violate any third-party rights</li>
            <li>The content is appropriate for a general audience</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">5. Event Listings and Bookings</h2>
          <p>Event organizers are responsible for:</p>
          <ul>
            <li>Accurate event information and pricing</li>
            <li>Honoring all bookings and reservations</li>
            <li>Providing refunds according to their stated policies</li>
            <li>Maintaining appropriate insurance coverage</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">6. Third-Party Links</h2>
          <p>
            Our website may contain links to external sites (e.g., ticketing platforms, Google Maps). We are not responsible for the content or practices of those sites.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Intellectual Property</h2>
          <p>
            All content on our website, including text, graphics, logos, and software, is the property of Bachata Australia or its content suppliers and is protected by intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold mt-6">8. Limitation of Liability</h2>
          <p>
            Bachata Australia is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of our services or inability to use our services.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our services for any user who violates these Terms or engages in behavior deemed inappropriate or harmful.
          </p>

          <h2 className="text-xl font-semibold mt-6">10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Continued use of the service after changes constitutes acceptance of those changes.
          </p>

          <h2 className="text-xl font-semibold mt-6">11. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
            <br />
            Email: bachata.au@gmail.com
            <br />
            Phone: +61 420 224 360
            <br />
            Website: <a href="https://www.bachata.au" target="_blank" rel="noopener noreferrer">https://www.bachata.au</a>
          </p>

          <h2 className="text-xl font-semibold mt-6">Terms of Service for Bachata.au Accommodation Listings</h2>
          <p className="text-sm text-gray-500 mb-4">Effective Date: 8 June 2025</p>

          <h3 className="text-lg font-semibold mt-4">1. Introduction</h3>
          <p>
            Bachata.au provides a platform for members of the dance community to post and discover accommodation opportunities related to dance festivals and events across Australia. By accessing or using our accommodation listing services, you ("user", "you", or "your") agree to comply with and be bound by these Terms of Service.
          </p>

          <h3 className="text-lg font-semibold mt-4">2. User-Generated Content</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Responsibility:</strong> Users are solely responsible for the content they post, including accommodation listings and communications with other users.</li>
            <li><strong>Accuracy:</strong> Users must ensure that all information provided in listings is accurate, current, and complete.</li>
            <li><strong>Compliance:</strong> Users must comply with all applicable laws and regulations when posting content.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">3. Platform Role and Limitations</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>No Endorsement:</strong> Bachata.au does not endorse, verify, or guarantee any listings or user communications.</li>
            <li><strong>No Liability:</strong> We are not liable for any disputes, damages, or losses arising from user interactions or accommodations arranged through our platform.</li>
            <li><strong>No Fees:</strong> We do not charge users for posting or accessing accommodation listings.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">4. User Conduct</h3>
          <p>Users agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Post false, misleading, or fraudulent information.</li>
            <li>Engage in any illegal activities or promote illegal conduct.</li>
            <li>Harass, threaten, or abuse other users.</li>
            <li>Violate the rights of third parties, including privacy and intellectual property rights.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">5. Content Moderation</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Rights:</strong> We reserve the right to remove or modify any content that violates these Terms or is otherwise objectionable.</li>
            <li><strong>Reporting:</strong> Users can report inappropriate content or behavior to our support team.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">6. Privacy</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Data Collection:</strong> We collect and use personal information in accordance with our Privacy Policy.</li>
            <li><strong>User Consent:</strong> By using our services, you consent to the collection and use of your information as described.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">7. Disclaimers</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>No Warranty:</strong> Our services are provided "as is" without warranties of any kind.</li>
            <li><strong>No Guarantee:</strong> We do not guarantee the availability, quality, or safety of accommodations listed on our platform.</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">8. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Bachata.au shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
          </p>

          <h3 className="text-lg font-semibold mt-4">9. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless Bachata.au and its affiliates from any claims, damages, or expenses arising from your use of our services or violation of these Terms.
          </p>

          <h3 className="text-lg font-semibold mt-4">10. Modifications</h3>
          <p>
            We may update these Terms from time to time. Continued use of our services after changes indicates your acceptance of the new Terms.
          </p>

          <h3 className="text-lg font-semibold mt-4">11. Governing Law</h3>
          <p>
            These Terms are governed by the laws of New South Wales, Australia. Any disputes shall be resolved in the courts of New South Wales.
          </p>

          <h3 className="text-lg font-semibold mt-4">Contact Us</h3>
          <p>
            For questions or concerns regarding these Terms, please contact us at Bachata.au@gmail.com
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
