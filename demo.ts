import { OceanEngine, type SharkKind, type SharkSpec } from "./src";

// ?sharks=thresher,hammerhead,mako,nurse — first is biggest, the rest step down. No param: four randomly selected sharks.
const kinds = new URLSearchParams(location.search).get("sharks")?.split(",").filter(Boolean) as SharkKind[] | undefined;
const sharks: SharkSpec[] | undefined = kinds?.map((kind, i) => ({ kind, size: 1 - i * 0.1 }));

const engine = new OceanEngine(document.querySelector("canvas")!, sharks);
(window as typeof window & { setOceanPointer: (x: number, y: number, active: boolean) => void }).setOceanPointer =
  (x, y, active) => engine.setPointer(x, y, active);
