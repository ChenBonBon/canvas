import axios from "axios";
import { v4 as uuid } from "uuid";
import { IDiagramCommand } from "./commands";

export const myAxios = () =>
  axios.create({
    baseURL: "/",
  });

export const gojsAxios = myAxios();

export async function commandsRequest(
  editingContextId: string,
  representationId: string,
  command: IDiagramCommand
) {
  return gojsAxios.put(`/api/smave/diagrams/commands`, {
    id: uuid(),
    editingContextId,
    representationId,
    command,
  });
}
