import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import useCollection from "hooks/useCollection";
import useIngredients from "hooks/useIngredients";
import { useState } from "react";
import { CreateRecipeOptions } from "services/collections";

const { Option } = Select;

const CreateRecipeModal = ({ collectionId }: { collectionId: number }) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRecipe } = useCollection(collectionId);
  const { ingredients } = useIngredients();

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (recipe: CreateRecipeOptions) => {
    setIsSubmitting(true);

    try {
      await addRecipe({
        ...recipe,
        collection_id: collectionId,
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
        type="primary"
      />
      <Modal
        title="Crear receta"
        visible={visible}
        onCancel={handleCancel}
        okButtonProps={{ htmlType: "submit", form: "create-recipe-form" }}
        okText="Crear"
        cancelText="Cancelar"
        confirmLoading={isSubmitting}
      >
        {error && <Alert type="error" message={error} className="mb-3" />}

        <Form
          name="create-recipe"
          layout="vertical"
          id="create-recipe-form"
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

          <Form.List
            name="ingredients"
            rules={[
              {
                validator: async (_, ingredients) => {
                  if (!ingredients || ingredients.length < 1) {
                    return Promise.reject(
                      new Error("Agregue al menos un ingrediente")
                    );
                  }
                },
              },
            ]}
            initialValue={[{}]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...rest }, index) => (
                  <Form.Item
                    key={key}
                    label={index === 0 ? "Ingredientes" : undefined}
                  >
                    <Row gutter={14}>
                      <Col span={20}>
                        <Input.Group compact>
                          <Form.Item
                            {...rest}
                            name={[name, "ingredient_id"]}
                            className="mb-0 w-1/2"
                            rules={[{ required: true }]}
                          >
                            <Select placeholder="Ingrediente">
                              {ingredients.map((ingredient) => (
                                <Option
                                  key={ingredient.id}
                                  value={ingredient.id}
                                >
                                  {ingredient.name} (
                                  {ingredient.measurement_unit.symbol})
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...rest}
                            name={[name, "units"]}
                            className="mb-0 w-1/2"
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              placeholder="Cantidad"
                              className="w-full"
                              decimalSeparator=","
                            />
                          </Form.Item>
                        </Input.Group>
                      </Col>

                      {index > 0 && (
                        <Col span={4}>
                          <Button
                            htmlType="button"
                            type="dashed"
                            shape="circle"
                            icon={<MinusCircleOutlined />}
                            danger
                            onClick={() => remove(name)}
                          />
                        </Col>
                      )}
                    </Row>
                  </Form.Item>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className="w-full"
                  >
                    Agregar ingrediente
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
};

export default CreateRecipeModal;
