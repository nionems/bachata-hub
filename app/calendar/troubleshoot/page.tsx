import CalendarTroubleshooter from "@/components/calendar-troubleshooter"

export default function CalendarTroubleshootPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Calendar Troubleshooter</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use this tool to diagnose issues with your Google Calendar integration.
          </p>
        </div>

        <CalendarTroubleshooter />

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Issues & Solutions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">1. Calendar Not Public</h3>
              <p className="text-gray-700 mt-1">
                Make sure your Google Calendar is set to public. Go to your Google Calendar settings, find this
                calendar, and under "Access permissions" select "Make available to public".
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">2. Incorrect Calendar ID</h3>
              <p className="text-gray-700 mt-1">
                Verify that you're using the correct Calendar ID. You can find this in your Google Calendar settings
                under "Integrate calendar".
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">3. API Key Issues</h3>
              <p className="text-gray-700 mt-1">
                Ensure your Google API Key is correctly set up with Calendar API access and has been properly added to
                your environment variables.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">4. No Upcoming Events</h3>
              <p className="text-gray-700 mt-1">
                The calendar might be working correctly, but there may not be any events scheduled in the future. Try
                adding a test event to your calendar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
