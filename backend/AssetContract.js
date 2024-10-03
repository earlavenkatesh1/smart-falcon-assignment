'use strict';

const { Contract } = require('fabric-contract-api');

class AssetContract extends Contract {

    async initLedger(ctx) {
        console.log('Initializing Ledger...');
    }

    async createAsset(ctx, dealerID, msisdn, mpin, balance, status, transAmount, transType, remarks) {
        const asset = {
            dealerID,
            msisdn,
            mpin,
            balance: parseFloat(balance),
            status,
            transAmount: parseFloat(transAmount),
            transType,
            remarks,
            docType: 'asset',
        };

        await ctx.stub.putState(msisdn, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    async queryAsset(ctx, msisdn) {
        const assetAsBytes = await ctx.stub.getState(msisdn);
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`Asset with MSISDN ${msisdn} does not exist`);
        }
        return assetAsBytes.toString();
    }

    async updateAsset(ctx, msisdn, newBalance, newStatus, newTransAmount, newTransType, newRemarks) {
        const assetAsBytes = await ctx.stub.getState(msisdn);
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`Asset with MSISDN ${msisdn} does not exist`);
        }

        const asset = JSON.parse(assetAsBytes.toString());
        asset.balance = parseFloat(newBalance);
        asset.status = newStatus;
        asset.transAmount = parseFloat(newTransAmount);
        asset.transType = newTransType;
        asset.remarks = newRemarks;

        await ctx.stub.putState(msisdn, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    async queryAllAssets(ctx) {
        const startKey = '';
        const endKey = '';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(record);
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }

    async getAssetHistory(ctx, msisdn) {
        const iterator = await ctx.stub.getHistoryForKey(msisdn);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(record);
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = AssetContract;
