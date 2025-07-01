import React, { useState, useMemo } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';

import ActivityCard from './components/ActivityCard';
import ActivityFilters from './components/ActivityFilters';
import AddActivityModal from './components/AddActivityModal';

const ActivityTimeline = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    activityType: 'all',
    dateRange: 'all',
    teamMember: 'all',
    channel: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'email',
      channel: 'gmail',
      title: 'Follow-up Email Sent',
      description: `Hi Sarah,

Thank you for taking the time to discuss your company's CRM needs yesterday. I wanted to follow up on our conversation about implementing Hadi CRM Sales for your sales team.

Based on our discussion, I believe our Enterprise package would be the perfect fit for TechCorp's requirements. The advanced pipeline management and custom reporting features you mentioned are core strengths of our platform.

I've attached a detailed proposal outlining the implementation timeline and pricing structure. Would you be available for a brief call this Friday to discuss any questions you might have?

Best regards,
Michael`,
      contact: 'Sarah Johnson',company: 'TechCorp Solutions',timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),user: 'Michael Rodriguez',avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',contactAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',status: 'sent',priority: 'high',dealValue: '$45,000',
      attachments: ['proposal_techcorp_2024.pdf']
    },
    {
      id: 2,
      type: 'call',channel: 'twilio',title: 'Discovery Call Completed',
      description: `Conducted comprehensive discovery call with David Chen from InnovateTech. Key discussion points:

• Current CRM pain points: Manual data entry, lack of pipeline visibility
• Team size: 15 sales representatives across 3 regions
• Integration requirements: Salesforce migration, HubSpot data import
• Budget range: $30,000 - $50,000 annually
• Decision timeline: Q1 2024 implementation target
• Next steps: Technical demo scheduled for next Tuesday

David expressed strong interest in our automation features and real-time analytics. Identified opportunity for upselling advanced reporting module.`,
      contact: 'David Chen',company: 'InnovateTech',timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),user: 'Jennifer Walsh',avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',duration: '45 minutes',callType: 'outbound',status: 'completed',priority: 'medium',dealValue: '$42,000'
    },
    {
      id: 3,
      type: 'meeting',channel: 'calendar',title: 'Product Demo Scheduled',
      description: `Scheduled comprehensive product demonstration for GlobalTech's executive team. Meeting agenda includes:

• Platform overview and core features demonstration
• Custom workflow configuration examples
• Integration capabilities showcase
• ROI analysis and implementation timeline
• Q&A session with technical team
• Pricing discussion and proposal presentation

Attendees: CEO Mark Thompson, CTO Lisa Park, Sales Director Robert Kim, and IT Manager Amanda Foster. This is a critical milestone in our largest deal this quarter.`,
      contact: 'Mark Thompson',
      company: 'GlobalTech Industries',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      contactAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      meetingType: 'demo',
      location: 'GlobalTech HQ - Conference Room A',
      duration: '2 hours',
      status: 'scheduled',
      priority: 'high',
      dealValue: '$125,000',
      attendees: 4
    },
    {
      id: 4,
      type: 'deal_update',
      channel: 'system',
      title: 'Deal Stage Updated',
      description: `Deal "Enterprise CRM Implementation - TechCorp" moved from "Proposal Sent" to "Negotiation" stage.

Stage progression details:
• Previous stage: Proposal Sent (7 days)
• Current stage: Negotiation
• Probability updated: 60% → 75%
• Expected close date: March 15, 2024
• Deal value: $45,000

Automated follow-up tasks created:
• Schedule contract review meeting
• Prepare implementation timeline
• Coordinate with legal team for contract terms`,
      contact: 'Sarah Johnson',
      company: 'TechCorp Solutions',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      user: 'System',
      avatar: null,
      contactAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      previousStage: 'Proposal Sent',
      currentStage: 'Negotiation',
      probability: 75,
      status: 'updated',
      priority: 'medium',
      dealValue: '$45,000'
    },
    {
      id: 5,
      type: 'email',
      channel: 'gmail',
      title: 'Contract Terms Received',
      description: `Received contract terms and conditions from GlobalTech's legal team. Key points for review:

• Payment terms: Net 30 days
• Implementation timeline: 90 days from contract signing
• Data migration requirements: Full Salesforce export
• Training requirements: 20 hours of user training
• Support level: Premium support with 4-hour response SLA
• Contract duration: 3 years with annual renewal option

Legal review scheduled for tomorrow morning. Contract looks favorable with minor adjustments needed for implementation timeline.`,
      contact: 'Lisa Park',company: 'GlobalTech Industries',timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),user: 'Alex Thompson',avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',contactAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',status: 'received',priority: 'high',dealValue: '$125,000',
      attachments: ['contract_terms_globaltech.pdf', 'sla_agreement.pdf']
    },
    {
      id: 6,
      type: 'task',channel: 'system',title: 'Follow-up Task Completed',
      description: `Completed follow-up task: "Send pricing comparison document to InnovateTech"

Task details:
• Created: 3 days ago
• Assigned to: Jennifer Walsh
• Priority: High
• Due date: Today
• Status: Completed

Actions taken:
• Prepared comprehensive pricing comparison with competitors
• Highlighted Hadi CRM Sales's unique value propositions
• Included ROI calculator and implementation timeline
• Sent via email with read receipt confirmation

Next action: Schedule follow-up call within 48 hours to discuss pricing feedback.`,
      contact: 'David Chen',
      company: 'InnovateTech',
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
      user: 'Jennifer Walsh',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      contactAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      taskType: 'follow_up',
      status: 'completed',
      priority: 'high',
      dealValue: '$42,000'
    }
  ];

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesType = selectedFilters.activityType === 'all' || activity.type === selectedFilters.activityType;
      const matchesChannel = selectedFilters.channel === 'all' || activity.channel === selectedFilters.channel;
      const matchesSearch = searchQuery === '' || 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesDate = true;
      if (selectedFilters.dateRange !== 'all') {
        const now = new Date();
        const activityDate = new Date(activity.timestamp);
        switch (selectedFilters.dateRange) {
          case 'today':
            matchesDate = activityDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = activityDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = activityDate >= monthAgo;
            break;
        }
      }

      return matchesType && matchesChannel && matchesSearch && matchesDate;
    });
  }, [activities, selectedFilters, searchQuery]);

  const handleExportTimeline = () => {
    const exportData = filteredActivities.map(activity => ({
      timestamp: activity.timestamp.toISOString(),
      type: activity.type,
      title: activity.title,
      contact: activity.contact,
      company: activity.company,
      user: activity.user,
      description: activity.description
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_timeline_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Activity Timeline</h1>
              <p className="text-text-secondary">
                Unified view of all customer interactions across communication channels
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={handleExportTimeline}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-150 ease-out"
              >
                <Icon name="Download" size={16} />
                <span>Export Timeline</span>
              </button>
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Icon name="Plus" size={16} />
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search activities, contacts, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className={`lg:w-80 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-1 text-text-secondary hover:text-text-primary"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
                
                <ActivityFilters
                  selectedFilters={selectedFilters}
                  onFiltersChange={setSelectedFilters}
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50"
            >
              <Icon name="Filter" size={20} />
            </button>

            {/* Timeline Content */}
            <div className="flex-1">
              {/* Results Summary */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-text-secondary">
                  Showing {filteredActivities.length} of {activities.length} activities
                </div>
                
                {(selectedFilters.activityType !== 'all' || selectedFilters.dateRange !== 'all' || 
                  selectedFilters.channel !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedFilters({
                        activityType: 'all',
                        dateRange: 'all',
                        teamMember: 'all',
                        channel: 'all'
                      });
                      setSearchQuery('');
                    }}
                    className="text-sm text-primary hover:text-primary-700 transition-colors duration-150 ease-out"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      isLast={index === filteredActivities.length - 1}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Clock" size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No activities found</h3>
                    <p className="text-text-secondary mb-4">
                      Try adjusting your filters or search terms to find activities.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="btn-primary"
                    >
                      Add First Activity
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Activity Modal */}
      {isAddModalOpen && (
        <AddActivityModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ActivityTimeline;