import { useState } from 'react';
import { Button, Form, Input, message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

import { RoomType } from '../../model/Room';
import { deleteRoom, updateRoom } from '../../api/rooms';
import { adminRestGridClassName } from '../../pages/Admin';
import { useUserGroup } from '../AuthContextProvider';

type RoomRowProps = {
  refetchAll: () => void;
} & RoomType;

export const RoomRow: React.FC<RoomRowProps> = ({
  id,
  imageUrl,
  name,
  ownerId,
  subtitle,
  summary,
  refetchAll,
}) => {
  const { isOwner, isAnyAdmin } = useUserGroup();

  const [isReadOnly, setIsReadOnly] = useState(true);

  const [form] = Form.useForm();

  const handleSubmit = async (newValues: RoomType) => {
    try {
      await updateRoom(id, newValues);
      setIsReadOnly(true);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRoomDelete = async () => {
    try {
      await deleteRoom(id);
      setIsReadOnly(true);
      refetchAll();
    } catch (error) {
      message.error(error.message);
    }
  };

  const onReset = () => {
    setIsReadOnly(true);
    form.resetFields();
  };

  return (
    <>
      <Form<RoomType>
        form={form}
        name="room"
        initialValues={{ imageUrl, name, ownerId, subtitle, summary }}
        onFinish={handleSubmit}
        className={adminRestGridClassName}
      >
        <Link to={`/room/${id}`}>
          <div className="break-all text-ant underline">{id}</div>
        </Link>

        <Form.Item
          name="imageUrl"
          rules={[
            {
              required: true,
              message: 'Url cannot be blank!',
            },
          ]}
        >
          <Input disabled={isReadOnly} />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Name cannot be blank!',
            },
          ]}
        >
          <Input disabled={isReadOnly} />
        </Form.Item>

        <Form.Item
          name="ownerId"
          rules={[
            {
              required: true,
              message: 'OwnerId cannot be blank!',
            },
          ]}
        >
          <Input disabled={isReadOnly || isOwner} />
        </Form.Item>

        <Form.Item
          name="subtitle"
          rules={[
            {
              required: true,
              message: 'Subtitle cannot be blank!',
            },
          ]}
        >
          <Input.TextArea disabled={isReadOnly} rows={1} />
        </Form.Item>

        <Form.Item
          name="summary"
          rules={[
            {
              required: true,
              message: 'Summary cannot be blank!',
            },
          ]}
        >
          <Input.TextArea disabled={isReadOnly} rows={1} />
        </Form.Item>

        <Form.Item>
          {isReadOnly ? (
            <>
              <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsReadOnly(false);
                }}
                className="mr-4"
                htmlType="button"
              >
                Edit
              </Button>

              {isAnyAdmin && (
                <Popconfirm
                  title="Are you sure to delete this room?"
                  onConfirm={handleRoomDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary">Delete</Button>
                </Popconfirm>
              )}
            </>
          ) : (
            <>
              <Button type="primary" htmlType="submit" className="mr-4">
                Save
              </Button>
              <Button type="primary" onClick={onReset}>
                Cancel
              </Button>
            </>
          )}
        </Form.Item>
      </Form>
      <div className="w-full h-px bg-black mb-8" />
    </>
  );
};
