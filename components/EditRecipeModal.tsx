import {
  EditFilled,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
import useIngredients from "hooks/useIngredients";
import useRecipes from "hooks/useRecipes";
import { useEffect, useState } from "react";
import { Recipe, updateRecipe } from "services/recipes";
const { Option } = Select;

const EditRecipeModal = ({
  recipe,
  onUpdate,
}: {
  recipe: Recipe;
  onUpdate: typeof updateRecipe;
}) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ingredients } = useIngredients();
  const { recipes = [] } = useRecipes();
  const [deletedIngredients, setDeletedIngredients] = useState<number[]>([]);
  const [deletedSubrecipes, setDeletedSubrecipes] = useState<number[]>([]);

  useEffect(() => {
    form.setFieldsValue({
      name: recipe.name,
      description: recipe.description,
      profit_percentage: recipe.profit_percentage * 100,
      ingredients: recipe.ingredients.map(
        ({ ingredient: { id: ingredient_id }, units, id }) => ({
          id,
          ingredient_id,
          units,
        })
      ),
      subrecipes: recipe.subrecipes.map(({ id, recipe, units }) => ({
        id,
        subrecipe_id: recipe.id,
        units,
      })),
    });
  }, [recipe, form]);

  const closeModal = () => {
    setVisible(false);
    setDeletedIngredients([]);
    setDeletedSubrecipes([]);
  };

  const onFinish = async (recipeData: Recipe) => {
    setIsSubmitting(true);
    try {
      await onUpdate(
        {
          ...recipeData,
          id: recipe.id,
          profit_percentage: recipeData.profit_percentage / 100,
        },
        deletedIngredients,
        deletedSubrecipes
      );
      closeModal();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
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
        title="Editar receta"
        visible={visible}
        onCancel={closeModal}
        okButtonProps={{ htmlType: "submit", form: "edit-recipe-form" }}
        okText="Guardar cambios"
        cancelText="Cancelar"
        confirmLoading={isSubmitting}
      >
        {error && <Alert type="error" message={error} className="mb-3" />}

        <Form
          name="edit-recipe"
          layout="vertical"
          id="edit-recipe-form"
          onFinish={onFinish}
          form={form}
        >
          <Row gutter={16}>
            <Col xs={18}>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true }, { max: 80 }]}
              >
                <Input maxLength={80} showCount />
              </Form.Item>
            </Col>

            <Col xs={6}>
              <Form.Item
                name="profit_percentage"
                label="Ganancia"
                rules={[{ required: true, min: 0, type: "number" }]}
              >
                <InputNumber
                  className="w-full"
                  addonAfter="%"
                  min={0}
                  step={5}
                />
              </Form.Item>
            </Col>
          </Row>

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
                  if (!ingredients || ingredients.length < 1)
                    throw new Error("Debe agregar al menos un ingrediente");
                },
              },
            ]}
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

                      <Col span={4}>
                        <Button
                          htmlType="button"
                          type="dashed"
                          shape="circle"
                          icon={<MinusCircleOutlined />}
                          danger
                          onClick={() => {
                            const { id } = form.getFieldValue([
                              "ingredients",
                              name,
                            ]);
                            if (id) {
                              setDeletedIngredients((prev) => [...prev, id]);
                            }
                            remove(name);
                          }}
                        />
                      </Col>
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

          <Form.List name="subrecipes">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...rest }, index) => (
                  <Form.Item
                    key={key}
                    label={index === 0 ? "Recetas base" : undefined}
                  >
                    <Row gutter={14}>
                      <Col span={20}>
                        <Input.Group compact>
                          <Form.Item
                            {...rest}
                            name={[name, "subrecipe_id"]}
                            className="mb-0 w-1/2"
                            rules={[{ required: true }]}
                          >
                            <Select placeholder="Receta">
                              {recipes.map((recipe) => (
                                <Option key={recipe.id} value={recipe.id}>
                                  {recipe.name}
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

                      <Col span={4}>
                        <Button
                          htmlType="button"
                          type="dashed"
                          shape="circle"
                          icon={<MinusCircleOutlined />}
                          danger
                          onClick={() => {
                            const { id } = form.getFieldValue([
                              "subrecipes",
                              name,
                            ]);
                            if (id) {
                              setDeletedSubrecipes((prev) => [...prev, id]);
                            }
                            remove(name);
                          }}
                        />
                      </Col>
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
                    Agregar receta base
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

export default EditRecipeModal;
