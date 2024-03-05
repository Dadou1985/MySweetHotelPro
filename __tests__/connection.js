import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import firebase from '../src/Firebase/index'
// Import du composant à tester
import Connection from '../src/components/connection';

// Mock des dépendances externes (Firebase, Gatsby, etc.)
jest.mock('../src/Firebase/index', () => ({
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
    const { getByTestId } = render(<Connection />);
    expect(getByTestId('email')).toBeInTheDocument();
    expect(getByTestId('password')).toBeInTheDocument();
    expect(getByTestId('connexion')).toBeInTheDocument();
  });

  // it('displays a warning message if login fails', async () => {
  //   firebase.auth.signInWithEmailAndPassword.mockRejectedValueOnce({ message: 'Error message' });
  //   const { getByTestId } = render(<Connection />);
  //   const emailInput = getByTestId('email');
  //   const passwordInput = getByTestId('password');
  //   const submitButton = getByTestId('connexion');

  //   fireEvent.change(emailInput, { target: { value: 'host.ghost@msh.com' } });
  //   fireEvent.change(passwordInput, { target: { value: 'antivirus' } });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(firebase.auth.signInWithEmailAndPassword).toHaveBeenCalledWith('host.ghost@msh.com', 'antivirus');
  //     expect(getByTestId('warning')).toHaveTextContent('msh_connexion.c_warning');
  //   });
  // });

  // it('calls auth.signInWithEmailAndPassword and navigate when form is submitted with valid credentials', async () => {
  //   const { getByTestId } = render(<Connection />);
  //   const emailInput = getByTestId('email');
  //   const passwordInput = getByTestId('password');
  //   const submitButton = getByTestId('connexion');

  //   fireEvent.change(emailInput, { target: { value: 'ghost.host@msh.com' } });
  //   fireEvent.change(passwordInput, { target: { value: 'antivirus' } });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(firebase.auth.signInWithEmailAndPassword).toHaveBeenCalledWith('ghost.host@msh.com', 'antivirus');
  //     expect(navigate).toHaveBeenCalledWith('singlePage');
  //   });
  // });
});
