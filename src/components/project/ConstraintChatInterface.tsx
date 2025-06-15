import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  ragStatus?: 'good' | 'moderate' | 'challenging';
}

interface ConstraintChatInterfaceProps {
  analysis: any;
  projectName: string;
}

const ConstraintChatInterface = ({ analysis, projectName }: ConstraintChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm Australis AI, your solar development assistant. I've analyzed the constraints for ${projectName}. How can I help you understand the developability assessment?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRAGStatus = (score: number): 'good' | 'moderate' | 'challenging' => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'moderate';
    return 'challenging';
  };

  const getRAGColor = (status: 'good' | 'moderate' | 'challenging') => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Environmental queries
    if (lowerMessage.includes('environmental') || lowerMessage.includes('sssi') || lowerMessage.includes('wildlife') || lowerMessage.includes('nature')) {
      const envCategory = analysis?.categories?.find((cat: any) => cat.category === 'environmental');
      if (envCategory) {
        const ragStatus = getRAGStatus(envCategory.score);
        const ragText = ragStatus === 'good' ? '🟢 GREEN' : ragStatus === 'moderate' ? '🟡 AMBER' : '🔴 RED';
        
        return `Environmental constraints show a ${ragText} status with a score of ${envCategory.score}/100. 

${ragStatus === 'good' ? 
  'This is excellent news! The site has minimal environmental constraints, indicating low ecological sensitivity and good development potential.' :
  ragStatus === 'moderate' ?
  'There are some environmental considerations that need attention. This means development is possible but may require environmental mitigation measures.' :
  'Significant environmental constraints detected. This indicates high ecological sensitivity requiring detailed environmental impact assessment.'
}

Key environmental factors analyzed:
${envCategory.constraints?.map((c: any) => `• ${c.constraint_name}: ${c.status.toUpperCase()} (${c.score}/100)`).join('\n') || 'No specific constraints detailed'}

Would you like me to explain any specific environmental constraint in more detail?`;
      }
    }

    // Heritage queries
    if (lowerMessage.includes('heritage') || lowerMessage.includes('historic') || lowerMessage.includes('listed') || lowerMessage.includes('conservation')) {
      const heritageCategory = analysis?.categories?.find((cat: any) => cat.category === 'heritage');
      if (heritageCategory) {
        const ragStatus = getRAGStatus(heritageCategory.score);
        const ragText = ragStatus === 'good' ? '🟢 GREEN' : ragStatus === 'moderate' ? '🟡 AMBER' : '🔴 RED';
        
        return `Heritage constraints assessment shows ${ragText} status (${heritageCategory.score}/100).

${ragStatus === 'good' ? 
  'Excellent! Minimal heritage constraints mean the site has low archaeological and historic sensitivity.' :
  ragStatus === 'moderate' ?
  'Moderate heritage sensitivity. Development possible but may require archaeological assessment and heritage impact evaluation.' :
  'High heritage sensitivity detected. Significant archaeological or historic constraints may impact development viability.'
}

Heritage factors include:
${heritageCategory.constraints?.map((c: any) => `• ${c.constraint_name}: ${c.status.toUpperCase()}`).join('\n') || 'No specific heritage constraints found'}`;
      }
    }

    // Planning queries
    if (lowerMessage.includes('planning') || lowerMessage.includes('policy') || lowerMessage.includes('development') || lowerMessage.includes('approval')) {
      const planningCategory = analysis?.categories?.find((cat: any) => cat.category === 'planning');
      if (planningCategory) {
        const ragStatus = getRAGStatus(planningCategory.score);
        const ragText = ragStatus === 'good' ? '🟢 GREEN' : ragStatus === 'moderate' ? '🟡 AMBER' : '🔴 RED';
        
        return `Planning assessment indicates ${ragText} status (${planningCategory.score}/100).

${ragStatus === 'good' ? 
  'Strong planning position! The site aligns well with planning policies and shows good development potential.' :
  ragStatus === 'moderate' ?
  'Mixed planning considerations. Development is feasible but may require careful planning strategy and stakeholder engagement.' :
  'Challenging planning environment. Significant policy constraints may require innovative approaches or alternative site considerations.'
}

I'd recommend engaging with local planning authorities early for pre-application advice.`;
      }
    }

    // Landscape queries
    if (lowerMessage.includes('landscape') || lowerMessage.includes('visual') || lowerMessage.includes('aonb') || lowerMessage.includes('scenic')) {
      const landscapeCategory = analysis?.categories?.find((cat: any) => cat.category === 'landscape');
      if (landscapeCategory) {
        const ragStatus = getRAGStatus(landscapeCategory.score);
        const ragText = ragStatus === 'good' ? '🟢 GREEN' : ragStatus === 'moderate' ? '🟡 AMBER' : '🔴 RED';
        
        return `Landscape and visual impact assessment: ${ragText} status (${landscapeCategory.score}/100).

${ragStatus === 'good' ? 
  'Low landscape sensitivity! The site has minimal visual constraints and good screening potential.' :
  ragStatus === 'moderate' ?
  'Moderate landscape sensitivity. Visual impact mitigation through landscaping and design optimization may be required.' :
  'High landscape sensitivity. Significant visual constraints may limit development options or require substantial mitigation.'
}

Consider landscape-led design approaches to minimize visual impact.`;
      }
    }

    // Overall score queries
    if (lowerMessage.includes('overall') || lowerMessage.includes('total') || lowerMessage.includes('summary') || lowerMessage.includes('score')) {
      const overallRag = getRAGStatus(analysis?.overall_score || 0);
      const ragText = overallRag === 'good' ? '🟢 GREEN' : overallRag === 'moderate' ? '🟡 AMBER' : '🔴 RED';
      
      return `Overall Developability Score: ${analysis?.overall_score || 0}/100 (${ragText} status)

${overallRag === 'good' ? 
  '🎉 Excellent development potential! This site shows strong suitability for solar farm development with minimal constraints.' :
  overallRag === 'moderate' ?
  '⚖️ Moderate development potential. Feasible with proper planning and constraint mitigation strategies.' :
  '⚠️ Challenging development environment. Significant constraints require careful evaluation and may impact project viability.'
}

Key statistics:
• ${analysis?.summary?.total_constraints_analyzed || 0} constraints analyzed
• ${analysis?.summary?.constraints_within_buffer || 0} constraints within analysis buffer
• ${analysis?.summary?.major_constraints?.length || 0} major constraints identified

Would you like me to dive deeper into any specific aspect?`;
    }

    // Recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('next steps') || lowerMessage.includes('what should')) {
      return `Based on the constraint analysis, here are my key recommendations:

${analysis?.summary?.recommendations?.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n\n') || 'No specific recommendations available'}

🔄 **Immediate Actions:**
• Review detailed environmental survey requirements
• Engage with local planning authority for pre-application discussions
• Consider constraint mitigation strategies
• Plan stakeholder engagement activities

💡 **Pro tip:** Start with the highest-risk constraints first to validate project viability early in the development process.`;
    }

    // Default response
    return `I can help you understand various aspects of the constraint analysis for ${projectName}:

🌱 **Environmental constraints** - Wildlife sites, protected habitats, ecological designations
🏛️ **Heritage constraints** - Historic buildings, archaeological sites, conservation areas  
🏞️ **Landscape constraints** - Visual impact, protected landscapes, scenic designations
📋 **Planning constraints** - Policy alignment, development restrictions, zoning

Current overall score: **${analysis?.overall_score || 0}/100**

What specific aspect would you like to explore? You can ask about:
• "Tell me about environmental constraints"
• "What are the planning challenges?"
• "Overall site suitability"
• "Recommendations for next steps"`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="w-5 h-5 text-australis-blue" />
          Chat with Australis AI
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-australis-blue text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-lg break-words overflow-wrap-anywhere ${
                  message.type === 'user' 
                    ? 'bg-australis-blue text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about constraints, planning, or site suitability..."
              className="flex-1 min-w-0"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConstraintChatInterface;
