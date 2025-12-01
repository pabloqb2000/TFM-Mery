import { useState, useEffect, useCallback } from 'react';
import { getAllUserIds, getUserById } from '../services/usersService';
import { User } from '../model/user';
import './UsersPage.css';
import UserCard from './UserCard';


export default function UsersPage() {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userNumberInput, setUserNumberInput] = useState<string>('');
  const [userIdInput, setUserIdInput] = useState<string>('');

  // Load user IDs on mount
  useEffect(() => {
    const loadUserIds = async () => {
      try {
        const ids = await getAllUserIds();
        setUserIds(ids);
        if (ids.length > 0) {
          // Try to restore last viewed user from local storage
          const savedUserId = localStorage.getItem('currentUserId');
          let initialIndex = 0;
          
          if (savedUserId && ids.includes(savedUserId)) {
            initialIndex = ids.indexOf(savedUserId);
          }
          
          setCurrentIndex(initialIndex);
          setUserNumberInput(String(initialIndex + 1));
          setUserIdInput(ids[initialIndex]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading user IDs:', error);
        setLoading(false);
      }
    };

    loadUserIds();
  }, []);

  // Load current user when index changes
  useEffect(() => {
    const loadUser = async () => {
      if (userIds.length === 0 || currentIndex < 0 || currentIndex >= userIds.length) {
        return;
      }

      const userId = userIds[currentIndex];
      
      // Save user ID to local storage
      localStorage.setItem('currentUserId', userId);
      
      setLoading(true);
      try {
        const user = await getUserById(userId);
        setCurrentUser(user);
        setUserNumberInput(String(currentIndex + 1));
        setUserIdInput(userId);
      } catch (error) {
        console.error('Error loading user:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [currentIndex, userIds]);

  // Navigate to previous user
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  // Navigate to next user
  const goToNext = useCallback(() => {
    if (currentIndex < userIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, userIds.length]);

  // Handle user number input change
  const handleUserNumberChange = (value: string) => {
    setUserNumberInput(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= userIds.length) {
      setCurrentIndex(num - 1);
    }
  };

  // Handle user ID input change
  const handleUserIdChange = (value: string) => {
    setUserIdInput(value);
    const index = userIds.indexOf(value);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  // Keyboard shortcuts for Re Pag (Page Up) and Av Pag (Page Down)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Re Pag (Page Up) - Previous user
      if (event.key === 'PageUp') {
        event.preventDefault();
        goToPrevious();
      }
      // Av Pag (Page Down) - Next user
      if (event.key === 'PageDown') {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Calculate progress percentage
  const progressPercentage = userIds.length > 0 
    ? ((currentIndex + 1) / userIds.length) * 100 
    : 0;

  if (loading && userIds.length === 0) {
    return <div className="users-page">Loading users...</div>;
  }

  if (userIds.length === 0) {
    return <div className="users-page">No users found</div>;
  }

  return (
    <div className="users-page">
      <div className="users-page-content">
        {/* User Information Display */}
        <div className="user-section">
          <UserCard user={currentUser} />
        </div>
        <div className="footer-section">
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-section">
            <div className="pagination-controls">
              <div className="pagination-left">
                <button 
                  onClick={goToPrevious} 
                  disabled={currentIndex === 0}
                  className="nav-button"
                >
                  ←
                </button>
                
                <input
                  type="number"
                  min="1"
                  max={userIds.length}
                  value={userNumberInput}
                  onChange={(e) => handleUserNumberChange(e.target.value)}
                  className="pagination-input"
                />
                
                <div className="pagination-separator">/</div>
                
                <div className="pagination-total">{userIds.length}</div>
                
                <button 
                  onClick={goToNext} 
                  disabled={currentIndex === userIds.length - 1}
                  className="nav-button"
                >
                  →
                </button>
              </div>
              
              <input
                type="text"
                value={userIdInput}
                onChange={(e) => handleUserIdChange(e.target.value)}
                className="pagination-input pagination-user-id"
                placeholder="Enter user ID"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

