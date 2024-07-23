import React from 'react';
import styles from './auth.module.css';
import { RxCross2 } from "react-icons/rx";


const UserGuide = ({ onClose }) => {
  return (
    <div className={styles.__userGuide_container}>
    <button className={styles.__userGuide_closeButton}>
      <RxCross2 onClick={onClose} className={styles.__userGuide_closeButtonICON}/>
    </button>
    <h1 className={styles.__userGuide_title}>User Guide</h1>
    
    <section className={styles.__userGuide_section}>
      <p>Welcome to our platform! We're excited to have you join us. This guide will walk you through the process of creating an account and logging in.</p>
    </section>
  
    <section className={styles.__userGuide_section}>
      <h2>Account Creation and Login Instructions</h2>
      
      <h3>Option 1: Sign Up with Google</h3>
      <ol>
        <li>On the login page, locate and click the "Continue with Google" button.</li>
        <li>A new window will open, redirecting you to Google's authentication page.</li>
        <li>Sign in to your Google account if not already logged in.</li>
        <li>Grant the necessary permissions when prompted.</li>
        <li>After successful authentication, you'll be automatically logged into our platform.</li>
        <li>Important: Your initial account details will be set as follows:
          <ul>
            <li>Password: The first 15 characters of your Google email address (e.g., for "johndoe123@gmail.com", the password would be "johndoe123@gmai").</li>
            <li>Username: Your full name as it appears on your Google account.</li>
          </ul>
        </li>
        <li>For security, we strongly recommend changing your password immediately after your first login. You can do this in the account settings page.</li>
      </ol>
      
      <h3>Option 2: Manual Sign Up</h3>
      <ol>
        <li>Navigate to the sign-up page by clicking "Sign Up" on the main login screen.</li>
        <li>Fill in all required fields, including:
          <ul>
            <li>Valid email address</li>
            <li>Desired username</li>
            <li>Strong password (must include at least one uppercase letter, one number, and one special character)</li>
            <li>Any other required personal information</li>
          </ul>
        </li>
        <li>Click the "Sign Up" button to submit your information.</li>
        <li>Check your email inbox for a verification message containing a one-time password (OTP). Remember to check your spam folder if you don't see it in your main inbox.</li>
        <li>Return to our platform and enter the OTP in the verification field provided.</li>
        <li>Click the "Verify" button to confirm your email address.</li>
        <li>Upon successful verification, click "Complete Registration" to finalize your account creation.</li>
      </ol>
      
      <h3>Logging In</h3>
      <ol>
        <li>Visit our login page.</li>
        <li>Enter your registered email address or username in the first field.</li>
        <li>Input your password in the second field. (Remember, if you signed up with Google, use the first 15 characters of your email as the initial password unless you've changed it.)</li>
        <li>Click the "Login" button to access your account.</li>
        <li>If you've forgotten your password, use the "Forgot Password" link below the login button to reset it.</li>
      </ol>
    </section>
    
    <section className={styles.__userGuide_section}>
      <p className={styles.__userGuide_privacyNote}>
        Your privacy is important to us. We will never share your email address or personal information with third parties without your explicit consent. For more details, please review our Privacy Policy.
      </p>
    </section>
  </div>
  );
};

export default UserGuide;
