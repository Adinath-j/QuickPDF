import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { PageContainer } from './components/layout/PageContainer';
import { Button } from './components/ui/Button';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <PageContainer>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Privacy-First PDF Tools
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl">
                All processing happens directly in your browser. Your files never leave your device.
              </p>
              <div className="flex gap-4">
                <Button variant="primary">Try Merge</Button>
                <Button variant="outline">Try Split</Button>
              </div>
            </div>
          } />

          {/* Placeholders for Step 3 */}
          <Route path="/merge" element={<h2 className="text-2xl font-bold">Merge Page Coming Soon</h2>} />
          <Route path="/split" element={<h2 className="text-2xl font-bold">Split Page Coming Soon</h2>} />
        </Routes>
      </PageContainer>
    </div>
  );
}

export default App;