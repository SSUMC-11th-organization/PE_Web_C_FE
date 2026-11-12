import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  memberErrorMessage,
  signup,
} from '../../api/members/requests';
import { FormField, FormPage, primaryButton, secondaryButton } from '../../components/auth/form-ui';
import { isEmailValid, isNicknameValid, isPasswordValid } from '../../utils/auth/validation';

type DuplicateField = 'email' | 'nickname';
type CheckState = { checking: boolean; checkedValue: string | null; error: string };
const initialCheck: CheckState = { checking: false, checkedValue: null, error: '' };

export function SignupPage() {
  const [form, setForm] = useState({ email: '', nickname: '', password: '', passwordConfirm: '' });
  const [checks, setChecks] = useState<Record<DuplicateField, CheckState>>({
    email: initialCheck,
    nickname: initialCheck,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ success: false, message: '' });
  // 빠르게 연속 클릭하거나 Enter를 반복해도 동일 요청이 겹치지 않아요.
  const locks = useRef({ email: false, nickname: false, submit: false });
  const emailValid = isEmailValid(form.email);
  const nicknameValid = isNicknameValid(form.nickname);
  const passwordValid = isPasswordValid(form.password);
  const confirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const canSubmit =
    emailValid &&
    nicknameValid &&
    passwordValid &&
    confirmValid &&
    checks.email.checkedValue === form.email.trim() &&
    checks.nickname.checkedValue === form.nickname.trim() &&
    !checks.email.checking &&
    !checks.nickname.checking &&
    !isSubmitting &&
    !feedback.success;

  function change(field: keyof typeof form, value: string) {
    if (
      locks.current.submit ||
      ((field === 'email' || field === 'nickname') && locks.current[field])
    )
      return;
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'email' || field === 'nickname')
      setChecks((current) => ({ ...current, [field]: initialCheck }));
    setFeedback({ success: false, message: '' });
  }
  async function check(field: DuplicateField) {
    if (
      locks.current[field] ||
      locks.current.submit ||
      !(field === 'email' ? emailValid : nicknameValid)
    )
      return;
    const value = form[field].trim();
    locks.current[field] = true;
    setChecks((current) => ({
      ...current,
      [field]: { checking: true, checkedValue: null, error: '' },
    }));
    try {
      const available = await (field === 'email'
        ? checkEmailDuplicate(value)
        : checkNicknameDuplicate(value));
      setChecks((current) => ({
        ...current,
        [field]: {
          checking: false,
          checkedValue: available ? value : null,
          error: available
            ? ''
            : `이미 사용 중인 ${field === 'email' ? '이메일' : '닉네임'}이에요.`,
        },
      }));
    } catch (error) {
      const message = await memberErrorMessage(error);
      setChecks((current) => ({
        ...current,
        [field]: { checking: false, checkedValue: null, error: message },
      }));
    } finally {
      locks.current[field] = false;
    }
  }
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || locks.current.submit) return;
    locks.current.submit = true;
    setIsSubmitting(true);
    setFeedback({ success: false, message: '' });
    try {
      const response = await signup(form);
      setFeedback({ success: true, message: response.message });
      setForm((current) => ({ ...current, password: '', passwordConfirm: '' }));
    } catch (error) {
      setFeedback({ success: false, message: await memberErrorMessage(error) });
      // 확인 후 다른 사용자가 먼저 가입했을 수 있어 다음 제출 전에 다시 확인해요.
      setChecks({ email: initialCheck, nickname: initialCheck });
    } finally {
      locks.current.submit = false;
      setIsSubmitting(false);
    }
  }
  return (
    <FormPage title="회원가입" description="UMCine에서 나만의 영화 취향을 찾아보세요.">
      <form onSubmit={submit} noValidate className="space-y-6" aria-busy={isSubmitting}>
        <FormField
          id="signup-email"
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해주세요"
          maxLength={254}
          value={form.email}
          onChange={(event) => change('email', event.target.value)}
          disabled={isSubmitting || checks.email.checking}
          error={
            form.email && !emailValid ? '올바른 이메일 형식으로 입력해 주세요.' : checks.email.error
          }
          hint={checks.email.checkedValue ? '사용할 수 있는 이메일이에요.' : undefined}
          action={
            <button
              type="button"
              className={secondaryButton}
              disabled={!emailValid || isSubmitting || checks.email.checking}
              onClick={() => void check('email')}
              aria-label="이메일 중복 확인"
            >
              {checks.email.checking ? '확인 중' : '중복 확인'}
            </button>
          }
        />
        <FormField
          id="signup-nickname"
          label="닉네임"
          autoComplete="nickname"
          placeholder="닉네임을 입력해주세요"
          maxLength={24}
          value={form.nickname}
          onChange={(event) => change('nickname', event.target.value)}
          disabled={isSubmitting || checks.nickname.checking}
          error={
            form.nickname && !nicknameValid
              ? '닉네임은 2~12자로 입력해 주세요.'
              : checks.nickname.error
          }
          hint={
            checks.nickname.checkedValue
              ? '사용할 수 있는 닉네임이에요.'
              : '2~12자로 입력해 주세요.'
          }
          action={
            <button
              type="button"
              className={secondaryButton}
              disabled={!nicknameValid || isSubmitting || checks.nickname.checking}
              onClick={() => void check('nickname')}
              aria-label="닉네임 중복 확인"
            >
              {checks.nickname.checking ? '확인 중' : '중복 확인'}
            </button>
          }
        />
        <FormField
          id="signup-password"
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 입력해주세요"
          maxLength={72}
          value={form.password}
          onChange={(event) => change('password', event.target.value)}
          disabled={isSubmitting}
          error={
            form.password && !passwordValid
              ? '영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함한 8~72자로 입력해 주세요.'
              : undefined
          }
          hint="영문 대·소문자, 숫자, 특수문자(!@#$%^&*) 포함 8자 이상"
        />
        <FormField
          id="signup-confirm"
          label="비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력해주세요"
          maxLength={72}
          value={form.passwordConfirm}
          onChange={(event) => change('passwordConfirm', event.target.value)}
          disabled={isSubmitting}
          error={form.passwordConfirm && !confirmValid ? '비밀번호가 일치하지 않아요.' : undefined}
        />
        {feedback.message && (
          <p
            role={feedback.success ? 'status' : 'alert'}
            className={`rounded-lg p-4 text-sm ${feedback.success ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-700'}`}
          >
            {feedback.message}
          </p>
        )}
        <button type="submit" className={`${primaryButton} w-full`} disabled={!canSubmit}>
          {isSubmitting ? '가입 중' : '가입하기'}
        </button>
        <p className="text-center text-sm text-muted">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="ml-2 font-bold text-primary">
            로그인
          </Link>
        </p>
      </form>
    </FormPage>
  );
}
