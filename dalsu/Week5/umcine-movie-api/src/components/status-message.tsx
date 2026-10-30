interface StatusMessageProps {
  kind: "loading" | "error" | "empty" | "guide";
  message: string;
}

// 로딩 / 오류 / 빈 결과 / 안내 상태를 한 곳에서 같은 모양으로 보여 줘요.
export default function StatusMessage({ kind, message }: StatusMessageProps) {
  return (
    <p
      className={`status-message status-message--${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}
