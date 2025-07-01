import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { cn } from '../../utils/shadcn-utils';
import { useGSAP } from '../../utils/gsap-animations';

// Custom D3 visualization component
export const D3Visualization = ({
  className,
  style,
  width = 600,
  height = 400,
  data = [],
  type = 'forcedirected',
  title,
  description,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  margin = { top: 40, right: 30, bottom: 50, left: 50 },
  animate = true,
  loading = false,
  ...props
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width, height });

  // Handle responsive resizing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleResize = () => {
      const containerWidth = containerRef.current.clientWidth;
      setDimensions({
        width: containerWidth,
        height: containerWidth * (height / width),
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef, height, width]);

  // Clear previous visualizations and render new one
  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height || loading || data.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;
    
    // Create a group element that respects margins
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Render different visualization types
    switch (type) {
      case 'forcedirected':
        renderForceDirected(g, innerWidth, innerHeight, data, colors, animate);
        break;
      case 'treemap':
        renderTreemap(g, innerWidth, innerHeight, data, colors, animate);
        break;
      case 'chord':
        renderChord(g, Math.min(innerWidth, innerHeight) / 2, data, colors, animate);
        break;
      case 'sankey':
        renderSankey(g, innerWidth, innerHeight, data, colors, animate);
        break;
      default:
        renderForceDirected(g, innerWidth, innerHeight, data, colors, animate);
    }
    
    // Add title if provided
    if (title) {
      svg.append('text')
        .attr('class', 'chart-title')
        .attr('text-anchor', 'middle')
        .attr('x', dimensions.width / 2)
        .attr('y', 20)
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(title);
    }
    
  }, [dimensions, data, type, colors, animate, loading, margin, title]);

  // GSAP animation for the container
  const gsapRef = useGSAP({
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    from: { opacity: 0, y: 20 }
  }, []);

  // Force directed graph visualization
  const renderForceDirected = (g, width, height, data, colors, animate) => {
    if (!data.nodes || !data.links) {
      console.error('Force directed graph requires nodes and links in data');
      return;
    }
    
    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => d.radius || 30));
    
    // Create links
    const link = g.append('g')
      .attr('stroke', '#999')
      .attr('strokeOpacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('strokeWidth', d => Math.sqrt(d.value || 1) * 1.5);
    
    // Create node groups
    const node = g.append('g')
      .selectAll('.node')
      .data(data.nodes)
      .join('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.radius || 20)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('stroke', '#fff')
      .attr('strokeWidth', 1.5);
    
    // Add text labels
    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .text(d => d.name)
      .style('font-size', '10px')
      .style('pointer-events', 'none');
    
    // Animation
    if (animate) {
      node.select('circle')
        .attr('r', 0)
        .transition()
        .duration(800)
        .attr('r', d => d.radius || 20);
      
      link
        .attr('stroke-dasharray', function() {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
        .attr('stroke-dashoffset', function() {
          return this.getTotalLength();
        })
        .transition()
        .duration(1000)
        .attr('stroke-dashoffset', 0);
    }
    
    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
        
      node
        .attr('transform', d => {
          d.x = Math.max(30, Math.min(width - 30, d.x));
          d.y = Math.max(30, Math.min(height - 30, d.y));
          return `translate(${d.x},${d.y})`;
        });
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };
  
  // Treemap visualization
  const renderTreemap = (g, width, height, data, colors, animate) => {
    if (!data.root) {
      console.error('Treemap requires hierarchical data with a root property');
      return;
    }
    
    // Hierarchy
    const root = d3.hierarchy(data.root)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
    
    // Create treemap layout
    const treemap = d3.treemap()
      .size([width, height])
      .padding(2)
      .round(true);
    
    treemap(root);
    
    // Create cells
    const cells = g.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);
    
    // Add rectangles
    cells.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('opacity', animate ? 0 : 0.8)
      .attr('stroke', '#fff')
      .transition()
      .duration(animate ? 800 : 0)
      .attr('opacity', 0.8);
    
    // Add text labels
    cells.append('text')
      .attr('x', d => (d.x1 - d.x0) / 2)
      .attr('y', d => (d.y1 - d.y0) / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .text(d => d.data.name)
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .style('opacity', animate ? 0 : 1)
      .style('text-overflow', 'ellipsis')
      .transition()
      .delay(animate ? 400 : 0)
      .duration(animate ? 400 : 0)
      .style('opacity', 1);
  };
  
  // Chord diagram visualization
  const renderChord = (g, radius, data, colors, animate) => {
    if (!data.matrix || !data.names) {
      console.error('Chord diagram requires matrix and names in data');
      return;
    }
    
    // Create chord layout
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);
    
    const chords = chord(data.matrix);
    
    // Create arc generator
    const arc = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius);
    
    // Create ribbon generator
    const ribbon = d3.ribbon()
      .radius(radius - 10);
    
    // Add groups
    const group = g.append('g')
      .attr('transform', `translate(${radius},${radius})`)
      .selectAll('g')
      .data(chords.groups)
      .join('g');
    
    // Add arcs
    group.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('stroke', '#fff')
      .style('opacity', animate ? 0 : 0.7)
      .transition()
      .duration(animate ? 800 : 0)
      .style('opacity', 0.7);
    
    // Add labels
    group.append('text')
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '.35em')
      .attr('transform', d => {
        return `rotate(${d.angle * 180 / Math.PI - 90})
          translate(${radius + 10})
          ${d.angle > Math.PI ? 'rotate(180)' : ''}`;
      })
      .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
      .text((d, i) => data.names[i])
      .style('font-size', '10px')
      .style('opacity', animate ? 0 : 1)
      .transition()
      .delay(animate ? 400 : 0)
      .duration(animate ? 400 : 0)
      .style('opacity', 1);
    
    // Add ribbons
    g.append('g')
      .attr('transform', `translate(${radius},${radius})`)
      .attr('fill-opacity', 0.5)
      .selectAll('path')
      .data(chords)
      .join('path')
      .attr('d', ribbon)
      .attr('fill', d => colors[d.source.index % colors.length])
      .attr('stroke', '#fff')
      .style('opacity', animate ? 0 : 0.7)
      .transition()
      .duration(animate ? 1000 : 0)
      .style('opacity', 0.7);
  };
  
  // Sankey diagram visualization
  const renderSankey = (g, width, height, data, colors, animate) => {
    if (!data.nodes || !data.links) {
      console.error('Sankey diagram requires nodes and links in data');
      return;
    }
    
    // Create Sankey generator
    const sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[0, 0], [width, height]]);
    
    // Generate layout
    const { nodes, links } = sankey({
      nodes: data.nodes.map(d => Object.assign({}, d)),
      links: data.links.map(d => Object.assign({}, d))
    });
    
    // Create links
    const link = g.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', (d, i) => d3.color(colors[i % colors.length]).darker(0.5))
      .attr('strokeWidth', d => Math.max(1, d.width))
      .attr('fill', 'none')
      .style('opacity', animate ? 0 : 0.5)
      .transition()
      .duration(animate ? 800 : 0)
      .style('opacity', 0.5);
    
    // Create nodes
    const node = g.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('opacity', animate ? 0 : 0.8)
      .transition()
      .duration(animate ? 800 : 0)
      .attr('opacity', 0.8);
    
    // Add labels
    g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .text(d => d.name)
      .style('font-size', '10px')
      .style('opacity', animate ? 0 : 1)
      .transition()
      .delay(animate ? 400 : 0)
      .duration(animate ? 400 : 0)
      .style('opacity', 1);
  };

  return (
    <motion.div
      ref={gsapRef}
      className={cn(
        'relative rounded-lg overflow-hidden',
        loading ? 'animate-pulse' : '',
        className
      )}
      style={style}
      {...props}
    >
      <div ref={containerRef} className="w-full h-full">
        {loading ? (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No data available
          </div>
        ) : (
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="overflow-visible"
          />
        )}
      </div>

      {description && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </div>
      )}
    </motion.div>
  );
};

export default D3Visualization;
