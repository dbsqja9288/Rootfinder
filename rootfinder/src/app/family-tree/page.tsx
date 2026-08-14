import type { Metadata } from "next";
import FamilyTree from "@/components/FamilyTree";

export const metadata: Metadata = {
  title: "가계도 만들기",
  description: "가족 구성원을 입력해 한 장의 가계도로 그리고 이미지로 저장하세요. 데이터는 브라우저에만 저장됩니다.",
};

export default function FamilyTreePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="serif text-3xl font-bold sm:text-4xl">가계도 만들기</h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-inksoft">
          박스를 클릭해 이름을 고치고 자녀를 더해가며 우리 집 가계도를 완성해보세요. 다 만들면 PNG 이미지로 저장해
          가족에게 공유할 수 있습니다.
        </p>
      </header>
      <FamilyTree />
    </div>
  );
}
