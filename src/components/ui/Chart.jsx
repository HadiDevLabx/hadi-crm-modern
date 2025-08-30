import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Sector
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Default colors for charts
const DEFAULT_COLORS = [
  '#1E3A8A', // primary
  '#10B981', // secondary
  '#F59E0B', // accent
  '#6366F1', // indigo
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#3B82F6', // blue
  '#22C55E', // green
  '#F97316', // orange
  '#EF4444', // red
];

// Animation variants
const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Enhanced chart tooltip
const CustomTooltip = ({ active, payload, label, formatter, labelFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2 mb-1 last:mb-0">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              <span className="text-gray-700 dark:text-gray-200">
                {formatter ? formatter(entry.value, entry.name) : entry.value}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Active sector for pie chart
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 15}
        outerRadius={outerRadius + 20}
        fill={fill}
      />
      <text x={cx} y={cy} dy={-15} textAnchor="middle" fill={fill} className="text-sm font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#999" className="text-sm">
        {`${value} (${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

// Chart components
const Chart = ({
  type = 'line',
  data = [],
  width = '100%',
  height = 400,
  margin = { top: 20, right: 30, left: 20, bottom: 20 },
  series = [],
  xAxisKey = 'name',
  grid = true,
  colors = DEFAULT_COLORS,
  animate = true,
  stacked = false,
  tooltip = true,
  legend = true,
  className,
  tooltipFormatter,
  labelFormatter,
  loading = false,
  emptyMessage = "No data to display",
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePieIndex, setActivePieIndex] = useState(-1);
  
  // Handle empty data
  if (data.length === 0 || series.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center", 
        className
      )} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn(
        "animate-pulse", 
        className
      )} style={{ height }}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded w-full h-full" />
      </div>
    );
  }
  
  // Common chart props
  const commonProps = {
    width: '100%',
    height: '100%',
    data,
    margin
  };
  
  // Cartesian chart props (line, bar, area)
  const cartesianProps = {
    ...commonProps,
    children: (
      <>
        {grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: '#6B7280' }} 
          axisLine={{ stroke: '#E5E7EB' }} 
          tickLine={{ stroke: '#E5E7EB' }} 
        />
        <YAxis 
          tick={{ fill: '#6B7280' }} 
          axisLine={{ stroke: '#E5E7EB' }} 
          tickLine={{ stroke: '#E5E7EB' }} 
        />
        {tooltip && (
          <Tooltip 
            content={<CustomTooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />} 
          />
        )}
        {legend && <Legend wrapperStyle={{ paddingTop: 10 }} />}
        {series.map((item, index) => {
          const Component = {
            line: Line,
            bar: Bar,
            area: Area,
          }[type];
          
          return (
            <Component
              key={item.dataKey}
              type={type === 'area' ? 'monotone' : undefined}
              dataKey={item.dataKey}
              name={item.name || item.dataKey}
              stroke={item.color || colors[index % colors.length]}
              fill={item.color || colors[index % colors.length]}
              fillOpacity={type === 'area' ? 0.3 : 1}
              stackId={stacked ? 'stack' : undefined}
              activeDot={type === 'line' || type === 'area' ? { r: 6, strokeWidth: 2 } : undefined}
              isAnimationActive={animate}
            />
          );
        })}
      </>
    )
  };

  // Render appropriate chart type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <LineChart {...cartesianProps} />;
      case 'bar':
        return <BarChart {...cartesianProps} />;
      case 'area':
        return <AreaChart {...cartesianProps} />;
      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey={series[0]?.dataKey || 'value'}
              nameKey={xAxisKey}
              isAnimationActive={animate}
              activeIndex={activePieIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActivePieIndex(index)}
              onMouseLeave={() => setActivePieIndex(-1)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                />
              ))}
            </Pie>
            {tooltip && (
              <Tooltip 
                content={<CustomTooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />} 
              />
            )}
            {legend && <Legend wrapperStyle={{ paddingTop: 20 }} />}
          </PieChart>
        );
      default:
        return <LineChart {...cartesianProps} />;
    }
  };
  
  const ChartComponent = animate ? motion.div : 'div';
  const animationProps = animate ? {
    variants: chartVariants,
    initial: "hidden",
    animate: "visible"
  } : {};

  return (
    <ChartComponent 
      className={cn("w-full", className)} 
      style={{ height }} 
      {...animationProps}
      {...props}
    >
      <ResponsiveContainer>
        {renderChart()}
      </ResponsiveContainer>
    </ChartComponent>
  );
};

export default Chart;

