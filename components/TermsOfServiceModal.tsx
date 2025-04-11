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

          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
