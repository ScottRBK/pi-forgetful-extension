import type {
  ExtensionAPI,
  ExtensionFactory,
} from "@earendil-works/pi-coding-agent";
import { createForgetfulExtension } from "./src/extension.ts";

export {
  createForgetfulExtension,
  type CaptureServicePort,
  type ExtensionWorkContext,
  type ForgetfulExtensionDependencies,
  type ForgetfulExtensionOptions,
  type RecallServicePort,
} from "./src/extension.ts";

/** Pi loads the default export as the extension factory itself. */
const defaultExtension: ExtensionFactory = (pi: ExtensionAPI) =>
  createForgetfulExtension()(pi);
export default defaultExtension;
