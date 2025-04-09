import { FrequentlyAskedQuestions } from "@/app/components/FAQ/Items";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col m-10 mb-2 gap-y-6">
        <h1 className="text-4xl md:text-7xl font-bold text-slate-800">
          Got questions?
        </h1>
        <h1 className="text-2xl md:text-3xl font-medium text-slate-500">
          We hope we have the answers!
        </h1>
      </div>
      <div className="w-screen flex">
        <FrequentlyAskedQuestions />
      </div>
    </div>
  );
}