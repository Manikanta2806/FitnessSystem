// src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/Authcontext";
import gymBackground from "../assets/gym_background.webp";

const Profile = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    weight: "",
    height: "",
    body_type: "",
    experience: "",
    age: "",
    specialization: "",
    assigned_trainer: "",
    profile_picture: "",
    hasPaid: false,
    membershipPlan: "",
    membershipExpiry: "",
    createdAt: ""
  });

  const { userId, token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://fitnesssystem.onrender.com/api/users/${userId}/full-profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const profile = res.data.fullProfile;

        setData(res.data);
        setFormData({
          name: profile.username || '',
          email: profile.email || '',
          phone: profile.mobile || '',
          weight: profile.weight || '',
          height: profile.height || '',
          body_type: profile.body_type || '',
          experience: profile.experience || '',
          age: profile.age || '',
          specialization: profile.specialization || '',
          assigned_trainer: profile.assigned_trainer || 'N/A',
          profile_picture: profile.profile_picture || '',
          hasPaid: profile.hasPaid || false,
          membershipPlan: profile.membershipPlan || 'N/A',
          membershipExpiry: profile.membershipExpiry || 'N/A',
          createdAt: profile.createdAt || ''
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (userId && token) fetchProfile();
  }, [userId, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const userData = {
        username: formData.name,
        email: formData.email,
        mobile: formData.phone
      };

      const profileData = {
        weight: formData.weight,
        height: formData.height,
        body_type: formData.body_type,
        experience: formData.experience,
        specialization: formData.specialization,
        age: formData.age
      };

      await axios.put(
        `https://fitnesssystem.onrender.com/api/users/${userId}/full-profile/update`,
        { userData, profileData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`https://fitnesssystem.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(res.data.message || "Account deleted successfully!");
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account.");
    }
  };

  const isTrainer = data?.fullProfile?.role === "trainer";

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5 text-white"
      style={{
        backgroundImage: `url(${gymBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container p-4" style={{ maxWidth: "800px", background: "rgba(0, 0, 0, 0.75)", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 text-white fw-bold">My Profile</h2>

        <div className="text-center mb-4">
          <img
            src={formData.profile_picture || "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"}
            alt="Profile"
            className="rounded-circle border border-3 border-light"
            style={{ width: 150, height: 150, objectFit: "cover" }}
          />
        </div>

        <div className="card p-4 shadow-sm border-0 bg-dark text-white">
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Role:</strong> {isTrainer ? "Trainer" : "Customer"}</p>

          {!isTrainer && (
            <>
              <p><strong>Weight:</strong> {formData.weight} kg</p>
              <p><strong>Height:</strong> {formData.height} cm</p>
              <p><strong>Body Type:</strong> {formData.body_type}</p>
              <p><strong>Assigned Trainer:</strong> {formData.assigned_trainer}</p>
              <p><strong>Membership Plan:</strong> {formData.membershipPlan}</p>
              <p><strong>Membership Expiry:</strong> {formData.membershipExpiry?.slice(0, 10)}</p>
              <p><strong>Payment Status:</strong> {formData.hasPaid?"paid":"Not Paid"}</p>
            </>
          )}

          {isTrainer && (
            <>
              <p><strong>Experience:</strong> {formData.experience} years</p>
              <p><strong>Age:</strong> {formData.age}</p>
              <p><strong>Specialization:</strong> {formData.specialization || "N/A"}</p>
              <p><strong>Customers Assigned:</strong> {data?.fullProfile?.numberOfCustomers || 0}</p>
            </>
          )}

          <p><strong>Joined On:</strong> {formData.createdAt?.slice(0, 10)}</p>

          <div className="mt-3 text-center">
            <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Edit Profile</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body bg-light">
                <form>
                  <input type="text" className="form-control mb-2" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                  <input type="email" className="form-control mb-2" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                  <input type="text" className="form-control mb-2" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />

                  {!isTrainer && (
                    <>
                      <input type="text" className="form-control mb-2" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" />
                      <input type="text" className="form-control mb-2" name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" />
                      <input type="text" className="form-control mb-2" name="body_type" value={formData.body_type} onChange={handleChange} placeholder="Body Type" />
                    </>
                  )}

                  {isTrainer && (
                    <>
                      <input type="text" className="form-control mb-2" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (years)" />
                      <input type="text" className="form-control mb-2" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                      <input type="text" className="form-control mb-2" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" />
                    </>
                  )}

                  <input type="text" className="form-control mb-2" name="assigned_trainer" value={formData.assigned_trainer} disabled />
                </form>
              </div>
              <div className="modal-footer bg-light">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
