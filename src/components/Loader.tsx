import { ReactComponent as Apple } from '../assets/apple.svg';
import { ReactComponent as Bread } from '../assets/bread.svg';
import { ReactComponent as Carrot } from '../assets/carrot.svg';
import { ReactComponent as Cookie } from '../assets/cookie.svg';
import { ReactComponent as Drumstick } from '../assets/drumstick.svg';
import { ReactComponent as Egg } from '../assets/egg.svg';
import { ReactComponent as Hamburger } from '../assets/hamburger.svg';
import { ReactComponent as Lemon } from '../assets/lemon.svg';
import { ReactComponent as Star } from '../assets/star.svg';

export const Loader = () => {
  const icons = [
    Apple,
    Bread,
    Carrot,
    Cookie,
    Drumstick,
    Egg,
    Hamburger,
    Lemon,
    Star,
  ];

  const Icon = icons[Math.floor(Math.random() * 8) + 0];

  return (
    <div
      className="h-full w-full flex justify-center items-center flex-col"
      data-testid="loader-component"
    >
      Loading...
      <Icon className="w-14 mt-4 animate-spin" />
    </div>
  );
};
