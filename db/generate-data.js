import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'

// Generates a software engineer's work calendar for the current month
export function generateEvents() {
  const events = []
  
  // Get current date info
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  
  // Create date boundaries for the current month
  const startOfMonth = new Date(currentYear, currentMonth, 1)
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0)
  
  // Generate daily standup and deep work sessions for each weekday in the month
  let currentDate = new Date(startOfMonth)
  
  while (currentDate <= endOfMonth) {
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Add daily standup (15 minutes at 9:00 AM)
      events.push(generateStandupEvent(currentDate))
      
      // Add morning deep work session (3 hours after standup)
      events.push(generateMorningDeepWorkEvent(currentDate))
      
      // Add afternoon deep work session (3 hours starting at 1:00 PM)
      events.push(generateAfternoonDeepWorkEvent(currentDate))
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return events
}

function generateStandupEvent(date) {
  const eventId = uuidv4()
  const createdAt = faker.date.recent()
  
  // Set standup time: 9:00 AM
  const start = new Date(date)
  start.setHours(9, 0, 0, 0)
  
  // Standup lasts 15 minutes
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + 15)
  
  return {
    id: eventId,
    title: "Daily Standup",
    description: "Daily team sync to discuss progress, blockers, and plans for the day.",
    start: start.toISOString(),
    end: end.toISOString(),
    created: createdAt.toISOString(),
    modified: createdAt.toISOString(),
  }
}

function generateMorningDeepWorkEvent(date) {
  const eventId = uuidv4()
  const createdAt = faker.date.recent()
  
  // Start deep work after standup at 9:15 AM
  const start = new Date(date)
  start.setHours(9, 15, 0, 0)
  
  // Deep work lasts 3 hours
  const end = new Date(start)
  end.setHours(end.getHours() + 3)
  
  return {
    id: eventId,
    title: "Morning Deep Work",
    description: "Focused coding session. No interruptions.",
    start: start.toISOString(),
    end: end.toISOString(),
    created: createdAt.toISOString(),
    modified: createdAt.toISOString(),
  }
}

function generateAfternoonDeepWorkEvent(date) {
  const eventId = uuidv4()
  const createdAt = faker.date.recent()
  
  // Start afternoon deep work at 1:00 PM
  const start = new Date(date)
  start.setHours(13, 0, 0, 0)
  
  // Deep work lasts 3 hours
  const end = new Date(start)
  end.setHours(end.getHours() + 3)
  
  return {
    id: eventId,
    title: "Afternoon Deep Work",
    description: "Focused coding session. No interruptions.",
    start: start.toISOString(),
    end: end.toISOString(),
    created: createdAt.toISOString(),
    modified: createdAt.toISOString(),
  }
}