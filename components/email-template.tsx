import * as React from 'react';

interface WelcomeEmailProps {
  userEmail: string;
}

export function WelcomeEmail({ userEmail }: WelcomeEmailProps) {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .button { 
            background: #667eea; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            display: inline-block; 
            margin: 20px 0; 
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #666; 
            font-size: 12px; 
          }
          ul { 
            list-style: none; 
            padding: 0; 
          }
          li { 
            padding: 8px 0; 
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>🎓 Welcome to EduSync!</h1>
          </div>
          <div className="content">
            <h2>Thanks for subscribing! 🎉</h2>
            <p>You&apos;re now part of the EduSync community. Here&apos;s what you can expect:</p>
            <ul>
              <li>📚 Weekly educational tips and insights</li>
              <li>🚀 Platform updates and new features</li>
              <li>💡 Study techniques and best practices</li>
              <li>🎯 Exclusive content and resources</li>
            </ul>
            <p>Stay tuned for amazing content!</p>
            <a href="https://edusync.appwrite.network/" className="button">Visit EduSync</a>
          </div>
          <div className="footer">
            <p>You&apos;re receiving this because you subscribed to EduSync newsletter.</p>
            <p>© 2025 EduSync. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
