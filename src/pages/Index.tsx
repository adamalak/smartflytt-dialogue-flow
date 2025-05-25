
import { ChatbotPopup } from "@/components/ChatbotPopup";
import { ConfigStatus } from "@/components/ConfigStatus";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smartflytt
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Din smarta partner för flytt - få preliminär offert direkt via vår chattbot
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg inline-block">
            <p className="text-lg text-gray-700 mb-4">
              Klicka på den gröna chattikonen för att få din preliminära offert! ⬇️
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span>Chattbot redo</span>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-2xl mx-auto">
          <ConfigStatus />
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Har du tekniska problem? Kontakta oss på smartflyttlogistik@gmail.com</p>
        </div>
      </div>
      
      {/* Chatbot Popup Component */}
      <ChatbotPopup />
    </div>
  );
};

export default Index;
