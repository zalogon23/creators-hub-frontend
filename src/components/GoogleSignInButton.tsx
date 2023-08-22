import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react"

const GoogleSignInButton = () => {

  return (
    <button
      className="google-button bg-black text-white rounded-3xl font-semibold"
      onClick={() => signIn()}>
      <FontAwesomeIcon icon={faGoogle} />
      <span className="pl-2 login">Login</span>
    </button>
  );
};

export default GoogleSignInButton;