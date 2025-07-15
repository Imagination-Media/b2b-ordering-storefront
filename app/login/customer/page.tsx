import React from "react";
import LoginForm from "../../../components/auth/LoginForm";

export default function CustomerLoginPage() {
  return (
    <LoginForm
      userType="customer"
      title="Customer Login"
      subtitle="Sign in to your customer account"
    />
  );
}
