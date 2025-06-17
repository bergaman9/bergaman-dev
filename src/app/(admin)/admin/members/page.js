"use client";

import { useState, useEffect } from 'react';
import PageHeader from '@/app/components/PageHeader';
import Button from '@/app/components/Button';
import Modal from '@/app/components/Modal';
import Loading from '@/app/components/Loading';
import Tabs from '@/app/components/Tabs';
import Select from '@/app/components/Select';
import Input from '@/app/components/Input';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'editor',
    password: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      if (response.ok) {
        fetchMembers();
        setShowAddModal(false);
        setNewMember({ name: '', email: '', role: 'editor', password: '' });
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleDeleteMember = async (id) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        const response = await fetch(`/api/admin/members/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchMembers();
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: currentStatus === 'active' ? 'inactive' : 'active' }),
      });

      if (response.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  // Filter members based on active tab
  const filteredMembers = members.filter(member => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return member.status === 'active';
    if (activeTab === 'inactive') return member.status === 'inactive';
    if (activeTab === 'admin') return member.role === 'admin';
    if (activeTab === 'editor') return member.role === 'editor';
    return true;
  });

  // Role options for the select component
  const roleOptions = [
    { value: 'editor', label: 'Editor', icon: 'fas fa-edit' },
    { value: 'admin', label: 'Administrator', icon: 'fas fa-shield-alt' }
  ];

  // Tab configuration
  const tabs = [
    {
      id: 'all',
      label: 'All Members',
      icon: 'fas fa-users',
      badge: members.length,
      content: null
    },
    {
      id: 'active',
      label: 'Active',
      icon: 'fas fa-check-circle',
      badge: members.filter(m => m.status === 'active').length,
      content: null
    },
    {
      id: 'inactive',
      label: 'Inactive',
      icon: 'fas fa-pause-circle',
      badge: members.filter(m => m.status === 'inactive').length,
      content: null
    },
    {
      id: 'admin',
      label: 'Administrators',
      icon: 'fas fa-shield-alt',
      badge: members.filter(m => m.role === 'admin').length,
      content: null
    },
    {
      id: 'editor',
      label: 'Editors',
      icon: 'fas fa-edit',
      badge: members.filter(m => m.role === 'editor').length,
      content: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Team Members"
        subtitle="Manage your team members and their permissions"
        icon="fas fa-users"
        actions={[
          {
            label: 'Add Member',
            variant: 'primary',
            icon: 'fas fa-plus',
            onClick: () => setShowAddModal(true)
          }
        ]}
        stats={[
          { label: 'Total Members', value: members.length },
          { label: 'Active Members', value: members.filter(m => m.status === 'active').length },
          { label: 'Administrators', value: members.filter(m => m.role === 'admin').length }
        ]}
      />

      {/* Members List */}
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#3e503e]/30">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="primary"
            pills={true}
          />
        </div>

        <Loading isLoading={loading} overlay={false} delay={500}>
          {members.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fas fa-users text-6xl text-gray-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No members yet</h3>
              <p className="text-gray-500 mb-6">Add your first team member to get started</p>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
              >
                Add First Member
              </Button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center">
              <i className="fas fa-filter text-6xl text-gray-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No matching members</h3>
              <p className="text-gray-500 mb-6">Try a different filter or add more members</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a2e1a]/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Member</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3e503e]/30">
                  {filteredMembers.map((member) => (
                    <tr key={member._id} className="hover:bg-[#1a2e1a]/30 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#e8c547] to-[#d4b445] rounded-full flex items-center justify-center">
                            <span className="text-[#0e1b12] font-semibold text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[#e8c547]">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.role === 'admin' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {member.role === 'admin' ? 'Administrator' : 'Editor'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {member.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleStatus(member._id, member.status)}
                            className={`p-2 rounded-lg transition-colors duration-300 ${
                              member.status === 'active'
                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/20'
                                : 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                            }`}
                            title={member.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            <i className={`fas ${member.status === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                          </button>
                          {member.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteMember(member._id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-300"
                              title="Remove Member"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Loading>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Team Member"
        size="md"
        variant="modern"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddMember}>
              Add Member
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <Input
            label="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            placeholder="Enter member's full name"
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            placeholder="Enter member's email address"
            required
          />
          
          <Select
            label="Role"
            options={roleOptions}
            value={newMember.role}
            onChange={(value) => setNewMember({ ...newMember, role: value })}
            placeholder="Select member role"
            variant="primary"
            fullWidth
          />
          
          <Input
            label="Password"
            type="password"
            value={newMember.password}
            onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
            placeholder="Enter a secure password"
            required
          />
        </form>
      </Modal>
    </div>
  );
} 