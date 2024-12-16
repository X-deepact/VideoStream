const LayoutHeading = ({ title }: { title: string }) => {
  return (
    <h1 className="scroll-m-20 text-xl font-bold tracking-tight block lg:hidden">
      {title}
    </h1>
  );
};

export default LayoutHeading;
