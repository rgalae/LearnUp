function DashboardCards() {
  const cards = [
    {
      title: "Courses",
      value: "12",
    },
    {
      title: "Progress",
      value: "78%",
    },
    {
      title: "Quizzes",
      value: "24",
    },
    {
      title: "Certificates",
      value: "3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            bg-white/5
            border border-white/10
            backdrop-blur-xl
            rounded-3xl
            p-6
            hover:bg-white/10
            transition
          "
        >
          <p className="text-slate-400 text-sm mb-3">{card.title}</p>

          <h2 className="text-4xl font-bold">{card.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
