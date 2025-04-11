
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { FileQuestion, Upload, FileSearch, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ComoFunciona = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const steps = [
    {
      icon: <Upload className="h-12 w-12 text-primary" />,
      title: "Faça upload de seu extrato",
      description: "Envie o PDF do seu extrato bancário ou conta de serviços para nossa plataforma segura."
    },
    {
      icon: <FileSearch className="h-12 w-12 text-primary" />,
      title: "Deixe-nos analisar seu documento",
      description: "Nosso sistema processará o documento e transformará termos técnicos em explicações claras e acessíveis."
    },
    {
      icon: <VolumeX className="h-12 w-12 text-primary" />,
      title: "Acesse o conteúdo como preferir",
      description: "Leia o extrato esclarecido ou utilize nossa função de leitura em voz alta para maior acessibilidade."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero section */}
          <section className="text-center space-y-6">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <FileQuestion className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Como funciona o Clareia</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Em apenas três passos simples, transformamos documentos financeiros confusos em informações claras e acessíveis para todos.
            </p>
          </section>

          {/* Steps section */}
          <section className="space-y-16">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="flex flex-col md:flex-row items-center gap-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center shrink-0 ${
                  index % 2 === 0 ? "bg-primary/10" : "bg-accent/80"
                }`}>
                  {step.icon}
                </div>
                <div className="space-y-3 md:flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-semibold">
                    <span className="text-primary mr-2">
                      {index + 1}.
                    </span>
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Features section */}
          <section className="bg-muted p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Recursos que facilitam sua vida</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Explicação simples",
                  description: "Termos técnicos traduzidos para linguagem cotidiana"
                },
                {
                  title: "Leitura em voz alta",
                  description: "Opção acessível para pessoas com dificuldades visuais"
                },
                {
                  title: "Exportação em PDF",
                  description: "Salve seu extrato esclarecido para referência futura"
                },
                {
                  title: "Interface adaptativa",
                  description: "Funciona perfeitamente em computadores, tablets e celulares"
                },
                {
                  title: "Modo escuro",
                  description: "Opção de visualização para maior conforto visual"
                },
                {
                  title: "Processamento seguro",
                  description: "Seus dados são processados com segurança e privacidade"
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA section */}
          <section className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Pronto para entender seus extratos?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experimente agora e transforme a maneira como você lê seus documentos financeiros.
            </p>
            <Button onClick={() => navigate('/')} size="lg" className="mt-2">
              Começar agora
            </Button>
          </section>
        </div>
      </main>

      <footer className="py-6 border-t border-border bg-secondary">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Clareia. Todos os direitos reservados.</p>
          <p className="mt-1">Ajudando pessoas a entenderem seus extratos.</p>
        </div>
      </footer>
    </div>
  );
};

export default ComoFunciona;
