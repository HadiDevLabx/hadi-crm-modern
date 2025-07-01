# CRM UI Components Library

This document provides an overview of the UI component library built for the CRM application, focusing on the chart components and animations.

## Chart Component

The `Chart` component provides a flexible and animated charting solution based on Recharts. It supports multiple chart types with consistent styling and animation features.

### Features

- Multiple chart types: line, bar, area, and pie charts
- Animated transitions powered by Framer Motion
- Consistent styling across all chart types
- Custom tooltips with formatting options
- Loading states and empty states
- Responsive design that adapts to container size

### Usage

```jsx
import Chart from 'components/ui/Chart';

// Example usage
<Chart
  type="line" // 'line', 'bar', 'area', or 'pie'
  data={salesData}
  xAxisKey="month"
  series={[
    { dataKey: 'sales', name: 'Sales' },
    { dataKey: 'target', name: 'Target' }
  ]}
  height={300}
  tooltipFormatter={(value) => `$${value.toLocaleString()}`}
  animate={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | string | 'line' | Chart type: 'line', 'bar', 'area', 'pie' |
| data | array | [] | Array of data objects |
| width | string/number | '100%' | Width of the chart |
| height | number | 400 | Height of the chart |
| margin | object | { top: 20, right: 30, left: 20, bottom: 20 } | Chart margins |
| xAxisKey | string | 'name' | Data key for X axis |
| series | array | [] | Array of series objects with dataKey and name |
| grid | boolean | true | Whether to show grid lines |
| colors | array | DEFAULT_COLORS | Array of colors for the series |
| animate | boolean | true | Whether to animate the chart |
| stacked | boolean | false | Whether to stack the series (for bar and area) |
| tooltip | boolean | true | Whether to show tooltips |
| legend | boolean | true | Whether to show the legend |
| tooltipFormatter | function | undefined | Function to format tooltip values |
| labelFormatter | function | undefined | Function to format axis labels |
| loading | boolean | false | Whether the chart is in loading state |
| emptyMessage | string | 'No data to display' | Message to show when no data is available |

## Animation Utilities

The project includes animation utilities powered by GSAP and Framer Motion:

### GSAP Animation Hooks

Located in `src/utils/gsap-animations.js`:

- `useGSAP`: Basic GSAP animations
- `useGSAPStagger`: Staggered animations for groups of elements
- `useScrollAnimation`: Scroll-triggered animations
- `useSectionAnimation`: Predefined animations for section entrance
- `useChartAnimation`: Timeline animations for chart data visualization

### Usage Example

```jsx
import { useSectionAnimation } from 'utils/gsap-animations';

const MyComponent = () => {
  // Reference for the element to animate on scroll
  const sectionRef = useSectionAnimation('up', {
    from: { opacity: 0, y: 100 },
    to: { duration: 1, ease: 'power2.out' }
  });
  
  return (
    <div ref={sectionRef} className="my-section">
      Content that animates on scroll
    </div>
  );
};
```

## Demo

A comprehensive demo of the Chart component is available at the `/chart-demo` route, showcasing:

- Different chart types (line, bar, area, pie)
- Animation capabilities
- Tooltip formatting
- Responsive behavior
- Loading states

## Integration Examples

The Chart component has been integrated in:

1. **Sales Dashboard** - Revenue forecast bar chart
2. **Pipeline Analytics** - Revenue trend line chart and win rate analysis

## Future Enhancements

- Add more chart types (scatter, radar, etc.)
- Implement drill-down functionality
- Add export options (PNG, SVG)
- Create chart theme presets
- Add more animation variations
