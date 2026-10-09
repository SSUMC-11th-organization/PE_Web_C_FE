type StudyMember = {
  id: number;
  name: string;
  role: string;
  githubId?: string;
};

const members: StudyMember[] = [
  { id: 1, name: "광수", role: "백엔드", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "프론트엔드" },
];

function getMemberInfo(memberId: number): string {
  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return `ID ${memberId}에 해당하는 회원을 찾을 수 없습니다.`;
  }

  if (member.githubId) {
    return `${member.name} (${member.role}) - GitHub: ${member.githubId}`;
  }

  return `${member.name} (${member.role}) - GitHub 아이디 없음`;
}

console.log(getMemberInfo(1));
console.log(getMemberInfo(2));
console.log(getMemberInfo(999));