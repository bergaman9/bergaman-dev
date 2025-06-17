"use client";

import { useState } from 'react';
import Button from '@/app/components/Button';
import Card from '@/app/components/Card';
import Modal from '@/app/components/Modal';
import PageHeader from '@/app/components/PageHeader';
import Input from '@/app/components/Input';
import Alert from '@/app/components/Alert';
import Badge from '@/app/components/Badge';

export default function ComponentsTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');
  const [inputValues, setInputValues] = useState({
    text: '',
    password: '',
    email: '',
    search: ''
  });
  const [activeModal, setActiveModal] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const tabs = [
    { id: 'buttons', label: 'Buttons', icon: 'fas fa-square' },
    { id: 'cards', label: 'Cards', icon: 'fas fa-credit-card' },
    { id: 'modals', label: 'Modals', icon: 'fas fa-window-maximize' },
    { id: 'headers', label: 'Page Headers', icon: 'fas fa-heading' },
    { id: 'inputs', label: 'Inputs', icon: 'fas fa-keyboard' },
    { id: 'alerts', label: 'Alerts', icon: 'fas fa-exclamation-triangle' },
    { id: 'badges', label: 'Badges', icon: 'fas fa-tag' },
  ];
  
  const modalVariants = [
    "default", 
    "dark", 
    "light", 
    "glass", 
    "primary", 
    "success", 
    "danger", 
    "warning", 
    "info", 
    "transparent",
    "modern",
    "elegant",
    "minimal",
    "frosted",
    "glow"
  ];
  
  return (
    <div className="admin-content">
      <PageHeader 
        title="Component Library"
        subtitle="Test and preview all available components"
        icon="fas fa-cubes"
        actions={[
          {
            label: 'Documentation',
            variant: 'secondary',
            icon: 'fas fa-book',
            iconPosition: 'left'
          }
        ]}
      />
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#3e503e]/30 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-[#e8c547]/20 text-[#e8c547] border border-[#e8c547]/30'
                : 'text-gray-300 hover:text-[#e8c547] hover:bg-[#e8c547]/10'
            }`}
          >
            <i className={`${tab.icon} text-sm mr-2`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Buttons Section */}
      {activeTab === 'buttons' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Button Variants</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
              <Button variant="dark">Dark</Button>
              <Button variant="light">Light</Button>
              <Button variant="link">Link</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Button Sizes</h2>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Button variant="primary" size="xs">Extra Small</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Extra Large</Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Button with Icons</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="primary" icon="fas fa-plus" iconPosition="left">
                Add New
              </Button>
              <Button variant="secondary" icon="fas fa-edit" iconPosition="left">
                Edit
              </Button>
              <Button variant="danger" icon="fas fa-trash" iconPosition="left">
                Delete
              </Button>
              <Button variant="info" icon="fas fa-arrow-right" iconPosition="right">
                Next
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Full Width Button</h2>
            <div className="mb-8">
              <Button variant="primary" fullWidth>Full Width Button</Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Disabled Button</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="primary" disabled>Disabled Primary</Button>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cards Section */}
      {activeTab === 'cards' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Card Variants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <Card variant="default" title="Default Card" description="This is a default card with a description." />
              <Card variant="outline" title="Outline Card" description="This is an outline card with a description." />
              <Card variant="solid" title="Solid Card" description="This is a solid card with a description." />
              <Card variant="glass" title="Glass Card" description="This is a glass card with a description." />
              <Card variant="primary" title="Primary Card" description="This is a primary card with a description." />
              <Card variant="success" title="Success Card" description="This is a success card with a description." />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Card with Image</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <Card 
                variant="default" 
                title="Top Image" 
                description="Card with image at the top"
                imageSrc="/images/portfolio/default.svg"
                imagePosition="top"
              />
              <Card 
                variant="default" 
                title="Bottom Image" 
                description="Card with image at the bottom"
                imageSrc="/images/portfolio/default.svg"
                imagePosition="bottom"
              />
              <Card 
                variant="glass" 
                title="Image with Overlay" 
                description="Card with image overlay for better text visibility"
                imageSrc="/images/portfolio/default.svg"
                imageOverlay={true}
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Card with Icons and Badges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <Card 
                variant="default" 
                title="Card with Icon" 
                description="This card has an icon on the left side of the title."
                icon={<i className="fas fa-star"></i>}
              />
              <Card 
                variant="default" 
                title="Card with Badge" 
                description="This card has a badge in the top right corner."
                badge="New"
                badgeColor="primary"
              />
              <Card 
                variant="default" 
                title="Card with Footer" 
                description="This card has a footer section at the bottom."
                footer={
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Last updated: Today</span>
                    <Button variant="ghost" size="xs">View</Button>
                  </div>
                }
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Interactive Cards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <Card 
                variant="default" 
                title="Clickable Card" 
                description="This card is clickable and will navigate to a link."
                href="#"
              />
              <Card 
                variant="default" 
                title="Button Card" 
                description="This card acts like a button and will trigger an action."
                onClick={() => alert('Card clicked!')}
              />
              <Card 
                variant="default" 
                title="Loading Card" 
                description="This card shows a loading state."
                loading={true}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Modals Section */}
      {activeTab === 'modals' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Modal Variants</h2>
            <p className="text-gray-300 mb-6">Click on each button to see the different modal variants.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {modalVariants.map((variant) => (
                <Button
                  key={variant}
                  onClick={() => setActiveModal(variant)}
                  variant="secondary"
                  className="capitalize"
                >
                  {variant}
                </Button>
              ))}
            </div>
            
            {/* Modal instances */}
            {modalVariants.map((variant) => (
              <Modal
                key={variant}
                isOpen={activeModal === variant}
                onClose={() => setActiveModal(null)}
                title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Modal`}
                subtitle="This is a subtitle for the modal"
                variant={variant}
                footer={
                  <>
                    <Button variant="ghost" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setActiveModal(null)}>Confirm</Button>
                  </>
                }
              >
                <div className="space-y-4">
                  <p>This is a modal with the <strong className="text-[#e8c547]">{variant}</strong> variant.</p>
                  <p>You can use these variants to match different contexts and purposes in your application.</p>
                  <div className="bg-black/20 p-4 rounded-md">
                    <code className="text-sm text-[#e8c547]">variant="{variant}"</code>
                  </div>
                </div>
              </Modal>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Modal Animations</h2>
            <p className="text-gray-300 mb-6">Different animation types for modals.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {["fade", "slide", "zoom", "none"].map((animation) => (
                <Button
                  key={animation}
                  onClick={() => setActiveModal(`animation-${animation}`)}
                  variant="secondary"
                  className="capitalize"
                >
                  {animation}
                </Button>
              ))}
            </div>
            
            {/* Animation modals */}
            {["fade", "slide", "zoom", "none"].map((animation) => (
              <Modal
                key={`animation-${animation}`}
                isOpen={activeModal === `animation-${animation}`}
                onClose={() => setActiveModal(null)}
                title={`${animation.charAt(0).toUpperCase() + animation.slice(1)} Animation`}
                variant="modern"
                animation={animation}
                footer={
                  <Button variant="primary" onClick={() => setActiveModal(null)}>Close</Button>
                }
              >
                <div className="space-y-4">
                  <p>This modal uses the <strong className="text-[#e8c547]">{animation}</strong> animation.</p>
                  <div className="bg-black/20 p-4 rounded-md">
                    <code className="text-sm text-[#e8c547]">animation="{animation}"</code>
                  </div>
                </div>
              </Modal>
            ))}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Modal Positions</h2>
            <p className="text-gray-300 mb-6">Different position options for modals.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].map((position) => (
                <Button
                  key={position}
                  onClick={() => setActiveModal(`position-${position}`)}
                  variant="secondary"
                  className="capitalize"
                >
                  {position}
                </Button>
              ))}
            </div>
            
            {/* Position modals */}
            {["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].map((position) => (
              <Modal
                key={`position-${position}`}
                isOpen={activeModal === `position-${position}`}
                onClose={() => setActiveModal(null)}
                title={`${position.charAt(0).toUpperCase() + position.slice(1)} Position`}
                variant="elegant"
                position={position}
                footer={
                  <Button variant="primary" onClick={() => setActiveModal(null)}>Close</Button>
                }
              >
                <div className="space-y-4">
                  <p>This modal is positioned at the <strong className="text-[#e8c547]">{position}</strong> of the screen.</p>
                  <div className="bg-black/20 p-4 rounded-md">
                    <code className="text-sm text-[#e8c547]">position="{position}"</code>
                  </div>
                </div>
              </Modal>
            ))}
          </div>
        </div>
      )}
      
      {/* Page Headers Section */}
      {activeTab === 'headers' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Page Header Variants</h2>
            
            <div className="space-y-10 mb-8">
              <div className="border border-[#3e503e]/30 rounded-lg p-4">
                <PageHeader 
                  title="Default Header"
                  subtitle="This is the default page header style"
                  icon="fas fa-file"
                />
                <div className="h-20 bg-[#1a241a] rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Content Area</p>
                </div>
              </div>
              
              <div className="border border-[#3e503e]/30 rounded-lg p-4">
                <PageHeader 
                  title="Header with Actions"
                  subtitle="This header includes action buttons"
                  icon="fas fa-cog"
                  actions={[
                    {
                      label: 'Cancel',
                      variant: 'secondary',
                      icon: 'fas fa-times',
                      iconPosition: 'left'
                    },
                    {
                      label: 'Save',
                      variant: 'primary',
                      icon: 'fas fa-save',
                      iconPosition: 'left'
                    }
                  ]}
                />
                <div className="h-20 bg-[#1a241a] rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Content Area</p>
                </div>
              </div>
              
              <div className="border border-[#3e503e]/30 rounded-lg p-4">
                <PageHeader 
                  title="Header with Back Button"
                  subtitle="This header includes a back button"
                  icon="fas fa-user"
                  backButton={true}
                  backButtonText="Return to List"
                />
                <div className="h-20 bg-[#1a241a] rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Content Area</p>
                </div>
              </div>
              
              <div className="border border-[#3e503e]/30 rounded-lg p-4">
                <PageHeader 
                  title="Compact Header"
                  icon="fas fa-compress"
                  variant="compact"
                  divider={false}
                />
                <div className="h-20 bg-[#1a241a] rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Content Area</p>
                </div>
              </div>
              
              <div className="border border-[#3e503e]/30 rounded-lg p-4">
                <PageHeader 
                  title="Large Header with Multiple Actions"
                  subtitle="This header is larger and includes multiple action buttons"
                  icon="fas fa-project-diagram"
                  variant="large"
                  actions={[
                    {
                      label: 'Delete',
                      variant: 'danger',
                      icon: 'fas fa-trash',
                      iconPosition: 'left'
                    },
                    {
                      label: 'Duplicate',
                      variant: 'secondary',
                      icon: 'fas fa-copy',
                      iconPosition: 'left'
                    },
                    {
                      label: 'Publish',
                      variant: 'success',
                      icon: 'fas fa-check',
                      iconPosition: 'left'
                    }
                  ]}
                />
                <div className="h-20 bg-[#1a241a] rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Content Area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Inputs Section */}
      {activeTab === 'inputs' && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold mb-4">Input Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#e8c547]">Basic Inputs</h3>
              
              <Input
                label="Text Input"
                name="text"
                value={inputValues.text}
                onChange={handleInputChange}
                placeholder="Enter some text"
              />
              
              <Input
                label="Password Input"
                type="password"
                name="password"
                value={inputValues.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
              
              <Input
                label="Email Input"
                type="email"
                name="email"
                value={inputValues.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                icon="fas fa-envelope"
                iconPosition="left"
              />
              
              <Input
                label="Search Input"
                name="search"
                value={inputValues.search}
                onChange={handleInputChange}
                placeholder="Search..."
                icon="fas fa-search"
                iconPosition="right"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#e8c547]">Input Variants</h3>
              
              <Input
                label="Default Variant"
                placeholder="Default input style"
                variant="default"
              />
              
              <Input
                label="Filled Variant"
                placeholder="Filled input style"
                variant="filled"
              />
              
              <Input
                label="Outlined Variant"
                placeholder="Outlined input style"
                variant="outlined"
              />
              
              <Input
                label="Underlined Variant"
                placeholder="Underlined input style"
                variant="underlined"
              />
              
              <Input
                label="Primary Variant"
                placeholder="Primary input style"
                variant="primary"
              />
              
              <Input
                label="Error State"
                placeholder="Input with error"
                error="This field is required"
              />
              
              <Input
                label="With Hint Text"
                placeholder="Input with helper text"
                hint="This is a hint text to help the user"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Alerts Section */}
      {activeTab === 'alerts' && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold mb-4">Alert Components</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <Alert variant="info" title="Information Alert">
              This is an information alert. It provides general information to the user.
            </Alert>
            
            <Alert variant="success" title="Success Alert">
              This is a success alert. It indicates that an operation was completed successfully.
            </Alert>
            
            <Alert variant="warning" title="Warning Alert">
              This is a warning alert. It warns the user about a potential issue.
            </Alert>
            
            <Alert variant="error" title="Error Alert">
              This is an error alert. It indicates that something went wrong.
            </Alert>
            
            <Alert variant="primary" title="Primary Alert">
              This is a primary alert using the theme's primary color.
            </Alert>
            
            <Alert 
              variant="info" 
              title="Dismissible Alert" 
              dismissible={true}
              onDismiss={() => console.log('Alert dismissed')}
            >
              This alert can be dismissed by clicking the X button.
            </Alert>
            
            <Alert 
              variant="success" 
              title="Alert with Action" 
              action={
                <Button variant="success" size="sm">
                  Take Action
                </Button>
              }
            >
              This alert includes an action button that the user can click.
            </Alert>
          </div>
        </div>
      )}
      
      {/* Badges Section */}
      {activeTab === 'badges' && (
        <div className="space-y-8">
          <h2 className="text-xl font-bold mb-4">Badge Components</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#e8c547] mb-3">Badge Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="dark">Dark</Badge>
                <Badge variant="light">Light</Badge>
                <Badge variant="glass">Glass</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#e8c547] mb-3">Outline Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary" outline>Primary</Badge>
                <Badge variant="secondary" outline>Secondary</Badge>
                <Badge variant="success" outline>Success</Badge>
                <Badge variant="danger" outline>Danger</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#e8c547] mb-3">Badge Sizes</h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="primary" size="xs">Extra Small</Badge>
                <Badge variant="primary" size="sm">Small</Badge>
                <Badge variant="primary" size="md">Medium</Badge>
                <Badge variant="primary" size="lg">Large</Badge>
                <Badge variant="primary" size="xl">Extra Large</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#e8c547] mb-3">Badges with Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary" icon="fas fa-check" iconPosition="left">Success</Badge>
                <Badge variant="danger" icon="fas fa-times" iconPosition="left">Error</Badge>
                <Badge variant="info" icon="fas fa-info-circle" iconPosition="left">Info</Badge>
                <Badge variant="warning" icon="fas fa-exclamation-triangle" iconPosition="left">Warning</Badge>
                <Badge variant="primary" icon="fas fa-arrow-right" iconPosition="right">Next</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#e8c547] mb-3">Badge Counters</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary" count={5}>Notifications</Badge>
                <Badge variant="danger" count={99}>Messages</Badge>
                <Badge variant="info" count={150} max={99}>Comments</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#e8c547] mb-3">Interactive Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary" href="#">Link Badge</Badge>
                <Badge variant="secondary" onClick={() => alert('Badge clicked')}>Button Badge</Badge>
                <Badge variant="danger" dismissible onDismiss={() => console.log('Badge dismissed')}>Dismissible</Badge>
                <Badge variant="success" dot>Status</Badge>
                <Badge variant="warning" dot pulse>Live</Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 