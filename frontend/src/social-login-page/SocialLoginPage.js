import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function SocialLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      fetch("http://localhost:3001/api/user/me", {
        headers: { Authorization: "Bearer " + token }
      })
        .then(res => res.json())
        .then(data => {
          if (data.role) localStorage.setItem("role", data.role);
          navigate("/profile");
        });
    }
  }, [location, navigate]);

  return <div>Logging in...</div>;
}
