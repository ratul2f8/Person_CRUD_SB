import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk, RootState } from "../../app/store";
export enum BloodGroups {
  "A+" = "A+",
  "A-" = "A-",
  "B+" = "B+",
  "B-" = "B-",
  "O+" = "O+",
  "O-" = "O-",
  "AB+" = "AB+",
  "AB-" = "AB-",
}
export interface IPerson {
  name: String;
  bloodgroup: BloodGroups;
  age: Number;
  id?: Number;
}
interface IInitialState {
  persons: IPerson[];
  modalOpen: boolean;
  fetching: boolean;
  error?: string;
}
const initialState: IInitialState = {
  persons: [],
  modalOpen: false,
  fetching: false,
  error: "",
};
export const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    addPersons: (state, persons: PayloadAction<IPerson[]>) => {
      state.persons = [...persons.payload];
      state.fetching = false;
      state.error = "";
    },
    addPerson: (state, person: PayloadAction<IPerson>) => {
      state.persons.push(person.payload);
      state.fetching = false;
      state.error = "";
    },
    removePersons: (state, personIds: PayloadAction<number[]>) => {
      let filtered = state.persons.filter((p) => !personIds.payload.includes(p.id as any));
      state.persons = filtered;
      state.error = "";
      state.fetching = false;
    },
    updatePerson: (state, person: PayloadAction<IPerson>) => {
      let persons = state.persons.map((p) => {
        if (p.id === person.payload.id) {
          return person.payload;
        }
        return p;
      });
      state.persons = persons;
      state.error = "";
      state.fetching = false;
    },
    toggleForm: (state) => {
      state.modalOpen = !state.modalOpen;
    },
    fetchingStart: (state) => {
      state.fetching = true;
    },
    fetchingFailure: (state, errorMessage: PayloadAction<string>) => {
      state.fetching = false;
      state.error = errorMessage.payload;
    },
    dismissError: (state) => {
      state.error = "";
    },
    updatingStart: (state) => {
      state.fetching = true;
    },
    updatingFailed: (state,errorMessage: PayloadAction<string>) => {
      state.error = errorMessage.payload;
      state.fetching = false
    },
    deletionStart: (state) => {
      state.fetching = true;
    },
    deletionFailed: (state, errorMessage:PayloadAction<string>) => {
      state.error = errorMessage.payload;
      state.fetching = false;
    },
    creationStart: (state) => {
      state.fetching = true;
    },
    creationFailed: (state, errorMessage:PayloadAction<string>) => {
      state.error = errorMessage.payload;
      state.fetching = false;
    }
  },
});
//export actions
export const {
  toggleForm,
  dismissError,
} = personSlice.actions;
//export thunks
export const fetchPersons = (): AppThunk => (dispatch) => {
  const { fetchingStart, fetchingFailure, addPersons } = personSlice.actions;
  dispatch(fetchingStart());
  axios
    .get("http://localhost:8080/api/v1/person")
    .then((response) => {dispatch(addPersons(response.data))})
    .catch((err) => dispatch(fetchingFailure(err.message)));
};
export const putPerson = (person:IPerson):AppThunk => (dispatch) => {
  const { updatingStart, updatingFailed, updatePerson} = personSlice.actions;
  dispatch(updatingStart());
  axios.put(`http://localhost:8080/api/v1/person/${person.id}`, person)
  .then((response) => {
    dispatch(updatePerson(response.data))
    
  })
  .catch(err => {
    dispatch(updatingFailed(err.message))
  })
}
export const deleteMultiple = (objs:IPerson[]):AppThunk => (dispatch) => {
  const { deletionStart, deletionFailed,removePersons } = personSlice.actions;
  dispatch(deletionStart());
  const ids = objs.map(el => el.id);
  axios.put('http://localhost:8080/api/v1/person', ids)
  .then(() => dispatch(removePersons(ids as any)))
  .catch(err => dispatch(deletionFailed(err.message)))
}
export const postPerson = (obj:IPerson):AppThunk => (dispatch) => {
  const {creationStart, creationFailed,addPerson } = personSlice.actions;
  dispatch(creationStart());
  axios.post('http://localhost:8080/api/v1/person', obj)
  .then((response) => dispatch(addPerson(response.data)))
  .catch((err) => dispatch(creationFailed(err.message)));
}
//export selectors
export const selectPersons = (state: RootState) => state.persons.persons;
export const selectIsOpen = (state: RootState) => state.persons.modalOpen;
export const selectIfError = (state: RootState) => state.persons.error;
export const selectIfFetching = (state: RootState) => state.persons.fetching;
export default personSlice.reducer;
