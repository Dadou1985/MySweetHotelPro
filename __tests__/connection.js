import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

// Import du composant à tester
import Connection from '../src/components/connection';

// Mock des dépendances externes (Firebase, Gatsby, etc.)
jest.mock('../src/Firebase/config.js', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { updateProfile: jest.fn() } }),
  },
}));
jest.mock('gatsby', () => ({
  navigate: jest.fn(),
}));
jest.mock('../i18n/withTrans.js', () => ({
  withTrans: (Component) => (props) => <Component {...props} />,
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: jest.fn() }),
}));
jest.mock('../src/helper/formCommonFunctions.js', () => ({
  handleChange: jest.fn(),
}));

describe('Connection Component', () => {
  it('renders the form elements correctly', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Connection />);
    expect(getByTestId('email')).toBeInTheDocument();
    expect(getByTestId('password')).toBeInTheDocument();
    expect(getByTestId('connexion')).toBeInTheDocument();
  });

  it('calls auth.signInWithEmailAndPassword and navigate when form is submitted with valid credentials', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Connection />);
    const emailInput = getByTestId('email');
    const passwordInput = getByTestId('password');
    const submitButton = getByTestId('connexion');

    fireEvent.change(emailInput, { target: { value: 'ghost.host@msh.com' } });
    fireEvent.change(passwordInput, { target: { value: 'antivirus' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith('ghost.host@msh.com', 'antivirus');
      expect(navigate).toHaveBeenCalledWith('singlePage');
    });
  });

  it('displays a warning message if login fails', async () => {
    auth.signInWithEmailAndPassword.mockRejectedValueOnce({ message: 'Error message' });
    const { getByPlaceholderText, getByText, getByTestId } = render(<Connection />);
    const emailInput = getByTestId('email');
    const passwordInput = getByTestId('password');
    const submitButton = getByTestId('connexion');

    fireEvent.change(emailInput, { target: { value: 'ghost.host@msh.com' } });
    fireEvent.change(passwordInput, { target: { value: 'antivirus' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith('ghost.host@msh.com', 'antivirus');
      expect(getByTestId('warning')).toHaveTextContent('msh_connexion.c_warning');
    });
  });
});
