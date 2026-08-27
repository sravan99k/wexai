
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { SkillAssessment } from './pages/SkillAssessment'
import { CareerGraph } from './pages/CareerGraph'
import { Jobs } from './pages/Jobs'
import { JobDetails } from './pages/JobDetails'
import { DataProvider } from './context/DataContext'

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessment" element={<SkillAssessment />} />
            <Route path="/career-graph" element={<CareerGraph />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
          </Routes>
        </MainLayout>
      </DataProvider>
    </BrowserRouter>
  )
}

export default App
