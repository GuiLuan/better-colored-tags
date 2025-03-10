import { TagColorMappingData } from "ui/components/TagColorMapping";
import metadataStyleChanger from "./metadataStyleChanger";

export default function styleChanger(
  dom: Document | HTMLElement,
  conditions: TagColorMappingData[]
): void {
  metadataStyleChanger(dom, conditions);
}
