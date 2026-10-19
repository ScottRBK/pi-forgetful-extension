import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import fixture from "./planning-adapter.ts";

export default function panelOff(pi: ExtensionAPI): void { fixture(pi, true, false); }
