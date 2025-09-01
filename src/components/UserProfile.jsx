import { logoutUser } from '../services/auth';

function UserProfile({ user, onLogout }) {
  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  return (
    <div className="user-profile">
      <div className="user-avatar">
        <img src={user.image} alt={`${user.firstName}'s avatar`} />
      </div>
      <div className="user-info">
        <h3>{user.firstName} {user.lastName}</h3>
        <p className="user-email">{user.email}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default UserProfile;
