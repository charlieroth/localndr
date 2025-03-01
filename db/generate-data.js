import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'

export function generateEvents(numEvents) {
  const events = []
  for (let i = 0; i < numEvents; i++) {
    events.push(generateEvent())
  }
  return events
}

function generateEvent() {
  const eventId = uuidv4()
  const createdAt = faker.date.recent()

  // Get current date info
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Create date ranges for current and next month
  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
  const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1)
  const endOfNextMonth = new Date(currentYear, currentMonth + 2, 0)

  // Generate start date in current or next month
  const start = faker.date.between({ from: startOfCurrentMonth, to: endOfNextMonth })
  // Generate end date that's after start date, but still within two-month window
  const end = faker.date.between({ from: start, to: endOfNextMonth })

  return {
    id: eventId,
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.paragraph({ min: 2, max: 6 }, '\n'),
    start: start.toISOString(),
    end: end.toISOString(),
    created: createdAt.toISOString(),
    modified: createdAt.toISOString(),
  }
}