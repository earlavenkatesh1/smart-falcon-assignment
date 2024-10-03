const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let assets = [];

// POST endpoint to create a new asset
app.post('/api/assets', (req, res) => {
    try {
        const asset = {
            dealerID: req.body.dealerID,
            msisdn: req.body.msisdn,
            mpin: req.body.mpin,
            balance: req.body.balance,
            status: req.body.status,
            transAmount: req.body.transAmount,
            transType: req.body.transType,
            remarks: req.body.remarks
        };

        assets.push(asset);
        res.status(201).json({ message: 'Asset created successfully', asset });
    } catch (error) {
        console.error('Error creating asset:', error.message);
        res.status(500).json({ error: 'An error occurred while creating the asset' });
    }
});

// GET endpoint to retrieve all assets
app.get('/api/assets', (req, res) => {
    res.json(assets);
});

// GET endpoint to retrieve a single asset by dealerID
app.get('/api/assets/:dealerID', (req, res) => {
    try {
        const { dealerID } = req.params;
        const asset = assets.find(asset => asset.dealerID === dealerID);

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.json(asset);
    } catch (error) {
        console.error('Error retrieving asset:', error.message);
        res.status(500).json({ error: 'An error occurred while retrieving the asset' });
    }
});

// PUT endpoint to update an existing asset by dealerID
app.put('/api/assets/:dealerID', (req, res) => {
    try {
        const { dealerID } = req.params;
        const { msisdn, mpin, balance, status, transAmount, transType, remarks } = req.body;

        const assetIndex = assets.findIndex(asset => asset.dealerID === dealerID);

        if (assetIndex === -1) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Update the asset details
        assets[assetIndex] = {
            ...assets[assetIndex],
            msisdn: msisdn || assets[assetIndex].msisdn,
            mpin: mpin || assets[assetIndex].mpin,
            balance: balance || assets[assetIndex].balance,
            status: status || assets[assetIndex].status,
            transAmount: transAmount || assets[assetIndex].transAmount,
            transType: transType || assets[assetIndex].transType,
            remarks: remarks || assets[assetIndex].remarks
        };

        res.json({ message: 'Asset updated successfully', asset: assets[assetIndex] });
    } catch (error) {
        console.error('Error updating asset:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the asset' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
