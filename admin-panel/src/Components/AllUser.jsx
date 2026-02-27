import React, { useEffect, useState } from 'react'
import { allUsers, blockuser, bookingCount, unblockuser } from '../../api';
import '../stylesheets/AllUser.css';

function AllUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);

    const bookingCountFunc = async () => {
        try {
            const request = await bookingCount()
            const response = request.data
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleBlockUser = async (userId, currentBlockedStatus) => {
        try {
            setUpdatingUserId(userId);
            
            if (currentBlockedStatus) {
                // User is currently blocked, so unblock them
                const request = await unblockuser(userId);
                console.log("Unblocked:", request.data);
                
                // Update UI immediately
                setUsers(users.map(user => 
                    user._id === userId 
                        ? { ...user, blocked: false } 
                        : user
                ));
            } else {
                // User is not blocked, so block them
                const request = await blockuser(userId);
                console.log("Blocked:", request.data);
                
                // Update UI immediately
                setUsers(users.map(user => 
                    user._id === userId 
                        ? { ...user, blocked: true } 
                        : user
                ));
            }
            
        } catch (error) {
            console.log(error);
            alert("Failed to update user status");
        } finally {
            setUpdatingUserId(null);
        }
    }

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const request = await allUsers()
            const response = request.data;
            setUsers(response.data)
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
        // bookingCountFunc();
    }, [])

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        )
    }

    return (
        <div className="users-container">
            <div className="header">
                <h1>User Management</h1>
                <div className="stats-row">
                    <div className="stat-box">
                        <span className="stat-number">{users.length}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">
                            {users.filter(user => user.blocked).length}
                        </span>
                        <span className="stat-label">Blocked Users</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">
                            {users.filter(user => user.isVerified).length}
                        </span>
                        <span className="stat-label">Verified</span>
                    </div>
                </div>
            </div>

            <div className="users-grid">
                {users.map((user) => (
                    <div key={user._id} className={`user-card ${user.blocked ? 'blocked-user' : ''}`}>
                        <div className="card-header">
                            <div className="user-avatar">
                                {user.fullName?.charAt(0).toUpperCase()}
                                {user.blocked && <div className="blocked-overlay">🚫</div>}
                            </div>
                            <div>
                                <h3>{user.fullName}</h3>
                                <p className="user-email">{user.email}</p>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="info-row">
                                <span className="label">Phone:</span>
                                <span className="value">{user.phone}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">City:</span>
                                <span className="value">{user.city}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Country:</span>
                                <span className="value">{user.country}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Role:</span>
                                <span className={`role-badge ${user.role}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">Status:</span>
                                <div className="status-container">
                                    <span className={`status-indicator ${user.blocked ? 'blocked' : 'active'}`}></span>
                                    <span className={`status-text ${user.blocked ? 'blocked' : 'active'}`}>
                                        {user.blocked ? 'Blocked' : 'Active'}
                                    </span>
                                </div>
                            </div>
                            <div className="info-row">
                                <span className="label">Verified:</span>
                                <span className={`verified ${user.isVerified ? 'yes' : 'no'}`}>
                                    {user.isVerified ? '✅ Yes' : '❌ No'}
                                </span>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button 
                                onClick={() => handleBlockUser(user._id, user.blocked)}
                                disabled={updatingUserId === user._id}
                                className={`action-btn ${user.blocked ? 'unblock-btn' : 'block-btn'}`}
                            >
                                {updatingUserId === user._id ? (
                                    <span className="btn-loading">
                                        <span className="btn-spinner"></span>
                                        Processing...
                                    </span>
                                ) : user.blocked ? (
                                    '🔓 Unblock User'
                                ) : (
                                    '🚫 Block User'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllUser