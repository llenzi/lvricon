import ActiveLink from './activelink';

const Menu = () => {

  const links = [
    { name: 'Icons', path: '/icons' },
    { name: 'Lottie', path: '/lottie' }
  ]

  return (
    <nav className="flex flex-row space-x-6 font-semibold">
      {links.map((link, i) =>
        <ActiveLink key={`${link.name}-${i}`} notActiveClassName="text-gray-500" activeClassName="text-gray-800" href={link.path}>
          <a className="hover:underline">{link.name}</a>
        </ActiveLink>)}
    </nav>
  )
}

export default Menu