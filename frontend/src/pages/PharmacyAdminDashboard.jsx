import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiLogOut, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const PharmacyAdminDashboard = () => {
  const navigate = useNavigate();
  const [pharmacyName, setPharmacyName] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('medicines');
  const [priceComparatorData, setPriceComparatorData] = useState(null);
  const [comparatorLoading, setComparatorLoading] = useState(false);

  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    quantity: '',
    price: '',
    description: ''
  });

  const token = localStorage.getItem('pharmacy_token');
  const pharmacyId = localStorage.getItem('pharmacy_id');

  useEffect(() => {
    const stored_pharmacyName = localStorage.getItem('pharmacy_name');
    setPharmacyName(stored_pharmacyName || '');
    
    if (!token) {
      navigate('/pharmacy-login');
      return;
    }
    
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/pharmacies/medicines/${pharmacyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMedicines(response.data.medicines || []);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    
    if (!newMedicine.name || !newMedicine.price) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/pharmacies/medicines`,
        { ...newMedicine, pharmacyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Medicine added successfully');
        setNewMedicine({ name: '', dosage: '', quantity: '', price: '', description: '' });
        setShowAddForm(false);
        fetchMedicines();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (window.confirm('Are you sure?')) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/pharmacies/medicines/${medicineId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success('Medicine deleted');
          fetchMedicines();
        }
      } catch (error) {
        toast.error('Failed to delete medicine');
      }
    }
  };

  const handlePriceComparison = async (medicineName) => {
    try {
      setComparatorLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/pharmacies/price-comparison`,
        { medicineName, pharmacyName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPriceComparatorData(response.data.comparison);
        toast.success('Price comparison fetched!');
      }
    } catch (error) {
      toast.error('Failed to get price comparison');
    } finally {
      setComparatorLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pharmacy_token');
    localStorage.removeItem('pharmacy_id');
    localStorage.removeItem('pharmacy_name');
    navigate('/pharmacy-login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{pharmacyName}</h1>
            <p className="text-emerald-50">Pharmacy Management Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'medicines'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Medicines Inventory
          </button>
          <button
            onClick={() => setActiveTab('comparator')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'comparator'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Price Comparator
          </button>
        </div>

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add Medicine Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition mb-6 font-semibold"
            >
              <FiPlus /> Add Medicine
            </button>

            {/* Add Medicine Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <form onSubmit={handleAddMedicine} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        value={newMedicine.name}
                        onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                        placeholder="e.g., Aspirin"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={newMedicine.dosage}
                        onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                        placeholder="e.g., 500mg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity in Stock
                      </label>
                      <input
                        type="number"
                        value={newMedicine.quantity}
                        onChange={(e) => setNewMedicine({...newMedicine, quantity: e.target.value})}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newMedicine.price}
                        onChange={(e) => setNewMedicine({...newMedicine, price: e.target.value})}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newMedicine.description}
                      onChange={(e) => setNewMedicine({...newMedicine, description: e.target.value})}
                      placeholder="Medicine description..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 font-semibold"
                    >
                      {loading ? 'Adding...' : 'Add Medicine'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Medicines List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading medicines...</p>
                </div>
              ) : medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <motion.div
                    key={medicine._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{medicine.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {medicine.dosage && `Dosage: ${medicine.dosage}`}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>
                        <div className="flex gap-6">
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Stock</span>
                            <p className="text-lg font-bold text-emerald-600">{medicine.quantity} units</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 uppercase">Price</span>
                            <p className="text-lg font-bold text-blue-600">${medicine.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 ml-6">
                        <button
                          onClick={() => handlePriceComparison(medicine.name)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          title="Compare Price"
                        >
                          💹
                        </button>
                        <button
                          onClick={() => handleDeleteMedicine(medicine._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600 text-lg">No medicines added yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Price Comparator Tab */}
        {activeTab === 'comparator' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Price Comparator</h2>
            <p className="text-gray-600 mb-6">
              Click on a medicine to compare its price across different pharmacies using AI analysis.
            </p>

            {priceComparatorData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6 border border-blue-200"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Price Data for {priceComparatorData.medicineName}
                </h3>
                <div className="space-y-3">
                  {priceComparatorData.shops && priceComparatorData.shops.length > 0 ? (
                    priceComparatorData.shops.map((shop, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-4 flex justify-between items-center border-l-4 border-emerald-500"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">{shop.shopName}</p>
                          <p className="text-sm text-gray-600">{shop.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">${shop.price}</p>
                          <p className="text-xs text-gray-500">Stock: {shop.stock || 'Available'}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No price data available</p>
                  )}
                </div>
                <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">AI Analysis: </span>
                    {priceComparatorData.analysis || 'Analyzing market trends...'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Select a medicine above to see price comparisons</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PharmacyAdminDashboard;
