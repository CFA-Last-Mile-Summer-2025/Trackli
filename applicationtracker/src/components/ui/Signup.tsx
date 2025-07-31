import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface PasswordRequirement {
  test: (password: string) => boolean;
  message: string;
}

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const passwordRequirements: PasswordRequirement[] = [
    {
      test: (pwd) => pwd.length >= 8,
      message: "At least 8 characters long",
    },
    {
      test: (pwd) => /[a-z]/.test(pwd),
      message: "Contains at least one lowercase letter",
    },
    {
      test: (pwd) => /[A-Z]/.test(pwd),
      message: "Contains at least one uppercase letter",
    },
    {
      test: (pwd) => /\d/.test(pwd),
      message: "Contains at least one number",
    },
    {
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      message: "Contains at least one special character",
    },
  ];

  const isPasswordValid = (pwd: string): boolean => {
    return passwordRequirements.every((req) => req.test(pwd));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length > 0 && !showPasswordRequirements) {
      setShowPasswordRequirements(true);
    }
    if (newPassword.length === 0) {
      setShowPasswordRequirements(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid(password)) {
      alert(
        "Password does not meet the required criteria. Please check the requirements below."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:3002/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: email,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg bg-card text-white font-lalezar">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create an Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`${
                  password.length > 0 && !isPasswordValid(password)
                    ? "border-red-500 focus:border-red-500"
                    : password.length > 0 && isPasswordValid(password)
                    ? "border-green-500 focus:border-green-500"
                    : ""
                }`}
              />

              {showPasswordRequirements && (
                <div className="bg-gray-800 p-3 rounded-md border">
                  <p className="text-sm font-medium mb-2 text-gray-200">
                    Password Requirements:
                  </p>
                  <div className="space-y-1">
                    {passwordRequirements.map((requirement, index) => {
                      const isValid = requirement.test(password);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          {isValid ? (
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-3 h-3 text-red-500 flex-shrink-0" />
                          )}
                          <span
                            className={
                              isValid ? "text-green-400" : "text-red-400"
                            }
                          >
                            {requirement.message}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`${
                confirmPassword.length > 0 && password !== confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : confirmPassword.length > 0 &&
                    password === confirmPassword &&
                    password.length > 0
                  ? "border-green-500 focus:border-green-500"
                  : ""
              }`}
            />

            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-red-400 text-xs">Passwords do not match</p>
            )}

            <p>
              Already have an account? Login{" "}
              <a href="/login" className="cursor-pointer underline">
                here
              </a>
            </p>

            <Button
              className="w-full text-md mt-3"
              type="submit"
              disabled={
                !isPasswordValid(password) ||
                password !== confirmPassword ||
                !email
              }
            >
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
