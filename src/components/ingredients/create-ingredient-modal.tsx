import { BsPlusLg } from "react-icons/bs";
import { Button } from "../ui/button";
import { FormLabel } from "../ui/form-label";
import { Input } from "../ui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "../ui/modal";
import { Select } from "../ui/select";

export function CreateIngredientModal() {
  return (
    <>
      <Modal>
        <ModalTrigger asChild>
          <Button className="w-full sm:w-auto">
            <BsPlusLg />
            Nuevo ingrediente
          </Button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Agregar nuevo ingrediente</ModalTitle>
          <ModalBody>
            <form className="flex flex-col gap-3">
              <div>
                <FormLabel htmlFor="name">Nombre</FormLabel>
                <Input id="name" />
              </div>

              <div className="flex gap-4">
                <div>
                  <FormLabel htmlFor="price">Precio</FormLabel>
                  <Input id="price" />
                </div>

                <div>
                  <FormLabel htmlFor="packageUnits">Unidades</FormLabel>
                  <div className="flex">
                    <div className="w-3/4">
                      <Input
                        id="packageUnits"
                        borders="noRight"
                        className="h-full"
                      />
                    </div>
                    <div className="w-1/4">
                      <label htmlFor="measurementUnitId" className="sr-only">
                        Unidad de medida
                      </label>
                      <Select
                        borders="noLeft"
                        className="h-full"
                        id="measurementUnitId"
                      >
                        <option>ml</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
