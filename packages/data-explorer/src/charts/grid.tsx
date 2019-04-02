// Vendor modules
import * as React from "react";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";
import styled from "styled-components";

// Local modules
import * as Dx from "../types";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

// Styled Components
const GridWrapper = styled.div`
  width: 100%;
`;
const Form = styled.form`
  border: "1px solid gray";
  background: "white";
  border-radius: "5px";
  width: "100%";
`;

const Input = styled.input`
  width: "calc(100% - 30px)";
  border: "none";
`;

const switchMode = (currentMode: string) => {
  const nextMode: Dx.JSONObject = {
    "=": ">",
    ">": "<",
    "<": "="
  };
  return nextMode[currentMode];
};

// Types
type OnChangeProps = (input: number | string) => void;

type FilterIndexSignature = "integer" | "number" | "string";

interface NumberFilterProps {
  onChange: OnChangeProps;
  filterState: { [key: string]: string };
  filterName: string;
  updateFunction: (input: Dx.JSONObject) => void;
}

const NumberFilter = (props: NumberFilterProps) => {
  const { filterState, filterName, updateFunction, onChange } = props;
  const mode = filterState[filterName] || "=";
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };
  const handleClick = () => {
    updateFunction({ [filterName]: switchMode(mode) });
  };

  return (
    <Form>
      <Input
        type="text"
        id="name"
        name="user_name"
        onChange={handleChange}
        placeholder="number"
      />
      <button onClick={handleClick}>{mode}</button>
    </Form>
  );
};

const stringFilter = () => ({ onChange }: { onChange: OnChangeProps }) => (
  <form>
    <input
      type="text"
      id="string-filter"
      name="string-filter"
      onChange={(event: React.FormEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.value);
      }}
      placeholder="string"
    />
  </form>
);

const numberFilterWrapper = (
  filterState: NumberFilterProps["filterState"],
  filterName: NumberFilterProps["filterName"],
  updateFunction: NumberFilterProps["updateFunction"]
) => ({ onChange }: { onChange: OnChangeProps }) => (
  <NumberFilter
    onChange={onChange}
    filterState={filterState}
    filterName={filterName}
    updateFunction={updateFunction}
  />
);

const filterNumbers = (mode = "=") => (
  filter: FilterObject,
  row: NumberRowObject
) => {
  const filterValue = Number(filter.value);
  if (mode === "=") {
    return row[filter.id] === filterValue;
  } else if (mode === "<") {
    return row[filter.id] < filterValue;
  } else if (mode === ">") {
    return row[filter.id] > filterValue;
  }
  return row[filter.id];
};

const filterStrings = () => (filter: FilterObject, row: StringRowObject) => {
  return (
    row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) !== -1
  );
};

type FilterMethodType = { [index in FilterIndexSignature]: Function };

const columnFilters: FilterMethodType = {
  integer: numberFilterWrapper,
  number: numberFilterWrapper,
  string: stringFilter
};

const filterMethod: FilterMethodType = {
  integer: filterNumbers,
  number: filterNumbers,
  string: filterStrings
};

interface FilterObject {
  id: string;
  value: string;
}

interface StringRowObject {
  [key: string]: string;
}

interface NumberRowObject {
  [key: string]: number;
}

interface State {
  filters: { [key: string]: Function };
  showFilters: boolean;
}

interface Props {
  data: { data: Dx.Datapoint[]; schema: Dx.Schema };
  height: number;
}

class DataResourceTransformGrid extends React.PureComponent<Props, State> {
  static defaultProps: Partial<Props> & { metadata: object } = {
    metadata: {},
    height: 500
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {},
      showFilters: false
    };
  }

  onClick = (): void => {
    const { showFilters } = this.state;
    this.setState({ showFilters: !showFilters });
  };

  render(): JSX.Element {
    const {
      data: { data, schema },
      height
    } = this.props;
    const { filters, showFilters } = this.state;
    const { primaryKey = [] } = schema;
    const tableColumns = schema.fields.map((field: Dx.Field) => {
      if (
        field.type === "string" ||
        field.type === "number" ||
        field.type === "integer"
      ) {
        return {
          Header: field.name,
          Cell: (row: object & { value: any }) => (
            <div style={}>{row && row.value}</div>
          ),
          accessor: field.name,
          fixed: primaryKey.indexOf(field.name) !== -1 && "left",
          filterMethod: (filter: Dx.JSONObject, row: Dx.JSONObject) => {
            if (
              field.type === "string" ||
              field.type === "number" ||
              field.type === "integer"
            ) {
              return filterMethod[field.type](filters[field.name])(filter, row);
            }
          },
          // If we don't have a filter defined for this field type,
          // pass an empty div
          Filter: columnFilters[field.type](
            filters,
            field.name,
            (newFilter: { [key: string]: Function }) => {
              this.setState({ filters: { ...filters, ...newFilter } });
            }
          ),
          style: {
            // Auto fit table cell to content size
            "white-space": "pre-wrap",
            width: "auto"
          }
        };
      } else {
        return {
          Header: field.name,
          accessor: field.name,
          fixed: primaryKey.indexOf(field.name) !== -1 && "left"
        };
      }
    });
    const ReactTableStyle = { height: `${height}px` };

    return (
      <GridWrapper>
        <button
          //          icon="filter"
          onClick={this.onClick}
        >
          {showFilters ? "Hide" : "Show"} Filters
        </button>
        <ReactTableFixedColumns
          data={data}
          columns={tableColumns}
          style={ReactTableStyle}
          className="-striped -highlight"
          filterable={showFilters}
        />
      </GridWrapper>
    );
  }
}

export default DataResourceTransformGrid;
