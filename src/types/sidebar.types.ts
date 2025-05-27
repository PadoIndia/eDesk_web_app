import { EventResponse } from "./event.types";

export type GroupedOutput = {
  id: number;
  label: string;
  count: number;
  children?: EventResponse[];
  createdOn?: string | Date;
};
