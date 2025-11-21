import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Container from '../Container';
import Heading from '../Heading';
const customers = [
  {
    image: '/images/companies/amazon-logo.png',
    alt: 'Amazon',
    url: '/blog/kdd-workshop-2024',
  },
  {
    image: '/images/companies/aws-logo.png',
    alt: 'AWS',
    url: '/blog/kdd-workshop-2024',
  },
  {
    image: '/images/companies/jobrightai-logo.png',
    alt: 'Jobright.ai',
    url: '/blog/jobright-resumes',
  },
  {
    image: '/images/companies/epsilla-logo.png',
    alt: 'Epsilla',
    url: '/blog/epsilla-whitepaper',
  },
  {
    image: '/images/companies/google-logo.png',
    alt: 'Google',
    url: 'https://www.google.com/',
  },
];

const Customers = () => {
  return (
    <div className="h-full w-full py-20">
      <Container styles="h-[200px]">
        <div className="w-full h-full flex flex-col items-center justify-start px-10">
          <Heading title="Leading Companies Build with AnyParser" center customClass="text-5xl lg:text-6xl" />
          <div className="py-5 flex gap-20 max-w-800 align-items justify-items h-[100px] w-full lg:w-max overflow-auto">
            {customers.map((customer, i) => (
              <a target="_blank" href={customer.url} rel="noopener noreferrer" key={customer.url + i}>
                <div className={`flex items-center justify-center h-full w-max`}>
                  <div className="h-[45px] w-auto">
                    <img
                      src={imgPrefix + customer.image}
                      alt={customer.alt}
                      className={`cursor-pointer max-h-full max-w-full`}
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Customers;
