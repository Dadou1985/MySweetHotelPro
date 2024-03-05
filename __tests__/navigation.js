import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '../src/components/section/navigation';
import firebase from '../src/Firebase/index'

jest.mock('../src/Firebase/index', () => ({
    auth: {
      signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { updateProfile: jest.fn() } }),
    },
  }));

describe('Navigation Component', () => {
  it('renders the logo correctly', () => {
    const { getByAltText } = render(<Navigation />);
    const logo = getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders the menu items correctly', () => {
    const { getByText } = render(<Navigation />);
    const dashboardLink = getByText('Dashboard');
    const notebookLink = getByText('Notebook');
    const chatLink = getByText('Chat');
    const crmLink = getByText('C.R.M');
    const lostLink = getByText('Lost');

    expect(dashboardLink).toBeInTheDocument();
    expect(notebookLink).toBeInTheDocument();
    expect(chatLink).toBeInTheDocument();
    expect(crmLink).toBeInTheDocument();
    expect(lostLink).toBeInTheDocument();
  });

//   it('opens the logout modal when "Deconnexion" is clicked', async () => {
//     const { getByText, getByRole } = render(<Navigation />);
//     const deconnexionLink = getByText('Deconnexion');

//     fireEvent.click(deconnexionLink);

//     const modal = await waitFor(() => getByRole('dialog'));
//     expect(modal).toBeInTheDocument();
//   });

  it('opens the admin modal when "Admin Board" is clicked', async () => {
    const { getByText, getByRole } = render(<Navigation />);
    const adminBoardLink = getByText('Admin Board');

    fireEvent.click(adminBoardLink);

    const modal = await waitFor(() => getByRole('dialog'));
    expect(modal).toBeInTheDocument();
  });

  it('opens the feedback modal when "Feedback Box" is clicked', async () => {
    const { getByText, getByRole } = render(<Navigation />);
    const feedbackLink = getByText('Feedback Box');

    fireEvent.click(feedbackLink);

    const modal = await waitFor(() => getByRole('dialog'));
    expect(modal).toBeInTheDocument();
  });
});
