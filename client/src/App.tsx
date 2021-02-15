import { IIconProps, MessageBar, MessageBarType, PrimaryButton, Spinner, SpinnerSize, Stack } from 'office-ui-fabric-react';
import React from 'react';
//import DetailsListDragDropExample from "./features/person/PersonTable";
import { toggleForm, selectIsOpen, fetchPersons,selectIfError,selectIfFetching,selectPersons, dismissError } from "./features/person/personSlice";
import { useSelector, useDispatch } from "react-redux";
import {DialogBlockingExample} from "./features/person/Create";
import { initializeIcons } from "office-ui-fabric-react";
import './App.css';
import { PersonsDetails } from './features/person/PersonsDetails';

function App() {
  const isModelOpen = useSelector(selectIsOpen);
  const fetching = useSelector(selectIfFetching);
  const error = useSelector(selectIfError);
  const persons = useSelector(selectPersons);
  const dispatch = useDispatch();
  initializeIcons();
  const addIcon:IIconProps = {iconName: "Add"}
  React.useEffect(() => {
    dispatch(fetchPersons())
  },[dispatch])
  return (
    <div className="App">
      <Stack horizontal style={{width: "100vw", paddingLeft: "10px", paddingTop: "10px", marginBottom: "10px"}}>
      <PrimaryButton 
      styles={{
        root:{
          backgroundColor: "#C30052",
          borderColor: "#C30052"
        }
      }} 
      iconProps={addIcon}
      onClick={() => dispatch(toggleForm())}>Add Person</PrimaryButton> 
      </Stack>
      {
        isModelOpen &&
        <DialogBlockingExample/>
      }
      {
          fetching
          ?
          <Spinner size={SpinnerSize.large} label="Loading persons" labelPosition="top"/>
          :
          (
              <>
              {
                  error
                  ?
                  <div style={{display: "block", width: "20vw", minWidth: "250px"}}>
                      <MessageBar messageBarType={MessageBarType.error}
                  onDismiss={() => dispatch(dismissError())}
                  dismissButtonAriaLabel="Close"
                  >
                    {
                        error
                    }
                  </MessageBar>
                  </div>
                  :
                  <>
                  {
                      persons.length === 0
                      ?
                      "You haven't added any persons yet!"
                      :
                      <PersonsDetails/>
                  }
                  </>
              }
              </>
          )
      }
    </div>
  );
}

export default App;