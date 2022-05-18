import { render, screen } from '@testing-library/react';
import App from './App';

test('renders elements', () => {
  render(<App />);
  const element = screen.getByText(/.*/i);
  expect(element).toBeInTheDocument();
});
