const ScrollSnapSection = ({ children }) => {
  return (
    <section className="snap-start min-h-screen flex items-center justify-center">
      {children}
    </section>
  );
};

export default ScrollSnapSection;
