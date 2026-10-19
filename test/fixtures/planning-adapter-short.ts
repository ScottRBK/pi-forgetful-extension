import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import fixture from "./planning-adapter.ts";

export default function shortTranscript(pi: ExtensionAPI): void { fixture(pi, false); }
