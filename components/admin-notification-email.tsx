import * as React from 'react';

interface AdminNotificationProps {
  subscriberEmail: string;
  subscribedAt: string;
}

export function AdminNotificationEmail({ subscriberEmail, subscribedAt }: AdminNotificationProps) {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h2>New Newsletter Subscriber 🎉</h2>
        <p><strong>Email:</strong> {subscriberEmail}</p>
        <p><strong>Subscribed at:</strong> {subscribedAt}</p>
        <hr />
        <p style={{ color: '#666', fontSize: '12px' }}>EduSync Admin Notification</p>
      </body>
    </html>
  );
}
