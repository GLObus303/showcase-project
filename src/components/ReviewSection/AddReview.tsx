import { Form, Input, Button, Slider, message } from 'antd';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import { isFuture } from 'date-fns';
import generatePicker from 'antd/lib/date-picker/generatePicker';

import { NewReviewType } from '../../model/Review';
import { useUserInfo } from '../AuthContextProvider';
import 'antd/es/date-picker/style/index';
import { addReviewForRoom } from '../../api/reviews';

type AddReviewProps = {
  roomId: string;
  totalRoomRating: number;
  numberOfReviews: number;
  closeForm: () => void;
  fetchAll: () => void;
};

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export const AddReview: React.FC<AddReviewProps> = ({
  roomId,
  totalRoomRating,
  numberOfReviews,
  closeForm,
  fetchAll,
}) => {
  const userInfo = useUserInfo();
  const [form] = Form.useForm();

  const handleSubmit = async (newData: NewReviewType) => {
    try {
      await addReviewForRoom({
        roomId,
        totalRoomRating,
        numberOfReviews,
        data: { ...newData, creationDate: new Date() },
      });
      closeForm();
      fetchAll();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Form<NewReviewType>
      name="basic"
      initialValues={{ name: userInfo?.name, rating: 3 }}
      onFinish={handleSubmit}
      className="mt-4 border-2 border-black rounded-md p-4"
      form={form}
    >
      <div className="flex flex-col md:flex-row md:justify-between">
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
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: 'Please input your date!',
              type: 'date',
            },
          ]}
        >
          <DatePicker format="DD.MM.YYYY" disabledDate={isFuture} />
        </Form.Item>
      </div>
      <Form.Item
        label="Rating"
        name="rating"
        rules={[
          {
            required: true,
            message: 'Please input your rating!',
            type: 'number',
          },
        ]}
      >
        <Slider min={1} max={5} className="w-32" />
      </Form.Item>

      <Form.Item
        label="Text"
        name="text"
        rules={[
          {
            required: true,
            message: 'Please input your review!',
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end w-full">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
