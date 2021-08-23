import { useState } from 'react';
import { Button, Form, Input, message, Popconfirm, Select } from 'antd';

import { UserInfoType } from '../../model/User';
import { deleteUser, updateUser } from '../../api/user';
import { adminUserGridClassName } from '../../pages/Admin';

const { Option } = Select;

type UserRowProps = {
  refetchAll: () => void;
} & UserInfoType;

export const UserRow: React.FC<UserRowProps> = ({
  id,
  name,
  group,
  refetchAll,
}) => {
  const [isReadOnly, setIsReadOnly] = useState(true);

  const [form] = Form.useForm();

  const handleSubmit = async (newValues: UserInfoType) => {
    try {
      await updateUser(id, newValues);
      setIsReadOnly(true);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleUserDelete = async () => {
    try {
      await deleteUser(id);
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

  const onGroupChange = (value: string) => {
    form.setFieldsValue(value);
  };

  return (
    <>
      <Form<UserInfoType>
        form={form}
        name="user"
        initialValues={{ name, group }}
        onFinish={handleSubmit}
        className={adminUserGridClassName}
      >
        <div className="break-all">{id}</div>

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

        <Form.Item name="group" rules={[{ required: true }]}>
          <Select
            onChange={onGroupChange}
            disabled={isReadOnly || group === 'superadmin'}
          >
            <Option value="basic">Basic</Option>
            <Option value="owner">Owner</Option>
            <Option value="admin">Admin</Option>
          </Select>
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

              {group !== 'superadmin' && (
                <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={handleUserDelete}
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
