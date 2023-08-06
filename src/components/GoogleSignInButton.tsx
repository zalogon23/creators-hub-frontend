import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GoogleSignInButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  return (
    <button
      className="bg-black text-white rounded-3xl py-2 px-4 font-semibold"
      onClick={handleGoogleLogin}>
      <FontAwesomeIcon icon={faGoogle} />
      <span className="pl-2 login">Login</span>
    </button>
  );
};

export default GoogleSignInButton;