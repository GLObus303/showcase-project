import { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';

import { useAuthContext } from '../components/AuthContextProvider';

type LoginFormType = { name: string; email: string; password: string };

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();

  const { handleSignUp, handleSignIn } = useAuthContext();

  const handleSubmit = async ({ name, email, password }: LoginFormType) => {
    try {
      if (isLogin) {
        await handleSignIn(email, password);
      } else {
        const {
          user: { uid },
        } = await handleSignUp(name, email, password);

        const db = getFirestore();
        await setDoc(doc(db, 'users', uid), {
          name,
          group: 'basic',
        });
      }
    } catch ({ message }) {
      setErrorMessage(message);

      return;
    }

    history.push('/');
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleFormChange = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <div className="h-full flex justify-center items-center flex-col">
      <Form<LoginFormType>
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        onChange={handleFormChange}
      >
        {errorMessage && (
          <Alert
            type="error"
            className="w-full"
            message={errorMessage}
            showIcon
          />
        )}
        <div className="w-full flex justify-end">
          <Button
            onClick={handleSwitch}
            type="link"
            className="px-0 my-4"
            size="small"
          >
            <span className="text-xs">
              {isLogin
                ? "Don't have an account yet? Sign up"
                : 'Already have an account? Log in'}
            </span>
          </Button>
        </div>
        {!isLogin && (
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {isLogin ? 'Log in' : 'Sign up'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
