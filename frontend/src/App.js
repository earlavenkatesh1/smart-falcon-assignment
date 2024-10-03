import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this file is linked if you have CSS styles

function App() {
    const [formData, setFormData] = useState({
        dealerID: '',
        msisdn: '',
        mpin: '',
        balance: '',
        status: '',
        transAmount: '',
        transType: '',
        remarks: ''
    });

    const [updateMode, setUpdateMode] = useState(false);
    const [asset, setAsset] = useState(null);
    const [fetchError, setFetchError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = updateMode
                ? await axios.put(`http://localhost:3001/api/assets/${formData.dealerID}`, formData)
                : await axios.post('http://localhost:3001/api/assets', formData);

            console.log('Asset processed:', response.data);
            alert(`Asset ${updateMode ? 'updated' : 'created'} successfully`);
            if (!updateMode) {
                setFormData({
                    dealerID: '',
                    msisdn: '',
                    mpin: '',
                    balance: '',
                    status: '',
                    transAmount: '',
                    transType: '',
                    remarks: ''
                });
            }
        } catch (error) {
            console.error(`Error ${updateMode ? 'updating' : 'creating'} asset:`, error);
            alert(`Failed to ${updateMode ? 'update' : 'create'} asset`);
        }
    };

    const handleFetch = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/assets/${formData.dealerID}`);
            setAsset(response.data);
            setFetchError('');
        } catch (error) {
            setFetchError('Asset not found');
            setAsset(null);
            console.error('Error fetching asset:', error);
        }
    };

    return (
        <div className="App">
            <h1>{updateMode ? 'UPDATE ASSET' : 'ASSET MANAGEMENT'}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="dealerID"
                    placeholder="Dealer ID"
                    value={formData.dealerID}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="msisdn"
                    placeholder="MSISDN"
                    value={formData.msisdn}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="mpin"
                    placeholder="MPIN"
                    value={formData.mpin}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="balance"
                    placeholder="Balance"
                    value={formData.balance}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="status"
                    placeholder="Status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="transAmount"
                    placeholder="Transaction Amount"
                    value={formData.transAmount}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="transType"
                    placeholder="Transaction Type"
                    value={formData.transType}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="remarks"
                    placeholder="Remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{updateMode ? 'Update Asset' : 'Create Asset'}</button>
            </form>
            <button onClick={() => setUpdateMode(!updateMode)}>
                {updateMode ? 'Switch to Create Mode' : 'Switch to Update Mode'}
            </button>
            <hr />
            <h2>FETCH ASSET</h2>
            <input
                type="text"
                name="fetchDealerID"
                placeholder="Enter Dealer ID to Fetch"
                onChange={(e) => setFormData({ ...formData, dealerID: e.target.value })}
            />
            <hr></hr>
            <button onClick={handleFetch}>Fetch Asset</button>
            {fetchError && <p className="error">{fetchError}</p>}
            {asset && (
                <div className="asset-details">
                    <h3>Asset Details</h3>
                    <p><strong>Dealer ID:</strong> {asset.dealerID}</p>
                    <p><strong>MSISDN:</strong> {asset.msisdn}</p>
                    <p><strong>MPIN:</strong> {asset.mpin}</p>
                    <p><strong>Balance:</strong> {asset.balance}</p>
                    <p><strong>Status:</strong> {asset.status}</p>
                    <p><strong>Transaction Amount:</strong> {asset.transAmount}</p>
                    <p><strong>Transaction Type:</strong> {asset.transType}</p>
                    <p><strong>Remarks:</strong> {asset.remarks}</p>
                </div>
            )}
        </div>
    );
}

export default App;
