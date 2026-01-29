import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getCases,
  createCase,
  updateCase,
  deleteCase,
} from '../firebase/firestore';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import { useToast } from '../components/Toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  X,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';

const CaseForm = ({ initialData, onSubmit, onCancel, submitting, submitLabel }) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleLocalSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Case Title *
        </label>
        <input
          type="text"
          name="caseTitle"
          value={formData.caseTitle}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          name="caseDescription"
          value={formData.caseDescription}
          onChange={handleInputChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status *
          </label>
          <select
            name="caseStatus"
            value={formData.caseStatus}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Remark
        </label>
        <textarea
          name="remark"
          value={formData.remark}
          onChange={handleInputChange}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );
};

const CaseList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCases();
    
    // Check if add action is in URL
    if (searchParams.get('action') === 'add') {
      setShowAddModal(true);
      setSearchParams({});
    }
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchTerm, statusFilter]);

  const loadCases = async () => {
    setLoading(true);
    const result = await getCases();
    if (result.success) {
      setCases(result.data);
    } else {
      showToast('Failed to load cases', 'error');
    }
    setLoading(false);
  };

  const filterCases = () => {
    let filtered = [...cases];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.caseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((c) => c.caseStatus === statusFilter);
    }

    setFilteredCases(filtered);
  };

  const handleAdd = async (data) => {
    setSubmitting(true);

    const result = await createCase(data);
    if (result.success) {
      showToast('Case created successfully', 'success');
      setShowAddModal(false);
      loadCases();
    } else {
      showToast('Failed to create case', 'error');
    }
    
    setSubmitting(false);
  };

  const handleEdit = (caseItem) => {
    setSelectedCase(caseItem);
    setShowEditModal(true);
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);

    const result = await updateCase(selectedCase.caseId, data);
    if (result.success) {
      showToast('Case updated successfully', 'success');
      setShowEditModal(false);
      loadCases();
    } else {
      showToast('Failed to update case', 'error');
    }
    
    setSubmitting(false);
  };

  const handleDelete = async () => {
    setSubmitting(true);

    const result = await deleteCase(selectedCase.caseId);
    if (result.success) {
      showToast('Case deleted successfully', 'success');
      setShowDeleteModal(false);
      loadCases();
    } else {
      showToast('Failed to delete case', 'error');
    }
    
    setSubmitting(false);
  };

  const handleView = (caseItem) => {
    setSelectedCase(caseItem);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="Loading cases..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Cases
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all your cases in one place
            </p>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
            }}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Case</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cases..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCases.length} of {cases.length} cases
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {filteredCases.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No cases found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== 'All'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first case'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Case Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Remark
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCases.map((caseItem) => (
                    <tr
                      key={caseItem.caseId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {caseItem.caseTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {caseItem.caseDescription}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={caseItem.caseStatus} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {caseItem.startDate || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {caseItem.endDate || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {caseItem.remark || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(caseItem)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(caseItem)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCase(caseItem);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Case"
      >
        <CaseForm
          initialData={{
            caseTitle: '',
            caseDescription: '',
            caseStatus: 'Pending',
            startDate: '',
            endDate: '',
            remark: '',
          }}
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
          submitting={submitting}
          submitLabel="Create Case"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Case"
      >
        {selectedCase && (
          <CaseForm
            initialData={{
              caseTitle: selectedCase.caseTitle,
              caseDescription: selectedCase.caseDescription,
              caseStatus: selectedCase.caseStatus,
              startDate: selectedCase.startDate || '',
              endDate: selectedCase.endDate || '',
              remark: selectedCase.remark || '',
            }}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditModal(false)}
            submitting={submitting}
            submitLabel="Update Case"
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Case Details"
      >
        {selectedCase && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Case Title
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedCase.caseTitle}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Description
              </label>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedCase.caseDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                <StatusBadge status={selectedCase.caseStatus} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedCase.startDate || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedCase.endDate || 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Case ID
                </label>
                <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                  {selectedCase.caseId}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Remark
              </label>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedCase.remark || 'No remark'}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedCase.createdAt
                      ? new Date(selectedCase.createdAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-500 dark:text-gray-400 mb-1">
                    Updated At
                  </label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedCase.updatedAt
                      ? new Date(selectedCase.updatedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Case"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this case? This action cannot be undone.
          </p>
          {selectedCase && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedCase.caseTitle}
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Case</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default CaseList;