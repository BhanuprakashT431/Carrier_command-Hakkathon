import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Simulator from './index.jsx';
import { simulatorApi } from '../../services/simulator.api.js';

// Mock the API
vi.mock('../../services/simulator.api.js', () => ({
  simulatorApi: {
    runSimulation: vi.fn(),
  },
}));

describe('Simulator Component', () => {
  it('renders the simulator form', () => {
    render(<Simulator />);
    expect(screen.getByText('What-If Career Simulator')).toBeInTheDocument();
    expect(screen.getByText('Configure Scenario')).toBeInTheDocument();
  });

  it('runs simulation and displays results', async () => {
    simulatorApi.runSimulation.mockResolvedValueOnce({
      data: {
        explanation: 'Test explanation',
        impacts: [
          {
            role: 'Test Role',
            rankingChange: 1,
            beforeScore: 50,
            afterScore: 60,
            scoreDelta: 10
          }
        ]
      }
    });

    render(<Simulator />);
    
    const runBtn = screen.getByText('Run Simulation');
    fireEvent.click(runBtn);
    
    await waitFor(() => {
      expect(screen.getByText('Simulation Results')).toBeInTheDocument();
      expect(screen.getByText('Test explanation')).toBeInTheDocument();
      expect(screen.getByText('Test Role')).toBeInTheDocument();
      expect(screen.getByText('+10')).toBeInTheDocument();
    });
  });
});
