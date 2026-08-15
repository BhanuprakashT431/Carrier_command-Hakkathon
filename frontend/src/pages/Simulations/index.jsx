import React, { useEffect, useState } from 'react';
import { simulatorApi } from '../../services/simulator.api.js';
import { Link } from 'react-router-dom';

const SimulationsHistory = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const res = await simulatorApi.getSimulations();
        setSimulations(res.data);
      } catch (err) {
        // MOCK data if API not ready
        setSimulations([
          {
            id: 'sim-1',
            date: new Date().toISOString(),
            scenarioType: 'Skill Improvement',
            summary: 'MLOps: 20 -> 70'
          },
          {
            id: 'sim-2',
            date: new Date(Date.now() - 86400000).toISOString(),
            scenarioType: 'Market Decline',
            summary: 'Frontend Jobs: -10%'
          }
        ]);
        console.warn('Using mock data for simulations history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-surface-500 font-medium">Loading simulations...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-surface-900">Simulation History</h1>
        <Link to="/simulator" className="bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
          New Simulation
        </Link>
      </div>

      {error && <div className="text-status-error font-medium mb-4 bg-status-error/10 border border-status-error/20 p-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-surface-200">
        {simulations.length === 0 ? (
          <div className="p-8 text-center text-surface-500 font-medium">No simulations found.</div>
        ) : (
          <ul className="divide-y divide-surface-200">
            {simulations.map((sim) => (
              <li key={sim.id} className="p-6 hover:bg-surface-50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-surface-900">{sim.scenarioType}</h3>
                    <p className="text-sm font-medium text-surface-600 mt-1">{sim.summary}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-surface-400 uppercase tracking-wider">{new Date(sim.date).toLocaleDateString()}</div>
                    <button className="text-primary-600 text-sm font-semibold mt-2 group-hover:text-primary-700 group-hover:underline transition-colors">View Details</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SimulationsHistory;
