import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import { Icon3D, NavigationIcon3D } from 'components/ui/Icon3D';
import { Card3DContainer, Feature3DCard } from 'components/ui/Card3D';
import { Avatar3D } from 'components/ui/Avatar3D';
import { Dashboard3D, Dashboard3DDemo } from 'components/ui/Dashboard3D';
import D3Visualization from 'components/ui/D3Visualization';
import { WorkflowDiagram, FlowProvider } from 'components/ui/WorkflowDiagram';
import Chart from 'components/ui/Chart';

const UIDemo = () => {
  const [activeTab, setActiveTab] = useState('3d-elements');

  // Sample data for charts and visualizations
  const salesData = [
    { month: 'Jan', sales: 1200, target: 1000, leads: 150 },
    { month: 'Feb', sales: 1900, target: 1300, leads: 220 },
    { month: 'Mar', sales: 1300, target: 1400, leads: 180 },
    { month: 'Apr', sales: 1700, target: 1500, leads: 250 },
    { month: 'May', sales: 1500, target: 1600, leads: 210 },
    { month: 'Jun', sales: 2300, target: 1700, leads: 340 },
  ];

  // Sample force directed graph data
  const forceDirectedData = {
    nodes: [
      { id: '1', name: 'Company A', radius: 30 },
      { id: '2', name: 'Company B', radius: 25 },
      { id: '3', name: 'Company C', radius: 20 },
      { id: '4', name: 'Company D', radius: 15 },
      { id: '5', name: 'Company E', radius: 25 },
      { id: '6', name: 'Company F', radius: 20 },
    ],
    links: [
      { source: '1', target: '2', value: 5 },
      { source: '1', target: '3', value: 3 },
      { source: '2', target: '3', value: 2 },
      { source: '2', target: '4', value: 1 },
      { source: '3', target: '5', value: 4 },
      { source: '4', target: '5', value: 2 },
      { source: '5', target: '6', value: 3 },
      { source: '1', target: '6', value: 1 },
    ]
  };

  // Sample chord diagram data
  const chordData = {
    matrix: [
      [0, 5, 3, 2, 1],
      [5, 0, 2, 1, 3],
      [3, 2, 0, 4, 2],
      [2, 1, 4, 0, 3],
      [1, 3, 2, 3, 0]
    ],
    names: ['Sales', 'Marketing', 'Support', 'Development', 'Management']
  };

  // Sample workflow diagram data
  const initialNodes = [
    {
      id: '1',
      type: 'custom',
      data: { label: 'Lead Created', type: 'input' },
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      type: 'custom',
      data: { label: 'Qualify Lead', type: 'action' },
      position: { x: 0, y: 100 },
    },
    {
      id: '3',
      type: 'custom',
      data: { label: 'Is Qualified?', type: 'decision' },
      position: { x: 0, y: 200 },
    },
    {
      id: '4',
      type: 'custom',
      data: { label: 'Send Proposal', type: 'action' },
      position: { x: -200, y: 300 },
    },
    {
      id: '5',
      type: 'custom',
      data: { label: 'Archive Lead', type: 'output' },
      position: { x: 200, y: 300 },
    },
    {
      id: '6',
      type: 'custom',
      data: { label: 'Follow Up', type: 'action' },
      position: { x: -200, y: 400 },
    },
    {
      id: '7',
      type: 'custom',
      data: { label: 'Deal Won', type: 'output' },
      position: { x: -200, y: 500 },
    },
  ];
  
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true, label: 'Yes' },
    { id: 'e3-5', source: '3', target: '5', animated: true, label: 'No' },
    { id: 'e4-6', source: '4', target: '6', animated: true },
    { id: 'e6-7', source: '6', target: '7', animated: true },
  ];

  const tabItems = [
    { id: '3d-elements', label: '3D Elements', icon: 'Cube' },
    { id: 'data-visualizations', label: 'Data Visualizations', icon: 'BarChart3' },
    { id: 'workflow-diagrams', label: 'Workflow Diagrams', icon: 'GitBranch' },
    { id: '3d-dashboard', label: '3D Dashboard', icon: 'Layout' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />
          
          {/* Page Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Advanced UI Components
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Explore our collection of 3D elements, interactive data visualizations, and workflow diagrams for modern CRM interfaces.
            </p>
          </motion.div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`pb-4 px-1 font-medium text-sm flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mb-8">
            {/* 3D Elements Tab */}
            {activeTab === '3d-elements' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">3D Elements</h2>
                
                {/* 3D Icons Section */}
                <div className="mb-12">
                  <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">3D Icons</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    <NavigationIcon3D icon="home" label="Dashboard" active={true} />
                    <NavigationIcon3D icon="contacts" label="Contacts" />
                    <NavigationIcon3D icon="deals" label="Deals" />
                    <NavigationIcon3D icon="tasks" label="Tasks" />
                    <NavigationIcon3D icon="calendar" label="Calendar" />
                    <NavigationIcon3D icon="reports" label="Reports" />
                  </div>
                </div>
                
                {/* 3D Cards Section */}
                <div className="mb-12">
                  <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">3D Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Feature3DCard 
                      title="Contact Management" 
                      description="Centralize your customer information in one place."
                      iconName="users" 
                      color="#3B82F6"
                    />
                    <Feature3DCard 
                      title="Deal Tracking" 
                      description="Track and manage your sales pipeline effectively."
                      iconName="trending-up" 
                      color="#10B981"
                    />
                    <Feature3DCard 
                      title="Analytics" 
                      description="Gain insights with powerful reporting features."
                      iconName="bar-chart-2" 
                      color="#F59E0B"
                    />
                  </div>
                </div>
                
                {/* 3D Avatars Section */}
                <div className="mb-12">
                  <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">3D Avatars</h3>
                  <div className="flex flex-wrap gap-8 justify-center">
                    <div className="flex flex-col items-center">
                      <Avatar3D 
                        size={120}
                        fallbackImage="https://randomuser.me/api/portraits/men/32.jpg"
                      />
                      <span className="mt-2 font-medium">John Smith</span>
                      <span className="text-sm text-gray-500">Sales Manager</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Avatar3D 
                        size={120}
                        fallbackImage="https://randomuser.me/api/portraits/women/44.jpg"
                      />
                      <span className="mt-2 font-medium">Sarah Johnson</span>
                      <span className="text-sm text-gray-500">Marketing Lead</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Avatar3D 
                        size={120}
                        fallbackImage="https://randomuser.me/api/portraits/men/67.jpg"
                      />
                      <span className="mt-2 font-medium">Michael Chen</span>
                      <span className="text-sm text-gray-500">Support Agent</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Data Visualizations Tab */}
            {activeTab === 'data-visualizations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Data Visualizations</h2>
                
                {/* Recharts Section */}
                <div className="mb-12">
                  <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Interactive Charts</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h4 className="text-base font-medium mb-4">Sales Performance</h4>
                      <Chart
                        type="line"
                        data={salesData}
                        xAxisKey="month"
                        series={[
                          { dataKey: 'sales', name: 'Sales' },
                          { dataKey: 'target', name: 'Target' }
                        ]}
                        height={300}
                      />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h4 className="text-base font-medium mb-4">Lead Conversion</h4>
                      <Chart
                        type="bar"
                        data={salesData}
                        xAxisKey="month"
                        series={[
                          { dataKey: 'sales', name: 'Sales' },
                          { dataKey: 'leads', name: 'Leads' }
                        ]}
                        height={300}
                      />
                    </div>
                  </div>
                </div>
                
                {/* D3 Visualizations Section */}
                <div className="mb-12">
                  <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Advanced Data Visualizations</h3>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h4 className="text-base font-medium mb-4">Network Relationships</h4>
                      <D3Visualization
                        type="forcedirected"
                        data={forceDirectedData}
                        height={400}
                        title="Company Relationships"
                        description="Force-directed graph showing connections between companies."
                      />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h4 className="text-base font-medium mb-4">Department Interactions</h4>
                      <D3Visualization
                        type="chord"
                        data={chordData}
                        height={500}
                        title="Department Interactions"
                        description="Chord diagram showing interactions between different departments."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Workflow Diagrams Tab */}
            {activeTab === 'workflow-diagrams' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Workflow Diagrams</h2>
                
                <div className="mb-12">
                  <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Sales Process Workflow</h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <FlowProvider>
                      <WorkflowDiagram
                        height={500}
                        nodes={initialNodes}
                        edges={initialEdges}
                        autoLayout={true}
                      />
                    </FlowProvider>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* 3D Dashboard Tab */}
            {activeTab === '3d-dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">3D Dashboard</h2>
                
                <div className="mb-12">
                  <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Interactive 3D Dashboard</h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      This dashboard presents your key performance indicators in a 3D interactive space. 
                      Click on panels to expand them and interact with the data.
                    </p>
                    <Dashboard3DDemo />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UIDemo;
