import { Button, Form, Input, message } from 'antd';
import { Redirect, useHistory } from 'react-router-dom';

import { createRoom } from '../api/rooms';
import {
  useAuthContext,
  useUserGroup,
  useUserInfo,
} from '../components/AuthContextProvider';
import { NewRoomType } from '../model/Room';

export const Create = () => {
  const { isOwner } = useUserGroup();
  const authContext = useAuthContext();
  const userInfo = useUserInfo();

  const history = useHistory();

  const userId = authContext?.authState?.uid;

  if (!isOwner || !userId || !userInfo) {
    return <Redirect to="/" />;
  }

  const handleSubmit = async (newValues: NewRoomType) => {
    try {
      const newRoom = await createRoom({
        ...newValues,
        ownerId: userId,
      });

      history.push(`/room/${newRoom.id}`);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="h-full flex justify-center items-center flex-col">
      <Form<NewRoomType>
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit}
      >
        <div className="w-full flex justify-end" />

        <Form.Item
          label="Image url"
          name="imageUrl"
          rules={[
            {
              required: true,
              message: 'Please input your image url!',
            },
          ]}
        >
          <Input />
        </Form.Item>

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

        <Form.Item
          label="Subtitle"
          name="subtitle"
          rules={[
            {
              required: true,
              message: 'Please input your subtitle!',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Summary"
          name="summary"
          rules={[
            {
              required: true,
              message: 'Please input your summary!',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
