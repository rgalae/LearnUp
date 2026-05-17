function Card({ children }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      {children}
    </div>
  );
}

export default Card;
