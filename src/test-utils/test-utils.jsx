import { render } from '@testing-library/react';
import { AuthProvider } from '../contexts/authContext';

const renderWithContext = (ui, options) =>
  render(ui, { wrapper: AuthProvider, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { renderWithContext as render };
