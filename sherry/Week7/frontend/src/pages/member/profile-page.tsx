import { useState, type FormEvent } from "react";

export function ProfilePage() {
    const [profile, setProfile] = useState({
        email: "test@example.com",
        nickname: "영화학생",
        bio: "영화 보는 걸 좋아해요.",
    });

    const [form, setForm] = useState(profile);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    const isNicknameValid =
        form.nickname.trim().length >= 2 &&
        form.nickname.trim().length <= 12;

    function handleEdit() {
        setForm({ ...profile });
        setMessage("");
        setIsEditing(true);
    }

    function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!isNicknameValid) return;

        setProfile({
            ...form,
            nickname: form.nickname.trim(),
        });

        setIsEditing(false);
        setMessage("수정한 내용이 화면에 반영됐어요.");
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
            <h1>{isEditing ? "내 정보 수정" : "내 정보"}</h1>

            <p style={{ fontSize: 13 }}>
                화면 실습용 예시 정보예요. 서버에는 저장되지 않으며
                새로고침하면 초기화돼요.
            </p>

            {isEditing ? (
                <form
                    onSubmit={handleSave}
                    style={{ display: "grid", gap: 20 }}
                >
                    <div>
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            value={form.email}
                            readOnly
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label htmlFor="nickname">닉네임</label>
                        <input
                            id="nickname"
                            value={form.nickname}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    nickname: event.target.value,
                                }))
                            }
                            aria-invalid={!isNicknameValid}
                            aria-describedby="nickname-hint"
                            style={inputStyle}
                        />

                        <p
                            id="nickname-hint"
                            style={{
                                fontSize: 13,
                                color: isNicknameValid ? "inherit" : "#e85d5d",
                            }}
                        >
                            닉네임은 2~12자로 입력해 주세요.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="bio">소개</label>
                        <textarea
                            id="bio"
                            value={form.bio}
                            maxLength={200}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    bio: event.target.value,
                                }))
                            }
                            style={{ ...inputStyle, minHeight: 100 }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isNicknameValid}
                        style={{ padding: 14 }}
                    >
                        저장
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        style={{ padding: 14 }}
                    >
                        취소
                    </button>
                </form>
            ) : (
                <>
                    <dl style={{ textAlign: "left", lineHeight: 2 }}>
                        <dt>이메일</dt>
                        <dd>{profile.email}</dd>

                        <dt>닉네임</dt>
                        <dd>{profile.nickname}</dd>

                        <dt>소개</dt>
                        <dd style={{ whiteSpace: "pre-wrap" }}>
                            {profile.bio || "소개가 없어요."}
                        </dd>
                    </dl>

                    <button onClick={handleEdit} style={{ padding: 14 }}>
                        내 정보 수정
                    </button>
                </>
            )}

            {message && <p role="status">{message}</p>}
        </main>
    );
}

const inputStyle = {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: 12,
    marginTop: 8,
} as const;