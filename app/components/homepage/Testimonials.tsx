import Container from '../Container';
import Heading from '../Heading';

const testimonials = [
  {
    name: 'Ethan Zheng - Cofounder @ JobRight.ai',
    quote:
      '“As a leading AI-powered job search platform, Jobright prioritizes top-tier resume parsing accuracy and low latency. AnyParser not only outperformed 10+ other parsers based on our benchmarks, but also stood out as the fastest multi-model LLM solution, all while maintaining exceptional performance.”',
  },
  {
    name: 'Jon Conradt - Principle Scientist @ AWS',
    quote:
      '“AnyParser’s advanced multimodal AI delivers where other approaches fail. Complex documents require this fusion of sight and language.“',
  },
  {
    name: 'Cass - Senior Scientist @ Amazon Machine Learning University',
    quote:
      '“I’m used to research solutions all the time to offer to my students always SOTA content from diverse AI domains. Most of my students are ML practitioners that build real solutions and I’m excited I’ve found AnyParser as a great tool that helps improve retrieval accuracy in document parsing, while preserving the delicate balance between security, costs, and operational efficiency. A great and innovative tool to implement document parsing pipeline!”',
  },
  {
    name: 'Yunfei - Senior Solution Architect @ AWS',
    quote:
      "“I am impressed by CambioML's innovation in the space of AI and LLM, including the novel methodologies of synthetic data generation, retriever model fine-tuning in RAG, and their open-source products out of those innovations.”",
  },
];

const testimonials2 = [
  {
    name: 'Yunfei - Senior Solution Architect @ AWS',
    quote:
      "“I am impressed by CambioML's innovation in the space of AI and LLM, including the novel methodologies of synthetic data generation, retriever model fine-tuning in RAG, and their open-source products out of those innovations.”",
  },
  {
    name: 'Richard (CEO @ Epsilla)',
    quote: '“We had tried all the pdf extraction tool and CambioML gave us the most accurate results.”',
  },
  {
    name: 'Jamal (CEO @ Xtra)',
    quote: "“It's far better than other tools! Our data analysts are able to triple their outputs.”",
  },
  {
    name: 'Steve Cooper (Cofounder @ AI Ticker Chat)',
    quote:
      '“I have validated the quality of AnyParser goes far beyond traditional OCR tools like Langchain / Unstructured. Looking forward to using this in our future projects.”',
  },
];

interface TestimonialCardProps {
  name: string;
  quote: string;
}

const TestimonialCard = ({ name, quote }: TestimonialCardProps) => {
  return (
    <div className="flex-shrink-0 h-fit w-[500px] mx-2 bg-white shadow-lg rounded-lg p-6 text-center rounded-xl">
      <p className="text-lg italic text-gray-700">{quote}</p>
      <p className="mt-4 font-bold text-gray-900">{name}</p>
    </div>
  );
};

const Testimonials = () => {
  return (
    <div className="h-full w-full pt-20 bg-cambio-primary">
      <Container styles="relative z-10 h-fit overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-start p-10 relative">
          <Heading title="Testimonials" center />
          <div className="relative h-fit w-full overflow-hidden border-gray-600 pt-10">
            <div className="absolute top-0 left-0 w-[50px] lg:w-[100px] h-full bg-gradient-to-r from-cambio-primary to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[50px] lg:w-[100px] h-full bg-gradient-to-l from-cambio-primary to-transparent z-20 pointer-events-none" />
            <div className="grid grid-rows-2 grid-flow-col gap-4 animate-slide hover:pause flex-col">
              <div className="flex items-end h-[350px]">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
              <div className="flex items-start ml-10  h-[350px]">
                {[...testimonials2, ...testimonials2].map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Testimonials;
