import React, { useState, useEffect } from 'react';
import { copyTradingAPIService } from '@/services/copy-trading-api.service';
import { api_base } from '@/external/bot-skeleton/services/api/api-base';
import './copy-trading-pro-page.scss';

// Enhanced Icons
const CopyTradingProHeaderIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="proHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
        </defs>
        <rect x="6" y="4" width="10" height="14" rx="1" fill="url(#proHeaderGrad)" opacity="0.3" />
        <rect x="8" y="6" width="10" height="14" rx="1" fill="url(#proHeaderGrad)" stroke="#06b6d4" strokeWidth="1.5" />
        <path d="M10 10h4M10 13h4M10 16h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15" cy="9" r="3" fill="#0891b2" stroke="white" strokeWidth="1"/>
        <path d="M14 9l1 1 2-2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
    </svg>
);

interface TraderProfile {
    token: string;
    nickname: string;
    totalTrades: number;
    winRate: number;
    avgProfit: number;
    isActive: boolean;
}

export const CopyTradingProPage: React.FC = () => {
    const [traderProfiles, setTraderProfiles] = useState<TraderProfile[]>([]);
    const [newToken, setNewToken] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [copiedTrades, setCopiedTrades] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | ''>('');
    const [isConnected, setIsConnected] = useState(false);

    // Advanced settings
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [assets, setAssets] = useState<string[]>([]);
    const [minStake, setMinStake] = useState<number>(0.35);
    const [maxStake, setMaxStake] = useState<number>(100);
    const [tradeTypes, setTradeTypes] = useState<string[]>([]);
    const [copyRatio, setCopyRatio] = useState<number>(1);
    const [maxDailyLoss, setMaxDailyLoss] = useState<number>(0);
    const [autoStop, setAutoStop] = useState(false);

    useEffect(() => {
        // Load saved profiles from localStorage
        const saved = localStorage.getItem('copyTradingProProfiles');
        if (saved) {
            try {
                setTraderProfiles(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load saved profiles');
            }
        }

        // Check API connection status
        checkConnectionStatus();

        // Check current copy trading status
        const status = copyTradingAPIService.getStatus();
        setIsActive(status.isActive);
        setCopiedTrades(status.copiedTrades);
        setTotalProfit(status.totalProfit);

        // Set up WebSocket message listener
        if (api_base.api) {
            const subscription = api_base.api.onMessage().subscribe((message: any) => {
                handleWebSocketMessage(message);
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, []);

    const checkConnectionStatus = () => {
        const connected = api_base.api?.connection?.readyState === 1;
        setIsConnected(connected);
    };

    const handleWebSocketMessage = (message: any) => {
        // Handle copy trading updates
        if (message.msg_type === 'proposal_open_contract') {
            setCopiedTrades(prev => prev + 1);
        }
        
        if (message.msg_type === 'profit_table') {
            // Update profit statistics
            const profit = message.profit_table?.transactions?.reduce(
                (sum: number, t: any) => sum + parseFloat(t.sell_price - t.buy_price),
                0
            ) || 0;
            setTotalProfit(profit);
        }
    };

    const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    const handleAddTrader = () => {
        const token = newToken.trim();
        const nickname = newNickname.trim() || `Trader ${traderProfiles.length + 1}`;

        if (!token) {
            showMessage('Please enter a valid API token', 'error');
            return;
        }

        if (traderProfiles.some(p => p.token === token)) {
            showMessage('This token is already added', 'error');
            return;
        }

        const newProfile: TraderProfile = {
            token,
            nickname,
            totalTrades: 0,
            winRate: 0,
            avgProfit: 0,
            isActive: true,
        };

        const updated = [...traderProfiles, newProfile];
        setTraderProfiles(updated);
        localStorage.setItem('copyTradingProProfiles', JSON.stringify(updated));
        setNewToken('');
        setNewNickname('');
        showMessage(`Trader "${nickname}" added successfully`, 'success');
    };

    const handleRemoveTrader = (token: string) => {
        const updated = traderProfiles.filter(p => p.token !== token);
        setTraderProfiles(updated);
        localStorage.setItem('copyTradingProProfiles', JSON.stringify(updated));
        showMessage('Trader removed', 'success');
    };

    const handleToggleTrader = (token: string) => {
        const updated = traderProfiles.map(p =>
            p.token === token ? { ...p, isActive: !p.isActive } : p
        );
        setTraderProfiles(updated);
        localStorage.setItem('copyTradingProProfiles', JSON.stringify(updated));
    };

    const handleStartCopyTrading = async () => {
        const activeTraders = traderProfiles.filter(p => p.isActive);
        
        if (activeTraders.length === 0) {
            showMessage('Please add and activate at least one trader', 'error');
            return;
        }

        if (!isConnected) {
            showMessage('Not connected to Deriv API. Please login first.', 'error');
            return;
        }

        const config = {
            traderTokens: activeTraders.map(p => p.token),
            assets: assets.length > 0 ? assets : undefined,
            minTradeStake: minStake,
            maxTradeStake: maxStake,
            tradeTypes: tradeTypes.length > 0 ? tradeTypes : undefined,
        };

        const result = await copyTradingAPIService.startCopyTrading(config);
        
        if (result.success) {
            setIsActive(true);
            showMessage(result.message || 'Copy trading started successfully', 'success');
        } else {
            showMessage(result.message || 'Failed to start copy trading', 'error');
        }
    };

    const handleStopCopyTrading = async () => {
        const result = await copyTradingAPIService.stopCopyTrading();
        
        if (result.success) {
            setIsActive(false);
            showMessage(result.message || 'Copy trading stopped', 'success');
        } else {
            showMessage(result.message || 'Failed to stop copy trading', 'error');
        }
    };

    return (
        <div className='copy-trading-pro-page'>
            <div className='copy-trading-pro-container'>
                <header className='page-header-pro'>
                    <div className="header-icon-wrapper-pro">
                        <CopyTradingProHeaderIcon />
                    </div>
                    <div className="header-content">
                        <h1>Copy Trading Pro</h1>
                        <p>Advanced copy trading with multi-trader support and risk management</p>
                    </div>
                    <div className={`connection-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                        <span className="badge-dot"></span>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                </header>

                {message && (
                    <div className={`message-pro ${messageType}`}>
                        <span>{message}</span>
                    </div>
                )}

                <div className='main-grid-pro'>
                    {/* Left Column - Status & Stats */}
                    <div className='left-column-pro'>
                        <div className='status-card-pro'>
                            <div className='status-header'>
                                <span className={`status-dot-pro ${isActive ? 'active' : 'inactive'}`}></span>
                                <span className='status-text-pro'>
                                    {isActive ? 'Copy Trading Active' : 'Copy Trading Inactive'}
                                </span>
                            </div>
                            <div className='stats-grid-pro'>
                                <div className='stat-item-pro'>
                                    <span className='stat-label-pro'>Active Traders</span>
                                    <span className='stat-value-pro'>
                                        {traderProfiles.filter(p => p.isActive).length}
                                    </span>
                                </div>
                                <div className='stat-item-pro'>
                                    <span className='stat-label-pro'>Copied Trades</span>
                                    <span className='stat-value-pro'>{copiedTrades}</span>
                                </div>
                                <div className='stat-item-pro'>
                                    <span className='stat-label-pro'>Total Profit</span>
                                    <span className={`stat-value-pro ${totalProfit >= 0 ? 'profit' : 'loss'}`}>
                                        ${totalProfit.toFixed(2)}
                                    </span>
                                </div>
                                <div className='stat-item-pro'>
                                    <span className='stat-label-pro'>Win Rate</span>
                                    <span className='stat-value-pro'>
                                        {copiedTrades > 0 ? '0%' : '0%'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Settings */}
                        <div className='advanced-section-pro'>
                            <button
                                className='btn-toggle-advanced-pro'
                                onClick={() => setShowAdvanced(!showAdvanced)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d={showAdvanced ? "M6 9l6 6 6-6" : "M9 6l6 6-6 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <span>Advanced Settings</span>
                            </button>

                            {showAdvanced && (
                                <div className='advanced-settings-pro'>
                                    <div className='setting-group-pro'>
                                        <label>Assets to Copy</label>
                                        <input
                                            type='text'
                                            placeholder='e.g., frxUSDJPY, R_50'
                                            onChange={e => setAssets(e.target.value.split(',').map(s => s.trim()))}
                                            disabled={isActive}
                                        />
                                    </div>

                                    <div className='setting-row-pro'>
                                        <div className='setting-group-pro'>
                                            <label>Min Stake</label>
                                            <input
                                                type='number'
                                                value={minStake}
                                                onChange={e => setMinStake(Number(e.target.value))}
                                                min='0.35'
                                                step='0.01'
                                                disabled={isActive}
                                            />
                                        </div>

                                        <div className='setting-group-pro'>
                                            <label>Max Stake</label>
                                            <input
                                                type='number'
                                                value={maxStake}
                                                onChange={e => setMaxStake(Number(e.target.value))}
                                                min='0.35'
                                                step='0.01'
                                                disabled={isActive}
                                            />
                                        </div>
                                    </div>

                                    <div className='setting-row-pro'>
                                        <div className='setting-group-pro'>
                                            <label>Copy Ratio</label>
                                            <input
                                                type='number'
                                                value={copyRatio}
                                                onChange={e => setCopyRatio(Number(e.target.value))}
                                                min='0.1'
                                                max='10'
                                                step='0.1'
                                                disabled={isActive}
                                            />
                                            <small>Multiply trader stake by this ratio</small>
                                        </div>

                                        <div className='setting-group-pro'>
                                            <label>Max Daily Loss ($)</label>
                                            <input
                                                type='number'
                                                value={maxDailyLoss}
                                                onChange={e => setMaxDailyLoss(Number(e.target.value))}
                                                min='0'
                                                step='1'
                                                disabled={isActive}
                                            />
                                            <small>Auto-stop if reached (0 = disabled)</small>
                                        </div>
                                    </div>

                                    <div className='setting-group-pro'>
                                        <label>Trade Types</label>
                                        <input
                                            type='text'
                                            placeholder='e.g., CALL, PUT'
                                            onChange={e => setTradeTypes(e.target.value.split(',').map(s => s.trim()))}
                                            disabled={isActive}
                                        />
                                    </div>

                                    <div className='setting-group-pro checkbox-group'>
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={autoStop}
                                                onChange={e => setAutoStop(e.target.checked)}
                                                disabled={isActive}
                                            />
                                            <span>Auto-stop on loss limit</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Trader Management */}
                    <div className='right-column-pro'>
                        <div className='trader-section-pro'>
                            <h2>Trader Management</h2>
                            <p className='section-description-pro'>
                                Add professional traders to copy. You need their read-only API tokens.
                            </p>

                            <div className='trader-input-group-pro'>
                                <input
                                    type='text'
                                    value={newNickname}
                                    onChange={e => setNewNickname(e.target.value)}
                                    placeholder='Trader nickname (optional)'
                                    className='trader-nickname-input'
                                />
                                <input
                                    type='text'
                                    value={newToken}
                                    onChange={e => setNewToken(e.target.value)}
                                    placeholder='API token'
                                    className='trader-token-input'
                                    onKeyPress={e => e.key === 'Enter' && handleAddTrader()}
                                />
                                <button onClick={handleAddTrader} className='btn-add-pro'>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    Add
                                </button>
                            </div>

                            <div className='trader-list-pro'>
                                {traderProfiles.length === 0 ? (
                                    <div className='empty-state-pro'>
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="#4b5563" strokeWidth="2"/>
                                            <path d="M12 8v4M12 16h.01" stroke="#4b5563" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <p>No traders added yet</p>
                                        <small>Add your first trader to start copy trading</small>
                                    </div>
                                ) : (
                                    traderProfiles.map((profile, index) => (
                                        <div key={index} className={`trader-card-pro ${profile.isActive ? 'active' : 'inactive'}`}>
                                            <div className='trader-header'>
                                                <div className='trader-info'>
                                                    <h3>{profile.nickname}</h3>
                                                    <span className='trader-token'>{profile.token.substring(0, 15)}...</span>
                                                </div>
                                                <div className='trader-actions'>
                                                    <button
                                                        onClick={() => handleToggleTrader(profile.token)}
                                                        className={`btn-toggle-trader ${profile.isActive ? 'active' : ''}`}
                                                        disabled={isActive}
                                                        title={profile.isActive ? 'Deactivate' : 'Activate'}
                                                    >
                                                        {profile.isActive ? (
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                                <circle cx="12" cy="12" r="10"/>
                                                            </svg>
                                                        ) : (
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10"/>
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveTrader(profile.token)}
                                                        className='btn-remove-trader'
                                                        disabled={isActive}
                                                        title='Remove'
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='trader-stats'>
                                                <div className='trader-stat'>
                                                    <span className='stat-label'>Trades</span>
                                                    <span className='stat-value'>{profile.totalTrades}</span>
                                                </div>
                                                <div className='trader-stat'>
                                                    <span className='stat-label'>Win Rate</span>
                                                    <span className='stat-value'>{profile.winRate}%</span>
                                                </div>
                                                <div className='trader-stat'>
                                                    <span className='stat-label'>Avg Profit</span>
                                                    <span className={`stat-value ${profile.avgProfit >= 0 ? 'profit' : 'loss'}`}>
                                                        ${profile.avgProfit.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className='action-section-pro'>
                    {!isActive ? (
                        <button
                            onClick={handleStartCopyTrading}
                            className='btn-primary-pro btn-start-pro'
                            disabled={traderProfiles.filter(p => p.isActive).length === 0 || !isConnected}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span>Start Copy Trading</span>
                        </button>
                    ) : (
                        <button onClick={handleStopCopyTrading} className='btn-danger-pro btn-stop-pro'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="6" width="12" height="12" rx="2"/>
                            </svg>
                            <span>Stop Copy Trading</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CopyTradingProPage;
