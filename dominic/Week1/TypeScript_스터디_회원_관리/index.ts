type StudyMember = {
  id: number;
  name: string;
  role: "leader" | "member";
  githubId?: string;
};

const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function findMemberMessage(memberId: number): string {
  const member = members.find((member) => member.id === memberId);

  if (!member) {
    return `회원 ID ${memberId}에 해당하는 회원이 없습니다.`;
  }

  const githubMessage = member.githubId
    ? `GitHub 아이디: ${member.githubId}`
    : "GitHub 아이디가 없습니다.";

  return `회원 ID ${member.id}: ${member.name} (${member.role}), ${githubMessage}`;
}

for (const memberId of [1, 2, 999]) {
  console.log(findMemberMessage(memberId));
}
