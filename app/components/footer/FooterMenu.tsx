interface FooterMenuProps {
  title: string;
  links: {
    title: string;
    url: string;
  }[];
}

const FooterMenu = ({ title, links }: FooterMenuProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-md">{title.toUpperCase()}</h3>
      <div className="flex flex-col gap-1">
        {links.map((link, i) => (
          <a target="_blank" href={link.url} rel="noopener noreferrer" key={link.title + i}>
            <div className="cursor-pointer hover:text-amber-400 text-md">{link.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterMenu;
