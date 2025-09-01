# Dog Breed Viewer

A React application that allows users to browse a list of dog breeds and view random images for selected breeds using the Dog CEO API.

## Features

- **Breed List**: Fetches and displays a list of all dog breeds from the Dog CEO API
- **Search Functionality**: Allows users to search/filter for specific breeds
- **Image Display**: Shows 3 random images when a breed is selected
- **Loading States**: Provides feedback during API calls with loading indicators
- **Error Handling**: Gracefully handles API errors with user-friendly messages
- **Responsive Design**: Works well on both desktop and mobile devices
- **User Authentication**: Secure login using DummyJSON API
- **Caching**: Local cache mechanism to reduce API calls
- **Rate Limit Handling**: Retry logic with exponential backoff for API rate limiting
- **Unit Tests**: Test coverage for components.

## Installation

1. Clone the repository
2. Navigate to the project directory (doggos)
3. Install dependencies:

```bash
npm install
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) in your browser.

## Running Tests

To run tests:

```bash
npm test
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- **React**: Frontend library for building the user interface
- **Vite**: Build tool and development server
- **Dog CEO API**: Public API for dog breed information and images
- **DummyJSON API**: Authentication API for user login
- **Jest + React Testing Library**: Testing framework for components
- **CSS**: Custom styling with responsive design

## API Information

This application uses the free [Dog CEO API](https://dog.ceo/dog-api/) with the following endpoints:

- `GET https://dog.ceo/api/breeds/list/all` - Retrieves a list of all dog breeds
- `GET https://dog.ceo/api/breed/{breed}/images/random/{count}` - Retrieves random images for a specific breed

## Project Structure

```
/src
  /components
    - BreedList.jsx      # Component for displaying and filtering breeds
    - ImageDisplay.jsx   # Component for displaying dog images
    - Login.jsx          # Login screen component
    - UserProfile.jsx    # User profile component
  /services
    - api.js            # API service for dog breeds and images
    - auth.js           # Authentication service
  /utils
    - cache.js          # Caching utility
  - App.jsx             # Main application component
  - App.css             # Application styling
  - main.jsx            # Entry point
```

## Bonus Features Implemented

### 1. Caching Mechanism
The application uses a custom caching solution to store API responses locally:
- Breed list is cached for 1 hour
- Images are cached for 5 minutes (shorter since they're random)
- Reduces API calls and improves performance

### 2. Rate Limit Handling
Implemented retry logic for API calls with:
- Exponential backoff strategy
- Special handling for rate limit errors (429)
- Up to 3 retry attempts

### 3. Unit Testing
Added tests using Jest
- Component rendering tests
- User interaction tests
- Authentication service test

### 4. User Authentication
Implemented secure login flow using the DummyJSON API:
- Login screen with username/password
- User profile display with avatar
- Token storage in localStorage
- Secure routes that require authentication

## Authentication Test Credentials

To test the login functionality, use these credentials from the DummyJSON API:
- Username: `avat`
- Password: `avatpass`
