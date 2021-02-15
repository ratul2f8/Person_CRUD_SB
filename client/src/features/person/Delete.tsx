import {
  PrimaryButton,
  IIconProps,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
} from "office-ui-fabric-react";
import React from "react";
import { dragOptions } from "./Create";
import { IPerson, deleteMultiple } from "./personSlice";
import { useDispatch } from "react-redux";
interface IProp {
  persons: IPerson[];
}
const removeIcon: IIconProps = { iconName: "Delete" };
const doneIcon: IIconProps = { iconName: "Accept" };
export const DeleteComponent: React.FC<IProp> = ({ persons }) => {
  const dialogContentProps = {
    type: DialogType.normal,
    title: "Remove",
    subText: `Are you sure want to remove these ${persons.length} person(s)`,
  };
  const dispatch = useDispatch();
  const handleSubmit = async() => {
    await dispatch(deleteMultiple(persons))
    setToggle(false);
  };
  
  const [toggle, setToggle] = React.useState<boolean>(false);
  return (
    <>
      <PrimaryButton iconProps={removeIcon}
      styles={{
        root:{
          backgroundColor: "#C30052",
          borderColor: "#C30052"
        }
      }} 
      onClick={() => setToggle(true)}
      >Remove</PrimaryButton>
      {toggle && (
        <Dialog
          hidden={false}
          dialogContentProps={dialogContentProps}
          modalProps={{ dragOptions }}>
          <DialogFooter>
            <PrimaryButton
              onClick={handleSubmit}
              iconProps={doneIcon}
              styles={{
                root: {
                  backgroundColor: "#C30052",
                  borderColor: "#C30052",
                },
              }}
              text="Yes,Remove"
            />
            <DefaultButton onClick={() => setToggle(false)} text="Dismiss" />
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};
