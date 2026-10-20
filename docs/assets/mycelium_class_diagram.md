# Mermaid class diagrams

Declared types and signatures; unknown types are `unknown`. Receivers are omitted.
Fields are associations, not lifetime ownership. Calls are static heuristic estimates.
Members and connections within each view are uncapped.
Parallel arrows are summarized.
Cross-diagram relationships are retained in the complete relationship list.

Included: 275 boxes. Calls without in-scope endpoints: 0.

## Test filtering

Mode: exclude.
Saved detector version: 2.
Test paths: `scripts/forgetful-test-server.py`, `test`.
Keep paths: none.
Calls removed by test filtering: 796. Type relationships removed: 194.

- `scripts/forgetful-test-server.py`: 4 source occurrences (test-path).
- `test/async-recall-pi-integration.test.ts`: 16 source occurrences (test-path).
- `test/background-startup-pi.test.ts`: 3 source occurrences (test-path).
- `test/background-ui-pi.test.ts`: 13 source occurrences (test-path).
- `test/capture-backlog-history-pi.test.ts`: 13 source occurrences (test-path).
- `test/capture-batches.test.ts`: 8 source occurrences (test-path).
- `test/capture-cancellation.test.ts`: 8 source occurrences (test-path).
- `test/capture-cleanup-pi.test.ts`: 6 source occurrences (test-path).
- `test/capture-context-pi.test.ts`: 2 source occurrences (test-path).
- `test/capture-context.test.ts`: 2 source occurrences (test-path).
- `test/capture-drain-pi.test.ts`: 7 source occurrences (test-path).
- `test/capture-error-diagnostic.test.ts`: 2 source occurrences (test-path).
- `test/capture-execution.test.ts`: 4 source occurrences (test-path).
- `test/capture-gate-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-history-model.test.ts`: 4 source occurrences (test-path).
- `test/capture-history-restart-pi.test.ts`: 7 source occurrences (test-path).
- `test/capture-history.test.ts`: 4 source occurrences (test-path).
- `test/capture-immediate-feedback.test.ts`: 6 source occurrences (test-path).
- `test/capture-integration-validation.test.ts`: 3 source occurrences (test-path).
- `test/capture-link-error-feedback.test.ts`: 7 source occurrences (test-path).
- `test/capture-link-presence.test.ts`: 2 source occurrences (test-path).
- `test/capture-links.test.ts`: 4 source occurrences (test-path).
- `test/capture-maintenance-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-maintenance.test.ts`: 5 source occurrences (test-path).
- `test/capture-overlap-context.test.ts`: 3 source occurrences (test-path).
- `test/capture-pause.test.ts`: 2 source occurrences (test-path).
- `test/capture-project-warning-pi.test.ts`: 2 source occurrences (test-path).
- `test/capture-resolution-context.test.ts`: 2 source occurrences (test-path).
- `test/capture-resolution-execution.test.ts`: 3 source occurrences (test-path).
- `test/capture-review-recovery.test.ts`: 12 source occurrences (test-path).
- `test/capture-shutdown-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-source-conflict-pi.test.ts`: 5 source occurrences (test-path).
- `test/capture-source-feedback.test.ts`: 2 source occurrences (test-path).
- `test/capture-structured-arguments.test.ts`: 18 source occurrences (test-path).
- `test/capture-trust-pi.test.ts`: 3 source occurrences (test-path).
- `test/capture-validation-changes.test.ts`: 26 source occurrences (test-path).
- `test/capture.test.ts`: 43 source occurrences (test-path).
- `test/config.test.ts`: 2 source occurrences (test-path).
- `test/conflict-handoff-pi.test.ts`: 5 source occurrences (test-path).
- `test/extension-surface-pi.test.ts`: 2 source occurrences (test-path).
- `test/extension.test.ts`: 58 source occurrences (test-path).
- `test/fixtures/background-ui-provider.ts`: 2 source occurrences (test-path).
- `test/fixtures/live-context-provider.ts`: 9 source occurrences (test-path).
- `test/fixtures/memory-quality.ts`: 13 source occurrences (test-path).
- `test/fixtures/planning-adapter-off.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-adapter-short.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-adapter.ts`: 4 source occurrences (test-path).
- `test/fixtures/planning-mount-probe.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-ui-driver.ts`: 2 source occurrences (test-path).
- `test/fixtures/planning-view.ts`: 3 source occurrences (test-path).
- `test/foreground-drain-pi.test.ts`: 2 source occurrences (test-path).
- `test/forgetful-integration.test.ts`: 3 source occurrences (test-path).
- `test/full-conversation-pi.test.ts`: 2 source occurrences (test-path).
- `test/http-validation.test.ts`: 2 source occurrences (test-path).
- `test/knowledge-capture.test.ts`: 21 source occurrences (test-path).
- `test/knowledge-execution.test.ts`: 4 source occurrences (test-path).
- `test/knowledge-exploration-errors.test.ts`: 6 source occurrences (test-path).
- `test/knowledge-tool-execution.test.ts`: 4 source occurrences (test-path).
- `test/knowledge-tools.test.ts`: 12 source occurrences (test-path).
- `test/live-capture-maintenance.test.ts`: 2 source occurrences (test-path).
- `test/live-capture-submission.test.ts`: 18 source occurrences (test-path).
- `test/live-connected-memory-quality.test.ts`: 2 source occurrences (test-path).
- `test/live-context-quality.test.ts`: 16 source occurrences (test-path).
- `test/live-memory-quality.test.ts`: 9 source occurrences (test-path).
- `test/live-recall-submission.test.ts`: 17 source occurrences (test-path).
- `test/logging.test.ts`: 3 source occurrences (test-path).
- `test/model-budget.test.ts`: 5 source occurrences (test-path).
- `test/model-context.test.ts`: 21 source occurrences (test-path).
- `test/model-read-tools.test.ts`: 8 source occurrences (test-path).
- `test/model.test.ts`: 8 source occurrences (test-path).
- `test/pi-integration.test.ts`: 8 source occurrences (test-path).
- `test/pi-tool-session.ts`: 6 source occurrences (test-path).
- `test/planning-api.test.ts`: 3 source occurrences (test-path).
- `test/planning-integration.test.ts`: 3 source occurrences (test-path).
- `test/planning-pi.test.ts`: 3 source occurrences (test-path).
- `test/planning-settings.test.ts`: 2 source occurrences (test-path).
- `test/planning-terminal.test.ts`: 4 source occurrences (test-path).
- `test/planning-view.test.ts`: 3 source occurrences (test-path).
- `test/planning.test.ts`: 11 source occurrences (test-path).
- `test/provider-context.ts`: 4 source occurrences (test-path).
- `test/queue-history-refresh.test.ts`: 4 source occurrences (test-path).
- `test/queue-summary-paths.test.ts`: 9 source occurrences (test-path).
- `test/queue.test.ts`: 5 source occurrences (test-path).
- `test/real-forgetful.ts`: 2 source occurrences (test-path).
- `test/recall-concurrency-pi.test.ts`: 4 source occurrences (test-path).
- `test/recall-concurrency.test.ts`: 6 source occurrences (test-path).
- `test/recall-enrichment-errors.test.ts`: 4 source occurrences (test-path).
- `test/recall-persistence-native-pi.test.ts`: 21 source occurrences (test-path).
- `test/recall-persistence-pi.test.ts`: 21 source occurrences (test-path).
- `test/recall-plan.test.ts`: 3 source occurrences (test-path).
- `test/recall.test.ts`: 35 source occurrences (test-path).
- `test/repository-validation.test.ts`: 2 source occurrences (test-path).
- `test/server-owned-validation.test.ts`: 2 source occurrences (test-path).
- `test/setup-pi.test.ts`: 2 source occurrences (test-path).
- `test/snapshot.test.ts`: 3 source occurrences (test-path).
- `test/source-inspection.test.ts`: 3 source occurrences (test-path).
- `test/validation-links.test.ts`: 18 source occurrences (test-path).
- `test/validation-recall.test.ts`: 11 source occurrences (test-path).
- `test/validation-resource-identity.test.ts`: 2 source occurrences (test-path).
- `test/validation-writer.test.ts`: 4 source occurrences (test-path).

## Diagram 1

```mermaid
classDiagram
    direction TB
    class c0000["index.ts"] {
        <<module>>
        defaultExtension(pi: ExtensionAPI) unknown
    }
    class c0003["ActivityLoader"] {
        <<class>>
        -started: unknown
        -elapsedTimer: ReturnType~typeof setInterval~
        constructor(tui: TUI, spinnerColor: Type1, messageColor: Type1, label: string) unknown
        -label: string
        setLabel(label: string) void
        -refresh() void
        dispose() void
    }
    class c0004["ForgetfulActivity"] {
        <<class>>
        -stages: unknown
        -loader: ActivityLoader
        -closed: unknown
        -idleNotice: string
        constructor(ctx: ExtensionContext) unknown
        -ctx: ExtensionContext
        set(key: string, label: string) void
        notice(message: string) void
        -refresh() void
        close() void
    }
    class c0005["ApiPlanningReader"] {
        <<class>>
        -transport: ForgetfulHttpTransport
        constructor(options: Type2) unknown
        -options: Type2
        sanitize(text: string) string
        -clean(value: T) T
        -read(action: Type3, missing: Type4) Promise~PlanningResult~T~~
        capabilities(signal: AbortSignal) Type5
        projects(signal: AbortSignal) Type6
        plans(projectId: number, signal: AbortSignal) Type7
        tasks(planId: number, signal: AbortSignal) Type8
        plan(Signature1)
        task(Signature2)
    }
    class c0006["src/adapters/forgetful/planning.ts"] {
        <<module>>
        object(value: unknown, field: string) Type9
        invalid(field: string, expected: string) never
        integer(value: unknown, field: string, min: unknown) number
        string(value: unknown, field: string) string
        nullableString(value: unknown, field: string) Type10
        boolean(value: unknown, field: string) boolean
        choice(value: unknown, field: string, values: readonly T[]) T
        parent(value: unknown, field: string, expected: number) number
        list(payload: unknown, key: string, parse: Type11) T[]
        taskRecord(data: Type9, planId: number) PlanningTaskRecord
    }
    class c0007["LocalPlanningPreferences"] {
        <<class>>
        constructor(path: string) unknown
        -path: string
        read() Promise~boolean~
        write(enabled: boolean) Promise~void~
    }
    class c0008["PiPlanningView"] {
        <<class>>
        -ctx: ExtensionContext
        -tui: TUI
        -panel: OverlayHandle
        -panelComponent: Component
        -unsubscribe: Type12
        -promptActive: unknown
        -browserOpen: unknown
        -browser: Promise~void~
        -finishBrowser: Type12
        -disposed: unknown
        -visibility: boolean
        -host: Component
        -measuring: unknown
        constructor(controller: PlanningWorkflow) unknown
        -controller: PlanningWorkflow
        mount(ctx: ExtensionContext) void
        -mountHost() void
        -releaseHost() void
        -run(work: Promise~void~) void
        -hasPanelSpace() boolean
        -syncVisibility() void
        -syncPanel() void
        -sync() void
        setPromptActive(active: boolean) void
        command(action: string) Promise~void~
        toggle() Promise~void~
        open() Promise~void~
        -close() void
        status() string
        dispose() void
    }
    class c0009["PlanBrowser"] {
        <<class>>
        -picker: unknown
        -projectId: number
        -planText: unknown
        -scroll: unknown
        -maxScroll: unknown
        -pageSize: unknown
        -identity: unknown
        constructor(Signature3)
        -theme: Theme
        -tui: TUI
        -close: Type12
        -controller: PlanningWorkflow
        -run: Type13
        invalidate() void
        handleInput(data: string) void
        -pickerInput(data: string, state: PlanningState) void
        -scrollInput(data: string) void
        -listInput(data: string, state: PlanningState) void
        -taskText(state: PlanningState, width: number) string[]
        -planLines(state: PlanningState, width: number) string[]
        render(width: number) string[]
    }
    class c0010["src/adapters/pi/planning.ts"] {
        <<module>>
        text(value: Type14) string
        box(lines: string[], width: number, theme: Theme) string[]
        timestamp(value: number) string
        availability(state: PlanningState) string
        taskLabel(task: PlanningTaskSummary) string
        counts(state: PlanningState, id: number) string
        renderPlanningPanel(state: PlanningState, width: number, theme: Theme) string[]
    }
    class c0011["PlanningController"] {
        <<class>>
        -current: PlanningState
        -listeners: unknown
        -pending: AbortController
        -active: Type15
        -generation: unknown
        -disposed: unknown
        -capabilityChecked: unknown
        -retryBlocked: unknown
        -failures: unknown
        -browserProjectId: number
        -cancelTimer: Type12
        -preferenceWrite: Promise~void~
        constructor(options: PlanningControllerOptions) unknown
        -options: PlanningControllerOptions
        state() PlanningState
        subscribe(listener: Type16) Type12
        -publish(update: Partial~PlanningState~) void
        -visible() boolean
        -invalidate() void
        openDetails() Promise~void~
        closeDetails() Promise~void~
        setPanel(enabled: boolean) Promise~void~
        togglePanel() Promise~void~
        -changePanel(value: Type17) Promise~void~
        setPanelVisible(visible: boolean) Promise~void~
        setConnection(input: Type18) Promise~void~
        selectProject(id: number) Promise~void~
        selectPlan(id: number) Promise~void~
        selectTask(id: number) Promise~void~
        inspectTask() Promise~void~
        closeTask() Promise~void~
        -accept(result: PlanningResult~T~, signal: AbortSignal) T
        refresh() Promise~void~
        -startRefresh(recheck: boolean) Promise~void~
        -readOverview(recheck: boolean, generation: number) Promise~void~
        dispose() void
    }
    class c0012["PlanningControllerOptions"] {
        <<interface>>
        reader: PlanningReader
        preferences: PlanningPreferences
        clock: PlanningClock
        repoName: string
        enabled: boolean
        ready: boolean
        initialPreference: boolean
    }
    class c0013["PlanningClock"] {
        <<interface>>
        +now() number
        +schedule(callback: Type12, delayMs: number) Type12
    }
    class c0014["PlanningError"] {
        <<interface>>
        kind: Type19
        message: string
        status: number
        responseBody: string
    }
    class c0015["PlanningPlanTasks"] {
        <<interface>>
        tasks: PlanningTaskSummary[]
        activeTasks: PlanningTaskSummary[]
        counts: PlanningCounts
        error: PlanningError
        lastRefresh: number
    }
    class c0016["PlanningPreferences"] {
        <<interface>>
        +read() Promise~boolean~
        +write(enabled: boolean) Promise~void~
    }
    class c0017["PlanningReader"] {
        <<interface>>
        +capabilities(signal: AbortSignal) Type5
        +projects(signal: AbortSignal) Type6
        +plans(projectId: number, signal: AbortSignal) Type7
        +plan(Signature4)
        +task(Signature5)
        +tasks(planId: number, signal: AbortSignal) Type8
    }
    class c0018["PlanningResult"] {
        <<type_alias>>
        alias: Type20
        error: PlanningError
        ok: true
        ok: false
        value: T
    }
    class c0019["PlanningState"] {
        <<interface>>
        panelEnabled: boolean
        panelVisible: boolean
        detailsOpen: boolean
        inspectingTask: boolean
        enabled: boolean
        ready: boolean
        capability: PlanningCapability
        availability: Type21
        loading: boolean
        error: PlanningError
        projects: PlanningProject[]
        selectedProjectId: number
        mappedProjectId: number
        selectedPlanId: number
        selectedTaskId: number
        plans: PlanningPlanSummary[]
        planTasks: Type22
        planDetail: PlanningPlan
        taskDetail: PlanningTask
        detailError: PlanningError
        lastRefresh: number
        stale: boolean
    }
    class c0020["PlanningWorkflow"] {
        <<interface>>
        state: PlanningState
        +subscribe(listener: Type16) Type12
        +openDetails() Promise~void~
        +closeDetails() Promise~void~
        +setPanel(enabled: boolean) Promise~void~
        +togglePanel() Promise~void~
        +setPanelVisible(visible: boolean) Promise~void~
        +selectProject(id: number) Promise~void~
        +selectPlan(id: number) Promise~void~
        +selectTask(id: number) Promise~void~
        +inspectTask() Promise~void~
        +closeTask() Promise~void~
        +refresh() Promise~void~
        +setConnection(input: Type18) Promise~void~
        +dispose() void
    }
    class c0021["PlanningRuntime"] {
        <<type_alias>>
        alias: ReturnType~typeof createPlanningRuntime~
    }
    class c0022["src/bootstrap/planning.ts"] {
        <<module>>
        createPlanningRuntime(Signature6)
    }
    class c0023["CaptureCorrectionCycle"] {
        <<interface>>
        cycle: number
        attempts: number
        phase: Type24
        failureKind: Type25
        failure: unknown
    }
    class c0024["CaptureSelectionError"] {
        <<class>>
    }
    class c0025["src/capture-feedback.ts"] {
        <<module>>
        correctableCaptureError(error: unknown) boolean
        initialCorrectionCycle() CaptureCorrectionCycle
        captureFailureReport(failure: unknown) Type26
    }
    class c0026["CaptureLinkReview"] {
        <<interface>>
        status: Type27
        memory: Memory
        memories: Memory[]
        automaticIds: number[]
        unreviewed: Type28
        decisions: LinkDecision[]
        verifiedIds: number[]
        reason: string
        previous: PreviousConnections
        resources: Type29
        preservation: PreservationDecision
        preservationVerified: boolean
        executionResults: ConnectionResult[]
        previousResults: ConnectionResult[]
        failures: Type30
    }
    class c0027["ConnectionResult"] {
        <<interface>>
        operation: Type31
        targetId: number
        status: Type32
        error: string
        httpStatus: number
    }
    class c0028["LinkDecision"] {
        <<interface>>
        memoryId: number
        action: Type33
        reason: string
    }
    class c0029["PreservationDecision"] {
        <<interface>>
        status: Type34
        documentIds: number[]
        codeArtifactIds: number[]
        entityIds: number[]
        reason: string
    }
    class c0030["PreviousConnections"] {
        <<interface>>
        memory: Memory
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        entities: Entity[]
        entityIds: number[]
        complete: boolean
    }
    class c0031["src/capture-links.ts"] {
        <<module>>
        wantsEdge(decision: LinkDecision) boolean
        exclusiveMemory(memory: Memory, destination: number) boolean
        readSelectedMemory(client: ForgetfulClient, id: number, unreviewed: Type36) Type35
        prepareLinkReview(Signature7)
        validateLinkDecisions(Signature8)
        validateLinkReviews(value: unknown, inputs: Type40) Type39
        operationError(error: unknown) string
        authorizedMemory(Signature9)
        executeConnection(Signature10)
        applyLinkReview(Signature11)
        finishLinkExecution(initial: CaptureLinkReview, save: Type43) Promise~CaptureLinkReview~
        readAttachmentRecords(Signature12)
        preparePreviousConnections(Signature13)
        preserveConnections(Signature14)
    }
    class c0032["MergeAccess"] {
        <<interface>>
        destination: number
        scope: Scope
        beforeRead: Type44
    }
    class c0033["MergeConnections"] {
        <<interface>>
        memoryIds: number[]
        entityIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        receipts: Type46
    }
    class c0034["MergeExecution"] {
        <<interface>>
        save: Type44
        assertCanWrite: Type12
    }
    class c0035["MergeWriteUncertain"] {
        <<class>>
    }
    class c0036["src/capture-merge.ts"] {
        <<module>>
        union(...lists: Type47) number[]
        collectMergeConnections(Signature15)
        requireResourceScope(Signature16)
        checkMergeEntity(client: ForgetfulClient, id: number, access: MergeAccess) Promise~void~
        checkMergeAttachments(Signature17)
        preflightMergeConnections(Signature18)
        preserveMergeConnections(Signature19)
    }
    class c0037["CandidateExtraction"] {
        <<interface>>
        candidates: CaptureCandidate[]
        skipped: Type50
    }
    class c0038["CandidateValidation"] {
        <<type_alias>>
        alias: Type51
        valid: true
        value: T
        reason: string
        valid: false
    }
    class c0039["CaptureAction"] {
        <<type_alias>>
        alias: Type52
    }
    class c0040["CaptureActivityPhase"] {
        <<type_alias>>
        alias: Type53
    }
    class c0041["CaptureAdvanceInput"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
    }
    class c0042["CaptureBatchInput"] {
        <<interface>>
        candidate: CaptureCandidate
        destinationProjectId: number
        overlaps: Memory[]
        neighborhood: CaptureNeighborhood
    }
    class c0043["CaptureBranch"] {
        <<interface>>
        sessionId: string
        branchId: string
    }
    class c0044["CaptureCandidate"] {
        <<interface>>
        kind: Type54
        searchDescription: string
        id: string
        title: string
        content: string
        context: string
        keywords: string[]
        tags: string[]
        importance: number
        sourceEntryIds: string[]
        evidenceType: Type55
        destinationProjectId: number
        destinationProjectName: string
        destinationRationale: string
        sourceFiles: string[]
        sourceRepo: string
        sourceUrl: string
        encodingVersion: string
        entities: CaptureEntityResource[]
        documents: CaptureDocumentResource[]
        codeArtifacts: CaptureCodeArtifactResource[]
        relationships: CaptureRelationshipResource[]
    }
    class c0045["CaptureCheckpointOptions"] {
        <<interface>>
        sessionId: string
        branchId: string
        excludeBranches: CaptureBranch[]
    }
    class c0046["CaptureCheckpointResult"] {
        <<interface>>
        processed: number
        processedJobIds: string[]
        discardedJobs: Type56
        paused: boolean
        errors: string[]
        deferredBranches: CaptureBranch[]
        continuation: Type57
    }
    class c0047["CaptureCodeArtifactResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0048["CaptureDecision"] {
        <<interface>>
        action: CaptureAction
        reason: string
        conflictingMemoryId: number
        conflictingMemoryIds: number[]
        memoryId: number
        oldClaim: string
        newClaim: string
        sourceEntryIds: string[]
        partial: boolean
        equivalentCandidateId: string
        relationshipKeys: string[]
        reuse: CaptureResourceReuse
        enrich: boolean
        entityMemoryKeys: string[]
    }
    class c0049["CaptureDiagnosticCandidate"] {
        <<interface>>
        id: string
        sourceEntryIds: string[]
        title: string
        content: string
        stage: string
        action: CaptureAction
        destinationProjectId: number
        reason: string
        memoryId: number
        replacementId: number
        retiredCount: number
        conflictId: string
        linkReview: Type58
    }
    class c0050["CaptureDiagnosticConflict"] {
        <<interface>>
        id: string
        status: Type59
        candidateId: string
        destinationProjectId: number
        sourceEntryIds: string[]
        oldMemoryIds: number[]
        reason: string
        replacementId: number
    }
    class c0051["CaptureDiagnosticJob"] {
        <<interface>>
        id: string
        status: QueueJobStatus
        attempts: number
        callCount: number
        sessionId: string
        branchId: string
        candidates: CaptureDiagnosticCandidate[]
        submissionRejections: string[]
        lastError: string
    }
    class c0052["CaptureDiagnostics"] {
        <<interface>>
        jobs: CaptureDiagnosticJob[]
        conflicts: CaptureDiagnosticConflict[]
    }
    class c0053["CaptureDocumentResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0054["CaptureEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
    }
    class c0055["CaptureEntityResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0056["CaptureMergePlan"] {
        <<interface>>
        candidate: CaptureCandidate
        memories: Memory[]
        connections: MergeConnections
    }
    class c0057["CaptureNeighborhood"] {
        <<interface>>
        entities: Entity[]
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        relationships: EntityRelationship[]
        truncated: boolean
    }
    class c0058["CaptureOperation"] {
        <<interface>>
        jobId: string
        conflictId: string
        uncertainWrite: CaptureUncertainWrite
        supersession: SupersessionReceipt
        modelFailure: Type60
    }
    class c0059["CapturePause"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0060["CapturePendingConflict"] {
        <<interface>>
        verifiedOrigin: Type61
    }
    class c0061["CaptureProgress"] {
        <<class>>
    }
    class c0062["CaptureRelationshipResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0063["CaptureResolveResult"] {
        <<interface>>
        status: Type62
        conflict: PendingConflict
    }
    class c0064["CaptureResourceReuse"] {
        <<interface>>
        entities: Type63
        documents: Type63
        codeArtifacts: Type63
        relationships: Type63
    }
    class c0065["CaptureService"] {
        <<class>>
        -queue: DurableQueueStore
        -client: ForgetfulClient
        -readSavedMemory: Type64
        -model: MemoryModelClient
        -identity: QueueIdentity
        -sessionId: string
        -branchId: string
        -policy: string
        -isEnabled: Type65
        -getMode: Type66
        -canWriteNow: Type17
        -canReadNow: Type17
        -maxModelCalls: number
        -maxJobsPerCheckpoint: number
        -now: Type67
        -knowledgeWriter: KnowledgeWriter
        -logger: DiagnosticLogger
        -stopped: unknown
        -cancellation: unknown
        -interruptedModelJobs: unknown
        -operations: unknown
        -onActivity: Type68
        -activities: unknown
        -activityPhase: CaptureActivityPhase
        constructor(options: CaptureServiceOptions) unknown
        -readSignal(signal: AbortSignal) AbortSignal
        -activity(phase: CaptureActivityPhase, operation: Type3) Promise~T~
        -publishActivity() void
        -read(operation: Type69, signal: AbortSignal, phase: Type70) Promise~T~
        -mutate(operation: Type69, signal: AbortSignal) Promise~T~
        -cancellableClient(client: ForgetfulClient) ForgetfulClient
        -cancellableKnowledge(client: KnowledgeClient) KnowledgeClient
        -correlation(job: QueueJob, candidateId: string) unknown
        -emit(level: Type71, event: string, data: Type9) void
        -enabled(mode: CaptureMode) Promise~boolean~
        -ensureModelCallAllowed(job: QueueJob) Promise~void~
        -assertWriteAllowedNow() void
        -ensureWriteAllowed(jobMode: CaptureMode) Promise~void~
        -policyFor(snapshot: CaptureSnapshot, purpose: Type72) string
        enqueue(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -enqueueSnapshot(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -resolveDestination(candidate: CaptureCandidate, context: WorkContext) Type73
        -addConflict(Signature20)
        -checkpointOutcome(Signature21)
        -destinationProjects(Signature22)
        -validateDecision(Signature23)
        -createMemory(Signature24)
        -writeKnowledge(Signature25)
        -supersessionAlreadyApplied(Signature26)
        -applySupersession(Signature27)
        -recordSupersession(receipt: SupersessionReceipt) Promise~void~
        -finishSupersession(Signature28)
        -processReplacementCheckpoint(Signature29)
        -processKnowledgeCheckpoint(Signature30)
        -prepareDestination(job: QueueJob, candidate: CaptureCandidate) Type77
        -loadOverlaps(Signature31)
        -neighborhoodEntity(job: QueueJob, id: number, destination: number) Type80
        -neighborhoodMatches(job: QueueJob, input: unknown) Promise~Entity[]~
        -neighborhoodEntities(Signature32)
        -neighborhoodRelationships(job: QueueJob, entities: Entity[]) Type82
        -existingNeighborhood(Signature33)
        -prepareOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Type83
        -decideOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -decideOverlap(Signature34)
        -recordEscalation(Signature35)
        -supersedeCandidate(Signature36)
        -readMaintenanceTargets(Signature37)
        -confirmedRetirement(id: number) boolean
        -preflightRetirement(Signature38)
        -composeMerge(Signature39)
        -verifyRequestedMerge(Signature40)
        -finishMerge(Signature41)
        -mergeCandidate(Signature42)
        -retireCandidate(Signature43)
        -equivalentMemory(Signature44)
        -skipCandidate(Signature45)
        -applyDecision(Signature46)
        -processCandidate(Signature47)
        -evidenceReadTool(job: QueueJob) ModelReadTool
        -sourceInspectionTool(job: QueueJob) ModelReadTool
        -loadCandidates(job: QueueJob) Type86
        -reviewExecutionFailure(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -correctedCaptureOutcome(outcome: Type9, corrected: Type87, rejectedMerge: Type88) Type9
        -isModelFailure(error: unknown) boolean
        -saveCorrectableFailure(Signature48)
        -recordCandidateFailure(Signature49)
        -candidateUncertainty(outcome: Type79, error: unknown) Type90
        -connectionUncertainty(outcome: Type79) Type90
        -pauseCandidate(Signature50)
        -correctCandidateFailures(Signature51)
        -processCandidates(Signature52)
        -processOrderedCandidates(Signature53)
        -refreshLinkReview(Signature54)
        -migrateLegacyLinkReview(Signature55)
        -prepareLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type93
        -planLinkReviews(Signature56)
        -executeLinkReview(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -recordLinkReviewFailure(current: QueueJob, failure: Type94) Promise~void~
        -previousSupersessionCompleted(Signature57)
        -finishReviewedSupersession(Signature58)
        -executeLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type95
        -reviewLinks(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -processJob(job: QueueJob, result: CaptureCheckpointResult) Type96
        -runBranchWorker(Signature59)
        -processBranchJob(job: QueueJob, result: CaptureCheckpointResult) Type97
        -recordBranchFailure(Signature60)
        -checkpointBranch(Signature61)
        -checkpointBranches(options: Type98) Promise~CaptureBranch[]~
        -appendCheckpointResult(Signature62)
        checkpoint(options: Type98) Promise~CaptureCheckpointResult~
        processPending(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        diagnostics(options: Type99) Promise~CaptureDiagnostics~
        pendingConflicts(options: Type100) Promise~CapturePendingConflict[]~
        pendingConflicts(sessionId: string, branchId: string) Promise~CapturePendingConflict[]~
        pendingConflicts(Signature63)
        -verifyConflictOrigin(conflict: PendingConflict) Promise~CapturePendingConflict~
        -ownedConflict(conflictId: string) Promise~PendingConflict~
        -rejectConflict(Signature64)
        -selectResolutionEvidence(Signature65)
        -validateResolutionEvidence(Signature66)
        -resolutionTarget(conflict: PendingConflict) ConflictResolutionTarget
        -markConflictResolved(Signature67)
        -revisionResources(current: Memory, destination: number, previous: Memory) unknown
        -planConflictReplacement(Signature68)
        -updateResolutionReplacement(Signature69)
        -createResolutionReplacement(conflict: PendingConflict) Promise~number~
        -linkResolutionEntity(Signature70)
        -executeResolutionLinks(conflict: PendingConflict, replacementId: number) Promise~void~
        -applyConflictResolution(Signature71)
        -failConflictResolution(conflictId: string, error: unknown) Promise~never~
        -resolveConflictOwned(Signature72)
        resolveConflict(Signature73)
        resolve(conflictId: string, input: ResolveConflictInput) Promise~CaptureResolveResult~
        advance(input: Type103) Promise~void~
        advanceWatermark(input: Type103) Promise~void~
        watermark(context: Type104) unknown
        stop(_sessionId: string, _branchId: string) void
    }
    class c0066["CaptureServiceOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        onActivity: Type105
        queue: DurableQueueStore
        client: ForgetfulClient
        model: MemoryModelClient
        instanceId: string
        endpoint: string
        accountId: string
        sessionId: string
        branchId: string
        policy: string
        isEnabled: Type65
        getMode: Type66
        canWriteNow: Type17
        canReadNow: Type17
        maxCandidates: number
        maxModelCalls: number
        maxJobsPerCheckpoint: number
        now: Type67
    }
    class c0067["CaptureUncertainWrite"] {
        <<class>>
    }
    class c0068["ConflictResolutionEvidence"] {
        <<interface>>
        evidenceEntryIds: string[]
        selectedAdditionalEntries: EvidenceEntry[]
        reason: string
        additionalEvidence: string
    }
    class c0069["ConflictResolutionTarget"] {
        <<interface>>
        oldMemory: Memory
        candidate: CaptureCandidate
        fakeJob: QueueJob
    }
    class c0070["InvalidCaptureOutput"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0071["MissingCaptureDestination"] {
        <<class>>
        constructor(candidate: CaptureCandidate, projects: Type106) unknown
        projects: Type106
    }
    class c0072["ResolveConflictInput"] {
        <<interface>>
        action: Type107
        reason: string
        evidenceEntryIds: string[]
        additionalEvidence: string
        additionalEntries: EvidenceEntry[]
        conversation: readonly unknown[]
    }
    class c0073["src/capture.ts"] {
        <<module>>
        reusableMergeComposition(plan: Type88, decision: Type108) boolean
        conflictResolutionEvidence(evidence: ConflictResolutionEvidence) unknown
        blockedSave(diagnostic: string) Error
        clone(value: T) T
        record(value: unknown) Type79
        stringValue(value: unknown, max: number) Type109
        strings(value: unknown, max: unknown, itemMax: number) string[]
        projectId(value: unknown) Type75
        snapshotForPersistence(snapshot: CaptureSnapshot) CaptureSnapshot
        captureWorkMetadata(snapshot: CaptureSnapshot) unknown
        sourceEvidence(candidate: CaptureCandidate, snapshot: CaptureSnapshot) EvidenceEntry[]
        sharedSourceEvidence(Signature74)
        invalidCandidate(reason: string) CandidateValidation~T~
        validCandidate(value: T) CandidateValidation~T~
        captureResource(raw: unknown, kind: string, index: number) Type9
        captureEvidenceError(ids: string[], snapshot: CaptureSnapshot) Type109
        eligibleCandidate(Signature75)
        parseCandidates(Signature76)
        boundedSubmissionRejections(value: readonly string[]) string[]
        appendSubmissionRejection(rejections: string[], reason: string) void
        captureCandidateSubmission(Signature77)
        decisionMemoryId(response: Type9) Type75
        decisionTargetMemoryId(response: Type9) Type75
        decisionMemoryIds(response: Type9) Type112
        decisionEvidenceIds(response: Type9) Type113
        decisionText(response: Type9, field: Type114) Type109
        decisionPartial(response: Type9) boolean
        applyEnrichmentDecision(response: Type9, decision: CaptureDecision) void
        applyEquivalentCandidate(response: Type9, decision: CaptureDecision) void
        parseDecision(value: unknown) CaptureDecision
        decisionConflictIds(decision: CaptureDecision) number[]
        firstConflictId(decision: CaptureDecision) Type75
        currentProjectId(context: WorkContext) Type75
        captureProvenance(candidate: CaptureCandidate, context: WorkContext) unknown
        memoryInput(Signature78)
        resourceInput(input: T, defaults: Type9) T
        captureKnowledgePlan(Signature79)
        overlapCandidate(candidate: CaptureCandidate) Type9
        definitelyRejected(error: unknown) boolean
        errorMessage(error: unknown) string
        scrubError(error: unknown) string
        isFinalOutcome(outcome: unknown) boolean
        trustedAdditionalEntries(value: unknown) EvidenceEntry[]
    }
    class c0074["src/concurrency.ts"] {
        <<module>>
        mapConcurrent(items: readonly T[], concurrency: number, operation: Type116) Promise~R[]~
    }
    class c0075["ForgetfulConfig"] {
        <<interface>>
        planningPanel: boolean
        enabled: boolean
        captureMode: CaptureMode
        verbosity: Verbosity
        logging: FileLogLevel
        logDirectory: string
        scope: Scope
        scopeSource: ScopeSource
        instance: ForgetfulInstanceConfig
        recallDeadlineMs: number
        recallModelTimeoutMs: number
        recallConcurrency: number
        contextLimitTokens: number
        model: ModelSelection
        prompts: PromptOverlays
        warnings: string[]
        paths: Type117
    }
    class c0076["ForgetfulInstanceConfig"] {
        <<interface>>
        baseUrl: string
        token: string
        tokenEnv: string
        timeoutMs: number
    }
    class c0077["JsonReadResult"] {
        <<interface>>
        value: unknown
        exists: boolean
        malformed: boolean
    }
    class c0078["LoadConfigOptions"] {
        <<interface>>
        agentDir: string
        cwd: string
        trusted: boolean
        env: NodeJS.ProcessEnv
        userSettingsPath: string
        projectSettingsPath: string
        userPromptDir: string
        projectPromptDir: string
    }
    class c0079["ModelSelection"] {
        <<interface>>
        provider: string
        id: string
    }
    class c0080["PersistedProjectSettings"] {
        <<interface>>
        scope: unknown
    }
    class c0081["PersistedUserSettings"] {
        <<interface>>
        base_url: unknown
        token: unknown
        token_env: unknown
        timeout_ms: unknown
        enabled: unknown
        planning_panel: unknown
        capture: unknown
        capture_mode: unknown
        debug: unknown
        verbosity: unknown
        logging: unknown
        log_directory: unknown
        recall_model_timeout_ms: unknown
        recall_concurrency: unknown
        context_limit_tokens: unknown
        model: unknown
    }
    class c0082["PromptName"] {
        <<type_alias>>
        alias: Type118
    }
    class c0083["PromptOverlays"] {
        <<interface>>
        classification: string
        recall: string
        capture: string
    }
    class c0084["ScopeSource"] {
        <<type_alias>>
        alias: Type119
    }
    class c0085["Verbosity"] {
        <<type_alias>>
        alias: Type120
    }
    class c0086["src/config.ts"] {
        <<module>>
        isRecallConcurrency(value: unknown) value is number
        resolveRecallConcurrency(value: unknown, warnings: string[]) number
        resolveContextLimit(value: unknown, warnings: string[]) number
        isFileLogLevel(value: unknown) value is FileLogLevel
        resolveLogDirectory(value: unknown, agentDir: string, warnings: string[]) string
        isVerbosity(value: unknown) value is Verbosity
        resolveVerbosity(user: PersistedUserSettings, warnings: string[]) Verbosity
        isRecord(value: unknown) Type121
        parseModel(value: unknown) Type122
        asBoolean(value: unknown, fallback: boolean) boolean
        asPositiveInteger(value: unknown, fallback: number) number
        asString(value: unknown) Type109
        readJson(path: string) Promise~JsonReadResult~
        readPromptDirectory(Signature80)
        mergePrompts(Signature81)
        resolveCaptureMode(value: unknown, warnings: string[]) CaptureMode
        resolveScope(Signature82)
        defaultAgentDir() string
        userSettingsPath(agentDir: unknown) string
        projectSettingsPath(cwd: string) string
        loadForgetfulConfig(options: LoadConfigOptions) Promise~ForgetfulConfig~
        writeJson(path: string, value: unknown) Promise~void~
        writeProjectScope(cwd: string, scope: Scope) Promise~void~
        updateUserSettings(path: string, update: Type124) Promise~void~
        updateForgetfulConnection(path: string, connection: Type125) Promise~void~
        modelToString(model: Type122) Type109
        readPlanningPanel(path: string) Promise~boolean~
    }
    class c0087["CaptureHistorySummary"] {
        <<interface>>
        throughEntryId: string
        text: string
    }
    class c0088["CaptureMode"] {
        <<type_alias>>
        alias: Type126
    }
    class c0089["CaptureSnapshot"] {
        <<interface>>
        id: string
        context: WorkContext
        instanceId: string
        entries: EvidenceEntry[]
        conversation: readonly unknown[]
        conversationCoverage: Type127
        sourceConversation: readonly unknown[]
        historySummary: CaptureHistorySummary
        processedThroughEntryId: Type10
        leafEntryId: string
        finalEntryId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        createdAt: string
    }
    class c0090["CodeArtifact"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0091["CodeArtifactInput"] {
        <<interface>>
        title: string
        description: string
        code: string
        language: string
        tags: string[]
        project_id: Type128
    }
    class c0092["CodeArtifactSummary"] {
        <<type_alias>>
        alias: Type129
    }
    class c0093["CompactedConversation"] {
        <<interface>>
        summary: string
        summarizedThroughEntryId: string
        retainedConversation: readonly unknown[]
    }
    class c0094["Document"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0095["DocumentInput"] {
        <<interface>>
        title: string
        description: string
        content: string
        document_type: string
        tags: string[]
        project_id: Type128
    }
    class c0096["DocumentSummary"] {
        <<type_alias>>
        alias: Type130
    }
    class c0097["Entity"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0098["EntityInput"] {
        <<interface>>
        name: string
        entity_type: EntityType
        custom_type: string
        notes: string
        tags: string[]
        aka: string[]
        project_ids: number[]
    }
    class c0099["EntityRelationship"] {
        <<interface>>
        id: number
    }
    class c0100["EntityRelationshipInput"] {
        <<interface>>
        source_entity_id: number
        target_entity_id: number
        relationship_type: string
    }
    class c0101["EntityType"] {
        <<type_alias>>
        alias: Type131
    }
    class c0102["EvidenceEntry"] {
        <<interface>>
        id: string
        role: Type132
        text: string
        toolName: string
        toolCallId: string
        isError: boolean
        details: unknown
    }
    class c0103["FileSummary"] {
        <<interface>>
        id: number
        filename: string
        description: string
        mime_type: string
        size_bytes: number
        tags: string[]
        project_id: Type128
    }
    class c0104["ForgetfulClient"] {
        <<interface>>
        knowledge: KnowledgeClient
        +getMemoryEntityIds(id: number, signal: AbortSignal) Promise~number[]~
        +search(request: SearchRequest, signal: AbortSignal) Promise~Memory[]~
        +queryMemory(request: SearchRequest, signal: AbortSignal) Promise~MemorySearchResult~
        +listProjects(repoName: string, signal: AbortSignal) Promise~Project[]~
        +createProject(input: ProjectInput, signal: AbortSignal) Promise~Project~
        +linkProject(id: number, repoName: string, signal: AbortSignal) Promise~Project~
        +create(input: MemoryInput, signal: AbortSignal) Promise~MemoryCreateResult~
        +get(id: number, signal: AbortSignal) Promise~Memory~
        +obsolete(Signature83)
        +supersede(Signature84)
    }
    class c0105["KnowledgeClient"] {
        <<interface>>
        +searchEntities(query: string, limit: number, signal: AbortSignal) Promise~Entity[]~
        +getEntity(id: number, signal: AbortSignal) Promise~Entity~
        +createEntity(input: EntityInput, signal: AbortSignal) Promise~Entity~
        +updateEntity(Signature85)
        +getEntityMemories(id: number, signal: AbortSignal) Type133
        +linkEntityMemory(entityId: number, memoryId: number, signal: AbortSignal) Promise~void~
        +getRelationships(id: number, signal: AbortSignal) Promise~EntityRelationship[]~
        +createRelationship(Signature86)
        +listDocuments(projectId: number, signal: AbortSignal) Promise~DocumentSummary[]~
        +getDocument(id: number, signal: AbortSignal) Promise~Document~
        +createDocument(input: DocumentInput, signal: AbortSignal) Promise~Document~
        +updateDocument(Signature87)
        +listCodeArtifacts(Signature88)
        +getCodeArtifact(id: number, signal: AbortSignal) Promise~CodeArtifact~
        +createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        +updateCodeArtifact(Signature89)
        +listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        +getFile(id: number, signal: AbortSignal) Promise~StoredFile~
        +updateMemory(Signature90)
        +linkMemories(id: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        +unlinkMemories(id: number, targetId: number, signal: AbortSignal) Promise~void~
    }
    class c0106["LinkedMemory"] {
        <<interface>>
        memory: Memory
        link_source_id: number
    }
    class c0107["Memory"] {
        <<interface>>
        id: number
        is_obsolete: boolean
        superseded_by: Type128
        obsolete_reason: Type10
        obsoleted_at: Type10
        linked_memory_ids: number[]
        access_count: number
        last_accessed_at: Type10
        updated_at: string
    }
    class c0108["MemoryCreateResult"] {
        <<interface>>
        id: number
        autoLinkedMemoryIds: number[]
    }
    class c0109["MemoryInput"] {
        <<interface>>
        title: string
        content: string
        context: string
        keywords: string[]
        tags: string[]
        importance: number
        project_ids: number[]
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
        document_ids: number[]
        code_artifact_ids: number[]
        file_ids: number[]
    }
    class c0110["MemoryModelClient"] {
        <<interface>>
        +prepareCapture(request: ModelRequest) Type134
        +complete(request: ModelRequest) Promise~unknown~
    }
    class c0111["MemorySearchResult"] {
        <<interface>>
        query: string
        primary_memories: Memory[]
        linked_memories: LinkedMemory[]
        total_count: number
        token_count: number
        truncated: boolean
    }
    class c0112["ModelEvidencePage"] {
        <<class>>
        constructor(entryId: string, record: unknown, offset: number, limit: number) unknown
        entryId: string
        record: unknown
        offset: number
        limit: number
    }
    class c0113["ModelReadErrorResult"] {
        <<class>>
        constructor(value: unknown) unknown
        value: unknown
    }
    class c0114["ModelReadTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +execute(input: unknown, signal: AbortSignal) Promise~unknown~
    }
    class c0115["ModelRequest"] {
        <<interface>>
        purpose: Type135
        policy: string
        input: unknown
        conversation: readonly unknown[]
        onConversationCompacted: Type136
        signal: AbortSignal
        submission: ModelSubmissionTool
        readTools: ModelReadTool[]
        readConcurrency: number
        readBatchContext: Type137
        diagnosticContext: Type138
    }
    class c0116["ModelSubmissionError"] {
        <<class>>
        constructor(message: string, rejectionReasons: string[]) unknown
        rejectionReasons: string[]
    }
    class c0117["ModelSubmissionTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +validate(input: unknown) unknown
        +onRejection(reason: string, input: unknown) void
    }
    class c0118["ModelTaskPause"] {
        <<class>>
    }
    class c0119["Project"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type10
        description: string
    }
    class c0120["ProjectInput"] {
        <<interface>>
        name: string
        description: string
        repo_name: string
    }
    class c0121["Provenance"] {
        <<interface>>
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
    }
    class c0122["Scope"] {
        <<type_alias>>
        alias: Type139
    }
    class c0123["SearchRequest"] {
        <<interface>>
        query: string
        query_context: string
        project_ids: number[]
        strict_project_filter: boolean
        k: number
        include_links: boolean
        max_links: number
        max_links_per_primary: number
    }
    class c0124["StoredFile"] {
        <<interface>>
        data: string
    }
    class c0125["WorkContext"] {
        <<interface>>
        cwd: string
        repoName: string
        project: Project
        projectDiscoveryPending: boolean
        sessionId: string
        branchId: string
    }
    class c0126["PlanStatus"] {
        <<type_alias>>
        alias: Type140
    }
    class c0127["PlanningCapability"] {
        <<type_alias>>
        alias: Type141
    }
    class c0128["PlanningCounts"] {
        <<interface>>
        cancelled: number
        done: number
        total: number
    }
    class c0129["PlanningCriterion"] {
        <<interface>>
        id: number
        task_id: number
        description: string
        met: boolean
        met_at: Type10
    }
    class c0130["PlanningPlan"] {
        <<interface>>
        goal: Type10
        context: Type10
    }
    class c0131["PlanningPlanSummary"] {
        <<interface>>
        id: number
        title: string
        project_id: number
        status: PlanStatus
        task_count: number
    }
    class c0132["PlanningProject"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type10
    }
    class c0133["PlanningTask"] {
        <<interface>>
        description: Type10
        criteria: PlanningCriterion[]
        dependency_ids: number[]
    }
    class c0134["PlanningTaskRecord"] {
        <<interface>>
        id: number
        title: string
        plan_id: number
        state: TaskState
        priority: TaskPriority
        assigned_agent: Type10
        version: number
    }
    class c0135["PlanningTaskSummary"] {
        <<interface>>
        criteria_met: number
        criteria_total: number
        blocked: boolean
    }
    class c0136["TaskPriority"] {
        <<type_alias>>
        alias: Type142
    }
    class c0137["TaskState"] {
        <<type_alias>>
        alias: Type143
    }
    class c0138["src/domain/planning.ts"] {
        <<module>>
        taskCounts(tasks: PlanningTaskSummary[]) PlanningCounts
        activeTasks(tasks: PlanningTaskSummary[]) PlanningTaskSummary[]
        sortPlans(plans: PlanningPlanSummary[]) PlanningPlanSummary[]
        mappedProject(projects: PlanningProject[], repoName: string) Type75
    }
    class c0139["AutomaticCaptureJobOutcome"] {
        <<interface>>
        ready: boolean
        terminal: boolean
        noCandidates: boolean
        candidateStages: Type144
        failure: Type145
    }
    class c0140["AutomaticRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0141["BoundedWaitOutcome"] {
        <<type_alias>>
        alias: Type146
        kind: Type147
        value: T
        kind: Type148
        kind: Type149
        error: unknown
        kind: Type150
    }
    class c0142["CaptureFeedbackItem"] {
        <<interface>>
        jobId: string
        state: CaptureFeedbackState
        outcome: AutomaticCaptureJobOutcome
    }
    class c0143["CaptureFeedbackState"] {
        <<interface>>
        reportedCandidateKeys: Set~string~
        lastFailureKey: string
        lastUnavailable: boolean
        retried: boolean
    }
    class c0144["CaptureServicePort"] {
        <<interface>>
        +enqueue(snapshot: CaptureSnapshot) Promise~unknown~
        +checkpoint(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        +advanceWatermark(update: Type151) Promise~unknown~
        +stop(sessionId: string, branchId: string) Type152
        +pendingConflicts(options: Type100) Promise~unknown[]~
        +diagnostics(options: Type99) Promise~unknown~
        +resolveConflict(conflictId: string, resolution: Type153) Promise~unknown~
    }
    class c0145["DiagnosticCandidate"] {
        <<interface>>
        id: unknown
        stage: unknown
        action: unknown
        destinationProjectId: unknown
        sourceEntryIds: unknown
        reason: unknown
        replacementId: unknown
        title: unknown
        content: unknown
        durationMs: unknown
    }
    class c0146["DiagnosticParts"] {
        <<interface>>
        candidates: number
        stages: Type154
        outcomes: string[]
    }
    class c0147["ExtensionWorkContext"] {
        <<interface>>
        projects: Project[]
    }
    class c0148["ForgetfulExtensionDependencies"] {
        <<interface>>
        client: ForgetfulClient
        createClient: Type155
        recall: RecallServicePort
        capture: CaptureServicePort
        createRecall: Type156
        createCapture: Type157
        resolveWorkContext: Type158
    }
    class c0149["ForgetfulExtensionOptions"] {
        <<interface>>
        agentDir: string
        config: Type159
        dependencies: ForgetfulExtensionDependencies
        policies: Type160
    }
    class c0150["PendingQueuedRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0151["PolicyName"] {
        <<type_alias>>
        alias: Type161
    }
    class c0152["PreparedRuntime"] {
        <<interface>>
        logger: FileLogger
        config: ForgetfulConfig
        client: ForgetfulClient
        model: PiMemoryModel
        recall: RecallServicePort
        context: ExtensionWorkContext
        sessionId: string
        currentLeaf: Type10
        branchId: string
        queueDirectory: string
    }
    class c0153["RecallActivity"] {
        <<interface>>
        memoryCount: number
        scope: Scope
        reason: string
    }
    class c0154["RecallContextMessage"] {
        <<interface>>
        role: string
        content: unknown
        customType: unknown
        details: unknown
    }
    class c0155["RecallJob"] {
        <<interface>>
        key: string
        jobId: string
        kind: Type162
        runtime: Runtime
        branchId: string
        generation: number
        prompt: string
        controller: AbortController
        promise: Promise~RecallResult~
        userEntryId: string
        phase: Type163
        result: RecallResult
        boundarySeen: boolean
        terminalConsumed: boolean
        resultSent: boolean
    }
    class c0156["RecallServicePort"] {
        <<interface>>
        +recall(request: Type164) Promise~RecallResult~
        +deeper(request: DeeperRecallRequest) Promise~RecallResult~
    }
    class c0157["Runtime"] {
        <<interface>>
        logger: FileLogger
        activity: ForgetfulActivity
        planning: PlanningRuntime
        sessionId: string
        generation: number
        cwd: string
        config: ForgetfulConfig
        client: ForgetfulClient
        model: PiMemoryModel
        recall: RecallServicePort
        capture: CaptureServicePort
        queue: DurableQueueStore
        context: ExtensionWorkContext
        branchId: string
        baselineEntryId: Type10
        lastCaptureEntryId: string
        pendingCaptureJobs: Type165
        recoveryResult: CaptureCheckpointResult
        captureFeedbackFlush: Promise~void~
        captureCheckpointTail: Promise~void~
        captureRetryScheduled: boolean
        captureTriggerId: number
        captureDeferrals: Type166
        settledCaptureTail: Promise~void~
        lifecycleController: AbortController
        initialization: Promise~void~
        ready: boolean
        discoveryError: unknown
        lastRecall: RecallActivity
        skipNextCapture: boolean
    }
    class c0158["SetupAuthentication"] {
        <<interface>>
        tokenEnv: string
        token: string
    }
    class c0159["State"] {
        <<interface>>
        runtime: Runtime
        pendingQueuedRecall: Type167
        automaticRecalls: Type168
        recallJobs: Type169
        skipNextCapture: boolean
        shownWarnings: Set~string~
        generation: number
        loading: Promise~Runtime~
    }
    class c0160["src/extension.ts"] {
        <<module>>
        boundedWait(Signature91)
        setupEndpointSuggestion(value: string) string
        promptSetupEndpoint(ctx: ExtensionContext, config: ForgetfulConfig) Type171
        promptSetupAuthentication(ctx: ExtensionContext) Type172
        makeInstanceId(config: ForgetfulConfig) string
        policyText(config: ForgetfulConfig, policies: Type160, name: PolicyName) string
        sessionKey(ctx: ExtensionContext, branchId: string) string
        boundedErrorDiagnostic(error: unknown) string
        textMessage(text: string) UserMessage
        snapshotWorkContext(context: ExtensionWorkContext) ExtensionWorkContext
        messageContentText(content: unknown) string
        usefulRecallText(result: RecallResult) string
        savedRecallResultText(result: RecallResult, kind: Type162) string
        automaticRecallTerminalText(Signature92)
        automaticRecallResultStatus(result: RecallResult) Type173
        recallActivitySummary(activity: RecallActivity) string
        recordRecallActivity(Signature93)
        recallContextEntries(ctx: ExtensionContext) EvidenceEntry[]
        latestBranchUserEntry(ctx: ExtensionContext) Type174
        latestContextUserPrompt(messages: Type175) Type109
        conflictBelongsToActiveBranch(Signature94)
        defaultWorkContext(ctx: ExtensionContext, branchId: string) ExtensionWorkContext
        canonicalRepository(remote: string) Type109
        qualifiedRepository(host: string, path: string) Type109
        discoverWorkContext(Signature95)
        parseSelection(value: string) Type122
        pickMemoryModel(ctx: ExtensionContext, currentModel: Type177) Type176
        notify(ctx: ExtensionContext, message: string, type: Type178) void
        log(Signature96)
        logFailure(Signature97)
        diagnosticSourceIds(value: unknown) string
        claimText(value: unknown) string
        diagnosticCandidateDetail(value: unknown, stages: Type154) Type109
        collectDiagnosticParts(jobs: unknown[]) DiagnosticParts
        diagnosticSummary(value: unknown) string
        captureJobId(value: unknown) Type109
        captureWasQueued(value: unknown) boolean
        captureProcessedJobIds(value: Type180) string[]
        captureFeedbackReason(value: unknown) Type109
        automaticCaptureJobOutcome(value: unknown, jobId: string) Type181
        readCaptureOutcome(Signature98)
        recordCaptureRetry(#123; state#44; outcome #125;: CaptureFeedbackItem) Type183
        collectCaptureFeedback(items: CaptureFeedbackItem[]) unknown
        captureCount(count: number, singular: string, plural: string) string
        skippedReasonBreakdown(reasons: Type154) string
        captureFailurePart(summary: Type184, noOtherParts: boolean) Type109
        captureFeedbackParts(summary: Type184) string[]
        automaticCaptureFeedback(items: CaptureFeedbackItem[], unavailable: number) Type185
        createForgetfulExtension(options: ForgetfulExtensionOptions) ExtensionFactory
    }
    class c0161["src/foreground-tools.ts"] {
        <<module>>
        registerForegroundTool(pi: ExtensionAPI, definition: ToolDefinition~T~) void
    }
    class c0162["ApiKnowledgeClient"] {
        <<class>>
        constructor(request: KnowledgeRequest, parseMemory: Type186) unknown
        -request: KnowledgeRequest
        -parseMemory: Type186
        searchEntities(query: string, limit: unknown, signal: AbortSignal) Promise~Entity[]~
        getEntity(entityId: number, signal: AbortSignal) Promise~Entity~
        createEntity(input: EntityInput, signal: AbortSignal) Promise~Entity~
        updateEntity(entityId: number, input: Partial~EntityInput~, signal: AbortSignal) unknown
        getEntityMemories(entityId: number, signal: AbortSignal) unknown
        linkEntityMemory(entityId: number, memoryId: number, signal: AbortSignal) Promise~void~
        getRelationships(entityId: number, signal: AbortSignal) Promise~EntityRelationship[]~
        createRelationship(input: EntityRelationshipInput, signal: AbortSignal) unknown
        listDocuments(projectId: number, signal: AbortSignal) Promise~DocumentSummary[]~
        getDocument(documentId: number, signal: AbortSignal) Promise~Document~
        createDocument(input: DocumentInput, signal: AbortSignal) Promise~Document~
        updateDocument(Signature99)
        listCodeArtifacts(projectId: number, signal: AbortSignal) Promise~CodeArtifactSummary[]~
        getCodeArtifact(artifactId: number, signal: AbortSignal) Promise~CodeArtifact~
        createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        updateCodeArtifact(Signature100)
        updateMemory(memoryId: number, input: Partial~MemoryInput~, signal: AbortSignal) unknown
        linkMemories(memoryId: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        unlinkMemories(memoryId: number, targetId: number, signal: AbortSignal) Promise~void~
        listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        getFile(fileId: number, signal: AbortSignal) Promise~StoredFile~
    }
    class c0163["KnowledgeRequest"] {
        <<type_alias>>
        alias: Type187
    }
    class c0164["src/http-knowledge.ts"] {
        <<module>>
        object(value: unknown) Type9
        text(value: unknown, max: number, empty: unknown, field: unknown) string
        id(value: unknown) number
        ids(value: unknown) number[]
        strings(value: unknown, max: unknown) string[]
        records(value: unknown, key: string) unknown[]
        provenance(value: Type9) Provenance
        entityBody(input: Partial~EntityInput~, partial: unknown) Type9
        entity(value: unknown) Entity
        relationshipBody(input: EntityRelationshipInput) Type9
        relationship(value: unknown) EntityRelationship
        memoryMetadata(value: Type9) Type9
        resourceBody(input: Type188, code: boolean, partial: unknown) Type9
        document(value: unknown) Document
        artifact(value: unknown) CodeArtifact
        summary(value: unknown, code: boolean) Type189
        requestSegment(value: unknown) string
        projectPath(path: string, projectId: number) string
        fileSummary(value: unknown) FileSummary
    }
    class c0165["ApiForgetfulClient"] {
        <<class>>
        knowledge: unknown
        search(request: SearchRequest, signal: AbortSignal) Promise~Memory[]~
        queryMemory(request: SearchRequest, signal: AbortSignal) Promise~MemorySearchResult~
        listProjects(repoName: string, signal: AbortSignal) Promise~Project[]~
        createProject(input: ProjectInput, signal: AbortSignal) Promise~Project~
        linkProject(id: number, repoName: string, signal: AbortSignal) Promise~Project~
        create(input: MemoryInput, signal: AbortSignal) Promise~MemoryCreateResult~
        get(id: number, signal: AbortSignal) Promise~Memory~
        getMemoryEntityIds(id: number, signal: AbortSignal) Promise~number[]~
        supersede(Signature101)
        obsolete(Signature102)
        -validId(id: number) number
    }
    class c0166["ApiForgetfulClientOptions"] {
        <<interface>>
        baseUrl: string
        token: string
        timeoutMs: number
        maxResponseBytes: number
        fetchImpl: typeof fetch
    }
    class c0167["ForgetfulAbortError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0168["ForgetfulHttpError"] {
        <<class>>
        status: number
        responseBody: string
        constructor(message: string, status: number, responseBody: string) unknown
    }
    class c0169["ForgetfulHttpTransport"] {
        <<class>>
        -baseUrl: URL
        -token: string
        -timeoutMs: number
        -maxResponseBytes: number
        -maxFileResponseBytes: number
        -fetchImpl: typeof fetch
        constructor(options: ApiForgetfulClientOptions) unknown
        getJson(path: string, signal: AbortSignal) Promise~unknown~
        getDeployment(path: string, signal: AbortSignal) Promise~unknown~
        #endpoint(path: string) string
        -responseByteLimit(method: string, url: URL) number
        #request(Signature103)
        -throwResponseError(Signature104)
        -readResponse(response: Response, signal: AbortSignal, maxBytes: number) Promise~string~
    }
    class c0170["ForgetfulSchemaError"] {
        <<class>>
        constructor(message: string) unknown
    }
    class c0171["ForgetfulTimeoutError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0172["src/http.ts"] {
        <<module>>
        isObject(value: unknown) Type121
        directEntityId(edge: unknown, memoryId: number) Type75
        requiredString(value: unknown, field: string, allowEmpty: unknown) string
        projectText(value: string, field: string, max: number) string
        optionalString(value: unknown, field: string) Type109
        requiredInteger(value: unknown, field: string) number
        nonNegativeInteger(value: unknown, field: string) number
        integerArray(value: unknown, field: string) number[]
        stringArray(value: unknown, field: string) string[]
        parseMemory(value: unknown, where: string) Memory
        parseProject(value: unknown, where: string) Project
        parseJson(text: string, where: string) unknown
        localHost(hostname: string) boolean
        trimTrailingSlashes(pathname: string) string
        makeAbortError() ForgetfulAbortError
        defaultWhenOmitted(value: Type192, fallback: T) T
        searchBody(request: SearchRequest) Type9
        uniqueMemories(memories: Memory[]) Memory[]
        parseLinkedMemories(value: unknown) LinkedMemory[]
        parseSearchPayload(Signature105)
        flattenSearchResult(result: MemorySearchResult) Memory[]
    }
    class c0173["Attachments"] {
        <<interface>>
        documents: Document[]
        artifacts: CodeArtifact[]
        files: FileSummary[]
        fileIds: number[]
    }
    class c0174["ExpansionContext"] {
        <<interface>>
        failures: Type193
    }
    class c0175["KnowledgeExpansionRequest"] {
        <<interface>>
        memories: Memory[]
        entityNames: string[]
        scope: Scope
        projectId: number
        signal: AbortSignal
    }
    class c0176["KnowledgeExpansionResult"] {
        <<interface>>
        text: string
        memoryIds: number[]
        entityIds: number[]
        relationshipIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        failures: Type194
    }
    class c0177["KnowledgeReadService"] {
        <<class>>
        -readMemory: MemoryReader
        constructor(client: KnowledgeClient, options: Type195) unknown
        -client: KnowledgeClient
        expand(request: KnowledgeExpansionRequest) Promise~KnowledgeExpansionResult~
        -findEntities(request: ExpansionContext) Promise~Entity[]~
        -findRelationships(Signature106)
        -collectRelationships(Signature107)
        -resolveRelationshipEndpoints(Signature108)
        -formatRelationships(Signature109)
        -findEntityMemories(Signature110)
        -collectEntityMemories(Signature111)
        -isAllowedEntityMemory(id: number, request: ExpansionContext) Promise~boolean~
        -findAttachments(request: ExpansionContext) Promise~Attachments~
        -formatExpansion(Signature112)
        -appendEntityLines(lines: string[], entities: Entity[]) void
        -appendRelationshipLines(lines: string[], relationships: RelationshipExpansion[]) void
        -appendLinkedMemoryLines(lines: string[], linkedMemories: LinkedMemoryExpansion[]) void
        -appendDocumentLines(lines: string[], documents: Document[]) void
        -appendArtifactLines(lines: string[], artifacts: CodeArtifact[]) void
        -appendFileLines(lines: string[], files: FileSummary[], fileIds: number[]) void
        -emptyExpansion() KnowledgeExpansionResult
    }
    class c0178["KnowledgeReadServiceOptions"] {
        <<interface>>
        readMemory: MemoryReader
    }
    class c0179["LinkedMemoryExpansion"] {
        <<type_alias>>
        entity: Entity
        id: number
        title: string
    }
    class c0180["MemoryReader"] {
        <<type_alias>>
        alias: Type199
    }
    class c0181["RelationshipExpansion"] {
        <<type_alias>>
        relationship: EntityRelationship
        source: Entity
        target: Entity
    }
    class c0182["src/knowledge-read.ts"] {
        <<module>>
        validId(value: unknown) value is number
        validEntity(value: unknown) value is Entity
        validRelationship(value: unknown) value is EntityRelationship
        validMemory(value: unknown) value is Memory
        inEntityScope(entity: Entity, scope: Scope, projectId: number) boolean
        inProjectScope(resourceProjectId: Type48, scope: Scope, projectId: number) boolean
        clean(value: string) string
        safeCall(operation: Type3, request: ExpansionContext, operationName: string) Type200
    }
    class c0183["KnowledgeReadContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeReadRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
    }
    class c0184["KnowledgeReadRequest"] {
        <<type_alias>>
        alias: Type201
        operation: string
    }
    class c0185["KnowledgeToolContext"] {
        <<interface>>
        cwd: string
        repoName: string
        commit: string
        project: Type202
        scope: Scope
    }
    class c0186["KnowledgeToolResult"] {
        <<interface>>
        content: Type203
        details: Type9
        file: StoredFile
    }
    class c0187["KnowledgeWriteContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeWriteRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
        beforeWrite: Type44
        checkWriteState: Type12
    }
    class c0188["KnowledgeWriteRequest"] {
        <<type_alias>>
        alias: Type201
        operation: string
    }
    class c0189["ResolvedWriteProject"] {
        <<interface>>
        id: number
        repoName: string
    }
    class c0190["ToolImage"] {
        <<type_alias>>
        data: string
        mimeType: string
        type: Type204
    }
    class c0191["ToolText"] {
        <<type_alias>>
        text: string
        type: Type205
    }
    class c0192["src/knowledge-tools.ts"] {
        <<module>>
        leftoverSearchField(description: string) unknown
        isEntityType(value: unknown) value is EntityType
        record(value: unknown, label: string) Type9
        requiredText(value: unknown, field: string, max: number) string
        optionalText(value: unknown, field: string, max: number) Type109
        requiredId(value: unknown, field: string) number
        optionalId(value: unknown, field: string) Type75
        boundedId(value: unknown, field: string, maximum: number) Type75
        requiredIds(value: unknown, field: string) number[]
        optionalIds(value: unknown, field: string) Type112
        requiredStrings(value: unknown, field: string, maxItems: unknown) string[]
        optionalStrings(value: unknown, field: string, maxItems: unknown) Type113
        optionalImportance(value: unknown) Type75
        commit(value: unknown) Type109
        checkOperation(value: unknown, choices: Set~string~) string
        containsSensitiveData(value: unknown) boolean
        rejectSensitiveInput(value: unknown) void
        need(input: Type9, fields: Type206) void
        validateReadSearch(input: Type9, op: string) void
        validateReadPagination(input: Type9, op: string) void
        validateKnowledgeReadRequest(value: unknown) KnowledgeReadRequest
        validateEntityFields(input: Type9) void
        validateKnowledgeWriteRequest(value: unknown) KnowledgeWriteRequest
        rich(client: ForgetfulClient) KnowledgeClient
        currentProject(context: KnowledgeToolContext, requested: number) number
        resolveWriteProject(Signature113)
        inMemoryProject(memory: Memory, projectId: number) boolean
        inEntityProject(entity: Entity, projectId: number) boolean
        json(value: unknown) string
        page(value: Type207, field: Type208, offset: number, limit: number) unknown
        listPage(values: T[], offset: number, limit: number) Type209
        boundedListPage(values: T[], offset: number, limit: number) Type210
        fileContent(file: StoredFile, offset: number, limit: number) Type211
        readResult(value: unknown, details: Type9) KnowledgeToolResult
        assertReadMemory(Signature114)
        assertReadEntity(Signature115)
        requireReadKnowledge(read: KnowledgeReadContext) KnowledgeClient
        requestedReadProject(read: KnowledgeReadContext) Type75
        readProjects(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readMemories(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readMemory(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readEntities(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readEntity(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readEntityMemories(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readRelationships(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readDocuments(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readDocument(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readCodeArtifacts(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readCodeArtifact(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readFiles(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        readFile(read: KnowledgeReadContext) Promise~KnowledgeToolResult~
        executeKnowledgeRead(Signature116)
        provenance(context: KnowledgeToolContext, request: Type9) Type212
        effectiveCommit(context: KnowledgeToolContext, request: Type9) Type109
        updateProvenance(Signature117)
        beforeMutation(beforeWrite: Type213, signal: AbortSignal) Promise~void~
        memoryInProject(Signature118)
        entityInProject(Signature119)
        hydrateEntities(Signature120)
        validateAttachments(Signature121)
        compactString(value: unknown) unknown
        compactObjectEntry(key: string, value: unknown, depth: number) unknown
        compactWriteValue(value: unknown, depth: unknown) unknown
        writeResult(value: unknown, operation: string) KnowledgeToolResult
        createMemory(Signature122)
        createEntity(Signature123)
        createDocument(Signature124)
        createCodeArtifact(Signature125)
        replacementMemory(write: KnowledgeWriteContext) Promise~Memory~
        updateMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        supersedeMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkMemories(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateEntity(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkEntityMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        createRelationship(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateDocument(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateCodeArtifact(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        executeKnowledgeWrite(Signature126)
    }
    class c0193["KnowledgeAttachmentIds"] {
        <<interface>>
        documentIds: number[]
        codeArtifactIds: number[]
    }
    class c0194["KnowledgeCodeArtifactPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: CodeArtifactInput
    }
    class c0195["KnowledgeDocumentPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: DocumentInput
    }
    class c0196["KnowledgeEntityMemoryLinkPlan"] {
        <<interface>>
        entityKey: string
    }
    class c0197["KnowledgeEntityPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: EntityInput
    }
    class c0198["KnowledgeMemoryReader"] {
        <<type_alias>>
        alias: Type199
    }
    class c0199["KnowledgeRelationshipPlan"] {
        <<interface>>
        key: string
        existingId: number
        sourceEntityKey: string
        targetEntityKey: string
        input: EntityRelationshipInput
    }
    class c0200["KnowledgeWriteCheckpoint"] {
        <<type_alias>>
        alias: Type214
    }
    class c0201["KnowledgeWriteGuard"] {
        <<type_alias>>
        alias: Type44
    }
    class c0202["KnowledgeWritePlan"] {
        <<interface>>
        operationId: string
        projectId: number
        memoryId: number
        expectedClaim: Type215
        attachResources: boolean
        existingDocumentIds: number[]
        existingCodeArtifactIds: number[]
        entities: KnowledgeEntityPlan[]
        documents: KnowledgeDocumentPlan[]
        codeArtifacts: KnowledgeCodeArtifactPlan[]
        relationships: KnowledgeRelationshipPlan[]
        entityMemoryLinks: KnowledgeEntityMemoryLinkPlan[]
        linkedMemoryIds: number[]
    }
    class c0203["KnowledgeWriteReceipt"] {
        <<interface>>
        key: string
        id: number
        occurrence: number
    }
    class c0204["KnowledgeWriteSave"] {
        <<type_alias>>
        alias: Type44
    }
    class c0205["KnowledgeWriteState"] {
        <<interface>>
        failure: Type216
        instructionId: string
        entities: KnowledgeWriteReceipt[]
        documents: KnowledgeWriteReceipt[]
        codeArtifacts: KnowledgeWriteReceipt[]
        relationships: KnowledgeWriteReceipt[]
        entityMemoryLinks: string[]
        linkedMemories: string[]
        attachmentsApplied: boolean
        pendingCreates: string[]
    }
    class c0206["KnowledgeWriter"] {
        <<class>>
        constructor(Signature127)
        -client: WriteClient
        -readMemory: KnowledgeMemoryReader
        -assertCanWrite: Type12
        -attachmentMemory(plan: KnowledgeWritePlan, signal: AbortSignal) Promise~Memory~
        -recordCreateFailure(Signature128)
        -createOnce(Signature129)
        -writeEntity(Signature130)
        -writeEntities(Signature131)
        -writeDocument(Signature132)
        -writeDocuments(Signature133)
        -writeCodeArtifact(Signature134)
        -writeCodeArtifacts(Signature135)
        -requestedAttachmentIds(Signature136)
        -attachmentIds(memory: Memory, requested: KnowledgeAttachmentIds) KnowledgeAttachmentIds
        -attachmentsDiffer(memory: Memory, ids: KnowledgeAttachmentIds) boolean
        -attachmentPatch(ids: KnowledgeAttachmentIds) Type219
        -writeConnection(Signature137)
        -writeAttachments(Signature138)
        -writeRelationship(Signature139)
        -writeRelationships(Signature140)
        -writeEntityMemoryLink(Signature141)
        -writeEntityMemoryLinks(Signature142)
        -writeLinkedMemory(Signature143)
        -writeLinkedMemories(Signature144)
        execute(Signature145)
    }
    class c0207["ResourceSlot"] {
        <<type_alias>>
        alias: Type221
        occurrence: number
    }
    class c0208["WriteClient"] {
        <<type_alias>>
        alias: Type222
    }
    class c0209["src/knowledge-write.ts"] {
        <<module>>
        resourceSlots(resources: T[]) ResourceSlot~T~[]
        copyState(value: KnowledgeWriteState) KnowledgeWriteState
        positiveId(value: unknown) value is number
        rejectedCreate(error: unknown) boolean
        stateWithNumber(Signature146)
        stateId(values: KnowledgeWriteReceipt[], key: string, occurrence: unknown) Type75
        selectedIds(values: KnowledgeWriteReceipt[], resources: Type223) number[]
        uniqueIds(values: number[]) number[]
        sameIds(left: Type112, right: number[]) boolean
        receipts(value: unknown) KnowledgeWriteReceipt[]
        normalizedState(previous: Partial~KnowledgeWriteState~) KnowledgeWriteState
        hasValue(values: string[], value: string) boolean
        instructionId(plan: KnowledgeWritePlan) string
    }
    class c0210["DiagnosticLogger"] {
        <<interface>>
        +emit(level: Type71, event: string, data: Type9) void
        +flush() Promise~void~
    }
    class c0211["FileLogLevel"] {
        <<type_alias>>
        alias: Type224
    }
    class c0212["FileLogger"] {
        <<class>>
        filePath: string
        -level: FileLogLevel
        -pending: unknown
        -generation: unknown
        -failed: unknown
        -closed: unknown
        -warned: unknown
        -maxEventBytes: number
        -maxFileBytes: number
        -maxFiles: number
        -fileBytes: unknown
        -fileCount: unknown
        -pendingBytes: unknown
        constructor(options: Type225) unknown
        -options: Type225
        setLevel(level: FileLogLevel) void
        emit(level: Type71, event: string, data: Type9) void
        -enqueue(level: Type71, event: string, data: Type9) void
        -rotate() Promise~void~
        -warn(error: unknown) void
        close() Promise~void~
        flush() Promise~void~
    }
    class c0213["src/logging.ts"] {
        <<module>>
        processExited(pid: number) boolean
        listLogFiles(directory: string) unknown
        pruneDirectory(directory: string, current: Type17) Promise~void~
        limit(value: Type75, fallback: number) number
        excludeCredentials(value: unknown) unknown
    }
    class c0214["src/memory-context.ts"] {
        <<module>>
        storedMemoryContext(context: string) string
        replacementMemoryContext(context: string) string
        replacementMemoryInput(input: MemoryInput) MemoryInput
    }
    class c0215["CompactedMemoryHistory"] {
        <<interface>>
        summary: string
        retainedMessages: Message[]
    }
    class c0216["ContextWindowError"] {
        <<class>>
    }
    class c0217["MemoryHistorySummaryOptions"] {
        <<interface>>
        model: Model~any~
        compactionSettings: CompactionSettings
        contextLimitTokens: number
        signal: AbortSignal
        sessionId: string
        complete: SummaryCompletion
    }
    class c0218["MemoryTaskContext"] {
        <<class>>
        -settings: typeof DEFAULT_COMPACTION_SETTINGS
        -contextWindow: number
        -originalHistory: Set~Message~
        -compactedHistory: CompactedMemoryHistory
        -summaryMessage: Message
        constructor(Signature147)
        -model: Model~any~
        -task: Message
        getCompactedHistory() Type227
        prepare(Signature148)
        prepareCapture(Signature149)
        -prepareContext(Signature150)
        -applySummary(Signature151)
        -outputAllowance(context: Context) number
    }
    class c0219["SummaryCompletion"] {
        <<type_alias>>
        alias: Type230
    }
    class c0220["src/model-context.ts"] {
        <<module>>
        objectRecord(value: unknown) Type121
        modelEvidence(record: unknown) unknown
        evidenceMessage(record: unknown, label: string, timestamp: number) UserMessage
        evidencePageContent(page: ModelEvidencePage) Type231
        textTokens(text: string) number
        contextTokens(context: Context) number
        assertFits(Signature152)
        validatePositiveSafeInteger(value: unknown, label: string) number
        entriesFor(messages: Message[]) SessionMessageEntry[]
        recentCutIndex(messages: Message[], keepRecentTokens: number) number
        assertImageSupport(context: Context, model: Model~any~) void
        summaryEvidence(message: Message, index: number) UserMessage
        privateContextWindow(model: Model~any~, contextLimitTokens: unknown) number
        compactionSettings(settings: CompactionSettings) typeof DEFAULT_COMPACTION_SETTINGS
        outputCeiling(Signature153)
        resolvedOutputAllowance(Signature154)
        smallerSummaryBatch(messages: Message[], count: number) number
        summarizeMemoryHistory(Signature155)
    }
    class c0221["MemoryModelHeaderTransform"] {
        <<type_alias>>
        alias: Type233
    }
    class c0222["ModelPickerContext"] {
        <<interface>>
        modelRegistry: Type234
        scopedModels: Type235
    }
    class c0223["ModelRegistryPort"] {
        <<interface>>
        +find(provider: string, modelId: string) Type177
        +complete(Signature156)
    }
    class c0224["PiMemoryModel"] {
        <<class>>
        version: string
        -classificationTimeoutMs: number
        -sessionId: string
        -transformHeaders: MemoryModelHeaderTransform
        -logger: DiagnosticLogger
        -compactionSettings: CompactionSettings
        -contextLimitTokens: number
        constructor(Signature157)
        -registry: ModelRegistryPort
        -selection: ModelSelection
        complete(request: ModelRequest) Promise~unknown~
        prepareCapture(request: ModelRequest) Type134
        -emit(level: Type71, event: string, request: ModelRequest, data: Type9) void
        -completeRequest(request: ModelRequest, preparationOnly: unknown) Promise~unknown~
        -completeAttempt(Signature158)
        -executeRead(Signature159)
        -validateSubmission(submission: ModelSubmissionTool, tool: Tool, call: ToolCall) unknown
        -completeWithSubmission(Signature160)
    }
    class c0225["PiMemoryModelOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        classificationTimeoutMs: number
        timeoutMs: number
        sessionId: string
        transformHeaders: MemoryModelHeaderTransform
        compactionSettings: CompactionSettings
        contextLimitTokens: number
    }
    class c0226["RequestDeadline"] {
        <<interface>>
        controller: AbortController
        callerAbort: Promise~never~
        timeout: Promise~never~
        timedOut: boolean
        providerCalls: number
        compactionCalls: number
        +cleanup() void
    }
    class c0227["src/model.ts"] {
        <<module>>
        serializeInput(input: unknown) string
        ensureCompletionFinished(Signature161)
        modelLabel(model: ModelSelection) string
        isOpenCodeModel(model: Model~any~) boolean
        openCodeSessionHeaders(model: Model~any~, sessionId: Type109) Type238
        requestTimeout(request: ModelRequest, classificationTimeoutMs: number) number
        requestOptions(Signature162)
        textBlock(text: string) TextContent
        submissionTool(submission: Type240) Tool
        toolCalls(message: AssistantMessage) ToolCall[]
        rejectionText(error: unknown) string
        sanitizedAssistantForHistory(message: AssistantMessage) AssistantMessage
        errorToolResult(call: ToolCall, error: string) ToolResultMessage
        appendCallCountCorrection(Signature163)
        requestDeadline(request: ModelRequest, timeoutMs: number) RequestDeadline
        throwRequestFailure(Signature164)
        resolveMemoryModel(Signature165)
        modelSelectionFromModel(model: Model~any~) ModelSelection
        availableMemoryModels(ctx: ModelPickerContext) Model~any~[]
    }
    class c0228["src/privacy.ts"] {
        <<module>>
        sanitizeText(text: string) string
        diagnosticMessage(error: unknown) string
        errorMessage(error: unknown) string
        hasSensitiveData(text: string) boolean
        isMemoryOperation(toolName: string) boolean
        sanitizeValue(value: unknown) unknown
    }
    class c0229["AgentProjectInitInput"] {
        <<interface>>
        name: string
        description: string
        projectId: number
    }
    class c0230["ProjectInitError"] {
        <<class>>
    }
    class c0231["src/project-init.ts"] {
        <<module>>
        existingMapping(projects: Project[], repoName: string) Type242
        validateAgentProjectDetails(repoName: string, input: AgentProjectInitInput) ProjectInput
        promptNewProject(ctx: ExtensionContext, repoName: string) Type243
        promptExistingProject(Signature166)
        initialiseProject(Signature167)
        initialiseProjectForAgent(Signature168)
    }
    class c0232["DurableQueueStore"] {
        <<class>>
        filePath: string
        lockPath: string
        -directory: string
        -instanceId: string
        -endpoint: string
        -accountId: string
        -staleLockMs: number
        -staleJobMs: number
        -maxAttempts: number
        -retentionMs: number
        -now: Type67
        -snapshotPrefix: string
        constructor(options: Type245) unknown
        -defaultIdentity() QueueIdentity
        -ensureDirectory() Promise~void~
        -snapshotPath(digest: string) string
        -syncDirectory() Promise~void~
        -readSnapshot(digest: string) Promise~SnapshotPayload~
        -storeSnapshot(payload: SnapshotPayload) Promise~string~
        -hydrateJob(job: StoredQueueJob) Promise~QueueJob~
        -releaseTerminalSnapshot(state: QueueState, job: StoredQueueJob) void
        -appendInspections(job: StoredQueueJob, additions: EvidenceEntry[]) Promise~void~
        -collectSnapshots(state: QueueState) Promise~void~
        -readState() Promise~QueueState~
        -writeState(state: QueueState) Promise~void~
        -acquireFileLock(path: string) Promise~FileLock~
        -recoverExistingLock(path: string, error: unknown) Promise~void~
        -createFileLock(path: string, token: string) Promise~FileLock~
        -releaseFileLock(path: string, token: string) Promise~void~
        -removeAbandonedLock(path: string) Promise~void~
        -withFileLock(path: string, operation: Type3) Promise~T~
        -withMutationFileLock(operation: Type3) Promise~T~
        -mutate(operation: Type246) Promise~T~
        -pruneFailedJobs(state: QueueState) boolean
        -prune(state: QueueState) void
        -updateWatermark(state: QueueState, update: WatermarkAdvance) QueueWatermark
        enqueue(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        enqueueSnapshot(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        advanceWatermark(update: Type247) Promise~QueueWatermark~
        getWatermark(sessionId: string, branchId: string) Promise~QueueWatermark~
        resolveBranchId(Signature169)
        currentWatermark(context: Type104) Promise~QueueWatermark~
        completeProjectDiscovery(context: Type248) Promise~void~
        listPending(identity: QueueIdentity) Promise~QueueJob[]~
        listJobs(identity: QueueIdentity) Promise~QueueJob[]~
        listJobMetadata(identity: QueueIdentity) Promise~QueueJobMetadata[]~
        getJob(jobId: string) Type89
        refreshCaptureHistory(jobId: string) Type249
        -reusableHistory(snapshot: CaptureSnapshot, watermark: QueueWatermark) Type250
        hasClaimableWork(identity: QueueIdentity, excludeBranches: Type251) Promise~boolean~
        claimNext(identity: QueueIdentity, branch: Type252, onDiscarded: Type253) Type89
        -matchesBranch(job: QueueJob, branch: Type254) boolean
        -runningJobCanBeRecovered(job: QueueJob, currentTime: number) boolean
        -claimJob(job: QueueJob) void
        releaseProgress(jobId: string, replenishModelCalls: unknown) Promise~void~
        cancel(Signature170)
        checkpoint(jobId: string, patch: QueueCheckpoint) Promise~QueueJob~
        checkpoint(jobId: string, candidateId: string, outcome: unknown) Promise~QueueJob~
        checkpoint(jobId: string, patchOrCandidate: Type255, outcome: unknown) Promise~QueueJob~
        -compactJobSnapshot(Signature171)
        -recordCompletedCapture(state: QueueState, job: StoredQueueJob) Promise~void~
        -applyCheckpointPatch(job: StoredQueueJob, patch: QueueCheckpoint) void
        complete(jobId: string) Promise~QueueJob~
        addConflict(conflict: PendingConflict) Promise~PendingConflict~
        getConflict(conflictId: string) Type256
        pendingConflicts(Signature172)
        listPendingConflicts(Signature173)
        markConflictHandedOff(conflictId: string, entryId: string) Promise~void~
        updateConflict(Signature174)
        withWorkerLock(identity: QueueIdentity, branch: Type252, operation: Type3) Type200
        close() Promise~void~
    }
    class c0233["DurableQueueStoreOptions"] {
        <<interface>>
        directory: string
        filePath: string
        lockPath: string
        instanceId: string
        endpoint: string
        accountId: string
        staleLockMs: number
        staleJobMs: number
        maxAttempts: number
        retentionMs: number
        now: Type67
    }
    class c0234["FileLock"] {
        <<interface>>
        token: string
        +release() Promise~void~
    }
    class c0235["HistoryCache"] {
        <<interface>>
        digest: string
        throughEntryId: string
        entryIds: string[]
    }
    class c0236["PendingConflict"] {
        <<interface>>
        id: string
        jobId: string
        candidateId: string
        binding: QueueIdentity
        sessionId: string
        branchId: string
        context: WorkContext
        destinationProjectId: number
        oldMemoryId: number
        oldMemoryIds: number[]
        oldClaim: string
        newClaim: string
        oldMemory: unknown
        candidate: unknown
        sourceEntryIds: string[]
        evidence: string[]
        partial: boolean
        reason: string
        status: Type257
        handoffEntryId: string
        replacementId: number
        uncertainWrite: string
        supersession: SupersessionReceipt
        replacement: Type258
        resolution: unknown
        createdAt: string
        updatedAt: string
    }
    class c0237["QueueBusyError"] {
        <<class>>
        constructor(path: string) unknown
    }
    class c0238["QueueCheckpoint"] {
        <<interface>>
        status: QueueJobStatus
        callCount: number
        extractedCandidates: unknown[]
        candidateOutcomes: Type9
        submissionRejections: string[]
        lastError: string
        startedAt: string
        supersession: SupersessionReceipt
        inspectionEntries: EvidenceEntry[]
        compactedConversation: CompactedConversation
    }
    class c0239["QueueEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
        historyError: string
    }
    class c0240["QueueIdentity"] {
        <<interface>>
        instanceId: string
        endpoint: string
        accountId: string
    }
    class c0241["QueueJob"] {
        <<interface>>
        id: string
        dedupeKey: string
        binding: QueueIdentity
        snapshot: CaptureSnapshot
        status: QueueJobStatus
        attempts: number
        callCount: number
        resumeAttempt: boolean
        extractedCandidates: unknown[]
        candidateOutcomes: Type9
        submissionRejections: string[]
        lastError: string
        uncertainWrite: string
        supersession: SupersessionReceipt
        createdAt: string
        updatedAt: string
        startedAt: string
        ownerPid: number
    }
    class c0242["QueueJobMetadata"] {
        <<interface>>
        snapshot: Type259
    }
    class c0243["QueueJobStatus"] {
        <<type_alias>>
        alias: Type260
    }
    class c0244["QueueState"] {
        <<interface>>
        version: Type261
        jobs: StoredQueueJob[]
        conflicts: PendingConflict[]
        watermarks: Type262
    }
    class c0245["QueueWatermark"] {
        <<interface>>
        sessionId: string
        branchId: string
        lastEntryId: string
        capturedThroughEntryId: string
        consideredEntryIds: string[]
        snapshotIds: string[]
        dedupeKeys: string[]
        historyDigest: string
        historyThroughEntryId: string
        historyEntryIds: string[]
        historyAlternatives: HistoryCache[]
        updatedAt: string
    }
    class c0246["SnapshotPayload"] {
        <<type_alias>>
        alias: Type263
        historyEntryIds: string[]
    }
    class c0247["StoredQueueJob"] {
        <<interface>>
        snapshotDigest: string
        inspectionDigest: string
    }
    class c0248["SupersessionReceipt"] {
        <<interface>>
        oldMemoryId: number
        replacementId: number
        operation: Type264
        status: Type32
    }
    class c0249["WatermarkAdvance"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
        dedupeKey: string
    }
    class c0250["src/queue.ts"] {
        <<module>>
        jsonSnapshot(value: T) T
        nowIso(now: Type67) string
        contextKey(sessionId: string, branchId: string) string
        dedupeKey(snapshot: CaptureSnapshot) string
        jobIdFor(key: string) string
        scrubDiagnostic(value: string) string
        outcomeRecord(value: unknown) Type9
        interruptedWrite(job: QueueJob) boolean
        releaseCompletedArtifacts(job: StoredQueueJob) void
        normaliseState(value: unknown) QueueState
        validateInspectionEntry(input: EvidenceEntry, reserved: Set~string~) void
        isProcessAlive(pid: unknown) boolean
        identityMatches(job: QueueJob, identity: QueueIdentity) boolean
        conflictIdentityMatches(conflict: PendingConflict, identity: QueueIdentity) boolean
        shouldRetain(timestamp: string, now: number, retentionMs: number) boolean
        diagnosticError(error: unknown) string
        recordId(value: unknown) Type109
        orderedSourceEntryIds(snapshot: CaptureSnapshot) Type113
        summaryCursor(snapshot: CaptureSnapshot) Type265
        cursorComparison(candidate: Type266, current: Type267) Type75
        clearHistoryCache(watermark: QueueWatermark) void
        historyCaches(watermark: QueueWatermark) HistoryCache[]
        setHistoryCaches(watermark: QueueWatermark, caches: HistoryCache[]) void
    }
    class c0251["DeadlineSignal"] {
        <<interface>>
        signal: AbortSignal
        finish: Type12
        pause: Type12
        resume: Type12
        expired: Type17
        diagnostic: Type268
    }
    class c0252["DeeperRecallRequest"] {
        <<interface>>
        query: string
        context: WorkContext
        scope: Scope
        signal: AbortSignal
        deadlineMs: number
        projects: Project[]
    }
    class c0253["RecallPlan"] {
        <<interface>>
        search: boolean
        queries: string[]
        queryIntent: string
        entities: string[]
        repositorySpecific: boolean
        projectId: number
    }
    class c0254["RecallRequest"] {
        <<interface>>
        diagnosticContext: Type269
        prompt: string
        context: WorkContext
        scope: Scope
        classificationPolicy: string
        recallPolicy: string
        signal: AbortSignal
        deadlineMs: number
        authorizeProject: Type270
        projects: Project[]
        sessionContext: EvidenceEntry[]
        onPlan: Type271
    }
    class c0255["RecallResult"] {
        <<interface>>
        text: string
        historicalText: string
        handlingPolicy: string
        memoryIds: number[]
        scope: Scope
        reason: string
        toolError: string
        toolErrorFromForgetful: boolean
        diagnostic: string
        debugTrace: string
        reviewValidationDebug: string
        entityIds: number[]
        relationshipIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
    }
    class c0256["RecallService"] {
        <<class>>
        -defaultDeadlineMs: number
        -failureThreshold: number
        -cooldownMs: number
        -now: Type272
        -knowledge: KnowledgeReadService
        -concurrency: number
        -failures: unknown
        -openedAt: Type75
        constructor(Signature175)
        -client: ForgetfulClient
        -model: MemoryModelClient
        recall(request: RecallRequest) Promise~RecallResult~
        -recallReadTool(Signature176)
        -finishFailure(Signature177)
        -finishReview(Signature178)
        deeper(request: DeeperRecallRequest) Promise~RecallResult~
        -memoryInScope(memory: Memory, scope: Scope, projectId: number) boolean
        -optionalKnowledge(Signature179)
        -resultWithKnowledge(Signature180)
        -plannerInput(request: RecallRequest) unknown
        -authorizeProjectSelection(Signature181)
        -requestsDifferentProject(Signature182)
        -searchMemories(Signature183)
        -searchFailure(error: unknown) unknown
        -searchRequest(Signature184)
        -queryContext(plan: RecallPlan) string
        -resolveScope(Signature185)
        -contextProjectResolution(context: WorkContext) ScopeResolution
        -matchResolution(matches: Project[]) ScopeResolution
        -ensureLive(deadline: DeadlineSignal) void
        -empty(scope: Scope, reason: string) RecallResult
        -circuitOpen() boolean
        -recordFailure() void
        -recordSuccess() void
    }
    class c0257["RecallServiceOptions"] {
        <<interface>>
        concurrency: number
        deadlineMs: number
        circuitFailureThreshold: number
        circuitCooldownMs: number
        now: Type272
    }
    class c0258["ReviewValidationError"] {
        <<class>>
        constructor(message: string, debug: string) unknown
        debug: string
    }
    class c0259["ScopeResolution"] {
        <<interface>>
        projectId: number
        project: Project
        reason: string
    }
    class c0260["SearchOutcome"] {
        <<interface>>
        memories: Memory[]
        failed: boolean
        diagnostic: string
        failure: unknown
    }
    class c0261["src/recall.ts"] {
        <<module>>
        isForgetfulResponseError(error: unknown) Type277
        isObject(value: unknown) Type121
        plannerString(value: unknown, field: string, required: unknown) string
        positiveInteger(value: unknown, field: string) number
        abortError() Error
        isAbort(error: unknown) boolean
        failureReason(deadline: DeadlineSignal, callerSignal: AbortSignal) string
        exceptionDiagnostic(stage: string, error: unknown) string
        trim(value: string, max: number) string
        repositoryIdentity(context: WorkContext) Type109
        repoAwareQuery(query: string, context: WorkContext, repositorySpecific: boolean) string
        availableProjects(context: WorkContext, supplied: Project[]) Project[]
        createDeadlineSignal(callerSignal: Type191, deadlineMs: number) DeadlineSignal
        raceAbort(promise: Promise~T~, signal: AbortSignal) Promise~T~
        parseQueries(value: unknown, search: boolean) string[]
        parseEntities(value: unknown) string[]
        parsePlan(value: unknown) RecallPlan
        validateMemory(value: unknown) Type278
        formatRecall(Signature186)
        reviewSources(result: Partial~RecallResult~) Type280
        sourceLabels(sources: ReturnType~typeof reviewSources~) string[]
        boundDebugText(value: string, max: number, marker: string) string
        reviewerOutputText(value: unknown) string
        reviewMismatchDirection(value: unknown) Type109
        reviewValidationDebug(Signature187)
        submissionAttemptTrace(rejections: string[], exhausted: unknown, label: Type281) string
        parseReview(value: unknown, candidates: RecallResult) Type282
        recallReviewSubmission(Signature188)
        sanitizePolicy(value: string) string
    }
    class c0262["src/repository.ts"] {
        <<module>>
        repositoryName(value: string) string
    }
    class c0263["SetupHelp"] {
        <<interface>>
        newInstance: boolean
        route: Type284
    }
    class c0264["src/setup.ts"] {
        <<module>>
        promptSetupHelp(ctx: ExtensionContext) Type285
        buildSetupPrompt(help: SetupHelp, agentDir: string, settingsPath: string) string
    }
    class c0265["CaptureSnapshotWithStatus"] {
        <<interface>>
        finalStopReason: string
    }
    class c0266["MessageRecord"] {
        <<interface>>
        role: unknown
        content: unknown
        toolName: unknown
        isError: unknown
        stopReason: unknown
        toolCallId: unknown
        details: unknown
    }
    class c0267["SnapshotOptions"] {
        <<interface>>
        session: SnapshotSessionReader
        context: WorkContext
        instanceId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        afterEntryId: Type10
        baselineEntryId: Type10
        branchId: string
        createdAt: string
        leafEntryId: string
        excludedEvidenceEntryIds: readonly string[]
        includeToolEvidence: Type286
    }
    class c0268["SnapshotResult"] {
        <<type_alias>>
        alias: Type287
        snapshot: CaptureSnapshotWithStatus
        status: Type288
        finalEntryId: string
        reason: string
        status: Type289
    }
    class c0269["SnapshotSessionReader"] {
        <<interface>>
        +getSessionId() string
        +getLeafId() Type10
        +getBranch(fromId: string) SessionEntry[]
    }
    class c0270["src/snapshot.ts"] {
        <<module>>
        isRecord(value: unknown) Type121
        asMessage(entry: SessionEntry) Type290
        contentText(content: unknown) string
        safeText(text: string) string
        sanitizeConversation(value: unknown) unknown
        sanitizeCaptureConversation(conversation: readonly unknown[]) unknown[]
        sanitizeCaptureSnapshot(snapshot: CaptureSnapshot) CaptureSnapshot
        conversationForEntry(entry: SessionEntry) unknown
        rootId(branch: SessionEntry[], fallback: string) string
        snapshotId(sessionId: string, branchId: string, finalEntryId: string) string
        deltaStartIndex(Signature189)
        toolEvidence(id: string, message: MessageRecord, includeToolEvidence: Type292) Type291
        evidenceForEntry(entry: SessionEntry, includeToolEvidence: Type293) Type291
        lastAssistantEntry(entries: SessionEntry[]) Type294
        collectEvidence(entries: SessionEntry[], includeToolEvidence: Type292) EvidenceEntry[]
        captureSummaryRecord(history: CaptureHistorySummary) unknown
        captureConversation(snapshot: CaptureSnapshot) readonly unknown[]
        compactCaptureSnapshot(Signature190)
        reuseCaptureHistory(snapshot: CaptureSnapshot, history: Type295) CaptureSnapshot
        buildCaptureSnapshot(options: SnapshotOptions) SnapshotResult
    }
    class c0271["SourceInspectionError"] {
        <<interface>>
        name: string
        message: string
        code: string
    }
    class c0272["SourceInspectionRequest"] {
        <<type_alias>>
        alias: Type296
        path: string
        path: never
        url: never
        url: string
    }
    class c0273["SourceInspectionResult"] {
        <<type_alias>>
        alias: Type297
        status: Type298
        identifier: string
        content: string
        observedAt: string
        contentHash: string
        sanitized: boolean
        page: Type299
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
        fileState: Type300
        provenanceError: SourceInspectionError
        httpStatus: number
        status: Type301
        observedAt: string
        error: SourceInspectionError
        source_url: string
        httpStatus: number
        httpStatusText: string
        body: string
    }
    class c0274["SourceInspector"] {
        <<class>>
        -root: Type302
        constructor(options: SourceInspectorOptions) unknown
        -options: SourceInspectorOptions
        inspect(input: unknown, signal: AbortSignal) Promise~SourceInspectionResult~
        -inspectUrl(request: Type303, signal: AbortSignal) Promise~SourceInspectionResult~
        -getUrl(url: URL, allowLoopback: boolean, signal: AbortSignal) Type304
        -check(signal: AbortSignal) void
        -readFile(cwd: string, path: string, signal: AbortSignal) Promise~Buffer~
        -provenance(cwd: string, path: string, bytes: Buffer, signal: AbortSignal) unknown
        -git(cwd: string, args: string[], signal: AbortSignal) Promise~string~
    }
    class c0275["SourceInspectorOptions"] {
        <<interface>>
        cwd: string
        repoName: string
        canRead: Type17
    }
    class c0276["src/source-inspection.ts"] {
        <<module>>
        loopback(host: string) boolean
        validateUrl(url: URL) string
        validateAddress(address: string, allowLoopback: boolean) void
        errorDetails(error: unknown) SourceInspectionError
        sourceContent(bytes: Buffer, request: SourceInspectionRequest) unknown
        requireInside(cwd: string, path: string) void
    }
    c0000 ..> c0160 : defaultExtension() calls createForgetfulExtension()
    c0003 ..> c0004 : setLabel() calls refresh()
    c0003 ..> c0065 : dispose() calls stop()
    c0004 --> c0003 : field loader
    c0004 ..> c0003 : 4 relationships (see list)
    c0004 ..> c0004 : 3 relationships (see list)
    c0004 ..> c0065 : refresh() calls now()
    c0005 ..> c0005 : 9 relationships (see list)
    c0005 ..> c0006 : 33 relationships (see list)
    c0005 ..|> c0017 : implements
    c0005 ..> c0018 : 7 relationships (see list)
    c0005 ..> c0127 : type in capabilities
    c0005 ..> c0130 : type in plan
    c0005 ..> c0131 : type in plans
    c0005 ..> c0132 : type in projects
    c0005 ..> c0133 : type in task
    c0005 ..> c0135 : type in tasks
    c0005 --> c0166 : field options
    c0005 ..> c0166 : type in constructor
    c0005 --> c0169 : field transport
    c0005 ..> c0169 : 7 relationships (see list)
    c0005 ..> c0182 : clean() calls clean()
    c0005 ..> c0228 : 2 relationships (see list)
    c0006 ..> c0006 : 16 relationships (see list)
    c0006 ..> c0134 : type in taskRecord
    c0006 ..> c0170 : invalid() constructs ForgetfulSchemaError
    c0007 ..|> c0016 : implements
    c0007 ..> c0086 : 3 relationships (see list)
    c0008 ..> c0003 : command() calls refresh()
    c0008 ..> c0008 : 24 relationships (see list)
    c0008 ..> c0009 : 2 relationships (see list)
    c0008 ..> c0010 : 5 relationships (see list)
    c0008 ..> c0011 : 8 relationships (see list)
    c0008 --> c0020 : field controller
    c0008 ..> c0020 : type in constructor
    c0008 ..> c0160 : 3 relationships (see list)
    c0008 ..> c0261 : command() calls trim()
    c0009 ..> c0003 : handleInput() calls refresh()
    c0009 ..> c0008 : 4 relationships (see list)
    c0009 ..> c0009 : 5 relationships (see list)
    c0009 ..> c0010 : 8 relationships (see list)
    c0009 ..> c0011 : 5 relationships (see list)
    c0009 ..> c0019 : 4 relationships (see list)
    c0009 --> c0020 : field controller
    c0009 ..> c0020 : type in constructor
    c0010 ..> c0010 : 7 relationships (see list)
    c0010 ..> c0019 : 3 relationships (see list)
    c0010 ..> c0135 : type in taskLabel
    c0010 ..> c0228 : text() calls sanitizeText()
    c0011 ..> c0005 : 6 relationships (see list)
    c0011 ..> c0007 : changePanel() calls write()
    c0011 ..> c0011 : 43 relationships (see list)
    c0011 --> c0012 : field options
    c0011 ..> c0012 : type in constructor
    c0011 ..> c0018 : type in accept
    c0011 --> c0019 : field current
    c0011 ..> c0019 : 3 relationships (see list)
    c0011 ..|> c0020 : implements
    c0011 ..> c0065 : readOverview() calls now()
    c0011 ..> c0138 : 4 relationships (see list)
    c0012 --> c0013 : field clock
    c0012 --> c0016 : field preferences
    c0012 --> c0017 : field reader
    c0015 --> c0014 : field error
    c0015 --> c0128 : field counts
    c0015 --> c0135 : 2 relationships (see list)
    c0017 ..> c0018 : 6 relationships (see list)
    c0017 ..> c0127 : type in capabilities
    c0017 ..> c0130 : type in plan
    c0017 ..> c0131 : type in plans
    c0017 ..> c0132 : type in projects
    c0017 ..> c0133 : type in task
    c0017 ..> c0135 : type in tasks
    c0018 --> c0014 : field error
    c0019 --> c0014 : 2 relationships (see list)
    c0019 --> c0015 : field planTasks
    c0019 --> c0127 : field capability
    c0019 --> c0130 : field planDetail
    c0019 --> c0131 : field plans
    c0019 --> c0132 : field projects
    c0019 --> c0133 : field taskDetail
    c0020 --> c0019 : field state
    c0020 ..> c0019 : type in subscribe
    c0022 ..> c0005 : createPlanningRuntime() constructs ApiPlanningReader
    c0022 ..> c0007 : createPlanningRuntime() constructs LocalPlanningPreferences
    c0022 ..> c0008 : 6 relationships (see list)
    c0022 ..> c0011 : 3 relationships (see list)
    c0022 ..> c0065 : createPlanningRuntime() calls now()
    c0022 ..> c0075 : type in createPlanningRuntime
    c0025 ..> c0023 : type in initialCorrectionCycle
    c0025 ..> c0114 : type in captureFailureReport
    c0025 ..> c0228 : captureFailureReport() calls sanitizeValue()
    c0026 --> c0027 : 2 relationships (see list)
    c0026 --> c0028 : field decisions
    c0026 --> c0029 : field preservation
    c0026 --> c0030 : field previous
    c0026 --> c0090 : field resources
    c0026 --> c0094 : field resources
    c0026 --> c0107 : 2 relationships (see list)
    c0030 --> c0090 : field codeArtifacts
    c0030 --> c0094 : field documents
    c0030 --> c0097 : field entities
    c0030 --> c0107 : field memory
    c0031 ..> c0004 : 2 relationships (see list)
    c0031 ..> c0024 : authorizedMemory() constructs CaptureSelectionError
    c0031 ..> c0026 : 8 relationships (see list)
    c0031 ..> c0027 : type in executeConnection
    c0031 ..> c0028 : 3 relationships (see list)
    c0031 ..> c0029 : type in validateLinkReviews
    c0031 ..> c0030 : type in preparePreviousConnections
    c0031 ..> c0031 : 10 relationships (see list)
    c0031 ..> c0090 : type in readAttachmentRecords
    c0031 ..> c0094 : type in readAttachmentRecords
    c0031 ..> c0104 : 7 relationships (see list)
    c0031 ..> c0107 : 6 relationships (see list)
    c0031 ..> c0122 : 3 relationships (see list)
    c0031 ..> c0162 : 8 relationships (see list)
    c0031 ..> c0165 : 6 relationships (see list)
    c0031 ..> c0206 : executeConnection() calls execute()
    c0031 ..> c0228 : 5 relationships (see list)
    c0031 ..> c0261 : validateLinkDecisions() calls trim()
    c0032 --> c0122 : field scope
    c0034 --|> c0032 : inherits
    c0036 ..> c0024 : 3 relationships (see list)
    c0036 ..> c0032 : 4 relationships (see list)
    c0036 ..> c0033 : 4 relationships (see list)
    c0036 ..> c0034 : type in preserveMergeConnections
    c0036 ..> c0036 : 8 relationships (see list)
    c0036 ..> c0104 : 5 relationships (see list)
    c0036 ..> c0107 : type in collectMergeConnections
    c0036 ..> c0162 : 7 relationships (see list)
    c0036 ..> c0165 : 2 relationships (see list)
    c0036 ..> c0206 : preserveMergeConnections() calls execute()
    c0037 --> c0044 : field candidates
    c0042 --> c0044 : field candidate
    c0042 --> c0057 : field neighborhood
    c0042 --> c0107 : field overlaps
    c0044 --> c0047 : field codeArtifacts
    c0044 --> c0053 : field documents
    c0044 --> c0055 : field entities
    c0044 --> c0062 : field relationships
    c0045 --> c0043 : field excludeBranches
    c0046 --> c0043 : field deferredBranches
    c0047 --|> c0194 : inherits
    c0048 --> c0039 : field action
    c0048 --> c0064 : field reuse
    c0049 --> c0026 : field linkReview
    c0049 --> c0039 : field action
    c0050 --> c0236 : field status
    c0051 --> c0049 : field candidates
    c0051 --> c0243 : field status
    c0052 --> c0050 : field conflicts
    c0052 --> c0051 : field jobs
    c0053 --|> c0195 : inherits
    c0055 --|> c0197 : inherits
    c0056 --> c0033 : field connections
    c0056 --> c0044 : field candidate
    c0056 --> c0107 : field memories
    c0057 --> c0090 : field codeArtifacts
    c0057 --> c0094 : field documents
    c0057 --> c0097 : field entities
    c0057 --> c0099 : field relationships
    c0058 --> c0067 : field uncertainWrite
    c0058 --> c0248 : field supersession
    c0059 --|> c0118 : inherits
    c0060 --|> c0236 : inherits
    c0062 --|> c0199 : inherits
    c0063 --> c0236 : field conflict
    c0065 ..> c0004 : activity() calls set()
    c0065 ..> c0008 : 2 relationships (see list)
    c0065 ..> c0024 : 9 relationships (see list)
    c0065 ..> c0025 : 13 relationships (see list)
    c0065 ..> c0026 : 5 relationships (see list)
    c0065 ..> c0031 : 4 relationships (see list)
    c0065 ..> c0036 : 6 relationships (see list)
    c0065 --> c0040 : field activityPhase
    c0065 ..> c0040 : type in activity
    c0065 ..> c0041 : 2 relationships (see list)
    c0065 ..> c0042 : type in prepareOverlapBatch
    c0065 ..> c0043 : 3 relationships (see list)
    c0065 ..> c0044 : 42 relationships (see list)
    c0065 ..> c0045 : 3 relationships (see list)
    c0065 ..> c0046 : 13 relationships (see list)
    c0065 ..> c0048 : 13 relationships (see list)
    c0065 ..> c0052 : type in diagnostics
    c0065 ..> c0054 : 2 relationships (see list)
    c0065 ..> c0056 : 3 relationships (see list)
    c0065 ..> c0057 : 2 relationships (see list)
    c0065 ..> c0059 : 13 relationships (see list)
    c0065 ..> c0060 : 2 relationships (see list)
    c0065 ..> c0061 : ensureModelCallAllowed() constructs CaptureProgress
    c0065 ..> c0063 : 6 relationships (see list)
    c0065 ..> c0065 : 227 relationships (see list)
    c0065 --> c0066 : field onActivity
    c0065 ..> c0066 : type in constructor
    c0065 ..> c0067 : 9 relationships (see list)
    c0065 ..> c0068 : 3 relationships (see list)
    c0065 ..> c0069 : 2 relationships (see list)
    c0065 ..> c0070 : 4 relationships (see list)
    c0065 ..> c0071 : resolveDestination() constructs MissingCaptureDestination
    c0065 ..> c0072 : 6 relationships (see list)
    c0065 ..> c0073 : 107 relationships (see list)
    c0065 --> c0088 : field getMode
    c0065 ..> c0088 : 3 relationships (see list)
    c0065 ..> c0089 : 7 relationships (see list)
    c0065 ..> c0097 : 4 relationships (see list)
    c0065 ..> c0099 : type in neighborhoodRelationships
    c0065 --> c0104 : field client
    c0065 ..> c0104 : type in cancellableClient
    c0065 ..> c0105 : type in cancellableKnowledge
    c0065 --> c0107 : field readSavedMemory
    c0065 ..> c0107 : 15 relationships (see list)
    c0065 ..> c0108 : type in createMemory
    c0065 --> c0110 : field model
    c0065 ..> c0112 : evidenceReadTool() constructs ModelEvidencePage
    c0065 ..> c0113 : sourceInspectionTool() constructs ModelReadErrorResult
    c0065 ..> c0114 : 2 relationships (see list)
    c0065 ..> c0125 : 4 relationships (see list)
    c0065 ..> c0162 : 35 relationships (see list)
    c0065 ..> c0165 : 32 relationships (see list)
    c0065 --> c0206 : field knowledgeWriter
    c0065 ..> c0206 : 2 relationships (see list)
    c0065 --> c0210 : field logger
    c0065 ..> c0212 : 14 relationships (see list)
    c0065 ..> c0214 : 4 relationships (see list)
    c0065 ..> c0218 : loadCandidates() calls prepareCapture()
    c0065 ..> c0228 : 23 relationships (see list)
    c0065 --> c0232 : field queue
    c0065 ..> c0232 : 70 relationships (see list)
    c0065 ..> c0236 : 13 relationships (see list)
    c0065 --> c0240 : field identity
    c0065 ..> c0241 : 57 relationships (see list)
    c0065 ..> c0248 : type in recordSupersession
    c0065 ..> c0261 : 3 relationships (see list)
    c0065 ..> c0270 : 8 relationships (see list)
    c0065 ..> c0274 : 2 relationships (see list)
    c0066 --> c0040 : field onActivity
    c0066 --> c0088 : field getMode
    c0066 --> c0104 : field client
    c0066 --> c0110 : field model
    c0066 --> c0210 : field logger
    c0066 --> c0232 : field queue
    c0067 --|> c0059 : inherits
    c0068 --> c0102 : field selectedAdditionalEntries
    c0069 --> c0044 : field candidate
    c0069 --> c0107 : field oldMemory
    c0069 --> c0241 : field fakeJob
    c0071 --|> c0024 : inherits
    c0071 ..> c0044 : type in constructor
    c0072 --> c0102 : field additionalEntries
    c0073 ..> c0037 : type in parseCandidates
    c0073 ..> c0038 : 3 relationships (see list)
    c0073 ..> c0044 : 7 relationships (see list)
    c0073 ..> c0048 : 6 relationships (see list)
    c0073 ..> c0056 : type in reusableMergeComposition
    c0073 ..> c0068 : type in conflictResolutionEvidence
    c0073 ..> c0070 : 11 relationships (see list)
    c0073 ..> c0073 : 36 relationships (see list)
    c0073 ..> c0089 : 8 relationships (see list)
    c0073 ..> c0102 : 3 relationships (see list)
    c0073 ..> c0107 : type in captureKnowledgePlan
    c0073 ..> c0109 : type in memoryInput
    c0073 ..> c0117 : type in captureCandidateSubmission
    c0073 ..> c0125 : 4 relationships (see list)
    c0073 ..> c0165 : 2 relationships (see list)
    c0073 ..> c0202 : type in captureKnowledgePlan
    c0073 ..> c0228 : 10 relationships (see list)
    c0073 ..> c0261 : 7 relationships (see list)
    c0073 ..> c0270 : snapshotForPersistence() calls sanitizeCaptureSnapshot()
    c0073 ..> c0274 : errorMessage() calls inspect()
    c0075 --> c0076 : field instance
    c0075 --> c0079 : field model
    c0075 --> c0083 : field prompts
    c0075 --> c0084 : field scopeSource
    c0075 --> c0085 : field verbosity
    c0075 --> c0088 : field captureMode
    c0075 --> c0122 : field scope
    c0075 --> c0211 : field logging
    c0086 ..> c0008 : 2 relationships (see list)
    c0086 ..> c0065 : resolveLogDirectory() calls resolve()
    c0086 ..> c0075 : type in loadForgetfulConfig
    c0086 ..> c0077 : 2 relationships (see list)
    c0086 ..> c0078 : type in loadForgetfulConfig
    c0086 ..> c0079 : 2 relationships (see list)
    c0086 ..> c0081 : 2 relationships (see list)
    c0086 ..> c0083 : 2 relationships (see list)
    c0086 ..> c0084 : type in resolveScope
    c0086 ..> c0085 : 2 relationships (see list)
    c0086 ..> c0086 : 33 relationships (see list)
    c0086 ..> c0088 : type in resolveCaptureMode
    c0086 ..> c0122 : 2 relationships (see list)
    c0086 ..> c0192 : 2 relationships (see list)
    c0086 ..> c0211 : type in isFileLogLevel
    c0086 ..> c0212 : writeJson() calls close()
    c0086 ..> c0261 : 4 relationships (see list)
    c0089 --> c0087 : field historySummary
    c0089 --> c0088 : field mode
    c0089 --> c0102 : field entries
    c0089 --> c0122 : field scope
    c0089 --> c0125 : field context
    c0090 --|> c0091 : inherits
    c0091 --|> c0121 : inherits
    c0094 --|> c0095 : inherits
    c0095 --|> c0121 : inherits
    c0097 --|> c0098 : inherits
    c0098 --> c0101 : field entity_type
    c0098 --|> c0121 : inherits
    c0099 --|> c0100 : inherits
    c0100 --|> c0121 : inherits
    c0104 --> c0105 : field knowledge
    c0104 ..> c0107 : 2 relationships (see list)
    c0104 ..> c0108 : type in create
    c0104 ..> c0109 : type in create
    c0104 ..> c0111 : type in queryMemory
    c0104 ..> c0119 : 3 relationships (see list)
    c0104 ..> c0120 : type in createProject
    c0104 ..> c0123 : 2 relationships (see list)
    c0105 ..> c0090 : 3 relationships (see list)
    c0105 ..> c0091 : 2 relationships (see list)
    c0105 ..> c0092 : type in listCodeArtifacts
    c0105 ..> c0094 : 3 relationships (see list)
    c0105 ..> c0095 : 2 relationships (see list)
    c0105 ..> c0096 : type in listDocuments
    c0105 ..> c0097 : 4 relationships (see list)
    c0105 ..> c0098 : 2 relationships (see list)
    c0105 ..> c0099 : 2 relationships (see list)
    c0105 ..> c0100 : type in createRelationship
    c0105 ..> c0103 : type in listFiles
    c0105 ..> c0107 : type in updateMemory
    c0105 ..> c0109 : type in updateMemory
    c0105 ..> c0124 : type in getFile
    c0106 --> c0107 : field memory
    c0107 --|> c0109 : inherits
    c0110 ..> c0115 : 2 relationships (see list)
    c0111 --> c0106 : field linked_memories
    c0111 --> c0107 : field primary_memories
    c0115 --> c0093 : field onConversationCompacted
    c0115 --> c0114 : field readTools
    c0115 --> c0117 : field submission
    c0124 --|> c0103 : inherits
    c0125 --> c0119 : field project
    c0130 --|> c0131 : inherits
    c0131 --> c0126 : field status
    c0133 --> c0129 : field criteria
    c0133 --|> c0134 : inherits
    c0134 --> c0136 : field priority
    c0134 --> c0137 : field state
    c0135 --|> c0134 : inherits
    c0138 ..> c0128 : type in taskCounts
    c0138 ..> c0131 : type in sortPlans
    c0138 ..> c0132 : type in mappedProject
    c0138 ..> c0135 : 2 relationships (see list)
    c0142 --> c0139 : field outcome
    c0142 --> c0143 : field state
    c0144 ..> c0045 : type in checkpoint
    c0144 ..> c0046 : type in checkpoint
    c0144 ..> c0089 : type in enqueue
    c0144 ..> c0102 : type in resolveConflict
    c0147 --> c0119 : field projects
    c0147 --|> c0125 : inherits
    c0148 --> c0075 : 2 relationships (see list)
    c0148 --> c0104 : 4 relationships (see list)
    c0148 --> c0144 : 2 relationships (see list)
    c0148 --> c0147 : field resolveWorkContext
    c0148 --> c0156 : 2 relationships (see list)
    c0148 --> c0224 : 2 relationships (see list)
    c0149 --> c0078 : field config
    c0149 --> c0148 : field dependencies
    c0149 --> c0151 : field policies
    c0152 --> c0075 : field config
    c0152 --> c0104 : field client
    c0152 --> c0147 : field context
    c0152 --> c0156 : field recall
    c0152 --> c0212 : field logger
    c0152 --> c0224 : field model
    c0153 --> c0122 : field scope
    c0155 --> c0157 : field runtime
    c0155 --> c0255 : 2 relationships (see list)
    c0156 ..> c0102 : type in recall
    c0156 ..> c0252 : type in deeper
    c0156 ..> c0254 : type in recall
    c0156 ..> c0255 : 2 relationships (see list)
    c0157 --> c0004 : field activity
    c0157 --> c0021 : field planning
    c0157 --> c0043 : field captureDeferrals
    c0157 --> c0046 : field recoveryResult
    c0157 --> c0075 : field config
    c0157 --> c0104 : field client
    c0157 --> c0143 : field pendingCaptureJobs
    c0157 --> c0144 : field capture
    c0157 --> c0147 : field context
    c0157 --> c0153 : field lastRecall
    c0157 --> c0156 : field recall
    c0157 --> c0212 : field logger
    c0157 --> c0224 : field model
    c0157 --> c0232 : field queue
    c0159 --> c0140 : field automaticRecalls
    c0159 --> c0150 : field pendingQueuedRecall
    c0159 --> c0155 : field recallJobs
    c0159 --> c0157 : 2 relationships (see list)
    c0160 ..> c0004 : 3 relationships (see list)
    c0160 ..> c0008 : createForgetfulExtension() calls setPromptActive()
    c0160 ..> c0046 : 2 relationships (see list)
    c0160 ..> c0065 : 5 relationships (see list)
    c0160 ..> c0075 : 5 relationships (see list)
    c0160 ..> c0079 : type in parseSelection
    c0160 ..> c0085 : type in log
    c0160 ..> c0102 : type in recallContextEntries
    c0160 ..> c0139 : 3 relationships (see list)
    c0160 ..> c0141 : type in boundedWait
    c0160 ..> c0142 : 3 relationships (see list)
    c0160 ..> c0144 : type in readCaptureOutcome
    c0160 ..> c0146 : type in collectDiagnosticParts
    c0160 ..> c0147 : 3 relationships (see list)
    c0160 ..> c0149 : type in createForgetfulExtension
    c0160 ..> c0151 : type in policyText
    c0160 ..> c0153 : type in recallActivitySummary
    c0160 ..> c0157 : 3 relationships (see list)
    c0160 ..> c0158 : type in promptSetupAuthentication
    c0160 ..> c0160 : 34 relationships (see list)
    c0160 ..> c0161 : createForgetfulExtension() calls registerForegroundTool()
    c0160 ..> c0165 : 4 relationships (see list)
    c0160 ..> c0227 : 3 relationships (see list)
    c0160 ..> c0228 : 13 relationships (see list)
    c0160 ..> c0255 : 5 relationships (see list)
    c0160 ..> c0261 : 8 relationships (see list)
    c0160 ..> c0262 : qualifiedRepository() calls repositoryName()
    c0162 ..> c0090 : 2 relationships (see list)
    c0162 ..> c0091 : 2 relationships (see list)
    c0162 ..> c0092 : type in listCodeArtifacts
    c0162 ..> c0094 : 2 relationships (see list)
    c0162 ..> c0095 : 2 relationships (see list)
    c0162 ..> c0096 : type in listDocuments
    c0162 ..> c0097 : 3 relationships (see list)
    c0162 ..> c0098 : 2 relationships (see list)
    c0162 ..> c0099 : type in getRelationships
    c0162 ..> c0100 : type in createRelationship
    c0162 ..> c0103 : type in listFiles
    c0162 ..|> c0105 : implements
    c0162 --> c0107 : field parseMemory
    c0162 ..> c0107 : type in constructor
    c0162 ..> c0109 : type in updateMemory
    c0162 ..> c0124 : type in getFile
    c0162 --> c0163 : field request
    c0162 ..> c0163 : type in constructor
    c0162 ..> c0164 : 45 relationships (see list)
    c0162 ..> c0169 : 21 relationships (see list)
    c0162 ..> c0170 : 4 relationships (see list)
    c0162 ..> c0172 : 2 relationships (see list)
    c0164 ..> c0090 : type in artifact
    c0164 ..> c0091 : type in resourceBody
    c0164 ..> c0092 : type in summary
    c0164 ..> c0094 : type in document
    c0164 ..> c0095 : type in resourceBody
    c0164 ..> c0096 : type in summary
    c0164 ..> c0097 : type in entity
    c0164 ..> c0098 : type in entityBody
    c0164 ..> c0099 : type in relationship
    c0164 ..> c0100 : type in relationshipBody
    c0164 ..> c0103 : type in fileSummary
    c0164 ..> c0121 : type in provenance
    c0164 ..> c0164 : 40 relationships (see list)
    c0164 ..> c0170 : 8 relationships (see list)
    c0164 ..> c0261 : text() calls trim()
    c0165 ..> c0004 : listProjects() calls set()
    c0165 ..|> c0104 : implements
    c0165 ..> c0107 : 2 relationships (see list)
    c0165 ..> c0108 : type in create
    c0165 ..> c0109 : type in create
    c0165 ..> c0111 : type in queryMemory
    c0165 ..> c0119 : 3 relationships (see list)
    c0165 ..> c0120 : type in createProject
    c0165 ..> c0123 : 2 relationships (see list)
    c0165 ..> c0164 : 3 relationships (see list)
    c0165 ..> c0165 : 2 relationships (see list)
    c0165 --|> c0169 : inherits
    c0165 ..> c0169 : 10 relationships (see list)
    c0165 ..> c0170 : 4 relationships (see list)
    c0165 ..> c0172 : 18 relationships (see list)
    c0165 ..> c0262 : 2 relationships (see list)
    c0169 ..> c0004 : readResponse() calls set()
    c0169 ..> c0005 : readResponse() calls read()
    c0169 ..> c0165 : readResponse() calls get()
    c0169 ..> c0166 : type in constructor
    c0169 ..> c0168 : throwResponseError() constructs ForgetfulHttpError
    c0169 ..> c0169 : 8 relationships (see list)
    c0169 ..> c0170 : readResponse() constructs ForgetfulSchemaError
    c0169 ..> c0171 : request() constructs ForgetfulTimeoutError
    c0169 ..> c0172 : 4 relationships (see list)
    c0169 ..> c0232 : readResponse() calls cancel()
    c0172 ..> c0004 : uniqueMemories() calls set()
    c0172 ..> c0106 : type in parseLinkedMemories
    c0172 ..> c0107 : 3 relationships (see list)
    c0172 ..> c0111 : 2 relationships (see list)
    c0172 ..> c0119 : type in parseProject
    c0172 ..> c0123 : type in searchBody
    c0172 ..> c0164 : parseMemory() calls memoryMetadata()
    c0172 ..> c0167 : 2 relationships (see list)
    c0172 ..> c0170 : 12 relationships (see list)
    c0172 ..> c0172 : 23 relationships (see list)
    c0172 ..> c0261 : projectText() calls trim()
    c0173 --> c0090 : field artifacts
    c0173 --> c0094 : field documents
    c0173 --> c0103 : field files
    c0174 --|> c0175 : inherits
    c0174 --> c0176 : field failures
    c0175 --> c0107 : field memories
    c0175 --> c0122 : field scope
    c0177 ..> c0004 : 3 relationships (see list)
    c0177 ..> c0090 : type in appendArtifactLines
    c0177 ..> c0094 : type in appendDocumentLines
    c0177 ..> c0097 : 9 relationships (see list)
    c0177 ..> c0099 : 3 relationships (see list)
    c0177 ..> c0103 : type in appendFileLines
    c0177 --> c0105 : field client
    c0177 ..> c0105 : type in constructor
    c0177 ..> c0162 : 8 relationships (see list)
    c0177 ..> c0165 : formatRelationships() calls get()
    c0177 ..> c0173 : 2 relationships (see list)
    c0177 ..> c0174 : 8 relationships (see list)
    c0177 ..> c0175 : 2 relationships (see list)
    c0177 ..> c0176 : 3 relationships (see list)
    c0177 ..> c0177 : 17 relationships (see list)
    c0177 ..> c0178 : type in constructor
    c0177 ..> c0179 : 4 relationships (see list)
    c0177 --> c0180 : field readMemory
    c0177 ..> c0180 : type in constructor
    c0177 ..> c0181 : 4 relationships (see list)
    c0177 ..> c0182 : 22 relationships (see list)
    c0177 ..> c0228 : expand() calls errorMessage()
    c0177 ..> c0261 : findEntities() calls trim()
    c0178 --> c0180 : field readMemory
    c0179 --> c0097 : field entity
    c0181 --> c0097 : 2 relationships (see list)
    c0181 --> c0099 : field relationship
    c0182 ..> c0097 : 2 relationships (see list)
    c0182 ..> c0099 : type in validRelationship
    c0182 ..> c0107 : type in validMemory
    c0182 ..> c0122 : 2 relationships (see list)
    c0182 ..> c0174 : type in safeCall
    c0182 ..> c0182 : 5 relationships (see list)
    c0182 ..> c0228 : 3 relationships (see list)
    c0182 ..> c0261 : validRelationship() calls trim()
    c0183 --> c0104 : field client
    c0183 --> c0105 : field knowledge
    c0183 --> c0184 : field request
    c0183 --> c0185 : field context
    c0185 --> c0122 : field scope
    c0186 --> c0124 : field file
    c0186 --> c0190 : field content
    c0186 --> c0191 : field content
    c0187 --> c0104 : field client
    c0187 --> c0105 : field knowledge
    c0187 --> c0185 : field context
    c0187 --> c0188 : field request
    c0192 ..> c0090 : type in page
    c0192 ..> c0094 : type in page
    c0192 ..> c0097 : 4 relationships (see list)
    c0192 ..> c0101 : type in isEntityType
    c0192 ..> c0104 : 7 relationships (see list)
    c0192 ..> c0105 : 9 relationships (see list)
    c0192 ..> c0107 : 4 relationships (see list)
    c0192 ..> c0121 : type in updateProvenance
    c0192 ..> c0124 : type in fileContent
    c0192 ..> c0162 : 28 relationships (see list)
    c0192 ..> c0165 : 10 relationships (see list)
    c0192 ..> c0183 : 15 relationships (see list)
    c0192 ..> c0184 : 2 relationships (see list)
    c0192 ..> c0185 : 13 relationships (see list)
    c0192 ..> c0186 : 29 relationships (see list)
    c0192 ..> c0187 : 9 relationships (see list)
    c0192 ..> c0188 : 2 relationships (see list)
    c0192 ..> c0189 : type in resolveWriteProject
    c0192 ..> c0190 : type in fileContent
    c0192 ..> c0191 : type in fileContent
    c0192 ..> c0192 : 176 relationships (see list)
    c0192 ..> c0214 : replacementMemory() calls replacementMemoryContext()
    c0192 ..> c0228 : containsSensitiveData() calls hasSensitiveData()
    c0192 ..> c0261 : 2 relationships (see list)
    c0194 --> c0091 : field input
    c0195 --> c0095 : field input
    c0197 --> c0098 : field input
    c0199 --> c0100 : field input
    c0202 --> c0194 : field codeArtifacts
    c0202 --> c0195 : field documents
    c0202 --> c0196 : field entityMemoryLinks
    c0202 --> c0197 : field entities
    c0202 --> c0199 : field relationships
    c0205 --> c0203 : 4 relationships (see list)
    c0206 ..> c0090 : type in writeCodeArtifact
    c0206 ..> c0094 : type in writeDocument
    c0206 ..> c0097 : type in writeEntity
    c0206 ..> c0099 : type in writeRelationship
    c0206 ..> c0107 : 3 relationships (see list)
    c0206 ..> c0162 : 10 relationships (see list)
    c0206 ..> c0165 : createOnce() calls create()
    c0206 ..> c0177 : attachmentMemory() calls readMemory()
    c0206 ..> c0193 : 4 relationships (see list)
    c0206 ..> c0194 : type in writeCodeArtifact
    c0206 ..> c0195 : type in writeDocument
    c0206 ..> c0196 : type in writeEntityMemoryLink
    c0206 ..> c0197 : type in writeEntity
    c0206 --> c0198 : field readMemory
    c0206 ..> c0198 : type in constructor
    c0206 ..> c0199 : type in writeRelationship
    c0206 ..> c0200 : type in execute
    c0206 ..> c0201 : 16 relationships (see list)
    c0206 ..> c0202 : 18 relationships (see list)
    c0206 ..> c0204 : 16 relationships (see list)
    c0206 ..> c0205 : 18 relationships (see list)
    c0206 ..> c0206 : 27 relationships (see list)
    c0206 ..> c0207 : 4 relationships (see list)
    c0206 --> c0208 : field client
    c0206 ..> c0208 : type in constructor
    c0206 ..> c0209 : 30 relationships (see list)
    c0206 ..> c0228 : 2 relationships (see list)
    c0206 ..> c0274 : 2 relationships (see list)
    c0209 ..> c0004 : resourceSlots() calls set()
    c0209 ..> c0165 : resourceSlots() calls get()
    c0209 ..> c0202 : type in instructionId
    c0209 ..> c0203 : 4 relationships (see list)
    c0209 ..> c0205 : 2 relationships (see list)
    c0209 ..> c0207 : type in resourceSlots
    c0209 ..> c0209 : 6 relationships (see list)
    c0212 ..> c0065 : flush() calls resolve()
    c0212 ..|> c0210 : implements
    c0212 --> c0211 : 2 relationships (see list)
    c0212 ..> c0211 : 2 relationships (see list)
    c0212 ..> c0212 : 6 relationships (see list)
    c0212 ..> c0213 : 3 relationships (see list)
    c0212 ..> c0228 : enqueue() calls sanitizeValue()
    c0213 ..> c0011 : pruneDirectory() calls current()
    c0213 ..> c0213 : 2 relationships (see list)
    c0214 ..> c0109 : type in replacementMemoryInput
    c0214 ..> c0214 : replacementMemoryInput() calls replacementMemoryContext()
    c0214 ..> c0228 : storedMemoryContext() calls sanitizeText()
    c0217 --> c0219 : field complete
    c0218 ..> c0065 : applySummary() calls now()
    c0218 --> c0215 : field compactedHistory
    c0218 ..> c0215 : 5 relationships (see list)
    c0218 ..> c0218 : 6 relationships (see list)
    c0218 ..> c0219 : 3 relationships (see list)
    c0218 ..> c0220 : 9 relationships (see list)
    c0218 ..> c0261 : applySummary() calls trim()
    c0220 ..> c0065 : summarizeMemoryHistory() calls now()
    c0220 ..> c0112 : type in evidencePageContent
    c0220 ..> c0216 : 2 relationships (see list)
    c0220 ..> c0217 : type in summarizeMemoryHistory
    c0220 ..> c0220 : 18 relationships (see list)
    c0220 ..> c0224 : summarizeMemoryHistory() calls complete()
    c0220 ..> c0228 : 2 relationships (see list)
    c0222 --> c0223 : field modelRegistry
    c0224 ..> c0065 : 6 relationships (see list)
    c0224 ..> c0074 : completeWithSubmission() calls mapConcurrent()
    c0224 --> c0079 : field selection
    c0224 ..> c0079 : type in constructor
    c0224 ..> c0086 : completeRequest() calls isRecallConcurrency()
    c0224 ..|> c0110 : implements
    c0224 ..> c0114 : type in executeRead
    c0224 ..> c0115 : 7 relationships (see list)
    c0224 ..> c0116 : completeWithSubmission() constructs ModelSubmissionError
    c0224 ..> c0117 : type in validateSubmission
    c0224 ..> c0206 : executeRead() calls execute()
    c0224 --> c0210 : field logger
    c0224 ..> c0212 : 5 relationships (see list)
    c0224 ..> c0218 : 3 relationships (see list)
    c0224 ..> c0220 : 2 relationships (see list)
    c0224 --> c0221 : field transformHeaders
    c0224 --> c0223 : field registry
    c0224 ..> c0223 : type in constructor
    c0224 ..> c0224 : 7 relationships (see list)
    c0224 ..> c0225 : type in constructor
    c0224 ..> c0226 : 3 relationships (see list)
    c0224 ..> c0227 : 24 relationships (see list)
    c0224 ..> c0228 : 2 relationships (see list)
    c0225 --> c0210 : field logger
    c0225 --> c0221 : field transformHeaders
    c0227 ..> c0065 : 2 relationships (see list)
    c0227 ..> c0079 : 3 relationships (see list)
    c0227 ..> c0114 : type in submissionTool
    c0227 ..> c0115 : 4 relationships (see list)
    c0227 ..> c0117 : type in submissionTool
    c0227 ..> c0221 : type in requestOptions
    c0227 ..> c0222 : type in availableMemoryModels
    c0227 ..> c0223 : type in resolveMemoryModel
    c0227 ..> c0224 : 3 relationships (see list)
    c0227 ..> c0225 : type in resolveMemoryModel
    c0227 ..> c0226 : type in requestDeadline
    c0227 ..> c0227 : 7 relationships (see list)
    c0227 ..> c0228 : 8 relationships (see list)
    c0228 ..> c0228 : 4 relationships (see list)
    c0228 ..> c0274 : diagnosticMessage() calls inspect()
    c0231 ..> c0104 : 3 relationships (see list)
    c0231 ..> c0119 : 4 relationships (see list)
    c0231 ..> c0120 : 2 relationships (see list)
    c0231 ..> c0160 : promptExistingProject() calls notify()
    c0231 ..> c0165 : 7 relationships (see list)
    c0231 ..> c0228 : 2 relationships (see list)
    c0231 ..> c0229 : 2 relationships (see list)
    c0231 ..> c0230 : 6 relationships (see list)
    c0231 ..> c0231 : 5 relationships (see list)
    c0231 ..> c0261 : 3 relationships (see list)
    c0232 ..> c0004 : mutate() calls set()
    c0232 ..> c0008 : 9 relationships (see list)
    c0232 ..> c0089 : 4 relationships (see list)
    c0232 ..> c0093 : type in compactJobSnapshot
    c0232 ..> c0102 : type in appendInspections
    c0232 ..> c0119 : type in completeProjectDiscovery
    c0232 ..> c0125 : 2 relationships (see list)
    c0232 ..> c0165 : 2 relationships (see list)
    c0232 ..> c0192 : 4 relationships (see list)
    c0232 ..> c0228 : 2 relationships (see list)
    c0232 ..> c0232 : 97 relationships (see list)
    c0232 ..> c0233 : type in constructor
    c0232 ..> c0234 : 2 relationships (see list)
    c0232 ..> c0236 : 5 relationships (see list)
    c0232 ..> c0237 : 3 relationships (see list)
    c0232 ..> c0238 : 2 relationships (see list)
    c0232 ..> c0239 : 2 relationships (see list)
    c0232 ..> c0240 : 9 relationships (see list)
    c0232 ..> c0241 : 11 relationships (see list)
    c0232 ..> c0242 : type in listJobMetadata
    c0232 ..> c0244 : 9 relationships (see list)
    c0232 ..> c0245 : 5 relationships (see list)
    c0232 ..> c0246 : 3 relationships (see list)
    c0232 ..> c0247 : 6 relationships (see list)
    c0232 ..> c0249 : 2 relationships (see list)
    c0232 ..> c0250 : 70 relationships (see list)
    c0232 ..> c0261 : reusableHistory() calls trim()
    c0232 ..> c0270 : 5 relationships (see list)
    c0236 --> c0102 : field replacement
    c0236 --> c0109 : field replacement
    c0236 --> c0125 : field context
    c0236 --> c0240 : field binding
    c0236 --> c0248 : field supersession
    c0238 --> c0093 : field compactedConversation
    c0238 --> c0102 : field inspectionEntries
    c0238 --> c0243 : field status
    c0238 --> c0248 : field supersession
    c0241 --> c0089 : field snapshot
    c0241 --> c0240 : field binding
    c0241 --> c0243 : field status
    c0241 --> c0248 : field supersession
    c0242 --> c0089 : field snapshot
    c0244 --> c0236 : field conflicts
    c0244 --> c0245 : field watermarks
    c0244 --> c0247 : field jobs
    c0245 --> c0235 : field historyAlternatives
    c0247 --|> c0241 : inherits
    c0250 ..> c0089 : 3 relationships (see list)
    c0250 ..> c0102 : type in validateInspectionEntry
    c0250 ..> c0165 : releaseCompletedArtifacts() calls get()
    c0250 ..> c0228 : scrubDiagnostic() calls sanitizeText()
    c0250 ..> c0232 : nowIso() calls now()
    c0250 ..> c0235 : 2 relationships (see list)
    c0250 ..> c0236 : type in conflictIdentityMatches
    c0250 ..> c0240 : 2 relationships (see list)
    c0250 ..> c0241 : 2 relationships (see list)
    c0250 ..> c0244 : type in normaliseState
    c0250 ..> c0245 : 3 relationships (see list)
    c0250 ..> c0247 : type in releaseCompletedArtifacts
    c0250 ..> c0250 : 6 relationships (see list)
    c0252 --> c0119 : field projects
    c0252 --> c0122 : field scope
    c0252 --> c0125 : field context
    c0254 --> c0102 : field sessionContext
    c0254 --> c0115 : field diagnosticContext
    c0254 --> c0119 : field projects
    c0254 --> c0122 : field scope
    c0254 --> c0125 : field context
    c0254 --> c0253 : field onPlan
    c0255 --> c0122 : field scope
    c0256 ..> c0011 : resultWithKnowledge() calls visible()
    c0256 ..> c0074 : searchMemories() calls mapConcurrent()
    c0256 ..> c0086 : 3 relationships (see list)
    c0256 --> c0104 : field client
    c0256 ..> c0104 : type in constructor
    c0256 ..> c0107 : 2 relationships (see list)
    c0256 --> c0110 : field model
    c0256 ..> c0110 : type in constructor
    c0256 ..> c0114 : type in recallReadTool
    c0256 ..> c0119 : 2 relationships (see list)
    c0256 ..> c0122 : 7 relationships (see list)
    c0256 ..> c0123 : type in searchRequest
    c0256 ..> c0125 : 3 relationships (see list)
    c0256 ..> c0165 : 3 relationships (see list)
    c0256 ..> c0176 : 2 relationships (see list)
    c0256 --> c0177 : field knowledge
    c0256 ..> c0177 : 2 relationships (see list)
    c0256 ..> c0192 : recallReadTool() calls executeKnowledgeRead()
    c0256 ..> c0224 : recall() calls complete()
    c0256 ..> c0228 : 9 relationships (see list)
    c0256 ..> c0251 : 4 relationships (see list)
    c0256 ..> c0252 : type in deeper
    c0256 ..> c0253 : 5 relationships (see list)
    c0256 ..> c0254 : 7 relationships (see list)
    c0256 ..> c0255 : 7 relationships (see list)
    c0256 ..> c0256 : 34 relationships (see list)
    c0256 ..> c0257 : type in constructor
    c0256 ..> c0258 : finishReview() constructs ReviewValidationError
    c0256 ..> c0259 : 6 relationships (see list)
    c0256 ..> c0260 : type in searchMemories
    c0256 ..> c0261 : 35 relationships (see list)
    c0259 --> c0119 : field project
    c0260 --> c0107 : field memories
    c0261 ..> c0004 : availableProjects() calls set()
    c0261 ..> c0107 : 2 relationships (see list)
    c0261 ..> c0117 : type in recallReviewSubmission
    c0261 ..> c0119 : type in availableProjects
    c0261 ..> c0125 : 3 relationships (see list)
    c0261 ..> c0176 : type in formatRecall
    c0261 ..> c0228 : 11 relationships (see list)
    c0261 ..> c0251 : 2 relationships (see list)
    c0261 ..> c0253 : type in parsePlan
    c0261 ..> c0255 : 4 relationships (see list)
    c0261 ..> c0256 : createDeadlineSignal() calls now()
    c0261 ..> c0261 : 26 relationships (see list)
    c0262 ..> c0261 : repositoryName() calls trim()
    c0264 ..> c0263 : 2 relationships (see list)
    c0265 --|> c0089 : inherits
    c0267 --> c0088 : field mode
    c0267 --> c0122 : field scope
    c0267 --> c0125 : field context
    c0267 --> c0269 : field session
    c0268 --> c0265 : field snapshot
    c0270 ..> c0087 : 2 relationships (see list)
    c0270 ..> c0089 : 4 relationships (see list)
    c0270 ..> c0093 : type in compactCaptureSnapshot
    c0270 ..> c0102 : 3 relationships (see list)
    c0270 ..> c0228 : 9 relationships (see list)
    c0270 ..> c0261 : 2 relationships (see list)
    c0270 ..> c0266 : 3 relationships (see list)
    c0270 ..> c0267 : 3 relationships (see list)
    c0270 ..> c0268 : type in buildCaptureSnapshot
    c0270 ..> c0270 : 27 relationships (see list)
    c0273 --> c0271 : 2 relationships (see list)
    c0274 ..> c0004 : readFile() calls close()
    c0274 ..> c0008 : readFile() calls open()
    c0274 ..> c0065 : 3 relationships (see list)
    c0274 ..> c0165 : getUrl() calls get()
    c0274 ..> c0192 : readFile() calls readFile()
    c0274 ..> c0206 : git() calls execute()
    c0274 ..> c0228 : 3 relationships (see list)
    c0274 ..> c0261 : provenance() calls trim()
    c0274 ..> c0272 : type in inspectUrl
    c0274 ..> c0273 : 2 relationships (see list)
    c0274 ..> c0274 : 10 relationships (see list)
    c0274 --> c0275 : field options
    c0274 ..> c0275 : type in constructor
    c0274 ..> c0276 : 11 relationships (see list)
    c0276 ..> c0228 : 4 relationships (see list)
    c0276 ..> c0271 : type in errorDetails
    c0276 ..> c0272 : type in sourceContent
    c0276 ..> c0274 : validateAddress() calls check()
    c0276 ..> c0276 : validateAddress() calls loopback()
```

## Source index

- c0000: `index.ts` — `index.ts`:1
- c0003: `ActivityLoader` — `src/activity.ts`:6
- c0004: `ForgetfulActivity` — `src/activity.ts`:35
- c0005: `ApiPlanningReader` — `src/adapters/forgetful/planning.ts`:67
- c0006: `src/adapters/forgetful/planning.ts` — `src/adapters/forgetful/planning.ts`:1
- c0007: `LocalPlanningPreferences` — `src/adapters/local/planning-settings.ts`:5
- c0008: `PiPlanningView` — `src/adapters/pi/planning.ts`:276
- c0009: `PlanBrowser` — `src/adapters/pi/planning.ts`:91
- c0010: `src/adapters/pi/planning.ts` — `src/adapters/pi/planning.ts`:1
- c0011: `PlanningController` — `src/application/planning.ts`:18
- c0012: `PlanningControllerOptions` — `src/application/planning.ts`:7
- c0013: `PlanningClock` — `src/application/ports/planning.ts`:32
- c0014: `PlanningError` — `src/application/ports/planning.ts`:6
- c0015: `PlanningPlanTasks` — `src/application/ports/planning.ts`:37
- c0016: `PlanningPreferences` — `src/application/ports/planning.ts`:27
- c0017: `PlanningReader` — `src/application/ports/planning.ts`:16
- c0018: `PlanningResult` — `src/application/ports/planning.ts`:13
- c0019: `PlanningState` — `src/application/ports/planning.ts`:45
- c0020: `PlanningWorkflow` — `src/application/ports/planning.ts`:72
- c0021: `PlanningRuntime` — `src/bootstrap/planning.ts`:60
- c0022: `src/bootstrap/planning.ts` — `src/bootstrap/planning.ts`:1
- c0023: `CaptureCorrectionCycle` — `src/capture-feedback.ts`:6
- c0024: `CaptureSelectionError` — `src/capture-feedback.ts`:15
- c0025: `src/capture-feedback.ts` — `src/capture-feedback.ts`:1
- c0026: `CaptureLinkReview` — `src/capture-links.ts`:43
- c0027: `ConnectionResult` — `src/capture-links.ts`:61
- c0028: `LinkDecision` — `src/capture-links.ts`:15
- c0029: `PreservationDecision` — `src/capture-links.ts`:25
- c0030: `PreviousConnections` — `src/capture-links.ts`:33
- c0031: `src/capture-links.ts` — `src/capture-links.ts`:1
- c0032: `MergeAccess` — `src/capture-merge.ts`:41
- c0033: `MergeConnections` — `src/capture-merge.ts`:5
- c0034: `MergeExecution` — `src/capture-merge.ts`:47
- c0035: `MergeWriteUncertain` — `src/capture-merge.ts`:16
- c0036: `src/capture-merge.ts` — `src/capture-merge.ts`:1
- c0037: `CandidateExtraction` — `src/capture.ts`:737
- c0038: `CandidateValidation` — `src/capture.ts`:663
- c0039: `CaptureAction` — `src/capture.ts`:76
- c0040: `CaptureActivityPhase` — `src/capture.ts`:174
- c0041: `CaptureAdvanceInput` — `src/capture.ts`:320
- c0042: `CaptureBatchInput` — `src/capture.ts`:135
- c0043: `CaptureBranch` — `src/capture.ts`:201
- c0044: `CaptureCandidate` — `src/capture.ts`:78
- c0045: `CaptureCheckpointOptions` — `src/capture.ts`:206
- c0046: `CaptureCheckpointResult` — `src/capture.ts`:212
- c0047: `CaptureCodeArtifactResource` — `src/capture.ts`:112
- c0048: `CaptureDecision` — `src/capture.ts`:142
- c0049: `CaptureDiagnosticCandidate` — `src/capture.ts`:225
- c0050: `CaptureDiagnosticConflict` — `src/capture.ts`:253
- c0051: `CaptureDiagnosticJob` — `src/capture.ts`:241
- c0052: `CaptureDiagnostics` — `src/capture.ts`:264
- c0053: `CaptureDocumentResource` — `src/capture.ts`:108
- c0054: `CaptureEnqueueResult` — `src/capture.ts`:269
- c0055: `CaptureEntityResource` — `src/capture.ts`:104
- c0056: `CaptureMergePlan` — `src/capture.ts`:159
- c0057: `CaptureNeighborhood` — `src/capture.ts`:127
- c0058: `CaptureOperation` — `src/capture.ts`:362
- c0059: `CapturePause` — `src/capture.ts`:328
- c0060: `CapturePendingConflict` — `src/capture.ts`:315
- c0061: `CaptureProgress` — `src/capture.ts`:352
- c0062: `CaptureRelationshipResource` — `src/capture.ts`:116
- c0063: `CaptureResolveResult` — `src/capture.ts`:309
- c0064: `CaptureResourceReuse` — `src/capture.ts`:120
- c0065: `CaptureService` — `src/capture.ts`:1141
- c0066: `CaptureServiceOptions` — `src/capture.ts`:176
- c0067: `CaptureUncertainWrite` — `src/capture.ts`:350
- c0068: `ConflictResolutionEvidence` — `src/capture.ts`:275
- c0069: `ConflictResolutionTarget` — `src/capture.ts`:292
- c0070: `InvalidCaptureOutput` — `src/capture.ts`:335
- c0071: `MissingCaptureDestination` — `src/capture.ts`:342
- c0072: `ResolveConflictInput` — `src/capture.ts`:298
- c0073: `src/capture.ts` — `src/capture.ts`:1
- c0074: `src/concurrency.ts` — `src/concurrency.ts`:1
- c0075: `ForgetfulConfig` — `src/config.ts`:92
- c0076: `ForgetfulInstanceConfig` — `src/config.ts`:79
- c0077: `JsonReadResult` — `src/config.ts`:149
- c0078: `LoadConfigOptions` — `src/config.ts`:115
- c0079: `ModelSelection` — `src/config.ts`:74
- c0080: `PersistedProjectSettings` — `src/config.ts`:145
- c0081: `PersistedUserSettings` — `src/config.ts`:126
- c0082: `PromptName` — `src/config.ts`:40
- c0083: `PromptOverlays` — `src/config.ts`:86
- c0084: `ScopeSource` — `src/config.ts`:39
- c0085: `Verbosity` — `src/config.ts`:59
- c0086: `src/config.ts` — `src/config.ts`:1
- c0087: `CaptureHistorySummary` — `src/contracts.ts`:315
- c0088: `CaptureMode` — `src/contracts.ts`:2
- c0089: `CaptureSnapshot` — `src/contracts.ts`:326
- c0090: `CodeArtifact` — `src/contracts.ts`:93
- c0091: `CodeArtifactInput` — `src/contracts.ts`:84
- c0092: `CodeArtifactSummary` — `src/contracts.ts`:98
- c0093: `CompactedConversation` — `src/contracts.ts`:320
- c0094: `Document` — `src/contracts.ts`:77
- c0095: `DocumentInput` — `src/contracts.ts`:68
- c0096: `DocumentSummary` — `src/contracts.ts`:82
- c0097: `Entity` — `src/contracts.ts`:53
- c0098: `EntityInput` — `src/contracts.ts`:43
- c0099: `EntityRelationship` — `src/contracts.ts`:64
- c0100: `EntityRelationshipInput` — `src/contracts.ts`:58
- c0101: `EntityType` — `src/contracts.ts`:41
- c0102: `EvidenceEntry` — `src/contracts.ts`:305
- c0103: `FileSummary` — `src/contracts.ts`:100
- c0104: `ForgetfulClient` — `src/contracts.ts`:189
- c0105: `KnowledgeClient` — `src/contracts.ts`:115
- c0106: `LinkedMemory` — `src/contracts.ts`:157
- c0107: `Memory` — `src/contracts.ts`:145
- c0108: `MemoryCreateResult` — `src/contracts.ts`:183
- c0109: `MemoryInput` — `src/contracts.ts`:17
- c0110: `MemoryModelClient` — `src/contracts.ts`:289
- c0111: `MemorySearchResult` — `src/contracts.ts`:163
- c0112: `ModelEvidencePage` — `src/contracts.ts`:245
- c0113: `ModelReadErrorResult` — `src/contracts.ts`:255
- c0114: `ModelReadTool` — `src/contracts.ts`:259
- c0115: `ModelRequest` — `src/contracts.ts`:215
- c0116: `ModelSubmissionError` — `src/contracts.ts`:278
- c0117: `ModelSubmissionTool` — `src/contracts.ts`:269
- c0118: `ModelTaskPause` — `src/contracts.ts`:267
- c0119: `Project` — `src/contracts.ts`:4
- c0120: `ProjectInput` — `src/contracts.ts`:11
- c0121: `Provenance` — `src/contracts.ts`:34
- c0122: `Scope` — `src/contracts.ts`:1
- c0123: `SearchRequest` — `src/contracts.ts`:172
- c0124: `StoredFile` — `src/contracts.ts`:110
- c0125: `WorkContext` — `src/contracts.ts`:295
- c0126: `PlanStatus` — `src/domain/planning.ts`:2
- c0127: `PlanningCapability` — `src/domain/planning.ts`:1
- c0128: `PlanningCounts` — `src/domain/planning.ts`:55
- c0129: `PlanningCriterion` — `src/domain/planning.ts`:41
- c0130: `PlanningPlan` — `src/domain/planning.ts`:20
- c0131: `PlanningPlanSummary` — `src/domain/planning.ts`:12
- c0132: `PlanningProject` — `src/domain/planning.ts`:6
- c0133: `PlanningTask` — `src/domain/planning.ts`:49
- c0134: `PlanningTaskRecord` — `src/domain/planning.ts`:25
- c0135: `PlanningTaskSummary` — `src/domain/planning.ts`:35
- c0136: `TaskPriority` — `src/domain/planning.ts`:4
- c0137: `TaskState` — `src/domain/planning.ts`:3
- c0138: `src/domain/planning.ts` — `src/domain/planning.ts`:1
- c0139: `AutomaticCaptureJobOutcome` — `src/extension.ts`:1048
- c0140: `AutomaticRecall` — `src/extension.ts`:431
- c0141: `BoundedWaitOutcome` — `src/extension.ts`:141
- c0142: `CaptureFeedbackItem` — `src/extension.ts`:1158
- c0143: `CaptureFeedbackState` — `src/extension.ts`:1027
- c0144: `CaptureServicePort` — `src/extension.ts`:286
- c0145: `DiagnosticCandidate` — `src/extension.ts`:884
- c0146: `DiagnosticParts` — `src/extension.ts`:897
- c0147: `ExtensionWorkContext` — `src/extension.ts`:320
- c0148: `ForgetfulExtensionDependencies` — `src/extension.ts`:324
- c0149: `ForgetfulExtensionOptions` — `src/extension.ts`:349
- c0150: `PendingQueuedRecall` — `src/extension.ts`:389
- c0151: `PolicyName` — `src/extension.ts`:277
- c0152: `PreparedRuntime` — `src/extension.ts`:444
- c0153: `RecallActivity` — `src/extension.ts`:391
- c0154: `RecallContextMessage` — `src/extension.ts`:364
- c0155: `RecallJob` — `src/extension.ts`:371
- c0156: `RecallServicePort` — `src/extension.ts`:279
- c0157: `Runtime` — `src/extension.ts`:397
- c0158: `SetupAuthentication` — `src/extension.ts`:227
- c0159: `State` — `src/extension.ts`:433
- c0160: `src/extension.ts` — `src/extension.ts`:1
- c0161: `src/foreground-tools.ts` — `src/foreground-tools.ts`:1
- c0162: `ApiKnowledgeClient` — `src/http-knowledge.ts`:199
- c0163: `KnowledgeRequest` — `src/http-knowledge.ts`:9
- c0164: `src/http-knowledge.ts` — `src/http-knowledge.ts`:1
- c0165: `ApiForgetfulClient` — `src/http.ts`:598
- c0166: `ApiForgetfulClientOptions` — `src/http.ts`:25
- c0167: `ForgetfulAbortError` — `src/http.ts`:59
- c0168: `ForgetfulHttpError` — `src/http.ts`:33
- c0169: `ForgetfulHttpTransport` — `src/http.ts`:394
- c0170: `ForgetfulSchemaError` — `src/http.ts`:45
- c0171: `ForgetfulTimeoutError` — `src/http.ts`:52
- c0172: `src/http.ts` — `src/http.ts`:1
- c0173: `Attachments` — `src/knowledge-read.ts`:51
- c0174: `ExpansionContext` — `src/knowledge-read.ts`:39
- c0175: `KnowledgeExpansionRequest` — `src/knowledge-read.ts`:19
- c0176: `KnowledgeExpansionResult` — `src/knowledge-read.ts`:27
- c0177: `KnowledgeReadService` — `src/knowledge-read.ts`:155
- c0178: `KnowledgeReadServiceOptions` — `src/knowledge-read.ts`:63
- c0179: `LinkedMemoryExpansion` — `src/knowledge-read.ts`:49
- c0180: `MemoryReader` — `src/knowledge-read.ts`:58
- c0181: `RelationshipExpansion` — `src/knowledge-read.ts`:43
- c0182: `src/knowledge-read.ts` — `src/knowledge-read.ts`:1
- c0183: `KnowledgeReadContext` — `src/knowledge-tools.ts`:630
- c0184: `KnowledgeReadRequest` — `src/knowledge-tools.ts`:169
- c0185: `KnowledgeToolContext` — `src/knowledge-tools.ts`:23
- c0186: `KnowledgeToolResult` — `src/knowledge-tools.ts`:33
- c0187: `KnowledgeWriteContext` — `src/knowledge-tools.ts`:1272
- c0188: `KnowledgeWriteRequest` — `src/knowledge-tools.ts`:170
- c0189: `ResolvedWriteProject` — `src/knowledge-tools.ts`:445
- c0190: `ToolImage` — `src/knowledge-tools.ts`:32
- c0191: `ToolText` — `src/knowledge-tools.ts`:31
- c0192: `src/knowledge-tools.ts` — `src/knowledge-tools.ts`:1
- c0193: `KnowledgeAttachmentIds` — `src/knowledge-write.ts`:128
- c0194: `KnowledgeCodeArtifactPlan` — `src/knowledge-write.ts`:44
- c0195: `KnowledgeDocumentPlan` — `src/knowledge-write.ts`:38
- c0196: `KnowledgeEntityMemoryLinkPlan` — `src/knowledge-write.ts`:58
- c0197: `KnowledgeEntityPlan` — `src/knowledge-write.ts`:32
- c0198: `KnowledgeMemoryReader` — `src/knowledge-write.ts`:108
- c0199: `KnowledgeRelationshipPlan` — `src/knowledge-write.ts`:50
- c0200: `KnowledgeWriteCheckpoint` — `src/knowledge-write.ts`:102
- c0201: `KnowledgeWriteGuard` — `src/knowledge-write.ts`:106
- c0202: `KnowledgeWritePlan` — `src/knowledge-write.ts`:62
- c0203: `KnowledgeWriteReceipt` — `src/knowledge-write.ts`:79
- c0204: `KnowledgeWriteSave` — `src/knowledge-write.ts`:113
- c0205: `KnowledgeWriteState` — `src/knowledge-write.ts`:86
- c0206: `KnowledgeWriter` — `src/knowledge-write.ts`:264
- c0207: `ResourceSlot` — `src/knowledge-write.ts`:115
- c0208: `WriteClient` — `src/knowledge-write.ts`:18
- c0209: `src/knowledge-write.ts` — `src/knowledge-write.ts`:1
- c0210: `DiagnosticLogger` — `src/logging.ts`:83
- c0211: `FileLogLevel` — `src/logging.ts`:81
- c0212: `FileLogger` — `src/logging.ts`:97
- c0213: `src/logging.ts` — `src/logging.ts`:1
- c0214: `src/memory-context.ts` — `src/memory-context.ts`:1
- c0215: `CompactedMemoryHistory` — `src/model-context.ts`:241
- c0216: `ContextWindowError` — `src/model-context.ts`:30
- c0217: `MemoryHistorySummaryOptions` — `src/model-context.ts`:377
- c0218: `MemoryTaskContext` — `src/model-context.ts`:248
- c0219: `SummaryCompletion` — `src/model-context.ts`:25
- c0220: `src/model-context.ts` — `src/model-context.ts`:1
- c0221: `MemoryModelHeaderTransform` — `src/model.ts`:45
- c0222: `ModelPickerContext` — `src/model.ts`:49
- c0223: `ModelRegistryPort` — `src/model.ts`:36
- c0224: `PiMemoryModel` — `src/model.ts`:319
- c0225: `PiMemoryModelOptions` — `src/model.ts`:59
- c0226: `RequestDeadline` — `src/model.ts`:240
- c0227: `src/model.ts` — `src/model.ts`:1
- c0228: `src/privacy.ts` — `src/privacy.ts`:1
- c0229: `AgentProjectInitInput` — `src/project-init.ts`:8
- c0230: `ProjectInitError` — `src/project-init.ts`:6
- c0231: `src/project-init.ts` — `src/project-init.ts`:1
- c0232: `DurableQueueStore` — `src/queue.ts`:511
- c0233: `DurableQueueStoreOptions` — `src/queue.ts`:193
- c0234: `FileLock` — `src/queue.ts`:225
- c0235: `HistoryCache` — `src/queue.ts`:42
- c0236: `PendingConflict` — `src/queue.ts`:103
- c0237: `QueueBusyError` — `src/queue.ts`:230
- c0238: `QueueCheckpoint` — `src/queue.ts`:179
- c0239: `QueueEnqueueResult` — `src/queue.ts`:163
- c0240: `QueueIdentity` — `src/queue.ts`:36
- c0241: `QueueJob` — `src/queue.ts`:69
- c0242: `QueueJobMetadata` — `src/queue.ts`:99
- c0243: `QueueJobStatus` — `src/queue.ts`:29
- c0244: `QueueState` — `src/queue.ts`:218
- c0245: `QueueWatermark` — `src/queue.ts`:48
- c0246: `SnapshotPayload` — `src/queue.ts`:212
- c0247: `StoredQueueJob` — `src/queue.ts`:207
- c0248: `SupersessionReceipt` — `src/queue.ts`:92
- c0249: `WatermarkAdvance` — `src/queue.ts`:170
- c0250: `src/queue.ts` — `src/queue.ts`:1
- c0251: `DeadlineSignal` — `src/recall.ts`:206
- c0252: `DeeperRecallRequest` — `src/recall.ts`:153
- c0253: `RecallPlan` — `src/recall.ts`:188
- c0254: `RecallRequest` — `src/recall.ts`:136
- c0255: `RecallResult` — `src/recall.ts`:162
- c0256: `RecallService` — `src/recall.ts`:673
- c0257: `RecallServiceOptions` — `src/recall.ts`:198
- c0258: `ReviewValidationError` — `src/recall.ts`:611
- c0259: `ScopeResolution` — `src/recall.ts`:215
- c0260: `SearchOutcome` — `src/recall.ts`:221
- c0261: `src/recall.ts` — `src/recall.ts`:1
- c0262: `src/repository.ts` — `src/repository.ts`:1
- c0263: `SetupHelp` — `src/setup.ts`:3
- c0264: `src/setup.ts` — `src/setup.ts`:1
- c0265: `CaptureSnapshotWithStatus` — `src/snapshot.ts`:39
- c0266: `MessageRecord` — `src/snapshot.ts`:47
- c0267: `SnapshotOptions` — `src/snapshot.ts`:20
- c0268: `SnapshotResult` — `src/snapshot.ts`:43
- c0269: `SnapshotSessionReader` — `src/snapshot.ts`:14
- c0270: `src/snapshot.ts` — `src/snapshot.ts`:1
- c0271: `SourceInspectionError` — `src/source-inspection.ts`:37
- c0272: `SourceInspectionRequest` — `src/source-inspection.ts`:33
- c0273: `SourceInspectionResult` — `src/source-inspection.ts`:43
- c0274: `SourceInspector` — `src/source-inspection.ts`:149
- c0275: `SourceInspectorOptions` — `src/source-inspection.ts`:15
- c0276: `src/source-inspection.ts` — `src/source-inspection.ts`:1

## Relationships

- c0000 ..> c0160: `defaultExtension() calls createForgetfulExtension()`
- c0003 ..> c0004: `setLabel() calls refresh()`
- c0003 ..> c0065: `dispose() calls stop()`
- c0004 --> c0003: `field loader`
- c0004 ..> c0003: `close() calls dispose()`
- c0004 ..> c0003: `refresh() calls dispose()`
- c0004 ..> c0003: `refresh() calls setLabel()`
- c0004 ..> c0003: `refresh() constructs ActivityLoader`
- c0004 ..> c0004: `constructor() calls refresh()`
- c0004 ..> c0004: `notice() calls refresh()`
- c0004 ..> c0004: `set() calls refresh()`
- c0004 ..> c0065: `refresh() calls now()`
- c0005 ..> c0005: `capabilities() calls read()`
- c0005 ..> c0005: `clean() calls sanitize()`
- c0005 ..> c0005: `plan() calls read()`
- c0005 ..> c0005: `plans() calls read()`
- c0005 ..> c0005: `projects() calls read()`
- c0005 ..> c0005: `projects() calls sanitize()`
- c0005 ..> c0005: `read() calls clean()`
- c0005 ..> c0005: `task() calls read()`
- c0005 ..> c0005: `tasks() calls read()`
- c0005 ..> c0006: `capabilities() calls boolean()`
- c0005 ..> c0006: `capabilities() calls object()`
- c0005 ..> c0006: `plan() calls choice()`
- c0005 ..> c0006: `plan() calls integer()`
- c0005 ..> c0006: `plan() calls nullableString()`
- c0005 ..> c0006: `plan() calls object()`
- c0005 ..> c0006: `plan() calls parent()`
- c0005 ..> c0006: `plan() calls string()`
- c0005 ..> c0006: `plans() calls choice()`
- c0005 ..> c0006: `plans() calls integer()`
- c0005 ..> c0006: `plans() calls list()`
- c0005 ..> c0006: `plans() calls object()`
- c0005 ..> c0006: `plans() calls parent()`
- c0005 ..> c0006: `plans() calls string()`
- c0005 ..> c0006: `projects() calls integer()`
- c0005 ..> c0006: `projects() calls list()`
- c0005 ..> c0006: `projects() calls nullableString()`
- c0005 ..> c0006: `projects() calls object()`
- c0005 ..> c0006: `projects() calls string()`
- c0005 ..> c0006: `task() calls boolean()`
- c0005 ..> c0006: `task() calls integer()`
- c0005 ..> c0006: `task() calls invalid()`
- c0005 ..> c0006: `task() calls nullableString()`
- c0005 ..> c0006: `task() calls object()`
- c0005 ..> c0006: `task() calls parent()`
- c0005 ..> c0006: `task() calls string()`
- c0005 ..> c0006: `task() calls taskRecord()`
- c0005 ..> c0006: `tasks() calls boolean()`
- c0005 ..> c0006: `tasks() calls integer()`
- c0005 ..> c0006: `tasks() calls invalid()`
- c0005 ..> c0006: `tasks() calls list()`
- c0005 ..> c0006: `tasks() calls object()`
- c0005 ..> c0006: `tasks() calls taskRecord()`
- c0005 ..|> c0017: `implements`
- c0005 ..> c0018: `type in capabilities`
- c0005 ..> c0018: `type in plan`
- c0005 ..> c0018: `type in plans`
- c0005 ..> c0018: `type in projects`
- c0005 ..> c0018: `type in read`
- c0005 ..> c0018: `type in task`
- c0005 ..> c0018: `type in tasks`
- c0005 ..> c0127: `type in capabilities`
- c0005 ..> c0130: `type in plan`
- c0005 ..> c0131: `type in plans`
- c0005 ..> c0132: `type in projects`
- c0005 ..> c0133: `type in task`
- c0005 ..> c0135: `type in tasks`
- c0005 --> c0166: `field options`
- c0005 ..> c0166: `type in constructor`
- c0005 --> c0169: `field transport`
- c0005 ..> c0169: `capabilities() calls getDeployment()`
- c0005 ..> c0169: `constructor() constructs ForgetfulHttpTransport`
- c0005 ..> c0169: `plan() calls getJson()`
- c0005 ..> c0169: `plans() calls getJson()`
- c0005 ..> c0169: `projects() calls getJson()`
- c0005 ..> c0169: `task() calls getJson()`
- c0005 ..> c0169: `tasks() calls getJson()`
- c0005 ..> c0182: `clean() calls clean()`
- c0005 ..> c0228: `read() calls errorMessage()`
- c0005 ..> c0228: `sanitize() calls sanitizeText()`
- c0006 ..> c0006: `boolean() calls invalid()`
- c0006 ..> c0006: `choice() calls invalid()`
- c0006 ..> c0006: `integer() calls invalid()`
- c0006 ..> c0006: `list() calls integer()`
- c0006 ..> c0006: `list() calls invalid()`
- c0006 ..> c0006: `list() calls object()`
- c0006 ..> c0006: `nullableString() calls string()`
- c0006 ..> c0006: `object() calls invalid()`
- c0006 ..> c0006: `parent() calls integer()`
- c0006 ..> c0006: `parent() calls invalid()`
- c0006 ..> c0006: `string() calls invalid()`
- c0006 ..> c0006: `taskRecord() calls choice()`
- c0006 ..> c0006: `taskRecord() calls integer()`
- c0006 ..> c0006: `taskRecord() calls nullableString()`
- c0006 ..> c0006: `taskRecord() calls parent()`
- c0006 ..> c0006: `taskRecord() calls string()`
- c0006 ..> c0134: `type in taskRecord`
- c0006 ..> c0170: `invalid() constructs ForgetfulSchemaError`
- c0007 ..|> c0016: `implements`
- c0007 ..> c0086: `constructor() calls userSettingsPath()`
- c0007 ..> c0086: `read() calls readPlanningPanel()`
- c0007 ..> c0086: `write() calls updateUserSettings()`
- c0008 ..> c0003: `command() calls refresh()`
- c0008 ..> c0008: `close() calls finishBrowser()`
- c0008 ..> c0008: `command() calls close()`
- c0008 ..> c0008: `command() calls open()`
- c0008 ..> c0008: `dispose() calls finishBrowser()`
- c0008 ..> c0008: `dispose() calls releaseHost()`
- c0008 ..> c0008: `dispose() calls run()`
- c0008 ..> c0008: `dispose() calls unsubscribe()`
- c0008 ..> c0008: `mount() calls sync()`
- c0008 ..> c0008: `mountHost() calls syncPanel()`
- c0008 ..> c0008: `mountHost() calls syncVisibility()`
- c0008 ..> c0008: `open() calls close()`
- c0008 ..> c0008: `open() calls finishBrowser()`
- c0008 ..> c0008: `open() calls run()`
- c0008 ..> c0008: `open() calls sync()`
- c0008 ..> c0008: `setPromptActive() calls sync()`
- c0008 ..> c0008: `sync() calls close()`
- c0008 ..> c0008: `sync() calls mountHost()`
- c0008 ..> c0008: `sync() calls releaseHost()`
- c0008 ..> c0008: `sync() calls syncPanel()`
- c0008 ..> c0008: `sync() calls syncVisibility()`
- c0008 ..> c0008: `syncVisibility() calls hasPanelSpace()`
- c0008 ..> c0008: `syncVisibility() calls run()`
- c0008 ..> c0008: `toggle() calls close()`
- c0008 ..> c0008: `toggle() calls open()`
- c0008 ..> c0009: `hasPanelSpace() calls render()`
- c0008 ..> c0009: `open() constructs PlanBrowser`
- c0008 ..> c0010: `mountHost() calls renderPlanningPanel()`
- c0008 ..> c0010: `open() calls text()`
- c0008 ..> c0010: `run() calls text()`
- c0008 ..> c0010: `status() calls text()`
- c0008 ..> c0010: `status() calls timestamp()`
- c0008 ..> c0011: `command() calls setPanel()`
- c0008 ..> c0011: `command() calls togglePanel()`
- c0008 ..> c0011: `dispose() calls closeDetails()`
- c0008 ..> c0011: `dispose() calls setPanelVisible()`
- c0008 ..> c0011: `mount() calls subscribe()`
- c0008 ..> c0011: `open() calls closeDetails()`
- c0008 ..> c0011: `open() calls openDetails()`
- c0008 ..> c0011: `syncVisibility() calls setPanelVisible()`
- c0008 --> c0020: `field controller`
- c0008 ..> c0020: `type in constructor`
- c0008 ..> c0160: `command() calls notify()`
- c0008 ..> c0160: `open() calls notify()`
- c0008 ..> c0160: `run() calls notify()`
- c0008 ..> c0261: `command() calls trim()`
- c0009 ..> c0003: `handleInput() calls refresh()`
- c0009 ..> c0008: `handleInput() calls close()`
- c0009 ..> c0008: `handleInput() calls run()`
- c0009 ..> c0008: `listInput() calls run()`
- c0009 ..> c0008: `pickerInput() calls run()`
- c0009 ..> c0009: `handleInput() calls listInput()`
- c0009 ..> c0009: `handleInput() calls pickerInput()`
- c0009 ..> c0009: `handleInput() calls scrollInput()`
- c0009 ..> c0009: `render() calls planLines()`
- c0009 ..> c0009: `render() calls taskText()`
- c0009 ..> c0010: `planLines() calls text()`
- c0009 ..> c0010: `render() calls availability()`
- c0009 ..> c0010: `render() calls box()`
- c0009 ..> c0010: `render() calls counts()`
- c0009 ..> c0010: `render() calls taskLabel()`
- c0009 ..> c0010: `render() calls text()`
- c0009 ..> c0010: `taskText() calls taskLabel()`
- c0009 ..> c0010: `taskText() calls text()`
- c0009 ..> c0011: `handleInput() calls closeTask()`
- c0009 ..> c0011: `listInput() calls inspectTask()`
- c0009 ..> c0011: `listInput() calls selectPlan()`
- c0009 ..> c0011: `listInput() calls selectTask()`
- c0009 ..> c0011: `pickerInput() calls selectProject()`
- c0009 ..> c0019: `type in listInput`
- c0009 ..> c0019: `type in pickerInput`
- c0009 ..> c0019: `type in planLines`
- c0009 ..> c0019: `type in taskText`
- c0009 --> c0020: `field controller`
- c0009 ..> c0020: `type in constructor`
- c0010 ..> c0010: `availability() calls timestamp()`
- c0010 ..> c0010: `renderPlanningPanel() calls availability()`
- c0010 ..> c0010: `renderPlanningPanel() calls box()`
- c0010 ..> c0010: `renderPlanningPanel() calls counts()`
- c0010 ..> c0010: `renderPlanningPanel() calls taskLabel()`
- c0010 ..> c0010: `renderPlanningPanel() calls text()`
- c0010 ..> c0010: `taskLabel() calls text()`
- c0010 ..> c0019: `type in availability`
- c0010 ..> c0019: `type in counts`
- c0010 ..> c0019: `type in renderPlanningPanel`
- c0010 ..> c0135: `type in taskLabel`
- c0010 ..> c0228: `text() calls sanitizeText()`
- c0011 ..> c0005: `readOverview() calls capabilities()`
- c0011 ..> c0005: `readOverview() calls plan()`
- c0011 ..> c0005: `readOverview() calls plans()`
- c0011 ..> c0005: `readOverview() calls projects()`
- c0011 ..> c0005: `readOverview() calls task()`
- c0011 ..> c0005: `readOverview() calls tasks()`
- c0011 ..> c0007: `changePanel() calls write()`
- c0011 ..> c0011: `changePanel() calls invalidate()`
- c0011 ..> c0011: `changePanel() calls publish()`
- c0011 ..> c0011: `changePanel() calls startRefresh()`
- c0011 ..> c0011: `closeDetails() calls invalidate()`
- c0011 ..> c0011: `closeDetails() calls publish()`
- c0011 ..> c0011: `closeDetails() calls startRefresh()`
- c0011 ..> c0011: `closeTask() calls invalidate()`
- c0011 ..> c0011: `closeTask() calls publish()`
- c0011 ..> c0011: `closeTask() calls startRefresh()`
- c0011 ..> c0011: `dispose() calls invalidate()`
- c0011 ..> c0011: `inspectTask() calls invalidate()`
- c0011 ..> c0011: `inspectTask() calls publish()`
- c0011 ..> c0011: `inspectTask() calls startRefresh()`
- c0011 ..> c0011: `invalidate() calls cancelTimer()`
- c0011 ..> c0011: `invalidate() calls publish()`
- c0011 ..> c0011: `openDetails() calls invalidate()`
- c0011 ..> c0011: `openDetails() calls publish()`
- c0011 ..> c0011: `openDetails() calls startRefresh()`
- c0011 ..> c0011: `readOverview() calls accept()`
- c0011 ..> c0011: `readOverview() calls publish()`
- c0011 ..> c0011: `readOverview() calls startRefresh()`
- c0011 ..> c0011: `readOverview() calls visible()`
- c0011 ..> c0011: `refresh() calls startRefresh()`
- c0011 ..> c0011: `selectPlan() calls invalidate()`
- c0011 ..> c0011: `selectPlan() calls publish()`
- c0011 ..> c0011: `selectPlan() calls startRefresh()`
- c0011 ..> c0011: `selectProject() calls invalidate()`
- c0011 ..> c0011: `selectProject() calls publish()`
- c0011 ..> c0011: `selectProject() calls startRefresh()`
- c0011 ..> c0011: `selectTask() calls invalidate()`
- c0011 ..> c0011: `selectTask() calls publish()`
- c0011 ..> c0011: `selectTask() calls startRefresh()`
- c0011 ..> c0011: `setConnection() calls invalidate()`
- c0011 ..> c0011: `setConnection() calls publish()`
- c0011 ..> c0011: `setConnection() calls startRefresh()`
- c0011 ..> c0011: `setPanel() calls changePanel()`
- c0011 ..> c0011: `setPanelVisible() calls invalidate()`
- c0011 ..> c0011: `setPanelVisible() calls publish()`
- c0011 ..> c0011: `setPanelVisible() calls startRefresh()`
- c0011 ..> c0011: `startRefresh() calls cancelTimer()`
- c0011 ..> c0011: `startRefresh() calls readOverview()`
- c0011 ..> c0011: `startRefresh() calls visible()`
- c0011 ..> c0011: `togglePanel() calls changePanel()`
- c0011 --> c0012: `field options`
- c0011 ..> c0012: `type in constructor`
- c0011 ..> c0018: `type in accept`
- c0011 --> c0019: `field current`
- c0011 ..> c0019: `type in publish`
- c0011 ..> c0019: `type in state`
- c0011 ..> c0019: `type in subscribe`
- c0011 ..|> c0020: `implements`
- c0011 ..> c0065: `readOverview() calls now()`
- c0011 ..> c0138: `readOverview() calls activeTasks()`
- c0011 ..> c0138: `readOverview() calls mappedProject()`
- c0011 ..> c0138: `readOverview() calls sortPlans()`
- c0011 ..> c0138: `readOverview() calls taskCounts()`
- c0012 --> c0013: `field clock`
- c0012 --> c0016: `field preferences`
- c0012 --> c0017: `field reader`
- c0015 --> c0014: `field error`
- c0015 --> c0128: `field counts`
- c0015 --> c0135: `field activeTasks`
- c0015 --> c0135: `field tasks`
- c0017 ..> c0018: `type in capabilities`
- c0017 ..> c0018: `type in plan`
- c0017 ..> c0018: `type in plans`
- c0017 ..> c0018: `type in projects`
- c0017 ..> c0018: `type in task`
- c0017 ..> c0018: `type in tasks`
- c0017 ..> c0127: `type in capabilities`
- c0017 ..> c0130: `type in plan`
- c0017 ..> c0131: `type in plans`
- c0017 ..> c0132: `type in projects`
- c0017 ..> c0133: `type in task`
- c0017 ..> c0135: `type in tasks`
- c0018 --> c0014: `field error`
- c0019 --> c0014: `field detailError`
- c0019 --> c0014: `field error`
- c0019 --> c0015: `field planTasks`
- c0019 --> c0127: `field capability`
- c0019 --> c0130: `field planDetail`
- c0019 --> c0131: `field plans`
- c0019 --> c0132: `field projects`
- c0019 --> c0133: `field taskDetail`
- c0020 --> c0019: `field state`
- c0020 ..> c0019: `type in subscribe`
- c0022 ..> c0005: `createPlanningRuntime() constructs ApiPlanningReader`
- c0022 ..> c0007: `createPlanningRuntime() constructs LocalPlanningPreferences`
- c0022 ..> c0008: `createPlanningRuntime() calls command()`
- c0022 ..> c0008: `createPlanningRuntime() calls mount()`
- c0022 ..> c0008: `createPlanningRuntime() calls setPromptActive()`
- c0022 ..> c0008: `createPlanningRuntime() calls status()`
- c0022 ..> c0008: `createPlanningRuntime() calls toggle()`
- c0022 ..> c0008: `createPlanningRuntime() constructs PiPlanningView`
- c0022 ..> c0011: `createPlanningRuntime() calls dispose()`
- c0022 ..> c0011: `createPlanningRuntime() calls setConnection()`
- c0022 ..> c0011: `createPlanningRuntime() constructs PlanningController`
- c0022 ..> c0065: `createPlanningRuntime() calls now()`
- c0022 ..> c0075: `type in createPlanningRuntime`
- c0025 ..> c0023: `type in initialCorrectionCycle`
- c0025 ..> c0114: `type in captureFailureReport`
- c0025 ..> c0228: `captureFailureReport() calls sanitizeValue()`
- c0026 --> c0027: `field executionResults`
- c0026 --> c0027: `field previousResults`
- c0026 --> c0028: `field decisions`
- c0026 --> c0029: `field preservation`
- c0026 --> c0030: `field previous`
- c0026 --> c0090: `field resources`
- c0026 --> c0094: `field resources`
- c0026 --> c0107: `field memories`
- c0026 --> c0107: `field memory`
- c0030 --> c0090: `field codeArtifacts`
- c0030 --> c0094: `field documents`
- c0030 --> c0097: `field entities`
- c0030 --> c0107: `field memory`
- c0031 ..> c0004: `validateLinkDecisions() calls set()`
- c0031 ..> c0004: `validateLinkReviews() calls set()`
- c0031 ..> c0024: `authorizedMemory() constructs CaptureSelectionError`
- c0031 ..> c0026: `type in applyLinkReview`
- c0031 ..> c0026: `type in executeConnection`
- c0031 ..> c0026: `type in finishLinkExecution`
- c0031 ..> c0026: `type in prepareLinkReview`
- c0031 ..> c0026: `type in preserveConnections`
- c0031 ..> c0026: `type in readSelectedMemory`
- c0031 ..> c0026: `type in validateLinkDecisions`
- c0031 ..> c0026: `type in validateLinkReviews`
- c0031 ..> c0027: `type in executeConnection`
- c0031 ..> c0028: `type in validateLinkDecisions`
- c0031 ..> c0028: `type in validateLinkReviews`
- c0031 ..> c0028: `type in wantsEdge`
- c0031 ..> c0029: `type in validateLinkReviews`
- c0031 ..> c0030: `type in preparePreviousConnections`
- c0031 ..> c0031: `applyLinkReview() calls authorizedMemory()`
- c0031 ..> c0031: `applyLinkReview() calls executeConnection()`
- c0031 ..> c0031: `applyLinkReview() calls finishLinkExecution()`
- c0031 ..> c0031: `executeConnection() calls operationError()`
- c0031 ..> c0031: `prepareLinkReview() calls exclusiveMemory()`
- c0031 ..> c0031: `prepareLinkReview() calls readAttachmentRecords()`
- c0031 ..> c0031: `prepareLinkReview() calls readSelectedMemory()`
- c0031 ..> c0031: `preserveConnections() calls executeConnection()`
- c0031 ..> c0031: `validateLinkDecisions() calls wantsEdge()`
- c0031 ..> c0031: `validateLinkReviews() calls validateLinkDecisions()`
- c0031 ..> c0090: `type in readAttachmentRecords`
- c0031 ..> c0094: `type in readAttachmentRecords`
- c0031 ..> c0104: `type in applyLinkReview`
- c0031 ..> c0104: `type in authorizedMemory`
- c0031 ..> c0104: `type in prepareLinkReview`
- c0031 ..> c0104: `type in preparePreviousConnections`
- c0031 ..> c0104: `type in preserveConnections`
- c0031 ..> c0104: `type in readAttachmentRecords`
- c0031 ..> c0104: `type in readSelectedMemory`
- c0031 ..> c0107: `type in authorizedMemory`
- c0031 ..> c0107: `type in exclusiveMemory`
- c0031 ..> c0107: `type in prepareLinkReview`
- c0031 ..> c0107: `type in preparePreviousConnections`
- c0031 ..> c0107: `type in readAttachmentRecords`
- c0031 ..> c0107: `type in readSelectedMemory`
- c0031 ..> c0122: `type in applyLinkReview`
- c0031 ..> c0122: `type in authorizedMemory`
- c0031 ..> c0122: `type in prepareLinkReview`
- c0031 ..> c0162: `applyLinkReview() calls linkMemories()`
- c0031 ..> c0162: `preparePreviousConnections() calls getCodeArtifact()`
- c0031 ..> c0162: `preparePreviousConnections() calls getDocument()`
- c0031 ..> c0162: `preparePreviousConnections() calls getEntity()`
- c0031 ..> c0162: `preserveConnections() calls linkEntityMemory()`
- c0031 ..> c0162: `preserveConnections() calls updateMemory()`
- c0031 ..> c0162: `readAttachmentRecords() calls getCodeArtifact()`
- c0031 ..> c0162: `readAttachmentRecords() calls getDocument()`
- c0031 ..> c0165: `authorizedMemory() calls get()`
- c0031 ..> c0165: `prepareLinkReview() calls get()`
- c0031 ..> c0165: `preparePreviousConnections() calls get()`
- c0031 ..> c0165: `preparePreviousConnections() calls getMemoryEntityIds()`
- c0031 ..> c0165: `readSelectedMemory() calls get()`
- c0031 ..> c0165: `validateLinkDecisions() calls get()`
- c0031 ..> c0206: `executeConnection() calls execute()`
- c0031 ..> c0228: `operationError() calls errorMessage()`
- c0031 ..> c0228: `prepareLinkReview() calls hasSensitiveData()`
- c0031 ..> c0228: `preparePreviousConnections() calls hasSensitiveData()`
- c0031 ..> c0228: `readAttachmentRecords() calls hasSensitiveData()`
- c0031 ..> c0228: `validateLinkDecisions() calls hasSensitiveData()`
- c0031 ..> c0261: `validateLinkDecisions() calls trim()`
- c0032 --> c0122: `field scope`
- c0034 --|> c0032: `inherits`
- c0036 ..> c0024: `checkMergeEntity() constructs CaptureSelectionError`
- c0036 ..> c0024: `preflightMergeConnections() constructs CaptureSelectionError`
- c0036 ..> c0024: `requireResourceScope() constructs CaptureSelectionError`
- c0036 ..> c0032: `type in checkMergeAttachments`
- c0036 ..> c0032: `type in checkMergeEntity`
- c0036 ..> c0032: `type in preflightMergeConnections`
- c0036 ..> c0032: `type in requireResourceScope`
- c0036 ..> c0033: `type in checkMergeAttachments`
- c0036 ..> c0033: `type in collectMergeConnections`
- c0036 ..> c0033: `type in preflightMergeConnections`
- c0036 ..> c0033: `type in preserveMergeConnections`
- c0036 ..> c0034: `type in preserveMergeConnections`
- c0036 ..> c0036: `checkMergeAttachments() calls requireResourceScope()`
- c0036 ..> c0036: `collectMergeConnections() calls union()`
- c0036 ..> c0036: `preflightMergeConnections() calls checkMergeAttachments()`
- c0036 ..> c0036: `preflightMergeConnections() calls checkMergeEntity()`
- c0036 ..> c0036: `preserveMergeConnections() calls checkMergeAttachments()`
- c0036 ..> c0036: `preserveMergeConnections() calls checkMergeEntity()`
- c0036 ..> c0036: `preserveMergeConnections() calls preflightMergeConnections()`
- c0036 ..> c0036: `preserveMergeConnections() calls union()`
- c0036 ..> c0104: `type in checkMergeAttachments`
- c0036 ..> c0104: `type in checkMergeEntity`
- c0036 ..> c0104: `type in collectMergeConnections`
- c0036 ..> c0104: `type in preflightMergeConnections`
- c0036 ..> c0104: `type in preserveMergeConnections`
- c0036 ..> c0107: `type in collectMergeConnections`
- c0036 ..> c0162: `checkMergeAttachments() calls getCodeArtifact()`
- c0036 ..> c0162: `checkMergeAttachments() calls getDocument()`
- c0036 ..> c0162: `checkMergeAttachments() calls getFile()`
- c0036 ..> c0162: `checkMergeEntity() calls getEntity()`
- c0036 ..> c0162: `preserveMergeConnections() calls linkEntityMemory()`
- c0036 ..> c0162: `preserveMergeConnections() calls linkMemories()`
- c0036 ..> c0162: `preserveMergeConnections() calls updateMemory()`
- c0036 ..> c0165: `collectMergeConnections() calls getMemoryEntityIds()`
- c0036 ..> c0165: `preflightMergeConnections() calls get()`
- c0036 ..> c0206: `preserveMergeConnections() calls execute()`
- c0037 --> c0044: `field candidates`
- c0042 --> c0044: `field candidate`
- c0042 --> c0057: `field neighborhood`
- c0042 --> c0107: `field overlaps`
- c0044 --> c0047: `field codeArtifacts`
- c0044 --> c0053: `field documents`
- c0044 --> c0055: `field entities`
- c0044 --> c0062: `field relationships`
- c0045 --> c0043: `field excludeBranches`
- c0046 --> c0043: `field deferredBranches`
- c0047 --|> c0194: `inherits`
- c0048 --> c0039: `field action`
- c0048 --> c0064: `field reuse`
- c0049 --> c0026: `field linkReview`
- c0049 --> c0039: `field action`
- c0050 --> c0236: `field status`
- c0051 --> c0049: `field candidates`
- c0051 --> c0243: `field status`
- c0052 --> c0050: `field conflicts`
- c0052 --> c0051: `field jobs`
- c0053 --|> c0195: `inherits`
- c0055 --|> c0197: `inherits`
- c0056 --> c0033: `field connections`
- c0056 --> c0044: `field candidate`
- c0056 --> c0107: `field memories`
- c0057 --> c0090: `field codeArtifacts`
- c0057 --> c0094: `field documents`
- c0057 --> c0097: `field entities`
- c0057 --> c0099: `field relationships`
- c0058 --> c0067: `field uncertainWrite`
- c0058 --> c0248: `field supersession`
- c0059 --|> c0118: `inherits`
- c0060 --|> c0236: `inherits`
- c0062 --|> c0199: `inherits`
- c0063 --> c0236: `field conflict`
- c0065 ..> c0004: `activity() calls set()`
- c0065 ..> c0008: `resolveConflict() calls run()`
- c0065 ..> c0008: `runBranchWorker() calls run()`
- c0065 ..> c0024: `composeMerge() constructs CaptureSelectionError`
- c0065 ..> c0024: `equivalentMemory() constructs CaptureSelectionError`
- c0065 ..> c0024: `finishMerge() constructs CaptureSelectionError`
- c0065 ..> c0024: `processCandidates() constructs CaptureSelectionError`
- c0065 ..> c0024: `readMaintenanceTargets() constructs CaptureSelectionError`
- c0065 ..> c0024: `retireCandidate() constructs CaptureSelectionError`
- c0065 ..> c0024: `supersedeCandidate() constructs CaptureSelectionError`
- c0065 ..> c0024: `supersessionAlreadyApplied() constructs CaptureSelectionError`
- c0065 ..> c0024: `verifyRequestedMerge() constructs CaptureSelectionError`
- c0065 ..> c0025: `executeLinkReview() calls initialCorrectionCycle()`
- c0065 ..> c0025: `migrateLegacyLinkReview() calls initialCorrectionCycle()`
- c0065 ..> c0025: `planLinkReviews() calls captureFailureReport()`
- c0065 ..> c0025: `planLinkReviews() calls initialCorrectionCycle()`
- c0065 ..> c0025: `processOrderedCandidates() calls initialCorrectionCycle()`
- c0065 ..> c0025: `recordCandidateFailure() calls correctableCaptureError()`
- c0065 ..> c0025: `recordCandidateFailure() calls initialCorrectionCycle()`
- c0065 ..> c0025: `recordLinkReviewFailure() calls correctableCaptureError()`
- c0065 ..> c0025: `refreshLinkReview() calls correctableCaptureError()`
- c0065 ..> c0025: `reviewExecutionFailure() calls captureFailureReport()`
- c0065 ..> c0025: `reviewExecutionFailure() calls initialCorrectionCycle()`
- c0065 ..> c0025: `saveCorrectableFailure() calls correctableCaptureError()`
- c0065 ..> c0025: `saveCorrectableFailure() calls initialCorrectionCycle()`
- c0065 ..> c0026: `type in planLinkReviews`
- c0065 ..> c0026: `type in prepareLinkReviews`
- c0065 ..> c0026: `type in previousSupersessionCompleted`
- c0065 ..> c0026: `type in recordLinkReviewFailure`
- c0065 ..> c0026: `type in refreshLinkReview`
- c0065 ..> c0031: `executeLinkReview() calls applyLinkReview()`
- c0065 ..> c0031: `executeLinkReview() calls preserveConnections()`
- c0065 ..> c0031: `refreshLinkReview() calls prepareLinkReview()`
- c0065 ..> c0031: `refreshLinkReview() calls preparePreviousConnections()`
- c0065 ..> c0036: `composeMerge() calls collectMergeConnections()`
- c0065 ..> c0036: `composeMerge() calls preflightMergeConnections()`
- c0065 ..> c0036: `finishMerge() calls collectMergeConnections()`
- c0065 ..> c0036: `finishMerge() calls preserveMergeConnections()`
- c0065 ..> c0036: `mergeCandidate() calls collectMergeConnections()`
- c0065 ..> c0036: `mergeCandidate() calls preflightMergeConnections()`
- c0065 --> c0040: `field activityPhase`
- c0065 ..> c0040: `type in activity`
- c0065 ..> c0041: `type in advance`
- c0065 ..> c0041: `type in advanceWatermark`
- c0065 ..> c0042: `type in prepareOverlapBatch`
- c0065 ..> c0043: `type in checkpointBranch`
- c0065 ..> c0043: `type in checkpointBranches`
- c0065 ..> c0043: `type in runBranchWorker`
- c0065 ..> c0044: `type in addConflict`
- c0065 ..> c0044: `type in applyDecision`
- c0065 ..> c0044: `type in composeMerge`
- c0065 ..> c0044: `type in correctCandidateFailures`
- c0065 ..> c0044: `type in correctedCaptureOutcome`
- c0065 ..> c0044: `type in createMemory`
- c0065 ..> c0044: `type in decideOverlap`
- c0065 ..> c0044: `type in decideOverlapBatch`
- c0065 ..> c0044: `type in destinationProjects`
- c0065 ..> c0044: `type in executeLinkReview`
- c0065 ..> c0044: `type in executeLinkReviews`
- c0065 ..> c0044: `type in existingNeighborhood`
- c0065 ..> c0044: `type in finishMerge`
- c0065 ..> c0044: `type in finishReviewedSupersession`
- c0065 ..> c0044: `type in finishSupersession`
- c0065 ..> c0044: `type in loadCandidates`
- c0065 ..> c0044: `type in loadOverlaps`
- c0065 ..> c0044: `type in mergeCandidate`
- c0065 ..> c0044: `type in neighborhoodEntities`
- c0065 ..> c0044: `type in planConflictReplacement`
- c0065 ..> c0044: `type in planLinkReviews`
- c0065 ..> c0044: `type in prepareDestination`
- c0065 ..> c0044: `type in prepareLinkReviews`
- c0065 ..> c0044: `type in prepareOverlapBatch`
- c0065 ..> c0044: `type in processCandidate`
- c0065 ..> c0044: `type in processCandidates`
- c0065 ..> c0044: `type in processKnowledgeCheckpoint`
- c0065 ..> c0044: `type in processOrderedCandidates`
- c0065 ..> c0044: `type in processReplacementCheckpoint`
- c0065 ..> c0044: `type in recordCandidateFailure`
- c0065 ..> c0044: `type in recordEscalation`
- c0065 ..> c0044: `type in recordLinkReviewFailure`
- c0065 ..> c0044: `type in refreshLinkReview`
- c0065 ..> c0044: `type in resolveDestination`
- c0065 ..> c0044: `type in retireCandidate`
- c0065 ..> c0044: `type in reviewExecutionFailure`
- c0065 ..> c0044: `type in reviewLinks`
- c0065 ..> c0044: `type in saveCorrectableFailure`
- c0065 ..> c0044: `type in skipCandidate`
- c0065 ..> c0044: `type in supersedeCandidate`
- c0065 ..> c0044: `type in validateDecision`
- c0065 ..> c0044: `type in writeKnowledge`
- c0065 ..> c0045: `type in checkpoint`
- c0065 ..> c0045: `type in checkpointBranches`
- c0065 ..> c0045: `type in processPending`
- c0065 ..> c0046: `type in appendCheckpointResult`
- c0065 ..> c0046: `type in checkpoint`
- c0065 ..> c0046: `type in checkpointBranch`
- c0065 ..> c0046: `type in correctCandidateFailures`
- c0065 ..> c0046: `type in pauseCandidate`
- c0065 ..> c0046: `type in processBranchJob`
- c0065 ..> c0046: `type in processCandidates`
- c0065 ..> c0046: `type in processJob`
- c0065 ..> c0046: `type in processOrderedCandidates`
- c0065 ..> c0046: `type in processPending`
- c0065 ..> c0046: `type in recordBranchFailure`
- c0065 ..> c0046: `type in recordCandidateFailure`
- c0065 ..> c0046: `type in runBranchWorker`
- c0065 ..> c0048: `type in addConflict`
- c0065 ..> c0048: `type in applyDecision`
- c0065 ..> c0048: `type in composeMerge`
- c0065 ..> c0048: `type in correctedCaptureOutcome`
- c0065 ..> c0048: `type in decideOverlap`
- c0065 ..> c0048: `type in finishMerge`
- c0065 ..> c0048: `type in finishSupersession`
- c0065 ..> c0048: `type in mergeCandidate`
- c0065 ..> c0048: `type in recordEscalation`
- c0065 ..> c0048: `type in retireCandidate`
- c0065 ..> c0048: `type in skipCandidate`
- c0065 ..> c0048: `type in supersedeCandidate`
- c0065 ..> c0048: `type in validateDecision`
- c0065 ..> c0052: `type in diagnostics`
- c0065 ..> c0054: `type in enqueue`
- c0065 ..> c0054: `type in enqueueSnapshot`
- c0065 ..> c0056: `type in composeMerge`
- c0065 ..> c0056: `type in correctedCaptureOutcome`
- c0065 ..> c0056: `type in finishMerge`
- c0065 ..> c0057: `type in existingNeighborhood`
- c0065 ..> c0057: `type in validateDecision`
- c0065 ..> c0059: `assertWriteAllowedNow() constructs CapturePause`
- c0065 ..> c0059: `decideOverlap() constructs CapturePause`
- c0065 ..> c0059: `ensureModelCallAllowed() constructs CapturePause`
- c0065 ..> c0059: `ensureWriteAllowed() constructs CapturePause`
- c0065 ..> c0059: `evidenceReadTool() constructs CapturePause`
- c0065 ..> c0059: `loadOverlaps() constructs CapturePause`
- c0065 ..> c0059: `neighborhoodEntity() constructs CapturePause`
- c0065 ..> c0059: `neighborhoodMatches() constructs CapturePause`
- c0065 ..> c0059: `neighborhoodRelationships() constructs CapturePause`
- c0065 ..> c0059: `processCandidate() constructs CapturePause`
- c0065 ..> c0059: `processJob() constructs CapturePause`
- c0065 ..> c0059: `stop() constructs CapturePause`
- c0065 ..> c0059: `type in pauseCandidate`
- c0065 ..> c0060: `type in pendingConflicts`
- c0065 ..> c0060: `type in verifyConflictOrigin`
- c0065 ..> c0061: `ensureModelCallAllowed() constructs CaptureProgress`
- c0065 ..> c0063: `type in applyConflictResolution`
- c0065 ..> c0063: `type in markConflictResolved`
- c0065 ..> c0063: `type in rejectConflict`
- c0065 ..> c0063: `type in resolve`
- c0065 ..> c0063: `type in resolveConflict`
- c0065 ..> c0063: `type in resolveConflictOwned`
- c0065 ..> c0065: `activity() calls publishActivity()`
- c0065 ..> c0065: `advanceWatermark() calls advance()`
- c0065 ..> c0065: `applyConflictResolution() calls applySupersession()`
- c0065 ..> c0065: `applyConflictResolution() calls createResolutionReplacement()`
- c0065 ..> c0065: `applyConflictResolution() calls ensureWriteAllowed()`
- c0065 ..> c0065: `applyConflictResolution() calls executeResolutionLinks()`
- c0065 ..> c0065: `applyConflictResolution() calls failConflictResolution()`
- c0065 ..> c0065: `applyConflictResolution() calls markConflictResolved()`
- c0065 ..> c0065: `applyConflictResolution() calls planConflictReplacement()`
- c0065 ..> c0065: `applyConflictResolution() calls updateResolutionReplacement()`
- c0065 ..> c0065: `applyDecision() calls checkpointOutcome()`
- c0065 ..> c0065: `applyDecision() calls createMemory()`
- c0065 ..> c0065: `applyDecision() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `applyDecision() calls equivalentMemory()`
- c0065 ..> c0065: `applyDecision() calls mergeCandidate()`
- c0065 ..> c0065: `applyDecision() calls recordEscalation()`
- c0065 ..> c0065: `applyDecision() calls retireCandidate()`
- c0065 ..> c0065: `applyDecision() calls skipCandidate()`
- c0065 ..> c0065: `applyDecision() calls supersedeCandidate()`
- c0065 ..> c0065: `applyDecision() calls writeKnowledge()`
- c0065 ..> c0065: `applySupersession() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `applySupersession() calls recordSupersession()`
- c0065 ..> c0065: `applySupersession() calls supersessionAlreadyApplied()`
- c0065 ..> c0065: `assertWriteAllowedNow() calls canWriteNow()`
- c0065 ..> c0065: `cancellableClient() calls read()`
- c0065 ..> c0065: `cancellableKnowledge() calls read()`
- c0065 ..> c0065: `checkpoint() calls appendCheckpointResult()`
- c0065 ..> c0065: `checkpoint() calls checkpointBranch()`
- c0065 ..> c0065: `checkpoint() calls checkpointBranches()`
- c0065 ..> c0065: `checkpoint() calls enabled()`
- c0065 ..> c0065: `checkpointBranch() calls runBranchWorker()`
- c0065 ..> c0065: `checkpointOutcome() calls correlation()`
- c0065 ..> c0065: `composeMerge() calls checkpointOutcome()`
- c0065 ..> c0065: `composeMerge() calls correlation()`
- c0065 ..> c0065: `composeMerge() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `composeMerge() calls ensureWriteAllowed()`
- c0065 ..> c0065: `composeMerge() calls readMaintenanceTargets()`
- c0065 ..> c0065: `constructor() calls activity()`
- c0065 ..> c0065: `constructor() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `constructor() calls cancellableClient()`
- c0065 ..> c0065: `constructor() calls read()`
- c0065 ..> c0065: `correctCandidateFailures() calls recordCandidateFailure()`
- c0065 ..> c0065: `correctCandidateFailures() calls reviewExecutionFailure()`
- c0065 ..> c0065: `createMemory() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `createMemory() calls checkpointOutcome()`
- c0065 ..> c0065: `createMemory() calls correlation()`
- c0065 ..> c0065: `createMemory() calls ensureWriteAllowed()`
- c0065 ..> c0065: `createResolutionReplacement() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `createResolutionReplacement() calls ensureWriteAllowed()`
- c0065 ..> c0065: `decideOverlap() calls checkpointOutcome()`
- c0065 ..> c0065: `decideOverlap() calls correlation()`
- c0065 ..> c0065: `decideOverlap() calls enabled()`
- c0065 ..> c0065: `decideOverlap() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `decideOverlap() calls existingNeighborhood()`
- c0065 ..> c0065: `decideOverlap() calls policyFor()`
- c0065 ..> c0065: `decideOverlap() calls validateDecision()`
- c0065 ..> c0065: `decideOverlapBatch() calls correlation()`
- c0065 ..> c0065: `decideOverlapBatch() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `decideOverlapBatch() calls policyFor()`
- c0065 ..> c0065: `decideOverlapBatch() calls prepareOverlapBatch()`
- c0065 ..> c0065: `destinationProjects() calls resolveDestination()`
- c0065 ..> c0065: `enabled() calls getMode()`
- c0065 ..> c0065: `enabled() calls isEnabled()`
- c0065 ..> c0065: `enqueueSnapshot() calls getMode()`
- c0065 ..> c0065: `enqueueSnapshot() calls isEnabled()`
- c0065 ..> c0065: `ensureModelCallAllowed() calls enabled()`
- c0065 ..> c0065: `ensureWriteAllowed() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `ensureWriteAllowed() calls enabled()`
- c0065 ..> c0065: `ensureWriteAllowed() calls getMode()`
- c0065 ..> c0065: `equivalentMemory() calls ensureWriteAllowed()`
- c0065 ..> c0065: `evidenceReadTool() calls canReadNow()`
- c0065 ..> c0065: `evidenceReadTool() calls enabled()`
- c0065 ..> c0065: `executeLinkReview() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `executeLinkReview() calls checkpointOutcome()`
- c0065 ..> c0065: `executeLinkReview() calls ensureWriteAllowed()`
- c0065 ..> c0065: `executeLinkReview() calls finishReviewedSupersession()`
- c0065 ..> c0065: `executeLinkReview() calls previousSupersessionCompleted()`
- c0065 ..> c0065: `executeLinkReview() calls recordLinkReviewFailure()`
- c0065 ..> c0065: `executeLinkReviews() calls executeLinkReview()`
- c0065 ..> c0065: `executeResolutionLinks() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `executeResolutionLinks() calls ensureWriteAllowed()`
- c0065 ..> c0065: `executeResolutionLinks() calls linkResolutionEntity()`
- c0065 ..> c0065: `existingNeighborhood() calls neighborhoodEntities()`
- c0065 ..> c0065: `existingNeighborhood() calls neighborhoodRelationships()`
- c0065 ..> c0065: `finishMerge() calls applySupersession()`
- c0065 ..> c0065: `finishMerge() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `finishMerge() calls checkpointOutcome()`
- c0065 ..> c0065: `finishMerge() calls ensureWriteAllowed()`
- c0065 ..> c0065: `finishMerge() calls readMaintenanceTargets()`
- c0065 ..> c0065: `finishMerge() calls verifyRequestedMerge()`
- c0065 ..> c0065: `finishReviewedSupersession() calls finishSupersession()`
- c0065 ..> c0065: `finishSupersession() calls applySupersession()`
- c0065 ..> c0065: `finishSupersession() calls checkpointOutcome()`
- c0065 ..> c0065: `linkResolutionEntity() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `linkResolutionEntity() calls ensureWriteAllowed()`
- c0065 ..> c0065: `loadCandidates() calls correlation()`
- c0065 ..> c0065: `loadCandidates() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `loadCandidates() calls evidenceReadTool()`
- c0065 ..> c0065: `loadCandidates() calls policyFor()`
- c0065 ..> c0065: `loadCandidates() calls sourceInspectionTool()`
- c0065 ..> c0065: `loadOverlaps() calls checkpointOutcome()`
- c0065 ..> c0065: `loadOverlaps() calls enabled()`
- c0065 ..> c0065: `mergeCandidate() calls checkpointOutcome()`
- c0065 ..> c0065: `mergeCandidate() calls composeMerge()`
- c0065 ..> c0065: `mergeCandidate() calls createMemory()`
- c0065 ..> c0065: `mergeCandidate() calls ensureWriteAllowed()`
- c0065 ..> c0065: `mergeCandidate() calls finishMerge()`
- c0065 ..> c0065: `mergeCandidate() calls readMaintenanceTargets()`
- c0065 ..> c0065: `mergeCandidate() calls writeKnowledge()`
- c0065 ..> c0065: `migrateLegacyLinkReview() calls checkpointOutcome()`
- c0065 ..> c0065: `migrateLegacyLinkReview() calls connectionUncertainty()`
- c0065 ..> c0065: `mutate() calls activity()`
- c0065 ..> c0065: `mutate() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `neighborhoodEntities() calls neighborhoodEntity()`
- c0065 ..> c0065: `neighborhoodEntities() calls neighborhoodMatches()`
- c0065 ..> c0065: `neighborhoodEntity() calls enabled()`
- c0065 ..> c0065: `neighborhoodMatches() calls enabled()`
- c0065 ..> c0065: `neighborhoodRelationships() calls enabled()`
- c0065 ..> c0065: `ownedConflict() calls verifyConflictOrigin()`
- c0065 ..> c0065: `pendingConflicts() calls verifyConflictOrigin()`
- c0065 ..> c0065: `planConflictReplacement() calls ensureWriteAllowed()`
- c0065 ..> c0065: `planConflictReplacement() calls readSavedMemory()`
- c0065 ..> c0065: `planConflictReplacement() calls revisionResources()`
- c0065 ..> c0065: `planLinkReviews() calls correlation()`
- c0065 ..> c0065: `planLinkReviews() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `planLinkReviews() calls ensureWriteAllowed()`
- c0065 ..> c0065: `preflightRetirement() calls confirmedRetirement()`
- c0065 ..> c0065: `preflightRetirement() calls readMaintenanceTargets()`
- c0065 ..> c0065: `prepareDestination() calls checkpointOutcome()`
- c0065 ..> c0065: `prepareDestination() calls destinationProjects()`
- c0065 ..> c0065: `prepareLinkReviews() calls checkpointOutcome()`
- c0065 ..> c0065: `prepareLinkReviews() calls ensureWriteAllowed()`
- c0065 ..> c0065: `prepareLinkReviews() calls migrateLegacyLinkReview()`
- c0065 ..> c0065: `prepareLinkReviews() calls refreshLinkReview()`
- c0065 ..> c0065: `prepareOverlapBatch() calls existingNeighborhood()`
- c0065 ..> c0065: `prepareOverlapBatch() calls loadOverlaps()`
- c0065 ..> c0065: `prepareOverlapBatch() calls prepareDestination()`
- c0065 ..> c0065: `previousSupersessionCompleted() calls ensureWriteAllowed()`
- c0065 ..> c0065: `processBranchJob() calls correlation()`
- c0065 ..> c0065: `processBranchJob() calls processJob()`
- c0065 ..> c0065: `processBranchJob() calls recordBranchFailure()`
- c0065 ..> c0065: `processCandidate() calls applyDecision()`
- c0065 ..> c0065: `processCandidate() calls checkpointOutcome()`
- c0065 ..> c0065: `processCandidate() calls decideOverlap()`
- c0065 ..> c0065: `processCandidate() calls enabled()`
- c0065 ..> c0065: `processCandidate() calls getMode()`
- c0065 ..> c0065: `processCandidate() calls loadOverlaps()`
- c0065 ..> c0065: `processCandidate() calls mergeCandidate()`
- c0065 ..> c0065: `processCandidate() calls prepareDestination()`
- c0065 ..> c0065: `processCandidate() calls processKnowledgeCheckpoint()`
- c0065 ..> c0065: `processCandidate() calls processReplacementCheckpoint()`
- c0065 ..> c0065: `processCandidate() calls retireCandidate()`
- c0065 ..> c0065: `processCandidates() calls correctCandidateFailures()`
- c0065 ..> c0065: `processCandidates() calls processOrderedCandidates()`
- c0065 ..> c0065: `processCandidates() calls recordCandidateFailure()`
- c0065 ..> c0065: `processCandidates() calls saveCorrectableFailure()`
- c0065 ..> c0065: `processJob() calls decideOverlapBatch()`
- c0065 ..> c0065: `processJob() calls enabled()`
- c0065 ..> c0065: `processJob() calls getMode()`
- c0065 ..> c0065: `processJob() calls loadCandidates()`
- c0065 ..> c0065: `processJob() calls processCandidates()`
- c0065 ..> c0065: `processJob() calls reviewLinks()`
- c0065 ..> c0065: `processKnowledgeCheckpoint() calls finishSupersession()`
- c0065 ..> c0065: `processKnowledgeCheckpoint() calls writeKnowledge()`
- c0065 ..> c0065: `processOrderedCandidates() calls checkpointOutcome()`
- c0065 ..> c0065: `processOrderedCandidates() calls processCandidate()`
- c0065 ..> c0065: `processOrderedCandidates() calls processCandidates()`
- c0065 ..> c0065: `processOrderedCandidates() calls recordCandidateFailure()`
- c0065 ..> c0065: `processOrderedCandidates() calls saveCorrectableFailure()`
- c0065 ..> c0065: `processReplacementCheckpoint() calls finishSupersession()`
- c0065 ..> c0065: `processReplacementCheckpoint() calls writeKnowledge()`
- c0065 ..> c0065: `publishActivity() calls onActivity()`
- c0065 ..> c0065: `read() calls activity()`
- c0065 ..> c0065: `read() calls readSignal()`
- c0065 ..> c0065: `readMaintenanceTargets() calls ensureWriteAllowed()`
- c0065 ..> c0065: `recordBranchFailure() calls correlation()`
- c0065 ..> c0065: `recordCandidateFailure() calls candidateUncertainty()`
- c0065 ..> c0065: `recordCandidateFailure() calls checkpointOutcome()`
- c0065 ..> c0065: `recordCandidateFailure() calls correlation()`
- c0065 ..> c0065: `recordCandidateFailure() calls isModelFailure()`
- c0065 ..> c0065: `recordCandidateFailure() calls pauseCandidate()`
- c0065 ..> c0065: `recordEscalation() calls checkpointOutcome()`
- c0065 ..> c0065: `recordLinkReviewFailure() calls checkpointOutcome()`
- c0065 ..> c0065: `recordLinkReviewFailure() calls connectionUncertainty()`
- c0065 ..> c0065: `refreshLinkReview() calls ensureWriteAllowed()`
- c0065 ..> c0065: `resolve() calls resolveConflict()`
- c0065 ..> c0065: `resolveConflict() calls resolveConflictOwned()`
- c0065 ..> c0065: `resolveConflictOwned() calls applyConflictResolution()`
- c0065 ..> c0065: `resolveConflictOwned() calls enabled()`
- c0065 ..> c0065: `resolveConflictOwned() calls ownedConflict()`
- c0065 ..> c0065: `resolveConflictOwned() calls rejectConflict()`
- c0065 ..> c0065: `resolveConflictOwned() calls resolutionTarget()`
- c0065 ..> c0065: `resolveConflictOwned() calls validateResolutionEvidence()`
- c0065 ..> c0065: `retireCandidate() calls applySupersession()`
- c0065 ..> c0065: `retireCandidate() calls checkpointOutcome()`
- c0065 ..> c0065: `retireCandidate() calls confirmedRetirement()`
- c0065 ..> c0065: `retireCandidate() calls ensureWriteAllowed()`
- c0065 ..> c0065: `retireCandidate() calls preflightRetirement()`
- c0065 ..> c0065: `reviewExecutionFailure() calls checkpointOutcome()`
- c0065 ..> c0065: `reviewExecutionFailure() calls correctedCaptureOutcome()`
- c0065 ..> c0065: `reviewExecutionFailure() calls correlation()`
- c0065 ..> c0065: `reviewExecutionFailure() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `reviewLinks() calls executeLinkReviews()`
- c0065 ..> c0065: `reviewLinks() calls planLinkReviews()`
- c0065 ..> c0065: `reviewLinks() calls prepareLinkReviews()`
- c0065 ..> c0065: `revisionResources() calls read()`
- c0065 ..> c0065: `runBranchWorker() calls enabled()`
- c0065 ..> c0065: `runBranchWorker() calls processBranchJob()`
- c0065 ..> c0065: `saveCorrectableFailure() calls candidateUncertainty()`
- c0065 ..> c0065: `saveCorrectableFailure() calls checkpointOutcome()`
- c0065 ..> c0065: `saveCorrectableFailure() calls correlation()`
- c0065 ..> c0065: `saveCorrectableFailure() calls isModelFailure()`
- c0065 ..> c0065: `skipCandidate() calls checkpointOutcome()`
- c0065 ..> c0065: `skipCandidate() calls writeKnowledge()`
- c0065 ..> c0065: `supersedeCandidate() calls checkpointOutcome()`
- c0065 ..> c0065: `supersedeCandidate() calls createMemory()`
- c0065 ..> c0065: `supersedeCandidate() calls ensureModelCallAllowed()`
- c0065 ..> c0065: `supersedeCandidate() calls ensureWriteAllowed()`
- c0065 ..> c0065: `supersedeCandidate() calls finishSupersession()`
- c0065 ..> c0065: `supersedeCandidate() calls writeKnowledge()`
- c0065 ..> c0065: `supersessionAlreadyApplied() calls ensureWriteAllowed()`
- c0065 ..> c0065: `updateResolutionReplacement() calls assertWriteAllowedNow()`
- c0065 ..> c0065: `updateResolutionReplacement() calls ensureWriteAllowed()`
- c0065 ..> c0065: `validateResolutionEvidence() calls selectResolutionEvidence()`
- c0065 ..> c0065: `verifyRequestedMerge() calls ensureWriteAllowed()`
- c0065 ..> c0065: `writeKnowledge() calls checkpointOutcome()`
- c0065 ..> c0065: `writeKnowledge() calls ensureWriteAllowed()`
- c0065 --> c0066: `field onActivity`
- c0065 ..> c0066: `type in constructor`
- c0065 ..> c0067: `applySupersession() constructs CaptureUncertainWrite`
- c0065 ..> c0067: `candidateUncertainty() constructs CaptureUncertainWrite`
- c0065 ..> c0067: `connectionUncertainty() constructs CaptureUncertainWrite`
- c0065 ..> c0067: `createMemory() constructs CaptureUncertainWrite`
- c0065 ..> c0067: `mutate() constructs CaptureUncertainWrite`
- c0065 ..> c0067: `processJob() constructs CaptureUncertainWrite`
- c0065 ..> c0067: `reviewExecutionFailure() constructs CaptureUncertainWrite`
- c0065 ..> c0067: `type in candidateUncertainty`
- c0065 ..> c0067: `type in connectionUncertainty`
- c0065 ..> c0068: `type in applyConflictResolution`
- c0065 ..> c0068: `type in planConflictReplacement`
- c0065 ..> c0068: `type in validateResolutionEvidence`
- c0065 ..> c0069: `type in applyConflictResolution`
- c0065 ..> c0069: `type in resolutionTarget`
- c0065 ..> c0070: `destinationProjects() constructs InvalidCaptureOutput`
- c0065 ..> c0070: `processKnowledgeCheckpoint() constructs InvalidCaptureOutput`
- c0065 ..> c0070: `processReplacementCheckpoint() constructs InvalidCaptureOutput`
- c0065 ..> c0070: `validateDecision() constructs InvalidCaptureOutput`
- c0065 ..> c0071: `resolveDestination() constructs MissingCaptureDestination`
- c0065 ..> c0072: `type in rejectConflict`
- c0065 ..> c0072: `type in resolve`
- c0065 ..> c0072: `type in resolveConflict`
- c0065 ..> c0072: `type in resolveConflictOwned`
- c0065 ..> c0072: `type in selectResolutionEvidence`
- c0065 ..> c0072: `type in validateResolutionEvidence`
- c0065 ..> c0073: `addConflict() calls clone()`
- c0065 ..> c0073: `addConflict() calls sourceEvidence()`
- c0065 ..> c0073: `applyConflictResolution() calls blockedSave()`
- c0065 ..> c0073: `applyConflictResolution() calls conflictResolutionEvidence()`
- c0065 ..> c0073: `applyDecision() calls firstConflictId()`
- c0065 ..> c0073: `applySupersession() calls definitelyRejected()`
- c0065 ..> c0073: `candidateUncertainty() calls record()`
- c0065 ..> c0073: `checkpointBranch() calls scrubError()`
- c0065 ..> c0073: `checkpointOutcome() calls clone()`
- c0065 ..> c0073: `checkpointOutcome() calls record()`
- c0065 ..> c0073: `composeMerge() calls captureWorkMetadata()`
- c0065 ..> c0073: `composeMerge() calls decisionConflictIds()`
- c0065 ..> c0073: `composeMerge() calls record()`
- c0065 ..> c0073: `composeMerge() calls sourceEvidence()`
- c0065 ..> c0073: `correctCandidateFailures() calls isFinalOutcome()`
- c0065 ..> c0073: `correctedCaptureOutcome() calls decisionConflictIds()`
- c0065 ..> c0073: `correctedCaptureOutcome() calls record()`
- c0065 ..> c0073: `correctedCaptureOutcome() calls reusableMergeComposition()`
- c0065 ..> c0073: `createMemory() calls definitelyRejected()`
- c0065 ..> c0073: `createMemory() calls memoryInput()`
- c0065 ..> c0073: `createMemory() calls projectId()`
- c0065 ..> c0073: `createMemory() calls record()`
- c0065 ..> c0073: `createResolutionReplacement() calls definitelyRejected()`
- c0065 ..> c0073: `createResolutionReplacement() calls projectId()`
- c0065 ..> c0073: `decideOverlap() calls appendSubmissionRejection()`
- c0065 ..> c0073: `decideOverlap() calls boundedSubmissionRejections()`
- c0065 ..> c0073: `decideOverlap() calls captureWorkMetadata()`
- c0065 ..> c0073: `decideOverlap() calls decisionConflictIds()`
- c0065 ..> c0073: `decideOverlap() calls overlapCandidate()`
- c0065 ..> c0073: `decideOverlap() calls parseDecision()`
- c0065 ..> c0073: `decideOverlap() calls sourceEvidence()`
- c0065 ..> c0073: `decideOverlapBatch() calls appendSubmissionRejection()`
- c0065 ..> c0073: `decideOverlapBatch() calls boundedSubmissionRejections()`
- c0065 ..> c0073: `decideOverlapBatch() calls captureWorkMetadata()`
- c0065 ..> c0073: `decideOverlapBatch() calls overlapCandidate()`
- c0065 ..> c0073: `decideOverlapBatch() calls record()`
- c0065 ..> c0073: `decideOverlapBatch() calls scrubError()`
- c0065 ..> c0073: `decideOverlapBatch() calls sharedSourceEvidence()`
- c0065 ..> c0073: `diagnostics() calls boundedSubmissionRejections()`
- c0065 ..> c0073: `diagnostics() calls projectId()`
- c0065 ..> c0073: `diagnostics() calls record()`
- c0065 ..> c0073: `diagnostics() calls scrubError()`
- c0065 ..> c0073: `diagnostics() calls stringValue()`
- c0065 ..> c0073: `diagnostics() calls strings()`
- c0065 ..> c0073: `enqueue() calls scrubError()`
- c0065 ..> c0073: `enqueueSnapshot() calls snapshotForPersistence()`
- c0065 ..> c0073: `equivalentMemory() calls projectId()`
- c0065 ..> c0073: `equivalentMemory() calls record()`
- c0065 ..> c0073: `evidenceReadTool() calls record()`
- c0065 ..> c0073: `executeLinkReview() calls record()`
- c0065 ..> c0073: `executeLinkReviews() calls record()`
- c0065 ..> c0073: `finishMerge() calls record()`
- c0065 ..> c0073: `finishSupersession() calls record()`
- c0065 ..> c0073: `loadCandidates() calls appendSubmissionRejection()`
- c0065 ..> c0073: `loadCandidates() calls boundedSubmissionRejections()`
- c0065 ..> c0073: `loadCandidates() calls captureCandidateSubmission()`
- c0065 ..> c0073: `loadCandidates() calls captureWorkMetadata()`
- c0065 ..> c0073: `loadCandidates() calls parseCandidates()`
- c0065 ..> c0073: `loadCandidates() calls record()`
- c0065 ..> c0073: `loadCandidates() calls strings()`
- c0065 ..> c0073: `loadOverlaps() calls record()`
- c0065 ..> c0073: `mergeCandidate() calls projectId()`
- c0065 ..> c0073: `mergeCandidate() calls record()`
- c0065 ..> c0073: `neighborhoodMatches() calls record()`
- c0065 ..> c0073: `pauseCandidate() calls scrubError()`
- c0065 ..> c0073: `planLinkReviews() calls appendSubmissionRejection()`
- c0065 ..> c0073: `planLinkReviews() calls boundedSubmissionRejections()`
- c0065 ..> c0073: `planLinkReviews() calls captureWorkMetadata()`
- c0065 ..> c0073: `planLinkReviews() calls record()`
- c0065 ..> c0073: `planLinkReviews() calls sharedSourceEvidence()`
- c0065 ..> c0073: `preflightRetirement() calls record()`
- c0065 ..> c0073: `prepareLinkReviews() calls record()`
- c0065 ..> c0073: `prepareOverlapBatch() calls isFinalOutcome()`
- c0065 ..> c0073: `prepareOverlapBatch() calls record()`
- c0065 ..> c0073: `processCandidate() calls isFinalOutcome()`
- c0065 ..> c0073: `processCandidate() calls record()`
- c0065 ..> c0073: `processJob() calls isFinalOutcome()`
- c0065 ..> c0073: `processKnowledgeCheckpoint() calls projectId()`
- c0065 ..> c0073: `processKnowledgeCheckpoint() calls record()`
- c0065 ..> c0073: `processOrderedCandidates() calls isFinalOutcome()`
- c0065 ..> c0073: `processOrderedCandidates() calls record()`
- c0065 ..> c0073: `processReplacementCheckpoint() calls projectId()`
- c0065 ..> c0073: `processReplacementCheckpoint() calls record()`
- c0065 ..> c0073: `recordBranchFailure() calls scrubError()`
- c0065 ..> c0073: `recordCandidateFailure() calls record()`
- c0065 ..> c0073: `recordCandidateFailure() calls scrubError()`
- c0065 ..> c0073: `recordLinkReviewFailure() calls record()`
- c0065 ..> c0073: `refreshLinkReview() calls projectId()`
- c0065 ..> c0073: `refreshLinkReview() calls record()`
- c0065 ..> c0073: `resolutionTarget() calls record()`
- c0065 ..> c0073: `resolveDestination() calls currentProjectId()`
- c0065 ..> c0073: `resolveDestination() calls projectId()`
- c0065 ..> c0073: `retireCandidate() calls decisionConflictIds()`
- c0065 ..> c0073: `retireCandidate() calls record()`
- c0065 ..> c0073: `reviewExecutionFailure() calls captureWorkMetadata()`
- c0065 ..> c0073: `reviewExecutionFailure() calls record()`
- c0065 ..> c0073: `reviewLinks() calls record()`
- c0065 ..> c0073: `saveCorrectableFailure() calls record()`
- c0065 ..> c0073: `saveCorrectableFailure() calls scrubError()`
- c0065 ..> c0073: `skipCandidate() calls firstConflictId()`
- c0065 ..> c0073: `skipCandidate() calls record()`
- c0065 ..> c0073: `supersedeCandidate() calls decisionConflictIds()`
- c0065 ..> c0073: `validateResolutionEvidence() calls stringValue()`
- c0065 ..> c0073: `validateResolutionEvidence() calls trustedAdditionalEntries()`
- c0065 ..> c0073: `verifyConflictOrigin() calls record()`
- c0065 ..> c0073: `writeKnowledge() calls captureKnowledgePlan()`
- c0065 ..> c0073: `writeKnowledge() calls record()`
- c0065 --> c0088: `field getMode`
- c0065 ..> c0088: `type in enabled`
- c0065 ..> c0088: `type in ensureWriteAllowed`
- c0065 ..> c0088: `type in refreshLinkReview`
- c0065 ..> c0089: `type in advance`
- c0065 ..> c0089: `type in advanceWatermark`
- c0065 ..> c0089: `type in checkpoint`
- c0065 ..> c0089: `type in checkpointBranches`
- c0065 ..> c0089: `type in enqueue`
- c0065 ..> c0089: `type in enqueueSnapshot`
- c0065 ..> c0089: `type in policyFor`
- c0065 ..> c0097: `type in neighborhoodEntities`
- c0065 ..> c0097: `type in neighborhoodEntity`
- c0065 ..> c0097: `type in neighborhoodMatches`
- c0065 ..> c0097: `type in neighborhoodRelationships`
- c0065 ..> c0099: `type in neighborhoodRelationships`
- c0065 --> c0104: `field client`
- c0065 ..> c0104: `type in cancellableClient`
- c0065 ..> c0105: `type in cancellableKnowledge`
- c0065 --> c0107: `field readSavedMemory`
- c0065 ..> c0107: `type in addConflict`
- c0065 ..> c0107: `type in applyDecision`
- c0065 ..> c0107: `type in applySupersession`
- c0065 ..> c0107: `type in decideOverlap`
- c0065 ..> c0107: `type in equivalentMemory`
- c0065 ..> c0107: `type in finishSupersession`
- c0065 ..> c0107: `type in loadOverlaps`
- c0065 ..> c0107: `type in planConflictReplacement`
- c0065 ..> c0107: `type in readMaintenanceTargets`
- c0065 ..> c0107: `type in recordEscalation`
- c0065 ..> c0107: `type in revisionResources`
- c0065 ..> c0107: `type in skipCandidate`
- c0065 ..> c0107: `type in supersedeCandidate`
- c0065 ..> c0107: `type in validateDecision`
- c0065 ..> c0107: `type in writeKnowledge`
- c0065 ..> c0108: `type in createMemory`
- c0065 --> c0110: `field model`
- c0065 ..> c0112: `evidenceReadTool() constructs ModelEvidencePage`
- c0065 ..> c0113: `sourceInspectionTool() constructs ModelReadErrorResult`
- c0065 ..> c0114: `type in evidenceReadTool`
- c0065 ..> c0114: `type in sourceInspectionTool`
- c0065 ..> c0125: `type in destinationProjects`
- c0065 ..> c0125: `type in planConflictReplacement`
- c0065 ..> c0125: `type in resolveDestination`
- c0065 ..> c0125: `type in watermark`
- c0065 ..> c0162: `cancellableKnowledge() calls createCodeArtifact()`
- c0065 ..> c0162: `cancellableKnowledge() calls createDocument()`
- c0065 ..> c0162: `cancellableKnowledge() calls createEntity()`
- c0065 ..> c0162: `cancellableKnowledge() calls createRelationship()`
- c0065 ..> c0162: `cancellableKnowledge() calls getCodeArtifact()`
- c0065 ..> c0162: `cancellableKnowledge() calls getDocument()`
- c0065 ..> c0162: `cancellableKnowledge() calls getEntity()`
- c0065 ..> c0162: `cancellableKnowledge() calls getEntityMemories()`
- c0065 ..> c0162: `cancellableKnowledge() calls getFile()`
- c0065 ..> c0162: `cancellableKnowledge() calls getRelationships()`
- c0065 ..> c0162: `cancellableKnowledge() calls linkEntityMemory()`
- c0065 ..> c0162: `cancellableKnowledge() calls linkMemories()`
- c0065 ..> c0162: `cancellableKnowledge() calls listCodeArtifacts()`
- c0065 ..> c0162: `cancellableKnowledge() calls listDocuments()`
- c0065 ..> c0162: `cancellableKnowledge() calls listFiles()`
- c0065 ..> c0162: `cancellableKnowledge() calls searchEntities()`
- c0065 ..> c0162: `cancellableKnowledge() calls updateCodeArtifact()`
- c0065 ..> c0162: `cancellableKnowledge() calls updateDocument()`
- c0065 ..> c0162: `cancellableKnowledge() calls updateEntity()`
- c0065 ..> c0162: `cancellableKnowledge() calls updateMemory()`
- c0065 ..> c0162: `executeResolutionLinks() calls linkMemories()`
- c0065 ..> c0162: `existingNeighborhood() calls getCodeArtifact()`
- c0065 ..> c0162: `existingNeighborhood() calls getDocument()`
- c0065 ..> c0162: `existingNeighborhood() calls listCodeArtifacts()`
- c0065 ..> c0162: `existingNeighborhood() calls listDocuments()`
- c0065 ..> c0162: `linkResolutionEntity() calls linkEntityMemory()`
- c0065 ..> c0162: `neighborhoodEntity() calls getEntity()`
- c0065 ..> c0162: `neighborhoodMatches() calls searchEntities()`
- c0065 ..> c0162: `neighborhoodRelationships() calls getRelationships()`
- c0065 ..> c0162: `revisionResources() calls getCodeArtifact()`
- c0065 ..> c0162: `revisionResources() calls getDocument()`
- c0065 ..> c0162: `revisionResources() calls getEntity()`
- c0065 ..> c0162: `revisionResources() calls getFile()`
- c0065 ..> c0162: `updateResolutionReplacement() calls updateMemory()`
- c0065 ..> c0162: `verifyRequestedMerge() calls getEntity()`
- c0065 ..> c0165: `applyConflictResolution() calls get()`
- c0065 ..> c0165: `applySupersession() calls supersede()`
- c0065 ..> c0165: `cancellableClient() calls create()`
- c0065 ..> c0165: `cancellableClient() calls createProject()`
- c0065 ..> c0165: `cancellableClient() calls get()`
- c0065 ..> c0165: `cancellableClient() calls linkProject()`
- c0065 ..> c0165: `cancellableClient() calls listProjects()`
- c0065 ..> c0165: `cancellableClient() calls search()`
- c0065 ..> c0165: `cancellableClient() calls supersede()`
- c0065 ..> c0165: `constructor() calls get()`
- c0065 ..> c0165: `createMemory() calls create()`
- c0065 ..> c0165: `createResolutionReplacement() calls create()`
- c0065 ..> c0165: `decideOverlapBatch() calls get()`
- c0065 ..> c0165: `diagnostics() calls get()`
- c0065 ..> c0165: `equivalentMemory() calls get()`
- c0065 ..> c0165: `executeResolutionLinks() calls get()`
- c0065 ..> c0165: `finishMerge() calls get()`
- c0065 ..> c0165: `linkResolutionEntity() calls getMemoryEntityIds()`
- c0065 ..> c0165: `loadOverlaps() calls search()`
- c0065 ..> c0165: `planLinkReviews() calls get()`
- c0065 ..> c0165: `previousSupersessionCompleted() calls get()`
- c0065 ..> c0165: `read() calls get()`
- c0065 ..> c0165: `readMaintenanceTargets() calls get()`
- c0065 ..> c0165: `resolveDestination() calls listProjects()`
- c0065 ..> c0165: `retireCandidate() calls get()`
- c0065 ..> c0165: `revisionResources() calls get()`
- c0065 ..> c0165: `revisionResources() calls getMemoryEntityIds()`
- c0065 ..> c0165: `skipCandidate() calls get()`
- c0065 ..> c0165: `supersedeCandidate() calls get()`
- c0065 ..> c0165: `supersessionAlreadyApplied() calls get()`
- c0065 ..> c0165: `verifyConflictOrigin() calls get()`
- c0065 ..> c0165: `verifyRequestedMerge() calls get()`
- c0065 --> c0206: `field knowledgeWriter`
- c0065 ..> c0206: `constructor() constructs KnowledgeWriter`
- c0065 ..> c0206: `writeKnowledge() calls execute()`
- c0065 --> c0210: `field logger`
- c0065 ..> c0212: `checkpointBranch() calls emit()`
- c0065 ..> c0212: `checkpointOutcome() calls emit()`
- c0065 ..> c0212: `createMemory() calls emit()`
- c0065 ..> c0212: `decideOverlap() calls emit()`
- c0065 ..> c0212: `emit() calls emit()`
- c0065 ..> c0212: `enqueue() calls emit()`
- c0065 ..> c0212: `enqueueSnapshot() calls emit()`
- c0065 ..> c0212: `enqueueSnapshot() calls enqueue()`
- c0065 ..> c0212: `loadCandidates() calls emit()`
- c0065 ..> c0212: `processBranchJob() calls emit()`
- c0065 ..> c0212: `recordBranchFailure() calls emit()`
- c0065 ..> c0212: `recordCandidateFailure() calls emit()`
- c0065 ..> c0212: `runBranchWorker() calls emit()`
- c0065 ..> c0212: `saveCorrectableFailure() calls emit()`
- c0065 ..> c0214: `createMemory() calls replacementMemoryInput()`
- c0065 ..> c0214: `createResolutionReplacement() calls replacementMemoryInput()`
- c0065 ..> c0214: `planConflictReplacement() calls replacementMemoryInput()`
- c0065 ..> c0214: `updateResolutionReplacement() calls replacementMemoryInput()`
- c0065 ..> c0218: `loadCandidates() calls prepareCapture()`
- c0065 ..> c0228: `addConflict() calls sanitizeText()`
- c0065 ..> c0228: `addConflict() calls sanitizeValue()`
- c0065 ..> c0228: `applySupersession() calls errorMessage()`
- c0065 ..> c0228: `candidateUncertainty() calls errorMessage()`
- c0065 ..> c0228: `createMemory() calls errorMessage()`
- c0065 ..> c0228: `createResolutionReplacement() calls errorMessage()`
- c0065 ..> c0228: `decideOverlap() calls sanitizeValue()`
- c0065 ..> c0228: `diagnostics() calls sanitizeText()`
- c0065 ..> c0228: `emit() calls sanitizeValue()`
- c0065 ..> c0228: `existingNeighborhood() calls hasSensitiveData()`
- c0065 ..> c0228: `failConflictResolution() calls errorMessage()`
- c0065 ..> c0228: `loadCandidates() calls sanitizeText()`
- c0065 ..> c0228: `loadOverlaps() calls sanitizeValue()`
- c0065 ..> c0228: `mutate() calls errorMessage()`
- c0065 ..> c0228: `neighborhoodEntity() calls hasSensitiveData()`
- c0065 ..> c0228: `neighborhoodRelationships() calls hasSensitiveData()`
- c0065 ..> c0228: `recordCandidateFailure() calls errorMessage()`
- c0065 ..> c0228: `recordLinkReviewFailure() calls errorMessage()`
- c0065 ..> c0228: `refreshLinkReview() calls errorMessage()`
- c0065 ..> c0228: `rejectConflict() calls sanitizeText()`
- c0065 ..> c0228: `reviewExecutionFailure() calls errorMessage()`
- c0065 ..> c0228: `saveCorrectableFailure() calls errorMessage()`
- c0065 ..> c0228: `skipCandidate() calls sanitizeValue()`
- c0065 --> c0232: `field queue`
- c0065 ..> c0232: `addConflict() calls addConflict()`
- c0065 ..> c0232: `addConflict() calls now()`
- c0065 ..> c0232: `advance() calls advanceWatermark()`
- c0065 ..> c0232: `applyConflictResolution() calls updateConflict()`
- c0065 ..> c0232: `cancellableClient() calls mutate()`
- c0065 ..> c0232: `cancellableKnowledge() calls mutate()`
- c0065 ..> c0232: `checkpoint() calls hasClaimableWork()`
- c0065 ..> c0232: `checkpointBranch() calls withWorkerLock()`
- c0065 ..> c0232: `checkpointBranches() calls listJobMetadata()`
- c0065 ..> c0232: `checkpointOutcome() calls checkpoint()`
- c0065 ..> c0232: `checkpointOutcome() calls getJob()`
- c0065 ..> c0232: `composeMerge() calls checkpoint()`
- c0065 ..> c0232: `composeMerge() calls complete()`
- c0065 ..> c0232: `constructor() calls complete()`
- c0065 ..> c0232: `createResolutionReplacement() calls updateConflict()`
- c0065 ..> c0232: `decideOverlap() calls checkpoint()`
- c0065 ..> c0232: `decideOverlap() calls complete()`
- c0065 ..> c0232: `decideOverlapBatch() calls checkpoint()`
- c0065 ..> c0232: `decideOverlapBatch() calls complete()`
- c0065 ..> c0232: `diagnostics() calls listJobMetadata()`
- c0065 ..> c0232: `diagnostics() calls pendingConflicts()`
- c0065 ..> c0232: `enqueue() calls enqueueSnapshot()`
- c0065 ..> c0232: `enqueueSnapshot() calls advanceWatermark()`
- c0065 ..> c0232: `executeLinkReviews() calls getJob()`
- c0065 ..> c0232: `executeResolutionLinks() calls updateConflict()`
- c0065 ..> c0232: `failConflictResolution() calls getConflict()`
- c0065 ..> c0232: `failConflictResolution() calls updateConflict()`
- c0065 ..> c0232: `loadCandidates() calls checkpoint()`
- c0065 ..> c0232: `loadCandidates() calls complete()`
- c0065 ..> c0232: `loadCandidates() calls getJob()`
- c0065 ..> c0232: `loadCandidates() calls refreshCaptureHistory()`
- c0065 ..> c0232: `markConflictResolved() calls updateConflict()`
- c0065 ..> c0232: `ownedConflict() calls getConflict()`
- c0065 ..> c0232: `pauseCandidate() calls checkpoint()`
- c0065 ..> c0232: `pauseCandidate() calls getJob()`
- c0065 ..> c0232: `pendingConflicts() calls pendingConflicts()`
- c0065 ..> c0232: `planConflictReplacement() calls complete()`
- c0065 ..> c0232: `planConflictReplacement() calls getJob()`
- c0065 ..> c0232: `planLinkReviews() calls checkpoint()`
- c0065 ..> c0232: `planLinkReviews() calls complete()`
- c0065 ..> c0232: `processBranchJob() calls getJob()`
- c0065 ..> c0232: `processBranchJob() calls now()`
- c0065 ..> c0232: `processBranchJob() calls releaseProgress()`
- c0065 ..> c0232: `processJob() calls checkpoint()`
- c0065 ..> c0232: `processJob() calls complete()`
- c0065 ..> c0232: `processJob() calls getJob()`
- c0065 ..> c0232: `processJob() calls releaseProgress()`
- c0065 ..> c0232: `processPending() calls checkpoint()`
- c0065 ..> c0232: `recordBranchFailure() calls cancel()`
- c0065 ..> c0232: `recordBranchFailure() calls checkpoint()`
- c0065 ..> c0232: `recordBranchFailure() calls getJob()`
- c0065 ..> c0232: `recordBranchFailure() calls now()`
- c0065 ..> c0232: `recordCandidateFailure() calls cancel()`
- c0065 ..> c0232: `recordCandidateFailure() calls checkpoint()`
- c0065 ..> c0232: `recordCandidateFailure() calls getJob()`
- c0065 ..> c0232: `recordEscalation() calls addConflict()`
- c0065 ..> c0232: `recordLinkReviewFailure() calls getJob()`
- c0065 ..> c0232: `recordSupersession() calls checkpoint()`
- c0065 ..> c0232: `recordSupersession() calls updateConflict()`
- c0065 ..> c0232: `rejectConflict() calls updateConflict()`
- c0065 ..> c0232: `resolveConflict() calls getConflict()`
- c0065 ..> c0232: `resolveConflict() calls withWorkerLock()`
- c0065 ..> c0232: `reviewExecutionFailure() calls checkpoint()`
- c0065 ..> c0232: `reviewExecutionFailure() calls complete()`
- c0065 ..> c0232: `runBranchWorker() calls claimNext()`
- c0065 ..> c0232: `saveCorrectableFailure() calls getJob()`
- c0065 ..> c0232: `sourceInspectionTool() calls checkpoint()`
- c0065 ..> c0232: `updateResolutionReplacement() calls updateConflict()`
- c0065 ..> c0232: `verifyConflictOrigin() calls getJob()`
- c0065 ..> c0232: `watermark() calls getWatermark()`
- c0065 ..> c0236: `type in addConflict`
- c0065 ..> c0236: `type in applyConflictResolution`
- c0065 ..> c0236: `type in createResolutionReplacement`
- c0065 ..> c0236: `type in executeResolutionLinks`
- c0065 ..> c0236: `type in linkResolutionEntity`
- c0065 ..> c0236: `type in ownedConflict`
- c0065 ..> c0236: `type in planConflictReplacement`
- c0065 ..> c0236: `type in rejectConflict`
- c0065 ..> c0236: `type in resolutionTarget`
- c0065 ..> c0236: `type in selectResolutionEvidence`
- c0065 ..> c0236: `type in updateResolutionReplacement`
- c0065 ..> c0236: `type in validateResolutionEvidence`
- c0065 ..> c0236: `type in verifyConflictOrigin`
- c0065 --> c0240: `field identity`
- c0065 ..> c0241: `type in addConflict`
- c0065 ..> c0241: `type in applyDecision`
- c0065 ..> c0241: `type in applySupersession`
- c0065 ..> c0241: `type in checkpointOutcome`
- c0065 ..> c0241: `type in composeMerge`
- c0065 ..> c0241: `type in correctCandidateFailures`
- c0065 ..> c0241: `type in correlation`
- c0065 ..> c0241: `type in createMemory`
- c0065 ..> c0241: `type in decideOverlap`
- c0065 ..> c0241: `type in decideOverlapBatch`
- c0065 ..> c0241: `type in ensureModelCallAllowed`
- c0065 ..> c0241: `type in equivalentMemory`
- c0065 ..> c0241: `type in evidenceReadTool`
- c0065 ..> c0241: `type in executeLinkReview`
- c0065 ..> c0241: `type in executeLinkReviews`
- c0065 ..> c0241: `type in existingNeighborhood`
- c0065 ..> c0241: `type in finishMerge`
- c0065 ..> c0241: `type in finishReviewedSupersession`
- c0065 ..> c0241: `type in finishSupersession`
- c0065 ..> c0241: `type in loadCandidates`
- c0065 ..> c0241: `type in loadOverlaps`
- c0065 ..> c0241: `type in mergeCandidate`
- c0065 ..> c0241: `type in migrateLegacyLinkReview`
- c0065 ..> c0241: `type in neighborhoodEntities`
- c0065 ..> c0241: `type in neighborhoodEntity`
- c0065 ..> c0241: `type in neighborhoodMatches`
- c0065 ..> c0241: `type in neighborhoodRelationships`
- c0065 ..> c0241: `type in pauseCandidate`
- c0065 ..> c0241: `type in planLinkReviews`
- c0065 ..> c0241: `type in preflightRetirement`
- c0065 ..> c0241: `type in prepareDestination`
- c0065 ..> c0241: `type in prepareLinkReviews`
- c0065 ..> c0241: `type in prepareOverlapBatch`
- c0065 ..> c0241: `type in previousSupersessionCompleted`
- c0065 ..> c0241: `type in processBranchJob`
- c0065 ..> c0241: `type in processCandidate`
- c0065 ..> c0241: `type in processCandidates`
- c0065 ..> c0241: `type in processJob`
- c0065 ..> c0241: `type in processKnowledgeCheckpoint`
- c0065 ..> c0241: `type in processOrderedCandidates`
- c0065 ..> c0241: `type in processReplacementCheckpoint`
- c0065 ..> c0241: `type in readMaintenanceTargets`
- c0065 ..> c0241: `type in recordBranchFailure`
- c0065 ..> c0241: `type in recordCandidateFailure`
- c0065 ..> c0241: `type in recordEscalation`
- c0065 ..> c0241: `type in recordLinkReviewFailure`
- c0065 ..> c0241: `type in refreshLinkReview`
- c0065 ..> c0241: `type in retireCandidate`
- c0065 ..> c0241: `type in reviewExecutionFailure`
- c0065 ..> c0241: `type in reviewLinks`
- c0065 ..> c0241: `type in saveCorrectableFailure`
- c0065 ..> c0241: `type in skipCandidate`
- c0065 ..> c0241: `type in sourceInspectionTool`
- c0065 ..> c0241: `type in supersedeCandidate`
- c0065 ..> c0241: `type in supersessionAlreadyApplied`
- c0065 ..> c0241: `type in verifyRequestedMerge`
- c0065 ..> c0241: `type in writeKnowledge`
- c0065 ..> c0248: `type in recordSupersession`
- c0065 ..> c0261: `composeMerge() calls trim()`
- c0065 ..> c0261: `neighborhoodMatches() calls trim()`
- c0065 ..> c0261: `retireCandidate() calls trim()`
- c0065 ..> c0270: `composeMerge() calls captureConversation()`
- c0065 ..> c0270: `decideOverlap() calls captureConversation()`
- c0065 ..> c0270: `decideOverlapBatch() calls captureConversation()`
- c0065 ..> c0270: `loadCandidates() calls captureConversation()`
- c0065 ..> c0270: `planConflictReplacement() calls captureConversation()`
- c0065 ..> c0270: `planConflictReplacement() calls sanitizeCaptureConversation()`
- c0065 ..> c0270: `planLinkReviews() calls captureConversation()`
- c0065 ..> c0270: `reviewExecutionFailure() calls captureConversation()`
- c0065 ..> c0274: `sourceInspectionTool() calls inspect()`
- c0065 ..> c0274: `sourceInspectionTool() constructs SourceInspector`
- c0066 --> c0040: `field onActivity`
- c0066 --> c0088: `field getMode`
- c0066 --> c0104: `field client`
- c0066 --> c0110: `field model`
- c0066 --> c0210: `field logger`
- c0066 --> c0232: `field queue`
- c0067 --|> c0059: `inherits`
- c0068 --> c0102: `field selectedAdditionalEntries`
- c0069 --> c0044: `field candidate`
- c0069 --> c0107: `field oldMemory`
- c0069 --> c0241: `field fakeJob`
- c0071 --|> c0024: `inherits`
- c0071 ..> c0044: `type in constructor`
- c0072 --> c0102: `field additionalEntries`
- c0073 ..> c0037: `type in parseCandidates`
- c0073 ..> c0038: `type in eligibleCandidate`
- c0073 ..> c0038: `type in invalidCandidate`
- c0073 ..> c0038: `type in validCandidate`
- c0073 ..> c0044: `type in captureKnowledgePlan`
- c0073 ..> c0044: `type in captureProvenance`
- c0073 ..> c0044: `type in eligibleCandidate`
- c0073 ..> c0044: `type in memoryInput`
- c0073 ..> c0044: `type in overlapCandidate`
- c0073 ..> c0044: `type in sharedSourceEvidence`
- c0073 ..> c0044: `type in sourceEvidence`
- c0073 ..> c0048: `type in applyEnrichmentDecision`
- c0073 ..> c0048: `type in applyEquivalentCandidate`
- c0073 ..> c0048: `type in decisionConflictIds`
- c0073 ..> c0048: `type in firstConflictId`
- c0073 ..> c0048: `type in parseDecision`
- c0073 ..> c0048: `type in reusableMergeComposition`
- c0073 ..> c0056: `type in reusableMergeComposition`
- c0073 ..> c0068: `type in conflictResolutionEvidence`
- c0073 ..> c0070: `applyEnrichmentDecision() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `applyEquivalentCandidate() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `captureResource() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `decisionEvidenceIds() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `decisionMemoryId() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `decisionMemoryIds() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `decisionPartial() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `decisionTargetMemoryId() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `decisionText() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `parseCandidates() constructs InvalidCaptureOutput`
- c0073 ..> c0070: `parseDecision() constructs InvalidCaptureOutput`
- c0073 ..> c0073: `appendSubmissionRejection() calls boundedSubmissionRejections()`
- c0073 ..> c0073: `captureEvidenceError() calls record()`
- c0073 ..> c0073: `captureEvidenceError() calls stringValue()`
- c0073 ..> c0073: `captureKnowledgePlan() calls captureProvenance()`
- c0073 ..> c0073: `captureKnowledgePlan() calls resourceInput()`
- c0073 ..> c0073: `captureResource() calls record()`
- c0073 ..> c0073: `currentProjectId() calls projectId()`
- c0073 ..> c0073: `decisionMemoryId() calls projectId()`
- c0073 ..> c0073: `decisionMemoryIds() calls projectId()`
- c0073 ..> c0073: `decisionTargetMemoryId() calls projectId()`
- c0073 ..> c0073: `eligibleCandidate() calls captureEvidenceError()`
- c0073 ..> c0073: `eligibleCandidate() calls captureResource()`
- c0073 ..> c0073: `eligibleCandidate() calls invalidCandidate()`
- c0073 ..> c0073: `eligibleCandidate() calls record()`
- c0073 ..> c0073: `eligibleCandidate() calls stringValue()`
- c0073 ..> c0073: `eligibleCandidate() calls validCandidate()`
- c0073 ..> c0073: `isFinalOutcome() calls record()`
- c0073 ..> c0073: `memoryInput() calls captureProvenance()`
- c0073 ..> c0073: `parseCandidates() calls eligibleCandidate()`
- c0073 ..> c0073: `parseCandidates() calls record()`
- c0073 ..> c0073: `parseCandidates() calls stringValue()`
- c0073 ..> c0073: `parseDecision() calls applyEnrichmentDecision()`
- c0073 ..> c0073: `parseDecision() calls applyEquivalentCandidate()`
- c0073 ..> c0073: `parseDecision() calls decisionEvidenceIds()`
- c0073 ..> c0073: `parseDecision() calls decisionMemoryId()`
- c0073 ..> c0073: `parseDecision() calls decisionMemoryIds()`
- c0073 ..> c0073: `parseDecision() calls decisionPartial()`
- c0073 ..> c0073: `parseDecision() calls decisionTargetMemoryId()`
- c0073 ..> c0073: `parseDecision() calls decisionText()`
- c0073 ..> c0073: `parseDecision() calls record()`
- c0073 ..> c0073: `resourceInput() calls record()`
- c0073 ..> c0073: `reusableMergeComposition() calls decisionConflictIds()`
- c0073 ..> c0073: `sharedSourceEvidence() calls sourceEvidence()`
- c0073 ..> c0073: `snapshotForPersistence() calls clone()`
- c0073 ..> c0073: `trustedAdditionalEntries() calls record()`
- c0073 ..> c0073: `trustedAdditionalEntries() calls stringValue()`
- c0073 ..> c0089: `type in captureCandidateSubmission`
- c0073 ..> c0089: `type in captureEvidenceError`
- c0073 ..> c0089: `type in captureWorkMetadata`
- c0073 ..> c0089: `type in eligibleCandidate`
- c0073 ..> c0089: `type in parseCandidates`
- c0073 ..> c0089: `type in sharedSourceEvidence`
- c0073 ..> c0089: `type in snapshotForPersistence`
- c0073 ..> c0089: `type in sourceEvidence`
- c0073 ..> c0102: `type in sharedSourceEvidence`
- c0073 ..> c0102: `type in sourceEvidence`
- c0073 ..> c0102: `type in trustedAdditionalEntries`
- c0073 ..> c0107: `type in captureKnowledgePlan`
- c0073 ..> c0109: `type in memoryInput`
- c0073 ..> c0117: `type in captureCandidateSubmission`
- c0073 ..> c0125: `type in captureKnowledgePlan`
- c0073 ..> c0125: `type in captureProvenance`
- c0073 ..> c0125: `type in currentProjectId`
- c0073 ..> c0125: `type in memoryInput`
- c0073 ..> c0165: `captureEvidenceError() calls get()`
- c0073 ..> c0165: `sourceEvidence() calls get()`
- c0073 ..> c0202: `type in captureKnowledgePlan`
- c0073 ..> c0228: `boundedSubmissionRejections() calls sanitizeText()`
- c0073 ..> c0228: `captureEvidenceError() calls isMemoryOperation()`
- c0073 ..> c0228: `captureEvidenceError() calls sanitizeText()`
- c0073 ..> c0228: `captureWorkMetadata() calls isMemoryOperation()`
- c0073 ..> c0228: `scrubError() calls errorMessage()`
- c0073 ..> c0228: `scrubError() calls sanitizeText()`
- c0073 ..> c0228: `strings() calls sanitizeText()`
- c0073 ..> c0228: `trustedAdditionalEntries() calls hasSensitiveData()`
- c0073 ..> c0228: `trustedAdditionalEntries() calls isMemoryOperation()`
- c0073 ..> c0228: `trustedAdditionalEntries() calls sanitizeText()`
- c0073 ..> c0261: `applyEnrichmentDecision() calls trim()`
- c0073 ..> c0261: `applyEquivalentCandidate() calls trim()`
- c0073 ..> c0261: `decisionEvidenceIds() calls trim()`
- c0073 ..> c0261: `eligibleCandidate() calls trim()`
- c0073 ..> c0261: `parseDecision() calls trim()`
- c0073 ..> c0261: `stringValue() calls trim()`
- c0073 ..> c0261: `strings() calls trim()`
- c0073 ..> c0270: `snapshotForPersistence() calls sanitizeCaptureSnapshot()`
- c0073 ..> c0274: `errorMessage() calls inspect()`
- c0075 --> c0076: `field instance`
- c0075 --> c0079: `field model`
- c0075 --> c0083: `field prompts`
- c0075 --> c0084: `field scopeSource`
- c0075 --> c0085: `field verbosity`
- c0075 --> c0088: `field captureMode`
- c0075 --> c0122: `field scope`
- c0075 --> c0211: `field logging`
- c0086 ..> c0008: `writeJson() calls open()`
- c0086 ..> c0008: `writeJson() calls sync()`
- c0086 ..> c0065: `resolveLogDirectory() calls resolve()`
- c0086 ..> c0075: `type in loadForgetfulConfig`
- c0086 ..> c0077: `type in readJson`
- c0086 ..> c0077: `type in resolveScope`
- c0086 ..> c0078: `type in loadForgetfulConfig`
- c0086 ..> c0079: `type in modelToString`
- c0086 ..> c0079: `type in parseModel`
- c0086 ..> c0081: `type in resolveVerbosity`
- c0086 ..> c0081: `type in updateUserSettings`
- c0086 ..> c0083: `type in mergePrompts`
- c0086 ..> c0083: `type in readPromptDirectory`
- c0086 ..> c0084: `type in resolveScope`
- c0086 ..> c0085: `type in isVerbosity`
- c0086 ..> c0085: `type in resolveVerbosity`
- c0086 ..> c0086: `loadForgetfulConfig() calls asBoolean()`
- c0086 ..> c0086: `loadForgetfulConfig() calls asPositiveInteger()`
- c0086 ..> c0086: `loadForgetfulConfig() calls asString()`
- c0086 ..> c0086: `loadForgetfulConfig() calls defaultAgentDir()`
- c0086 ..> c0086: `loadForgetfulConfig() calls isFileLogLevel()`
- c0086 ..> c0086: `loadForgetfulConfig() calls isRecord()`
- c0086 ..> c0086: `loadForgetfulConfig() calls mergePrompts()`
- c0086 ..> c0086: `loadForgetfulConfig() calls parseModel()`
- c0086 ..> c0086: `loadForgetfulConfig() calls projectSettingsPath()`
- c0086 ..> c0086: `loadForgetfulConfig() calls readJson()`
- c0086 ..> c0086: `loadForgetfulConfig() calls readPromptDirectory()`
- c0086 ..> c0086: `loadForgetfulConfig() calls resolveCaptureMode()`
- c0086 ..> c0086: `loadForgetfulConfig() calls resolveContextLimit()`
- c0086 ..> c0086: `loadForgetfulConfig() calls resolveLogDirectory()`
- c0086 ..> c0086: `loadForgetfulConfig() calls resolveRecallConcurrency()`
- c0086 ..> c0086: `loadForgetfulConfig() calls resolveScope()`
- c0086 ..> c0086: `loadForgetfulConfig() calls resolveVerbosity()`
- c0086 ..> c0086: `loadForgetfulConfig() calls userSettingsPath()`
- c0086 ..> c0086: `parseModel() calls isRecord()`
- c0086 ..> c0086: `readPlanningPanel() calls isRecord()`
- c0086 ..> c0086: `readPlanningPanel() calls readJson()`
- c0086 ..> c0086: `resolveRecallConcurrency() calls isRecallConcurrency()`
- c0086 ..> c0086: `resolveScope() calls isRecord()`
- c0086 ..> c0086: `resolveVerbosity() calls isVerbosity()`
- c0086 ..> c0086: `updateForgetfulConnection() calls isRecord()`
- c0086 ..> c0086: `updateForgetfulConnection() calls readJson()`
- c0086 ..> c0086: `updateForgetfulConnection() calls writeJson()`
- c0086 ..> c0086: `updateUserSettings() calls isRecord()`
- c0086 ..> c0086: `updateUserSettings() calls readJson()`
- c0086 ..> c0086: `updateUserSettings() calls writeJson()`
- c0086 ..> c0086: `userSettingsPath() calls defaultAgentDir()`
- c0086 ..> c0086: `writeProjectScope() calls projectSettingsPath()`
- c0086 ..> c0086: `writeProjectScope() calls writeJson()`
- c0086 ..> c0088: `type in resolveCaptureMode`
- c0086 ..> c0122: `type in resolveScope`
- c0086 ..> c0122: `type in writeProjectScope`
- c0086 ..> c0192: `readJson() calls readFile()`
- c0086 ..> c0192: `readPromptDirectory() calls readFile()`
- c0086 ..> c0211: `type in isFileLogLevel`
- c0086 ..> c0212: `writeJson() calls close()`
- c0086 ..> c0261: `asString() calls trim()`
- c0086 ..> c0261: `parseModel() calls trim()`
- c0086 ..> c0261: `readPromptDirectory() calls trim()`
- c0086 ..> c0261: `resolveLogDirectory() calls trim()`
- c0089 --> c0087: `field historySummary`
- c0089 --> c0088: `field mode`
- c0089 --> c0102: `field entries`
- c0089 --> c0122: `field scope`
- c0089 --> c0125: `field context`
- c0090 --|> c0091: `inherits`
- c0091 --|> c0121: `inherits`
- c0094 --|> c0095: `inherits`
- c0095 --|> c0121: `inherits`
- c0097 --|> c0098: `inherits`
- c0098 --> c0101: `field entity_type`
- c0098 --|> c0121: `inherits`
- c0099 --|> c0100: `inherits`
- c0100 --|> c0121: `inherits`
- c0104 --> c0105: `field knowledge`
- c0104 ..> c0107: `type in get`
- c0104 ..> c0107: `type in search`
- c0104 ..> c0108: `type in create`
- c0104 ..> c0109: `type in create`
- c0104 ..> c0111: `type in queryMemory`
- c0104 ..> c0119: `type in createProject`
- c0104 ..> c0119: `type in linkProject`
- c0104 ..> c0119: `type in listProjects`
- c0104 ..> c0120: `type in createProject`
- c0104 ..> c0123: `type in queryMemory`
- c0104 ..> c0123: `type in search`
- c0105 ..> c0090: `type in createCodeArtifact`
- c0105 ..> c0090: `type in getCodeArtifact`
- c0105 ..> c0090: `type in updateCodeArtifact`
- c0105 ..> c0091: `type in createCodeArtifact`
- c0105 ..> c0091: `type in updateCodeArtifact`
- c0105 ..> c0092: `type in listCodeArtifacts`
- c0105 ..> c0094: `type in createDocument`
- c0105 ..> c0094: `type in getDocument`
- c0105 ..> c0094: `type in updateDocument`
- c0105 ..> c0095: `type in createDocument`
- c0105 ..> c0095: `type in updateDocument`
- c0105 ..> c0096: `type in listDocuments`
- c0105 ..> c0097: `type in createEntity`
- c0105 ..> c0097: `type in getEntity`
- c0105 ..> c0097: `type in searchEntities`
- c0105 ..> c0097: `type in updateEntity`
- c0105 ..> c0098: `type in createEntity`
- c0105 ..> c0098: `type in updateEntity`
- c0105 ..> c0099: `type in createRelationship`
- c0105 ..> c0099: `type in getRelationships`
- c0105 ..> c0100: `type in createRelationship`
- c0105 ..> c0103: `type in listFiles`
- c0105 ..> c0107: `type in updateMemory`
- c0105 ..> c0109: `type in updateMemory`
- c0105 ..> c0124: `type in getFile`
- c0106 --> c0107: `field memory`
- c0107 --|> c0109: `inherits`
- c0110 ..> c0115: `type in complete`
- c0110 ..> c0115: `type in prepareCapture`
- c0111 --> c0106: `field linked_memories`
- c0111 --> c0107: `field primary_memories`
- c0115 --> c0093: `field onConversationCompacted`
- c0115 --> c0114: `field readTools`
- c0115 --> c0117: `field submission`
- c0124 --|> c0103: `inherits`
- c0125 --> c0119: `field project`
- c0130 --|> c0131: `inherits`
- c0131 --> c0126: `field status`
- c0133 --> c0129: `field criteria`
- c0133 --|> c0134: `inherits`
- c0134 --> c0136: `field priority`
- c0134 --> c0137: `field state`
- c0135 --|> c0134: `inherits`
- c0138 ..> c0128: `type in taskCounts`
- c0138 ..> c0131: `type in sortPlans`
- c0138 ..> c0132: `type in mappedProject`
- c0138 ..> c0135: `type in activeTasks`
- c0138 ..> c0135: `type in taskCounts`
- c0142 --> c0139: `field outcome`
- c0142 --> c0143: `field state`
- c0144 ..> c0045: `type in checkpoint`
- c0144 ..> c0046: `type in checkpoint`
- c0144 ..> c0089: `type in enqueue`
- c0144 ..> c0102: `type in resolveConflict`
- c0147 --> c0119: `field projects`
- c0147 --|> c0125: `inherits`
- c0148 --> c0075: `field createCapture`
- c0148 --> c0075: `field createRecall`
- c0148 --> c0104: `field client`
- c0148 --> c0104: `field createCapture`
- c0148 --> c0104: `field createClient`
- c0148 --> c0104: `field createRecall`
- c0148 --> c0144: `field capture`
- c0148 --> c0144: `field createCapture`
- c0148 --> c0147: `field resolveWorkContext`
- c0148 --> c0156: `field createRecall`
- c0148 --> c0156: `field recall`
- c0148 --> c0224: `field createCapture`
- c0148 --> c0224: `field createRecall`
- c0149 --> c0078: `field config`
- c0149 --> c0148: `field dependencies`
- c0149 --> c0151: `field policies`
- c0152 --> c0075: `field config`
- c0152 --> c0104: `field client`
- c0152 --> c0147: `field context`
- c0152 --> c0156: `field recall`
- c0152 --> c0212: `field logger`
- c0152 --> c0224: `field model`
- c0153 --> c0122: `field scope`
- c0155 --> c0157: `field runtime`
- c0155 --> c0255: `field promise`
- c0155 --> c0255: `field result`
- c0156 ..> c0102: `type in recall`
- c0156 ..> c0252: `type in deeper`
- c0156 ..> c0254: `type in recall`
- c0156 ..> c0255: `type in deeper`
- c0156 ..> c0255: `type in recall`
- c0157 --> c0004: `field activity`
- c0157 --> c0021: `field planning`
- c0157 --> c0043: `field captureDeferrals`
- c0157 --> c0046: `field recoveryResult`
- c0157 --> c0075: `field config`
- c0157 --> c0104: `field client`
- c0157 --> c0143: `field pendingCaptureJobs`
- c0157 --> c0144: `field capture`
- c0157 --> c0147: `field context`
- c0157 --> c0153: `field lastRecall`
- c0157 --> c0156: `field recall`
- c0157 --> c0212: `field logger`
- c0157 --> c0224: `field model`
- c0157 --> c0232: `field queue`
- c0159 --> c0140: `field automaticRecalls`
- c0159 --> c0150: `field pendingQueuedRecall`
- c0159 --> c0155: `field recallJobs`
- c0159 --> c0157: `field loading`
- c0159 --> c0157: `field runtime`
- c0160 ..> c0004: `collectCaptureFeedback() calls set()`
- c0160 ..> c0004: `diagnosticCandidateDetail() calls set()`
- c0160 ..> c0004: `pickMemoryModel() calls refresh()`
- c0160 ..> c0008: `createForgetfulExtension() calls setPromptActive()`
- c0160 ..> c0046: `type in captureProcessedJobIds`
- c0160 ..> c0046: `type in readCaptureOutcome`
- c0160 ..> c0065: `log() calls emit()`
- c0160 ..> c0065: `logFailure() calls emit()`
- c0160 ..> c0065: `readCaptureOutcome() calls diagnostics()`
- c0160 ..> c0065: `recordRecallActivity() calls emit()`
- c0160 ..> c0065: `textMessage() calls now()`
- c0160 ..> c0075: `type in log`
- c0160 ..> c0075: `type in logFailure`
- c0160 ..> c0075: `type in makeInstanceId`
- c0160 ..> c0075: `type in policyText`
- c0160 ..> c0075: `type in promptSetupEndpoint`
- c0160 ..> c0079: `type in parseSelection`
- c0160 ..> c0085: `type in log`
- c0160 ..> c0102: `type in recallContextEntries`
- c0160 ..> c0139: `type in automaticCaptureJobOutcome`
- c0160 ..> c0139: `type in readCaptureOutcome`
- c0160 ..> c0139: `type in recordCaptureRetry`
- c0160 ..> c0141: `type in boundedWait`
- c0160 ..> c0142: `type in automaticCaptureFeedback`
- c0160 ..> c0142: `type in collectCaptureFeedback`
- c0160 ..> c0142: `type in recordCaptureRetry`
- c0160 ..> c0144: `type in readCaptureOutcome`
- c0160 ..> c0146: `type in collectDiagnosticParts`
- c0160 ..> c0147: `type in defaultWorkContext`
- c0160 ..> c0147: `type in discoverWorkContext`
- c0160 ..> c0147: `type in snapshotWorkContext`
- c0160 ..> c0149: `type in createForgetfulExtension`
- c0160 ..> c0151: `type in policyText`
- c0160 ..> c0153: `type in recallActivitySummary`
- c0160 ..> c0157: `type in conflictBelongsToActiveBranch`
- c0160 ..> c0157: `type in readCaptureOutcome`
- c0160 ..> c0157: `type in recordRecallActivity`
- c0160 ..> c0158: `type in promptSetupAuthentication`
- c0160 ..> c0160: `automaticCaptureFeedback() calls captureCount()`
- c0160 ..> c0160: `automaticCaptureFeedback() calls captureFeedbackParts()`
- c0160 ..> c0160: `automaticCaptureFeedback() calls collectCaptureFeedback()`
- c0160 ..> c0160: `automaticCaptureJobOutcome() calls boundedErrorDiagnostic()`
- c0160 ..> c0160: `automaticCaptureJobOutcome() calls captureFeedbackReason()`
- c0160 ..> c0160: `automaticRecallTerminalText() calls usefulRecallText()`
- c0160 ..> c0160: `canonicalRepository() calls qualifiedRepository()`
- c0160 ..> c0160: `captureFailurePart() calls captureCount()`
- c0160 ..> c0160: `captureFeedbackParts() calls captureCount()`
- c0160 ..> c0160: `captureFeedbackParts() calls captureFailurePart()`
- c0160 ..> c0160: `captureFeedbackParts() calls skippedReasonBreakdown()`
- c0160 ..> c0160: `collectCaptureFeedback() calls recordCaptureRetry()`
- c0160 ..> c0160: `collectDiagnosticParts() calls diagnosticCandidateDetail()`
- c0160 ..> c0160: `createForgetfulExtension() calls logFailure()`
- c0160 ..> c0160: `createForgetfulExtension() calls notify()`
- c0160 ..> c0160: `createForgetfulExtension() calls sessionKey()`
- c0160 ..> c0160: `diagnosticCandidateDetail() calls diagnosticSourceIds()`
- c0160 ..> c0160: `diagnosticSummary() calls collectDiagnosticParts()`
- c0160 ..> c0160: `discoverWorkContext() calls canonicalRepository()`
- c0160 ..> c0160: `discoverWorkContext() calls defaultWorkContext()`
- c0160 ..> c0160: `latestBranchUserEntry() calls messageContentText()`
- c0160 ..> c0160: `latestContextUserPrompt() calls messageContentText()`
- c0160 ..> c0160: `log() calls notify()`
- c0160 ..> c0160: `logFailure() calls boundedErrorDiagnostic()`
- c0160 ..> c0160: `logFailure() calls log()`
- c0160 ..> c0160: `pickMemoryModel() calls parseSelection()`
- c0160 ..> c0160: `promptSetupAuthentication() calls notify()`
- c0160 ..> c0160: `promptSetupEndpoint() calls notify()`
- c0160 ..> c0160: `promptSetupEndpoint() calls setupEndpointSuggestion()`
- c0160 ..> c0160: `readCaptureOutcome() calls automaticCaptureJobOutcome()`
- c0160 ..> c0160: `recallContextEntries() calls messageContentText()`
- c0160 ..> c0160: `recordRecallActivity() calls log()`
- c0160 ..> c0160: `recordRecallActivity() calls recallActivitySummary()`
- c0160 ..> c0160: `savedRecallResultText() calls usefulRecallText()`
- c0160 ..> c0161: `createForgetfulExtension() calls registerForegroundTool()`
- c0160 ..> c0165: `collectCaptureFeedback() calls get()`
- c0160 ..> c0165: `diagnosticCandidateDetail() calls get()`
- c0160 ..> c0165: `log() calls get()`
- c0160 ..> c0165: `logFailure() calls get()`
- c0160 ..> c0227: `pickMemoryModel() calls availableMemoryModels()`
- c0160 ..> c0227: `pickMemoryModel() calls modelLabel()`
- c0160 ..> c0227: `pickMemoryModel() calls modelSelectionFromModel()`
- c0160 ..> c0228: `automaticCaptureJobOutcome() calls sanitizeText()`
- c0160 ..> c0228: `automaticRecallTerminalText() calls sanitizeText()`
- c0160 ..> c0228: `boundedErrorDiagnostic() calls sanitizeText()`
- c0160 ..> c0228: `captureFeedbackReason() calls sanitizeText()`
- c0160 ..> c0228: `captureJobId() calls sanitizeText()`
- c0160 ..> c0228: `captureProcessedJobIds() calls sanitizeText()`
- c0160 ..> c0228: `diagnosticCandidateDetail() calls sanitizeText()`
- c0160 ..> c0228: `diagnosticSourceIds() calls sanitizeText()`
- c0160 ..> c0228: `log() calls sanitizeText()`
- c0160 ..> c0228: `recallActivitySummary() calls sanitizeText()`
- c0160 ..> c0228: `recallContextEntries() calls sanitizeText()`
- c0160 ..> c0228: `recordRecallActivity() calls sanitizeText()`
- c0160 ..> c0228: `usefulRecallText() calls sanitizeText()`
- c0160 ..> c0255: `type in automaticRecallResultStatus`
- c0160 ..> c0255: `type in automaticRecallTerminalText`
- c0160 ..> c0255: `type in recordRecallActivity`
- c0160 ..> c0255: `type in savedRecallResultText`
- c0160 ..> c0255: `type in usefulRecallText`
- c0160 ..> c0261: `canonicalRepository() calls trim()`
- c0160 ..> c0261: `captureFeedbackReason() calls trim()`
- c0160 ..> c0261: `createForgetfulExtension() calls trim()`
- c0160 ..> c0261: `promptSetupAuthentication() calls trim()`
- c0160 ..> c0261: `promptSetupEndpoint() calls trim()`
- c0160 ..> c0261: `recallContextEntries() calls trim()`
- c0160 ..> c0261: `setupEndpointSuggestion() calls trim()`
- c0160 ..> c0261: `usefulRecallText() calls trim()`
- c0160 ..> c0262: `qualifiedRepository() calls repositoryName()`
- c0162 ..> c0090: `type in createCodeArtifact`
- c0162 ..> c0090: `type in getCodeArtifact`
- c0162 ..> c0091: `type in createCodeArtifact`
- c0162 ..> c0091: `type in updateCodeArtifact`
- c0162 ..> c0092: `type in listCodeArtifacts`
- c0162 ..> c0094: `type in createDocument`
- c0162 ..> c0094: `type in getDocument`
- c0162 ..> c0095: `type in createDocument`
- c0162 ..> c0095: `type in updateDocument`
- c0162 ..> c0096: `type in listDocuments`
- c0162 ..> c0097: `type in createEntity`
- c0162 ..> c0097: `type in getEntity`
- c0162 ..> c0097: `type in searchEntities`
- c0162 ..> c0098: `type in createEntity`
- c0162 ..> c0098: `type in updateEntity`
- c0162 ..> c0099: `type in getRelationships`
- c0162 ..> c0100: `type in createRelationship`
- c0162 ..> c0103: `type in listFiles`
- c0162 ..|> c0105: `implements`
- c0162 --> c0107: `field parseMemory`
- c0162 ..> c0107: `type in constructor`
- c0162 ..> c0109: `type in updateMemory`
- c0162 ..> c0124: `type in getFile`
- c0162 --> c0163: `field request`
- c0162 ..> c0163: `type in constructor`
- c0162 ..> c0164: `createCodeArtifact() calls artifact()`
- c0162 ..> c0164: `createDocument() calls document()`
- c0162 ..> c0164: `createEntity() calls entity()`
- c0162 ..> c0164: `createRelationship() calls relationship()`
- c0162 ..> c0164: `createRelationship() calls requestSegment()`
- c0162 ..> c0164: `getCodeArtifact() calls artifact()`
- c0162 ..> c0164: `getCodeArtifact() calls requestSegment()`
- c0162 ..> c0164: `getDocument() calls document()`
- c0162 ..> c0164: `getDocument() calls requestSegment()`
- c0162 ..> c0164: `getEntity() calls entity()`
- c0162 ..> c0164: `getEntity() calls requestSegment()`
- c0162 ..> c0164: `getEntityMemories() calls id()`
- c0162 ..> c0164: `getEntityMemories() calls object()`
- c0162 ..> c0164: `getEntityMemories() calls records()`
- c0162 ..> c0164: `getEntityMemories() calls requestSegment()`
- c0162 ..> c0164: `getEntityMemories() calls text()`
- c0162 ..> c0164: `getFile() calls fileSummary()`
- c0162 ..> c0164: `getFile() calls object()`
- c0162 ..> c0164: `getFile() calls requestSegment()`
- c0162 ..> c0164: `getFile() calls text()`
- c0162 ..> c0164: `getRelationships() calls records()`
- c0162 ..> c0164: `getRelationships() calls requestSegment()`
- c0162 ..> c0164: `linkEntityMemory() calls object()`
- c0162 ..> c0164: `linkEntityMemory() calls requestSegment()`
- c0162 ..> c0164: `linkMemories() calls ids()`
- c0162 ..> c0164: `linkMemories() calls object()`
- c0162 ..> c0164: `linkMemories() calls requestSegment()`
- c0162 ..> c0164: `listCodeArtifacts() calls projectPath()`
- c0162 ..> c0164: `listCodeArtifacts() calls records()`
- c0162 ..> c0164: `listCodeArtifacts() calls summary()`
- c0162 ..> c0164: `listDocuments() calls projectPath()`
- c0162 ..> c0164: `listDocuments() calls records()`
- c0162 ..> c0164: `listDocuments() calls summary()`
- c0162 ..> c0164: `listFiles() calls projectPath()`
- c0162 ..> c0164: `listFiles() calls records()`
- c0162 ..> c0164: `searchEntities() calls records()`
- c0162 ..> c0164: `unlinkMemories() calls object()`
- c0162 ..> c0164: `unlinkMemories() calls requestSegment()`
- c0162 ..> c0164: `updateCodeArtifact() calls artifact()`
- c0162 ..> c0164: `updateCodeArtifact() calls requestSegment()`
- c0162 ..> c0164: `updateDocument() calls document()`
- c0162 ..> c0164: `updateDocument() calls requestSegment()`
- c0162 ..> c0164: `updateEntity() calls entity()`
- c0162 ..> c0164: `updateEntity() calls requestSegment()`
- c0162 ..> c0164: `updateMemory() calls requestSegment()`
- c0162 ..> c0169: `createCodeArtifact() calls request()`
- c0162 ..> c0169: `createDocument() calls request()`
- c0162 ..> c0169: `createEntity() calls request()`
- c0162 ..> c0169: `createRelationship() calls request()`
- c0162 ..> c0169: `getCodeArtifact() calls request()`
- c0162 ..> c0169: `getDocument() calls request()`
- c0162 ..> c0169: `getEntity() calls request()`
- c0162 ..> c0169: `getEntityMemories() calls request()`
- c0162 ..> c0169: `getFile() calls request()`
- c0162 ..> c0169: `getRelationships() calls request()`
- c0162 ..> c0169: `linkEntityMemory() calls request()`
- c0162 ..> c0169: `linkMemories() calls request()`
- c0162 ..> c0169: `listCodeArtifacts() calls request()`
- c0162 ..> c0169: `listDocuments() calls request()`
- c0162 ..> c0169: `listFiles() calls request()`
- c0162 ..> c0169: `searchEntities() calls request()`
- c0162 ..> c0169: `unlinkMemories() calls request()`
- c0162 ..> c0169: `updateCodeArtifact() calls request()`
- c0162 ..> c0169: `updateDocument() calls request()`
- c0162 ..> c0169: `updateEntity() calls request()`
- c0162 ..> c0169: `updateMemory() calls request()`
- c0162 ..> c0170: `getFile() constructs ForgetfulSchemaError`
- c0162 ..> c0170: `linkEntityMemory() constructs ForgetfulSchemaError`
- c0162 ..> c0170: `linkMemories() constructs ForgetfulSchemaError`
- c0162 ..> c0170: `unlinkMemories() constructs ForgetfulSchemaError`
- c0162 ..> c0172: `linkMemories() calls parseMemory()`
- c0162 ..> c0172: `updateMemory() calls parseMemory()`
- c0164 ..> c0090: `type in artifact`
- c0164 ..> c0091: `type in resourceBody`
- c0164 ..> c0092: `type in summary`
- c0164 ..> c0094: `type in document`
- c0164 ..> c0095: `type in resourceBody`
- c0164 ..> c0096: `type in summary`
- c0164 ..> c0097: `type in entity`
- c0164 ..> c0098: `type in entityBody`
- c0164 ..> c0099: `type in relationship`
- c0164 ..> c0100: `type in relationshipBody`
- c0164 ..> c0103: `type in fileSummary`
- c0164 ..> c0121: `type in provenance`
- c0164 ..> c0164: `artifact() calls id()`
- c0164 ..> c0164: `artifact() calls object()`
- c0164 ..> c0164: `artifact() calls resourceBody()`
- c0164 ..> c0164: `document() calls id()`
- c0164 ..> c0164: `document() calls object()`
- c0164 ..> c0164: `document() calls resourceBody()`
- c0164 ..> c0164: `entity() calls entityBody()`
- c0164 ..> c0164: `entity() calls id()`
- c0164 ..> c0164: `entity() calls object()`
- c0164 ..> c0164: `entityBody() calls ids()`
- c0164 ..> c0164: `entityBody() calls object()`
- c0164 ..> c0164: `entityBody() calls provenance()`
- c0164 ..> c0164: `entityBody() calls strings()`
- c0164 ..> c0164: `entityBody() calls text()`
- c0164 ..> c0164: `fileSummary() calls id()`
- c0164 ..> c0164: `fileSummary() calls object()`
- c0164 ..> c0164: `fileSummary() calls strings()`
- c0164 ..> c0164: `fileSummary() calls text()`
- c0164 ..> c0164: `memoryMetadata() calls ids()`
- c0164 ..> c0164: `memoryMetadata() calls provenance()`
- c0164 ..> c0164: `provenance() calls strings()`
- c0164 ..> c0164: `provenance() calls text()`
- c0164 ..> c0164: `records() calls object()`
- c0164 ..> c0164: `relationship() calls id()`
- c0164 ..> c0164: `relationship() calls object()`
- c0164 ..> c0164: `relationship() calls relationshipBody()`
- c0164 ..> c0164: `relationshipBody() calls id()`
- c0164 ..> c0164: `relationshipBody() calls object()`
- c0164 ..> c0164: `relationshipBody() calls provenance()`
- c0164 ..> c0164: `relationshipBody() calls text()`
- c0164 ..> c0164: `resourceBody() calls id()`
- c0164 ..> c0164: `resourceBody() calls object()`
- c0164 ..> c0164: `resourceBody() calls provenance()`
- c0164 ..> c0164: `resourceBody() calls strings()`
- c0164 ..> c0164: `resourceBody() calls text()`
- c0164 ..> c0164: `summary() calls id()`
- c0164 ..> c0164: `summary() calls object()`
- c0164 ..> c0164: `summary() calls provenance()`
- c0164 ..> c0164: `summary() calls strings()`
- c0164 ..> c0164: `summary() calls text()`
- c0164 ..> c0170: `entityBody() constructs ForgetfulSchemaError`
- c0164 ..> c0170: `fileSummary() constructs ForgetfulSchemaError`
- c0164 ..> c0170: `id() constructs ForgetfulSchemaError`
- c0164 ..> c0170: `ids() constructs ForgetfulSchemaError`
- c0164 ..> c0170: `object() constructs ForgetfulSchemaError`
- c0164 ..> c0170: `records() constructs ForgetfulSchemaError`
- c0164 ..> c0170: `strings() constructs ForgetfulSchemaError`
- c0164 ..> c0170: `text() constructs ForgetfulSchemaError`
- c0164 ..> c0261: `text() calls trim()`
- c0165 ..> c0004: `listProjects() calls set()`
- c0165 ..|> c0104: `implements`
- c0165 ..> c0107: `type in get`
- c0165 ..> c0107: `type in search`
- c0165 ..> c0108: `type in create`
- c0165 ..> c0109: `type in create`
- c0165 ..> c0111: `type in queryMemory`
- c0165 ..> c0119: `type in createProject`
- c0165 ..> c0119: `type in linkProject`
- c0165 ..> c0119: `type in listProjects`
- c0165 ..> c0120: `type in createProject`
- c0165 ..> c0123: `type in queryMemory`
- c0165 ..> c0123: `type in search`
- c0165 ..> c0164: `get() calls requestSegment()`
- c0165 ..> c0164: `getMemoryEntityIds() calls requestSegment()`
- c0165 ..> c0164: `obsolete() calls requestSegment()`
- c0165 ..> c0165: `linkProject() calls validId()`
- c0165 ..> c0165: `supersede() calls obsolete()`
- c0165 --|> c0169: `inherits`
- c0165 ..> c0169: `create() calls request()`
- c0165 ..> c0169: `createProject() calls request()`
- c0165 ..> c0169: `get() calls request()`
- c0165 ..> c0169: `getMemoryEntityIds() calls request()`
- c0165 ..> c0169: `linkProject() calls request()`
- c0165 ..> c0169: `listProjects() calls endpoint()`
- c0165 ..> c0169: `listProjects() calls request()`
- c0165 ..> c0169: `obsolete() calls request()`
- c0165 ..> c0169: `queryMemory() calls request()`
- c0165 ..> c0169: `search() calls request()`
- c0165 ..> c0170: `create() constructs ForgetfulSchemaError`
- c0165 ..> c0170: `getMemoryEntityIds() constructs ForgetfulSchemaError`
- c0165 ..> c0170: `listProjects() constructs ForgetfulSchemaError`
- c0165 ..> c0170: `obsolete() constructs ForgetfulSchemaError`
- c0165 ..> c0172: `create() calls integerArray()`
- c0165 ..> c0172: `create() calls isObject()`
- c0165 ..> c0172: `create() calls requiredInteger()`
- c0165 ..> c0172: `createProject() calls parseProject()`
- c0165 ..> c0172: `createProject() calls projectText()`
- c0165 ..> c0172: `get() calls parseMemory()`
- c0165 ..> c0172: `getMemoryEntityIds() calls directEntityId()`
- c0165 ..> c0172: `getMemoryEntityIds() calls isObject()`
- c0165 ..> c0172: `linkProject() calls parseProject()`
- c0165 ..> c0172: `listProjects() calls isObject()`
- c0165 ..> c0172: `listProjects() calls parseProject()`
- c0165 ..> c0172: `obsolete() calls isObject()`
- c0165 ..> c0172: `queryMemory() calls defaultWhenOmitted()`
- c0165 ..> c0172: `queryMemory() calls parseSearchPayload()`
- c0165 ..> c0172: `queryMemory() calls searchBody()`
- c0165 ..> c0172: `search() calls flattenSearchResult()`
- c0165 ..> c0172: `search() calls parseSearchPayload()`
- c0165 ..> c0172: `search() calls searchBody()`
- c0165 ..> c0262: `createProject() calls repositoryName()`
- c0165 ..> c0262: `linkProject() calls repositoryName()`
- c0169 ..> c0004: `readResponse() calls set()`
- c0169 ..> c0005: `readResponse() calls read()`
- c0169 ..> c0165: `readResponse() calls get()`
- c0169 ..> c0166: `type in constructor`
- c0169 ..> c0168: `throwResponseError() constructs ForgetfulHttpError`
- c0169 ..> c0169: `getDeployment() calls request()`
- c0169 ..> c0169: `getJson() calls request()`
- c0169 ..> c0169: `request() calls endpoint()`
- c0169 ..> c0169: `request() calls fetchImpl()`
- c0169 ..> c0169: `request() calls readResponse()`
- c0169 ..> c0169: `request() calls responseByteLimit()`
- c0169 ..> c0169: `request() calls throwResponseError()`
- c0169 ..> c0169: `throwResponseError() calls readResponse()`
- c0169 ..> c0170: `readResponse() constructs ForgetfulSchemaError`
- c0169 ..> c0171: `request() constructs ForgetfulTimeoutError`
- c0169 ..> c0172: `constructor() calls localHost()`
- c0169 ..> c0172: `constructor() calls trimTrailingSlashes()`
- c0169 ..> c0172: `request() calls makeAbortError()`
- c0169 ..> c0172: `request() calls parseJson()`
- c0169 ..> c0232: `readResponse() calls cancel()`
- c0172 ..> c0004: `uniqueMemories() calls set()`
- c0172 ..> c0106: `type in parseLinkedMemories`
- c0172 ..> c0107: `type in flattenSearchResult`
- c0172 ..> c0107: `type in parseMemory`
- c0172 ..> c0107: `type in uniqueMemories`
- c0172 ..> c0111: `type in flattenSearchResult`
- c0172 ..> c0111: `type in parseSearchPayload`
- c0172 ..> c0119: `type in parseProject`
- c0172 ..> c0123: `type in searchBody`
- c0172 ..> c0164: `parseMemory() calls memoryMetadata()`
- c0172 ..> c0167: `makeAbortError() constructs ForgetfulAbortError`
- c0172 ..> c0167: `type in makeAbortError`
- c0172 ..> c0170: `directEntityId() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `integerArray() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `nonNegativeInteger() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `optionalString() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `parseJson() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `parseLinkedMemories() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `parseMemory() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `parseProject() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `parseSearchPayload() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `requiredInteger() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `requiredString() constructs ForgetfulSchemaError`
- c0172 ..> c0170: `stringArray() constructs ForgetfulSchemaError`
- c0172 ..> c0172: `directEntityId() calls isObject()`
- c0172 ..> c0172: `directEntityId() calls requiredInteger()`
- c0172 ..> c0172: `flattenSearchResult() calls uniqueMemories()`
- c0172 ..> c0172: `parseLinkedMemories() calls isObject()`
- c0172 ..> c0172: `parseLinkedMemories() calls parseMemory()`
- c0172 ..> c0172: `parseLinkedMemories() calls requiredInteger()`
- c0172 ..> c0172: `parseMemory() calls integerArray()`
- c0172 ..> c0172: `parseMemory() calls isObject()`
- c0172 ..> c0172: `parseMemory() calls nonNegativeInteger()`
- c0172 ..> c0172: `parseMemory() calls optionalString()`
- c0172 ..> c0172: `parseMemory() calls requiredInteger()`
- c0172 ..> c0172: `parseMemory() calls requiredString()`
- c0172 ..> c0172: `parseMemory() calls stringArray()`
- c0172 ..> c0172: `parseProject() calls isObject()`
- c0172 ..> c0172: `parseProject() calls optionalString()`
- c0172 ..> c0172: `parseProject() calls requiredInteger()`
- c0172 ..> c0172: `parseProject() calls requiredString()`
- c0172 ..> c0172: `parseSearchPayload() calls isObject()`
- c0172 ..> c0172: `parseSearchPayload() calls nonNegativeInteger()`
- c0172 ..> c0172: `parseSearchPayload() calls parseLinkedMemories()`
- c0172 ..> c0172: `parseSearchPayload() calls parseMemory()`
- c0172 ..> c0172: `parseSearchPayload() calls requiredString()`
- c0172 ..> c0172: `searchBody() calls defaultWhenOmitted()`
- c0172 ..> c0261: `projectText() calls trim()`
- c0173 --> c0090: `field artifacts`
- c0173 --> c0094: `field documents`
- c0173 --> c0103: `field files`
- c0174 --|> c0175: `inherits`
- c0174 --> c0176: `field failures`
- c0175 --> c0107: `field memories`
- c0175 --> c0122: `field scope`
- c0177 ..> c0004: `collectRelationships() calls set()`
- c0177 ..> c0004: `findEntities() calls set()`
- c0177 ..> c0004: `resolveRelationshipEndpoints() calls set()`
- c0177 ..> c0090: `type in appendArtifactLines`
- c0177 ..> c0094: `type in appendDocumentLines`
- c0177 ..> c0097: `type in appendEntityLines`
- c0177 ..> c0097: `type in collectEntityMemories`
- c0177 ..> c0097: `type in collectRelationships`
- c0177 ..> c0097: `type in findEntities`
- c0177 ..> c0097: `type in findEntityMemories`
- c0177 ..> c0097: `type in findRelationships`
- c0177 ..> c0097: `type in formatExpansion`
- c0177 ..> c0097: `type in formatRelationships`
- c0177 ..> c0097: `type in resolveRelationshipEndpoints`
- c0177 ..> c0099: `type in collectRelationships`
- c0177 ..> c0099: `type in formatRelationships`
- c0177 ..> c0099: `type in resolveRelationshipEndpoints`
- c0177 ..> c0103: `type in appendFileLines`
- c0177 --> c0105: `field client`
- c0177 ..> c0105: `type in constructor`
- c0177 ..> c0162: `collectRelationships() calls getRelationships()`
- c0177 ..> c0162: `findAttachments() calls getCodeArtifact()`
- c0177 ..> c0162: `findAttachments() calls getDocument()`
- c0177 ..> c0162: `findAttachments() calls listFiles()`
- c0177 ..> c0162: `findEntities() calls getEntity()`
- c0177 ..> c0162: `findEntities() calls searchEntities()`
- c0177 ..> c0162: `findEntityMemories() calls getEntityMemories()`
- c0177 ..> c0162: `resolveRelationshipEndpoints() calls getEntity()`
- c0177 ..> c0165: `formatRelationships() calls get()`
- c0177 ..> c0173: `type in findAttachments`
- c0177 ..> c0173: `type in formatExpansion`
- c0177 ..> c0174: `type in collectEntityMemories`
- c0177 ..> c0174: `type in collectRelationships`
- c0177 ..> c0174: `type in findAttachments`
- c0177 ..> c0174: `type in findEntities`
- c0177 ..> c0174: `type in findEntityMemories`
- c0177 ..> c0174: `type in findRelationships`
- c0177 ..> c0174: `type in isAllowedEntityMemory`
- c0177 ..> c0174: `type in resolveRelationshipEndpoints`
- c0177 ..> c0175: `type in expand`
- c0177 ..> c0175: `type in formatRelationships`
- c0177 ..> c0176: `type in emptyExpansion`
- c0177 ..> c0176: `type in expand`
- c0177 ..> c0176: `type in formatExpansion`
- c0177 ..> c0177: `collectEntityMemories() calls isAllowedEntityMemory()`
- c0177 ..> c0177: `expand() calls emptyExpansion()`
- c0177 ..> c0177: `expand() calls findAttachments()`
- c0177 ..> c0177: `expand() calls findEntities()`
- c0177 ..> c0177: `expand() calls findEntityMemories()`
- c0177 ..> c0177: `expand() calls findRelationships()`
- c0177 ..> c0177: `expand() calls formatExpansion()`
- c0177 ..> c0177: `findEntityMemories() calls collectEntityMemories()`
- c0177 ..> c0177: `findRelationships() calls collectRelationships()`
- c0177 ..> c0177: `findRelationships() calls formatRelationships()`
- c0177 ..> c0177: `findRelationships() calls resolveRelationshipEndpoints()`
- c0177 ..> c0177: `formatExpansion() calls appendArtifactLines()`
- c0177 ..> c0177: `formatExpansion() calls appendDocumentLines()`
- c0177 ..> c0177: `formatExpansion() calls appendEntityLines()`
- c0177 ..> c0177: `formatExpansion() calls appendFileLines()`
- c0177 ..> c0177: `formatExpansion() calls appendLinkedMemoryLines()`
- c0177 ..> c0177: `formatExpansion() calls appendRelationshipLines()`
- c0177 ..> c0178: `type in constructor`
- c0177 ..> c0179: `type in appendLinkedMemoryLines`
- c0177 ..> c0179: `type in collectEntityMemories`
- c0177 ..> c0179: `type in findEntityMemories`
- c0177 ..> c0179: `type in formatExpansion`
- c0177 --> c0180: `field readMemory`
- c0177 ..> c0180: `type in constructor`
- c0177 ..> c0181: `type in appendRelationshipLines`
- c0177 ..> c0181: `type in findRelationships`
- c0177 ..> c0181: `type in formatExpansion`
- c0177 ..> c0181: `type in formatRelationships`
- c0177 ..> c0182: `appendArtifactLines() calls clean()`
- c0177 ..> c0182: `appendDocumentLines() calls clean()`
- c0177 ..> c0182: `appendEntityLines() calls clean()`
- c0177 ..> c0182: `appendFileLines() calls clean()`
- c0177 ..> c0182: `appendLinkedMemoryLines() calls clean()`
- c0177 ..> c0182: `appendRelationshipLines() calls clean()`
- c0177 ..> c0182: `collectEntityMemories() calls validId()`
- c0177 ..> c0182: `collectRelationships() calls safeCall()`
- c0177 ..> c0182: `collectRelationships() calls validRelationship()`
- c0177 ..> c0182: `expand() calls safeCall()`
- c0177 ..> c0182: `findAttachments() calls inProjectScope()`
- c0177 ..> c0182: `findAttachments() calls safeCall()`
- c0177 ..> c0182: `findAttachments() calls validId()`
- c0177 ..> c0182: `findEntities() calls inEntityScope()`
- c0177 ..> c0182: `findEntities() calls safeCall()`
- c0177 ..> c0182: `findEntities() calls validEntity()`
- c0177 ..> c0182: `findEntityMemories() calls safeCall()`
- c0177 ..> c0182: `formatRelationships() calls inEntityScope()`
- c0177 ..> c0182: `isAllowedEntityMemory() calls safeCall()`
- c0177 ..> c0182: `isAllowedEntityMemory() calls validMemory()`
- c0177 ..> c0182: `resolveRelationshipEndpoints() calls safeCall()`
- c0177 ..> c0182: `resolveRelationshipEndpoints() calls validEntity()`
- c0177 ..> c0228: `expand() calls errorMessage()`
- c0177 ..> c0261: `findEntities() calls trim()`
- c0178 --> c0180: `field readMemory`
- c0179 --> c0097: `field entity`
- c0181 --> c0097: `field source`
- c0181 --> c0097: `field target`
- c0181 --> c0099: `field relationship`
- c0182 ..> c0097: `type in inEntityScope`
- c0182 ..> c0097: `type in validEntity`
- c0182 ..> c0099: `type in validRelationship`
- c0182 ..> c0107: `type in validMemory`
- c0182 ..> c0122: `type in inEntityScope`
- c0182 ..> c0122: `type in inProjectScope`
- c0182 ..> c0174: `type in safeCall`
- c0182 ..> c0182: `inEntityScope() calls validId()`
- c0182 ..> c0182: `inProjectScope() calls validId()`
- c0182 ..> c0182: `validEntity() calls validId()`
- c0182 ..> c0182: `validMemory() calls validId()`
- c0182 ..> c0182: `validRelationship() calls validId()`
- c0182 ..> c0228: `clean() calls sanitizeText()`
- c0182 ..> c0228: `safeCall() calls errorMessage()`
- c0182 ..> c0228: `safeCall() calls sanitizeText()`
- c0182 ..> c0261: `validRelationship() calls trim()`
- c0183 --> c0104: `field client`
- c0183 --> c0105: `field knowledge`
- c0183 --> c0184: `field request`
- c0183 --> c0185: `field context`
- c0185 --> c0122: `field scope`
- c0186 --> c0124: `field file`
- c0186 --> c0190: `field content`
- c0186 --> c0191: `field content`
- c0187 --> c0104: `field client`
- c0187 --> c0105: `field knowledge`
- c0187 --> c0185: `field context`
- c0187 --> c0188: `field request`
- c0192 ..> c0090: `type in page`
- c0192 ..> c0094: `type in page`
- c0192 ..> c0097: `type in assertReadEntity`
- c0192 ..> c0097: `type in entityInProject`
- c0192 ..> c0097: `type in hydrateEntities`
- c0192 ..> c0097: `type in inEntityProject`
- c0192 ..> c0101: `type in isEntityType`
- c0192 ..> c0104: `type in assertReadMemory`
- c0192 ..> c0104: `type in createMemory`
- c0192 ..> c0104: `type in executeKnowledgeRead`
- c0192 ..> c0104: `type in executeKnowledgeWrite`
- c0192 ..> c0104: `type in memoryInProject`
- c0192 ..> c0104: `type in resolveWriteProject`
- c0192 ..> c0104: `type in rich`
- c0192 ..> c0105: `type in assertReadEntity`
- c0192 ..> c0105: `type in createCodeArtifact`
- c0192 ..> c0105: `type in createDocument`
- c0192 ..> c0105: `type in createEntity`
- c0192 ..> c0105: `type in entityInProject`
- c0192 ..> c0105: `type in hydrateEntities`
- c0192 ..> c0105: `type in requireReadKnowledge`
- c0192 ..> c0105: `type in rich`
- c0192 ..> c0105: `type in validateAttachments`
- c0192 ..> c0107: `type in assertReadMemory`
- c0192 ..> c0107: `type in inMemoryProject`
- c0192 ..> c0107: `type in memoryInProject`
- c0192 ..> c0107: `type in replacementMemory`
- c0192 ..> c0121: `type in updateProvenance`
- c0192 ..> c0124: `type in fileContent`
- c0192 ..> c0162: `assertReadEntity() calls getEntity()`
- c0192 ..> c0162: `createCodeArtifact() calls createCodeArtifact()`
- c0192 ..> c0162: `createDocument() calls createDocument()`
- c0192 ..> c0162: `createEntity() calls createEntity()`
- c0192 ..> c0162: `createRelationship() calls createRelationship()`
- c0192 ..> c0162: `entityInProject() calls getEntity()`
- c0192 ..> c0162: `hydrateEntities() calls getEntity()`
- c0192 ..> c0162: `linkEntityMemory() calls linkEntityMemory()`
- c0192 ..> c0162: `linkMemories() calls linkMemories()`
- c0192 ..> c0162: `readCodeArtifact() calls getCodeArtifact()`
- c0192 ..> c0162: `readCodeArtifacts() calls listCodeArtifacts()`
- c0192 ..> c0162: `readDocument() calls getDocument()`
- c0192 ..> c0162: `readDocuments() calls listDocuments()`
- c0192 ..> c0162: `readEntities() calls searchEntities()`
- c0192 ..> c0162: `readEntityMemories() calls getEntityMemories()`
- c0192 ..> c0162: `readFile() calls getFile()`
- c0192 ..> c0162: `readFiles() calls listFiles()`
- c0192 ..> c0162: `readRelationships() calls getEntity()`
- c0192 ..> c0162: `readRelationships() calls getRelationships()`
- c0192 ..> c0162: `updateCodeArtifact() calls getCodeArtifact()`
- c0192 ..> c0162: `updateCodeArtifact() calls updateCodeArtifact()`
- c0192 ..> c0162: `updateDocument() calls getDocument()`
- c0192 ..> c0162: `updateDocument() calls updateDocument()`
- c0192 ..> c0162: `updateEntity() calls updateEntity()`
- c0192 ..> c0162: `updateMemory() calls updateMemory()`
- c0192 ..> c0162: `validateAttachments() calls getCodeArtifact()`
- c0192 ..> c0162: `validateAttachments() calls getDocument()`
- c0192 ..> c0162: `validateAttachments() calls getFile()`
- c0192 ..> c0165: `assertReadMemory() calls get()`
- c0192 ..> c0165: `createMemory() calls create()`
- c0192 ..> c0165: `memoryInProject() calls get()`
- c0192 ..> c0165: `readEntityMemories() calls get()`
- c0192 ..> c0165: `readMemories() calls queryMemory()`
- c0192 ..> c0165: `readProjects() calls listProjects()`
- c0192 ..> c0165: `replacementMemory() calls create()`
- c0192 ..> c0165: `replacementMemory() calls get()`
- c0192 ..> c0165: `resolveWriteProject() calls listProjects()`
- c0192 ..> c0165: `supersedeMemory() calls supersede()`
- c0192 ..> c0183: `type in readCodeArtifact`
- c0192 ..> c0183: `type in readCodeArtifacts`
- c0192 ..> c0183: `type in readDocument`
- c0192 ..> c0183: `type in readDocuments`
- c0192 ..> c0183: `type in readEntities`
- c0192 ..> c0183: `type in readEntity`
- c0192 ..> c0183: `type in readEntityMemories`
- c0192 ..> c0183: `type in readFile`
- c0192 ..> c0183: `type in readFiles`
- c0192 ..> c0183: `type in readMemories`
- c0192 ..> c0183: `type in readMemory`
- c0192 ..> c0183: `type in readProjects`
- c0192 ..> c0183: `type in readRelationships`
- c0192 ..> c0183: `type in requestedReadProject`
- c0192 ..> c0183: `type in requireReadKnowledge`
- c0192 ..> c0184: `type in executeKnowledgeRead`
- c0192 ..> c0184: `type in validateKnowledgeReadRequest`
- c0192 ..> c0185: `type in assertReadEntity`
- c0192 ..> c0185: `type in assertReadMemory`
- c0192 ..> c0185: `type in createCodeArtifact`
- c0192 ..> c0185: `type in createDocument`
- c0192 ..> c0185: `type in createEntity`
- c0192 ..> c0185: `type in createMemory`
- c0192 ..> c0185: `type in currentProject`
- c0192 ..> c0185: `type in effectiveCommit`
- c0192 ..> c0185: `type in executeKnowledgeRead`
- c0192 ..> c0185: `type in executeKnowledgeWrite`
- c0192 ..> c0185: `type in provenance`
- c0192 ..> c0185: `type in resolveWriteProject`
- c0192 ..> c0185: `type in updateProvenance`
- c0192 ..> c0186: `type in createCodeArtifact`
- c0192 ..> c0186: `type in createDocument`
- c0192 ..> c0186: `type in createEntity`
- c0192 ..> c0186: `type in createMemory`
- c0192 ..> c0186: `type in createRelationship`
- c0192 ..> c0186: `type in executeKnowledgeRead`
- c0192 ..> c0186: `type in executeKnowledgeWrite`
- c0192 ..> c0186: `type in linkEntityMemory`
- c0192 ..> c0186: `type in linkMemories`
- c0192 ..> c0186: `type in readCodeArtifact`
- c0192 ..> c0186: `type in readCodeArtifacts`
- c0192 ..> c0186: `type in readDocument`
- c0192 ..> c0186: `type in readDocuments`
- c0192 ..> c0186: `type in readEntities`
- c0192 ..> c0186: `type in readEntity`
- c0192 ..> c0186: `type in readEntityMemories`
- c0192 ..> c0186: `type in readFile`
- c0192 ..> c0186: `type in readFiles`
- c0192 ..> c0186: `type in readMemories`
- c0192 ..> c0186: `type in readMemory`
- c0192 ..> c0186: `type in readProjects`
- c0192 ..> c0186: `type in readRelationships`
- c0192 ..> c0186: `type in readResult`
- c0192 ..> c0186: `type in supersedeMemory`
- c0192 ..> c0186: `type in updateCodeArtifact`
- c0192 ..> c0186: `type in updateDocument`
- c0192 ..> c0186: `type in updateEntity`
- c0192 ..> c0186: `type in updateMemory`
- c0192 ..> c0186: `type in writeResult`
- c0192 ..> c0187: `type in createRelationship`
- c0192 ..> c0187: `type in linkEntityMemory`
- c0192 ..> c0187: `type in linkMemories`
- c0192 ..> c0187: `type in replacementMemory`
- c0192 ..> c0187: `type in supersedeMemory`
- c0192 ..> c0187: `type in updateCodeArtifact`
- c0192 ..> c0187: `type in updateDocument`
- c0192 ..> c0187: `type in updateEntity`
- c0192 ..> c0187: `type in updateMemory`
- c0192 ..> c0188: `type in executeKnowledgeWrite`
- c0192 ..> c0188: `type in validateKnowledgeWriteRequest`
- c0192 ..> c0189: `type in resolveWriteProject`
- c0192 ..> c0190: `type in fileContent`
- c0192 ..> c0191: `type in fileContent`
- c0192 ..> c0192: `assertReadEntity() calls currentProject()`
- c0192 ..> c0192: `assertReadEntity() calls inEntityProject()`
- c0192 ..> c0192: `assertReadMemory() calls currentProject()`
- c0192 ..> c0192: `assertReadMemory() calls inMemoryProject()`
- c0192 ..> c0192: `boundedId() calls optionalId()`
- c0192 ..> c0192: `boundedListPage() calls compactWriteValue()`
- c0192 ..> c0192: `boundedListPage() calls json()`
- c0192 ..> c0192: `boundedListPage() calls listPage()`
- c0192 ..> c0192: `commit() calls optionalText()`
- c0192 ..> c0192: `compactObjectEntry() calls compactWriteValue()`
- c0192 ..> c0192: `compactWriteValue() calls compactObjectEntry()`
- c0192 ..> c0192: `compactWriteValue() calls compactString()`
- c0192 ..> c0192: `createCodeArtifact() calls beforeMutation()`
- c0192 ..> c0192: `createCodeArtifact() calls provenance()`
- c0192 ..> c0192: `createCodeArtifact() calls writeResult()`
- c0192 ..> c0192: `createDocument() calls beforeMutation()`
- c0192 ..> c0192: `createDocument() calls provenance()`
- c0192 ..> c0192: `createDocument() calls writeResult()`
- c0192 ..> c0192: `createEntity() calls beforeMutation()`
- c0192 ..> c0192: `createEntity() calls provenance()`
- c0192 ..> c0192: `createEntity() calls writeResult()`
- c0192 ..> c0192: `createMemory() calls beforeMutation()`
- c0192 ..> c0192: `createMemory() calls provenance()`
- c0192 ..> c0192: `createMemory() calls rich()`
- c0192 ..> c0192: `createMemory() calls validateAttachments()`
- c0192 ..> c0192: `createMemory() calls writeResult()`
- c0192 ..> c0192: `createRelationship() calls beforeMutation()`
- c0192 ..> c0192: `createRelationship() calls entityInProject()`
- c0192 ..> c0192: `createRelationship() calls provenance()`
- c0192 ..> c0192: `createRelationship() calls writeResult()`
- c0192 ..> c0192: `executeKnowledgeRead() calls currentProject()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readCodeArtifact()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readCodeArtifacts()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readDocument()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readDocuments()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readEntities()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readEntity()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readEntityMemories()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readFile()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readFiles()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readMemories()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readMemory()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readProjects()`
- c0192 ..> c0192: `executeKnowledgeRead() calls readRelationships()`
- c0192 ..> c0192: `executeKnowledgeRead() calls validateKnowledgeReadRequest()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls createCodeArtifact()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls createDocument()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls createEntity()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls createMemory()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls createRelationship()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls effectiveCommit()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls linkEntityMemory()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls linkMemories()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls rejectSensitiveInput()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls resolveWriteProject()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls rich()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls supersedeMemory()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls updateCodeArtifact()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls updateDocument()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls updateEntity()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls updateMemory()`
- c0192 ..> c0192: `executeKnowledgeWrite() calls validateKnowledgeWriteRequest()`
- c0192 ..> c0192: `fileContent() calls json()`
- c0192 ..> c0192: `linkEntityMemory() calls beforeMutation()`
- c0192 ..> c0192: `linkEntityMemory() calls entityInProject()`
- c0192 ..> c0192: `linkEntityMemory() calls memoryInProject()`
- c0192 ..> c0192: `linkEntityMemory() calls writeResult()`
- c0192 ..> c0192: `linkMemories() calls beforeMutation()`
- c0192 ..> c0192: `linkMemories() calls memoryInProject()`
- c0192 ..> c0192: `linkMemories() calls writeResult()`
- c0192 ..> c0192: `need() calls requiredText()`
- c0192 ..> c0192: `optionalId() calls requiredId()`
- c0192 ..> c0192: `optionalIds() calls requiredIds()`
- c0192 ..> c0192: `optionalStrings() calls requiredStrings()`
- c0192 ..> c0192: `optionalText() calls requiredText()`
- c0192 ..> c0192: `provenance() calls effectiveCommit()`
- c0192 ..> c0192: `readCodeArtifact() calls page()`
- c0192 ..> c0192: `readCodeArtifact() calls readResult()`
- c0192 ..> c0192: `readCodeArtifact() calls requireReadKnowledge()`
- c0192 ..> c0192: `readCodeArtifacts() calls boundedListPage()`
- c0192 ..> c0192: `readCodeArtifacts() calls readResult()`
- c0192 ..> c0192: `readCodeArtifacts() calls requestedReadProject()`
- c0192 ..> c0192: `readCodeArtifacts() calls requireReadKnowledge()`
- c0192 ..> c0192: `readDocument() calls page()`
- c0192 ..> c0192: `readDocument() calls readResult()`
- c0192 ..> c0192: `readDocument() calls requireReadKnowledge()`
- c0192 ..> c0192: `readDocuments() calls boundedListPage()`
- c0192 ..> c0192: `readDocuments() calls readResult()`
- c0192 ..> c0192: `readDocuments() calls requestedReadProject()`
- c0192 ..> c0192: `readDocuments() calls requireReadKnowledge()`
- c0192 ..> c0192: `readEntities() calls boundedListPage()`
- c0192 ..> c0192: `readEntities() calls hydrateEntities()`
- c0192 ..> c0192: `readEntities() calls inEntityProject()`
- c0192 ..> c0192: `readEntities() calls readResult()`
- c0192 ..> c0192: `readEntities() calls requestedReadProject()`
- c0192 ..> c0192: `readEntities() calls requireReadKnowledge()`
- c0192 ..> c0192: `readEntity() calls assertReadEntity()`
- c0192 ..> c0192: `readEntity() calls readResult()`
- c0192 ..> c0192: `readEntity() calls requireReadKnowledge()`
- c0192 ..> c0192: `readEntityMemories() calls assertReadEntity()`
- c0192 ..> c0192: `readEntityMemories() calls compactWriteValue()`
- c0192 ..> c0192: `readEntityMemories() calls inMemoryProject()`
- c0192 ..> c0192: `readEntityMemories() calls listPage()`
- c0192 ..> c0192: `readEntityMemories() calls readResult()`
- c0192 ..> c0192: `readEntityMemories() calls requireReadKnowledge()`
- c0192 ..> c0192: `readFile() calls fileContent()`
- c0192 ..> c0192: `readFile() calls requireReadKnowledge()`
- c0192 ..> c0192: `readFiles() calls boundedListPage()`
- c0192 ..> c0192: `readFiles() calls readResult()`
- c0192 ..> c0192: `readFiles() calls requestedReadProject()`
- c0192 ..> c0192: `readFiles() calls requireReadKnowledge()`
- c0192 ..> c0192: `readMemories() calls inMemoryProject()`
- c0192 ..> c0192: `readMemories() calls readResult()`
- c0192 ..> c0192: `readMemories() calls requestedReadProject()`
- c0192 ..> c0192: `readMemory() calls assertReadMemory()`
- c0192 ..> c0192: `readMemory() calls readResult()`
- c0192 ..> c0192: `readProjects() calls boundedListPage()`
- c0192 ..> c0192: `readProjects() calls readResult()`
- c0192 ..> c0192: `readRelationships() calls assertReadEntity()`
- c0192 ..> c0192: `readRelationships() calls inEntityProject()`
- c0192 ..> c0192: `readRelationships() calls listPage()`
- c0192 ..> c0192: `readRelationships() calls readResult()`
- c0192 ..> c0192: `readRelationships() calls requireReadKnowledge()`
- c0192 ..> c0192: `readResult() calls json()`
- c0192 ..> c0192: `rejectSensitiveInput() calls containsSensitiveData()`
- c0192 ..> c0192: `replacementMemory() calls beforeMutation()`
- c0192 ..> c0192: `replacementMemory() calls memoryInProject()`
- c0192 ..> c0192: `replacementMemory() calls provenance()`
- c0192 ..> c0192: `replacementMemory() calls validateAttachments()`
- c0192 ..> c0192: `requestedReadProject() calls currentProject()`
- c0192 ..> c0192: `requiredIds() calls requiredId()`
- c0192 ..> c0192: `requiredStrings() calls requiredText()`
- c0192 ..> c0192: `resolveWriteProject() calls currentProject()`
- c0192 ..> c0192: `supersedeMemory() calls beforeMutation()`
- c0192 ..> c0192: `supersedeMemory() calls memoryInProject()`
- c0192 ..> c0192: `supersedeMemory() calls replacementMemory()`
- c0192 ..> c0192: `supersedeMemory() calls writeResult()`
- c0192 ..> c0192: `updateCodeArtifact() calls beforeMutation()`
- c0192 ..> c0192: `updateCodeArtifact() calls updateProvenance()`
- c0192 ..> c0192: `updateCodeArtifact() calls writeResult()`
- c0192 ..> c0192: `updateDocument() calls beforeMutation()`
- c0192 ..> c0192: `updateDocument() calls updateProvenance()`
- c0192 ..> c0192: `updateDocument() calls writeResult()`
- c0192 ..> c0192: `updateEntity() calls beforeMutation()`
- c0192 ..> c0192: `updateEntity() calls entityInProject()`
- c0192 ..> c0192: `updateEntity() calls updateProvenance()`
- c0192 ..> c0192: `updateEntity() calls writeResult()`
- c0192 ..> c0192: `updateMemory() calls beforeMutation()`
- c0192 ..> c0192: `updateMemory() calls memoryInProject()`
- c0192 ..> c0192: `updateMemory() calls updateProvenance()`
- c0192 ..> c0192: `updateMemory() calls validateAttachments()`
- c0192 ..> c0192: `updateMemory() calls writeResult()`
- c0192 ..> c0192: `updateProvenance() calls effectiveCommit()`
- c0192 ..> c0192: `validateEntityFields() calls isEntityType()`
- c0192 ..> c0192: `validateEntityFields() calls optionalText()`
- c0192 ..> c0192: `validateKnowledgeReadRequest() calls checkOperation()`
- c0192 ..> c0192: `validateKnowledgeReadRequest() calls record()`
- c0192 ..> c0192: `validateKnowledgeReadRequest() calls validateReadPagination()`
- c0192 ..> c0192: `validateKnowledgeReadRequest() calls validateReadSearch()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls checkOperation()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls commit()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls need()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls optionalId()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls optionalIds()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls optionalImportance()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls optionalStrings()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls optionalText()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls record()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls requiredId()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls requiredIds()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls requiredStrings()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls requiredText()`
- c0192 ..> c0192: `validateKnowledgeWriteRequest() calls validateEntityFields()`
- c0192 ..> c0192: `validateReadPagination() calls boundedId()`
- c0192 ..> c0192: `writeResult() calls compactWriteValue()`
- c0192 ..> c0192: `writeResult() calls json()`
- c0192 ..> c0214: `replacementMemory() calls replacementMemoryContext()`
- c0192 ..> c0228: `containsSensitiveData() calls hasSensitiveData()`
- c0192 ..> c0261: `requiredText() calls trim()`
- c0192 ..> c0261: `resolveWriteProject() calls trim()`
- c0194 --> c0091: `field input`
- c0195 --> c0095: `field input`
- c0197 --> c0098: `field input`
- c0199 --> c0100: `field input`
- c0202 --> c0194: `field codeArtifacts`
- c0202 --> c0195: `field documents`
- c0202 --> c0196: `field entityMemoryLinks`
- c0202 --> c0197: `field entities`
- c0202 --> c0199: `field relationships`
- c0205 --> c0203: `field codeArtifacts`
- c0205 --> c0203: `field documents`
- c0205 --> c0203: `field entities`
- c0205 --> c0203: `field relationships`
- c0206 ..> c0090: `type in writeCodeArtifact`
- c0206 ..> c0094: `type in writeDocument`
- c0206 ..> c0097: `type in writeEntity`
- c0206 ..> c0099: `type in writeRelationship`
- c0206 ..> c0107: `type in attachmentIds`
- c0206 ..> c0107: `type in attachmentMemory`
- c0206 ..> c0107: `type in attachmentsDiffer`
- c0206 ..> c0162: `writeAttachments() calls updateMemory()`
- c0206 ..> c0162: `writeCodeArtifact() calls createCodeArtifact()`
- c0206 ..> c0162: `writeCodeArtifact() calls getCodeArtifact()`
- c0206 ..> c0162: `writeDocument() calls createDocument()`
- c0206 ..> c0162: `writeDocument() calls getDocument()`
- c0206 ..> c0162: `writeEntity() calls createEntity()`
- c0206 ..> c0162: `writeEntity() calls getEntity()`
- c0206 ..> c0162: `writeEntityMemoryLink() calls linkEntityMemory()`
- c0206 ..> c0162: `writeLinkedMemory() calls linkMemories()`
- c0206 ..> c0162: `writeRelationship() calls createRelationship()`
- c0206 ..> c0165: `createOnce() calls create()`
- c0206 ..> c0177: `attachmentMemory() calls readMemory()`
- c0206 ..> c0193: `type in attachmentIds`
- c0206 ..> c0193: `type in attachmentPatch`
- c0206 ..> c0193: `type in attachmentsDiffer`
- c0206 ..> c0193: `type in requestedAttachmentIds`
- c0206 ..> c0194: `type in writeCodeArtifact`
- c0206 ..> c0195: `type in writeDocument`
- c0206 ..> c0196: `type in writeEntityMemoryLink`
- c0206 ..> c0197: `type in writeEntity`
- c0206 --> c0198: `field readMemory`
- c0206 ..> c0198: `type in constructor`
- c0206 ..> c0199: `type in writeRelationship`
- c0206 ..> c0200: `type in execute`
- c0206 ..> c0201: `type in createOnce`
- c0206 ..> c0201: `type in execute`
- c0206 ..> c0201: `type in writeAttachments`
- c0206 ..> c0201: `type in writeCodeArtifact`
- c0206 ..> c0201: `type in writeCodeArtifacts`
- c0206 ..> c0201: `type in writeConnection`
- c0206 ..> c0201: `type in writeDocument`
- c0206 ..> c0201: `type in writeDocuments`
- c0206 ..> c0201: `type in writeEntities`
- c0206 ..> c0201: `type in writeEntity`
- c0206 ..> c0201: `type in writeEntityMemoryLink`
- c0206 ..> c0201: `type in writeEntityMemoryLinks`
- c0206 ..> c0201: `type in writeLinkedMemories`
- c0206 ..> c0201: `type in writeLinkedMemory`
- c0206 ..> c0201: `type in writeRelationship`
- c0206 ..> c0201: `type in writeRelationships`
- c0206 ..> c0202: `type in attachmentMemory`
- c0206 ..> c0202: `type in createOnce`
- c0206 ..> c0202: `type in execute`
- c0206 ..> c0202: `type in requestedAttachmentIds`
- c0206 ..> c0202: `type in writeAttachments`
- c0206 ..> c0202: `type in writeCodeArtifact`
- c0206 ..> c0202: `type in writeCodeArtifacts`
- c0206 ..> c0202: `type in writeConnection`
- c0206 ..> c0202: `type in writeDocument`
- c0206 ..> c0202: `type in writeDocuments`
- c0206 ..> c0202: `type in writeEntities`
- c0206 ..> c0202: `type in writeEntity`
- c0206 ..> c0202: `type in writeEntityMemoryLink`
- c0206 ..> c0202: `type in writeEntityMemoryLinks`
- c0206 ..> c0202: `type in writeLinkedMemories`
- c0206 ..> c0202: `type in writeLinkedMemory`
- c0206 ..> c0202: `type in writeRelationship`
- c0206 ..> c0202: `type in writeRelationships`
- c0206 ..> c0204: `type in createOnce`
- c0206 ..> c0204: `type in recordCreateFailure`
- c0206 ..> c0204: `type in writeAttachments`
- c0206 ..> c0204: `type in writeCodeArtifact`
- c0206 ..> c0204: `type in writeCodeArtifacts`
- c0206 ..> c0204: `type in writeConnection`
- c0206 ..> c0204: `type in writeDocument`
- c0206 ..> c0204: `type in writeDocuments`
- c0206 ..> c0204: `type in writeEntities`
- c0206 ..> c0204: `type in writeEntity`
- c0206 ..> c0204: `type in writeEntityMemoryLink`
- c0206 ..> c0204: `type in writeEntityMemoryLinks`
- c0206 ..> c0204: `type in writeLinkedMemories`
- c0206 ..> c0204: `type in writeLinkedMemory`
- c0206 ..> c0204: `type in writeRelationship`
- c0206 ..> c0204: `type in writeRelationships`
- c0206 ..> c0205: `type in createOnce`
- c0206 ..> c0205: `type in execute`
- c0206 ..> c0205: `type in recordCreateFailure`
- c0206 ..> c0205: `type in requestedAttachmentIds`
- c0206 ..> c0205: `type in writeAttachments`
- c0206 ..> c0205: `type in writeCodeArtifact`
- c0206 ..> c0205: `type in writeCodeArtifacts`
- c0206 ..> c0205: `type in writeConnection`
- c0206 ..> c0205: `type in writeDocument`
- c0206 ..> c0205: `type in writeDocuments`
- c0206 ..> c0205: `type in writeEntities`
- c0206 ..> c0205: `type in writeEntity`
- c0206 ..> c0205: `type in writeEntityMemoryLink`
- c0206 ..> c0205: `type in writeEntityMemoryLinks`
- c0206 ..> c0205: `type in writeLinkedMemories`
- c0206 ..> c0205: `type in writeLinkedMemory`
- c0206 ..> c0205: `type in writeRelationship`
- c0206 ..> c0205: `type in writeRelationships`
- c0206 ..> c0206: `createOnce() calls recordCreateFailure()`
- c0206 ..> c0206: `execute() calls writeAttachments()`
- c0206 ..> c0206: `execute() calls writeCodeArtifacts()`
- c0206 ..> c0206: `execute() calls writeDocuments()`
- c0206 ..> c0206: `execute() calls writeEntities()`
- c0206 ..> c0206: `execute() calls writeEntityMemoryLinks()`
- c0206 ..> c0206: `execute() calls writeLinkedMemories()`
- c0206 ..> c0206: `execute() calls writeRelationships()`
- c0206 ..> c0206: `writeAttachments() calls attachmentIds()`
- c0206 ..> c0206: `writeAttachments() calls attachmentMemory()`
- c0206 ..> c0206: `writeAttachments() calls attachmentPatch()`
- c0206 ..> c0206: `writeAttachments() calls attachmentsDiffer()`
- c0206 ..> c0206: `writeAttachments() calls requestedAttachmentIds()`
- c0206 ..> c0206: `writeAttachments() calls writeConnection()`
- c0206 ..> c0206: `writeCodeArtifact() calls createOnce()`
- c0206 ..> c0206: `writeCodeArtifacts() calls writeCodeArtifact()`
- c0206 ..> c0206: `writeConnection() calls execute()`
- c0206 ..> c0206: `writeDocument() calls createOnce()`
- c0206 ..> c0206: `writeDocuments() calls writeDocument()`
- c0206 ..> c0206: `writeEntities() calls writeEntity()`
- c0206 ..> c0206: `writeEntity() calls createOnce()`
- c0206 ..> c0206: `writeEntityMemoryLink() calls writeConnection()`
- c0206 ..> c0206: `writeEntityMemoryLinks() calls writeEntityMemoryLink()`
- c0206 ..> c0206: `writeLinkedMemories() calls writeLinkedMemory()`
- c0206 ..> c0206: `writeLinkedMemory() calls writeConnection()`
- c0206 ..> c0206: `writeRelationship() calls createOnce()`
- c0206 ..> c0206: `writeRelationships() calls writeRelationship()`
- c0206 ..> c0207: `type in writeCodeArtifact`
- c0206 ..> c0207: `type in writeDocument`
- c0206 ..> c0207: `type in writeEntity`
- c0206 ..> c0207: `type in writeRelationship`
- c0206 --> c0208: `field client`
- c0206 ..> c0208: `type in constructor`
- c0206 ..> c0209: `attachmentIds() calls uniqueIds()`
- c0206 ..> c0209: `attachmentsDiffer() calls sameIds()`
- c0206 ..> c0209: `createOnce() calls positiveId()`
- c0206 ..> c0209: `execute() calls copyState()`
- c0206 ..> c0209: `execute() calls instructionId()`
- c0206 ..> c0209: `execute() calls normalizedState()`
- c0206 ..> c0209: `recordCreateFailure() calls rejectedCreate()`
- c0206 ..> c0209: `requestedAttachmentIds() calls selectedIds()`
- c0206 ..> c0209: `requestedAttachmentIds() calls uniqueIds()`
- c0206 ..> c0209: `writeCodeArtifacts() calls positiveId()`
- c0206 ..> c0209: `writeCodeArtifacts() calls resourceSlots()`
- c0206 ..> c0209: `writeCodeArtifacts() calls stateId()`
- c0206 ..> c0209: `writeCodeArtifacts() calls stateWithNumber()`
- c0206 ..> c0209: `writeConnection() calls rejectedCreate()`
- c0206 ..> c0209: `writeDocuments() calls positiveId()`
- c0206 ..> c0209: `writeDocuments() calls resourceSlots()`
- c0206 ..> c0209: `writeDocuments() calls stateId()`
- c0206 ..> c0209: `writeDocuments() calls stateWithNumber()`
- c0206 ..> c0209: `writeEntities() calls positiveId()`
- c0206 ..> c0209: `writeEntities() calls resourceSlots()`
- c0206 ..> c0209: `writeEntities() calls stateId()`
- c0206 ..> c0209: `writeEntities() calls stateWithNumber()`
- c0206 ..> c0209: `writeEntityMemoryLink() calls hasValue()`
- c0206 ..> c0209: `writeEntityMemoryLink() calls stateId()`
- c0206 ..> c0209: `writeLinkedMemory() calls hasValue()`
- c0206 ..> c0209: `writeRelationship() calls stateId()`
- c0206 ..> c0209: `writeRelationships() calls positiveId()`
- c0206 ..> c0209: `writeRelationships() calls resourceSlots()`
- c0206 ..> c0209: `writeRelationships() calls stateId()`
- c0206 ..> c0209: `writeRelationships() calls stateWithNumber()`
- c0206 ..> c0228: `createOnce() calls errorMessage()`
- c0206 ..> c0228: `writeConnection() calls errorMessage()`
- c0206 ..> c0274: `createOnce() calls inspect()`
- c0206 ..> c0274: `writeConnection() calls inspect()`
- c0209 ..> c0004: `resourceSlots() calls set()`
- c0209 ..> c0165: `resourceSlots() calls get()`
- c0209 ..> c0202: `type in instructionId`
- c0209 ..> c0203: `type in receipts`
- c0209 ..> c0203: `type in selectedIds`
- c0209 ..> c0203: `type in stateId`
- c0209 ..> c0203: `type in stateWithNumber`
- c0209 ..> c0205: `type in copyState`
- c0209 ..> c0205: `type in normalizedState`
- c0209 ..> c0207: `type in resourceSlots`
- c0209 ..> c0209: `normalizedState() calls receipts()`
- c0209 ..> c0209: `receipts() calls positiveId()`
- c0209 ..> c0209: `selectedIds() calls positiveId()`
- c0209 ..> c0209: `selectedIds() calls resourceSlots()`
- c0209 ..> c0209: `selectedIds() calls stateId()`
- c0209 ..> c0209: `stateWithNumber() calls positiveId()`
- c0212 ..> c0065: `flush() calls resolve()`
- c0212 ..|> c0210: `implements`
- c0212 --> c0211: `field level`
- c0212 --> c0211: `field options`
- c0212 ..> c0211: `type in constructor`
- c0212 ..> c0211: `type in setLevel`
- c0212 ..> c0212: `close() calls flush()`
- c0212 ..> c0212: `emit() calls enqueue()`
- c0212 ..> c0212: `emit() calls warn()`
- c0212 ..> c0212: `enqueue() calls rotate()`
- c0212 ..> c0212: `enqueue() calls warn()`
- c0212 ..> c0212: `flush() calls warn()`
- c0212 ..> c0213: `constructor() calls limit()`
- c0212 ..> c0213: `enqueue() calls excludeCredentials()`
- c0212 ..> c0213: `enqueue() calls pruneDirectory()`
- c0212 ..> c0228: `enqueue() calls sanitizeValue()`
- c0213 ..> c0011: `pruneDirectory() calls current()`
- c0213 ..> c0213: `pruneDirectory() calls listLogFiles()`
- c0213 ..> c0213: `pruneDirectory() calls processExited()`
- c0214 ..> c0109: `type in replacementMemoryInput`
- c0214 ..> c0214: `replacementMemoryInput() calls replacementMemoryContext()`
- c0214 ..> c0228: `storedMemoryContext() calls sanitizeText()`
- c0217 --> c0219: `field complete`
- c0218 ..> c0065: `applySummary() calls now()`
- c0218 --> c0215: `field compactedHistory`
- c0218 ..> c0215: `type in constructor`
- c0218 ..> c0215: `type in getCompactedHistory`
- c0218 ..> c0215: `type in prepare`
- c0218 ..> c0215: `type in prepareCapture`
- c0218 ..> c0215: `type in prepareContext`
- c0218 ..> c0218: `prepare() calls prepareContext()`
- c0218 ..> c0218: `prepareCapture() calls outputAllowance()`
- c0218 ..> c0218: `prepareCapture() calls prepareContext()`
- c0218 ..> c0218: `prepareContext() calls applySummary()`
- c0218 ..> c0218: `prepareContext() calls getCompactedHistory()`
- c0218 ..> c0218: `prepareContext() calls outputAllowance()`
- c0218 ..> c0219: `type in prepare`
- c0218 ..> c0219: `type in prepareCapture`
- c0218 ..> c0219: `type in prepareContext`
- c0218 ..> c0220: `applySummary() calls contextTokens()`
- c0218 ..> c0220: `constructor() calls compactionSettings()`
- c0218 ..> c0220: `constructor() calls privateContextWindow()`
- c0218 ..> c0220: `outputAllowance() calls resolvedOutputAllowance()`
- c0218 ..> c0220: `prepareContext() calls assertImageSupport()`
- c0218 ..> c0220: `prepareContext() calls contextTokens()`
- c0218 ..> c0220: `prepareContext() calls outputCeiling()`
- c0218 ..> c0220: `prepareContext() calls recentCutIndex()`
- c0218 ..> c0220: `prepareContext() calls summarizeMemoryHistory()`
- c0218 ..> c0261: `applySummary() calls trim()`
- c0220 ..> c0065: `summarizeMemoryHistory() calls now()`
- c0220 ..> c0112: `type in evidencePageContent`
- c0220 ..> c0216: `assertFits() constructs ContextWindowError`
- c0220 ..> c0216: `smallerSummaryBatch() constructs ContextWindowError`
- c0220 ..> c0217: `type in summarizeMemoryHistory`
- c0220 ..> c0220: `assertFits() calls contextTokens()`
- c0220 ..> c0220: `contextTokens() calls textTokens()`
- c0220 ..> c0220: `evidenceMessage() calls modelEvidence()`
- c0220 ..> c0220: `evidencePageContent() calls evidenceMessage()`
- c0220 ..> c0220: `modelEvidence() calls objectRecord()`
- c0220 ..> c0220: `outputCeiling() calls validatePositiveSafeInteger()`
- c0220 ..> c0220: `privateContextWindow() calls validatePositiveSafeInteger()`
- c0220 ..> c0220: `recentCutIndex() calls entriesFor()`
- c0220 ..> c0220: `resolvedOutputAllowance() calls assertFits()`
- c0220 ..> c0220: `resolvedOutputAllowance() calls contextTokens()`
- c0220 ..> c0220: `resolvedOutputAllowance() calls outputCeiling()`
- c0220 ..> c0220: `summarizeMemoryHistory() calls assertImageSupport()`
- c0220 ..> c0220: `summarizeMemoryHistory() calls compactionSettings()`
- c0220 ..> c0220: `summarizeMemoryHistory() calls privateContextWindow()`
- c0220 ..> c0220: `summarizeMemoryHistory() calls resolvedOutputAllowance()`
- c0220 ..> c0220: `summarizeMemoryHistory() calls smallerSummaryBatch()`
- c0220 ..> c0220: `summarizeMemoryHistory() calls summaryEvidence()`
- c0220 ..> c0220: `summaryEvidence() calls evidenceMessage()`
- c0220 ..> c0224: `summarizeMemoryHistory() calls complete()`
- c0220 ..> c0228: `evidenceMessage() calls sanitizeValue()`
- c0220 ..> c0228: `summarizeMemoryHistory() calls sanitizeText()`
- c0222 --> c0223: `field modelRegistry`
- c0224 ..> c0065: `complete() calls now()`
- c0224 ..> c0065: `completeAttempt() calls now()`
- c0224 ..> c0065: `completeRequest() calls now()`
- c0224 ..> c0065: `completeWithSubmission() calls now()`
- c0224 ..> c0065: `executeRead() calls now()`
- c0224 ..> c0065: `prepareCapture() calls now()`
- c0224 ..> c0074: `completeWithSubmission() calls mapConcurrent()`
- c0224 --> c0079: `field selection`
- c0224 ..> c0079: `type in constructor`
- c0224 ..> c0086: `completeRequest() calls isRecallConcurrency()`
- c0224 ..|> c0110: `implements`
- c0224 ..> c0114: `type in executeRead`
- c0224 ..> c0115: `type in complete`
- c0224 ..> c0115: `type in completeAttempt`
- c0224 ..> c0115: `type in completeRequest`
- c0224 ..> c0115: `type in completeWithSubmission`
- c0224 ..> c0115: `type in emit`
- c0224 ..> c0115: `type in executeRead`
- c0224 ..> c0115: `type in prepareCapture`
- c0224 ..> c0116: `completeWithSubmission() constructs ModelSubmissionError`
- c0224 ..> c0117: `type in validateSubmission`
- c0224 ..> c0206: `executeRead() calls execute()`
- c0224 --> c0210: `field logger`
- c0224 ..> c0212: `complete() calls emit()`
- c0224 ..> c0212: `completeAttempt() calls emit()`
- c0224 ..> c0212: `completeRequest() calls emit()`
- c0224 ..> c0212: `emit() calls emit()`
- c0224 ..> c0212: `prepareCapture() calls emit()`
- c0224 ..> c0218: `completeRequest() calls prepareCapture()`
- c0224 ..> c0218: `completeRequest() constructs MemoryTaskContext`
- c0224 ..> c0218: `completeWithSubmission() calls prepare()`
- c0224 ..> c0220: `completeRequest() calls evidenceMessage()`
- c0224 ..> c0220: `executeRead() calls evidencePageContent()`
- c0224 --> c0221: `field transformHeaders`
- c0224 --> c0223: `field registry`
- c0224 ..> c0223: `type in constructor`
- c0224 ..> c0224: `complete() calls completeRequest()`
- c0224 ..> c0224: `completeAttempt() calls complete()`
- c0224 ..> c0224: `completeRequest() calls completeWithSubmission()`
- c0224 ..> c0224: `completeWithSubmission() calls completeAttempt()`
- c0224 ..> c0224: `completeWithSubmission() calls executeRead()`
- c0224 ..> c0224: `completeWithSubmission() calls validateSubmission()`
- c0224 ..> c0224: `prepareCapture() calls completeRequest()`
- c0224 ..> c0225: `type in constructor`
- c0224 ..> c0226: `type in completeAttempt`
- c0224 ..> c0226: `type in completeWithSubmission`
- c0224 ..> c0226: `type in executeRead`
- c0224 ..> c0227: `complete() calls rejectionText()`
- c0224 ..> c0227: `completeAttempt() calls rejectionText()`
- c0224 ..> c0227: `completeRequest() calls modelLabel()`
- c0224 ..> c0227: `completeRequest() calls requestDeadline()`
- c0224 ..> c0227: `completeRequest() calls requestOptions()`
- c0224 ..> c0227: `completeRequest() calls requestTimeout()`
- c0224 ..> c0227: `completeRequest() calls serializeInput()`
- c0224 ..> c0227: `completeRequest() calls submissionTool()`
- c0224 ..> c0227: `completeRequest() calls throwRequestFailure()`
- c0224 ..> c0227: `completeWithSubmission() calls appendCallCountCorrection()`
- c0224 ..> c0227: `completeWithSubmission() calls ensureCompletionFinished()`
- c0224 ..> c0227: `completeWithSubmission() calls errorToolResult()`
- c0224 ..> c0227: `completeWithSubmission() calls rejectionText()`
- c0224 ..> c0227: `completeWithSubmission() calls sanitizedAssistantForHistory()`
- c0224 ..> c0227: `completeWithSubmission() calls serializeInput()`
- c0224 ..> c0227: `completeWithSubmission() calls submissionTool()`
- c0224 ..> c0227: `completeWithSubmission() calls toolCalls()`
- c0224 ..> c0227: `constructor() calls modelLabel()`
- c0224 ..> c0227: `executeRead() calls errorToolResult()`
- c0224 ..> c0227: `executeRead() calls rejectionText()`
- c0224 ..> c0227: `executeRead() calls serializeInput()`
- c0224 ..> c0227: `executeRead() calls submissionTool()`
- c0224 ..> c0227: `executeRead() calls textBlock()`
- c0224 ..> c0227: `prepareCapture() calls rejectionText()`
- c0224 ..> c0228: `completeRequest() calls sanitizeText()`
- c0224 ..> c0228: `emit() calls sanitizeValue()`
- c0225 --> c0210: `field logger`
- c0225 --> c0221: `field transformHeaders`
- c0227 ..> c0065: `appendCallCountCorrection() calls now()`
- c0227 ..> c0065: `errorToolResult() calls now()`
- c0227 ..> c0079: `type in modelLabel`
- c0227 ..> c0079: `type in modelSelectionFromModel`
- c0227 ..> c0079: `type in resolveMemoryModel`
- c0227 ..> c0114: `type in submissionTool`
- c0227 ..> c0115: `type in ensureCompletionFinished`
- c0227 ..> c0115: `type in requestDeadline`
- c0227 ..> c0115: `type in requestTimeout`
- c0227 ..> c0115: `type in throwRequestFailure`
- c0227 ..> c0117: `type in submissionTool`
- c0227 ..> c0221: `type in requestOptions`
- c0227 ..> c0222: `type in availableMemoryModels`
- c0227 ..> c0223: `type in resolveMemoryModel`
- c0227 ..> c0224: `requestOptions() calls transformHeaders()`
- c0227 ..> c0224: `resolveMemoryModel() constructs PiMemoryModel`
- c0227 ..> c0224: `type in resolveMemoryModel`
- c0227 ..> c0225: `type in resolveMemoryModel`
- c0227 ..> c0226: `type in requestDeadline`
- c0227 ..> c0227: `appendCallCountCorrection() calls errorToolResult()`
- c0227 ..> c0227: `appendCallCountCorrection() calls rejectionText()`
- c0227 ..> c0227: `appendCallCountCorrection() calls sanitizedAssistantForHistory()`
- c0227 ..> c0227: `errorToolResult() calls textBlock()`
- c0227 ..> c0227: `openCodeSessionHeaders() calls isOpenCodeModel()`
- c0227 ..> c0227: `requestOptions() calls openCodeSessionHeaders()`
- c0227 ..> c0227: `sanitizedAssistantForHistory() calls textBlock()`
- c0227 ..> c0228: `appendCallCountCorrection() calls sanitizeText()`
- c0227 ..> c0228: `ensureCompletionFinished() calls sanitizeText()`
- c0227 ..> c0228: `rejectionText() calls errorMessage()`
- c0227 ..> c0228: `sanitizedAssistantForHistory() calls sanitizeText()`
- c0227 ..> c0228: `sanitizedAssistantForHistory() calls sanitizeValue()`
- c0227 ..> c0228: `serializeInput() calls sanitizeText()`
- c0227 ..> c0228: `serializeInput() calls sanitizeValue()`
- c0227 ..> c0228: `throwRequestFailure() calls sanitizeText()`
- c0228 ..> c0228: `errorMessage() calls diagnosticMessage()`
- c0228 ..> c0228: `errorMessage() calls sanitizeText()`
- c0228 ..> c0228: `hasSensitiveData() calls sanitizeText()`
- c0228 ..> c0228: `sanitizeValue() calls sanitizeText()`
- c0228 ..> c0274: `diagnosticMessage() calls inspect()`
- c0231 ..> c0104: `type in initialiseProject`
- c0231 ..> c0104: `type in initialiseProjectForAgent`
- c0231 ..> c0104: `type in promptExistingProject`
- c0231 ..> c0119: `type in existingMapping`
- c0231 ..> c0119: `type in initialiseProject`
- c0231 ..> c0119: `type in initialiseProjectForAgent`
- c0231 ..> c0119: `type in promptExistingProject`
- c0231 ..> c0120: `type in promptNewProject`
- c0231 ..> c0120: `type in validateAgentProjectDetails`
- c0231 ..> c0160: `promptExistingProject() calls notify()`
- c0231 ..> c0165: `initialiseProject() calls createProject()`
- c0231 ..> c0165: `initialiseProject() calls linkProject()`
- c0231 ..> c0165: `initialiseProject() calls listProjects()`
- c0231 ..> c0165: `initialiseProjectForAgent() calls createProject()`
- c0231 ..> c0165: `initialiseProjectForAgent() calls linkProject()`
- c0231 ..> c0165: `initialiseProjectForAgent() calls listProjects()`
- c0231 ..> c0165: `promptExistingProject() calls listProjects()`
- c0231 ..> c0228: `promptExistingProject() calls sanitizeText()`
- c0231 ..> c0228: `promptNewProject() calls sanitizeText()`
- c0231 ..> c0229: `type in initialiseProjectForAgent`
- c0231 ..> c0229: `type in validateAgentProjectDetails`
- c0231 ..> c0230: `existingMapping() constructs ProjectInitError`
- c0231 ..> c0230: `initialiseProject() constructs ProjectInitError`
- c0231 ..> c0230: `initialiseProjectForAgent() constructs ProjectInitError`
- c0231 ..> c0230: `promptExistingProject() constructs ProjectInitError`
- c0231 ..> c0230: `promptNewProject() constructs ProjectInitError`
- c0231 ..> c0230: `validateAgentProjectDetails() constructs ProjectInitError`
- c0231 ..> c0231: `initialiseProject() calls existingMapping()`
- c0231 ..> c0231: `initialiseProject() calls promptExistingProject()`
- c0231 ..> c0231: `initialiseProject() calls promptNewProject()`
- c0231 ..> c0231: `initialiseProjectForAgent() calls existingMapping()`
- c0231 ..> c0231: `initialiseProjectForAgent() calls validateAgentProjectDetails()`
- c0231 ..> c0261: `promptExistingProject() calls trim()`
- c0231 ..> c0261: `promptNewProject() calls trim()`
- c0231 ..> c0261: `validateAgentProjectDetails() calls trim()`
- c0232 ..> c0004: `mutate() calls set()`
- c0232 ..> c0008: `createFileLock() calls open()`
- c0232 ..> c0008: `createFileLock() calls sync()`
- c0232 ..> c0008: `readSnapshot() calls open()`
- c0232 ..> c0008: `storeSnapshot() calls open()`
- c0232 ..> c0008: `storeSnapshot() calls sync()`
- c0232 ..> c0008: `syncDirectory() calls open()`
- c0232 ..> c0008: `syncDirectory() calls sync()`
- c0232 ..> c0008: `writeState() calls open()`
- c0232 ..> c0008: `writeState() calls sync()`
- c0232 ..> c0089: `type in advanceWatermark`
- c0232 ..> c0089: `type in enqueue`
- c0232 ..> c0089: `type in enqueueSnapshot`
- c0232 ..> c0089: `type in reusableHistory`
- c0232 ..> c0093: `type in compactJobSnapshot`
- c0232 ..> c0102: `type in appendInspections`
- c0232 ..> c0119: `type in completeProjectDiscovery`
- c0232 ..> c0125: `type in completeProjectDiscovery`
- c0232 ..> c0125: `type in currentWatermark`
- c0232 ..> c0165: `mutate() calls get()`
- c0232 ..> c0165: `resolveBranchId() calls get()`
- c0232 ..> c0192: `readSnapshot() calls readFile()`
- c0232 ..> c0192: `readState() calls readFile()`
- c0232 ..> c0192: `releaseFileLock() calls readFile()`
- c0232 ..> c0192: `removeAbandonedLock() calls readFile()`
- c0232 ..> c0228: `addConflict() calls sanitizeValue()`
- c0232 ..> c0228: `appendInspections() calls sanitizeValue()`
- c0232 ..> c0232: `acquireFileLock() calls createFileLock()`
- c0232 ..> c0232: `acquireFileLock() calls ensureDirectory()`
- c0232 ..> c0232: `acquireFileLock() calls recoverExistingLock()`
- c0232 ..> c0232: `addConflict() calls mutate()`
- c0232 ..> c0232: `addConflict() calls prune()`
- c0232 ..> c0232: `advanceWatermark() calls mutate()`
- c0232 ..> c0232: `advanceWatermark() calls prune()`
- c0232 ..> c0232: `advanceWatermark() calls updateWatermark()`
- c0232 ..> c0232: `appendInspections() calls readSnapshot()`
- c0232 ..> c0232: `appendInspections() calls storeSnapshot()`
- c0232 ..> c0232: `cancel() calls mutate()`
- c0232 ..> c0232: `checkpoint() calls appendInspections()`
- c0232 ..> c0232: `checkpoint() calls applyCheckpointPatch()`
- c0232 ..> c0232: `checkpoint() calls compactJobSnapshot()`
- c0232 ..> c0232: `checkpoint() calls hydrateJob()`
- c0232 ..> c0232: `checkpoint() calls mutate()`
- c0232 ..> c0232: `checkpoint() calls pruneFailedJobs()`
- c0232 ..> c0232: `checkpoint() calls recordCompletedCapture()`
- c0232 ..> c0232: `checkpoint() calls releaseTerminalSnapshot()`
- c0232 ..> c0232: `claimNext() calls claimJob()`
- c0232 ..> c0232: `claimNext() calls defaultIdentity()`
- c0232 ..> c0232: `claimNext() calls hydrateJob()`
- c0232 ..> c0232: `claimNext() calls matchesBranch()`
- c0232 ..> c0232: `claimNext() calls now()`
- c0232 ..> c0232: `claimNext() calls runningJobCanBeRecovered()`
- c0232 ..> c0232: `collectSnapshots() calls now()`
- c0232 ..> c0232: `collectSnapshots() calls snapshotPath()`
- c0232 ..> c0232: `collectSnapshots() calls syncDirectory()`
- c0232 ..> c0232: `compactJobSnapshot() calls hydrateJob()`
- c0232 ..> c0232: `compactJobSnapshot() calls storeSnapshot()`
- c0232 ..> c0232: `complete() calls checkpoint()`
- c0232 ..> c0232: `completeProjectDiscovery() calls defaultIdentity()`
- c0232 ..> c0232: `completeProjectDiscovery() calls mutate()`
- c0232 ..> c0232: `createFileLock() calls close()`
- c0232 ..> c0232: `createFileLock() calls releaseFileLock()`
- c0232 ..> c0232: `currentWatermark() calls getWatermark()`
- c0232 ..> c0232: `enqueue() calls mutate()`
- c0232 ..> c0232: `enqueue() calls prune()`
- c0232 ..> c0232: `enqueue() calls reusableHistory()`
- c0232 ..> c0232: `enqueue() calls updateWatermark()`
- c0232 ..> c0232: `enqueueSnapshot() calls enqueue()`
- c0232 ..> c0232: `getConflict() calls readState()`
- c0232 ..> c0232: `getJob() calls hydrateJob()`
- c0232 ..> c0232: `getJob() calls mutate()`
- c0232 ..> c0232: `getWatermark() calls readState()`
- c0232 ..> c0232: `hasClaimableWork() calls matchesBranch()`
- c0232 ..> c0232: `hasClaimableWork() calls mutate()`
- c0232 ..> c0232: `hasClaimableWork() calls now()`
- c0232 ..> c0232: `hasClaimableWork() calls runningJobCanBeRecovered()`
- c0232 ..> c0232: `hydrateJob() calls readSnapshot()`
- c0232 ..> c0232: `listJobMetadata() calls mutate()`
- c0232 ..> c0232: `listJobs() calls hydrateJob()`
- c0232 ..> c0232: `listJobs() calls mutate()`
- c0232 ..> c0232: `listPending() calls defaultIdentity()`
- c0232 ..> c0232: `listPending() calls hydrateJob()`
- c0232 ..> c0232: `listPending() calls mutate()`
- c0232 ..> c0232: `listPendingConflicts() calls pendingConflicts()`
- c0232 ..> c0232: `markConflictHandedOff() calls defaultIdentity()`
- c0232 ..> c0232: `markConflictHandedOff() calls getConflict()`
- c0232 ..> c0232: `markConflictHandedOff() calls mutate()`
- c0232 ..> c0232: `markConflictHandedOff() calls withWorkerLock()`
- c0232 ..> c0232: `mutate() calls pruneFailedJobs()`
- c0232 ..> c0232: `mutate() calls readState()`
- c0232 ..> c0232: `mutate() calls withMutationFileLock()`
- c0232 ..> c0232: `mutate() calls writeState()`
- c0232 ..> c0232: `pendingConflicts() calls readState()`
- c0232 ..> c0232: `prune() calls now()`
- c0232 ..> c0232: `readSnapshot() calls close()`
- c0232 ..> c0232: `readSnapshot() calls snapshotPath()`
- c0232 ..> c0232: `recordCompletedCapture() calls hydrateJob()`
- c0232 ..> c0232: `recordCompletedCapture() calls readSnapshot()`
- c0232 ..> c0232: `recordCompletedCapture() calls storeSnapshot()`
- c0232 ..> c0232: `recoverExistingLock() calls removeAbandonedLock()`
- c0232 ..> c0232: `refreshCaptureHistory() calls compactJobSnapshot()`
- c0232 ..> c0232: `refreshCaptureHistory() calls hydrateJob()`
- c0232 ..> c0232: `refreshCaptureHistory() calls mutate()`
- c0232 ..> c0232: `refreshCaptureHistory() calls reusableHistory()`
- c0232 ..> c0232: `releaseProgress() calls mutate()`
- c0232 ..> c0232: `removeAbandonedLock() calls now()`
- c0232 ..> c0232: `resolveBranchId() calls readState()`
- c0232 ..> c0232: `reusableHistory() calls readSnapshot()`
- c0232 ..> c0232: `storeSnapshot() calls close()`
- c0232 ..> c0232: `storeSnapshot() calls readSnapshot()`
- c0232 ..> c0232: `storeSnapshot() calls snapshotPath()`
- c0232 ..> c0232: `storeSnapshot() calls syncDirectory()`
- c0232 ..> c0232: `syncDirectory() calls close()`
- c0232 ..> c0232: `updateConflict() calls mutate()`
- c0232 ..> c0232: `withFileLock() calls acquireFileLock()`
- c0232 ..> c0232: `withMutationFileLock() calls withFileLock()`
- c0232 ..> c0232: `withWorkerLock() calls acquireFileLock()`
- c0232 ..> c0232: `writeState() calls close()`
- c0232 ..> c0232: `writeState() calls collectSnapshots()`
- c0232 ..> c0232: `writeState() calls ensureDirectory()`
- c0232 ..> c0232: `writeState() calls pruneFailedJobs()`
- c0232 ..> c0232: `writeState() calls releaseTerminalSnapshot()`
- c0232 ..> c0232: `writeState() calls storeSnapshot()`
- c0232 ..> c0232: `writeState() calls syncDirectory()`
- c0232 ..> c0233: `type in constructor`
- c0232 ..> c0234: `type in acquireFileLock`
- c0232 ..> c0234: `type in createFileLock`
- c0232 ..> c0236: `type in addConflict`
- c0232 ..> c0236: `type in getConflict`
- c0232 ..> c0236: `type in listPendingConflicts`
- c0232 ..> c0236: `type in pendingConflicts`
- c0232 ..> c0236: `type in updateConflict`
- c0232 ..> c0237: `acquireFileLock() constructs QueueBusyError`
- c0232 ..> c0237: `removeAbandonedLock() constructs QueueBusyError`
- c0232 ..> c0237: `withMutationFileLock() constructs QueueBusyError`
- c0232 ..> c0238: `type in applyCheckpointPatch`
- c0232 ..> c0238: `type in checkpoint`
- c0232 ..> c0239: `type in enqueue`
- c0232 ..> c0239: `type in enqueueSnapshot`
- c0232 ..> c0240: `type in claimNext`
- c0232 ..> c0240: `type in defaultIdentity`
- c0232 ..> c0240: `type in hasClaimableWork`
- c0232 ..> c0240: `type in listJobMetadata`
- c0232 ..> c0240: `type in listJobs`
- c0232 ..> c0240: `type in listPending`
- c0232 ..> c0240: `type in listPendingConflicts`
- c0232 ..> c0240: `type in pendingConflicts`
- c0232 ..> c0240: `type in withWorkerLock`
- c0232 ..> c0241: `type in checkpoint`
- c0232 ..> c0241: `type in claimJob`
- c0232 ..> c0241: `type in claimNext`
- c0232 ..> c0241: `type in complete`
- c0232 ..> c0241: `type in getJob`
- c0232 ..> c0241: `type in hydrateJob`
- c0232 ..> c0241: `type in listJobs`
- c0232 ..> c0241: `type in listPending`
- c0232 ..> c0241: `type in matchesBranch`
- c0232 ..> c0241: `type in refreshCaptureHistory`
- c0232 ..> c0241: `type in runningJobCanBeRecovered`
- c0232 ..> c0242: `type in listJobMetadata`
- c0232 ..> c0244: `type in collectSnapshots`
- c0232 ..> c0244: `type in mutate`
- c0232 ..> c0244: `type in prune`
- c0232 ..> c0244: `type in pruneFailedJobs`
- c0232 ..> c0244: `type in readState`
- c0232 ..> c0244: `type in recordCompletedCapture`
- c0232 ..> c0244: `type in releaseTerminalSnapshot`
- c0232 ..> c0244: `type in updateWatermark`
- c0232 ..> c0244: `type in writeState`
- c0232 ..> c0245: `type in advanceWatermark`
- c0232 ..> c0245: `type in currentWatermark`
- c0232 ..> c0245: `type in getWatermark`
- c0232 ..> c0245: `type in reusableHistory`
- c0232 ..> c0245: `type in updateWatermark`
- c0232 ..> c0246: `type in readSnapshot`
- c0232 ..> c0246: `type in reusableHistory`
- c0232 ..> c0246: `type in storeSnapshot`
- c0232 ..> c0247: `type in appendInspections`
- c0232 ..> c0247: `type in applyCheckpointPatch`
- c0232 ..> c0247: `type in compactJobSnapshot`
- c0232 ..> c0247: `type in hydrateJob`
- c0232 ..> c0247: `type in recordCompletedCapture`
- c0232 ..> c0247: `type in releaseTerminalSnapshot`
- c0232 ..> c0249: `type in advanceWatermark`
- c0232 ..> c0249: `type in updateWatermark`
- c0232 ..> c0250: `addConflict() calls jsonSnapshot()`
- c0232 ..> c0250: `addConflict() calls nowIso()`
- c0232 ..> c0250: `addConflict() calls scrubDiagnostic()`
- c0232 ..> c0250: `advanceWatermark() calls dedupeKey()`
- c0232 ..> c0250: `advanceWatermark() calls jsonSnapshot()`
- c0232 ..> c0250: `appendInspections() calls jsonSnapshot()`
- c0232 ..> c0250: `appendInspections() calls validateInspectionEntry()`
- c0232 ..> c0250: `applyCheckpointPatch() calls jsonSnapshot()`
- c0232 ..> c0250: `applyCheckpointPatch() calls nowIso()`
- c0232 ..> c0250: `applyCheckpointPatch() calls scrubDiagnostic()`
- c0232 ..> c0250: `cancel() calls nowIso()`
- c0232 ..> c0250: `cancel() calls scrubDiagnostic()`
- c0232 ..> c0250: `checkpoint() calls releaseCompletedArtifacts()`
- c0232 ..> c0250: `claimJob() calls nowIso()`
- c0232 ..> c0250: `claimNext() calls identityMatches()`
- c0232 ..> c0250: `claimNext() calls interruptedWrite()`
- c0232 ..> c0250: `collectSnapshots() calls historyCaches()`
- c0232 ..> c0250: `completeProjectDiscovery() calls identityMatches()`
- c0232 ..> c0250: `createFileLock() calls nowIso()`
- c0232 ..> c0250: `enqueue() calls contextKey()`
- c0232 ..> c0250: `enqueue() calls dedupeKey()`
- c0232 ..> c0250: `enqueue() calls jobIdFor()`
- c0232 ..> c0250: `enqueue() calls jsonSnapshot()`
- c0232 ..> c0250: `enqueue() calls nowIso()`
- c0232 ..> c0250: `getConflict() calls jsonSnapshot()`
- c0232 ..> c0250: `getWatermark() calls contextKey()`
- c0232 ..> c0250: `getWatermark() calls jsonSnapshot()`
- c0232 ..> c0250: `getWatermark() calls nowIso()`
- c0232 ..> c0250: `hasClaimableWork() calls identityMatches()`
- c0232 ..> c0250: `hasClaimableWork() calls interruptedWrite()`
- c0232 ..> c0250: `hydrateJob() calls jsonSnapshot()`
- c0232 ..> c0250: `listJobMetadata() calls identityMatches()`
- c0232 ..> c0250: `listJobs() calls identityMatches()`
- c0232 ..> c0250: `listPending() calls identityMatches()`
- c0232 ..> c0250: `markConflictHandedOff() calls conflictIdentityMatches()`
- c0232 ..> c0250: `markConflictHandedOff() calls interruptedWrite()`
- c0232 ..> c0250: `markConflictHandedOff() calls nowIso()`
- c0232 ..> c0250: `pendingConflicts() calls conflictIdentityMatches()`
- c0232 ..> c0250: `pendingConflicts() calls jsonSnapshot()`
- c0232 ..> c0250: `prune() calls clearHistoryCache()`
- c0232 ..> c0250: `prune() calls contextKey()`
- c0232 ..> c0250: `prune() calls historyCaches()`
- c0232 ..> c0250: `prune() calls setHistoryCaches()`
- c0232 ..> c0250: `prune() calls shouldRetain()`
- c0232 ..> c0250: `readState() calls normaliseState()`
- c0232 ..> c0250: `recordCompletedCapture() calls contextKey()`
- c0232 ..> c0250: `recordCompletedCapture() calls cursorComparison()`
- c0232 ..> c0250: `recordCompletedCapture() calls historyCaches()`
- c0232 ..> c0250: `recordCompletedCapture() calls nowIso()`
- c0232 ..> c0250: `recordCompletedCapture() calls orderedSourceEntryIds()`
- c0232 ..> c0250: `recordCompletedCapture() calls setHistoryCaches()`
- c0232 ..> c0250: `recordCompletedCapture() calls summaryCursor()`
- c0232 ..> c0250: `refreshCaptureHistory() calls contextKey()`
- c0232 ..> c0250: `refreshCaptureHistory() calls cursorComparison()`
- c0232 ..> c0250: `refreshCaptureHistory() calls interruptedWrite()`
- c0232 ..> c0250: `refreshCaptureHistory() calls orderedSourceEntryIds()`
- c0232 ..> c0250: `refreshCaptureHistory() calls recordId()`
- c0232 ..> c0250: `releaseProgress() calls nowIso()`
- c0232 ..> c0250: `removeAbandonedLock() calls isProcessAlive()`
- c0232 ..> c0250: `resolveBranchId() calls contextKey()`
- c0232 ..> c0250: `reusableHistory() calls diagnosticError()`
- c0232 ..> c0250: `reusableHistory() calls historyCaches()`
- c0232 ..> c0250: `reusableHistory() calls orderedSourceEntryIds()`
- c0232 ..> c0250: `reusableHistory() calls setHistoryCaches()`
- c0232 ..> c0250: `runningJobCanBeRecovered() calls isProcessAlive()`
- c0232 ..> c0250: `updateConflict() calls jsonSnapshot()`
- c0232 ..> c0250: `updateConflict() calls nowIso()`
- c0232 ..> c0250: `updateWatermark() calls contextKey()`
- c0232 ..> c0250: `updateWatermark() calls nowIso()`
- c0232 ..> c0250: `writeState() calls releaseCompletedArtifacts()`
- c0232 ..> c0261: `reusableHistory() calls trim()`
- c0232 ..> c0270: `compactJobSnapshot() calls compactCaptureSnapshot()`
- c0232 ..> c0270: `enqueue() calls reuseCaptureHistory()`
- c0232 ..> c0270: `enqueue() calls sanitizeCaptureSnapshot()`
- c0232 ..> c0270: `refreshCaptureHistory() calls captureConversation()`
- c0232 ..> c0270: `writeState() calls sanitizeCaptureSnapshot()`
- c0236 --> c0102: `field replacement`
- c0236 --> c0109: `field replacement`
- c0236 --> c0125: `field context`
- c0236 --> c0240: `field binding`
- c0236 --> c0248: `field supersession`
- c0238 --> c0093: `field compactedConversation`
- c0238 --> c0102: `field inspectionEntries`
- c0238 --> c0243: `field status`
- c0238 --> c0248: `field supersession`
- c0241 --> c0089: `field snapshot`
- c0241 --> c0240: `field binding`
- c0241 --> c0243: `field status`
- c0241 --> c0248: `field supersession`
- c0242 --> c0089: `field snapshot`
- c0244 --> c0236: `field conflicts`
- c0244 --> c0245: `field watermarks`
- c0244 --> c0247: `field jobs`
- c0245 --> c0235: `field historyAlternatives`
- c0247 --|> c0241: `inherits`
- c0250 ..> c0089: `type in dedupeKey`
- c0250 ..> c0089: `type in orderedSourceEntryIds`
- c0250 ..> c0089: `type in summaryCursor`
- c0250 ..> c0102: `type in validateInspectionEntry`
- c0250 ..> c0165: `releaseCompletedArtifacts() calls get()`
- c0250 ..> c0228: `scrubDiagnostic() calls sanitizeText()`
- c0250 ..> c0232: `nowIso() calls now()`
- c0250 ..> c0235: `type in historyCaches`
- c0250 ..> c0235: `type in setHistoryCaches`
- c0250 ..> c0236: `type in conflictIdentityMatches`
- c0250 ..> c0240: `type in conflictIdentityMatches`
- c0250 ..> c0240: `type in identityMatches`
- c0250 ..> c0241: `type in identityMatches`
- c0250 ..> c0241: `type in interruptedWrite`
- c0250 ..> c0244: `type in normaliseState`
- c0250 ..> c0245: `type in clearHistoryCache`
- c0250 ..> c0245: `type in historyCaches`
- c0250 ..> c0245: `type in setHistoryCaches`
- c0250 ..> c0247: `type in releaseCompletedArtifacts`
- c0250 ..> c0250: `conflictIdentityMatches() calls identityMatches()`
- c0250 ..> c0250: `interruptedWrite() calls outcomeRecord()`
- c0250 ..> c0250: `releaseCompletedArtifacts() calls outcomeRecord()`
- c0250 ..> c0250: `releaseCompletedArtifacts() calls scrubDiagnostic()`
- c0250 ..> c0250: `setHistoryCaches() calls clearHistoryCache()`
- c0250 ..> c0250: `summaryCursor() calls orderedSourceEntryIds()`
- c0252 --> c0119: `field projects`
- c0252 --> c0122: `field scope`
- c0252 --> c0125: `field context`
- c0254 --> c0102: `field sessionContext`
- c0254 --> c0115: `field diagnosticContext`
- c0254 --> c0119: `field projects`
- c0254 --> c0122: `field scope`
- c0254 --> c0125: `field context`
- c0254 --> c0253: `field onPlan`
- c0255 --> c0122: `field scope`
- c0256 ..> c0011: `resultWithKnowledge() calls visible()`
- c0256 ..> c0074: `searchMemories() calls mapConcurrent()`
- c0256 ..> c0086: `constructor() calls isRecallConcurrency()`
- c0256 ..> c0086: `deeper() calls resolveScope()`
- c0256 ..> c0086: `recall() calls resolveScope()`
- c0256 --> c0104: `field client`
- c0256 ..> c0104: `type in constructor`
- c0256 ..> c0107: `type in memoryInScope`
- c0256 ..> c0107: `type in optionalKnowledge`
- c0256 --> c0110: `field model`
- c0256 ..> c0110: `type in constructor`
- c0256 ..> c0114: `type in recallReadTool`
- c0256 ..> c0119: `type in matchResolution`
- c0256 ..> c0119: `type in resolveScope`
- c0256 ..> c0122: `type in empty`
- c0256 ..> c0122: `type in memoryInScope`
- c0256 ..> c0122: `type in optionalKnowledge`
- c0256 ..> c0122: `type in requestsDifferentProject`
- c0256 ..> c0122: `type in resolveScope`
- c0256 ..> c0122: `type in searchMemories`
- c0256 ..> c0122: `type in searchRequest`
- c0256 ..> c0123: `type in searchRequest`
- c0256 ..> c0125: `type in contextProjectResolution`
- c0256 ..> c0125: `type in resolveScope`
- c0256 ..> c0125: `type in searchRequest`
- c0256 ..> c0165: `deeper() calls search()`
- c0256 ..> c0165: `resolveScope() calls listProjects()`
- c0256 ..> c0165: `searchMemories() calls search()`
- c0256 ..> c0176: `type in optionalKnowledge`
- c0256 ..> c0176: `type in resultWithKnowledge`
- c0256 --> c0177: `field knowledge`
- c0256 ..> c0177: `constructor() constructs KnowledgeReadService`
- c0256 ..> c0177: `optionalKnowledge() calls expand()`
- c0256 ..> c0192: `recallReadTool() calls executeKnowledgeRead()`
- c0256 ..> c0224: `recall() calls complete()`
- c0256 ..> c0228: `deeper() calls sanitizeText()`
- c0256 ..> c0228: `finishReview() calls sanitizeText()`
- c0256 ..> c0228: `optionalKnowledge() calls errorMessage()`
- c0256 ..> c0228: `plannerInput() calls sanitizeText()`
- c0256 ..> c0228: `queryContext() calls sanitizeText()`
- c0256 ..> c0228: `recall() calls sanitizeText()`
- c0256 ..> c0228: `recall() calls sanitizeValue()`
- c0256 ..> c0228: `searchFailure() calls errorMessage()`
- c0256 ..> c0228: `searchFailure() calls sanitizeValue()`
- c0256 ..> c0251: `type in authorizeProjectSelection`
- c0256 ..> c0251: `type in ensureLive`
- c0256 ..> c0251: `type in finishFailure`
- c0256 ..> c0251: `type in searchMemories`
- c0256 ..> c0252: `type in deeper`
- c0256 ..> c0253: `type in authorizeProjectSelection`
- c0256 ..> c0253: `type in queryContext`
- c0256 ..> c0253: `type in requestsDifferentProject`
- c0256 ..> c0253: `type in searchMemories`
- c0256 ..> c0253: `type in searchRequest`
- c0256 ..> c0254: `type in authorizeProjectSelection`
- c0256 ..> c0254: `type in finishFailure`
- c0256 ..> c0254: `type in plannerInput`
- c0256 ..> c0254: `type in recall`
- c0256 ..> c0254: `type in recallReadTool`
- c0256 ..> c0254: `type in requestsDifferentProject`
- c0256 ..> c0254: `type in searchMemories`
- c0256 ..> c0255: `type in deeper`
- c0256 ..> c0255: `type in empty`
- c0256 ..> c0255: `type in finishFailure`
- c0256 ..> c0255: `type in finishReview`
- c0256 ..> c0255: `type in recall`
- c0256 ..> c0255: `type in recallReadTool`
- c0256 ..> c0255: `type in resultWithKnowledge`
- c0256 ..> c0256: `authorizeProjectSelection() calls requestsDifferentProject()`
- c0256 ..> c0256: `circuitOpen() calls now()`
- c0256 ..> c0256: `deeper() calls circuitOpen()`
- c0256 ..> c0256: `deeper() calls empty()`
- c0256 ..> c0256: `deeper() calls memoryInScope()`
- c0256 ..> c0256: `deeper() calls optionalKnowledge()`
- c0256 ..> c0256: `deeper() calls recordFailure()`
- c0256 ..> c0256: `deeper() calls recordSuccess()`
- c0256 ..> c0256: `deeper() calls resultWithKnowledge()`
- c0256 ..> c0256: `finishFailure() calls empty()`
- c0256 ..> c0256: `finishFailure() calls recordFailure()`
- c0256 ..> c0256: `finishReview() calls recordFailure()`
- c0256 ..> c0256: `finishReview() calls recordSuccess()`
- c0256 ..> c0256: `recall() calls authorizeProjectSelection()`
- c0256 ..> c0256: `recall() calls circuitOpen()`
- c0256 ..> c0256: `recall() calls empty()`
- c0256 ..> c0256: `recall() calls ensureLive()`
- c0256 ..> c0256: `recall() calls finishFailure()`
- c0256 ..> c0256: `recall() calls finishReview()`
- c0256 ..> c0256: `recall() calls memoryInScope()`
- c0256 ..> c0256: `recall() calls optionalKnowledge()`
- c0256 ..> c0256: `recall() calls plannerInput()`
- c0256 ..> c0256: `recall() calls recallReadTool()`
- c0256 ..> c0256: `recall() calls recordSuccess()`
- c0256 ..> c0256: `recall() calls resultWithKnowledge()`
- c0256 ..> c0256: `recall() calls searchMemories()`
- c0256 ..> c0256: `recall() calls searchRequest()`
- c0256 ..> c0256: `recordFailure() calls now()`
- c0256 ..> c0256: `resolveScope() calls contextProjectResolution()`
- c0256 ..> c0256: `resolveScope() calls matchResolution()`
- c0256 ..> c0256: `searchMemories() calls ensureLive()`
- c0256 ..> c0256: `searchMemories() calls searchFailure()`
- c0256 ..> c0256: `searchMemories() calls searchRequest()`
- c0256 ..> c0256: `searchRequest() calls queryContext()`
- c0256 ..> c0257: `type in constructor`
- c0256 ..> c0258: `finishReview() constructs ReviewValidationError`
- c0256 ..> c0259: `type in contextProjectResolution`
- c0256 ..> c0259: `type in matchResolution`
- c0256 ..> c0259: `type in recallReadTool`
- c0256 ..> c0259: `type in resolveScope`
- c0256 ..> c0259: `type in searchMemories`
- c0256 ..> c0259: `type in searchRequest`
- c0256 ..> c0260: `type in searchMemories`
- c0256 ..> c0261: `authorizeProjectSelection() calls raceAbort()`
- c0256 ..> c0261: `deeper() calls createDeadlineSignal()`
- c0256 ..> c0261: `deeper() calls failureReason()`
- c0256 ..> c0261: `deeper() calls formatRecall()`
- c0256 ..> c0261: `deeper() calls isForgetfulResponseError()`
- c0256 ..> c0261: `deeper() calls raceAbort()`
- c0256 ..> c0261: `deeper() calls trim()`
- c0256 ..> c0261: `ensureLive() calls abortError()`
- c0256 ..> c0261: `finishFailure() calls failureReason()`
- c0256 ..> c0261: `finishFailure() calls submissionAttemptTrace()`
- c0256 ..> c0261: `finishReview() calls parseReview()`
- c0256 ..> c0261: `finishReview() calls reviewMismatchDirection()`
- c0256 ..> c0261: `finishReview() calls reviewSources()`
- c0256 ..> c0261: `finishReview() calls reviewValidationDebug()`
- c0256 ..> c0261: `finishReview() calls sourceLabels()`
- c0256 ..> c0261: `finishReview() calls submissionAttemptTrace()`
- c0256 ..> c0261: `optionalKnowledge() calls raceAbort()`
- c0256 ..> c0261: `plannerInput() calls availableProjects()`
- c0256 ..> c0261: `recall() calls boundDebugText()`
- c0256 ..> c0261: `recall() calls createDeadlineSignal()`
- c0256 ..> c0261: `recall() calls formatRecall()`
- c0256 ..> c0261: `recall() calls parsePlan()`
- c0256 ..> c0261: `recall() calls raceAbort()`
- c0256 ..> c0261: `recall() calls recallReviewSubmission()`
- c0256 ..> c0261: `recall() calls reviewSources()`
- c0256 ..> c0261: `recall() calls sanitizePolicy()`
- c0256 ..> c0261: `recall() calls submissionAttemptTrace()`
- c0256 ..> c0261: `recall() calls trim()`
- c0256 ..> c0261: `recallReadTool() calls abortError()`
- c0256 ..> c0261: `recallReadTool() calls reviewSources()`
- c0256 ..> c0261: `resolveScope() calls availableProjects()`
- c0256 ..> c0261: `searchMemories() calls exceptionDiagnostic()`
- c0256 ..> c0261: `searchMemories() calls isAbort()`
- c0256 ..> c0261: `searchMemories() calls raceAbort()`
- c0256 ..> c0261: `searchRequest() calls repoAwareQuery()`
- c0259 --> c0119: `field project`
- c0260 --> c0107: `field memories`
- c0261 ..> c0004: `availableProjects() calls set()`
- c0261 ..> c0107: `type in formatRecall`
- c0261 ..> c0107: `type in validateMemory`
- c0261 ..> c0117: `type in recallReviewSubmission`
- c0261 ..> c0119: `type in availableProjects`
- c0261 ..> c0125: `type in availableProjects`
- c0261 ..> c0125: `type in repoAwareQuery`
- c0261 ..> c0125: `type in repositoryIdentity`
- c0261 ..> c0176: `type in formatRecall`
- c0261 ..> c0228: `exceptionDiagnostic() calls sanitizeText()`
- c0261 ..> c0228: `formatRecall() calls sanitizeText()`
- c0261 ..> c0228: `parseReview() calls sanitizeText()`
- c0261 ..> c0228: `plannerString() calls sanitizeText()`
- c0261 ..> c0228: `repoAwareQuery() calls sanitizeText()`
- c0261 ..> c0228: `repositoryIdentity() calls sanitizeText()`
- c0261 ..> c0228: `reviewMismatchDirection() calls sanitizeText()`
- c0261 ..> c0228: `reviewerOutputText() calls sanitizeText()`
- c0261 ..> c0228: `reviewerOutputText() calls sanitizeValue()`
- c0261 ..> c0228: `sanitizePolicy() calls sanitizeText()`
- c0261 ..> c0228: `submissionAttemptTrace() calls sanitizeText()`
- c0261 ..> c0251: `type in createDeadlineSignal`
- c0261 ..> c0251: `type in failureReason`
- c0261 ..> c0253: `type in parsePlan`
- c0261 ..> c0255: `type in parseReview`
- c0261 ..> c0255: `type in recallReviewSubmission`
- c0261 ..> c0255: `type in reviewSources`
- c0261 ..> c0255: `type in reviewValidationDebug`
- c0261 ..> c0256: `createDeadlineSignal() calls now()`
- c0261 ..> c0261: `createDeadlineSignal() calls exceptionDiagnostic()`
- c0261 ..> c0261: `formatRecall() calls trim()`
- c0261 ..> c0261: `parseEntities() calls plannerString()`
- c0261 ..> c0261: `parsePlan() calls isObject()`
- c0261 ..> c0261: `parsePlan() calls parseEntities()`
- c0261 ..> c0261: `parsePlan() calls parseQueries()`
- c0261 ..> c0261: `parsePlan() calls plannerString()`
- c0261 ..> c0261: `parsePlan() calls positiveInteger()`
- c0261 ..> c0261: `parseQueries() calls plannerString()`
- c0261 ..> c0261: `parseReview() calls isObject()`
- c0261 ..> c0261: `parseReview() calls reviewSources()`
- c0261 ..> c0261: `parseReview() calls sourceLabels()`
- c0261 ..> c0261: `parseReview() calls trim()`
- c0261 ..> c0261: `plannerString() calls trim()`
- c0261 ..> c0261: `raceAbort() calls abortError()`
- c0261 ..> c0261: `repoAwareQuery() calls repositoryIdentity()`
- c0261 ..> c0261: `repoAwareQuery() calls trim()`
- c0261 ..> c0261: `repositoryIdentity() calls trim()`
- c0261 ..> c0261: `reviewMismatchDirection() calls isObject()`
- c0261 ..> c0261: `reviewMismatchDirection() calls trim()`
- c0261 ..> c0261: `reviewValidationDebug() calls boundDebugText()`
- c0261 ..> c0261: `reviewValidationDebug() calls reviewSources()`
- c0261 ..> c0261: `reviewValidationDebug() calls reviewerOutputText()`
- c0261 ..> c0261: `reviewValidationDebug() calls sourceLabels()`
- c0261 ..> c0261: `submissionAttemptTrace() calls trim()`
- c0261 ..> c0261: `validateMemory() calls isObject()`
- c0262 ..> c0261: `repositoryName() calls trim()`
- c0264 ..> c0263: `type in buildSetupPrompt`
- c0264 ..> c0263: `type in promptSetupHelp`
- c0265 --|> c0089: `inherits`
- c0267 --> c0088: `field mode`
- c0267 --> c0122: `field scope`
- c0267 --> c0125: `field context`
- c0267 --> c0269: `field session`
- c0268 --> c0265: `field snapshot`
- c0270 ..> c0087: `type in captureSummaryRecord`
- c0270 ..> c0087: `type in reuseCaptureHistory`
- c0270 ..> c0089: `type in captureConversation`
- c0270 ..> c0089: `type in compactCaptureSnapshot`
- c0270 ..> c0089: `type in reuseCaptureHistory`
- c0270 ..> c0089: `type in sanitizeCaptureSnapshot`
- c0270 ..> c0093: `type in compactCaptureSnapshot`
- c0270 ..> c0102: `type in collectEvidence`
- c0270 ..> c0102: `type in evidenceForEntry`
- c0270 ..> c0102: `type in toolEvidence`
- c0270 ..> c0228: `captureSummaryRecord() calls sanitizeText()`
- c0270 ..> c0228: `compactCaptureSnapshot() calls sanitizeText()`
- c0270 ..> c0228: `conversationForEntry() calls isMemoryOperation()`
- c0270 ..> c0228: `safeText() calls sanitizeText()`
- c0270 ..> c0228: `sanitizeCaptureSnapshot() calls sanitizeValue()`
- c0270 ..> c0228: `sanitizeConversation() calls sanitizeText()`
- c0270 ..> c0228: `sanitizeConversation() calls sanitizeValue()`
- c0270 ..> c0228: `toolEvidence() calls isMemoryOperation()`
- c0270 ..> c0228: `toolEvidence() calls sanitizeValue()`
- c0270 ..> c0261: `compactCaptureSnapshot() calls trim()`
- c0270 ..> c0261: `safeText() calls trim()`
- c0270 ..> c0266: `type in asMessage`
- c0270 ..> c0266: `type in lastAssistantEntry`
- c0270 ..> c0266: `type in toolEvidence`
- c0270 ..> c0267: `type in buildCaptureSnapshot`
- c0270 ..> c0267: `type in collectEvidence`
- c0270 ..> c0267: `type in toolEvidence`
- c0270 ..> c0268: `type in buildCaptureSnapshot`
- c0270 ..> c0270: `asMessage() calls isRecord()`
- c0270 ..> c0270: `buildCaptureSnapshot() calls collectEvidence()`
- c0270 ..> c0270: `buildCaptureSnapshot() calls deltaStartIndex()`
- c0270 ..> c0270: `buildCaptureSnapshot() calls lastAssistantEntry()`
- c0270 ..> c0270: `buildCaptureSnapshot() calls rootId()`
- c0270 ..> c0270: `buildCaptureSnapshot() calls snapshotId()`
- c0270 ..> c0270: `captureConversation() calls isRecord()`
- c0270 ..> c0270: `collectEvidence() calls evidenceForEntry()`
- c0270 ..> c0270: `compactCaptureSnapshot() calls captureConversation()`
- c0270 ..> c0270: `compactCaptureSnapshot() calls captureSummaryRecord()`
- c0270 ..> c0270: `compactCaptureSnapshot() calls isRecord()`
- c0270 ..> c0270: `contentText() calls isRecord()`
- c0270 ..> c0270: `conversationForEntry() calls asMessage()`
- c0270 ..> c0270: `conversationForEntry() calls isRecord()`
- c0270 ..> c0270: `conversationForEntry() calls sanitizeConversation()`
- c0270 ..> c0270: `evidenceForEntry() calls asMessage()`
- c0270 ..> c0270: `evidenceForEntry() calls contentText()`
- c0270 ..> c0270: `evidenceForEntry() calls isRecord()`
- c0270 ..> c0270: `evidenceForEntry() calls safeText()`
- c0270 ..> c0270: `evidenceForEntry() calls toolEvidence()`
- c0270 ..> c0270: `lastAssistantEntry() calls asMessage()`
- c0270 ..> c0270: `reuseCaptureHistory() calls captureSummaryRecord()`
- c0270 ..> c0270: `reuseCaptureHistory() calls isRecord()`
- c0270 ..> c0270: `sanitizeCaptureSnapshot() calls sanitizeCaptureConversation()`
- c0270 ..> c0270: `sanitizeConversation() calls isRecord()`
- c0270 ..> c0270: `toolEvidence() calls contentText()`
- c0270 ..> c0270: `toolEvidence() calls safeText()`
- c0273 --> c0271: `field error`
- c0273 --> c0271: `field provenanceError`
- c0274 ..> c0004: `readFile() calls close()`
- c0274 ..> c0008: `readFile() calls open()`
- c0274 ..> c0065: `getUrl() calls resolve()`
- c0274 ..> c0065: `git() calls resolve()`
- c0274 ..> c0065: `inspect() calls resolve()`
- c0274 ..> c0165: `getUrl() calls get()`
- c0274 ..> c0192: `readFile() calls readFile()`
- c0274 ..> c0206: `git() calls execute()`
- c0274 ..> c0228: `inspect() calls sanitizeValue()`
- c0274 ..> c0228: `inspectUrl() calls sanitizeText()`
- c0274 ..> c0228: `inspectUrl() calls sanitizeValue()`
- c0274 ..> c0261: `provenance() calls trim()`
- c0274 ..> c0272: `type in inspectUrl`
- c0274 ..> c0273: `type in inspect`
- c0274 ..> c0273: `type in inspectUrl`
- c0274 ..> c0274: `getUrl() calls check()`
- c0274 ..> c0274: `git() calls check()`
- c0274 ..> c0274: `inspect() calls check()`
- c0274 ..> c0274: `inspect() calls inspectUrl()`
- c0274 ..> c0274: `inspect() calls provenance()`
- c0274 ..> c0274: `inspect() calls readFile()`
- c0274 ..> c0274: `inspectUrl() calls check()`
- c0274 ..> c0274: `inspectUrl() calls getUrl()`
- c0274 ..> c0274: `provenance() calls git()`
- c0274 ..> c0274: `readFile() calls check()`
- c0274 --> c0275: `field options`
- c0274 ..> c0275: `type in constructor`
- c0274 ..> c0276: `getUrl() calls validateAddress()`
- c0274 ..> c0276: `getUrl() calls validateUrl()`
- c0274 ..> c0276: `git() calls requireInside()`
- c0274 ..> c0276: `inspect() calls errorDetails()`
- c0274 ..> c0276: `inspect() calls requireInside()`
- c0274 ..> c0276: `inspect() calls sourceContent()`
- c0274 ..> c0276: `inspectUrl() calls loopback()`
- c0274 ..> c0276: `inspectUrl() calls sourceContent()`
- c0274 ..> c0276: `inspectUrl() calls validateUrl()`
- c0274 ..> c0276: `provenance() calls errorDetails()`
- c0274 ..> c0276: `readFile() calls requireInside()`
- c0276 ..> c0228: `errorDetails() calls sanitizeText()`
- c0276 ..> c0228: `sourceContent() calls sanitizeText()`
- c0276 ..> c0228: `validateUrl() calls sanitizeText()`
- c0276 ..> c0228: `validateUrl() calls sanitizeValue()`
- c0276 ..> c0271: `type in errorDetails`
- c0276 ..> c0272: `type in sourceContent`
- c0276 ..> c0274: `validateAddress() calls check()`
- c0276 ..> c0276: `validateAddress() calls loopback()`

## Type key

- Type1: `(text: string) => string`
- Type2: `ApiForgetfulClientOptions & { secrets?: string[] }`
- Type3: `() => Promise<T>`
- Type4: `"missing" | "unavailable"`
- Type5: `Promise<PlanningResult<PlanningCapability>>`
- Type6: `Promise<PlanningResult<PlanningProject[]>>`
- Type7: `Promise<PlanningResult<PlanningPlanSummary[]>>`
- Type8: `Promise<PlanningResult<PlanningTaskSummary[]>>`
- Type9: `Record<string, unknown>`
- Type10: `string | null`
- Type11: `(value: unknown) => T`
- Type12: `() => void`
- Type13: `(work: Promise<void>) => void`
- Type14: `string | null | undefined`
- Type15: `{ generation: number; promise: Promise<void> }`
- Type16: `(state: PlanningState) => void`
- Type17: `() => boolean`
- Type18: `{ enabled: boolean; ready: boolean; repoName?: string }`
- Type19: `"denied" | "unavailable" | "transient" | "missing" | "invalid" | "cancelled"`
- Type20: `{ ok: true; value: T } | { ok: false; error: PlanningError }`
- Type21: `"idle" | "off" | "not-ready" | "loading" | "ready" | "no-project" | "disabled" |
  "unavailable" | "denied" | "error"`
- Type22: `Record<number, PlanningPlanTasks>`
- Type23: `() => Promise<string | undefined>`
- Type24: `"ready" | "needs-review" | "exhausted"`
- Type25: `"correctable" | "retry"`
- Type26: `{ tool: ModelReadTool; requireObserved: () => void; }`
- Type27: `"pending" | "planned" | "complete" | "partial" | "unsupported"`
- Type28: `Array<{ memoryId: number; reason: string }>`
- Type29: `{ documents: Document[]; codeArtifacts: CodeArtifact[] }`
- Type30: `Array<{ operation: string; error: string }>`
- Type31: `"link" | "unlink" | "attachments" | "entity"`
- Type32: `"started" | "completed" | "failed"`
- Type33: `"keep" | "reject" | "add" | "ignore" | "unresolved"`
- Type34: `"complete" | "unresolved"`
- Type35: `Promise<Memory | undefined>`
- Type36: `NonNullable<CaptureLinkReview["unreviewed"]>`
- Type37: `{ automaticIds?: number[]; beforeRead: () => Promise<void>; includeAttachments?: boolean
  }`
- Type38: `Map<string, boolean>`
- Type39: `Map<string, { decisions: LinkDecision[]; preservation?: PreservationDecision }>`
- Type40: `Array<{ candidateId: string; review: CaptureLinkReview }>`
- Type41: `ConnectionResult["operation"]`
- Type42: `(markDispatched: () => void) => Promise<unknown>`
- Type43: `(review: CaptureLinkReview) => Promise<void>`
- Type44: `() => Promise<void>`
- Type45: `Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Type46: `Record<string, { status: "started" | "completed" | "rejected"; error?: string; input?:
  unknown; }>`
- Type47: `(number[] | undefined)[]`
- Type48: `number | null | undefined`
- Type49: `Pick<MergeConnections, "documentIds" | "codeArtifactIds" | "fileIds">`
- Type50: `Array<{ id: string; reason: string }>`
- Type51: `| { valid: true; value: T } | { valid: false; reason: string }`
- Type52: `"create" | "skip" | "supersede" | "escalate" | "retire" | "merge"`
- Type53: `"reviewing" | "saving" | "checking"`
- Type54: `"memory" | "maintenance"`
- Type55: `"userDecision" | "verifiedToolChange" | "observation"`
- Type56: `Array<{ jobId: string; error: string }>`
- Type57: `"ready" | "busy"`
- Type58: `{ status: CaptureLinkReview["status"]; unreviewedCount: number; reason?: string }`
- Type59: `PendingConflict["status"]`
- Type60: `{ error: unknown }`
- Type61: `{ entryId: string; inspectionEntryIds: string[] } | null`
- Type62: `"resolved" | "deferred" | "rejected"`
- Type63: `Array<{ key: string; id: number }>`
- Type64: `(id: number) => Promise<Memory>`
- Type65: `() => boolean | Promise<boolean>`
- Type66: `() => CaptureMode | Promise<CaptureMode>`
- Type67: `() => Date`
- Type68: `CaptureServiceOptions["onActivity"]`
- Type69: `(signal: AbortSignal) => Promise<T>`
- Type70: `"reviewing" | "checking"`
- Type71: `"info" | "debug"`
- Type72: `"capture" | "overlap" | "overlapBatch"`
- Type73: `Promise<number | undefined>`
- Type74: `"created" | "skipped" | "replacement-created"`
- Type75: `number | undefined`
- Type76: `Promise<"applied" | "already">`
- Type77: `Promise<{ job: QueueJob; destination?: number }>`
- Type78: `Promise< | { status: "ready"; job: QueueJob; outcome: Record<string, unknown> |
  undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob } >`
- Type79: `Record<string, unknown> | undefined`
- Type80: `Promise<Entity | undefined>`
- Type81: `Promise<{ entities: Entity[]; truncated: boolean }>`
- Type82: `Promise<{ relationships: EntityRelationship[]; truncated: boolean }>`
- Type83: `Promise<{ job: QueueJob; inputs: CaptureBatchInput[] }>`
- Type84: `Promise< | { status: "ready"; job: QueueJob; decision: CaptureDecision } | { status:
  "skipped"; job: QueueJob } >`
- Type85: `Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Type86: `Promise<{ job: QueueJob; candidates: CaptureCandidate[]; progress?: boolean }>`
- Type87: `{ candidate: CaptureCandidate; decision?: CaptureDecision }`
- Type88: `CaptureMergePlan | undefined`
- Type89: `Promise<QueueJob | undefined>`
- Type90: `CaptureUncertainWrite | undefined`
- Type91: `Promise<{ job: QueueJob; stopped: boolean }>`
- Type92: `CaptureLinkReview | undefined`
- Type93: `Promise<{ job: QueueJob; inputs: Array<{ candidateId: string; review: CaptureLinkReview
  }> }>`
- Type94: `{ candidate: CaptureCandidate; outcome: Record<string, unknown>; review:
  CaptureLinkReview; operation: string; error: unknown; }`
- Type95: `Promise<{ job: QueueJob; needsCorrection: boolean }>`
- Type96: `Promise<"progress" | void>`
- Type97: `Promise<"advance" | "progress" | "deferred">`
- Type98: `CaptureSnapshot | CaptureCheckpointOptions`
- Type99: `{ sessionId?: string; branchId?: string; jobId?: string; limit?: number; }`
- Type100: `{ sessionId?: string; branchId?: string; }`
- Type101: `{ sessionId?: string; branchId?: string } | string`
- Type102: `Promise<NonNullable<PendingConflict["replacement"]>>`
- Type103: `CaptureAdvanceInput | CaptureSnapshot`
- Type104: `Pick<WorkContext, "sessionId" | "branchId">`
- Type105: `(phase: CaptureActivityPhase | undefined) => void`
- Type106: `{ id: number; name: string }[]`
- Type107: `"supersede" | "skip" | "defer"`
- Type108: `CaptureDecision | undefined`
- Type109: `string | undefined`
- Type110: `(id: string, raw: unknown, reason?: string) => void`
- Type111: `(reason: string) => void`
- Type112: `number[] | undefined`
- Type113: `string[] | undefined`
- Type114: `"reason" | "oldClaim" | "newClaim"`
- Type115: `KnowledgeWritePlan | undefined`
- Type116: `(item: T, index: number) => Promise<R>`
- Type117: `{ userSettings: string; projectSettings: string; }`
- Type118: `"classification" | "recall" | "capture"`
- Type119: `"default" | "project" | "invalid"`
- Type120: `"debug" | "info" | "warning" | "error"`
- Type121: `value is Record<string, unknown>`
- Type122: `ModelSelection | undefined`
- Type123: `{ scope: Scope; scopeSource: ScopeSource }`
- Type124: `Partial< Pick< PersistedUserSettings, | "base_url" | "token_env" | "timeout_ms" |
  "enabled" | "planning_panel" | "capture_mode" | "debug" | "verbosity" | "logging" |
  "log_directory" | "recall_model_timeout_ms" | "recall_concurrency" | "context_limit_tokens" |
  "model" > >`
- Type125: `{ baseUrl: string; tokenEnv?: string }`
- Type126: `"auto" | "observe" | "off"`
- Type127: `"complete" | "legacy-partial" | "summarized"`
- Type128: `number | null`
- Type129: `Omit<CodeArtifact, "code">`
- Type130: `Omit<Document, "content">`
- Type131: `"Organization" | "Individual" | "Team" | "Device" | "System" | "Other"`
- Type132: `"user" | "assistant" | "toolResult"`
- Type133: `Promise<{ id: number; title: string }[]>`
- Type134: `Promise<"ready" | "progress">`
- Type135: `"classification" | "recall-review" | "capture" | "overlap"`
- Type136: `(view: CompactedConversation) => Promise<void>`
- Type137: `() => unknown`
- Type138: `{ jobId?: string; sessionId?: string; branchId?: string; candidateId?: string; }`
- Type139: `"global" | "project"`
- Type140: `"draft" | "active" | "completed" | "archived"`
- Type141: `"unknown" | "enabled" | "disabled"`
- Type142: `"P0" | "P1" | "P2" | "P3"`
- Type143: `"todo" | "doing" | "waiting" | "done" | "cancelled"`
- Type144: `Array<{ key: string; stage: string; reason?: string; count?: number }>`
- Type145: `{ detail: string; retryPending: boolean; key: string }`
- Type146: `| { kind: "completed"; value: T } | { kind: "aborted" } | { kind: "timed-out" } | {
  kind: "failed"; error: unknown }`
- Type147: `"completed"`
- Type148: `"aborted"`
- Type149: `"timed-out"`
- Type150: `"failed"`
- Type151: `{ sessionId: string; branchId: string; entryIds: string[]; finalEntryId?: string;
  snapshotId?: string; }`
- Type152: `void | Promise<void>`
- Type153: `{ action: "supersede" | "skip" | "defer"; reason?: string; evidenceEntryIds?: string[];
  additionalEvidence?: string; additionalEntries?: EvidenceEntry[]; conversation?: readonly
  unknown[]; }`
- Type154: `Map<string, number>`
- Type155: `(options: { baseUrl: string; token?: string; timeoutMs: number; }) => ForgetfulClient`
- Type156: `( client: ForgetfulClient, model: PiMemoryModel, config: ForgetfulConfig, ) =>
  RecallServicePort`
- Type157: `( config: ForgetfulConfig, client: ForgetfulClient | undefined, model: PiMemoryModel |
  undefined, ) => CaptureServicePort | undefined`
- Type158: `( ctx: ExtensionContext, branchId: string, ) => Promise<ExtensionWorkContext> |
  ExtensionWorkContext`
- Type159: `Partial< Pick< LoadConfigOptions, | "userSettingsPath" | "projectSettingsPath" |
  "userPromptDir" | "projectPromptDir" > >`
- Type160: `Partial<Record<PolicyName, string>>`
- Type161: `keyof typeof DEFAULT_MEMORY_POLICIES | "capture" | "overlap"`
- Type162: `"automatic" | "queued"`
- Type163: `"pending" | "retrieval" | "terminal"`
- Type164: `RecallRequest & { sessionContext?: EvidenceEntry[] }`
- Type165: `Map<string, CaptureFeedbackState>`
- Type166: `{ throughTriggerId: number; branches: CaptureBranch[] }`
- Type167: `Map<string, PendingQueuedRecall[]>`
- Type168: `Map<string, AutomaticRecall>`
- Type169: `Map<string, RecallJob>`
- Type170: `readonly (AbortSignal | undefined)[]`
- Type171: `Promise<string | undefined>`
- Type172: `Promise<SetupAuthentication | undefined>`
- Type173: `"context" | "failure" | "no-context"`
- Type174: `{ id: string; prompt: string } | undefined`
- Type175: `Array<{ role: string; content?: unknown }>`
- Type176: `Promise<Model<any> | undefined>`
- Type177: `Model<any> | undefined`
- Type178: `"info" | "warning" | "error"`
- Type179: `"warning" | "error"`
- Type180: `CaptureCheckpointResult | undefined`
- Type181: `AutomaticCaptureJobOutcome | undefined`
- Type182: `Promise<AutomaticCaptureJobOutcome | undefined>`
- Type183: `{ failure?: NonNullable<AutomaticCaptureJobOutcome["failure"]>; recovered: boolean; }`
- Type184: `ReturnType<typeof collectCaptureFeedback>`
- Type185: `{ message?: string; terminalJobIds: string[] }`
- Type186: `(value: unknown) => Memory`
- Type187: `( path: string, method: string, body: unknown, signal: AbortSignal | undefined,
  statuses: number[], ) => Promise<unknown>`
- Type188: `Partial<DocumentInput | CodeArtifactInput>`
- Type189: `DocumentSummary | CodeArtifactSummary`
- Type190: `string | URL`
- Type191: `AbortSignal | undefined`
- Type192: `T | undefined`
- Type193: `NonNullable<KnowledgeExpansionResult["failures"]>`
- Type194: `{ operation: string; message: string }[]`
- Type195: `KnowledgeReadServiceOptions | MemoryReader`
- Type196: `Promise<Map<number, Entity>>`
- Type197: `Map<number, Entity>`
- Type198: `({ id: number; title: string }[] | undefined)[]`
- Type199: `( id: number, signal?: AbortSignal, ) => Promise<Memory>`
- Type200: `Promise<T | undefined>`
- Type201: `Record<string, unknown> & { operation: string }`
- Type202: `{ id: number; name: string }`
- Type203: `Array<ToolText | ToolImage>`
- Type204: `"image"`
- Type205: `"text"`
- Type206: `Array<[string, number]>`
- Type207: `Document | CodeArtifact`
- Type208: `"content" | "code"`
- Type209: `{ items: T[]; offset: number; limit: number; total: number; truncated: boolean }`
- Type210: `{ items: unknown[]; offset: number; limit: number; total: number; truncated: boolean;
  next_offset: number }`
- Type211: `{ content: Array<ToolText | ToolImage>; kind: string }`
- Type212: `{ source_repo?: string; source_files?: string[]; encoding_version?: string; }`
- Type213: `(() => Promise<void>) | undefined`
- Type214: `( state: KnowledgeWriteState, ) => Promise<void>`
- Type215: `{ title: string; content: string }`
- Type216: `{ kind: string; key: string; occurrence: number; input: unknown; error: string }`
- Type217: `{ kind: string; key: string; occurrence: number; input: unknown; create: () =>
  Promise<T>; }`
- Type218: `KnowledgeWriteGuard | undefined`
- Type219: `{ document_ids?: number[]; code_artifact_ids?: number[]; }`
- Type220: `{ kind: string; key: string; input: unknown; execute: () => Promise<unknown> }`
- Type221: `T & { occurrence: number }`
- Type222: `Pick< KnowledgeClient, | "getEntity" | "createEntity" | "getDocument" | "createDocument"
  | "getCodeArtifact" | "createCodeArtifact" | "createRelationship" | "linkEntityMemory" |
  "linkMemories" | "updateMemory" >`
- Type223: `{ key: string }[]`
- Type224: `"off" | "info" | "debug"`
- Type225: `{ directory: string; sessionId: string; level: FileLogLevel; onError?: (error: unknown)
  => void; maxFileBytes?: number; maxFiles?: number; maxEventBytes?: number; }`
- Type226: `CompactedMemoryHistory & { summaryMessage: Message }`
- Type227: `CompactedMemoryHistory | undefined`
- Type228: `(history: CompactedMemoryHistory) => Promise<void>`
- Type229: `Promise<number | "progress">`
- Type230: `( context: Context, options: SimpleStreamOptions, ) => Promise<AssistantMessage>`
- Type231: `ToolResultMessage["content"]`
- Type232: `Promise<{ summary: string; count: number }>`
- Type233: `( headers: ProviderHeaders, ) => ProviderHeaders | Promise<ProviderHeaders>`
- Type234: `ModelRegistryPort & { getAvailable?: () => Model<any>[]; }`
- Type235: `readonly { model: Model<any> }[]`
- Type236: `"task" | "compaction"`
- Type237: `() => Promise<number>`
- Type238: `ProviderHeaders | undefined`
- Type239: `MemoryModelHeaderTransform | undefined`
- Type240: `ModelSubmissionTool | ModelReadTool`
- Type241: `PiMemoryModel | undefined`
- Type242: `Project | undefined`
- Type243: `Promise<ProjectInput | undefined>`
- Type244: `Promise<Project | undefined>`
- Type245: `DurableQueueStoreOptions | string`
- Type246: `( state: QueueState, ) => | Promise<{ value: T; changed?: boolean }> | { value: T;
  changed?: boolean }`
- Type247: `WatermarkAdvance | CaptureSnapshot`
- Type248: `WorkContext & { projects?: Project[] }`
- Type249: `Promise<{ job: QueueJob; historyError?: string }>`
- Type250: `Promise<{ history?: NonNullable<SnapshotPayload["historySummary"]>; historyError?:
  string; }>`
- Type251: `Array<{ sessionId: string; branchId: string }>`
- Type252: `{ sessionId: string; branchId: string }`
- Type253: `(outcomes: Array<{ jobId: string; error: string }>) => void`
- Type254: `{ sessionId: string; branchId: string } | undefined`
- Type255: `QueueCheckpoint | string`
- Type256: `Promise<PendingConflict | undefined>`
- Type257: `"pending" | "handed_off" | "resolved" | "rejected"`
- Type258: `{ // Missing version identifies legacy implicit preservation plans; never execute as
  explicit. planVersion?: 1; requestKey?: string; requestPayload?: string; request?: {
  evidenceEntryIds: string[]; selectedAdditionalEntries: EvidenceEntry[]; reason?: string;
  additionalEvidence?: string; }; // The model's update selection and this plan's actual target are
  distinct from older targets. replacementMemoryId?: number; memoryId?: number; priorMemoryId?:
  number; updateComplete?: boolean; executionError?: string; // Service creation output, separate
  from model-selected manual link operations. autoLinkedMemoryIds?: number[]; completedEntityIds?:
  number[]; completedMemoryIds?: number[]; creationError?: string; input: MemoryInput; candidate:
  unknown; entityIds: number[]; memoryIds: number[]; linksComplete?: boolean; creationAttempted?:
  boolean; knowledgeState?: unknown; }`
- Type259: `Omit<CaptureSnapshot, "entries" | "conversation" | "sourceConversation">`
- Type260: `| "pending" | "running" | "paused" | "complete" | "failed"`
- Type261: `1 | 2`
- Type262: `Record<string, QueueWatermark>`
- Type263: `Pick<CaptureSnapshot, "entries" | "conversation" | "sourceConversation" |
  "historySummary"> & { /** Full source ordering for completed caches; kept outside the bounded
  queue index. */ historyEntryIds?: string[]; }`
- Type264: `"retire"`
- Type265: `{ throughEntryId: string; entryIds: string[]; } | undefined`
- Type266: `{ throughEntryId: string; entryIds: string[] }`
- Type267: `{ throughEntryId?: string; entryIds?: string[] }`
- Type268: `(stage: string, error: unknown) => string`
- Type269: `NonNullable<ModelRequest["diagnosticContext"]>`
- Type270: `(projectId: number, reason: string) => Promise<boolean>`
- Type271: `(plan: RecallPlan) => void`
- Type272: `() => number`
- Type273: `{ stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }`
- Type274: `Promise<KnowledgeExpansionResult | undefined>`
- Type275: `KnowledgeExpansionResult | undefined`
- Type276: `Project[] | undefined`
- Type277: `error is Error & { responseBody: string }`
- Type278: `Memory | undefined`
- Type279: `{ text: string; ids: number[]; knowledgeText: string }`
- Type280: `Record<keyof typeof SOURCE_FIELDS, number[]>`
- Type281: `"Review" | "Planner"`
- Type282: `{ summary: string; reason: string; sources: ReturnType<typeof reviewSources>; }`
- Type283: `(debug: string) => void`
- Type284: `"CLI" | "MCP"`
- Type285: `Promise<SetupHelp | "manual" | undefined>`
- Type286: `(toolName: string, text: string) => boolean`
- Type287: `| { status: "ready"; snapshot: CaptureSnapshotWithStatus } | { status: "skipped";
  reason: string; finalEntryId?: string }`
- Type288: `"ready"`
- Type289: `"skipped"`
- Type290: `MessageRecord | undefined`
- Type291: `EvidenceEntry | undefined`
- Type292: `SnapshotOptions["includeToolEvidence"]`
- Type293: `| ((toolName: string, text: string) => boolean) | undefined`
- Type294: `{ entry: SessionEntry; message: MessageRecord } | undefined`
- Type295: `CaptureHistorySummary | undefined`
- Type296: `Pick< Static<typeof SOURCE_INSPECTION_PARAMETERS>, "offset" | "limit" > & ({ path:
  string; url?: never } | { url: string; path?: never })`
- Type297: `{ status: "ok"; identifier: string; content: string; observedAt: string; /** SHA-256 of
  the complete observed source bytes, before sanitizing or paging. */ contentHash: string;
  sanitized: boolean; page: { offset: number; totalCharacters: number; nextOffset?: number };
  source_repo?: string; source_files?: string[]; source_url?: string; encoding_version?: string; /**
  Describes the observed file bytes, not the repository/index as a whole. */ fileState?: "committed"
  | "modified" | "uncommitted" | "unknown"; provenanceError?: SourceInspectionError; httpStatus?:
  number; } | { status: "error"; observedAt: string; error: SourceInspectionError; source_url?:
  string; httpStatus?: number; httpStatusText?: string; body?: string; }`
- Type298: `"ok"`
- Type299: `{ offset: number; totalCharacters: number; nextOffset?: number }`
- Type300: `"committed" | "modified" | "uncommitted" | "unknown"`
- Type301: `"error"`
- Type302: `{ path: string; dev: number; ino: number }`
- Type303: `SourceInspectionRequest & { url: string }`
- Type304: `Promise<{ bytes: Buffer; status: number; statusText: string; location?: string; }>`

## Signature key

- Signature1: `plan(planId: number, projectId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningPlan>>`
- Signature2: `task(taskId: number, planId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningTask>>`
- Signature3: `constructor(tui: TUI, theme: Theme, controller: PlanningWorkflow, close: () => void,
  run: (work: Promise<void>) => void) unknown`
- Signature4: `+plan(planId: number, projectId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningPlan>>`
- Signature5: `+task(taskId: number, planId: number, signal: AbortSignal)
  Promise<PlanningResult<PlanningTask>>`
- Signature6: `createPlanningRuntime(ctx: ExtensionContext, config: ForgetfulConfig,
  discoverRepository: () => Promise<string | undefined>) unknown`
- Signature7: `prepareLinkReview(client: ForgetfulClient, memoryId: number, destination: number,
  scope: Scope, overlaps: Memory[], options: { automaticIds?: number[]; beforeRead: () =>
  Promise<void>; includeAttachments?: boolean }) Promise<CaptureLinkReview>`
- Signature8: `validateLinkDecisions(decisions: LinkDecision[], review: CaptureLinkReview, edges:
  Map<string, boolean>, candidateId: string) void`
- Signature9: `authorizedMemory(client: ForgetfulClient, id: number, destination: number, scope:
  Scope) Promise<Memory>`
- Signature10: `executeConnection(review: CaptureLinkReview, operation:
  ConnectionResult["operation"], targetId: number, execute: (markDispatched: () => void) =>
  Promise<unknown>, save: (review: CaptureLinkReview) => Promise<void>) Promise<void>`
- Signature11: `applyLinkReview(client: ForgetfulClient, destination: number, scope: Scope, initial:
  CaptureLinkReview, save: (review: CaptureLinkReview) => Promise<void>, beforeWrite: () =>
  Promise<void>, assertCanWrite: () => void) Promise<CaptureLinkReview>`
- Signature12: `readAttachmentRecords(client: ForgetfulClient, memory: Memory, beforeRead: () =>
  Promise<void>) Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Signature13: `preparePreviousConnections(client: ForgetfulClient, expected: Memory,
  _replacementId: number, _destination: number, beforeRead: () => Promise<void>)
  Promise<PreviousConnections>`
- Signature14: `preserveConnections(client: ForgetfulClient, initial: CaptureLinkReview,
  beforeWrite: () => Promise<void>, save: (review: CaptureLinkReview) => Promise<void>,
  assertCanWrite: () => void) Promise<CaptureLinkReview>`
- Signature15: `collectMergeConnections(client: ForgetfulClient, memories: Memory[], previous:
  MergeConnections) Promise<MergeConnections>`
- Signature16: `requireResourceScope(id: number, projectId: number | null | undefined, kind: string,
  access: MergeAccess) void`
- Signature17: `checkMergeAttachments(client: ForgetfulClient, plan: Pick<MergeConnections,
  "documentIds" | "codeArtifactIds" | "fileIds">, access: MergeAccess) Promise<void>`
- Signature18: `preflightMergeConnections(client: ForgetfulClient, plan: MergeConnections, access:
  MergeAccess) Promise<void>`
- Signature19: `preserveMergeConnections(client: ForgetfulClient, replacementId: number, plan:
  MergeConnections, options: MergeExecution) Promise<void>`
- Signature20: `-addConflict(job: QueueJob, candidate: CaptureCandidate, destinationProjectId:
  number, decision: CaptureDecision, reason: string, oldMemory: Memory, replacementId: number)
  Promise<PendingConflict>`
- Signature21: `-checkpointOutcome(job: QueueJob, candidateId: string, outcome: unknown)
  Promise<QueueJob>`
- Signature22: `-destinationProjects(candidate: CaptureCandidate, context: WorkContext)
  Promise<number[]>`
- Signature23: `-validateDecision(decision: CaptureDecision, _candidate: CaptureCandidate,
  _overlaps: Memory[], _batch: unknown, _neighborhood: CaptureNeighborhood) void`
- Signature24: `-createMemory(job: QueueJob, candidate: CaptureCandidate, destination: number,
  projectIds: unknown, replacement: unknown) Promise<MemoryCreateResult>`
- Signature25: `-writeKnowledge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  memoryId: number, baseOutcome: Record<string, unknown>, finalStage: "created" | "skipped" |
  "replacement-created", existingMemory: Memory) Promise<QueueJob>`
- Signature26: `-supersessionAlreadyApplied(job: QueueJob, oldMemoryId: number, replacementId:
  number | undefined, destination: number) Promise<boolean>`
- Signature27: `-applySupersession(job: QueueJob, oldMemory: Memory, replacementId: number |
  undefined, reason: string, destination: number) Promise<"applied" | "already">`
- Signature28: `-finishSupersession(job: QueueJob, candidate: CaptureCandidate, destination: number,
  oldMemory: Memory, replacementId: number, reason: string, decision: CaptureDecision)
  Promise<QueueJob>`
- Signature29: `-processReplacementCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature30: `-processKnowledgeCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature31: `-loadOverlaps(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, destination: number) Promise< | { status: "ready"; job: QueueJob; outcome:
  Record<string, unknown> | undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob }
  >`
- Signature32: `-neighborhoodEntities(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<{ entities: Entity[]; truncated: boolean }>`
- Signature33: `-existingNeighborhood(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<CaptureNeighborhood>`
- Signature34: `-decideOverlap(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, overlaps: Memory[], destination: number) Promise< | { status: "ready"; job:
  QueueJob; decision: CaptureDecision } | { status: "skipped"; job: QueueJob } >`
- Signature35: `-recordEscalation(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, reason: string, oldMemory: Memory, outcomeReason: string)
  Promise<QueueJob>`
- Signature36: `-supersedeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature37: `-readMaintenanceTargets(job: QueueJob, ids: number[], destination: number)
  Promise<Memory[]>`
- Signature38: `-preflightRetirement(job: QueueJob, candidateId: string, destination: number, ids:
  number[]) Promise<void>`
- Signature39: `-composeMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Signature40: `-verifyRequestedMerge(job: QueueJob, outcome: Record<string, unknown> | undefined,
  replacementId: number, destination: number) Promise<void>`
- Signature41: `-finishMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, plan: CaptureMergePlan, replacementId: number) Promise<QueueJob>`
- Signature42: `-mergeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature43: `-retireCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature44: `-equivalentMemory(job: QueueJob, candidateId: string, destination: number)
  Promise<Memory>`
- Signature45: `-skipCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature46: `-applyDecision(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature47: `-processCandidate(job: QueueJob, candidate: CaptureCandidate, outcome: unknown)
  Promise<QueueJob>`
- Signature48: `-saveCorrectableFailure(job: QueueJob, candidate: CaptureCandidate, error: unknown)
  Promise<QueueJob | undefined>`
- Signature49: `-recordCandidateFailure(currentJob: QueueJob, candidate: CaptureCandidate, error:
  unknown, result: CaptureCheckpointResult) Promise<void>`
- Signature50: `-pauseCandidate(job: QueueJob, error: CapturePause, result: CaptureCheckpointResult)
  Promise<void>`
- Signature51: `-correctCandidateFailures(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature52: `-processCandidates(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature53: `-processOrderedCandidates(job: QueueJob, candidates: CaptureCandidate[], ordered:
  CaptureCandidate[], result: CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature54: `-refreshLinkReview(current: QueueJob, candidates: CaptureCandidate[], outcome:
  Record<string, unknown>, mode: CaptureMode, prior: CaptureLinkReview | undefined)
  Promise<CaptureLinkReview>`
- Signature55: `-migrateLegacyLinkReview(job: QueueJob, candidateId: string, outcome: Record<string,
  unknown>) Promise<QueueJob>`
- Signature56: `-planLinkReviews(job: QueueJob, candidates: CaptureCandidate[], inputs: Array<{
  candidateId: string; review: CaptureLinkReview }>) Promise<QueueJob>`
- Signature57: `-previousSupersessionCompleted(job: QueueJob, outcome: Record<string, unknown>,
  review: CaptureLinkReview) Promise<boolean>`
- Signature58: `-finishReviewedSupersession(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature59: `-runBranchWorker(branch: CaptureBranch, budget: number, result:
  CaptureCheckpointResult) Promise<void>`
- Signature60: `-recordBranchFailure(job: QueueJob, result: CaptureCheckpointResult, error: unknown,
  started: number) Promise<void>`
- Signature61: `-checkpointBranch(branch: CaptureBranch, budget: number)
  Promise<CaptureCheckpointResult>`
- Signature62: `-appendCheckpointResult(total: CaptureCheckpointResult, result:
  CaptureCheckpointResult) void`
- Signature63: `pendingConflicts(optionsOrSession: { sessionId?: string; branchId?: string } |
  string, branchId: string) Promise<CapturePendingConflict[]>`
- Signature64: `-rejectConflict(conflict: PendingConflict, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature65: `-selectResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput,
  additionalIds: string[]) string[]`
- Signature66: `-validateResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput)
  ConflictResolutionEvidence`
- Signature67: `-markConflictResolved(conflictId: string, resolution: unknown)
  Promise<CaptureResolveResult>`
- Signature68: `-planConflictReplacement(conflict: PendingConflict, candidate: CaptureCandidate,
  evidence: ConflictResolutionEvidence, context: WorkContext, current: Memory, requestPayload:
  string, conversation: readonly unknown[]) Promise<NonNullable<PendingConflict["replacement"]>>`
- Signature69: `-updateResolutionReplacement(conflict: PendingConflict, replacementId: number)
  Promise<void>`
- Signature70: `-linkResolutionEntity(conflict: PendingConflict, replacementId: number, id: number)
  Promise<void>`
- Signature71: `-applyConflictResolution(conflict: PendingConflict, evidence:
  ConflictResolutionEvidence, target: ConflictResolutionTarget, requestPayload: string,
  conversation: readonly unknown[]) Promise<CaptureResolveResult>`
- Signature72: `-resolveConflictOwned(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature73: `resolveConflict(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature74: `sharedSourceEvidence(candidates: CaptureCandidate[], snapshot: CaptureSnapshot)
  EvidenceEntry[]`
- Signature75: `eligibleCandidate(value: unknown, snapshot: CaptureSnapshot, index: number)
  CandidateValidation<CaptureCandidate>`
- Signature76: `parseCandidates(value: unknown, snapshot: CaptureSnapshot, onCandidate: (id: string,
  raw: unknown, reason?: string) => void) CandidateExtraction`
- Signature77: `captureCandidateSubmission(snapshot: CaptureSnapshot, recordRejection: (reason:
  string) => void) ModelSubmissionTool`
- Signature78: `memoryInput(candidate: CaptureCandidate, projectIds: number[], context: WorkContext)
  MemoryInput`
- Signature79: `captureKnowledgePlan(candidate: CaptureCandidate, destination: number, memoryId:
  number, context: WorkContext, existingMemory: Memory, operationId: unknown, entityMemoryKeys:
  string[]) KnowledgeWritePlan | undefined`
- Signature80: `readPromptDirectory(path: string, trusted: boolean, warnings: string[])
  Promise<PromptOverlays>`
- Signature81: `mergePrompts(globalPrompts: PromptOverlays, projectPrompts: PromptOverlays)
  PromptOverlays`
- Signature82: `resolveScope(projectData: JsonReadResult, projectPath: string, trusted: boolean,
  warnings: string[]) { scope: Scope; scopeSource: ScopeSource }`
- Signature83: `+obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature84: `+supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature85: `+updateEntity(id: number, input: Partial<EntityInput>, signal: AbortSignal)
  Promise<Entity>`
- Signature86: `+createRelationship(input: EntityRelationshipInput, signal: AbortSignal)
  Promise<EntityRelationship>`
- Signature87: `+updateDocument(id: number, input: Partial<DocumentInput>, signal: AbortSignal)
  Promise<Document>`
- Signature88: `+listCodeArtifacts(projectId: number, signal: AbortSignal)
  Promise<CodeArtifactSummary[]>`
- Signature89: `+updateCodeArtifact(id: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) Promise<CodeArtifact>`
- Signature90: `+updateMemory(id: number, input: Partial<MemoryInput>, signal: AbortSignal)
  Promise<Memory>`
- Signature91: `boundedWait(promise: Promise<T>, signals: readonly (AbortSignal | undefined)[],
  timeoutMs: number) Promise<BoundedWaitOutcome<T>>`
- Signature92: `automaticRecallTerminalText(result: RecallResult, kind: "automatic" | "queued",
  resultInHistory: unknown) string`
- Signature93: `recordRecallActivity(runtime: Runtime, result: RecallResult, ctx: ExtensionContext,
  elapsedMs: number) void`
- Signature94: `conflictBelongsToActiveBranch(conflict: Record<string, unknown>, runtime: Runtime,
  ctx: ExtensionContext) boolean`
- Signature95: `discoverWorkContext(pi: ExtensionAPI, ctx: ExtensionContext, branchId: string)
  Promise<ExtensionWorkContext>`
- Signature96: `log(ctx: ExtensionContext, config: ForgetfulConfig, message: string, level:
  Verbosity, fileMessage: unknown) void`
- Signature97: `logFailure(ctx: ExtensionContext, config: ForgetfulConfig, message: string, error:
  unknown, level: "warning" | "error") void`
- Signature98: `readCaptureOutcome(capture: CaptureServicePort, runtime: Runtime, jobId: string,
  checkpointResult: CaptureCheckpointResult) Promise<AutomaticCaptureJobOutcome | undefined>`
- Signature99: `updateDocument(documentId: number, input: Partial<DocumentInput>, signal:
  AbortSignal) unknown`
- Signature100: `updateCodeArtifact(artifactId: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) unknown`
- Signature101: `supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature102: `obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature103: `#request(pathOrUrl: string | URL, method: string, body: unknown, callerSignal:
  AbortSignal | undefined, expectedStatuses: number[]) Promise<unknown>`
- Signature104: `-throwResponseError(response: Response, method: string, url: URL, signal:
  AbortSignal, maxBytes: number) Promise<never>`
- Signature105: `parseSearchPayload(payload: unknown, fallbackQuery: string, requireMetadata:
  unknown) MemorySearchResult`
- Signature106: `-findRelationships(entities: Entity[], request: ExpansionContext)
  Promise<RelationshipExpansion[]>`
- Signature107: `-collectRelationships(entities: Entity[], request: ExpansionContext)
  Promise<EntityRelationship[]>`
- Signature108: `-resolveRelationshipEndpoints(entities: Entity[], relationships:
  EntityRelationship[], request: ExpansionContext) Promise<Map<number, Entity>>`
- Signature109: `-formatRelationships(entities: Entity[], relationships: EntityRelationship[],
  endpoints: Map<number, Entity>, request: KnowledgeExpansionRequest) RelationshipExpansion[]`
- Signature110: `-findEntityMemories(entities: Entity[], request: ExpansionContext)
  Promise<LinkedMemoryExpansion[]>`
- Signature111: `-collectEntityMemories(entities: Entity[], linked: ({ id: number; title: string }[]
  | undefined)[], request: ExpansionContext) Promise<LinkedMemoryExpansion[]>`
- Signature112: `-formatExpansion(entities: Entity[], relationships: RelationshipExpansion[],
  linkedMemories: LinkedMemoryExpansion[], attachments: Attachments) KnowledgeExpansionResult`
- Signature113: `resolveWriteProject(client: ForgetfulClient, context: KnowledgeToolContext,
  requested: number | undefined, signal: AbortSignal) Promise<ResolvedWriteProject>`
- Signature114: `assertReadMemory(client: ForgetfulClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Memory>`
- Signature115: `assertReadEntity(knowledge: KnowledgeClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Entity>`
- Signature116: `executeKnowledgeRead(client: ForgetfulClient, rawRequest: KnowledgeReadRequest,
  context: KnowledgeToolContext, signal: AbortSignal) Promise<KnowledgeToolResult>`
- Signature117: `updateProvenance(existing: Provenance, request: Record<string, unknown>, context:
  KnowledgeToolContext, destinationProjectId: number) Provenance`
- Signature118: `memoryInProject(client: ForgetfulClient, memoryId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Memory>`
- Signature119: `entityInProject(knowledge: KnowledgeClient, entityId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Entity>`
- Signature120: `hydrateEntities(knowledge: KnowledgeClient, candidates: Entity[], signal:
  AbortSignal) Promise<Entity[]>`
- Signature121: `validateAttachments(knowledge: KnowledgeClient, projectId: number, request:
  Record<string, unknown>, signal: AbortSignal) Promise<void>`
- Signature122: `createMemory(client: ForgetfulClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature123: `createEntity(knowledge: KnowledgeClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature124: `createDocument(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature125: `createCodeArtifact(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature126: `executeKnowledgeWrite(client: ForgetfulClient, rawRequest: KnowledgeWriteRequest,
  context: KnowledgeToolContext, signal: AbortSignal, beforeWrite: () => Promise<void>,
  checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature127: `constructor(client: WriteClient, readMemory: KnowledgeMemoryReader, assertCanWrite:
  () => void) unknown`
- Signature128: `-recordCreateFailure(attempt: string, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, error: unknown) Promise<void>`
- Signature129: `-createOnce(operation: { kind: string; key: string; occurrence: number; input:
  unknown; create: () => Promise<T>; }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<T>`
- Signature130: `-writeEntity(resource: ResourceSlot<KnowledgeEntityPlan>, plan: KnowledgeWritePlan,
  state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined,
  beforeWrite: KnowledgeWriteGuard | undefined) Promise<Entity>`
- Signature131: `-writeEntities(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature132: `-writeDocument(resource: ResourceSlot<KnowledgeDocumentPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<Document>`
- Signature133: `-writeDocuments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature134: `-writeCodeArtifact(resource: ResourceSlot<KnowledgeCodeArtifactPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<CodeArtifact>`
- Signature135: `-writeCodeArtifacts(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature136: `-requestedAttachmentIds(plan: KnowledgeWritePlan, state: KnowledgeWriteState)
  KnowledgeAttachmentIds`
- Signature137: `-writeConnection(operation: { kind: string; key: string; input: unknown; execute:
  () => Promise<unknown> }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature138: `-writeAttachments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature139: `-writeRelationship(resource: ResourceSlot<KnowledgeRelationshipPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<EntityRelationship>`
- Signature140: `-writeRelationships(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature141: `-writeEntityMemoryLink(resource: KnowledgeEntityMemoryLinkPlan, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature142: `-writeEntityMemoryLinks(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature143: `-writeLinkedMemory(linkedMemoryId: number, plan: KnowledgeWritePlan, state:
  KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite:
  KnowledgeWriteGuard | undefined) Promise<void>`
- Signature144: `-writeLinkedMemories(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature145: `execute(plan: KnowledgeWritePlan, previous: Partial<KnowledgeWriteState>,
  checkpoint: KnowledgeWriteCheckpoint, signal: AbortSignal, beforeWrite: KnowledgeWriteGuard)
  Promise<KnowledgeWriteState>`
- Signature146: `stateWithNumber(values: KnowledgeWriteReceipt[], key: string, id: number,
  occurrence: number) void`
- Signature147: `constructor(model: Model<any>, task: Message, settings: CompactionSettings,
  contextLimitTokens: unknown, initialHistory: CompactedMemoryHistory & { summaryMessage: Message })
  unknown`
- Signature148: `prepare(context: Context, signal: AbortSignal, sessionId: string | undefined,
  complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) => Promise<void>)
  Promise<number>`
- Signature149: `prepareCapture(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>) Promise<"ready" | "progress">`
- Signature150: `-prepareContext(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>, maxChunks: unknown) Promise<number | "progress">`
- Signature151: `-applySummary(context: Context, summary: string, lastRecord: Message, previousSize:
  number) number`
- Signature152: `assertFits(context: Context, model: Model<any>, output: number, contextWindow:
  number) void`
- Signature153: `outputCeiling(model: Model<any>, settings: typeof DEFAULT_COMPACTION_SETTINGS,
  requestedMaxTokens: unknown) number`
- Signature154: `resolvedOutputAllowance(context: Context, model: Model<any>, contextWindow: number,
  settings: typeof DEFAULT_COMPACTION_SETTINGS, requestedMaxTokens: unknown) number`
- Signature155: `summarizeMemoryHistory(messages: Message[], options: MemoryHistorySummaryOptions,
  previousSummary: string) Promise<{ summary: string; count: number }>`
- Signature156: `+complete(model: Model<any>, context: Context, options: ModelsSimpleStreamOptions)
  Promise<AssistantMessage>`
- Signature157: `constructor(registry: ModelRegistryPort, selection: ModelSelection, options:
  PiMemoryModelOptions) unknown`
- Signature158: `-completeAttempt(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, attempt: number,
  kind: "task" | "compaction") Promise<AssistantMessage>`
- Signature159: `-executeRead(read: ModelReadTool, call: ToolCall, request: ModelRequest, deadline:
  RequestDeadline) Promise<ToolResultMessage>`
- Signature160: `-completeWithSubmission(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, prepare: () =>
  Promise<number>) Promise<unknown>`
- Signature161: `ensureCompletionFinished(response: AssistantMessage, request: ModelRequest,
  timedOut: boolean, allowToolUse: boolean) void`
- Signature162: `requestOptions(model: Model<any>, sessionId: string | undefined, transformHeaders:
  MemoryModelHeaderTransform | undefined, signal: AbortSignal) ModelsSimpleStreamOptions`
- Signature163: `appendCallCountCorrection(context: Context, response: AssistantMessage, calls:
  ToolCall[], submissionName: string, base: string, readNames: string[]) void`
- Signature164: `throwRequestFailure(error: unknown, request: ModelRequest, timedOut: boolean,
  timeoutMs: number) never`
- Signature165: `resolveMemoryModel(registry: ModelRegistryPort, selection: ModelSelection |
  undefined, options: PiMemoryModelOptions) PiMemoryModel | undefined`
- Signature166: `promptExistingProject(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string) Promise<Project | undefined>`
- Signature167: `initialiseProject(client: ForgetfulClient, ctx: ExtensionContext, repoName: string,
  ensureCurrent: () => Promise<void>) Promise<Project | undefined>`
- Signature168: `initialiseProjectForAgent(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string, input: AgentProjectInitInput, ensureCurrent: () => Promise<void>) Promise<Project>`
- Signature169: `resolveBranchId(sessionId: string, activeEntryIds: readonly string[],
  fallbackBranchId: string) Promise<string>`
- Signature170: `cancel(jobId: string, interruptedModelCall: unknown, uncertainWrite: string)
  Promise<void>`
- Signature171: `-compactJobSnapshot(job: StoredQueueJob, conversation: CompactedConversation)
  Promise<void>`
- Signature172: `pendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature173: `listPendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature174: `updateConflict(conflictId: string, patch: Partial<PendingConflict>)
  Promise<PendingConflict>`
- Signature175: `constructor(client: ForgetfulClient, model: MemoryModelClient, options:
  RecallServiceOptions) unknown`
- Signature176: `-recallReadTool(request: RecallRequest, resolution: ScopeResolution, candidates:
  RecallResult) ModelReadTool`
- Signature177: `-finishFailure(request: RecallRequest, deadline: DeadlineSignal, error: unknown,
  trace: { stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }) RecallResult`
- Signature178: `-finishReview(output: unknown, candidates: RecallResult, recallPolicy: string,
  debugTrace: string, searchFailed: boolean, reviewRejections: string[]) RecallResult`
- Signature179: `-optionalKnowledge(memories: Memory[], entityNames: string[], scope: Scope,
  projectId: number | undefined, signal: AbortSignal) Promise<KnowledgeExpansionResult | undefined>`
- Signature180: `-resultWithKnowledge(result: RecallResult, expansion: KnowledgeExpansionResult |
  undefined, knowledgeText: string) RecallResult`
- Signature181: `-authorizeProjectSelection(request: RecallRequest, deadline: DeadlineSignal, plan:
  RecallPlan) Promise<string | undefined>`
- Signature182: `-requestsDifferentProject(request: RecallRequest, plan: RecallPlan, scope: Scope)
  boolean`
- Signature183: `-searchMemories(request: RecallRequest, plan: RecallPlan, scope: Scope, resolution:
  ScopeResolution, deadline: DeadlineSignal) Promise<SearchOutcome>`
- Signature184: `-searchRequest(query: string, plan: RecallPlan, context: WorkContext, scope: Scope,
  resolution: ScopeResolution) SearchRequest`
- Signature185: `-resolveScope(context: WorkContext, scope: Scope, selectedId: number | undefined,
  supplied: Project[] | undefined, signal: AbortSignal) Promise<ScopeResolution>`
- Signature186: `formatRecall(memories: Memory[], entities: string[], recallPolicy: string,
  expansion: KnowledgeExpansionResult) { text: string; ids: number[]; knowledgeText: string }`
- Signature187: `reviewValidationDebug(value: unknown, candidates: RecallResult, mismatchDirection:
  string | undefined) string`
- Signature188: `recallReviewSubmission(candidates: RecallResult, rejections: string[], setDebug:
  (debug: string) => void) ModelSubmissionTool`
- Signature189: `deltaStartIndex(branch: SessionEntry[], afterEntryId: string | null | undefined,
  baselineEntryId: string | null | undefined) number | undefined`
- Signature190: `compactCaptureSnapshot(snapshot: CaptureSnapshot, view: CompactedConversation)
  CaptureSnapshot`

## Extraction warnings

- `Unresolved or out-of-scope base: ActivityLoader -> Loader`
- `Unresolved or out-of-scope base: CaptureProgress -> Error`
- `Unresolved or out-of-scope base: CaptureSelectionError -> Error`
- `Unresolved or out-of-scope base: ContextWindowError -> Error`
- `Unresolved or out-of-scope base: ForgetfulAbortError -> Error`
- `Unresolved or out-of-scope base: ForgetfulHttpError -> Error`
- `Unresolved or out-of-scope base: ForgetfulSchemaError -> Error`
- `Unresolved or out-of-scope base: ForgetfulTimeoutError -> Error`
- `Unresolved or out-of-scope base: InvalidCaptureOutput -> Error`
- `Unresolved or out-of-scope base: MergeWriteUncertain -> Error`
- `Unresolved or out-of-scope base: ModelSubmissionError -> Error`
- `Unresolved or out-of-scope base: ModelTaskPause -> Error`
- `Unresolved or out-of-scope base: PlanBrowser -> Component`
- `Unresolved or out-of-scope base: ProjectInitError -> Error`
- `Unresolved or out-of-scope base: QueueBusyError -> Error`
- `Unresolved or out-of-scope base: QueueJobMetadata -> Omit<QueueJob, "snapshot">`
- `Unresolved or out-of-scope base: ReviewValidationError -> Error`
