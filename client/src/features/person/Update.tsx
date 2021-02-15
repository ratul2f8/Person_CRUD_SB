import {
  ComboBox,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IComboBox,
  IComboBoxOption,
  IIconProps,
  Position,
  PrimaryButton,
  SpinButton,
  TextField,
} from "office-ui-fabric-react";
import React from "react";
import { options, dragOptions } from "./Create";
import { IPerson, putPerson, selectIfFetching } from "./personSlice";
import { useDispatch, useSelector } from "react-redux";
interface IProp {
  person: IPerson;
}
const dialogContentProps = {
  type: DialogType.normal,
  title: "Update",
  subText: "Update info",
};
const updateIcon: IIconProps = { iconName: "EditContact" };
export const UpdateComponent: React.FC<IProp> = ({ person }) => {
  const dispatch = useDispatch();
  const doneIcon: IIconProps = { iconName: "Accept" };
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IPerson>(person);
  const updating = useSelector(selectIfFetching);
  const handleUpdate = async () => {
    await dispatch(putPerson(data));
    setToggle(false);
  };
  return (
    <>
      <PrimaryButton
        iconProps={updateIcon}
        onClick={() => setToggle(true)}
        styles={{
          root: {
            backgroundColor: "#C30052",
            borderColor: "#C30052",
          },
        }}>
        Update
      </PrimaryButton>
      {toggle && (
        <>
          <Dialog
            hidden={false}
            //onDismiss={() => disptach(toggleForm())}
            dialogContentProps={dialogContentProps}
            modalProps={{ dragOptions }}>
            <TextField
              label="Name"
              required
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                newValue?: string
              ) => setData({ ...data, name: newValue + "" })}
              value={data.name + ""}
            />
            <ComboBox
              label="Select BloodGroup"
              placeholder="Select from options"
              autoComplete="on"
              options={options}
              defaultSelectedKey={data.bloodgroup}
              onItemClick={(
                event: React.FormEvent<IComboBox>,
                option?: IComboBoxOption,
                index?: number
              ) => setData({ ...data, bloodgroup: option?.key as any })}
            />
            <SpinButton
              defaultValue={data.age + ""}
              label="Age"
              min={19}
              max={110}
              step={1}
              labelPosition={Position.top}
              onIncrement={(value: string) => {
                let val: number = Number(value.trim());
                if (val >= 110) {
                  val = 110;
                  setData({ ...data, age: val });
                  return String(val);
                }
                val = val + 1;
                setData({ ...data, age: val });
                return String(val);
              }}
              onValidate={(value: string) => {
                let val: number = Number(value.trim());
                if (val >= 110 || val <= 19) {
                  val = 19;
                  setData({ ...data, age: val });
                  return String(val);
                }
                setData({ ...data, age: val });
                return String(val);
              }}
              onDecrement={(value: string) => {
                let val: number = Number(value.trim());
                if (val <= 19) {
                  val = 19;
                  setData({ ...data, age: val });
                  return String(val);
                }
                val = val - 1;
                setData({ ...data, age: val });
                return String(val);
              }}
              incrementButtonAriaLabel={"Increase value by 1"}
              decrementButtonAriaLabel={"Decrease value by 1"}
            />
            <DialogFooter>
              <PrimaryButton
                styles={{
                  root: {
                    backgroundColor: "#C30052",
                    borderColor: "#C30052",
                  },
                }}
                onClick={handleUpdate}
                iconProps={doneIcon}
                text="Edit"
                disabled={updating}
              />
              <DefaultButton
                disabled={updating}
                onClick={() => setToggle(false)}
                text="Cancel"
              />
            </DialogFooter>
          </Dialog>
        </>
      )}
    </>
  );
};
