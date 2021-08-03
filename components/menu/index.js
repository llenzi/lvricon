import Link from 'next/link'

const Menu = () => {
  return (
    <ul className="flex flex-row justify-start">
      <li className="mx-4">
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li className="mx-4">
        <Link href="/lottie">
          <a>Lottie</a>
        </Link>
      </li>
    </ul>
  )
}

export default Menu