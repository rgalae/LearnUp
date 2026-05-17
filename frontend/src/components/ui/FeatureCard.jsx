function FeatureCard({ title, description }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-indigo-400/40 transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>

      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
