beforeAll(async () => {
  // this function will run onve before any test.
  // in order to initialize testing database or prepare mock data for testing, we can configure it here.
});

afterAll(async () => {
  // this function will run after all test-cases completed.
  // in order to cleanup all the tests, (removing mock data, testing database.)
  await new Promise((resolve) => setTimeout(resolve, 500));
});
