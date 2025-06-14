import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "How is the data sourced?",
      answer: "Australis uses a combination of publicly available geospatial data, proprietary datasets, and real-time grid information from trusted sources including Ordnance Survey, environmental agencies, and grid operators."
    },
    {
      question: "How accurate is the developability score?",
      answer: "Our developability scores are based on comprehensive analysis of multiple factors including planning policy, grid constraints, land characteristics, and environmental considerations. The algorithm is continuously refined based on real development outcomes."
    },
    {
      question: "Can I export data from the platform?",
      answer: "Yes, you can export site reports, developability scores, and constraint maps in various formats including PDF, CSV, and GIS-compatible files for further analysis in your preferred tools."
    },
    {
      question: "How often is the data updated?",
      answer: "Core datasets are updated quarterly, while dynamic data like grid capacity information is refreshed weekly. Planning policy interpretations are updated whenever significant policy changes occur."
    },
    {
      question: "Is Australis available outside the UK?",
      answer: "Currently, Australis is focused on the UK market. However, we have plans to expand to other European markets and North America in the future. Contact us to discuss your specific needs."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Have other questions? Contact us at <a href="mailto:hello@australis.energy" className="text-primary hover:underline">hello@australis.energy</a>
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-border">
              <AccordionTrigger className="text-lg font-medium text-left text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
