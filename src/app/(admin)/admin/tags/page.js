"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts?limit=1000');
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
        
        // Extract all tags from posts
        const tagStats = {};
        data.posts.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
              if (tag.trim()) {
                const normalizedTag = tag.trim().toLowerCase();
                if (!tagStats[normalizedTag]) {
                  tagStats[normalizedTag] = {
                    name: normalizedTag,
                    displayName: tag.trim(),
                    count: 0,
                    posts: []
                  };
                }
                tagStats[normalizedTag].count++;
                tagStats[normalizedTag].posts.push(post);
              }
            });
          }
        });

        // Convert to array and sort by usage
        const tagsArray = Object.values(tagStats).sort((a, b) => b.count - a.count);
        setTags(tagsArray);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTag = async (oldTag, newTag) => {
    if (!newTag.trim() || oldTag === newTag.trim().toLowerCase()) {
      setEditingTag(null);
      return;
    }

    try {
      const normalizedOldTag = oldTag.toLowerCase();
      const normalizedNewTag = newTag.trim().toLowerCase();
      
      // Find all posts that use this tag
      const postsToUpdate = posts.filter(post => 
        post.tags && post.tags.some(tag => tag.toLowerCase() === normalizedOldTag)
      );
      
      // Update each post
      for (const post of postsToUpdate) {
        const updatedTags = post.tags.map(tag => 
          tag.toLowerCase() === normalizedOldTag ? newTag.trim() : tag
        );
        
        await fetch(`/api/admin/posts/${post._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...post,
            tags: updatedTags
          })
        });
      }

      // Refresh data
      await fetchPosts();
      setEditingTag(null);
      alert(`Tag updated successfully! ${postsToUpdate.length} posts updated.`);
    } catch (error) {
      console.error('Error updating tag:', error);
      alert('Failed to update tag');
    }
  };

  const handleDeleteTag = async (tagName) => {
    const normalizedTag = tagName.toLowerCase();
    const tagData = tags.find(tag => tag.name === normalizedTag);
    
    if (!tagData) return;

    const confirm = window.confirm(
      `Are you sure you want to delete the tag "${tagData.displayName}"? ` +
      `This will remove it from ${tagData.count} posts.`
    );
    
    if (!confirm) return;

    try {
      // Remove tag from all posts
      for (const post of tagData.posts) {
        const updatedTags = post.tags.filter(tag => tag.toLowerCase() !== normalizedTag);
        
        await fetch(`/api/admin/posts/${post._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...post,
            tags: updatedTags
          })
        });
      }

      await fetchPosts();
      alert(`Tag deleted successfully! Removed from ${tagData.count} posts.`);
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Failed to delete tag');
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    const normalizedNewTag = newTag.trim().toLowerCase();
    
    // Check if tag already exists
    if (tags.some(tag => tag.name === normalizedNewTag)) {
      alert('This tag already exists!');
      return;
    }

    try {
      // We can't add a tag without a post, so we'll just clear the form
      // Tags are automatically created when posts are created/updated
      alert('Tags are automatically created when you add them to posts. Use the post editor to add new tags.');
      setNewTag('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Failed to add tag');
    }
  };

  const getTagColor = (index) => {
    const colors = [
      'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400',
      'text-pink-400', 'text-cyan-400', 'text-orange-400', 'text-red-400',
      'text-indigo-400', 'text-teal-400'
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <Head>
        <title>Tags - Bergaman Admin Panel</title>
      </Head>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
              Tags Management
            </h1>
            <p className="text-gray-400 mt-2">Manage and organize your blog post tags</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#e8c547] text-[#0e1b12] px-4 py-2 rounded-lg font-medium hover:bg-[#d4b445] transition-colors duration-300 flex items-center space-x-2"
            >
              <i className="fas fa-plus"></i>
              <span>Add Tag</span>
            </button>
            
            <Link
              href="/admin/posts"
              className="bg-[#2e3d29]/60 border border-[#3e503e] text-gray-300 px-4 py-3 rounded-lg hover:border-[#e8c547]/50 transition-colors duration-300 flex items-center space-x-2"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Posts</span>
            </Link>
          </div>
        </div>

        {/* Add Tag Form */}
        {showAddForm && (
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#e8c547] mb-4">Add New Tag</h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag name"
                className="flex-1 px-4 py-3 bg-[#0e1b12] border border-[#3e503e] rounded-lg text-white focus:border-[#e8c547] focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button
                onClick={handleAddTag}
                className="bg-[#e8c547] text-[#0e1b12] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b445] transition-colors duration-300"
              >
                Add Tag
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewTag('');
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tags Grid */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-[#3e503e]/30">
            <h2 className="text-xl font-semibold text-[#e8c547]">
              Blog Tags ({tags.length} total)
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <i className="fas fa-spinner fa-spin text-4xl mb-4 block"></i>
              <p>Loading tags...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <i className="fas fa-tags text-4xl mb-4 block"></i>
              <p>No tags found. Tags are automatically created when you add them to posts.</p>
              <Link
                href="/admin/posts/new"
                className="inline-block mt-4 bg-[#e8c547] hover:bg-[#d4b445] text-[#0e1b12] px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Create a post with tags
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
              {tags.map((tag, index) => (
                <div
                  key={tag.name}
                  className="p-4 rounded-lg border border-[#3e503e]/50 bg-[#0e1b12]/50 hover:border-[#e8c547]/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <i className={`fas fa-hashtag ${getTagColor(index)} text-sm`}></i>
                      {editingTag === tag.name ? (
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onBlur={() => handleUpdateTag(tag.name, newTagName)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdateTag(tag.name, newTagName)}
                          className="bg-[#0e1b12] border border-[#3e503e] rounded px-2 py-1 text-sm text-white focus:border-[#e8c547] focus:outline-none flex-1"
                          autoFocus
                        />
                      ) : (
                        <h3 className="font-medium text-gray-300 text-sm">{tag.displayName}</h3>
                      )}
                    </div>
                    <span className="text-xs bg-[#e8c547]/20 text-[#e8c547] px-2 py-1 rounded-full">
                      {tag.count}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-3">
                    Used in {tag.count} post{tag.count !== 1 ? 's' : ''}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        // Filter posts by this tag
                        const searchParams = new URLSearchParams();
                        searchParams.set('search', tag.displayName);
                        window.open(`/admin/posts?${searchParams.toString()}`, '_blank');
                      }}
                      className="text-xs text-[#e8c547] hover:text-[#d4b445] transition-colors"
                    >
                      <i className="fas fa-eye mr-1"></i>
                      View Posts
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingTag(tag.name);
                          setNewTagName(tag.displayName);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.name)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fas fa-hashtag text-[#e8c547] text-xl"></i>
              <div>
                <p className="text-sm text-gray-400">Total Tags</p>
                <p className="text-xl font-bold text-white">{tags.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fas fa-fire text-orange-400 text-xl"></i>
              <div>
                <p className="text-sm text-gray-400">Most Used</p>
                <p className="text-xl font-bold text-white">
                  {tags.length > 0 ? tags[0].displayName : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fas fa-chart-bar text-green-400 text-xl"></i>
              <div>
                <p className="text-sm text-gray-400">Avg. Usage</p>
                <p className="text-xl font-bold text-white">
                  {tags.length > 0 ? Math.round(tags.reduce((sum, tag) => sum + tag.count, 0) / tags.length) : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fas fa-file-alt text-blue-400 text-xl"></i>
              <div>
                <p className="text-sm text-gray-400">Total Posts</p>
                <p className="text-xl font-bold text-white">{posts.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 