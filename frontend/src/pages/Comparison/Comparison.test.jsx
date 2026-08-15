import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Comparison from './index.jsx';
import { comparisonApi } from '../../services/comparison.api.js';

vi.mock('../../services/comparison.api.js', () => ({
  comparisonApi: {
    runComparison: vi.fn(),
  },
}));

describe('Comparison Component', () => {
  it('renders the comparison form', () => {
    render(<Comparison />);
    expect(screen.getByText('Career Comparison & Adaptive Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Select Careers to Compare')).toBeInTheDocument();
  });

  it('runs comparison and displays results', async () => {
    comparisonApi.runComparison.mockResolvedValueOnce({
      data: {
        careers: [
          {
            role: 'Test Career',
            suitability: 99,
            stressAdjusted: 95,
            risk: 'Low',
            robustness: 90,
            stability: 85,
            evidence: 'High',
            skillGap: 'Low',
            learningEffort: 'Low'
          }
        ],
        recommendations: {
          bestOverall: 'Test Career',
          mostRobust: 'Test Career',
          lowestRisk: 'Test Career',
          fastestReadiness: 'Test Career',
          bestAlternative: 'Test Career',
          highestGrowth: 'Test Career'
        }
      }
    });

    render(<Comparison />);
    
    const btn = screen.getByText('Run Comparison');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Adaptive Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Test Career')).toBeInTheDocument();
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('95')).toBeInTheDocument();
    });
  });
});
