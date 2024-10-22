# Testing
Overview of running tests for frontend. These should be run before submitting any pull request.

These tests are written using the [`playwright`](https://playwright.dev/) framework.

## Test Files Overview
- `coreTests.ts` - file containing the main shared tests that are used in the `spec.ts` files.
- `existingUserTest.spec.ts` - runs through a full suite of user tests for an existing test user profile.
- `newUserTest.spec.ts` - runs through a full suite of user tests for a new user profile. After running the tests, the user is deleted from the Auth0.
- `data` - folder containing the data files used in the tests.
  - `testData.ts` - file containing the some ground truth data used in the tests.
- `helpers`
    - `auth0Management.ts` - file containing the helper functions for interacting with the Auth0 Management API. Used to delete the new user profile after running the tests.
    - `similarity.ts` - file containing the helper functions for calculating the similarity between two strings.
- `test-results` - folder containing the test results in the `junit` format.


## Setup
1. Install the required packages into your test environment by running the following commands:
```bash
npm install
```
This will install the `devDependencies` listed in the `package.json` file, which includes the `playwright` framework, and other required packages.

2. In order to run the new user tests, you'll need some Auth0 credentials. Add a `.env` file in the `tests` folder with the following content:
```bash
AUTH0_DOMAIN=dev-********.us.auth0.com
AUTH0_CLIENT_ID=y********
AUTH0_CLIENT_SECRET=********
AUTH0_SANDBOX_CLIENT_ID=********
```

## Running Tests
1. Make sure you are in the root folder.
2. Run the following command:
```bash
npx playwright test
```

If you just want to run an individual test file, you can run the following command:
```bash
npx playwright test tests/<test_name>.ts
```

For example, if you want to run `existingUsertest`, you can run the following command:
```bash
npx playwright test tests/existingUsertest.spec.ts
```

## Test Results
The test output will be displayed in the terminal.

Test results are saved to the `test-results` folder in the root directory. In the `html-report` folder, you can find the test report in html format. On failure, this report will be automatically opened in the browser.

If there are any failed tests, screenshots of the failed parts are also saved in the `test-results` folder.