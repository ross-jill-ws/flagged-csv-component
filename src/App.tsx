import './App.css'
import FlaggedCsvComponent from './components/FlaggedCsvComponent'
import { useState } from 'react'

const sampleCsvData = `Name{#0E2841},Color{#0E2841},Value{#0E2841},JUL{#0E2841},AUG{#0E2841},SEP{#0E2841},OCT{#0E2841},NOV{#0E2841},DEC{#0E2841}
My color1,{#84E291},30,$500{#84E291}{MG:897498},{MG:897498},,,,
My color2,{#E49EDD},32,$600{#E49EDD}{MG:791126},{MG:791126},{MG:791126},,,
My color3,{#F6C6AC},34,$700{#F6C6AC}{MG:327671},{MG:327671},{MG:327671},{MG:327671},,
My color4,{#84E291},36,$800{#84E291}{MG:327523},{MG:327523},{MG:327523},{MG:327523},{MG:327523},{MG:327523}`;

const largeSampleCsv = `Product{l:A1},Q1{l:B1},Q2{l:C1},Q3{l:D1},Q4{l:E1},Total{l:F1}
Laptops{l:A2}{#FFFF00},1000{l:B2},1200{l:C2},1100{l:D2},1300{l:E2},4600{l:F2}{#00FF00}
Phones{l:A3}{#FFFF00},500{l:B3},600{l:C3},700{l:D3},800{l:E3},2600{l:F3}{#00FF00}
Tablets{l:A4}{#FFFF00},300{l:B4},350{l:C4},400{l:D4},450{l:E4},1500{l:F4}{#00FF00}
Watches{l:A5}{#FFFF00},200{l:B5},250{l:C5},300{l:D5},350{l:E5},1100{l:F5}{#00FF00}
Accessories{l:A6}{#FFFF00},150{l:B6},175{l:C6},200{l:D6},225{l:E6},750{l:F6}{#00FF00}`;

const complexCsv = `,ARN - Health & Wellness Bundle{l:B29},"
30''{l:C29}","PPL 25+, Contextual targeting & audience overlays (grocery decision makers, shoppers prioritizing health & nutrition){l:D29}",National{l:E29},2025-07-28 00:00:00{l:F29},2025-10-19 00:00:00{l:G29},,,,,,,,,,,,,,,,,,21.505376344086024{l:Y29},-{l:Z29},-{l:AA29},1860000{l:AB29},40000{l:AC29},40000{l:AD29}
,Partnership{l:B30},,,,,,,,,,,,,,,,,,,,,,,,,,,,
,Broadsheet{l:B31},See schedule tab for full details{l:C31},,"SYD, MEL & BRI{l:E31}",2025-07-28 00:00:00{l:F31},2025-10-19 00:00:00{l:G31},,,,,,,,,,,,,,,,,,46.5353102258066{l:Y31},-{l:Z31},-{l:AA31},1563329{l:AB31},72750{l:AC31},72750{l:AD31}`;

function App() {
  const [csvInput, setCsvInput] = useState(sampleCsvData);
  const [showLocations, setShowLocations] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'colors' | 'locations' | 'complex'>('colors');

  const handleDemoChange = (demo: 'colors' | 'locations' | 'complex') => {
    setActiveDemo(demo);
    if (demo === 'colors') {
      setCsvInput(sampleCsvData);
      setShowLocations(false);
    } else if (demo === 'locations') {
      setCsvInput(largeSampleCsv);
      setShowLocations(true);
    } else {
      setCsvInput(complexCsv);
      setShowLocations(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          FlaggedCsvComponent Demo
        </h1>
        
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => handleDemoChange('colors')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeDemo === 'colors' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Colors & Merge Demo
          </button>
          <button
            onClick={() => handleDemoChange('locations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeDemo === 'locations' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Location Flags Demo
          </button>
          <button
            onClick={() => handleDemoChange('complex')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeDemo === 'complex' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Complex CSV (Multi-line)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Input CSV (with flags)</h2>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-white"
              placeholder="Paste your flagged CSV data here..."
            />
            <div className="mt-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLocations}
                  onChange={(e) => setShowLocations(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Show cell locations</span>
              </label>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Rendered Table</h2>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <FlaggedCsvComponent 
                csvData={csvInput} 
                className="w-full"
                showCellLocations={showLocations}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Supported Flags:</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <code className="bg-white px-2 py-1 rounded">{'{#RRGGBB}'}</code> - Background color
            </li>
            <li>
              <code className="bg-white px-2 py-1 rounded">{'{MG:XXXXXX}'}</code> - Merge cells with same ID
            </li>
            <li>
              <code className="bg-white px-2 py-1 rounded">{'{l:CellRef}'}</code> - Original Excel cell location
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
