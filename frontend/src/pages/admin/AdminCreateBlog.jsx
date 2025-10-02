import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/api';

const AdminCreateBlog = () => {
  const { admin_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    authorName: 'Admin User',
    authorRole: 'admin',
    authorId: admin_id
  });
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMediaChange = (e) => {
    setMedia(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('authorRole', formData.authorRole);
      formDataToSend.append('authorId', formData.authorId);
      
      if (media.length > 0) {
        media.forEach(file => {
          formDataToSend.append('media', file);
        });
      }

      await api.post('/blogs', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate(`/admin/${admin_id}/blogs`);
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog</h1>
          <p className="text-gray-600">
            Share insights and updates with startup users
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your blog content here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tech, startup, funding, innovation"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Files
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                You can upload multiple images or videos (max 50MB each)
              </p>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/admin/${admin_id}/blogs`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Creating...' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateBlog;