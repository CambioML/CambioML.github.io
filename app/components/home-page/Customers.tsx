import { imgPrefix } from '@/app/hooks/useImgPrefix';

const customers = [
  {
    image: '/images/companies/amazon-logo.png',
    alt: 'Amazon',
    url: 'https://www.amazon.com/',
  },
  {
    image: '/images/companies/aws-logo.png',
    alt: 'AWS',
    url: 'https://aws.amazon.com/',
  },
  {
    image: '/images/companies/google-logo.png',
    alt: 'Google',
    url: 'https://www.google.com/',
  },
];

const Customers = () => {
  return (
    <div className="py-5 flex gap-20 max-w-800 align-items justify-items h-[100px] w-max">
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
  );
};

export default Customers;
