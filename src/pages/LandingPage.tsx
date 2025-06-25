import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card-components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { cn } from "@/lib/utils";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/hoje');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/hoje');
  };

  const handleGoogleAuth = () => {
    // Implement Google authentication
    navigate('/hoje');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={`${import.meta.env.BASE_URL || ''}images/farm.mp4`}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-10" />
      {/* Main Content */}
      <div className="relative z-20 flex flex-col w-full h-full px-6 md:px-20 py-10">
        {/* Logo and Title Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12">
          <img 
            src={`${import.meta.env.BASE_URL || ''}logo.png`} 
            alt="AgroGest Logo" 
            className="h-16 md:h-24 w-auto object-contain"
          />
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold text-left drop-shadow-lg tracking-wide leading-tight">
            O SEU GESTOR AGRÍCOLA
          </h1>
        </div>

        {/* Content Grid - moved 35px higher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center -mt-[35px]">
          {/* Left Column - Empty space for balance */}
          <div className="flex flex-col gap-6">
            {/* Only title is in the header section */}
          </div>

          {/* Right Column - Auth Card */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-white/70 backdrop-blur-sm border-none shadow-xl">
              {/* Card with 15px margins */}
              <CardContent className="p-[15px]">
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-2 bg-[#F5A926]/20">
                    <TabsTrigger 
                      value="login"
                      className="data-[state=active]:bg-[#F5A926] data-[state=active]:text-white"
                    >
                      Entrar
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="data-[state=active]:bg-[#F5A926] data-[state=active]:text-white"
                    >
                      Cadastrar
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-3">
                      <div>
                        <Input type="email" placeholder="Email" className="w-full" required />
                      </div>
                      <div>
                        <Input type="password" placeholder="Senha" className="w-full" required />
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-3">
                      <div>
                        <Input type="text" placeholder="Nome" className="w-full" required />
                      </div>
                      <div>
                        <Input type="email" placeholder="Email" className="w-full" required />
                      </div>
                      <div>
                        <Input type="password" placeholder="Senha" className="w-full" required />
                      </div>
                      <div>
                        <Input type="password" placeholder="Confirmar Senha" className="w-full" required />
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
                

                
              </CardContent>
            </Card>
            
            {/* Buttons outside the card */}
            <div className="flex flex-col items-center mt-4">
              {/* Entrar button directly under card - width matches input fields exactly */}
              <Button 
                onClick={handleLogin}
                className="w-[calc(100%-60px)] max-w-md bg-[#F5A926] hover:bg-[#e09a22] text-white py-1"
              >
                Entrar
              </Button>
              
              {/* Google login button with one line gap - moved 10px lower */}
              <div className="mt-6">
                <button 
                  onClick={handleGoogleAuth} 
                  className="flex items-center justify-center gap-2 text-white hover:text-[#F5A926] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                  Entrar pelo Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
