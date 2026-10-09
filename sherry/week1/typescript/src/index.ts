type studymember={
  id: number,
  name: string,
  role: string,
  gitid?: string 
};
const member1 : studymember={
  id: 1,
  name: "steve",
  role: "student",
  gitid: "jim",
};
const member2 : studymember={
  id: 2,
  name: "amy",
  role: "teacher",
};
function findmember(memberid: number): string{
  let selectedmember: studymember | undefined;
  if(memberid===member1.id){
      selectedmember=member1;
  }else if(memberid===member2.id){
    selectedmember=member2;
  }
  if(!selectedmember){
    return "존재하지 않는 회원이에요.";
  }
  const githubid = selectedmember.gitid ?? "등록되지 않음";

  return(
    "이름: "+selectedmember.name+" 역할: "+selectedmember.role+" github id: "+githubid
  );
  }

console.log(findmember(1));
console.log(findmember(2));
console.log(findmember(999));
