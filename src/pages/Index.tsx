
import { ChatbotContainer } from "@/components/chatbot/ChatbotContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smartflytt
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Din smarta partner för flytt - få offert eller boka direkt via vår chattbot
          </p>
        </div>
        
        <ChatbotContainer />
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Har du tekniska problem? Kontakta oss på info@smartflytt.se</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
