import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage(
            "입력값을 확인했어요. 실제 로그인 API는 다음 주차에 연결해요.",
        );
    }

    return (
        <main
            style={{
                maxWidth: 420,
                margin: "60px auto",
                padding: 24,
                fontFamily: "sans-serif",
            }}
        >
            <h1>로그인</h1>

            <form
                onSubmit={handleSubmit}
                style={{ display: "grid", gap: 20 }}
            >
                <div>
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setMessage("");
                        }}
                        style={{
                            display: "block",
                            boxSizing: "border-box",
                            width: "100%",
                            padding: 12,
                            marginTop: 8,
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setMessage("");
                        }}
                        style={{
                            display: "block",
                            boxSizing: "border-box",
                            width: "100%",
                            padding: 12,
                            marginTop: 8,
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!email.trim() || !password}
                    style={{ padding: 14 }}
                >
                    로그인
                </button>

                {message && <p role="status">{message}</p>}
            </form>

            <p>
                계정이 없나요? <Link to="/signup">회원가입</Link>
            </p>
        </main>
    );
}