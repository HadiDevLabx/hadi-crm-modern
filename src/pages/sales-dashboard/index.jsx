import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Chart from 'components/ui/Chart';

import RecentActivity from './components/RecentActivity';
import QuickActions from './components/QuickActions';
import UpcomingTasks from './components/UpcomingTasks';
import PipelineStage from './components/PipelineStage';
import PerformanceMetrics from './components/PerformanceMetrics';

const SalesDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('thisMonth');
  const [selectedProbability, setSelectedProbability] = useState('all');
  const [selectedTerritory, setSelectedTerritory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [deals, setDeals] = useState([]);

  // Mock data for pipeline stages
  const initialPipelineData = {
    'lead': {
      id: 'lead',
      title: 'Lead',
      deals: [
        {
          id: 'deal-1',
          title: 'Acme Corp - Enterprise License',
          value: 45000,
          probability: 20,
          contact: 'John Smith',
          company: 'Acme Corporation',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          daysInStage: 5,
          lastActivity: '2 hours ago'
        },
        {
          id: 'deal-2',
          title: 'TechStart - SaaS Platform',
          value: 28000,
          probability: 25,
          contact: 'Sarah Johnson',
          company: 'TechStart Inc',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          daysInStage: 3,
          lastActivity: '1 day ago'
        }
      ]
    },
    'qualified': {
      id: 'qualified',
      title: 'Qualified',
      deals: [
        {
          id: 'deal-3',
          title: 'Global Systems - Integration',
          value: 75000,
          probability: 40,
          contact: 'Michael Chen',
          company: 'Global Systems Ltd',
          avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
          daysInStage: 12,
          lastActivity: '3 hours ago'
        },
        {
          id: 'deal-4',
          title: 'InnovateCo - Digital Transform',
          value: 120000,
          probability: 45,
          contact: 'Emily Rodriguez',
          company: 'InnovateCo',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          daysInStage: 8,
          lastActivity: '5 hours ago'
        }
      ]
    },
    'proposal': {
      id: 'proposal',
      title: 'Proposal',
      deals: [
        {
          id: 'deal-5',
          title: 'MegaCorp - Enterprise Suite',
          value: 250000,
          probability: 70,
          contact: 'David Wilson',
          company: 'MegaCorp Industries',
          avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
          daysInStage: 15,
          lastActivity: '1 hour ago'
        }
      ]
    },
    'negotiation': {
      id: 'negotiation',
      title: 'Negotiation',
      deals: [
        {
          id: 'deal-6',
          title: 'FutureTech - Cloud Migration',
          value: 180000,
          probability: 85,
          contact: 'Lisa Thompson',
          company: 'FutureTech Solutions',
          avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
          daysInStage: 7,
          lastActivity: '30 minutes ago'
        }
      ]
    },
    'closed': {
      id: 'closed',
      title: 'Closed Won',
      deals: [
        {
          id: 'deal-7',
          title: 'StartupXYZ - Growth Package',
          value: 35000,
          probability: 100,
          contact: 'Alex Martinez',
          company: 'StartupXYZ',
          avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
          daysInStage: 2,
          lastActivity: 'Just closed'
        }
      ]
    }
  };

  const [pipelineData, setPipelineData] = useState(initialPipelineData);

  // Mock data for revenue forecast
  const revenueData = [
    { month: 'Jan', forecast: 450000, actual: 420000 },
    { month: 'Feb', forecast: 520000, actual: 485000 },
    { month: 'Mar', forecast: 580000, actual: 562000 },
    { month: 'Apr', forecast: 620000, actual: 598000 },
    { month: 'May', forecast: 680000, actual: 645000 },
    { month: 'Jun', forecast: 750000, actual: 0 }
  ];

  // Mock data for performance metrics
  const performanceData = {
    quota: 2500000,
    achieved: 1850000,
    percentage: 74,
    dealsWon: 23,
    dealsLost: 8,
    avgDealSize: 85000,
    conversionRate: 28.5
  };

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Handle drag and drop
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceStage = pipelineData[source.droppableId];
    const destStage = pipelineData[destination.droppableId];
    const draggedDeal = sourceStage.deals.find(deal => deal.id === draggableId);

    // Update probability based on stage
    const stageProbs = {
      'lead': 20,
      'qualified': 40,
      'proposal': 70,
      'negotiation': 85,
      'closed': 100
    };

    const updatedDeal = {
      ...draggedDeal,
      probability: stageProbs[destination.droppableId] || draggedDeal.probability,
      daysInStage: 0
    };

    // Remove from source
    const newSourceDeals = sourceStage.deals.filter(deal => deal.id !== draggableId);
    
    // Add to destination
    const newDestDeals = [...destStage.deals];
    newDestDeals.splice(destination.index, 0, updatedDeal);

    setPipelineData({
      ...pipelineData,
      [source.droppableId]: {
        ...sourceStage,
        deals: newSourceDeals
      },
      [destination.droppableId]: {
        ...destStage,
        deals: newDestDeals
      }
    });
  };

  // Calculate pipeline totals
  const calculateStageTotal = (stage) => {
    return stage.deals.reduce((total, deal) => total + deal.value, 0);
  };

  const calculateWeightedTotal = (stage) => {
    return stage.deals.reduce((total, deal) => total + (deal.value * deal.probability / 100), 0);
  };

  const totalPipelineValue = Object.values(pipelineData).reduce((total, stage) => 
    total + calculateStageTotal(stage), 0
  );

  const weightedPipelineValue = Object.values(pipelineData).reduce((total, stage) => 
    total + calculateWeightedTotal(stage), 0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />
          
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Sales Dashboard</h1>
              <p className="text-text-secondary">
                Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refresh every 5 minutes
              </p>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="input-field text-sm"
              >
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="thisQuarter">This Quarter</option>
                <option value="thisYear">This Year</option>
              </select>
              
              <select
                value={selectedProbability}
                onChange={(e) => setSelectedProbability(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All Probabilities</option>
                <option value="high">High (&gt;70%)</option>
                <option value="medium">Medium (30-70%)</option>
                <option value="low">Low (&lt;30%)</option>
              </select>
              
              <select
                value={selectedTerritory}
                onChange={(e) => setSelectedTerritory(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All Territories</option>
                <option value="north">North America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia Pacific</option>
              </select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-normal">Total Pipeline</p>
                  <p className="text-2xl font-normal text-text-primary">
                    ${(totalPipelineValue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-normal">Weighted Pipeline</p>
                  <p className="text-2xl font-normal text-text-primary">
                    ${(weightedPipelineValue / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                  <Icon name="Target" size={24} className="text-success" />
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-normal">Active Deals</p>
                  <p className="text-2xl font-normal text-text-primary">
                    {Object.values(pipelineData).reduce((total, stage) => total + stage.deals.length, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center">
                  <Icon name="Briefcase" size={24} className="text-secondary" />
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-normal">Quota Achievement</p>
                  <p className="text-2xl font-normal text-text-primary">{performanceData.percentage}%</p>
                </div>
                <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center">
                  <Icon name="Award" size={24} className="text-accent" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Pipeline Section */}
            <div className="xl:col-span-3 space-y-8">
              {/* Interactive Pipeline */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-normal text-text-primary">Sales Pipeline</h2>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="RefreshCw" size={16} />
                    <span>Drag deals to update stages</span>
                  </div>
                </div>
                
                <DragDropContext onDragEnd={onDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.values(pipelineData).map((stage) => (
                      <PipelineStage
                        key={stage.id}
                        stage={stage}
                        totalValue={calculateStageTotal(stage)}
                        weightedValue={calculateWeightedTotal(stage)}
                      />
                    ))}
                  </div>
                </DragDropContext>
              </div>

              {/* Revenue Forecast Chart */}
              <motion.div 
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-normal text-text-primary mb-6">Monthly Revenue Forecast</h2>
                <div className="h-80">
                  <Chart
                    type="bar"
                    data={revenueData}
                    xAxisKey="month"
                    height={320}
                    series={[
                      { dataKey: 'forecast', name: 'Forecast' },
                      { dataKey: 'actual', name: 'Actual' }
                    ]}
                    tooltipFormatter={(value) => `$${value.toLocaleString()}`}
                    animate={true}
                  />
                </div>
              </motion.div>

              {/* Performance Metrics */}
              <PerformanceMetrics data={performanceData} />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Upcoming Tasks */}
              <UpcomingTasks />
              
              {/* Recent Activity */}
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;