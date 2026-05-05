import { useState } from 'react'
import Overview from './components/Overview'
import Dataset from './components/Dataset'
import Models from './components/Models'
import Results from './components/Results'
import Pipeline from './components/Pipeline'
import Demo from './components/Demo'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <Overview />
      case 'dataset': return <Dataset />
      case 'models': return <Models />
      case 'results': return <Results />
      case 'pipeline': return <Pipeline />
      case 'demo': return <Demo />
      default: return <Overview />
    }
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <span className="icon">⚖️</span> SmartScale AI
        </div>
        <div className="nav-tabs">
          <button className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`nav-tab ${activeTab === 'dataset' ? 'active' : ''}`} onClick={() => setActiveTab('dataset')}>Dataset</button>
          <button className={`nav-tab ${activeTab === 'models' ? 'active' : ''}`} onClick={() => setActiveTab('models')}>Models</button>
          <button className={`nav-tab ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>Results</button>
          <button className={`nav-tab ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>Pipeline</button>
          <button className={`nav-tab ${activeTab === 'demo' ? 'active' : ''}`} onClick={() => setActiveTab('demo')}>Live Demo</button>
        </div>
      </nav>
      <main className="main">
        {renderContent()}
      </main>
    </>
  )
}

export default App
