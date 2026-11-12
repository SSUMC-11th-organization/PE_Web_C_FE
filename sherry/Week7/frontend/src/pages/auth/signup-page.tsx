import { useState, type FormEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
    isChecking: false,
    isAvailable: false,
};

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

const inputStyle = {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: 12,
    marginTop: 8,
} as const;

function SignupPage() {
    const [form, setForm] = useState(DEFAULT_FORM);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateCheck, setDuplicateCheck] = useState({
        email: DEFAULT_DUPLICATE_CHECK,
        nickname: DEFAULT_DUPLICATE_CHECK,
    });

    // 입력값 검사
    const isEmailValid = EMAIL_REGEX.test(form.email.trim());

    const isNicknameValid =
        form.nickname.trim().length >= 2 &&
        form.nickname.trim().length <= 12;

    const isPasswordValid = PASSWORD_REGEX.test(form.password);

    const isPasswordConfirmValid =
        form.passwordConfirm.length > 0 &&
        form.password === form.passwordConfirm;

    // 입력을 시작한 필드에만 오류 표시
    const showEmailError = form.email.length > 0 && !isEmailValid;

    const showNicknameError =
        form.nickname.length > 0 && !isNicknameValid;

    const showPasswordError =
        form.password.length > 0 && !isPasswordValid;

    const showPasswordConfirmError =
        form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

    const isFormValid =
        isEmailValid &&
        isNicknameValid &&
        isPasswordValid &&
        isPasswordConfirmValid;

    // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
    const canSubmit =
        isFormValid &&
        duplicateCheck.email.isAvailable &&
        duplicateCheck.nickname.isAvailable;

    function handleChangeField(key: FormKey, value: string) {
        if (key === "email" || key === "nickname") {
            if (duplicateCheck[key].isChecking) return;

            // 확인한 값을 수정하면 다시 중복 확인해야 함
            setDuplicateCheck((prev) => ({
                ...prev,
                [key]: DEFAULT_DUPLICATE_CHECK,
            }));
        }

        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setMessage("");
    }

    async function handleCheckDuplicate(key: DuplicateCheckKey) {
        const isValid =
            key === "email" ? isEmailValid : isNicknameValid;

        if (!isValid || duplicateCheck[key].isChecking) return;

        const label = key === "email" ? "이메일" : "닉네임";

        setDuplicateCheck((prev) => ({
            ...prev,
            [key]: {
                isChecking: true,
                isAvailable: false,
            },
        }));

        try {
            const response =
                key === "email"
                    ? await checkEmailDuplicate(form.email.trim())
                    : await checkNicknameDuplicate(form.nickname.trim());

            const isAvailable = response.available === true;

            setDuplicateCheck((prev) => ({
                ...prev,
                [key]: {
                    isChecking: true,
                    isAvailable,
                },
            }));

            alert(
                isAvailable
                    ? `사용할 수 있는 ${label}이에요.`
                    : `이미 사용 중인 ${label}이에요.`,
            );
        } catch {
            alert("중복 확인에 실패했어요. 서버 연결을 확인해 주세요.");
        } finally {
            setDuplicateCheck((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    isChecking: false,
                },
            }));
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canSubmit || isSubmitting) return;

        setIsSubmitting(true);
        setMessage("");

        try {
            const response = await signup({
                email: form.email.trim(),
                nickname: form.nickname.trim(),
                password: form.password,
            });

            setMessage(response.message);
        } catch {
            setMessage("회원가입에 실패했어요. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
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
            <h1>회원가입</h1>
            <p>회원 정보를 입력해 주세요.</p>

            <form
                onSubmit={handleSubmit}
                noValidate
                style={{ display: "grid", gap: 20 }}
            >
                <div>
                    <label htmlFor="email">이메일</label>

                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="example@email.com"
                        value={form.email}
                        onChange={(event) =>
                            handleChangeField("email", event.target.value)
                        }
                        disabled={duplicateCheck.email.isChecking}
                        aria-invalid={showEmailError}
                        aria-describedby="email-feedback"
                        style={inputStyle}
                    />

                    {showEmailError && (
                        <p id="email-feedback" style={{ color: "#e85d5d" }}>
                            올바른 이메일 형식으로 입력해 주세요.
                        </p>
                    )}

                    <button
                        type="button"
                        disabled={
                            !isEmailValid || duplicateCheck.email.isChecking
                        }
                        onClick={() => handleCheckDuplicate("email")}
                        style={{ marginTop: 8 }}
                    >
                        {duplicateCheck.email.isChecking
                            ? "확인 중"
                            : "이메일 중복 확인"}
                    </button>

                    {duplicateCheck.email.isAvailable && (
                        <p style={{ color: "#46b979" }}>
                            사용 가능한 이메일이에요.
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="nickname">닉네임</label>

                    <input
                        id="nickname"
                        type="text"
                        autoComplete="nickname"
                        placeholder="2~12자"
                        value={form.nickname}
                        onChange={(event) =>
                            handleChangeField("nickname", event.target.value)
                        }
                        disabled={duplicateCheck.nickname.isChecking}
                        aria-invalid={showNicknameError}
                        aria-describedby="nickname-feedback"
                        style={inputStyle}
                    />

                    {showNicknameError && (
                        <p
                            id="nickname-feedback"
                            style={{ color: "#e85d5d" }}
                        >
                            닉네임은 2~12자로 입력해 주세요.
                        </p>
                    )}

                    <button
                        type="button"
                        disabled={
                            !isNicknameValid ||
                            duplicateCheck.nickname.isChecking
                        }
                        onClick={() => handleCheckDuplicate("nickname")}
                        style={{ marginTop: 8 }}
                    >
                        {duplicateCheck.nickname.isChecking
                            ? "확인 중"
                            : "닉네임 중복 확인"}
                    </button>

                    {duplicateCheck.nickname.isAvailable && (
                        <p style={{ color: "#46b979" }}>
                            사용 가능한 닉네임이에요.
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">비밀번호</label>

                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={(event) =>
                            handleChangeField("password", event.target.value)
                        }
                        aria-invalid={showPasswordError}
                        aria-describedby="password-hint"
                        style={inputStyle}
                    />

                    <p
                        id="password-hint"
                        style={{
                            fontSize: 13,
                            color: showPasswordError ? "#e85d5d" : "inherit",
                        }}
                    >
                        영문 대문자·소문자, 숫자, 특수문자(!@#$%^&amp;*)를
                        모두 포함해 8자 이상 입력해 주세요.
                    </p>
                </div>

                <div>
                    <label htmlFor="passwordConfirm">
                        비밀번호 확인
                    </label>

                    <input
                        id="passwordConfirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="비밀번호를 다시 입력해 주세요"
                        value={form.passwordConfirm}
                        onChange={(event) =>
                            handleChangeField(
                                "passwordConfirm",
                                event.target.value,
                            )
                        }
                        aria-invalid={showPasswordConfirmError}
                        aria-describedby="password-confirm-error"
                        style={inputStyle}
                    />

                    {showPasswordConfirmError && (
                        <p
                            id="password-confirm-error"
                            style={{ color: "#e85d5d" }}
                        >
                            비밀번호가 일치하지 않아요.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    style={{
                        padding: 14,
                        background: canSubmit ? "#646cff" : "#555",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: canSubmit ? "pointer" : "not-allowed",
                    }}
                >
                    {isSubmitting ? "가입 중" : "가입하기"}
                </button>

                {message && <p role="status">{message}</p>}
            </form>
        </main>
    );
}

export default SignupPage;