import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const location = useLocation();
  const userFromState = location.state?.user; // user passed from SearchBar
  const { profile, loading, error } = useSelector((state) => state.user);

  const user = userFromState || profile; // fallback if Redux has it

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Profile not found.</p>;

  return (
    <div className="p-3">
      <h2>@{user.username}</h2>
      <p>{user.bio || "No bio yet."}</p>
      {user.numPosts && <p>Posts: {user.numPosts}</p>}
    </div>
  );
}
