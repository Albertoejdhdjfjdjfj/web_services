export interface Action {
  type: string;
  payload: string | number;
}

export interface StateComponents {
  search: string;
}

export interface CombineState {
  state_components: StateComponents;
}
