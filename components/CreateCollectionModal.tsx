import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal } from "antd";
import { useCollections } from "hooks";
import { useState } from "react";
import { CreateCollectionOptions } from "services/collections";

const CreateCollectionModal = () => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCollection } = useCollections();

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (collection: CreateCollectionOptions) => {
    setIsSubmitting(true);

    try {
      await addCollection(collection);
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
        onClick={() => setVisible(true)}
        type="primary"
      >
        Crear
      </Button>
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
