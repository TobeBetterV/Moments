const TopMenuWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"mt-2 flex justify-between bg-zinc-50 px-1"}>
      {children}
    </div>
  );
};

export { TopMenuWrapper };
