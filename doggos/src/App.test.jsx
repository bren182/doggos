import { render, screen } from '@testing-library/react';
import App from './App';
import { isAuthenticated } from './services/auth';

// Mock auth service
jest.mock('./services/auth', () => ({
  isAuthenticated: jest.fn(),
  getCurrentUser: jest.fn(),
}));

describe('App Component', () => {
  test('renders login when user is not authenticated', () => {
    isAuthenticated.mockReturnValue(false);
    
    render(<App />);
    expect(screen.getByText(/login to dog breed viewer/i)).toBeInTheDocument();
  });
});
