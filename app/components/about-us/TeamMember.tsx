import { imgPrefix } from '@/app/hooks/useImgPrefix';
import Image from 'next/image';

interface TeamMemberProps {
  image: string;
  name: string;
  title: string;
  bio?: string;
  url: string;
  logos: {
    image: string;
    alt: string;
    url: string;
    height?: string;
  }[];
}

const TeamMember = ({ image, name, title, bio, url, logos }: TeamMemberProps) => {
  return (
    <div className="col-span-1 h-[150px] w-full flex items-center justify-center">
      <div className="h-full grid gap-10 grid-cols-[150px_200px]">
        <div className="flex justify-center items-center">
          <div className="w-[125px] h-[125px] overflow-hidden rounded-full">
            <a target="_blank" href={url} rel="noopener noreferrer">
              <Image
                src={imgPrefix + image}
                alt={`${name}, ${title}`}
                className="cursor-pointer h-full w-full rounded-full hover:scale-110"
                width="0"
                height="0"
              />
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <h2 className="text-lg text-neutral-500">{title}</h2>
          <div className="py-5 flex gap-[20px] max-w-800 align-items justify-items h-[100px] w-max">
            {logos.map((logo, i) => (
              <a target="_blank" href={logo.url} rel="noopener noreferrer" key={logo.url + i}>
                <div className={`flex items-center justify-center h-full w-max`}>
                  <div className={`${logo.height || 'h-[30px]'} w-auto`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgPrefix + logo.image}
                      alt={logo.alt}
                      className={`cursor-pointer max-h-full max-w-full`}
                    />
                  </div>
                </div>
              </a>
            ))}
          </div>
          {bio && <p>{bio}</p>}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
