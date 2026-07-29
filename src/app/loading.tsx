import RiseUpLoader from "@/components/RiseUpLoader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <RiseUpLoader className="text-4xl" />
    </div>
  );
}
