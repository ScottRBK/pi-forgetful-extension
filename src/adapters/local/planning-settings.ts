import { readPlanningPanel, updateUserSettings, userSettingsPath } from "../../config.ts";
import type { PlanningPreferences } from "../../application/ports/planning.ts";

/** Reuses the existing bounded settings reader and atomic settings writer. */
export class LocalPlanningPreferences implements PlanningPreferences {
  constructor(private readonly path: string = userSettingsPath()) {}

  read(): Promise<boolean> { return readPlanningPanel(this.path); }

  write(enabled: boolean): Promise<void> {
    return updateUserSettings(this.path, { planning_panel: enabled });
  }
}
