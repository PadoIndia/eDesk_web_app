import "./styles.scss";
import PhoneVerification from "../../components/login/phone-verification";

const Login = () => {
  return (
    <div
      style={{
        background: "white",
      }}
      className="d-flex align-items-center justify-content-center h-100"
    >
      <div
        className="col-12 col-lg-6"
        style={{
          height: "100vh",
        }}
      >
        <PhoneVerification />
      </div>
    </div>
  );
};

export default Login;
