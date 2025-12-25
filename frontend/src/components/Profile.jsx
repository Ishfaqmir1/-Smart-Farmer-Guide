import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, setUser } = useContext(AuthContext);

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(data.user); // update global context
      setMsg("Profile updated successfully ✅");
      setEdit(false);
    } catch (err) {
      setMsg("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>👤 My Profile</h2>

        {!edit ? (
          <>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>

            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: 16 }}
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="profile-actions">
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                className="btn-outline"
                onClick={() => {
                  setEdit(false);
                  setName(user?.name);
                  setEmail(user?.email);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  );
}

export default Profile;
