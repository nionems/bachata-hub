const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const DAY_ABBR = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export function getNextOccurrence(recurrence: string): Date | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const rec = recurrence.toLowerCase().trim()

  const everyDay = rec.match(/^every (\w+)$/)
  if (everyDay) {
    const idx = DAY_NAMES.indexOf(everyDay[1])
    if (idx !== -1) return nextWeekday(today, idx)
  }

  const firstLast = rec.match(/^(first|last) (\w+) of month$/)
  if (firstLast) {
    const idx = DAY_NAMES.indexOf(firstLast[2])
    if (idx !== -1) return nthWeekdayOfMonth(today, idx, firstLast[1] === 'first' ? 1 : -1)
  }

  const twoFour = rec.match(/^2nd and 4th (\w+)$/)
  if (twoFour) {
    const idx = DAY_NAMES.indexOf(twoFour[1])
    if (idx !== -1) return next2ndOr4th(today, idx)
  }

  return null
}

function nextWeekday(from: Date, targetDay: number): Date {
  const d = new Date(from)
  let diff = targetDay - d.getDay()
  if (diff <= 0) diff += 7
  d.setDate(d.getDate() + diff)
  return d
}

function nthWeekdayOfMonth(from: Date, targetDay: number, n: number): Date {
  const tryMonth = (year: number, month: number): Date => {
    if (n === 1) {
      const first = new Date(year, month, 1)
      let diff = targetDay - first.getDay()
      if (diff < 0) diff += 7
      return new Date(year, month, 1 + diff)
    } else {
      const last = new Date(year, month + 1, 0)
      let diff = last.getDay() - targetDay
      if (diff < 0) diff += 7
      return new Date(year, month, last.getDate() - diff)
    }
  }
  const candidate = tryMonth(from.getFullYear(), from.getMonth())
  if (candidate >= from) return candidate
  const nm = from.getMonth() === 11 ? 0 : from.getMonth() + 1
  const ny = from.getMonth() === 11 ? from.getFullYear() + 1 : from.getFullYear()
  return tryMonth(ny, nm)
}

function next2ndOr4th(from: Date, targetDay: number): Date {
  const occurrences = (year: number, month: number): Date[] => {
    const first = new Date(year, month, 1)
    let diff = targetDay - first.getDay()
    if (diff < 0) diff += 7
    const dates: Date[] = []
    let day = 1 + diff
    let count = 0
    const lastDay = new Date(year, month + 1, 0).getDate()
    while (day <= lastDay) {
      count++
      if (count === 2 || count === 4) dates.push(new Date(year, month, day))
      day += 7
    }
    return dates
  }
  for (const d of occurrences(from.getFullYear(), from.getMonth())) {
    if (d >= from) return d
  }
  const nm = from.getMonth() === 11 ? 0 : from.getMonth() + 1
  const ny = from.getMonth() === 11 ? from.getFullYear() + 1 : from.getFullYear()
  return occurrences(ny, nm)[0]
}

export function getDayOfWeek(recurrence: string): string | null {
  const rec = recurrence.toLowerCase()
  for (let i = 0; i < DAY_NAMES.length; i++) {
    if (rec.includes(DAY_NAMES[i])) {
      return DAY_NAMES[i].charAt(0).toUpperCase() + DAY_NAMES[i].slice(1)
    }
  }
  return null
}

export function formatNextDate(date: Date): string {
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatTime(time: string): string {
  if (!time) return ''
  time = time.trim()
  if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(time)) return time
  const match = time.match(/^(\d{1,2}):(\d{2})$/)
  if (match) {
    const h = parseInt(match[1])
    const m = match[2]
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${m} ${ampm}`
  }
  return time
}

function buildRRule(recurrence: string): string {
  const rec = recurrence.toLowerCase().trim()

  const everyDay = rec.match(/^every (\w+)$/)
  if (everyDay) {
    const idx = DAY_NAMES.indexOf(everyDay[1])
    if (idx !== -1) return `RRULE:FREQ=WEEKLY;BYDAY=${DAY_ABBR[idx]}`
  }

  if (rec === 'fortnightly') return 'RRULE:FREQ=WEEKLY;INTERVAL=2'
  if (rec === 'monthly') return 'RRULE:FREQ=MONTHLY'

  const firstLast = rec.match(/^(first|last) (\w+) of month$/)
  if (firstLast) {
    const idx = DAY_NAMES.indexOf(firstLast[2])
    if (idx !== -1) {
      const prefix = firstLast[1] === 'first' ? '1' : '-1'
      return `RRULE:FREQ=MONTHLY;BYDAY=${prefix}${DAY_ABBR[idx]}`
    }
  }

  const twoFour = rec.match(/^2nd and 4th (\w+)$/)
  if (twoFour) {
    const idx = DAY_NAMES.indexOf(twoFour[1])
    if (idx !== -1) return `RRULE:FREQ=MONTHLY;BYDAY=2${DAY_ABBR[idx]},4${DAY_ABBR[idx]}`
  }

  return 'RRULE:FREQ=WEEKLY'
}

function fmtLocalDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`
}

export function buildGoogleCalendarUrl(event: {
  name: string
  location?: string
  startTime?: string
  endTime?: string
  recurrence?: string
  eventLink?: string
}, nextDate: Date | null): string {
  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}`

  if (nextDate && event.startTime) {
    const [sh, sm] = event.startTime.split(':').map(Number)
    const start = new Date(nextDate)
    start.setHours(sh, sm || 0, 0, 0)
    const end = new Date(nextDate)
    if (event.endTime) {
      const [eh, em] = event.endTime.split(':').map(Number)
      end.setHours(eh, em || 0, 0, 0)
    } else {
      end.setHours(sh + 2, sm || 0, 0, 0)
    }
    url += `&dates=${fmtLocalDateTime(start)}/${fmtLocalDateTime(end)}`
  }

  if (event.location) url += `&location=${encodeURIComponent(event.location)}`
  if (event.recurrence) url += `&recur=${encodeURIComponent(buildRRule(event.recurrence))}`
  if (event.eventLink) url += `&details=${encodeURIComponent(`More info: ${event.eventLink}`)}`

  return url
}
