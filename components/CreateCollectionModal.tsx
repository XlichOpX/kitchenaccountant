import { PlusOutlined } from "@ant-design/icons";
import { useUser } from "@supabase/auth-helpers-react";
import { Alert, Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import {
  Collection,
  createCollection,
  CreateCollectionOptions,
} from "services/collections";
import { useSWRConfig } from "swr";

const CreateCollectionModal = () => {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (collection: CreateCollectionOptions) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      await mutate("collections", async (collections: Collection[]) => {
        const newCollection = await createCollection({
          ...collection,
          user_id: user.id,
        });
        return [newCollection, ...collections];
      });

      setVisible(false);
      setError(undefined);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        shape="circle"
        onClick={() => setVisible(true)}
      />
      <Modal
        title="Crear colección"
        visible={visible}
        onCancel={handleCancel}
        okButtonProps={{ htmlType: "submit", form: "create-collection-form" }}
        okText="Crear"
        cancelText="Cancelar"
        confirmLoading={isSubmitting}
      >
        {error && <Alert type="error" message={error} className="mb-3" />}

        <Form
          name="create-collection"
          layout="vertical"
          id="create-collection-form"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true }, { max: 80 }]}
          >
            <Input maxLength={80} showCount />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ max: 200 }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCollectionModal;
