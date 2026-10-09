import { useSyncExternalStore } from 'react';
import {
  getServerStorageFailure,
  getStorageFailure,
  subscribeStorageFailure,
} from '../../utils/browser-storage';

export function StorageNotice() {
  const failed = useSyncExternalStore(
    subscribeStorageFailure,
    getStorageFailure,
    getServerStorageFailure,
  );
  if (!failed) return null;
  return (
    <p
      role="status"
      className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-center text-sm"
    >
      브라우저 저장소를 사용할 수 없어요. 변경 사항은 화면에 반영되지만 새로고침 뒤 유지되지 않을 수
      있어요.
    </p>
  );
}
