'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    const id = searchParams.get('id');

    if (!token || !id) {
      setError('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email`,
          { token, id }
        );
        setMessage(res.data.message);
        setTimeout(() => router.push('/login'), 3000);
      } catch (err: any) {
        console.error(err);
        const backendError = err.response?.data?.error || 'Verification failed.';
        setError(backendError);
        setMessage('');
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Verify Email</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p style={{ color: 'green' }}>{message}</p>
      )}
    </div>
  );
}
