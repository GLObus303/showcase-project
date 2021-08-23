import { Button } from 'antd';
import { Link } from 'react-router-dom';

export const Error404 = () => (
  <div className="h-full flex justify-center items-center flex-col">
    <div className="text-7xl mb-8">404 :(</div>
    <div className="mb-8">Sorry, this page doesn't exist </div>

    <Button type="primary" shape="round" size="large">
      <Link to="/">Back to homepage</Link>
    </Button>
  </div>
);
