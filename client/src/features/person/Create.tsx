import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu } from 'office-ui-fabric-react/lib/ContextualMenu';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { ComboBox, IComboBox, IComboBoxOption, Position, SelectableOptionMenuItemType, TextField } from 'office-ui-fabric-react/lib/index';
import { BloodGroups, toggleForm,IPerson,postPerson,selectIfFetching } from "./personSlice";
import { useDispatch, useSelector } from "react-redux";
import { IIconProps } from "office-ui-fabric-react";
export const options: IComboBoxOption[] = [
  { key: 'Header1', text: 'Blood Groups', itemType: SelectableOptionMenuItemType.Header },
  { key: BloodGroups['A+'], text: "A+" },
  { key: BloodGroups['A-'], text: "A-" },
  { key: BloodGroups['AB+'], text: "AB+" },
  { key: BloodGroups['AB-'], text: "AB-" },
  { key: BloodGroups['B+'], text: "B+" },
  { key: BloodGroups['B-'], text: "B+" },
  { key: BloodGroups['O+'], text: "O+" },
  { key: BloodGroups['O-'], text: "O-" },
];
export const dragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
};
const dialogContentProps = {
  type: DialogType.normal,
  title: 'Add a person',
  subText: 'Provide info',
};
const doneIcon:IIconProps = {iconName: "Accept"}
export const DialogBlockingExample: React.FunctionComponent = () => {
  const[data, setData] = React.useState<IPerson>({name: "",bloodgroup: BloodGroups['AB+'],age: 19})
  const disptach = useDispatch();
  const updating = useSelector(selectIfFetching);
  const handleSubmit = async() => {
    await disptach(postPerson(data))
    disptach(toggleForm());
  }
  return (
    <>
      <Dialog
        hidden={false}
        //onDismiss={() => disptach(toggleForm())}
        dialogContentProps={dialogContentProps}
        modalProps={{dragOptions}}
      >
        <TextField label="Name" required onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => setData({...data, name: newValue+""})}
        value={data.name+""}
        />
        <ComboBox
          label="Select BloodGroup"
          placeholder="Select from options"
          autoComplete="on"
          options={options}
          defaultSelectedKey={data.bloodgroup}
          onItemClick={
            (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number) => setData({...data,bloodgroup: option?.key as any})}
        />
        <SpinButton
          defaultValue={data.age+""}
          label="Age"
          min={19}
          max={110}
          step={1}
          labelPosition = {Position.top}
          onIncrement={(value: string) => {
            let val:number = Number(value.trim());
            if(val >= 110){
              val = 110;
              setData({...data, age: val});
              return String(val);
            }
            val = val + 1;
            setData({...data, age: val})
            return String(val);
          }}
          onValidate={(value:string)=> {
            let val:number = Number(value.trim());
            if(val >= 110 || val <= 19){
              val = 19;
              setData({...data, age: val});
              return String(val);
            }
            setData({...data, age: val})
            return String(val);
          }}
          onDecrement={(value: string) => {
            let val:number = Number(value.trim());
            if(val <= 19){
              val = 19;
              setData({...data, age: val});
              return String(val);
            }
            val = val - 1;
            setData({...data, age: val});
            return String(val);
          }}
          incrementButtonAriaLabel={'Increase value by 1'}
          decrementButtonAriaLabel={'Decrease value by 1'}
        />
        <DialogFooter>
          <PrimaryButton onClick={handleSubmit}
          styles={{
            root:{
              backgroundColor: "#C30052",
              borderColor: "#C30052"
            }
          }} 
          iconProps={doneIcon}
          disabled={updating}
          text="Add" />
          <DefaultButton disabled={updating} onClick={() => disptach(toggleForm())} text="Cancel" color="red"/>
        </DialogFooter>
      </Dialog>
    </>
  );
};