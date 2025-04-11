
export async function fetchGeminiAnalysis(statementText: string): Promise<string> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + import.meta.env.VITE_GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analise o seguinte extrato bancário e forneça uma explicação breve sobre os tipos de transações e possíveis alertas para o usuário. Seja objetivo, claro e útil:\n\n" + statementText
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return output || "Nenhuma resposta encontrada pela IA.";
  } catch (error) {
    console.error("Erro ao acessar a API do Gemini:", error);
    return "Erro ao tentar acessar a IA. Tente novamente mais tarde.";
  }
}
