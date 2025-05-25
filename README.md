# EOSIO RAM Cleaner Contract Generator

## Overview

This solution provides a simple web interface to generate an EOSIO smart contract specifically designed to free RAM by completely removing unused Vaulta contracts from the blockchain. The generated contract will permanently delete the contract code and free up the associated RAM allocation.

## Key Features

- Generates ready-to-use `.hpp` and `.cpp` files customized with your contract account name
- Provides clear deployment instructions
- Validates EOSIO account name format
- One-click copy functionality for generated files

## Important Notes About RAM Cleaning

1. **Complete Contract Removal**:
   - This solution **completely removes** the entire contract from the blockchain
   - It does **not** remove individual tables or their data separately
   - The action is **irreversible** - all contract code and data will be permanently deleted

2. **RAM Recovery Expectations**:
   - After successful execution, the remaining RAM occupied by the contract should be **less than 20kb**
   - This small residual amount is used by the blockchain to maintain basic account information
   - The majority of RAM previously used by the contract will be freed and returned to the contract account owner

3. **Before Using This Solution**:
   - Ensure you have backups of any important contract data
   - Verify you no longer need the contract or its data
   - Consider that this action cannot be undone

## Deployment Requirements

- EOSIO account with sufficient permissions
- Anchor Wallet connection
- Access to Vaulta Web IDE (https://vaulta.io)

## How to Use

1. Enter your contract account name in the web interface
2. Click "Generate RAM Cleaner Contract"
3. Copy the generated files
4. Follow the provided deployment guide

## Technical Details

The generated contract contains a single `remove` action that:
- Requires authentication from the contract account
- Completely removes the contract from the blockchain
- Frees the associated RAM
- Leaves only minimal account information (typically <20kb) on-chain

## Warning

This solution is designed for **permanent contract removal**. Use with caution and only when you are certain you want to completely remove a contract and free its RAM allocation.