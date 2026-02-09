import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CSVImport = ({ onImportComplete }) => {
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [preview, setPreview] = useState(null);
    const [mapping, setMapping] = useState({
        date: '',
        title: '',
        amount: '',
        category: '',
        description: '',
        type: 'expense' // expense or income
    });
    const [walletId, setWalletId] = useState('');
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await fetch('/api/wallets', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setWallets(data.wallets);
                if (data.wallets.length > 0) {
                    setWalletId(data.wallets[0]._id);
                }
            }
        } catch (error) {
            console.error('Error fetching wallets:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            parseCSVPreview(selectedFile);
        } else {
            alert('Please select a valid CSV file');
        }
    };

    const parseCSVPreview = (file) => {
        Papa.parse(file, {
            header: true,
            preview: 5,
            complete: (results) => {
                setPreview(results);
                // Auto-detect common column names
                const headers = results.meta.fields;
                const newMapping = { ...mapping };
                
                headers.forEach(header => {
                    const lower = header.toLowerCase();
                    if (lower.includes('date')) newMapping.date = header;
                    if (lower.includes('title') || lower.includes('description') || lower.includes('name')) {
                        if (!newMapping.title) newMapping.title = header;
                    }
                    if (lower.includes('amount') || lower.includes('price') || lower.includes('cost')) {
                        newMapping.amount = header;
                    }
                    if (lower.includes('category') || lower.includes('type')) {
                        if (!newMapping.category) newMapping.category = header;
                    }
                    if (lower.includes('note') || lower.includes('memo')) {
                        newMapping.description = header;
                    }
                });
                
                setMapping(newMapping);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file');
            }
        });
    };

    const handleImport = async () => {
        if (!file) {
            alert('Please select a CSV file');
            return;
        }

        if (!walletId) {
            alert('Please select an account');
            return;
        }

        if (!mapping.date || !mapping.amount) {
            alert('Please map at least Date and Amount columns');
            return;
        }

        setImporting(true);

        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const today = new Date();
                today.setHours(23, 59, 59, 999); // End of today
                
                let skippedCount = 0;
                const transactions = results.data
                    .filter(row => {
                        if (!row[mapping.amount] || parseFloat(row[mapping.amount]) <= 0) {
                            return false;
                        }
                        
                        // Check if date is in the future
                        const rowDate = new Date(row[mapping.date] || new Date());
                        if (rowDate > today) {
                            skippedCount++;
                            console.log('Skipping future date:', row[mapping.date]);
                            return false;
                        }
                        
                        return true;
                    })
                    .map(row => ({
                        date: row[mapping.date] || new Date().toISOString().split('T')[0],
                        title: row[mapping.title] || 'Imported Transaction',
                        amount: Math.abs(parseFloat(row[mapping.amount])),
                        category: mapCategory(row[mapping.category]),
                        description: row[mapping.description] || '',
                        walletId: walletId
                    }));

                console.log('Importing transactions:', transactions);
                console.log('Skipped future dates:', skippedCount);

                if (transactions.length === 0) {
                    alert('No valid transactions to import. All records were either invalid or had future dates.');
                    setImporting(false);
                    return;
                }

                try {
                    const endpoint = mapping.type === 'income' ? '/api/income/bulk' : '/api/expenses/bulk';
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ transactions }),
                    });

                    const data = await response.json();
                    
                    if (data.success) {
                        let message = `Successfully imported ${data.count || transactions.length} transactions!`;
                        if (skippedCount > 0) {
                            message += `\n\n⚠️ Skipped ${skippedCount} record(s) with future dates.`;
                        }
                        alert(message);
                        setFile(null);
                        setPreview(null);
                        if (onImportComplete) onImportComplete();
                    } else {
                        alert(data.message || 'Error importing transactions');
                    }
                } catch (error) {
                    console.error('Error importing:', error);
                    alert('Network error occurred during import');
                } finally {
                    setImporting(false);
                }
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                alert('Error parsing CSV file');
                setImporting(false);
            }
        });
    };

    const mapCategory = (categoryValue) => {
        if (!categoryValue) return 'other';
        
        const lower = categoryValue.toLowerCase();
        const categoryMap = {
            'food': ['food', 'restaurant', 'grocery', 'dining', 'lunch', 'dinner', 'breakfast'],
            'shopping': ['shopping', 'retail', 'store', 'amazon', 'online'],
            'housing': ['rent', 'mortgage', 'housing', 'home', 'property'],
            'transportation': ['transport', 'gas', 'fuel', 'car', 'uber', 'taxi', 'parking'],
            'entertainment': ['entertainment', 'movie', 'game', 'fun', 'hobby', 'netflix'],
            'healthcare': ['health', 'medical', 'doctor', 'pharmacy', 'hospital'],
            'utilities': ['utility', 'electric', 'water', 'internet', 'phone', 'bill']
        };

        for (const [category, keywords] of Object.entries(categoryMap)) {
            if (keywords.some(keyword => lower.includes(keyword))) {
                return category;
            }
        }

        return 'other';
    };

    const downloadTemplate = () => {
        const template = `date,title,amount,category,description
                    2024-01-15,Grocery Shopping,85.50,food,Weekly groceries
                    2024-01-16,Gas Station,45.00,transportation,Fuel
                    2024-01-17,Netflix Subscription,15.99,entertainment,Monthly subscription
                    2024-01-18,Electric Bill,120.00,utilities,January bill
                    2024-01-19,Restaurant Dinner,65.00,food,Dinner with friends`;

        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expense_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="chart-container" style={{ marginBottom: '2rem' }}>
            <div className="chart-header">
                <h3 className="chart-title">📥 Import from CSV</h3>
                <button 
                    onClick={downloadTemplate}
                    className="tips-button"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', margin: 0 }}
                >
                    📄 Download Template
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* File Upload */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ecf0f1' }}>
                        📁 Select CSV File
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            border: '1px solid #4a5f7a',
                            borderRadius: '4px',
                            backgroundColor: '#34495e',
                            color: '#ecf0f1'
                        }}
                    />
                    <div style={{ fontSize: '0.85rem', color: '#bdc3c7', marginTop: '0.5rem' }}>
                        💡 CSV should contain columns for date, amount, and optionally title, category, description
                    </div>
                </div>

                {/* Account Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ecf0f1' }}>
                            🏦 Account *
                        </label>
                        <select
                            value={walletId}
                            onChange={(e) => setWalletId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                border: '1px solid #4a5f7a',
                                borderRadius: '4px',
                                backgroundColor: '#34495e',
                                color: '#ecf0f1'
                            }}
                        >
                            {wallets.map(wallet => (
                                <option key={wallet._id} value={wallet._id}>
                                    {wallet.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ecf0f1' }}>
                            📊 Transaction Type *
                        </label>
                        <select
                            value={mapping.type}
                            onChange={(e) => setMapping({...mapping, type: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                border: '1px solid #4a5f7a',
                                borderRadius: '4px',
                                backgroundColor: '#34495e',
                                color: '#ecf0f1'
                            }}
                        >
                            <option value="expense">Expenses</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                </div>

                {/* Column Mapping */}
                {preview && (
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: '#ecf0f1' }}>Map CSV Columns</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#ecf0f1' }}>
                                    📅 Date Column *
                                </label>
                                <select
                                    value={mapping.date}
                                    onChange={(e) => setMapping({...mapping, date: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #4a5f7a',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#34495e',
                                        color: '#ecf0f1'
                                    }}
                                >
                                    <option value="">Select column</option>
                                    {preview.meta.fields.map(field => (
                                        <option key={field} value={field}>{field}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#ecf0f1' }}>
                                    💰 Amount Column *
                                </label>
                                <select
                                    value={mapping.amount}
                                    onChange={(e) => setMapping({...mapping, amount: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #4a5f7a',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#34495e',
                                        color: '#ecf0f1'
                                    }}
                                >
                                    <option value="">Select column</option>
                                    {preview.meta.fields.map(field => (
                                        <option key={field} value={field}>{field}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#ecf0f1' }}>
                                    📝 Title Column
                                </label>
                                <select
                                    value={mapping.title}
                                    onChange={(e) => setMapping({...mapping, title: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #4a5f7a',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#34495e',
                                        color: '#ecf0f1'
                                    }}
                                >
                                    <option value="">Select column</option>
                                    {preview.meta.fields.map(field => (
                                        <option key={field} value={field}>{field}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#ecf0f1' }}>
                                    🏷️ Category Column
                                </label>
                                <select
                                    value={mapping.category}
                                    onChange={(e) => setMapping({...mapping, category: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #4a5f7a',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#34495e',
                                        color: '#ecf0f1'
                                    }}
                                >
                                    <option value="">Select column</option>
                                    {preview.meta.fields.map(field => (
                                        <option key={field} value={field}>{field}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview */}
                {preview && preview.data.length > 0 && (
                    <div>
                        <h4 style={{ marginBottom: '1rem', color: '#ecf0f1' }}>Preview (First 5 rows)</h4>
                        <div style={{ overflowX: 'auto', backgroundColor: '#34495e', borderRadius: '4px', padding: '0.5rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ background: '#2c3e50', color: '#ecf0f1' }}>
                                        {preview.meta.fields.map(field => (
                                            <th key={field} style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #4a5f7a' }}>
                                                {field}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.data.map((row, idx) => (
                                        <tr key={idx} style={{ background: idx % 2 === 0 ? '#34495e' : '#2c3e50', color: '#ecf0f1' }}>
                                            {preview.meta.fields.map(field => (
                                                <td key={field} style={{ padding: '0.5rem', border: '1px solid #4a5f7a', color: '#ecf0f1' }}>
                                                    {row[field]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Import Button */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleImport}
                        disabled={!file || importing || !walletId}
                        className="tips-button"
                        style={{ 
                            padding: '0.8rem 2rem',
                            margin: 0,
                            opacity: (!file || importing || !walletId) ? 0.5 : 1,
                            cursor: (!file || importing || !walletId) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {importing ? '⏳ Importing...' : '📥 Import Transactions'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CSVImport;
