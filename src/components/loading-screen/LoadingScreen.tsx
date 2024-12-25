import Logo from "@/shared/Logo";

export default function LoadingScreen() {
  return (
    <div className="z- z-max fixed bottom-0 right-0 flex h-full w-full items-center justify-center bg-white dark:bg-black/20">
      <Logo />
    </div>
  );
}
