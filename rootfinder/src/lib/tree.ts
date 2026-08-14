export type Member = {
  id: string;
  name: string;
  spouse?: string;
  note?: string; // 생몰년, 관계 메모 등
  parentId: string | null;
};

export type LaidOutNode = {
  member: Member;
  x: number; // 박스 좌상단
  y: number;
  children: LaidOutNode[];
};

export const NODE_W = 168;
export const NODE_H = 68;
export const H_GAP = 28;
export const V_GAP = 74;

/** 자식 폭의 합을 기준으로 부모를 가운데 정렬하는 단순 tidy-tree 레이아웃 */
function measure(member: Member, all: Member[]): number {
  const kids = all.filter((m) => m.parentId === member.id);
  if (kids.length === 0) return NODE_W;
  const sum = kids.reduce((acc, k) => acc + measure(k, all), 0) + H_GAP * (kids.length - 1);
  return Math.max(NODE_W, sum);
}

function place(member: Member, all: Member[], left: number, depth: number): LaidOutNode {
  const width = measure(member, all);
  const kids = all.filter((m) => m.parentId === member.id);

  let cursor = left;
  const children = kids.map((k) => {
    const node = place(k, all, cursor, depth + 1);
    cursor += measure(k, all) + H_GAP;
    return node;
  });

  return {
    member,
    x: left + width / 2 - NODE_W / 2,
    y: depth * (NODE_H + V_GAP),
    children,
  };
}

export function layout(members: Member[]) {
  const roots = members.filter((m) => m.parentId === null || !members.some((p) => p.id === m.parentId));
  let cursor = 0;
  const nodes = roots.map((r) => {
    const n = place(r, members, cursor, 0);
    cursor += measure(r, members) + H_GAP * 2;
    return n;
  });
  const width = Math.max(cursor - H_GAP * 2, NODE_W);
  const depth = maxDepth(nodes);
  const height = depth * (NODE_H + V_GAP) + NODE_H;
  return { nodes, width, height };
}

function maxDepth(nodes: LaidOutNode[], d = 0): number {
  if (nodes.length === 0) return d - 1;
  return Math.max(...nodes.map((n) => (n.children.length ? maxDepth(n.children, d + 1) : d)));
}

export function flatten(nodes: LaidOutNode[]): LaidOutNode[] {
  return nodes.flatMap((n) => [n, ...flatten(n.children)]);
}

export const SAMPLE: Member[] = [
  { id: "g1", name: "김판서", spouse: "이씨", note: "고조부", parentId: null },
  { id: "g2a", name: "김대감", spouse: "박씨", note: "증조부", parentId: "g1" },
  { id: "g2b", name: "김참판", note: "증조부의 아우", parentId: "g1" },
  { id: "g3a", name: "김영수", spouse: "최정희", note: "조부", parentId: "g2a" },
  { id: "g3b", name: "김영철", note: "종조부", parentId: "g2a" },
  { id: "g4a", name: "김대호", spouse: "정미영", note: "아버지", parentId: "g3a" },
  { id: "g5a", name: "김서준", note: "본인", parentId: "g4a" },
  { id: "g5b", name: "김서연", note: "누나", parentId: "g4a" },
];
