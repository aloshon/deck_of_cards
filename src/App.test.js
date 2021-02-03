import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page and title', () => {
  render(<App />);
  const text = screen.getByText(/Deck of Cards/);
  expect(text).toBeInTheDocument();
});
