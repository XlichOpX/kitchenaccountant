import { EditFilled } from "@ant-design/icons";
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
import { useIngredient, useMeasurementUnits } from "hooks";
import { useState } from "react";
import { Ingredient } from "services/ingredients";

const { Option } = Select;

const EditIngredientModal = ({ ingredient }: { ingredient: Ingredient }) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { measurementUnits } = useMeasurementUnits();
  const { updateIngredient } = useIngredient(ingredient.id);

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (ingredientData: Partial<Ingredient>) => {
    setIsSubmitting(true);

    try {
      await updateIngredient({ ...ingredientData, id: ingredient.id });
      setVisible(false);
      setError(undefined);
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
        icon={<EditFilled />}
        onClick={() => setVisible(true)}
        type="primary"
      >
        Editar
      </Button>
      <Modal
        title="Editar ingrediente"
        visible={visible}
        onCancel={handleCancel}
        okButtonProps={{ htmlType: "submit", form: "edit-ingredient-form" }}
        okText="Guardar cambios"
        confirmLoading={isSubmitting}
      >
        {error && <Alert type="error" message={error} className="mb-3" />}

        <Form
          name="edit-ingredient"
          id="edit-ingredient-form"
          layout="vertical"
          onFinish={onFinish}
          form={form}
          initialValues={{
            ...ingredient,
            measurement_unit_id: ingredient.measurement_unit.id,
          }}
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

export default EditIngredientModal;
