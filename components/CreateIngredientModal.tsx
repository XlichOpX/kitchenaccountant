import { PlusOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from "antd";
import useIngredients from "hooks/useIngredients";
import useMeasurementUnits from "hooks/useMeasurementUnits";
import { useState } from "react";
import { CreateIngredientOptions } from "services/ingredients";

const { Option } = Select;

const CreateIngredientModal = () => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { measurementUnits } = useMeasurementUnits();
  const { addIngredient } = useIngredients();

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (ingredient: CreateIngredientOptions) => {
    setIsSubmitting(true);
    try {
      await addIngredient(ingredient);
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
        title="Crear ingrediente"
        visible={visible}
        onCancel={handleCancel}
        okButtonProps={{ htmlType: "submit", form: "create-ingredient-form" }}
        okText="Crear"
        cancelText="Cancelar"
        confirmLoading={isSubmitting}
      >
        {error && <Alert type="error" message={error} className="mb-3" />}

        <Form
          name="create-ingredient"
          id="create-ingredient-form"
          layout="vertical"
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

          <Space size="large">
            <Form.Item
              name="price"
              label="Precio"
              rules={[{ min: 0, type: "number" }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item label="Unidades del paquete">
              <Input.Group compact>
                <Form.Item
                  name="package_units"
                  noStyle
                  rules={[{ min: 0, type: "number" }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                  name="measurement_unit_id"
                  noStyle
                  rules={[{ required: true, min: 0, type: "number" }]}
                >
                  <Select className="w-16">
                    {measurementUnits.map((m) => (
                      <Option key={m.id} value={m.id}>
                        {m.symbol}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default CreateIngredientModal;
