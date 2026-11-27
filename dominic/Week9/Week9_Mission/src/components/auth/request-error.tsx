'use client';

import { useEffect, useState } from 'react';
import { memberErrorMessage } from '../../api/members/requests';
export function AccountError({ error }: { error: unknown }) {
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    void memberErrorMessage(error).then((value) => {
      if (active) setMessage(value);
    });
    return () => {
      active = false;
    };
  }, [error]);
  return (
    <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
      {message || '요청에 실패했어요. 다시 시도해 주세요.'}
    </p>
  );
}
