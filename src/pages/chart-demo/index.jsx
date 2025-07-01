import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from '../../components/ui/Chart';
import { cn } from '../../utils/cn';

// Sample data
const salesData = [
  { month: 'Jan', sales: 1200, target: 1000, leads: 150 },
  { month: 'Feb', sales: 1900, target: 1300, leads: 220 },
  { month: 'Mar', sales: 1300, target: 1400, leads: 180 },
  { month: 'Apr', sales: 1700, target: 1500, leads: 250 },
  { month: 'May', sales: 1500, target: 1600, leads: 210 },
  { month: 'Jun', sales: 2300, target: 1700, leads: 340 },
];

const pipelineData = [
  { name: 'Discovery', value: 12 },
  { name: 'Qualification', value: 24 },
  { name: 'Proposal', value: 18 },
  { name: 'Negotiation', value: 10 },
  { name: 'Closing', value: 8 },
];

const marketingData = [
  { month: 'Jan', email: 45, social: 80, direct: 25 },
  { month: 'Feb', email: 58, social: 90, direct: 32 },
  { month: 'Mar', email: 65, social: 102, direct: 45 },
  { month: 'Apr', email: 70, social: 120, direct: 50 },
  { month: 'May', email: 85, social: 115, direct: 65 },
  { month: 'Jun', email: 100, social: 130, direct: 70 },
];

const performanceData = [
  { agent: 'Alex', sales: 140, deals: 12 },
  { agent: 'Maria', sales: 230, deals: 18 },
  { agent: 'John', sales: 120, deals: 9 },
  { agent: 'Sarah', sales: 180, deals: 14 },
  { agent: 'David', sales: 210, deals: 17 },
];

const ChartDemo = () => {
  const [loading, setLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Format currency
  const currencyFormatter = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const dateFormatter = (month) => {
    return new Date(`2023 ${month}`).toLocaleDateString('en-US', { month: 'long' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interactive Charts with Animations
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
          <Chart
            type="line"
            data={salesData}
            xAxisKey="month"
            series={[
              { dataKey: 'sales', name: 'Sales' },
              { dataKey: 'target', name: 'Target' }
            ]}
            height={300}
            loading={loading}
            tooltipFormatter={currencyFormatter}
            labelFormatter={dateFormatter}
          />
        </motion.div>

        {/* Bar Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
          <Chart
            type="bar"
            data={performanceData}
            xAxisKey="agent"
            series={[
              { dataKey: 'sales', name: 'Sales ($K)' },
              { dataKey: 'deals', name: 'Deals Closed' }
            ]}
            height={300}
            loading={loading}
          />
        </motion.div>

        {/* Area Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Marketing Channels</h2>
          <Chart
            type="area"
            data={marketingData}
            xAxisKey="month"
            series={[
              { dataKey: 'email', name: 'Email' },
              { dataKey: 'social', name: 'Social Media' },
              { dataKey: 'direct', name: 'Direct' }
            ]}
            stacked={true}
            height={300}
            loading={loading}
            labelFormatter={dateFormatter}
          />
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Pipeline Distribution</h2>
          <Chart
            type="pie"
            data={pipelineData}
            xAxisKey="name"
            series={[{ dataKey: 'value', name: 'Deals' }]}
            height={300}
            loading={loading}
          />
        </motion.div>
      </div>

      <motion.div 
        className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Sales & Leads Correlation</h2>
        <Chart
          type="line"
          data={salesData}
          xAxisKey="month"
          series={[
            { dataKey: 'sales', name: 'Sales ($)' },
            { dataKey: 'leads', name: 'Leads' }
          ]}
          height={350}
          loading={loading}
          tooltipFormatter={(value, name) => name === 'Sales ($)' ? currencyFormatter(value) : value}
          labelFormatter={dateFormatter}
        />
      </motion.div>
    </div>
  );
};

export default ChartDemo;
