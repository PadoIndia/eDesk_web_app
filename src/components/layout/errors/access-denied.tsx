const AccessDenied = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#dc2626",
          margin: "0 0 16px 0",
        }}
      >
        403
      </h1>
      <p
        style={{
          fontSize: "24px",
          color: "#374151",
          margin: 0,
        }}
      >
        Access Denied
      </p>
    </div>
  );
};

export default AccessDenied;
