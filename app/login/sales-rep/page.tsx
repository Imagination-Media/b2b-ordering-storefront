import React from "react";
import LoginForm from "../../../components/auth/LoginForm";

export default function SalesRepLoginPage() {
  return (
    <LoginForm
      userType="salesRep"
      title="Sign in to your sales account"
      subtitle="Access your sales dashboard and manage customer orders"
    />
  );
}
