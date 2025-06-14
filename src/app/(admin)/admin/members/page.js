"use client";

import { useState, useEffect } from 'react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#e8c547] mb-4"></i>
          <p className="text-gray-400">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
            Team Members
          </h1>
          <p className="text-gray-400 mt-2">Manage your team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] px-6 py-3 rounded-lg font-semibold hover:from-[#d4b445] hover:to-[#c4a43d] transition-all duration-300 flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Add Member</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#e8c547]/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-[#e8c547] text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8c547]">{members.length}</p>
              <p className="text-gray-400 text-sm">Total Members</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-check text-green-400 text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{members.filter(m => m.status === 'active').length}</p>
              <p className="text-gray-400 text-sm">Active Members</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-edit text-blue-400 text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{members.filter(m => m.role === 'editor').length}</p>
              <p className="text-gray-400 text-sm">Editors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#3e503e]/30">
          <h2 className="text-xl font-semibold text-[#e8c547]">Team Members</h2>
        </div>

        {members.length === 0 ? (
          <div className="p-12 text-center">
            <i className="fas fa-users text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No members yet</h3>
            <p className="text-gray-500 mb-6">Add your first team member to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] px-6 py-3 rounded-lg font-semibold hover:from-[#d4b445] hover:to-[#c4a43d] transition-all duration-300"
            >
              Add First Member
            </button>
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
                {members.map((member) => (
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
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a2e1a] border border-[#3e503e]/30 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-[#e8c547]">Add New Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                >
                  <option value="editor">Editor (Can edit, cannot delete)</option>
                  <option value="admin">Administrator (Full access)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  className="w-full bg-[#2e3d29]/30 border border-[#3e503e]/30 rounded-lg px-4 py-3 text-[#d1d5db] focus:border-[#e8c547]/50 focus:outline-none transition-colors duration-300"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600/20 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-600/30 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#e8c547] to-[#d4b445] text-[#0e1b12] py-3 rounded-lg font-semibold hover:from-[#d4b445] hover:to-[#c4a43d] transition-all duration-300"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 