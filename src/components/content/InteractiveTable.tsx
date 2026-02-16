'use client';

import { useState, useMemo } from 'react';

export interface FeatureComparison {
  feature: string;
  voicefleet: string;
  alternative: string;
  winner: 'voicefleet' | 'alternative' | 'tie';
  sourceId?: number;
}

interface InteractiveTableProps {
  data: FeatureComparison[];
  voicefleetName?: string;
  alternativeName: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function InteractiveTable({
  data,
  voicefleetName = 'VoiceFleet',
  alternativeName,
  className = ''
}: InteractiveTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterWinner, setFilterWinner] = useState<'all' | 'voicefleet' | 'alternative' | 'tie'>('all');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (filterWinner !== 'all') {
      result = result.filter(item => item.winner === filterWinner);
    }

    // Sort
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof FeatureComparison] || '';
        const bValue = b[sortColumn as keyof FeatureComparison] || '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return result;
  }, [data, filterWinner, sortColumn, sortDirection]);

  const getWinnerIcon = (winner: string) => {
    switch (winner) {
      case 'voicefleet':
        return <span className="text-green-600">✓</span>;
      case 'alternative':
        return <span className="text-blue-600">✓</span>;
      case 'tie':
        return <span className="text-gray-400">=</span>;
      default:
        return null;
    }
  };

  const getWinnerClass = (winner: string, isVoicefleet: boolean) => {
    if ((winner === 'voicefleet' && isVoicefleet) || (winner === 'alternative' && !isVoicefleet)) {
      return 'bg-green-50 text-green-800 font-medium';
    }
    return '';
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return (
      <svg className={`w-4 h-4 text-blue-600 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  };

  // Count wins
  const voicefleetWins = data.filter(d => d.winner === 'voicefleet').length;
  const alternativeWins = data.filter(d => d.winner === 'alternative').length;
  const ties = data.filter(d => d.winner === 'tie').length;

  return (
    <div className={`my-8 ${className}`}>
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-6 text-sm">
          <span className="font-medium text-gray-700">Score:</span>
          <span className="text-green-600 font-medium">{voicefleetName}: {voicefleetWins}</span>
          <span className="text-blue-600 font-medium">{alternativeName}: {alternativeWins}</span>
          <span className="text-gray-500">Tie: {ties}</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm text-gray-600">Filter:</label>
          <select
            id="filter"
            value={filterWinner}
            onChange={(e) => setFilterWinner(e.target.value as typeof filterWinner)}
            className="text-sm border rounded-md px-2 py-1 bg-white"
          >
            <option value="all">All features</option>
            <option value="voicefleet">{voicefleetName} wins</option>
            <option value="alternative">{alternativeName} wins</option>
            <option value="tie">Ties</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('feature')}
              >
                <div className="flex items-center gap-2">
                  Feature
                  {renderSortIcon('feature')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {voicefleetName}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {alternativeName}
              </th>
              <th
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('winner')}
              >
                <div className="flex items-center justify-center gap-2">
                  Winner
                  {renderSortIcon('winner')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {row.feature}
                </td>
                <td className={`px-6 py-4 text-sm text-gray-700 ${getWinnerClass(row.winner, true)}`}>
                  {row.voicefleet}
                </td>
                <td className={`px-6 py-4 text-sm text-gray-700 ${getWinnerClass(row.winner, false)}`}>
                  {row.alternative}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex items-center justify-center gap-1">
                    {getWinnerIcon(row.winner)}
                    <span className="text-gray-500 text-xs capitalize">{row.winner}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No features match the selected filter.
        </div>
      )}
    </div>
  );
}

export default InteractiveTable;
