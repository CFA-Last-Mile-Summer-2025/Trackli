import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, EyeOff, ArrowLeft } from "lucide-react";

interface PasswordRequirement {
  test: (password: string) => boolean;
  message: string;
}

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

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
          name: fullName || email,
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
    <div className="min-h-screen relative overflow-hidden">
    <Link to="/landing" className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full  hover:bg-white/20 transition-all duration-200">
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm">Back</span>
    </Link>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">trackli</h1>
              <p className="text-sm">Application Tracking Made Simple</p>
            </div>

            <div className="flex mb-6 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 rounded-l-md text-sm font-medium transition-all duration-200 ${
                  !isSignUp
                    ? 'bg-secondary-foreground text-white shadow-sm'
                    : 'bg-secondary-foreground/50 hover:bg-secondary-foreground/70 text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 rounded-r-md text-sm font-medium transition-all duration-200 ${
                  isSignUp
                    ? 'bg-secondary-foreground text-white shadow-sm'
                    : 'bg-secondary-foreground/50 hover:bg-secondary-foreground/70 text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {isSignUp ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block  text-sm mb-2">Password</label>
                  {showPasswordRequirements && (
                    <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                      <div className="space-y-1">
                        {passwordRequirements.map((requirement, index) => {
                          const isValid = requirement.test(password);
                          return (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              {isValid ? (
                                <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                              ) : (
                                <X className="w-3 h-3 text-red-400 flex-shrink-0" />
                              )}
                              <span className={isValid ? "text-green-300" : "text-red-300"}>
                                • {requirement.message}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 /60 hover:"
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block  text-sm mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 /60 hover:"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="text-red-300 text-xs mt-2">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={!isPasswordValid(password) || password !== confirmPassword || !email || !fullName}
                  className="w-full py-3 mt-6 text-white bg-secondary-foreground hover:bg-secondary-foreground/80 disabled:bg-secondary-foreground/50 disabled:/50  font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block  text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block  text-sm mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#cebff9]/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-base placeholder-gray-500 focus:border-white/50 focus:ring-2 focus:ring-white/20 focus:bg-white/30 outline-none w-full transition-all duration-200"
                    required
                  />
                </div>

                <div className="text-right">
                  <a href="#" className="/70 hover: text-sm">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="button"
                  disabled={!email || !password}
                  className="w-full py-3 mt-6 text-white bg-secondary-foreground hover:bg-secondary-foreground/80 disabled:bg-secondary-foreground/50 disabled:/50  font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Sign In
                </button>
              </div>
            )}

            <p className="text-center text-xs /70 mt-4">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;