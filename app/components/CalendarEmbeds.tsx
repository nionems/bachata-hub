import React from 'react'

export default function CalendarEmbeds() {
  // Common color parameters for Google Calendar web interface
  const calendarParams = '&color=%23a855f7&bgcolor=%23ffffff&ctz=Australia%2FSydney&mode=MONTH&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&showAdd=0'

  return (
    <div className="space-y-8">
      <div className="calendar-embed">
        <h3 className="text-xl font-semibold mb-4 text-primary">Bachata Hub Calendar</h3>
        <iframe 
          src={`https://calendar.google.com/calendar/embed?src=6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f%40group.calendar.google.com${calendarParams}`}
          style={{ border: 0, width: '100%', height: '600px' }} 
          frameBorder="0" 
          scrolling="no"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="calendar-embed">
        <h3 className="text-xl font-semibold mb-4 text-primary">Bachata Events Calendar</h3>
        <iframe 
          src={`https://calendar.google.com/calendar/embed?src=3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb%40group.calendar.google.com${calendarParams}`}
          style={{ border: 0, width: '100%', height: '600px' }} 
          frameBorder="0" 
          scrolling="no"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="calendar-embed">
        <h3 className="text-xl font-semibold mb-4 text-primary">Bachata Classes Calendar</h3>
        <iframe 
          src={`https://calendar.google.com/calendar/embed?src=641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4%40group.calendar.google.com${calendarParams}`}
          style={{ border: 0, width: '100%', height: '600px' }} 
          frameBorder="0" 
          scrolling="no"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="calendar-embed">
        <h3 className="text-xl font-semibold mb-4 text-primary">Bachata Workshops Calendar</h3>
        <iframe 
          src={`https://calendar.google.com/calendar/embed?src=e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16%40group.calendar.google.com${calendarParams}`}
          style={{ border: 0, width: '100%', height: '600px' }} 
          frameBorder="0" 
          scrolling="no"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="calendar-embed">
        <h3 className="text-xl font-semibold mb-4 text-primary">Bachata Socials Calendar</h3>
        <iframe 
          src={`https://calendar.google.com/calendar/embed?src=4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce%40group.calendar.google.com${calendarParams}`}
          style={{ border: 0, width: '100%', height: '600px' }} 
          frameBorder="0" 
          scrolling="no"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="calendar-embed">
        <h3 className="text-xl font-semibold mb-4 text-primary">Bachata Festivals Calendar</h3>
        <iframe 
          src={`https://calendar.google.com/calendar/embed?src=f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5%40group.calendar.google.com${calendarParams}`}
          style={{ border: 0, width: '100%', height: '600px' }} 
          frameBorder="0" 
          scrolling="no"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="calendar-embed">
        <h3 className="text-xl font-semibold mb-4 text-primary">Bachata Performances Calendar</h3>
        <iframe 
          src={`https://calendar.google.com/calendar/embed?src=c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b%40group.calendar.google.com${calendarParams}`}
          style={{ border: 0, width: '100%', height: '600px' }} 
          frameBorder="0" 
          scrolling="no"
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0 md:mr-8">
            <h2 className="text-3xl font-bold mb-4">
              Add Your Event to Our Calendars
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Have a Bachata event you'd like to add to our calendars? Get it featured and reach dancers across Australia!
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Increase visibility for your events
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Reach the entire Bachata community
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Connect with dancers across Australia
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <a
              href="mailto:contact@bachata.au"
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center min-w-[200px]"
            >
              Contact Us
            </a>
            <a
              href="/calendar/add-events"
              className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center"
            >
              Submit via Form
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 