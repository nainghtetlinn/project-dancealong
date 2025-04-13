import { ModeToggle } from '@/components/modeToggleBtn'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between px-4 py-2 border-b'>
      <h5>Dance Studio</h5>
      <div>
        <ModeToggle />
      </div>
    </nav>
  )
}

export default Navbar
