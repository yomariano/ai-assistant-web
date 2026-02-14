import { PhoneMissed, Clock, Wallet } from "lucide-react";

const ProblemSectionES = () => {
  const problems = [
    {
      icon: PhoneMissed,
      title: "Llamadas Perdidas = Negocio Perdido",
      description:
        "Suena el teléfono mientras atendés a un cliente. No podés contestar. Ese llamador pasa a tu competencia. Cada llamada perdida es plata que se va.",
      stat: "67%",
      statLabel: "de los que llaman no dejan mensaje",
    },
    {
      icon: Clock,
      title: "Llamadas Fuera de Horario",
      description:
        "Los clientes llaman a las 6pm, 8pm, fines de semana. Tu teléfono va al buzón. Cuelgan y prueban con otro. Nunca te enteraste de que llamaron.",
      stat: "40%",
      statLabel: "de las llamadas son fuera de horario",
    },
    {
      icon: Wallet,
      title: "Costo de Recepcionista",
      description:
        "Contratar a alguien solo para atender el teléfono cuesta más de USD 12.000 al año. Y no puede trabajar de noche, fines de semana ni feriados.",
      stat: "USD 12k+",
      statLabel: "salario anual de recepcionista",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Cada Llamada Perdida Es{" "}
            <span className="text-gradient-primary">Una Oportunidad Perdida</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Las pymes pierden miles de pesos cada año por llamadas sin responder
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl border border-border p-8 shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive/50 to-destructive rounded-t-2xl" />

              <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>

              <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                {problem.title}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {problem.description}
              </p>

              <div className="pt-6 border-t border-border">
                <div className="text-3xl font-heading font-bold text-destructive">
                  {problem.stat}
                </div>
                <div className="text-sm text-muted-foreground">{problem.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSectionES;
