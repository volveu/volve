import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center overflow-auto bg-slate-900 text-slate-100">
      <div className="h-full w-full md:max-w-2xl">{props.children}</div>
    </main>
  );
};
