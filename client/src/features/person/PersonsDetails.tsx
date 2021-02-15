import {
  Stack,
  getTheme,
  IStackTokens,
  mergeStyles,
  Text,
} from "office-ui-fabric-react";
import {
  buildColumns,
  DetailsList,
  IColumnReorderOptions,
  IDragDropContext,
  IDragDropEvents,
  Selection,
  IColumn,
  IObjectWithKey,
} from "office-ui-fabric-react/lib/DetailsList";
import React from "react";
import { DeleteComponent } from "./Delete";
import { BloodGroups, IPerson, selectPersons } from "./personSlice";
import { useSelector } from "react-redux";
import { UpdateComponent } from "./Update";
const theme = getTheme();
const dragEnterClass = mergeStyles({
  backgroundColor: theme.palette.neutralLight,
});
const tokens: IStackTokens = { childrenGap: "20" };
export interface IDetailsListDragDropExampleState {
  items: IPerson[];
  columns: IColumn[];
  isColumnReorderEnabled: boolean;
  frozenColumnCountFromStart: string;
  frozenColumnCountFromEnd: string;
  selected: IObjectWithKey[];
}
interface IPersonView {
  name: String;
  bloodgroup: BloodGroups;
  age: Number;
}
export const PersonsDetails: React.FC = () => {
  const items = useSelector(selectPersons);
  var _draggedIndex = -1;
  var _draggedItem: IPerson | undefined;
  const [state, setState] = React.useState<IDetailsListDragDropExampleState>({
    items: items,
    columns: buildColumns(
      items.map(
        (item): IPersonView => ({
          name: item.name,
          age: item.age,
          bloodgroup: item.bloodgroup,
        })
      ),
      true
    ),
    isColumnReorderEnabled: true,
    frozenColumnCountFromStart: "0",
    frozenColumnCountFromEnd: "0",
    selected: [],
  });
  const selection: Selection = new Selection({
    onSelectionChanged: () =>
      setState({ ...state, selected: selection.getSelection() }),
  });
  const _handleColumnReorder = (
    draggedIndex: number,
    targetIndex: number
  ) => {
    const draggedItems = state.columns[draggedIndex];
    const newColumns: IColumn[] = [...state.columns];

    // insert before the dropped item
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItems);
    setState({ ...state,columns: newColumns });
  };

  function _getColumnReorderOptions(): IColumnReorderOptions {
    return {
      frozenColumnCountFromStart: parseInt(
        state.frozenColumnCountFromStart,
        10
      ),
      frozenColumnCountFromEnd: parseInt(
        state.frozenColumnCountFromEnd,
        10
      ),
      handleColumnReorder: _handleColumnReorder,
    };
  }

  function _getDragDropEvents(): IDragDropEvents {
    return {
      canDrop: (
        dropContext?: IDragDropContext,
        dragContext?: IDragDropContext
      ) => {
        return true;
      },
      canDrag: (item?: any) => {
        return true;
      },
      onDragEnter: (item?: any, event?: DragEvent) => {
        // return string is the css classes that will be added to the entering element.
        return dragEnterClass;
      },
      onDragLeave: (item?: any, event?: DragEvent) => {
        return;
      },
      onDrop: (item?: any, event?: DragEvent) => {
        if (_draggedItem) {
          _insertBeforeItem(item);
        }
      },
      onDragStart: (
        item?: any,
        itemIndex?: number,
        selectedItems?: any[],
        event?: MouseEvent
      ) => {
        _draggedItem = item;
        _draggedIndex = itemIndex!;
      },
      onDragEnd: (item?: any, event?: DragEvent) => {
        _draggedItem = undefined;
        _draggedIndex = -1;
      },
    };
  }

   const _onItemInvoked = (item: IPerson): void => {
    alert(`Item invoked: ${item.name}`);
  };

   function _insertBeforeItem(item: IPerson): void {
    const draggedItems = selection.isIndexSelected(_draggedIndex)
      ? (selection.getSelection() as IPerson[])
      : [_draggedItem!];

    const insertIndex = state.items.indexOf(item);
    const items = state.items.filter(
      (itm) => draggedItems.indexOf(itm) === -1
    );

    items.splice(insertIndex, 0, ...draggedItems);

    setState({ ...state,items });
  }
  var _dragDropEvents = _getDragDropEvents();
  return (
    <div style={{ padding: "10px" }}>
      <Text style={{ fontWeight: "bold", fontSize: "120%" }}>Persons</Text>
      <Stack horizontal tokens={tokens}>
        {state.selected.length === 1 && (
          <UpdateComponent person={state.selected[0] as any} />
        )}
        {state.selected.length !== 0 && (
          <DeleteComponent persons={state.selected as any} />
        )}
      </Stack>
      <DetailsList
          setKey="items"
          items={items}
          columns={state.columns}
          selection={selection}
          selectionPreservedOnEmptyClick={true}
          onItemInvoked={_onItemInvoked}
          dragDropEvents={_dragDropEvents}
          columnReorderOptions={
            state.isColumnReorderEnabled
              ? _getColumnReorderOptions()
              : undefined
          }
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="Row checkbox"
        />
    </div>
  );
};
