import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a request mocking server with the given request handlers.
export const worker = setupWorker(...handlers)

// Make sure any handlers have been added before the tests begin.
beforeAll(async () => {
  // Start the worker
  await worker.start({ onUnhandledRequest: 'error' })
})

// Reset handlers after each test `important for test isolation`
afterEach(() => worker.resetHandlers())

// Clean up after all tests
afterAll(() => worker.stop())
