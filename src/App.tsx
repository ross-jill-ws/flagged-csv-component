import './App.css'
import FlaggedCsvComponent from './components/FlaggedCsvComponent'

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        FlaggedCsvComponent Demo
      </h1>
      <div className="mt-8">
        <FlaggedCsvComponent className="p-4 border rounded-lg" />
      </div>
    </>
  )
}

export default App
