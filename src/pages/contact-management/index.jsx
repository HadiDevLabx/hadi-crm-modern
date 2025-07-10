/**
 * Contact Management Component
 * Last updated: July 10, 2025 - Built contact list interface with filtering
 */
import React, { useState, useEffect } from 'react';

import Icon from 'components/AppIcon';

import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import ContactForm from './components/ContactForm';
import ImportContactsModal from './components/ImportContactsModal';
import ExportContactsModal from './components/ExportContactsModal';
import MergeDuplicatesModal from './components/MergeDuplicatesModal';
import FilterPanel from './components/FilterPanel';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    company: [],
    dealStage: [],
    lastContactDate: null,
    tags: []
  });

  // Mock data for contacts
  const mockContacts = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@acmecorp.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corporation",
      position: "Chief Technology Officer",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      lastContactDate: "2023-06-15T14:30:00",
      status: "active",
      tags: ["enterprise", "tech", "decision-maker"],
      deals: [
        { id: 101, name: "Enterprise Software Upgrade", value: 125000, stage: "negotiation" },
        { id: 102, name: "Cloud Migration Project", value: 85000, stage: "closed-won" }
      ],
      notes: "Sarah has been with Acme for 5 years. She\'s the primary decision-maker for all technology purchases.",
      socialProfiles: {
        linkedin: "linkedin.com/in/sarahjohnson",
        twitter: "twitter.com/sarahjtech"
      },
      activities: [
        {
          id: 1001,
          type: "email",
          date: "2023-06-15T14:30:00",
          subject: "Follow-up on proposal",
          content: "Sent detailed pricing breakdown and implementation timeline."
        },
        {
          id: 1002,
          type: "call",
          date: "2023-06-10T11:15:00",
          duration: 25,
          summary: "Discussed technical requirements and integration points."
        },
        {
          id: 1003,
          type: "meeting",
          date: "2023-05-28T09:00:00",
          duration: 60,
          summary: "Initial presentation of solution to technical team."
        }
      ],
      customFields: {
        preferredContactMethod: "email",
        decisionTimeframe: "Q3 2023",
        budgetRange: "$100K-$250K"
      }
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@globex.com",
      phone: "+1 (555) 987-6543",
      company: "Globex Industries",
      position: "Procurement Director",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      lastContactDate: "2023-06-18T10:15:00",
      status: "active",
      tags: ["manufacturing", "mid-market", "procurement"],
      deals: [
        { id: 103, name: "Supply Chain Management System", value: 78000, stage: "proposal" }
      ],
      notes: "Michael oversees all vendor relationships and has a structured procurement process.",
      socialProfiles: {
        linkedin: "linkedin.com/in/michaelchen"
      },
      activities: [
        {
          id: 1004,
          type: "email",
          date: "2023-06-18T10:15:00",
          subject: "Proposal revisions",
          content: "Requested adjustments to service level agreements and support terms."
        },
        {
          id: 1005,
          type: "meeting",
          date: "2023-06-05T13:30:00",
          duration: 45,
          summary: "Demo of supply chain management features."
        }
      ],
      customFields: {
        preferredContactMethod: "phone",
        decisionTimeframe: "Q4 2023",
        budgetRange: "$50K-$100K"
      }
    },
    {
      id: 3,
      firstName: "Jessica",
      lastName: "Martinez",
      email: "jessica.martinez@soylent.corp",
      phone: "+1 (555) 234-5678",
      company: "Soylent Corp",
      position: "VP of Marketing",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      lastContactDate: "2023-06-20T15:45:00",
      status: "active",
      tags: ["marketing", "enterprise", "fast-growth"],
      deals: [
        { id: 104, name: "Marketing Automation Platform", value: 95000, stage: "discovery" },
        { id: 105, name: "Analytics Dashboard Implementation", value: 45000, stage: "negotiation" }
      ],
      notes: "Jessica is expanding her marketing team and looking to implement new technologies.",
      socialProfiles: {
        linkedin: "linkedin.com/in/jessicamartinez",
        twitter: "twitter.com/jessicamktg"
      },
      activities: [
        {
          id: 1006,
          type: "call",
          date: "2023-06-20T15:45:00",
          duration: 30,
          summary: "Discussed marketing automation requirements and team structure."
        },
        {
          id: 1007,
          type: "email",
          date: "2023-06-12T09:20:00",
          subject: "Case studies request",
          content: "Sent over case studies from similar companies in their industry."
        }
      ],
      customFields: {
        preferredContactMethod: "video call",
        decisionTimeframe: "Q3 2023",
        budgetRange: "$75K-$150K"
      }
    },
    {
      id: 4,
      firstName: "Robert",
      lastName: "Williams",
      email: "robert.williams@initech.com",
      phone: "+1 (555) 876-5432",
      company: "Initech",
      position: "IT Manager",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      lastContactDate: "2023-06-14T11:00:00",
      status: "inactive",
      tags: ["tech", "small-business"],
      deals: [
        { id: 106, name: "Network Infrastructure Upgrade", value: 35000, stage: "closed-lost" }
      ],
      notes: "Robert was interested but budget constraints led to project cancellation.",
      socialProfiles: {
        linkedin: "linkedin.com/in/robertwilliams"
      },
      activities: [
        {
          id: 1008,
          type: "email",
          date: "2023-06-14T11:00:00",
          subject: "Project status update",
          content: "Informed us that the project is on hold due to budget constraints."
        },
        {
          id: 1009,
          type: "meeting",
          date: "2023-05-30T14:00:00",
          duration: 60,
          summary: "Initial needs assessment and infrastructure review."
        }
      ],
      customFields: {
        preferredContactMethod: "email",
        decisionTimeframe: "On hold",
        budgetRange: "$25K-$50K"
      }
    },
    {
      id: 5,
      firstName: "Emily",
      lastName: "Taylor",
      email: "emily.taylor@umbrella.org",
      phone: "+1 (555) 345-6789",
      company: "Umbrella Corporation",
      position: "Director of Operations",
      avatar: "https://randomuser.me/api/portraits/women/15.jpg",
      lastContactDate: "2023-06-19T13:30:00",
      status: "active",
      tags: ["healthcare", "enterprise", "operations"],
      deals: [
        { id: 107, name: "Operational Efficiency Software", value: 120000, stage: "discovery" }
      ],
      notes: "Emily is focused on improving operational efficiency across multiple departments.",
      socialProfiles: {
        linkedin: "linkedin.com/in/emilytaylor"
      },
      activities: [
        {
          id: 1010,
          type: "email",
          date: "2023-06-19T13:30:00",
          subject: "Meeting confirmation",
          content: "Confirmed upcoming demo with her team and provided agenda."
        },
        {
          id: 1011,
          type: "call",
          date: "2023-06-08T10:45:00",
          duration: 20,
          summary: "Initial discussion about operational challenges and goals."
        }
      ],
      customFields: {
        preferredContactMethod: "phone",
        decisionTimeframe: "Q4 2023",
        budgetRange: "$100K-$200K"
      }
    },
    {
      id: 6,
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@wayne.enterprises",
      phone: "+1 (555) 456-7890",
      company: "Wayne Enterprises",
      position: "CFO",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      lastContactDate: "2023-06-16T09:00:00",
      status: "active",
      tags: ["finance", "enterprise", "decision-maker"],
      deals: [
        { id: 108, name: "Financial Reporting System", value: 150000, stage: "proposal" },
        { id: 109, name: "Compliance Management Tool", value: 65000, stage: "discovery" }
      ],
      notes: "David is particularly concerned about regulatory compliance and reporting accuracy.",
      socialProfiles: {
        linkedin: "linkedin.com/in/davidkim"
      },
      activities: [
        {
          id: 1012,
          type: "meeting",
          date: "2023-06-16T09:00:00",
          duration: 45,
          summary: "Reviewed proposal with finance team and discussed implementation timeline."
        },
        {
          id: 1013,
          type: "email",
          date: "2023-06-07T16:20:00",
          subject: "Compliance requirements",
          content: "Sent detailed information about how our solution addresses specific compliance requirements."
        }
      ],
      customFields: {
        preferredContactMethod: "in-person",
        decisionTimeframe: "Q3 2023",
        budgetRange: "$150K-$300K"
      }
    },
    {
      id: 7,
      firstName: "Amanda",
      lastName: "Garcia",
      email: "amanda.garcia@stark.industries",
      phone: "+1 (555) 567-8901",
      company: "Stark Industries",
      position: "Innovation Lead",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      lastContactDate: "2023-06-17T14:00:00",
      status: "active",
      tags: ["tech", "enterprise", "innovation"],
      deals: [
        { id: 110, name: "R&D Process Management Platform", value: 200000, stage: "negotiation" }
      ],
      notes: "Amanda is leading a digital transformation initiative across R&D departments.",
      socialProfiles: {
        linkedin: "linkedin.com/in/amandagarcia",
        twitter: "twitter.com/amandainnovates"
      },
      activities: [
        {
          id: 1014,
          type: "call",
          date: "2023-06-17T14:00:00",
          duration: 35,
          summary: "Discussed integration requirements with existing systems."
        },
        {
          id: 1015,
          type: "meeting",
          date: "2023-06-03T11:30:00",
          duration: 90,
          summary: "Solution demonstration to innovation team and technical stakeholders."
        }
      ],
      customFields: {
        preferredContactMethod: "video call",
        decisionTimeframe: "Q3 2023",
        budgetRange: "$150K-$250K"
      }
    },
    {
      id: 8,
      firstName: "Thomas",
      lastName: "Wilson",
      email: "thomas.wilson@cyberdyne.systems",
      phone: "+1 (555) 678-9012",
      company: "Cyberdyne Systems",
      position: "Security Director",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      lastContactDate: "2023-06-13T16:15:00",
      status: "active",
      tags: ["security", "enterprise", "tech"],
      deals: [
        { id: 111, name: "Security Operations Center", value: 175000, stage: "discovery" }
      ],
      notes: "Thomas is highly technical and focused on security compliance and threat prevention.",
      socialProfiles: {
        linkedin: "linkedin.com/in/thomaswilson"
      },
      activities: [
        {
          id: 1016,
          type: "email",
          date: "2023-06-13T16:15:00",
          subject: "Security requirements document",
          content: "Received detailed security requirements and compliance needs."
        },
        {
          id: 1017,
          type: "call",
          date: "2023-06-01T13:45:00",
          duration: 40,
          summary: "Initial discussion about security challenges and objectives."
        }
      ],
      customFields: {
        preferredContactMethod: "encrypted email",
        decisionTimeframe: "Q4 2023",
        budgetRange: "$150K-$200K"
      }
    }
  ];

  // Load mock data on component mount
  useEffect(() => {
    setContacts(mockContacts);
    // Set first contact as selected by default for desktop view
    if (mockContacts.length > 0 && window.innerWidth >= 1024) {
      setSelectedContact(mockContacts[0]);
    }
  }, []);

  // Filter contacts based on search query and filters
  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = contact.email.toLowerCase();
    const company = contact.company.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = fullName.includes(searchLower) || 
                          email.includes(searchLower) || 
                          company.includes(searchLower);
    
    // Apply additional filters
    const matchesCompany = filters.company.length === 0 || 
                          filters.company.includes(contact.company);
    
    const matchesDealStage = filters.dealStage.length === 0 || 
                            contact.deals.some(deal => filters.dealStage.includes(deal.stage));
    
    const matchesTags = filters.tags.length === 0 || 
                        filters.tags.some(tag => contact.tags.includes(tag));
    
    // Filter by active tab
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && contact.status === 'active') ||
                      (activeTab === 'inactive' && contact.status === 'inactive');
    
    return matchesSearch && matchesCompany && matchesDealStage && matchesTags && matchesTab;
  });

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsAddingContact(false);
    setIsEditingContact(false);
  };

  const handleContactMultiSelect = (contactId) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsAddingContact(true);
    setIsEditingContact(false);
  };

  const handleEditContact = () => {
    setIsAddingContact(false);
    setIsEditingContact(true);
  };

  const handleSaveContact = (contactData) => {
    if (isAddingContact) {
      // Add new contact
      const newContact = {
        id: contacts.length + 1,
        ...contactData,
        lastContactDate: new Date().toISOString(),
        status: 'active',
        deals: [],
        activities: []
      };
      
      setContacts([...contacts, newContact]);
      setSelectedContact(newContact);
    } else if (isEditingContact && selectedContact) {
      // Update existing contact
      const updatedContacts = contacts.map(contact => 
        contact.id === selectedContact.id ? { ...contact, ...contactData } : contact
      );
      
      setContacts(updatedContacts);
      setSelectedContact({ ...selectedContact, ...contactData });
    }
    
    setIsAddingContact(false);
    setIsEditingContact(false);
  };

  const handleCancelForm = () => {
    setIsAddingContact(false);
    setIsEditingContact(false);
    if (selectedContact === null && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  };

  const handleDeleteContact = (contactId) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts);
    
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact(updatedContacts.length > 0 ? updatedContacts[0] : null);
    }
    
    setSelectedContacts(prev => prev.filter(id => id !== contactId));
  };

  const handleBulkDelete = () => {
    const updatedContacts = contacts.filter(contact => !selectedContacts.includes(contact.id));
    setContacts(updatedContacts);
    
    if (selectedContact && selectedContacts.includes(selectedContact.id)) {
      setSelectedContact(updatedContacts.length > 0 ? updatedContacts[0] : null);
    }
    
    setSelectedContacts([]);
  };

  const handleImportContacts = (importedContacts) => {
    setContacts([...contacts, ...importedContacts]);
    setIsImportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Contact Management</h1>
                <p className="text-text-secondary mt-1">Manage your customer relationships and communication history</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <button 
                  onClick={handleAddContact}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Icon name="UserPlus" size={18} />
                  <span>Add Contact</span>
                </button>
                
                <button 
                  onClick={() => setIsImportModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-150 ease-out"
                >
                  <Icon name="Upload" size={18} />
                  <span>Import</span>
                </button>
                
                <button 
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-150 ease-out ${
                    Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== null) || isFilterPanelOpen
                      ? 'border-primary-500 bg-primary-50 text-primary' :'border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <Icon name="Filter" size={18} />
                  <span>Filter</span>
                  {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== null) && (
                    <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                      {Object.values(filters).reduce((count, f) => count + (Array.isArray(f) ? f.length : (f !== null ? 1 : 0)), 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Filter Panel */}
            {isFilterPanelOpen && (
              <FilterPanel 
                filters={filters} 
                setFilters={setFilters} 
                onClose={() => setIsFilterPanelOpen(false)} 
              />
            )}
            
            {/* Search and Tabs */}
            <div className="mb-6">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Search" size={18} className="text-text-tertiary" />
                </div>
                <input
                  type="text"
                  placeholder="Search contacts by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'all' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  All Contacts
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'active' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('inactive')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'inactive' ?'text-primary border-b-2 border-primary' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Contact List (Left Panel) */}
              <div className="w-full lg:w-1/3 xl:w-1/4">
                <div className="bg-surface rounded-lg border border-border shadow-sm">
                  {/* List Header with Actions */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="ml-3 text-sm text-text-secondary">
                        {selectedContacts.length > 0 ? `${selectedContacts.length} selected` : `${filteredContacts.length} contacts`}
                      </span>
                    </div>
                    
                    {selectedContacts.length > 0 && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsExportModalOpen(true)}
                          className="text-text-secondary hover:text-text-primary"
                          title="Export Selected"
                        >
                          <Icon name="Download" size={16} />
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          className="text-error hover:text-error-600"
                          title="Delete Selected"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
                        {selectedContacts.length === 2 && (
                          <button
                            onClick={() => setIsMergeModalOpen(true)}
                            className="text-text-secondary hover:text-text-primary"
                            title="Merge Contacts"
                          >
                            <Icon name="GitMerge" size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Contact List */}
                  <ContactList
                    contacts={filteredContacts}
                    selectedContact={selectedContact}
                    selectedContacts={selectedContacts}
                    onContactSelect={handleContactSelect}
                    onContactMultiSelect={handleContactMultiSelect}
                    onDeleteContact={handleDeleteContact}
                  />
                </div>
              </div>
              
              {/* Contact Detail or Form (Right Panel) */}
              <div className="w-full lg:w-2/3 xl:w-3/4">
                {isAddingContact || isEditingContact ? (
                  <ContactForm
                    contact={isEditingContact ? selectedContact : null}
                    onSave={handleSaveContact}
                    onCancel={handleCancelForm}
                    isEditing={isEditingContact}
                  />
                ) : selectedContact ? (
                  <ContactDetail
                    contact={selectedContact}
                    onEdit={handleEditContact}
                    onDelete={() => handleDeleteContact(selectedContact.id)}
                  />
                ) : (
                  <div className="bg-surface rounded-lg border border-border shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Users" size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">No Contact Selected</h3>
                    <p className="text-text-secondary mb-6">Select a contact from the list or add a new one to get started.</p>
                    <button
                      onClick={handleAddContact}
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <Icon name="UserPlus" size={18} />
                      <span>Add New Contact</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      {isImportModalOpen && (
        <ImportContactsModal
          onImport={handleImportContacts}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}
      
      {isExportModalOpen && (
        <ExportContactsModal
          contacts={contacts.filter(contact => selectedContacts.includes(contact.id))}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
      
      {isMergeModalOpen && selectedContacts.length === 2 && (
        <MergeDuplicatesModal
          contact1={contacts.find(c => c.id === selectedContacts[0])}
          contact2={contacts.find(c => c.id === selectedContacts[1])}
          onMerge={(mergedContact) => {
            const updatedContacts = contacts.filter(c => !selectedContacts.includes(c.id));
            setContacts([...updatedContacts, mergedContact]);
            setSelectedContact(mergedContact);
            setSelectedContacts([]);
            setIsMergeModalOpen(false);
          }}
          onClose={() => setIsMergeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ContactManagement;