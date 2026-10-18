# Mermaid class diagrams

Declared types and signatures; unknown types are `unknown`. Receivers are omitted.
Fields are associations, not lifetime ownership. Calls are static heuristic estimates.
Members and connections within each view are uncapped.
Parallel arrows are summarized.
Cross-diagram relationships are retained in the complete relationship list.

Included: 243 boxes. Calls without in-scope endpoints: 0.

## Test filtering

Mode: exclude.
Saved detector version: 2.
Test paths: `scripts/forgetful-test-server.py`, `test`.
Keep paths: none.
Calls removed by test filtering: 649. Type relationships removed: 191.

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
- `test/capture-drain-pi.test.ts`: 6 source occurrences (test-path).
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
- `test/validation-recall.test.ts`: 10 source occurrences (test-path).
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
    class c0005["CaptureCorrectionCycle"] {
        <<interface>>
        cycle: number
        attempts: number
        phase: Type2
        failureKind: Type3
        failure: unknown
    }
    class c0006["CaptureSelectionError"] {
        <<class>>
    }
    class c0007["src/capture-feedback.ts"] {
        <<module>>
        correctableCaptureError(error: unknown) boolean
        initialCorrectionCycle() CaptureCorrectionCycle
        captureFailureReport(failure: unknown) Type4
    }
    class c0008["CaptureLinkReview"] {
        <<interface>>
        status: Type5
        memory: Memory
        memories: Memory[]
        automaticIds: number[]
        unreviewed: Type6
        decisions: LinkDecision[]
        verifiedIds: number[]
        reason: string
        previous: PreviousConnections
        resources: Type7
        preservation: PreservationDecision
        preservationVerified: boolean
        executionResults: ConnectionResult[]
        previousResults: ConnectionResult[]
        failures: Type8
    }
    class c0009["ConnectionResult"] {
        <<interface>>
        operation: Type9
        targetId: number
        status: Type10
        error: string
        httpStatus: number
    }
    class c0010["LinkDecision"] {
        <<interface>>
        memoryId: number
        action: Type11
        reason: string
    }
    class c0011["PreservationDecision"] {
        <<interface>>
        status: Type12
        documentIds: number[]
        codeArtifactIds: number[]
        entityIds: number[]
        reason: string
    }
    class c0012["PreviousConnections"] {
        <<interface>>
        memory: Memory
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        entities: Entity[]
        entityIds: number[]
        complete: boolean
    }
    class c0013["src/capture-links.ts"] {
        <<module>>
        wantsEdge(decision: LinkDecision) boolean
        exclusiveMemory(memory: Memory, destination: number) boolean
        readSelectedMemory(client: ForgetfulClient, id: number, unreviewed: Type14) Type13
        prepareLinkReview(Signature1)
        validateLinkDecisions(Signature2)
        validateLinkReviews(value: unknown, inputs: Type18) Type17
        operationError(error: unknown) string
        authorizedMemory(Signature3)
        executeConnection(Signature4)
        applyLinkReview(Signature5)
        finishLinkExecution(initial: CaptureLinkReview, save: Type21) Promise~CaptureLinkReview~
        readAttachmentRecords(Signature6)
        preparePreviousConnections(Signature7)
        preserveConnections(Signature8)
    }
    class c0014["MergeAccess"] {
        <<interface>>
        destination: number
        scope: Scope
        beforeRead: Type22
    }
    class c0015["MergeConnections"] {
        <<interface>>
        memoryIds: number[]
        entityIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        receipts: Type25
    }
    class c0016["MergeExecution"] {
        <<interface>>
        save: Type22
        assertCanWrite: Type23
    }
    class c0017["MergeWriteUncertain"] {
        <<class>>
    }
    class c0018["src/capture-merge.ts"] {
        <<module>>
        union(...lists: Type26) number[]
        collectMergeConnections(Signature9)
        requireResourceScope(Signature10)
        checkMergeEntity(client: ForgetfulClient, id: number, access: MergeAccess) Promise~void~
        checkMergeAttachments(Signature11)
        preflightMergeConnections(Signature12)
        preserveMergeConnections(Signature13)
    }
    class c0019["CandidateExtraction"] {
        <<interface>>
        candidates: CaptureCandidate[]
        skipped: Type29
    }
    class c0020["CandidateValidation"] {
        <<type_alias>>
        alias: Type30
        valid: true
        value: T
        reason: string
        valid: false
    }
    class c0021["CaptureAction"] {
        <<type_alias>>
        alias: Type31
    }
    class c0022["CaptureActivityPhase"] {
        <<type_alias>>
        alias: Type32
    }
    class c0023["CaptureAdvanceInput"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
    }
    class c0024["CaptureBatchInput"] {
        <<interface>>
        candidate: CaptureCandidate
        destinationProjectId: number
        overlaps: Memory[]
        neighborhood: CaptureNeighborhood
    }
    class c0025["CaptureBranch"] {
        <<interface>>
        sessionId: string
        branchId: string
    }
    class c0026["CaptureCandidate"] {
        <<interface>>
        kind: Type33
        searchDescription: string
        id: string
        title: string
        content: string
        context: string
        keywords: string[]
        tags: string[]
        importance: number
        sourceEntryIds: string[]
        evidenceType: Type34
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
    class c0027["CaptureCheckpointOptions"] {
        <<interface>>
        sessionId: string
        branchId: string
        excludeBranches: CaptureBranch[]
    }
    class c0028["CaptureCheckpointResult"] {
        <<interface>>
        processed: number
        processedJobIds: string[]
        discardedJobs: Type35
        paused: boolean
        errors: string[]
        deferredBranches: CaptureBranch[]
        continuation: Type36
    }
    class c0029["CaptureCodeArtifactResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0030["CaptureDecision"] {
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
    class c0031["CaptureDiagnosticCandidate"] {
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
        linkReview: Type37
    }
    class c0032["CaptureDiagnosticConflict"] {
        <<interface>>
        id: string
        status: Type38
        candidateId: string
        destinationProjectId: number
        sourceEntryIds: string[]
        oldMemoryIds: number[]
        reason: string
        replacementId: number
    }
    class c0033["CaptureDiagnosticJob"] {
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
    class c0034["CaptureDiagnostics"] {
        <<interface>>
        jobs: CaptureDiagnosticJob[]
        conflicts: CaptureDiagnosticConflict[]
    }
    class c0035["CaptureDocumentResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0036["CaptureEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
    }
    class c0037["CaptureEntityResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0038["CaptureMergePlan"] {
        <<interface>>
        candidate: CaptureCandidate
        memories: Memory[]
        connections: MergeConnections
    }
    class c0039["CaptureNeighborhood"] {
        <<interface>>
        entities: Entity[]
        documents: Document[]
        codeArtifacts: CodeArtifact[]
        relationships: EntityRelationship[]
        truncated: boolean
    }
    class c0040["CaptureOperation"] {
        <<interface>>
        jobId: string
        conflictId: string
        uncertainWrite: CaptureUncertainWrite
        supersession: SupersessionReceipt
        modelFailure: Type39
    }
    class c0041["CapturePause"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0042["CapturePendingConflict"] {
        <<interface>>
        verifiedOrigin: Type40
    }
    class c0043["CaptureProgress"] {
        <<class>>
    }
    class c0044["CaptureRelationshipResource"] {
        <<interface>>
        sourceEntryIds: string[]
    }
    class c0045["CaptureResolveResult"] {
        <<interface>>
        status: Type41
        conflict: PendingConflict
    }
    class c0046["CaptureResourceReuse"] {
        <<interface>>
        entities: Type42
        documents: Type42
        codeArtifacts: Type42
        relationships: Type42
    }
    class c0047["CaptureService"] {
        <<class>>
        -queue: DurableQueueStore
        -client: ForgetfulClient
        -readSavedMemory: Type43
        -model: MemoryModelClient
        -identity: QueueIdentity
        -sessionId: string
        -branchId: string
        -policy: string
        -isEnabled: Type44
        -getMode: Type45
        -canWriteNow: Type46
        -canReadNow: Type46
        -maxModelCalls: number
        -maxJobsPerCheckpoint: number
        -now: Type47
        -knowledgeWriter: KnowledgeWriter
        -logger: DiagnosticLogger
        -stopped: unknown
        -cancellation: unknown
        -interruptedModelJobs: unknown
        -operations: unknown
        -onActivity: Type48
        -activities: unknown
        -activityPhase: CaptureActivityPhase
        constructor(options: CaptureServiceOptions) unknown
        -readSignal(signal: AbortSignal) AbortSignal
        -activity(phase: CaptureActivityPhase, operation: Type49) Promise~T~
        -publishActivity() void
        -read(operation: Type50, signal: AbortSignal, phase: Type51) Promise~T~
        -mutate(operation: Type50, signal: AbortSignal) Promise~T~
        -cancellableClient(client: ForgetfulClient) ForgetfulClient
        -cancellableKnowledge(client: KnowledgeClient) KnowledgeClient
        -correlation(job: QueueJob, candidateId: string) unknown
        -emit(level: Type52, event: string, data: Type53) void
        -enabled(mode: CaptureMode) Promise~boolean~
        -ensureModelCallAllowed(job: QueueJob) Promise~void~
        -assertWriteAllowedNow() void
        -ensureWriteAllowed(jobMode: CaptureMode) Promise~void~
        -policyFor(snapshot: CaptureSnapshot, purpose: Type54) string
        enqueue(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -enqueueSnapshot(snapshot: CaptureSnapshot) Promise~CaptureEnqueueResult~
        -resolveDestination(candidate: CaptureCandidate, context: WorkContext) Type55
        -addConflict(Signature14)
        -checkpointOutcome(Signature15)
        -destinationProjects(Signature16)
        -validateDecision(Signature17)
        -createMemory(Signature18)
        -writeKnowledge(Signature19)
        -supersessionAlreadyApplied(Signature20)
        -applySupersession(Signature21)
        -recordSupersession(receipt: SupersessionReceipt) Promise~void~
        -finishSupersession(Signature22)
        -processReplacementCheckpoint(Signature23)
        -processKnowledgeCheckpoint(Signature24)
        -prepareDestination(job: QueueJob, candidate: CaptureCandidate) Type59
        -loadOverlaps(Signature25)
        -neighborhoodEntity(job: QueueJob, id: number, destination: number) Type62
        -neighborhoodMatches(job: QueueJob, input: unknown) Promise~Entity[]~
        -neighborhoodEntities(Signature26)
        -neighborhoodRelationships(job: QueueJob, entities: Entity[]) Type64
        -existingNeighborhood(Signature27)
        -prepareOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Type65
        -decideOverlapBatch(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -decideOverlap(Signature28)
        -recordEscalation(Signature29)
        -supersedeCandidate(Signature30)
        -readMaintenanceTargets(Signature31)
        -confirmedRetirement(id: number) boolean
        -preflightRetirement(Signature32)
        -composeMerge(Signature33)
        -verifyRequestedMerge(Signature34)
        -finishMerge(Signature35)
        -mergeCandidate(Signature36)
        -retireCandidate(Signature37)
        -equivalentMemory(Signature38)
        -skipCandidate(Signature39)
        -applyDecision(Signature40)
        -processCandidate(Signature41)
        -evidenceReadTool(job: QueueJob) ModelReadTool
        -sourceInspectionTool(job: QueueJob) ModelReadTool
        -loadCandidates(job: QueueJob) Type68
        -reviewExecutionFailure(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -correctedCaptureOutcome(Signature42)
        -isModelFailure(error: unknown) boolean
        -saveCorrectableFailure(Signature43)
        -recordCandidateFailure(Signature44)
        -candidateUncertainty(outcome: Type61, error: unknown) Type72
        -connectionUncertainty(outcome: Type61) Type72
        -pauseCandidate(Signature45)
        -correctCandidateFailures(Signature46)
        -processCandidates(Signature47)
        -processOrderedCandidates(Signature48)
        -refreshLinkReview(Signature49)
        -migrateLegacyLinkReview(Signature50)
        -prepareLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type75
        -planLinkReviews(Signature51)
        -executeLinkReview(job: QueueJob, candidate: CaptureCandidate) Promise~QueueJob~
        -recordLinkReviewFailure(current: QueueJob, failure: Type76) Promise~void~
        -previousSupersessionCompleted(Signature52)
        -finishReviewedSupersession(Signature53)
        -executeLinkReviews(job: QueueJob, candidates: CaptureCandidate[]) Type77
        -reviewLinks(job: QueueJob, candidates: CaptureCandidate[]) Promise~QueueJob~
        -processJob(job: QueueJob, result: CaptureCheckpointResult) Type78
        -runBranchWorker(Signature54)
        -processBranchJob(job: QueueJob, result: CaptureCheckpointResult) Type79
        -recordBranchFailure(Signature55)
        -checkpointBranch(Signature56)
        -checkpointBranches(options: Type80) Promise~CaptureBranch[]~
        -appendCheckpointResult(Signature57)
        checkpoint(options: Type80) Promise~CaptureCheckpointResult~
        processPending(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        diagnostics(options: Type81) Promise~CaptureDiagnostics~
        pendingConflicts(options: Type82) Promise~CapturePendingConflict[]~
        pendingConflicts(sessionId: string, branchId: string) Promise~CapturePendingConflict[]~
        pendingConflicts(Signature58)
        -verifyConflictOrigin(conflict: PendingConflict) Promise~CapturePendingConflict~
        -ownedConflict(conflictId: string) Promise~PendingConflict~
        -rejectConflict(Signature59)
        -selectResolutionEvidence(Signature60)
        -validateResolutionEvidence(Signature61)
        -resolutionTarget(conflict: PendingConflict) ConflictResolutionTarget
        -markConflictResolved(Signature62)
        -revisionResources(current: Memory, destination: number, previous: Memory) unknown
        -planConflictReplacement(Signature63)
        -updateResolutionReplacement(Signature64)
        -createResolutionReplacement(conflict: PendingConflict) Promise~number~
        -linkResolutionEntity(Signature65)
        -executeResolutionLinks(conflict: PendingConflict, replacementId: number) Promise~void~
        -applyConflictResolution(Signature66)
        -failConflictResolution(conflictId: string, error: unknown) Promise~never~
        -resolveConflictOwned(Signature67)
        resolveConflict(Signature68)
        resolve(conflictId: string, input: ResolveConflictInput) Promise~CaptureResolveResult~
        advance(input: Type85) Promise~void~
        advanceWatermark(input: Type85) Promise~void~
        watermark(context: Type86) unknown
        stop(_sessionId: string, _branchId: string) void
    }
    class c0048["CaptureServiceOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        onActivity: Type87
        queue: DurableQueueStore
        client: ForgetfulClient
        model: MemoryModelClient
        instanceId: string
        endpoint: string
        accountId: string
        sessionId: string
        branchId: string
        policy: string
        isEnabled: Type44
        getMode: Type45
        canWriteNow: Type46
        canReadNow: Type46
        maxCandidates: number
        maxModelCalls: number
        maxJobsPerCheckpoint: number
        now: Type47
    }
    class c0049["CaptureUncertainWrite"] {
        <<class>>
    }
    class c0050["ConflictResolutionEvidence"] {
        <<interface>>
        evidenceEntryIds: string[]
        selectedAdditionalEntries: EvidenceEntry[]
        reason: string
        additionalEvidence: string
    }
    class c0051["ConflictResolutionTarget"] {
        <<interface>>
        oldMemory: Memory
        candidate: CaptureCandidate
        fakeJob: QueueJob
    }
    class c0052["InvalidCaptureOutput"] {
        <<class>>
        constructor(reason: string) unknown
    }
    class c0053["MissingCaptureDestination"] {
        <<class>>
        constructor(candidate: CaptureCandidate, projects: Type88) unknown
        projects: Type88
    }
    class c0054["ResolveConflictInput"] {
        <<interface>>
        action: Type89
        reason: string
        evidenceEntryIds: string[]
        additionalEvidence: string
        additionalEntries: EvidenceEntry[]
        conversation: readonly unknown[]
    }
    class c0055["src/capture.ts"] {
        <<module>>
        reusableMergeComposition(plan: Type70, decision: Type90) boolean
        conflictResolutionEvidence(evidence: ConflictResolutionEvidence) unknown
        blockedSave(diagnostic: string) Error
        clone(value: T) T
        record(value: unknown) Type61
        stringValue(value: unknown, max: number) Type91
        strings(value: unknown, max: unknown, itemMax: number) string[]
        projectId(value: unknown) Type57
        snapshotForPersistence(snapshot: CaptureSnapshot) CaptureSnapshot
        captureWorkMetadata(snapshot: CaptureSnapshot) unknown
        sourceEvidence(candidate: CaptureCandidate, snapshot: CaptureSnapshot) EvidenceEntry[]
        sharedSourceEvidence(Signature69)
        invalidCandidate(reason: string) CandidateValidation~T~
        validCandidate(value: T) CandidateValidation~T~
        captureResource(raw: unknown, kind: string, index: number) Type53
        captureEvidenceError(ids: string[], snapshot: CaptureSnapshot) Type91
        eligibleCandidate(Signature70)
        parseCandidates(Signature71)
        boundedSubmissionRejections(value: readonly string[]) string[]
        appendSubmissionRejection(rejections: string[], reason: string) void
        captureCandidateSubmission(Signature72)
        decisionMemoryId(response: Type53) Type57
        decisionTargetMemoryId(response: Type53) Type57
        decisionMemoryIds(response: Type53) Type94
        decisionEvidenceIds(response: Type53) Type95
        decisionText(response: Type53, field: Type96) Type91
        decisionPartial(response: Type53) boolean
        applyEnrichmentDecision(response: Type53, decision: CaptureDecision) void
        applyEquivalentCandidate(response: Type53, decision: CaptureDecision) void
        parseDecision(value: unknown) CaptureDecision
        decisionConflictIds(decision: CaptureDecision) number[]
        firstConflictId(decision: CaptureDecision) Type57
        currentProjectId(context: WorkContext) Type57
        captureProvenance(candidate: CaptureCandidate, context: WorkContext) unknown
        memoryInput(Signature73)
        resourceInput(input: T, defaults: Type53) T
        captureKnowledgePlan(Signature74)
        overlapCandidate(candidate: CaptureCandidate) Type53
        definitelyRejected(error: unknown) boolean
        errorMessage(error: unknown) string
        scrubError(error: unknown) string
        isFinalOutcome(outcome: unknown) boolean
        trustedAdditionalEntries(value: unknown) EvidenceEntry[]
    }
    class c0056["src/concurrency.ts"] {
        <<module>>
        mapConcurrent(items: readonly T[], concurrency: number, operation: Type98) Promise~R[]~
    }
    class c0057["ForgetfulConfig"] {
        <<interface>>
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
        paths: Type99
    }
    class c0058["ForgetfulInstanceConfig"] {
        <<interface>>
        baseUrl: string
        token: string
        tokenEnv: string
        timeoutMs: number
    }
    class c0059["JsonReadResult"] {
        <<interface>>
        value: unknown
        exists: boolean
        malformed: boolean
    }
    class c0060["LoadConfigOptions"] {
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
    class c0061["ModelSelection"] {
        <<interface>>
        provider: string
        id: string
    }
    class c0062["PersistedProjectSettings"] {
        <<interface>>
        scope: unknown
    }
    class c0063["PersistedUserSettings"] {
        <<interface>>
        base_url: unknown
        token: unknown
        token_env: unknown
        timeout_ms: unknown
        enabled: unknown
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
    class c0064["PromptName"] {
        <<type_alias>>
        alias: Type100
    }
    class c0065["PromptOverlays"] {
        <<interface>>
        classification: string
        recall: string
        capture: string
    }
    class c0066["ScopeSource"] {
        <<type_alias>>
        alias: Type101
    }
    class c0067["Verbosity"] {
        <<type_alias>>
        alias: Type102
    }
    class c0068["src/config.ts"] {
        <<module>>
        isRecallConcurrency(value: unknown) value is number
        resolveRecallConcurrency(value: unknown, warnings: string[]) number
        resolveContextLimit(value: unknown, warnings: string[]) number
        isFileLogLevel(value: unknown) value is FileLogLevel
        resolveLogDirectory(value: unknown, agentDir: string, warnings: string[]) string
        isVerbosity(value: unknown) value is Verbosity
        resolveVerbosity(user: PersistedUserSettings, warnings: string[]) Verbosity
        isRecord(value: unknown) Type103
        parseModel(value: unknown) Type104
        asBoolean(value: unknown, fallback: boolean) boolean
        asPositiveInteger(value: unknown, fallback: number) number
        asString(value: unknown) Type91
        readJson(path: string) Promise~JsonReadResult~
        readPromptDirectory(Signature75)
        mergePrompts(Signature76)
        resolveCaptureMode(value: unknown, warnings: string[]) CaptureMode
        resolveScope(Signature77)
        defaultAgentDir() string
        userSettingsPath(agentDir: unknown) string
        projectSettingsPath(cwd: string) string
        loadForgetfulConfig(options: LoadConfigOptions) Promise~ForgetfulConfig~
        writeJson(path: string, value: unknown) Promise~void~
        writeProjectScope(cwd: string, scope: Scope) Promise~void~
        updateUserSettings(path: string, update: Type106) Promise~void~
        updateForgetfulConnection(path: string, connection: Type107) Promise~void~
        modelToString(model: Type104) Type91
    }
    class c0069["CaptureHistorySummary"] {
        <<interface>>
        throughEntryId: string
        text: string
    }
    class c0070["CaptureMode"] {
        <<type_alias>>
        alias: Type108
    }
    class c0071["CaptureSnapshot"] {
        <<interface>>
        id: string
        context: WorkContext
        instanceId: string
        entries: EvidenceEntry[]
        conversation: readonly unknown[]
        conversationCoverage: Type109
        sourceConversation: readonly unknown[]
        historySummary: CaptureHistorySummary
        processedThroughEntryId: Type110
        leafEntryId: string
        finalEntryId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        createdAt: string
    }
    class c0072["CodeArtifact"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0073["CodeArtifactInput"] {
        <<interface>>
        title: string
        description: string
        code: string
        language: string
        tags: string[]
        project_id: Type111
    }
    class c0074["CodeArtifactSummary"] {
        <<type_alias>>
        alias: Type112
    }
    class c0075["CompactedConversation"] {
        <<interface>>
        summary: string
        summarizedThroughEntryId: string
        retainedConversation: readonly unknown[]
    }
    class c0076["Document"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0077["DocumentInput"] {
        <<interface>>
        title: string
        description: string
        content: string
        document_type: string
        tags: string[]
        project_id: Type111
    }
    class c0078["DocumentSummary"] {
        <<type_alias>>
        alias: Type113
    }
    class c0079["Entity"] {
        <<interface>>
        id: number
        updated_at: string
    }
    class c0080["EntityInput"] {
        <<interface>>
        name: string
        entity_type: EntityType
        custom_type: string
        notes: string
        tags: string[]
        aka: string[]
        project_ids: number[]
    }
    class c0081["EntityRelationship"] {
        <<interface>>
        id: number
    }
    class c0082["EntityRelationshipInput"] {
        <<interface>>
        source_entity_id: number
        target_entity_id: number
        relationship_type: string
    }
    class c0083["EntityType"] {
        <<type_alias>>
        alias: Type114
    }
    class c0084["EvidenceEntry"] {
        <<interface>>
        id: string
        role: Type115
        text: string
        toolName: string
        toolCallId: string
        isError: boolean
        details: unknown
    }
    class c0085["FileSummary"] {
        <<interface>>
        id: number
        filename: string
        description: string
        mime_type: string
        size_bytes: number
        tags: string[]
        project_id: Type111
    }
    class c0086["ForgetfulClient"] {
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
        +obsolete(Signature78)
        +supersede(Signature79)
    }
    class c0087["KnowledgeClient"] {
        <<interface>>
        +searchEntities(query: string, limit: number, signal: AbortSignal) Promise~Entity[]~
        +getEntity(id: number, signal: AbortSignal) Promise~Entity~
        +createEntity(input: EntityInput, signal: AbortSignal) Promise~Entity~
        +updateEntity(Signature80)
        +getEntityMemories(id: number, signal: AbortSignal) Type116
        +linkEntityMemory(entityId: number, memoryId: number, signal: AbortSignal) Promise~void~
        +getRelationships(id: number, signal: AbortSignal) Promise~EntityRelationship[]~
        +createRelationship(Signature81)
        +listDocuments(projectId: number, signal: AbortSignal) Promise~DocumentSummary[]~
        +getDocument(id: number, signal: AbortSignal) Promise~Document~
        +createDocument(input: DocumentInput, signal: AbortSignal) Promise~Document~
        +updateDocument(Signature82)
        +listCodeArtifacts(Signature83)
        +getCodeArtifact(id: number, signal: AbortSignal) Promise~CodeArtifact~
        +createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        +updateCodeArtifact(Signature84)
        +listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        +getFile(id: number, signal: AbortSignal) Promise~StoredFile~
        +updateMemory(Signature85)
        +linkMemories(id: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        +unlinkMemories(id: number, targetId: number, signal: AbortSignal) Promise~void~
    }
    class c0088["LinkedMemory"] {
        <<interface>>
        memory: Memory
        link_source_id: number
    }
    class c0089["Memory"] {
        <<interface>>
        id: number
        is_obsolete: boolean
        superseded_by: Type111
        obsolete_reason: Type110
        obsoleted_at: Type110
        linked_memory_ids: number[]
        access_count: number
        last_accessed_at: Type110
        updated_at: string
    }
    class c0090["MemoryCreateResult"] {
        <<interface>>
        id: number
        autoLinkedMemoryIds: number[]
    }
    class c0091["MemoryInput"] {
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
    class c0092["MemoryModelClient"] {
        <<interface>>
        +prepareCapture(request: ModelRequest) Type117
        +complete(request: ModelRequest) Promise~unknown~
    }
    class c0093["MemorySearchResult"] {
        <<interface>>
        query: string
        primary_memories: Memory[]
        linked_memories: LinkedMemory[]
        total_count: number
        token_count: number
        truncated: boolean
    }
    class c0094["ModelEvidencePage"] {
        <<class>>
        constructor(entryId: string, record: unknown, offset: number, limit: number) unknown
        entryId: string
        record: unknown
        offset: number
        limit: number
    }
    class c0095["ModelReadErrorResult"] {
        <<class>>
        constructor(value: unknown) unknown
        value: unknown
    }
    class c0096["ModelReadTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +execute(input: unknown, signal: AbortSignal) Promise~unknown~
    }
    class c0097["ModelRequest"] {
        <<interface>>
        purpose: Type118
        policy: string
        input: unknown
        conversation: readonly unknown[]
        onConversationCompacted: Type119
        signal: AbortSignal
        submission: ModelSubmissionTool
        readTools: ModelReadTool[]
        readConcurrency: number
        readBatchContext: Type120
        diagnosticContext: Type121
    }
    class c0098["ModelSubmissionError"] {
        <<class>>
        constructor(message: string, rejectionReasons: string[]) unknown
        rejectionReasons: string[]
    }
    class c0099["ModelSubmissionTool"] {
        <<interface>>
        name: string
        description: string
        parameters: unknown
        +validate(input: unknown) unknown
        +onRejection(reason: string, input: unknown) void
    }
    class c0100["ModelTaskPause"] {
        <<class>>
    }
    class c0101["Project"] {
        <<interface>>
        id: number
        name: string
        repo_name: Type110
        description: string
    }
    class c0102["ProjectInput"] {
        <<interface>>
        name: string
        description: string
        repo_name: string
    }
    class c0103["Provenance"] {
        <<interface>>
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
    }
    class c0104["Scope"] {
        <<type_alias>>
        alias: Type122
    }
    class c0105["SearchRequest"] {
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
    class c0106["StoredFile"] {
        <<interface>>
        data: string
    }
    class c0107["WorkContext"] {
        <<interface>>
        cwd: string
        repoName: string
        project: Project
        projectDiscoveryPending: boolean
        sessionId: string
        branchId: string
    }
    class c0108["AutomaticCaptureJobOutcome"] {
        <<interface>>
        ready: boolean
        terminal: boolean
        noCandidates: boolean
        candidateStages: Type123
        failure: Type124
    }
    class c0109["AutomaticRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0110["BoundedWaitOutcome"] {
        <<type_alias>>
        alias: Type125
        kind: Type126
        value: T
        kind: Type127
        kind: Type128
        error: unknown
        kind: Type129
    }
    class c0111["CaptureFeedbackItem"] {
        <<interface>>
        jobId: string
        state: CaptureFeedbackState
        outcome: AutomaticCaptureJobOutcome
    }
    class c0112["CaptureFeedbackState"] {
        <<interface>>
        reportedCandidateKeys: Set~string~
        lastFailureKey: string
        lastUnavailable: boolean
        retried: boolean
    }
    class c0113["CaptureServicePort"] {
        <<interface>>
        +enqueue(snapshot: CaptureSnapshot) Promise~unknown~
        +checkpoint(options: CaptureCheckpointOptions) Promise~CaptureCheckpointResult~
        +advanceWatermark(update: Type130) Promise~unknown~
        +stop(sessionId: string, branchId: string) Type131
        +pendingConflicts(options: Type82) Promise~unknown[]~
        +diagnostics(options: Type81) Promise~unknown~
        +resolveConflict(conflictId: string, resolution: Type132) Promise~unknown~
    }
    class c0114["DiagnosticCandidate"] {
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
    class c0115["DiagnosticParts"] {
        <<interface>>
        candidates: number
        stages: Type133
        outcomes: string[]
    }
    class c0116["ExtensionWorkContext"] {
        <<interface>>
        projects: Project[]
    }
    class c0117["ForgetfulExtensionDependencies"] {
        <<interface>>
        client: ForgetfulClient
        createClient: Type134
        recall: RecallServicePort
        capture: CaptureServicePort
        createRecall: Type135
        createCapture: Type136
        resolveWorkContext: Type137
    }
    class c0118["ForgetfulExtensionOptions"] {
        <<interface>>
        agentDir: string
        config: Type138
        dependencies: ForgetfulExtensionDependencies
        policies: Type139
    }
    class c0119["PendingQueuedRecall"] {
        <<type_alias>>
        alias: RecallJob
    }
    class c0120["PolicyName"] {
        <<type_alias>>
        alias: Type140
    }
    class c0121["PreparedRuntime"] {
        <<interface>>
        logger: FileLogger
        config: ForgetfulConfig
        client: ForgetfulClient
        model: PiMemoryModel
        recall: RecallServicePort
        context: ExtensionWorkContext
        sessionId: string
        currentLeaf: Type110
        branchId: string
        queueDirectory: string
    }
    class c0122["RecallActivity"] {
        <<interface>>
        memoryCount: number
        scope: Scope
        reason: string
    }
    class c0123["RecallContextMessage"] {
        <<interface>>
        role: string
        content: unknown
        customType: unknown
        details: unknown
    }
    class c0124["RecallJob"] {
        <<interface>>
        key: string
        jobId: string
        kind: Type141
        runtime: Runtime
        branchId: string
        generation: number
        prompt: string
        controller: AbortController
        promise: Promise~RecallResult~
        userEntryId: string
        phase: Type142
        result: RecallResult
        boundarySeen: boolean
        terminalConsumed: boolean
        resultSent: boolean
    }
    class c0125["RecallServicePort"] {
        <<interface>>
        +recall(request: Type143) Promise~RecallResult~
        +deeper(request: DeeperRecallRequest) Promise~RecallResult~
    }
    class c0126["Runtime"] {
        <<interface>>
        logger: FileLogger
        activity: ForgetfulActivity
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
        baselineEntryId: Type110
        lastCaptureEntryId: string
        pendingCaptureJobs: Type144
        recoveryResult: CaptureCheckpointResult
        captureFeedbackFlush: Promise~void~
        captureCheckpointTail: Promise~void~
        captureRetryScheduled: boolean
        captureTriggerId: number
        captureDeferrals: Type145
        settledCaptureTail: Promise~void~
        lifecycleController: AbortController
        initialization: Promise~void~
        ready: boolean
        discoveryError: unknown
        lastRecall: RecallActivity
        skipNextCapture: boolean
    }
    class c0127["SetupAuthentication"] {
        <<interface>>
        tokenEnv: string
        token: string
    }
    class c0128["State"] {
        <<interface>>
        runtime: Runtime
        pendingQueuedRecall: Type146
        automaticRecalls: Type147
        recallJobs: Type148
        skipNextCapture: boolean
        shownWarnings: Set~string~
        generation: number
        loading: Promise~Runtime~
    }
    class c0129["src/extension.ts"] {
        <<module>>
        boundedWait(Signature86)
        setupEndpointSuggestion(value: string) string
        promptSetupEndpoint(ctx: ExtensionContext, config: ForgetfulConfig) Type150
        promptSetupAuthentication(ctx: ExtensionContext) Type151
        makeInstanceId(config: ForgetfulConfig) string
        policyText(config: ForgetfulConfig, policies: Type139, name: PolicyName) string
        sessionKey(ctx: ExtensionContext, branchId: string) string
        boundedErrorDiagnostic(error: unknown) string
        textMessage(text: string) UserMessage
        snapshotWorkContext(context: ExtensionWorkContext) ExtensionWorkContext
        messageContentText(content: unknown) string
        usefulRecallText(result: RecallResult) string
        savedRecallResultText(result: RecallResult, kind: Type141) string
        automaticRecallTerminalText(Signature87)
        automaticRecallResultStatus(result: RecallResult) Type152
        recallActivitySummary(activity: RecallActivity) string
        recordRecallActivity(Signature88)
        recallContextEntries(ctx: ExtensionContext) EvidenceEntry[]
        latestBranchUserEntry(ctx: ExtensionContext) Type153
        latestContextUserPrompt(messages: Type154) Type91
        conflictBelongsToActiveBranch(Signature89)
        defaultWorkContext(ctx: ExtensionContext, branchId: string) ExtensionWorkContext
        canonicalRepository(remote: string) Type91
        qualifiedRepository(host: string, path: string) Type91
        discoverWorkContext(Signature90)
        parseSelection(value: string) Type104
        pickMemoryModel(ctx: ExtensionContext, currentModel: Type156) Type155
        notify(ctx: ExtensionContext, message: string, type: Type157) void
        log(Signature91)
        logFailure(Signature92)
        diagnosticSourceIds(value: unknown) string
        claimText(value: unknown) string
        diagnosticCandidateDetail(value: unknown, stages: Type133) Type91
        collectDiagnosticParts(jobs: unknown[]) DiagnosticParts
        diagnosticSummary(value: unknown) string
        captureJobId(value: unknown) Type91
        captureWasQueued(value: unknown) boolean
        captureProcessedJobIds(value: Type159) string[]
        captureFeedbackReason(value: unknown) Type91
        automaticCaptureJobOutcome(value: unknown, jobId: string) Type160
        readCaptureOutcome(Signature93)
        recordCaptureRetry(#123; state#44; outcome #125;: CaptureFeedbackItem) Type162
        collectCaptureFeedback(items: CaptureFeedbackItem[]) unknown
        captureCount(count: number, singular: string, plural: string) string
        skippedReasonBreakdown(reasons: Type133) string
        captureFailurePart(summary: Type163, noOtherParts: boolean) Type91
        captureFeedbackParts(summary: Type163) string[]
        automaticCaptureFeedback(items: CaptureFeedbackItem[], unavailable: number) Type164
        createForgetfulExtension(options: ForgetfulExtensionOptions) ExtensionFactory
    }
    class c0130["src/foreground-tools.ts"] {
        <<module>>
        registerForegroundTool(pi: ExtensionAPI, definition: ToolDefinition~T~) void
    }
    class c0131["ApiKnowledgeClient"] {
        <<class>>
        constructor(request: KnowledgeRequest, parseMemory: Type165) unknown
        -request: KnowledgeRequest
        -parseMemory: Type165
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
        updateDocument(Signature94)
        listCodeArtifacts(projectId: number, signal: AbortSignal) Promise~CodeArtifactSummary[]~
        getCodeArtifact(artifactId: number, signal: AbortSignal) Promise~CodeArtifact~
        createCodeArtifact(input: CodeArtifactInput, signal: AbortSignal) Promise~CodeArtifact~
        updateCodeArtifact(Signature95)
        updateMemory(memoryId: number, input: Partial~MemoryInput~, signal: AbortSignal) unknown
        linkMemories(memoryId: number, relatedIds: number[], signal: AbortSignal) Promise~void~
        unlinkMemories(memoryId: number, targetId: number, signal: AbortSignal) Promise~void~
        listFiles(projectId: number, signal: AbortSignal) Promise~FileSummary[]~
        getFile(fileId: number, signal: AbortSignal) Promise~StoredFile~
    }
    class c0132["KnowledgeRequest"] {
        <<type_alias>>
        alias: Type166
    }
    class c0133["src/http-knowledge.ts"] {
        <<module>>
        object(value: unknown) Type53
        text(value: unknown, max: number, empty: unknown, field: unknown) string
        id(value: unknown) number
        ids(value: unknown) number[]
        strings(value: unknown, max: unknown) string[]
        records(value: unknown, key: string) unknown[]
        provenance(value: Type53) Provenance
        entityBody(input: Partial~EntityInput~, partial: unknown) Type53
        entity(value: unknown) Entity
        relationshipBody(input: EntityRelationshipInput) Type53
        relationship(value: unknown) EntityRelationship
        memoryMetadata(value: Type53) Type53
        resourceBody(input: Type167, code: boolean, partial: unknown) Type53
        document(value: unknown) Document
        artifact(value: unknown) CodeArtifact
        summary(value: unknown, code: boolean) Type168
        requestSegment(value: unknown) string
        projectPath(path: string, projectId: number) string
        fileSummary(value: unknown) FileSummary
    }
    class c0134["ApiForgetfulClient"] {
        <<class>>
        knowledge: unknown
        -baseUrl: URL
        -token: string
        -timeoutMs: number
        -maxResponseBytes: number
        -maxFileResponseBytes: number
        -fetchImpl: typeof fetch
        constructor(options: ApiForgetfulClientOptions) unknown
        search(request: SearchRequest, signal: AbortSignal) Promise~Memory[]~
        queryMemory(request: SearchRequest, signal: AbortSignal) Promise~MemorySearchResult~
        listProjects(repoName: string, signal: AbortSignal) Promise~Project[]~
        createProject(input: ProjectInput, signal: AbortSignal) Promise~Project~
        linkProject(id: number, repoName: string, signal: AbortSignal) Promise~Project~
        create(input: MemoryInput, signal: AbortSignal) Promise~MemoryCreateResult~
        get(id: number, signal: AbortSignal) Promise~Memory~
        getMemoryEntityIds(id: number, signal: AbortSignal) Promise~number[]~
        supersede(Signature96)
        obsolete(Signature97)
        -validId(id: number) number
        -endpoint(path: string) string
        -responseByteLimit(method: string, url: URL) number
        -request(Signature98)
        -throwResponseError(Signature99)
        -readResponse(response: Response, signal: AbortSignal, maxBytes: number) Promise~string~
    }
    class c0135["ApiForgetfulClientOptions"] {
        <<interface>>
        baseUrl: string
        token: string
        timeoutMs: number
        maxResponseBytes: number
        fetchImpl: typeof fetch
    }
    class c0136["ForgetfulAbortError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0137["ForgetfulHttpError"] {
        <<class>>
        status: number
        responseBody: string
        constructor(message: string, status: number, responseBody: string) unknown
    }
    class c0138["ForgetfulSchemaError"] {
        <<class>>
        constructor(message: string) unknown
    }
    class c0139["ForgetfulTimeoutError"] {
        <<class>>
        constructor(message: unknown) unknown
    }
    class c0140["src/http.ts"] {
        <<module>>
        isObject(value: unknown) Type103
        directEntityId(edge: unknown, memoryId: number) Type57
        requiredString(value: unknown, field: string, allowEmpty: unknown) string
        projectText(value: string, field: string, max: number) string
        optionalString(value: unknown, field: string) Type91
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
        defaultWhenOmitted(value: Type171, fallback: T) T
        searchBody(request: SearchRequest) Type53
        uniqueMemories(memories: Memory[]) Memory[]
        parseLinkedMemories(value: unknown) LinkedMemory[]
        parseSearchPayload(Signature100)
        flattenSearchResult(result: MemorySearchResult) Memory[]
    }
    class c0141["Attachments"] {
        <<interface>>
        documents: Document[]
        artifacts: CodeArtifact[]
        files: FileSummary[]
        fileIds: number[]
    }
    class c0142["ExpansionContext"] {
        <<interface>>
        failures: Type172
    }
    class c0143["KnowledgeExpansionRequest"] {
        <<interface>>
        memories: Memory[]
        entityNames: string[]
        scope: Scope
        projectId: number
        signal: AbortSignal
    }
    class c0144["KnowledgeExpansionResult"] {
        <<interface>>
        text: string
        memoryIds: number[]
        entityIds: number[]
        relationshipIds: number[]
        documentIds: number[]
        codeArtifactIds: number[]
        fileIds: number[]
        failures: Type173
    }
    class c0145["KnowledgeReadService"] {
        <<class>>
        -readMemory: MemoryReader
        constructor(client: KnowledgeClient, options: Type174) unknown
        -client: KnowledgeClient
        expand(request: KnowledgeExpansionRequest) Promise~KnowledgeExpansionResult~
        -findEntities(request: ExpansionContext) Promise~Entity[]~
        -findRelationships(Signature101)
        -collectRelationships(Signature102)
        -resolveRelationshipEndpoints(Signature103)
        -formatRelationships(Signature104)
        -findEntityMemories(Signature105)
        -collectEntityMemories(Signature106)
        -isAllowedEntityMemory(id: number, request: ExpansionContext) Promise~boolean~
        -findAttachments(request: ExpansionContext) Promise~Attachments~
        -formatExpansion(Signature107)
        -appendEntityLines(lines: string[], entities: Entity[]) void
        -appendRelationshipLines(lines: string[], relationships: RelationshipExpansion[]) void
        -appendLinkedMemoryLines(lines: string[], linkedMemories: LinkedMemoryExpansion[]) void
        -appendDocumentLines(lines: string[], documents: Document[]) void
        -appendArtifactLines(lines: string[], artifacts: CodeArtifact[]) void
        -appendFileLines(lines: string[], files: FileSummary[], fileIds: number[]) void
        -emptyExpansion() KnowledgeExpansionResult
    }
    class c0146["KnowledgeReadServiceOptions"] {
        <<interface>>
        readMemory: MemoryReader
    }
    class c0147["LinkedMemoryExpansion"] {
        <<type_alias>>
        entity: Entity
        id: number
        title: string
    }
    class c0148["MemoryReader"] {
        <<type_alias>>
        alias: Type178
    }
    class c0149["RelationshipExpansion"] {
        <<type_alias>>
        relationship: EntityRelationship
        source: Entity
        target: Entity
    }
    class c0150["src/knowledge-read.ts"] {
        <<module>>
        validId(value: unknown) value is number
        validEntity(value: unknown) value is Entity
        validRelationship(value: unknown) value is EntityRelationship
        validMemory(value: unknown) value is Memory
        inEntityScope(entity: Entity, scope: Scope, projectId: number) boolean
        inProjectScope(resourceProjectId: Type27, scope: Scope, projectId: number) boolean
        clean(value: string) string
        safeCall(operation: Type49, request: ExpansionContext, operationName: string) Type179
    }
    class c0151["KnowledgeReadContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeReadRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
    }
    class c0152["KnowledgeReadRequest"] {
        <<type_alias>>
        alias: Type180
        operation: string
    }
    class c0153["KnowledgeToolContext"] {
        <<interface>>
        cwd: string
        repoName: string
        commit: string
        project: Type181
        scope: Scope
    }
    class c0154["KnowledgeToolResult"] {
        <<interface>>
        content: Type182
        details: Type53
        file: StoredFile
    }
    class c0155["KnowledgeWriteContext"] {
        <<interface>>
        client: ForgetfulClient
        knowledge: KnowledgeClient
        request: KnowledgeWriteRequest
        context: KnowledgeToolContext
        projectId: number
        signal: AbortSignal
        beforeWrite: Type22
        checkWriteState: Type23
    }
    class c0156["KnowledgeWriteRequest"] {
        <<type_alias>>
        alias: Type180
        operation: string
    }
    class c0157["ResolvedWriteProject"] {
        <<interface>>
        id: number
        repoName: string
    }
    class c0158["ToolImage"] {
        <<type_alias>>
        data: string
        mimeType: string
        type: Type183
    }
    class c0159["ToolText"] {
        <<type_alias>>
        text: string
        type: Type184
    }
    class c0160["src/knowledge-tools.ts"] {
        <<module>>
        leftoverSearchField(description: string) unknown
        isEntityType(value: unknown) value is EntityType
        record(value: unknown, label: string) Type53
        requiredText(value: unknown, field: string, max: number) string
        optionalText(value: unknown, field: string, max: number) Type91
        requiredId(value: unknown, field: string) number
        optionalId(value: unknown, field: string) Type57
        boundedId(value: unknown, field: string, maximum: number) Type57
        requiredIds(value: unknown, field: string) number[]
        optionalIds(value: unknown, field: string) Type94
        requiredStrings(value: unknown, field: string, maxItems: unknown) string[]
        optionalStrings(value: unknown, field: string, maxItems: unknown) Type95
        optionalImportance(value: unknown) Type57
        commit(value: unknown) Type91
        checkOperation(value: unknown, choices: Set~string~) string
        containsSensitiveData(value: unknown) boolean
        rejectSensitiveInput(value: unknown) void
        need(input: Type53, fields: Type185) void
        validateReadSearch(input: Type53, op: string) void
        validateReadPagination(input: Type53, op: string) void
        validateKnowledgeReadRequest(value: unknown) KnowledgeReadRequest
        validateEntityFields(input: Type53) void
        validateKnowledgeWriteRequest(value: unknown) KnowledgeWriteRequest
        rich(client: ForgetfulClient) KnowledgeClient
        currentProject(context: KnowledgeToolContext, requested: number) number
        resolveWriteProject(Signature108)
        inMemoryProject(memory: Memory, projectId: number) boolean
        inEntityProject(entity: Entity, projectId: number) boolean
        json(value: unknown) string
        page(value: Type186, field: Type187, offset: number, limit: number) unknown
        listPage(values: T[], offset: number, limit: number) Type188
        boundedListPage(values: T[], offset: number, limit: number) Type189
        fileContent(file: StoredFile, offset: number, limit: number) Type190
        readResult(value: unknown, details: Type53) KnowledgeToolResult
        assertReadMemory(Signature109)
        assertReadEntity(Signature110)
        requireReadKnowledge(read: KnowledgeReadContext) KnowledgeClient
        requestedReadProject(read: KnowledgeReadContext) Type57
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
        executeKnowledgeRead(Signature111)
        provenance(context: KnowledgeToolContext, request: Type53) Type191
        effectiveCommit(context: KnowledgeToolContext, request: Type53) Type91
        updateProvenance(Signature112)
        beforeMutation(beforeWrite: Type192, signal: AbortSignal) Promise~void~
        memoryInProject(Signature113)
        entityInProject(Signature114)
        hydrateEntities(Signature115)
        validateAttachments(Signature116)
        compactString(value: unknown) unknown
        compactObjectEntry(key: string, value: unknown, depth: number) unknown
        compactWriteValue(value: unknown, depth: unknown) unknown
        writeResult(value: unknown, operation: string) KnowledgeToolResult
        createMemory(Signature117)
        createEntity(Signature118)
        createDocument(Signature119)
        createCodeArtifact(Signature120)
        replacementMemory(write: KnowledgeWriteContext) Promise~Memory~
        updateMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        supersedeMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkMemories(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateEntity(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        linkEntityMemory(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        createRelationship(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateDocument(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        updateCodeArtifact(write: KnowledgeWriteContext) Promise~KnowledgeToolResult~
        executeKnowledgeWrite(Signature121)
    }
    class c0161["KnowledgeAttachmentIds"] {
        <<interface>>
        documentIds: number[]
        codeArtifactIds: number[]
    }
    class c0162["KnowledgeCodeArtifactPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: CodeArtifactInput
    }
    class c0163["KnowledgeDocumentPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: DocumentInput
    }
    class c0164["KnowledgeEntityMemoryLinkPlan"] {
        <<interface>>
        entityKey: string
    }
    class c0165["KnowledgeEntityPlan"] {
        <<interface>>
        key: string
        existingId: number
        input: EntityInput
    }
    class c0166["KnowledgeMemoryReader"] {
        <<type_alias>>
        alias: Type178
    }
    class c0167["KnowledgeRelationshipPlan"] {
        <<interface>>
        key: string
        existingId: number
        sourceEntityKey: string
        targetEntityKey: string
        input: EntityRelationshipInput
    }
    class c0168["KnowledgeWriteCheckpoint"] {
        <<type_alias>>
        alias: Type193
    }
    class c0169["KnowledgeWriteGuard"] {
        <<type_alias>>
        alias: Type22
    }
    class c0170["KnowledgeWritePlan"] {
        <<interface>>
        operationId: string
        projectId: number
        memoryId: number
        expectedClaim: Type194
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
    class c0171["KnowledgeWriteReceipt"] {
        <<interface>>
        key: string
        id: number
        occurrence: number
    }
    class c0172["KnowledgeWriteSave"] {
        <<type_alias>>
        alias: Type22
    }
    class c0173["KnowledgeWriteState"] {
        <<interface>>
        failure: Type195
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
    class c0174["KnowledgeWriter"] {
        <<class>>
        constructor(Signature122)
        -client: WriteClient
        -readMemory: KnowledgeMemoryReader
        -assertCanWrite: Type23
        -attachmentMemory(plan: KnowledgeWritePlan, signal: AbortSignal) Promise~Memory~
        -recordCreateFailure(Signature123)
        -createOnce(Signature124)
        -writeEntity(Signature125)
        -writeEntities(Signature126)
        -writeDocument(Signature127)
        -writeDocuments(Signature128)
        -writeCodeArtifact(Signature129)
        -writeCodeArtifacts(Signature130)
        -requestedAttachmentIds(Signature131)
        -attachmentIds(memory: Memory, requested: KnowledgeAttachmentIds) KnowledgeAttachmentIds
        -attachmentsDiffer(memory: Memory, ids: KnowledgeAttachmentIds) boolean
        -attachmentPatch(ids: KnowledgeAttachmentIds) Type198
        -writeConnection(Signature132)
        -writeAttachments(Signature133)
        -writeRelationship(Signature134)
        -writeRelationships(Signature135)
        -writeEntityMemoryLink(Signature136)
        -writeEntityMemoryLinks(Signature137)
        -writeLinkedMemory(Signature138)
        -writeLinkedMemories(Signature139)
        execute(Signature140)
    }
    class c0175["ResourceSlot"] {
        <<type_alias>>
        alias: Type200
        occurrence: number
    }
    class c0176["WriteClient"] {
        <<type_alias>>
        alias: Type201
    }
    class c0177["src/knowledge-write.ts"] {
        <<module>>
        resourceSlots(resources: T[]) ResourceSlot~T~[]
        copyState(value: KnowledgeWriteState) KnowledgeWriteState
        positiveId(value: unknown) value is number
        rejectedCreate(error: unknown) boolean
        stateWithNumber(Signature141)
        stateId(values: KnowledgeWriteReceipt[], key: string, occurrence: unknown) Type57
        selectedIds(values: KnowledgeWriteReceipt[], resources: Type202) number[]
        uniqueIds(values: number[]) number[]
        sameIds(left: Type94, right: number[]) boolean
        receipts(value: unknown) KnowledgeWriteReceipt[]
        normalizedState(previous: Partial~KnowledgeWriteState~) KnowledgeWriteState
        hasValue(values: string[], value: string) boolean
        instructionId(plan: KnowledgeWritePlan) string
    }
    class c0178["DiagnosticLogger"] {
        <<interface>>
        +emit(level: Type52, event: string, data: Type53) void
        +flush() Promise~void~
    }
    class c0179["FileLogLevel"] {
        <<type_alias>>
        alias: Type203
    }
    class c0180["FileLogger"] {
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
        constructor(options: Type204) unknown
        -options: Type204
        setLevel(level: FileLogLevel) void
        emit(level: Type52, event: string, data: Type53) void
        -enqueue(level: Type52, event: string, data: Type53) void
        -rotate() Promise~void~
        -warn(error: unknown) void
        close() Promise~void~
        flush() Promise~void~
    }
    class c0181["src/logging.ts"] {
        <<module>>
        processExited(pid: number) boolean
        listLogFiles(directory: string) unknown
        pruneDirectory(directory: string, current: Type46) Promise~void~
        limit(value: Type57, fallback: number) number
        excludeCredentials(value: unknown) unknown
    }
    class c0182["src/memory-context.ts"] {
        <<module>>
        storedMemoryContext(context: string) string
        replacementMemoryContext(context: string) string
        replacementMemoryInput(input: MemoryInput) MemoryInput
    }
    class c0183["CompactedMemoryHistory"] {
        <<interface>>
        summary: string
        retainedMessages: Message[]
    }
    class c0184["ContextWindowError"] {
        <<class>>
    }
    class c0185["MemoryHistorySummaryOptions"] {
        <<interface>>
        model: Model~any~
        compactionSettings: CompactionSettings
        contextLimitTokens: number
        signal: AbortSignal
        sessionId: string
        complete: SummaryCompletion
    }
    class c0186["MemoryTaskContext"] {
        <<class>>
        -settings: typeof DEFAULT_COMPACTION_SETTINGS
        -contextWindow: number
        -originalHistory: Set~Message~
        -compactedHistory: CompactedMemoryHistory
        -summaryMessage: Message
        constructor(Signature142)
        -model: Model~any~
        -task: Message
        getCompactedHistory() Type206
        prepare(Signature143)
        prepareCapture(Signature144)
        -prepareContext(Signature145)
        -applySummary(Signature146)
        -outputAllowance(context: Context) number
    }
    class c0187["SummaryCompletion"] {
        <<type_alias>>
        alias: Type209
    }
    class c0188["src/model-context.ts"] {
        <<module>>
        objectRecord(value: unknown) Type103
        modelEvidence(record: unknown) unknown
        evidenceMessage(record: unknown, label: string, timestamp: number) UserMessage
        evidencePageContent(page: ModelEvidencePage) Type210
        textTokens(text: string) number
        contextTokens(context: Context) number
        assertFits(Signature147)
        validatePositiveSafeInteger(value: unknown, label: string) number
        entriesFor(messages: Message[]) SessionMessageEntry[]
        recentCutIndex(messages: Message[], keepRecentTokens: number) number
        assertImageSupport(context: Context, model: Model~any~) void
        summaryEvidence(message: Message, index: number) UserMessage
        privateContextWindow(model: Model~any~, contextLimitTokens: unknown) number
        compactionSettings(settings: CompactionSettings) typeof DEFAULT_COMPACTION_SETTINGS
        outputCeiling(Signature148)
        resolvedOutputAllowance(Signature149)
        smallerSummaryBatch(messages: Message[], count: number) number
        summarizeMemoryHistory(Signature150)
    }
    class c0189["MemoryModelHeaderTransform"] {
        <<type_alias>>
        alias: Type212
    }
    class c0190["ModelPickerContext"] {
        <<interface>>
        modelRegistry: Type213
        scopedModels: Type214
    }
    class c0191["ModelRegistryPort"] {
        <<interface>>
        +find(provider: string, modelId: string) Type156
        +complete(Signature151)
    }
    class c0192["PiMemoryModel"] {
        <<class>>
        version: string
        -classificationTimeoutMs: number
        -sessionId: string
        -transformHeaders: MemoryModelHeaderTransform
        -logger: DiagnosticLogger
        -compactionSettings: CompactionSettings
        -contextLimitTokens: number
        constructor(Signature152)
        -registry: ModelRegistryPort
        -selection: ModelSelection
        complete(request: ModelRequest) Promise~unknown~
        prepareCapture(request: ModelRequest) Type117
        -emit(level: Type52, event: string, request: ModelRequest, data: Type53) void
        -completeRequest(request: ModelRequest, preparationOnly: unknown) Promise~unknown~
        -completeAttempt(Signature153)
        -executeRead(Signature154)
        -validateSubmission(submission: ModelSubmissionTool, tool: Tool, call: ToolCall) unknown
        -completeWithSubmission(Signature155)
    }
    class c0193["PiMemoryModelOptions"] {
        <<interface>>
        logger: DiagnosticLogger
        classificationTimeoutMs: number
        timeoutMs: number
        sessionId: string
        transformHeaders: MemoryModelHeaderTransform
        compactionSettings: CompactionSettings
        contextLimitTokens: number
    }
    class c0194["RequestDeadline"] {
        <<interface>>
        controller: AbortController
        callerAbort: Promise~never~
        timeout: Promise~never~
        timedOut: boolean
        providerCalls: number
        compactionCalls: number
        +cleanup() void
    }
    class c0195["src/model.ts"] {
        <<module>>
        serializeInput(input: unknown) string
        ensureCompletionFinished(Signature156)
        modelLabel(model: ModelSelection) string
        isOpenCodeModel(model: Model~any~) boolean
        openCodeSessionHeaders(model: Model~any~, sessionId: Type91) Type217
        requestTimeout(request: ModelRequest, classificationTimeoutMs: number) number
        requestOptions(Signature157)
        textBlock(text: string) TextContent
        submissionTool(submission: Type219) Tool
        toolCalls(message: AssistantMessage) ToolCall[]
        rejectionText(error: unknown) string
        sanitizedAssistantForHistory(message: AssistantMessage) AssistantMessage
        errorToolResult(call: ToolCall, error: string) ToolResultMessage
        appendCallCountCorrection(Signature158)
        requestDeadline(request: ModelRequest, timeoutMs: number) RequestDeadline
        throwRequestFailure(Signature159)
        resolveMemoryModel(Signature160)
        modelSelectionFromModel(model: Model~any~) ModelSelection
        availableMemoryModels(ctx: ModelPickerContext) Model~any~[]
    }
    class c0196["src/privacy.ts"] {
        <<module>>
        sanitizeText(text: string) string
        diagnosticMessage(error: unknown) string
        errorMessage(error: unknown) string
        hasSensitiveData(text: string) boolean
        isMemoryOperation(toolName: string) boolean
        sanitizeValue(value: unknown) unknown
    }
    class c0197["AgentProjectInitInput"] {
        <<interface>>
        name: string
        description: string
        projectId: number
    }
    class c0198["ProjectInitError"] {
        <<class>>
    }
    class c0199["src/project-init.ts"] {
        <<module>>
        existingMapping(projects: Project[], repoName: string) Type221
        validateAgentProjectDetails(repoName: string, input: AgentProjectInitInput) ProjectInput
        promptNewProject(ctx: ExtensionContext, repoName: string) Type222
        promptExistingProject(Signature161)
        initialiseProject(Signature162)
        initialiseProjectForAgent(Signature163)
    }
    class c0200["DurableQueueStore"] {
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
        -now: Type47
        -snapshotPrefix: string
        constructor(options: Type224) unknown
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
        -withFileLock(path: string, operation: Type49) Promise~T~
        -withMutationFileLock(operation: Type49) Promise~T~
        -mutate(operation: Type225) Promise~T~
        -pruneFailedJobs(state: QueueState) boolean
        -prune(state: QueueState) void
        -updateWatermark(state: QueueState, update: WatermarkAdvance) QueueWatermark
        enqueue(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        enqueueSnapshot(snapshot: CaptureSnapshot) Promise~QueueEnqueueResult~
        advanceWatermark(update: Type226) Promise~QueueWatermark~
        getWatermark(sessionId: string, branchId: string) Promise~QueueWatermark~
        resolveBranchId(Signature164)
        currentWatermark(context: Type86) Promise~QueueWatermark~
        completeProjectDiscovery(context: Type227) Promise~void~
        listPending(identity: QueueIdentity) Promise~QueueJob[]~
        listJobs(identity: QueueIdentity) Promise~QueueJob[]~
        listJobMetadata(identity: QueueIdentity) Promise~QueueJobMetadata[]~
        getJob(jobId: string) Type71
        refreshCaptureHistory(jobId: string) Type228
        -reusableHistory(snapshot: CaptureSnapshot, watermark: QueueWatermark) Type229
        hasClaimableWork(identity: QueueIdentity, excludeBranches: Type230) Promise~boolean~
        claimNext(identity: QueueIdentity, branch: Type231, onDiscarded: Type232) Type71
        -matchesBranch(job: QueueJob, branch: Type233) boolean
        -runningJobCanBeRecovered(job: QueueJob, currentTime: number) boolean
        -claimJob(job: QueueJob) void
        releaseProgress(jobId: string, replenishModelCalls: unknown) Promise~void~
        cancel(Signature165)
        checkpoint(jobId: string, patch: QueueCheckpoint) Promise~QueueJob~
        checkpoint(jobId: string, candidateId: string, outcome: unknown) Promise~QueueJob~
        checkpoint(jobId: string, patchOrCandidate: Type234, outcome: unknown) Promise~QueueJob~
        -compactJobSnapshot(Signature166)
        -recordCompletedCapture(state: QueueState, job: StoredQueueJob) Promise~void~
        -applyCheckpointPatch(job: StoredQueueJob, patch: QueueCheckpoint) void
        complete(jobId: string) Promise~QueueJob~
        addConflict(conflict: PendingConflict) Promise~PendingConflict~
        getConflict(conflictId: string) Type235
        pendingConflicts(Signature167)
        listPendingConflicts(Signature168)
        markConflictHandedOff(conflictId: string, entryId: string) Promise~void~
        updateConflict(Signature169)
        withWorkerLock(identity: QueueIdentity, branch: Type231, operation: Type49) Type179
        close() Promise~void~
    }
    class c0201["DurableQueueStoreOptions"] {
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
        now: Type47
    }
    class c0202["FileLock"] {
        <<interface>>
        token: string
        +release() Promise~void~
    }
    class c0203["HistoryCache"] {
        <<interface>>
        digest: string
        throughEntryId: string
        entryIds: string[]
    }
    class c0204["PendingConflict"] {
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
        status: Type236
        handoffEntryId: string
        replacementId: number
        uncertainWrite: string
        supersession: SupersessionReceipt
        replacement: Type237
        resolution: unknown
        createdAt: string
        updatedAt: string
    }
    class c0205["QueueBusyError"] {
        <<class>>
        constructor(path: string) unknown
    }
    class c0206["QueueCheckpoint"] {
        <<interface>>
        status: QueueJobStatus
        callCount: number
        extractedCandidates: unknown[]
        candidateOutcomes: Type53
        submissionRejections: string[]
        lastError: string
        startedAt: string
        supersession: SupersessionReceipt
        inspectionEntries: EvidenceEntry[]
        compactedConversation: CompactedConversation
    }
    class c0207["QueueEnqueueResult"] {
        <<interface>>
        queued: boolean
        jobId: string
        reason: string
        historyError: string
    }
    class c0208["QueueIdentity"] {
        <<interface>>
        instanceId: string
        endpoint: string
        accountId: string
    }
    class c0209["QueueJob"] {
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
        candidateOutcomes: Type53
        submissionRejections: string[]
        lastError: string
        uncertainWrite: string
        supersession: SupersessionReceipt
        createdAt: string
        updatedAt: string
        startedAt: string
        ownerPid: number
    }
    class c0210["QueueJobMetadata"] {
        <<interface>>
        snapshot: Type238
    }
    class c0211["QueueJobStatus"] {
        <<type_alias>>
        alias: Type239
    }
    class c0212["QueueState"] {
        <<interface>>
        version: Type240
        jobs: StoredQueueJob[]
        conflicts: PendingConflict[]
        watermarks: Type241
    }
    class c0213["QueueWatermark"] {
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
    class c0214["SnapshotPayload"] {
        <<type_alias>>
        alias: Type242
        historyEntryIds: string[]
    }
    class c0215["StoredQueueJob"] {
        <<interface>>
        snapshotDigest: string
        inspectionDigest: string
    }
    class c0216["SupersessionReceipt"] {
        <<interface>>
        oldMemoryId: number
        replacementId: number
        operation: Type243
        status: Type10
    }
    class c0217["WatermarkAdvance"] {
        <<interface>>
        sessionId: string
        branchId: string
        entryIds: string[]
        finalEntryId: string
        snapshotId: string
        dedupeKey: string
    }
    class c0218["src/queue.ts"] {
        <<module>>
        jsonSnapshot(value: T) T
        nowIso(now: Type47) string
        contextKey(sessionId: string, branchId: string) string
        dedupeKey(snapshot: CaptureSnapshot) string
        jobIdFor(key: string) string
        scrubDiagnostic(value: string) string
        outcomeRecord(value: unknown) Type53
        interruptedWrite(job: QueueJob) boolean
        releaseCompletedArtifacts(job: StoredQueueJob) void
        normaliseState(value: unknown) QueueState
        validateInspectionEntry(input: EvidenceEntry, reserved: Set~string~) void
        isProcessAlive(pid: unknown) boolean
        identityMatches(job: QueueJob, identity: QueueIdentity) boolean
        conflictIdentityMatches(conflict: PendingConflict, identity: QueueIdentity) boolean
        shouldRetain(timestamp: string, now: number, retentionMs: number) boolean
        diagnosticError(error: unknown) string
        recordId(value: unknown) Type91
        orderedSourceEntryIds(snapshot: CaptureSnapshot) Type95
        summaryCursor(snapshot: CaptureSnapshot) Type244
        cursorComparison(candidate: Type245, current: Type246) Type57
        clearHistoryCache(watermark: QueueWatermark) void
        historyCaches(watermark: QueueWatermark) HistoryCache[]
        setHistoryCaches(watermark: QueueWatermark, caches: HistoryCache[]) void
    }
    class c0219["DeadlineSignal"] {
        <<interface>>
        signal: AbortSignal
        finish: Type23
        pause: Type23
        resume: Type23
        expired: Type46
        diagnostic: Type247
    }
    class c0220["DeeperRecallRequest"] {
        <<interface>>
        query: string
        context: WorkContext
        scope: Scope
        signal: AbortSignal
        deadlineMs: number
        projects: Project[]
    }
    class c0221["RecallPlan"] {
        <<interface>>
        search: boolean
        queries: string[]
        queryIntent: string
        entities: string[]
        repositorySpecific: boolean
        projectId: number
    }
    class c0222["RecallRequest"] {
        <<interface>>
        diagnosticContext: Type248
        prompt: string
        context: WorkContext
        scope: Scope
        classificationPolicy: string
        recallPolicy: string
        signal: AbortSignal
        deadlineMs: number
        authorizeProject: Type249
        projects: Project[]
        sessionContext: EvidenceEntry[]
        onPlan: Type250
    }
    class c0223["RecallResult"] {
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
    class c0224["RecallService"] {
        <<class>>
        -defaultDeadlineMs: number
        -failureThreshold: number
        -cooldownMs: number
        -now: Type251
        -knowledge: KnowledgeReadService
        -concurrency: number
        -failures: unknown
        -openedAt: Type57
        constructor(Signature170)
        -client: ForgetfulClient
        -model: MemoryModelClient
        recall(request: RecallRequest) Promise~RecallResult~
        -recallReadTool(Signature171)
        -finishFailure(Signature172)
        -finishReview(Signature173)
        deeper(request: DeeperRecallRequest) Promise~RecallResult~
        -memoryInScope(memory: Memory, scope: Scope, projectId: number) boolean
        -optionalKnowledge(Signature174)
        -resultWithKnowledge(Signature175)
        -plannerInput(request: RecallRequest) unknown
        -authorizeProjectSelection(Signature176)
        -requestsDifferentProject(Signature177)
        -searchMemories(Signature178)
        -searchFailure(error: unknown) unknown
        -searchRequest(Signature179)
        -queryContext(plan: RecallPlan) string
        -resolveScope(Signature180)
        -contextProjectResolution(context: WorkContext) ScopeResolution
        -matchResolution(matches: Project[]) ScopeResolution
        -ensureLive(deadline: DeadlineSignal) void
        -empty(scope: Scope, reason: string) RecallResult
        -circuitOpen() boolean
        -recordFailure() void
        -recordSuccess() void
    }
    class c0225["RecallServiceOptions"] {
        <<interface>>
        concurrency: number
        deadlineMs: number
        circuitFailureThreshold: number
        circuitCooldownMs: number
        now: Type251
    }
    class c0226["ReviewValidationError"] {
        <<class>>
        constructor(message: string, debug: string) unknown
        debug: string
    }
    class c0227["ScopeResolution"] {
        <<interface>>
        projectId: number
        project: Project
        reason: string
    }
    class c0228["SearchOutcome"] {
        <<interface>>
        memories: Memory[]
        failed: boolean
        diagnostic: string
        failure: unknown
    }
    class c0229["src/recall.ts"] {
        <<module>>
        isForgetfulResponseError(error: unknown) Type256
        isObject(value: unknown) Type103
        plannerString(value: unknown, field: string, required: unknown) string
        positiveInteger(value: unknown, field: string) number
        abortError() Error
        isAbort(error: unknown) boolean
        failureReason(deadline: DeadlineSignal, callerSignal: AbortSignal) string
        exceptionDiagnostic(stage: string, error: unknown) string
        trim(value: string, max: number) string
        repositoryIdentity(context: WorkContext) Type91
        repoAwareQuery(query: string, context: WorkContext, repositorySpecific: boolean) string
        availableProjects(context: WorkContext, supplied: Project[]) Project[]
        createDeadlineSignal(callerSignal: Type170, deadlineMs: number) DeadlineSignal
        raceAbort(promise: Promise~T~, signal: AbortSignal) Promise~T~
        parseQueries(value: unknown, search: boolean) string[]
        parseEntities(value: unknown) string[]
        parsePlan(value: unknown) RecallPlan
        validateMemory(value: unknown) Type257
        formatRecall(Signature181)
        reviewSources(result: Partial~RecallResult~) Type259
        sourceLabels(sources: ReturnType~typeof reviewSources~) string[]
        boundDebugText(value: string, max: number, marker: string) string
        reviewerOutputText(value: unknown) string
        reviewMismatchDirection(value: unknown) Type91
        reviewValidationDebug(Signature182)
        submissionAttemptTrace(rejections: string[], exhausted: unknown, label: Type260) string
        parseReview(value: unknown, candidates: RecallResult) Type261
        recallReviewSubmission(Signature183)
        sanitizePolicy(value: string) string
    }
    class c0230["src/repository.ts"] {
        <<module>>
        repositoryName(value: string) string
    }
    class c0231["SetupHelp"] {
        <<interface>>
        newInstance: boolean
        route: Type263
    }
    class c0232["src/setup.ts"] {
        <<module>>
        promptSetupHelp(ctx: ExtensionContext) Type264
        buildSetupPrompt(help: SetupHelp, agentDir: string, settingsPath: string) string
    }
    class c0233["CaptureSnapshotWithStatus"] {
        <<interface>>
        finalStopReason: string
    }
    class c0234["MessageRecord"] {
        <<interface>>
        role: unknown
        content: unknown
        toolName: unknown
        isError: unknown
        stopReason: unknown
        toolCallId: unknown
        details: unknown
    }
    class c0235["SnapshotOptions"] {
        <<interface>>
        session: SnapshotSessionReader
        context: WorkContext
        instanceId: string
        mode: CaptureMode
        scope: Scope
        policy: string
        modelVersion: string
        afterEntryId: Type110
        baselineEntryId: Type110
        branchId: string
        createdAt: string
        leafEntryId: string
        excludedEvidenceEntryIds: readonly string[]
        includeToolEvidence: Type265
    }
    class c0236["SnapshotResult"] {
        <<type_alias>>
        alias: Type266
        snapshot: CaptureSnapshotWithStatus
        status: Type267
        finalEntryId: string
        reason: string
        status: Type268
    }
    class c0237["SnapshotSessionReader"] {
        <<interface>>
        +getSessionId() string
        +getLeafId() Type110
        +getBranch(fromId: string) SessionEntry[]
    }
    class c0238["src/snapshot.ts"] {
        <<module>>
        isRecord(value: unknown) Type103
        asMessage(entry: SessionEntry) Type269
        contentText(content: unknown) string
        safeText(text: string) string
        sanitizeConversation(value: unknown) unknown
        sanitizeCaptureConversation(conversation: readonly unknown[]) unknown[]
        sanitizeCaptureSnapshot(snapshot: CaptureSnapshot) CaptureSnapshot
        conversationForEntry(entry: SessionEntry) unknown
        rootId(branch: SessionEntry[], fallback: string) string
        snapshotId(sessionId: string, branchId: string, finalEntryId: string) string
        deltaStartIndex(Signature184)
        toolEvidence(id: string, message: MessageRecord, includeToolEvidence: Type272) Type271
        evidenceForEntry(entry: SessionEntry, includeToolEvidence: Type273) Type271
        lastAssistantEntry(entries: SessionEntry[]) Type274
        collectEvidence(entries: SessionEntry[], includeToolEvidence: Type272) EvidenceEntry[]
        captureSummaryRecord(history: CaptureHistorySummary) unknown
        captureConversation(snapshot: CaptureSnapshot) readonly unknown[]
        compactCaptureSnapshot(Signature185)
        reuseCaptureHistory(snapshot: CaptureSnapshot, history: Type275) CaptureSnapshot
        buildCaptureSnapshot(options: SnapshotOptions) SnapshotResult
    }
    class c0239["SourceInspectionError"] {
        <<interface>>
        name: string
        message: string
        code: string
    }
    class c0240["SourceInspectionRequest"] {
        <<type_alias>>
        alias: Type276
        path: string
        path: never
        url: never
        url: string
    }
    class c0241["SourceInspectionResult"] {
        <<type_alias>>
        alias: Type277
        status: Type278
        identifier: string
        content: string
        observedAt: string
        contentHash: string
        sanitized: boolean
        page: Type279
        source_repo: string
        source_files: string[]
        source_url: string
        encoding_version: string
        fileState: Type280
        provenanceError: SourceInspectionError
        httpStatus: number
        status: Type281
        observedAt: string
        error: SourceInspectionError
        source_url: string
        httpStatus: number
        httpStatusText: string
        body: string
    }
    class c0242["SourceInspector"] {
        <<class>>
        -root: Type282
        constructor(options: SourceInspectorOptions) unknown
        -options: SourceInspectorOptions
        inspect(input: unknown, signal: AbortSignal) Promise~SourceInspectionResult~
        -inspectUrl(request: Type283, signal: AbortSignal) Promise~SourceInspectionResult~
        -getUrl(url: URL, allowLoopback: boolean, signal: AbortSignal) Type284
        -check(signal: AbortSignal) void
        -readFile(cwd: string, path: string, signal: AbortSignal) Promise~Buffer~
        -provenance(cwd: string, path: string, bytes: Buffer, signal: AbortSignal) unknown
        -git(cwd: string, args: string[], signal: AbortSignal) Promise~string~
    }
    class c0243["SourceInspectorOptions"] {
        <<interface>>
        cwd: string
        repoName: string
        canRead: Type46
    }
    class c0244["src/source-inspection.ts"] {
        <<module>>
        loopback(host: string) boolean
        validateUrl(url: URL) string
        validateAddress(address: string, allowLoopback: boolean) void
        errorDetails(error: unknown) SourceInspectionError
        sourceContent(bytes: Buffer, request: SourceInspectionRequest) unknown
        requireInside(cwd: string, path: string) void
    }
    c0000 ..> c0129 : defaultExtension() calls createForgetfulExtension()
    c0003 ..> c0004 : setLabel() calls refresh()
    c0003 ..> c0047 : dispose() calls stop()
    c0004 --> c0003 : field loader
    c0004 ..> c0003 : 4 relationships (see list)
    c0004 ..> c0004 : 3 relationships (see list)
    c0004 ..> c0047 : refresh() calls now()
    c0007 ..> c0005 : type in initialCorrectionCycle
    c0007 ..> c0096 : type in captureFailureReport
    c0007 ..> c0196 : captureFailureReport() calls sanitizeValue()
    c0008 --> c0009 : 2 relationships (see list)
    c0008 --> c0010 : field decisions
    c0008 --> c0011 : field preservation
    c0008 --> c0012 : field previous
    c0008 --> c0072 : field resources
    c0008 --> c0076 : field resources
    c0008 --> c0089 : 2 relationships (see list)
    c0012 --> c0072 : field codeArtifacts
    c0012 --> c0076 : field documents
    c0012 --> c0079 : field entities
    c0012 --> c0089 : field memory
    c0013 ..> c0004 : 2 relationships (see list)
    c0013 ..> c0006 : authorizedMemory() constructs CaptureSelectionError
    c0013 ..> c0008 : 8 relationships (see list)
    c0013 ..> c0009 : type in executeConnection
    c0013 ..> c0010 : 3 relationships (see list)
    c0013 ..> c0011 : type in validateLinkReviews
    c0013 ..> c0012 : type in preparePreviousConnections
    c0013 ..> c0013 : 10 relationships (see list)
    c0013 ..> c0072 : type in readAttachmentRecords
    c0013 ..> c0076 : type in readAttachmentRecords
    c0013 ..> c0086 : 7 relationships (see list)
    c0013 ..> c0089 : 6 relationships (see list)
    c0013 ..> c0104 : 3 relationships (see list)
    c0013 ..> c0131 : 8 relationships (see list)
    c0013 ..> c0134 : 6 relationships (see list)
    c0013 ..> c0174 : executeConnection() calls execute()
    c0013 ..> c0196 : 5 relationships (see list)
    c0013 ..> c0229 : validateLinkDecisions() calls trim()
    c0014 --> c0104 : field scope
    c0016 --|> c0014 : inherits
    c0018 ..> c0006 : 3 relationships (see list)
    c0018 ..> c0014 : 4 relationships (see list)
    c0018 ..> c0015 : 4 relationships (see list)
    c0018 ..> c0016 : type in preserveMergeConnections
    c0018 ..> c0018 : 8 relationships (see list)
    c0018 ..> c0086 : 5 relationships (see list)
    c0018 ..> c0089 : type in collectMergeConnections
    c0018 ..> c0131 : 7 relationships (see list)
    c0018 ..> c0134 : 2 relationships (see list)
    c0018 ..> c0174 : preserveMergeConnections() calls execute()
    c0019 --> c0026 : field candidates
    c0024 --> c0026 : field candidate
    c0024 --> c0039 : field neighborhood
    c0024 --> c0089 : field overlaps
    c0026 --> c0029 : field codeArtifacts
    c0026 --> c0035 : field documents
    c0026 --> c0037 : field entities
    c0026 --> c0044 : field relationships
    c0027 --> c0025 : field excludeBranches
    c0028 --> c0025 : field deferredBranches
    c0029 --|> c0162 : inherits
    c0030 --> c0021 : field action
    c0030 --> c0046 : field reuse
    c0031 --> c0008 : field linkReview
    c0031 --> c0021 : field action
    c0032 --> c0204 : field status
    c0033 --> c0031 : field candidates
    c0033 --> c0211 : field status
    c0034 --> c0032 : field conflicts
    c0034 --> c0033 : field jobs
    c0035 --|> c0163 : inherits
    c0037 --|> c0165 : inherits
    c0038 --> c0015 : field connections
    c0038 --> c0026 : field candidate
    c0038 --> c0089 : field memories
    c0039 --> c0072 : field codeArtifacts
    c0039 --> c0076 : field documents
    c0039 --> c0079 : field entities
    c0039 --> c0081 : field relationships
    c0040 --> c0049 : field uncertainWrite
    c0040 --> c0216 : field supersession
    c0041 --|> c0100 : inherits
    c0042 --|> c0204 : inherits
    c0044 --|> c0167 : inherits
    c0045 --> c0204 : field conflict
    c0047 ..> c0004 : activity() calls set()
    c0047 ..> c0006 : 9 relationships (see list)
    c0047 ..> c0007 : 13 relationships (see list)
    c0047 ..> c0008 : 5 relationships (see list)
    c0047 ..> c0013 : 4 relationships (see list)
    c0047 ..> c0018 : 6 relationships (see list)
    c0047 --> c0022 : field activityPhase
    c0047 ..> c0022 : type in activity
    c0047 ..> c0023 : 2 relationships (see list)
    c0047 ..> c0024 : type in prepareOverlapBatch
    c0047 ..> c0025 : 3 relationships (see list)
    c0047 ..> c0026 : 42 relationships (see list)
    c0047 ..> c0027 : 3 relationships (see list)
    c0047 ..> c0028 : 13 relationships (see list)
    c0047 ..> c0030 : 13 relationships (see list)
    c0047 ..> c0034 : type in diagnostics
    c0047 ..> c0036 : 2 relationships (see list)
    c0047 ..> c0038 : 3 relationships (see list)
    c0047 ..> c0039 : 2 relationships (see list)
    c0047 ..> c0041 : 13 relationships (see list)
    c0047 ..> c0042 : 2 relationships (see list)
    c0047 ..> c0043 : ensureModelCallAllowed() constructs CaptureProgress
    c0047 ..> c0045 : 6 relationships (see list)
    c0047 ..> c0047 : 227 relationships (see list)
    c0047 --> c0048 : field onActivity
    c0047 ..> c0048 : type in constructor
    c0047 ..> c0049 : 9 relationships (see list)
    c0047 ..> c0050 : 3 relationships (see list)
    c0047 ..> c0051 : 2 relationships (see list)
    c0047 ..> c0052 : 4 relationships (see list)
    c0047 ..> c0053 : resolveDestination() constructs MissingCaptureDestination
    c0047 ..> c0054 : 6 relationships (see list)
    c0047 ..> c0055 : 107 relationships (see list)
    c0047 --> c0070 : field getMode
    c0047 ..> c0070 : 3 relationships (see list)
    c0047 ..> c0071 : 7 relationships (see list)
    c0047 ..> c0079 : 4 relationships (see list)
    c0047 ..> c0081 : type in neighborhoodRelationships
    c0047 --> c0086 : field client
    c0047 ..> c0086 : type in cancellableClient
    c0047 ..> c0087 : type in cancellableKnowledge
    c0047 --> c0089 : field readSavedMemory
    c0047 ..> c0089 : 15 relationships (see list)
    c0047 ..> c0090 : type in createMemory
    c0047 --> c0092 : field model
    c0047 ..> c0094 : evidenceReadTool() constructs ModelEvidencePage
    c0047 ..> c0095 : sourceInspectionTool() constructs ModelReadErrorResult
    c0047 ..> c0096 : 2 relationships (see list)
    c0047 ..> c0107 : 4 relationships (see list)
    c0047 ..> c0131 : 35 relationships (see list)
    c0047 ..> c0134 : 32 relationships (see list)
    c0047 --> c0174 : field knowledgeWriter
    c0047 ..> c0174 : 2 relationships (see list)
    c0047 --> c0178 : field logger
    c0047 ..> c0180 : 14 relationships (see list)
    c0047 ..> c0182 : 4 relationships (see list)
    c0047 ..> c0186 : loadCandidates() calls prepareCapture()
    c0047 ..> c0196 : 23 relationships (see list)
    c0047 --> c0200 : field queue
    c0047 ..> c0200 : 70 relationships (see list)
    c0047 ..> c0204 : 13 relationships (see list)
    c0047 --> c0208 : field identity
    c0047 ..> c0209 : 57 relationships (see list)
    c0047 ..> c0216 : type in recordSupersession
    c0047 ..> c0229 : 3 relationships (see list)
    c0047 ..> c0238 : 8 relationships (see list)
    c0047 ..> c0242 : 2 relationships (see list)
    c0048 --> c0022 : field onActivity
    c0048 --> c0070 : field getMode
    c0048 --> c0086 : field client
    c0048 --> c0092 : field model
    c0048 --> c0178 : field logger
    c0048 --> c0200 : field queue
    c0049 --|> c0041 : inherits
    c0050 --> c0084 : field selectedAdditionalEntries
    c0051 --> c0026 : field candidate
    c0051 --> c0089 : field oldMemory
    c0051 --> c0209 : field fakeJob
    c0053 --|> c0006 : inherits
    c0053 ..> c0026 : type in constructor
    c0054 --> c0084 : field additionalEntries
    c0055 ..> c0019 : type in parseCandidates
    c0055 ..> c0020 : 3 relationships (see list)
    c0055 ..> c0026 : 7 relationships (see list)
    c0055 ..> c0030 : 6 relationships (see list)
    c0055 ..> c0038 : type in reusableMergeComposition
    c0055 ..> c0050 : type in conflictResolutionEvidence
    c0055 ..> c0052 : 11 relationships (see list)
    c0055 ..> c0055 : 36 relationships (see list)
    c0055 ..> c0071 : 8 relationships (see list)
    c0055 ..> c0084 : 3 relationships (see list)
    c0055 ..> c0089 : type in captureKnowledgePlan
    c0055 ..> c0091 : type in memoryInput
    c0055 ..> c0099 : type in captureCandidateSubmission
    c0055 ..> c0107 : 4 relationships (see list)
    c0055 ..> c0134 : 2 relationships (see list)
    c0055 ..> c0170 : type in captureKnowledgePlan
    c0055 ..> c0196 : 10 relationships (see list)
    c0055 ..> c0229 : 7 relationships (see list)
    c0055 ..> c0238 : snapshotForPersistence() calls sanitizeCaptureSnapshot()
    c0055 ..> c0242 : errorMessage() calls inspect()
    c0057 --> c0058 : field instance
    c0057 --> c0061 : field model
    c0057 --> c0065 : field prompts
    c0057 --> c0066 : field scopeSource
    c0057 --> c0067 : field verbosity
    c0057 --> c0070 : field captureMode
    c0057 --> c0104 : field scope
    c0057 --> c0179 : field logging
    c0068 ..> c0047 : resolveLogDirectory() calls resolve()
    c0068 ..> c0057 : type in loadForgetfulConfig
    c0068 ..> c0059 : 2 relationships (see list)
    c0068 ..> c0060 : type in loadForgetfulConfig
    c0068 ..> c0061 : 2 relationships (see list)
    c0068 ..> c0063 : 2 relationships (see list)
    c0068 ..> c0065 : 2 relationships (see list)
    c0068 ..> c0066 : type in resolveScope
    c0068 ..> c0067 : 2 relationships (see list)
    c0068 ..> c0068 : 31 relationships (see list)
    c0068 ..> c0070 : type in resolveCaptureMode
    c0068 ..> c0104 : 2 relationships (see list)
    c0068 ..> c0160 : 2 relationships (see list)
    c0068 ..> c0179 : type in isFileLogLevel
    c0068 ..> c0180 : writeJson() calls close()
    c0068 ..> c0229 : 4 relationships (see list)
    c0071 --> c0069 : field historySummary
    c0071 --> c0070 : field mode
    c0071 --> c0084 : field entries
    c0071 --> c0104 : field scope
    c0071 --> c0107 : field context
    c0072 --|> c0073 : inherits
    c0073 --|> c0103 : inherits
    c0076 --|> c0077 : inherits
    c0077 --|> c0103 : inherits
    c0079 --|> c0080 : inherits
    c0080 --> c0083 : field entity_type
    c0080 --|> c0103 : inherits
    c0081 --|> c0082 : inherits
    c0082 --|> c0103 : inherits
    c0086 --> c0087 : field knowledge
    c0086 ..> c0089 : 2 relationships (see list)
    c0086 ..> c0090 : type in create
    c0086 ..> c0091 : type in create
    c0086 ..> c0093 : type in queryMemory
    c0086 ..> c0101 : 3 relationships (see list)
    c0086 ..> c0102 : type in createProject
    c0086 ..> c0105 : 2 relationships (see list)
    c0087 ..> c0072 : 3 relationships (see list)
    c0087 ..> c0073 : 2 relationships (see list)
    c0087 ..> c0074 : type in listCodeArtifacts
    c0087 ..> c0076 : 3 relationships (see list)
    c0087 ..> c0077 : 2 relationships (see list)
    c0087 ..> c0078 : type in listDocuments
    c0087 ..> c0079 : 4 relationships (see list)
    c0087 ..> c0080 : 2 relationships (see list)
    c0087 ..> c0081 : 2 relationships (see list)
    c0087 ..> c0082 : type in createRelationship
    c0087 ..> c0085 : type in listFiles
    c0087 ..> c0089 : type in updateMemory
    c0087 ..> c0091 : type in updateMemory
    c0087 ..> c0106 : type in getFile
    c0088 --> c0089 : field memory
    c0089 --|> c0091 : inherits
    c0092 ..> c0097 : 2 relationships (see list)
    c0093 --> c0088 : field linked_memories
    c0093 --> c0089 : field primary_memories
    c0097 --> c0075 : field onConversationCompacted
    c0097 --> c0096 : field readTools
    c0097 --> c0099 : field submission
    c0106 --|> c0085 : inherits
    c0107 --> c0101 : field project
    c0111 --> c0108 : field outcome
    c0111 --> c0112 : field state
    c0113 ..> c0027 : type in checkpoint
    c0113 ..> c0028 : type in checkpoint
    c0113 ..> c0071 : type in enqueue
    c0113 ..> c0084 : type in resolveConflict
    c0116 --> c0101 : field projects
    c0116 --|> c0107 : inherits
    c0117 --> c0057 : 2 relationships (see list)
    c0117 --> c0086 : 4 relationships (see list)
    c0117 --> c0113 : 2 relationships (see list)
    c0117 --> c0116 : field resolveWorkContext
    c0117 --> c0125 : 2 relationships (see list)
    c0117 --> c0192 : 2 relationships (see list)
    c0118 --> c0060 : field config
    c0118 --> c0117 : field dependencies
    c0118 --> c0120 : field policies
    c0121 --> c0057 : field config
    c0121 --> c0086 : field client
    c0121 --> c0116 : field context
    c0121 --> c0125 : field recall
    c0121 --> c0180 : field logger
    c0121 --> c0192 : field model
    c0122 --> c0104 : field scope
    c0124 --> c0126 : field runtime
    c0124 --> c0223 : 2 relationships (see list)
    c0125 ..> c0084 : type in recall
    c0125 ..> c0220 : type in deeper
    c0125 ..> c0222 : type in recall
    c0125 ..> c0223 : 2 relationships (see list)
    c0126 --> c0004 : field activity
    c0126 --> c0025 : field captureDeferrals
    c0126 --> c0028 : field recoveryResult
    c0126 --> c0057 : field config
    c0126 --> c0086 : field client
    c0126 --> c0112 : field pendingCaptureJobs
    c0126 --> c0113 : field capture
    c0126 --> c0116 : field context
    c0126 --> c0122 : field lastRecall
    c0126 --> c0125 : field recall
    c0126 --> c0180 : field logger
    c0126 --> c0192 : field model
    c0126 --> c0200 : field queue
    c0128 --> c0109 : field automaticRecalls
    c0128 --> c0119 : field pendingQueuedRecall
    c0128 --> c0124 : field recallJobs
    c0128 --> c0126 : 2 relationships (see list)
    c0129 ..> c0004 : 3 relationships (see list)
    c0129 ..> c0028 : 2 relationships (see list)
    c0129 ..> c0047 : 5 relationships (see list)
    c0129 ..> c0057 : 5 relationships (see list)
    c0129 ..> c0061 : type in parseSelection
    c0129 ..> c0067 : type in log
    c0129 ..> c0084 : type in recallContextEntries
    c0129 ..> c0108 : 3 relationships (see list)
    c0129 ..> c0110 : type in boundedWait
    c0129 ..> c0111 : 3 relationships (see list)
    c0129 ..> c0113 : type in readCaptureOutcome
    c0129 ..> c0115 : type in collectDiagnosticParts
    c0129 ..> c0116 : 3 relationships (see list)
    c0129 ..> c0118 : type in createForgetfulExtension
    c0129 ..> c0120 : type in policyText
    c0129 ..> c0122 : type in recallActivitySummary
    c0129 ..> c0126 : 3 relationships (see list)
    c0129 ..> c0127 : type in promptSetupAuthentication
    c0129 ..> c0129 : 34 relationships (see list)
    c0129 ..> c0130 : createForgetfulExtension() calls registerForegroundTool()
    c0129 ..> c0134 : 4 relationships (see list)
    c0129 ..> c0195 : 3 relationships (see list)
    c0129 ..> c0196 : 13 relationships (see list)
    c0129 ..> c0223 : 5 relationships (see list)
    c0129 ..> c0229 : 8 relationships (see list)
    c0129 ..> c0230 : qualifiedRepository() calls repositoryName()
    c0131 ..> c0072 : 2 relationships (see list)
    c0131 ..> c0073 : 2 relationships (see list)
    c0131 ..> c0074 : type in listCodeArtifacts
    c0131 ..> c0076 : 2 relationships (see list)
    c0131 ..> c0077 : 2 relationships (see list)
    c0131 ..> c0078 : type in listDocuments
    c0131 ..> c0079 : 3 relationships (see list)
    c0131 ..> c0080 : 2 relationships (see list)
    c0131 ..> c0081 : type in getRelationships
    c0131 ..> c0082 : type in createRelationship
    c0131 ..> c0085 : type in listFiles
    c0131 ..|> c0087 : implements
    c0131 --> c0089 : field parseMemory
    c0131 ..> c0089 : type in constructor
    c0131 ..> c0091 : type in updateMemory
    c0131 ..> c0106 : type in getFile
    c0131 --> c0132 : field request
    c0131 ..> c0132 : type in constructor
    c0131 ..> c0133 : 45 relationships (see list)
    c0131 ..> c0134 : 21 relationships (see list)
    c0131 ..> c0138 : 4 relationships (see list)
    c0131 ..> c0140 : 2 relationships (see list)
    c0133 ..> c0072 : type in artifact
    c0133 ..> c0073 : type in resourceBody
    c0133 ..> c0074 : type in summary
    c0133 ..> c0076 : type in document
    c0133 ..> c0077 : type in resourceBody
    c0133 ..> c0078 : type in summary
    c0133 ..> c0079 : type in entity
    c0133 ..> c0080 : type in entityBody
    c0133 ..> c0081 : type in relationship
    c0133 ..> c0082 : type in relationshipBody
    c0133 ..> c0085 : type in fileSummary
    c0133 ..> c0103 : type in provenance
    c0133 ..> c0133 : 40 relationships (see list)
    c0133 ..> c0138 : 8 relationships (see list)
    c0133 ..> c0229 : text() calls trim()
    c0134 ..> c0004 : 2 relationships (see list)
    c0134 ..> c0047 : readResponse() calls read()
    c0134 ..|> c0086 : implements
    c0134 ..> c0089 : 2 relationships (see list)
    c0134 ..> c0090 : type in create
    c0134 ..> c0091 : type in create
    c0134 ..> c0093 : type in queryMemory
    c0134 ..> c0101 : 3 relationships (see list)
    c0134 ..> c0102 : type in createProject
    c0134 ..> c0105 : 2 relationships (see list)
    c0134 ..> c0133 : 3 relationships (see list)
    c0134 ..> c0134 : 19 relationships (see list)
    c0134 ..> c0135 : type in constructor
    c0134 ..> c0137 : throwResponseError() constructs ForgetfulHttpError
    c0134 ..> c0138 : 5 relationships (see list)
    c0134 ..> c0139 : request() constructs ForgetfulTimeoutError
    c0134 ..> c0140 : 22 relationships (see list)
    c0134 ..> c0200 : readResponse() calls cancel()
    c0134 ..> c0230 : 2 relationships (see list)
    c0140 ..> c0004 : uniqueMemories() calls set()
    c0140 ..> c0088 : type in parseLinkedMemories
    c0140 ..> c0089 : 3 relationships (see list)
    c0140 ..> c0093 : 2 relationships (see list)
    c0140 ..> c0101 : type in parseProject
    c0140 ..> c0105 : type in searchBody
    c0140 ..> c0133 : parseMemory() calls memoryMetadata()
    c0140 ..> c0136 : 2 relationships (see list)
    c0140 ..> c0138 : 12 relationships (see list)
    c0140 ..> c0140 : 23 relationships (see list)
    c0140 ..> c0229 : projectText() calls trim()
    c0141 --> c0072 : field artifacts
    c0141 --> c0076 : field documents
    c0141 --> c0085 : field files
    c0142 --|> c0143 : inherits
    c0142 --> c0144 : field failures
    c0143 --> c0089 : field memories
    c0143 --> c0104 : field scope
    c0145 ..> c0004 : 3 relationships (see list)
    c0145 ..> c0072 : type in appendArtifactLines
    c0145 ..> c0076 : type in appendDocumentLines
    c0145 ..> c0079 : 9 relationships (see list)
    c0145 ..> c0081 : 3 relationships (see list)
    c0145 ..> c0085 : type in appendFileLines
    c0145 --> c0087 : field client
    c0145 ..> c0087 : type in constructor
    c0145 ..> c0131 : 8 relationships (see list)
    c0145 ..> c0134 : formatRelationships() calls get()
    c0145 ..> c0141 : 2 relationships (see list)
    c0145 ..> c0142 : 8 relationships (see list)
    c0145 ..> c0143 : 2 relationships (see list)
    c0145 ..> c0144 : 3 relationships (see list)
    c0145 ..> c0145 : 17 relationships (see list)
    c0145 ..> c0146 : type in constructor
    c0145 ..> c0147 : 4 relationships (see list)
    c0145 --> c0148 : field readMemory
    c0145 ..> c0148 : type in constructor
    c0145 ..> c0149 : 4 relationships (see list)
    c0145 ..> c0150 : 22 relationships (see list)
    c0145 ..> c0196 : expand() calls errorMessage()
    c0145 ..> c0229 : findEntities() calls trim()
    c0146 --> c0148 : field readMemory
    c0147 --> c0079 : field entity
    c0149 --> c0079 : 2 relationships (see list)
    c0149 --> c0081 : field relationship
    c0150 ..> c0079 : 2 relationships (see list)
    c0150 ..> c0081 : type in validRelationship
    c0150 ..> c0089 : type in validMemory
    c0150 ..> c0104 : 2 relationships (see list)
    c0150 ..> c0142 : type in safeCall
    c0150 ..> c0150 : 5 relationships (see list)
    c0150 ..> c0196 : 3 relationships (see list)
    c0150 ..> c0229 : validRelationship() calls trim()
    c0151 --> c0086 : field client
    c0151 --> c0087 : field knowledge
    c0151 --> c0152 : field request
    c0151 --> c0153 : field context
    c0153 --> c0104 : field scope
    c0154 --> c0106 : field file
    c0154 --> c0158 : field content
    c0154 --> c0159 : field content
    c0155 --> c0086 : field client
    c0155 --> c0087 : field knowledge
    c0155 --> c0153 : field context
    c0155 --> c0156 : field request
    c0160 ..> c0072 : type in page
    c0160 ..> c0076 : type in page
    c0160 ..> c0079 : 4 relationships (see list)
    c0160 ..> c0083 : type in isEntityType
    c0160 ..> c0086 : 7 relationships (see list)
    c0160 ..> c0087 : 9 relationships (see list)
    c0160 ..> c0089 : 4 relationships (see list)
    c0160 ..> c0103 : type in updateProvenance
    c0160 ..> c0106 : type in fileContent
    c0160 ..> c0131 : 28 relationships (see list)
    c0160 ..> c0134 : 10 relationships (see list)
    c0160 ..> c0151 : 15 relationships (see list)
    c0160 ..> c0152 : 2 relationships (see list)
    c0160 ..> c0153 : 13 relationships (see list)
    c0160 ..> c0154 : 29 relationships (see list)
    c0160 ..> c0155 : 9 relationships (see list)
    c0160 ..> c0156 : 2 relationships (see list)
    c0160 ..> c0157 : type in resolveWriteProject
    c0160 ..> c0158 : type in fileContent
    c0160 ..> c0159 : type in fileContent
    c0160 ..> c0160 : 176 relationships (see list)
    c0160 ..> c0182 : replacementMemory() calls replacementMemoryContext()
    c0160 ..> c0196 : containsSensitiveData() calls hasSensitiveData()
    c0160 ..> c0229 : 2 relationships (see list)
    c0162 --> c0073 : field input
    c0163 --> c0077 : field input
    c0165 --> c0080 : field input
    c0167 --> c0082 : field input
    c0170 --> c0162 : field codeArtifacts
    c0170 --> c0163 : field documents
    c0170 --> c0164 : field entityMemoryLinks
    c0170 --> c0165 : field entities
    c0170 --> c0167 : field relationships
    c0173 --> c0171 : 4 relationships (see list)
    c0174 ..> c0072 : type in writeCodeArtifact
    c0174 ..> c0076 : type in writeDocument
    c0174 ..> c0079 : type in writeEntity
    c0174 ..> c0081 : type in writeRelationship
    c0174 ..> c0089 : 3 relationships (see list)
    c0174 ..> c0131 : 10 relationships (see list)
    c0174 ..> c0134 : createOnce() calls create()
    c0174 ..> c0145 : attachmentMemory() calls readMemory()
    c0174 ..> c0161 : 4 relationships (see list)
    c0174 ..> c0162 : type in writeCodeArtifact
    c0174 ..> c0163 : type in writeDocument
    c0174 ..> c0164 : type in writeEntityMemoryLink
    c0174 ..> c0165 : type in writeEntity
    c0174 --> c0166 : field readMemory
    c0174 ..> c0166 : type in constructor
    c0174 ..> c0167 : type in writeRelationship
    c0174 ..> c0168 : type in execute
    c0174 ..> c0169 : 16 relationships (see list)
    c0174 ..> c0170 : 18 relationships (see list)
    c0174 ..> c0172 : 16 relationships (see list)
    c0174 ..> c0173 : 18 relationships (see list)
    c0174 ..> c0174 : 27 relationships (see list)
    c0174 ..> c0175 : 4 relationships (see list)
    c0174 --> c0176 : field client
    c0174 ..> c0176 : type in constructor
    c0174 ..> c0177 : 30 relationships (see list)
    c0174 ..> c0196 : 2 relationships (see list)
    c0174 ..> c0242 : 2 relationships (see list)
    c0177 ..> c0004 : resourceSlots() calls set()
    c0177 ..> c0134 : resourceSlots() calls get()
    c0177 ..> c0170 : type in instructionId
    c0177 ..> c0171 : 4 relationships (see list)
    c0177 ..> c0173 : 2 relationships (see list)
    c0177 ..> c0175 : type in resourceSlots
    c0177 ..> c0177 : 6 relationships (see list)
    c0180 ..> c0047 : flush() calls resolve()
    c0180 ..|> c0178 : implements
    c0180 --> c0179 : 2 relationships (see list)
    c0180 ..> c0179 : 2 relationships (see list)
    c0180 ..> c0180 : 6 relationships (see list)
    c0180 ..> c0181 : 3 relationships (see list)
    c0180 ..> c0196 : enqueue() calls sanitizeValue()
    c0181 ..> c0181 : 2 relationships (see list)
    c0182 ..> c0091 : type in replacementMemoryInput
    c0182 ..> c0182 : replacementMemoryInput() calls replacementMemoryContext()
    c0182 ..> c0196 : storedMemoryContext() calls sanitizeText()
    c0185 --> c0187 : field complete
    c0186 ..> c0047 : applySummary() calls now()
    c0186 --> c0183 : field compactedHistory
    c0186 ..> c0183 : 5 relationships (see list)
    c0186 ..> c0186 : 6 relationships (see list)
    c0186 ..> c0187 : 3 relationships (see list)
    c0186 ..> c0188 : 9 relationships (see list)
    c0186 ..> c0229 : applySummary() calls trim()
    c0188 ..> c0047 : summarizeMemoryHistory() calls now()
    c0188 ..> c0094 : type in evidencePageContent
    c0188 ..> c0184 : 2 relationships (see list)
    c0188 ..> c0185 : type in summarizeMemoryHistory
    c0188 ..> c0188 : 18 relationships (see list)
    c0188 ..> c0192 : summarizeMemoryHistory() calls complete()
    c0188 ..> c0196 : 2 relationships (see list)
    c0190 --> c0191 : field modelRegistry
    c0192 ..> c0047 : 6 relationships (see list)
    c0192 ..> c0056 : completeWithSubmission() calls mapConcurrent()
    c0192 --> c0061 : field selection
    c0192 ..> c0061 : type in constructor
    c0192 ..> c0068 : completeRequest() calls isRecallConcurrency()
    c0192 ..|> c0092 : implements
    c0192 ..> c0096 : type in executeRead
    c0192 ..> c0097 : 7 relationships (see list)
    c0192 ..> c0098 : completeWithSubmission() constructs ModelSubmissionError
    c0192 ..> c0099 : type in validateSubmission
    c0192 ..> c0174 : executeRead() calls execute()
    c0192 --> c0178 : field logger
    c0192 ..> c0180 : 5 relationships (see list)
    c0192 ..> c0186 : 3 relationships (see list)
    c0192 ..> c0188 : 2 relationships (see list)
    c0192 --> c0189 : field transformHeaders
    c0192 --> c0191 : field registry
    c0192 ..> c0191 : type in constructor
    c0192 ..> c0192 : 7 relationships (see list)
    c0192 ..> c0193 : type in constructor
    c0192 ..> c0194 : 3 relationships (see list)
    c0192 ..> c0195 : 24 relationships (see list)
    c0192 ..> c0196 : 2 relationships (see list)
    c0193 --> c0178 : field logger
    c0193 --> c0189 : field transformHeaders
    c0195 ..> c0047 : 2 relationships (see list)
    c0195 ..> c0061 : 3 relationships (see list)
    c0195 ..> c0096 : type in submissionTool
    c0195 ..> c0097 : 4 relationships (see list)
    c0195 ..> c0099 : type in submissionTool
    c0195 ..> c0189 : type in requestOptions
    c0195 ..> c0190 : type in availableMemoryModels
    c0195 ..> c0191 : type in resolveMemoryModel
    c0195 ..> c0192 : 3 relationships (see list)
    c0195 ..> c0193 : type in resolveMemoryModel
    c0195 ..> c0194 : type in requestDeadline
    c0195 ..> c0195 : 7 relationships (see list)
    c0195 ..> c0196 : 8 relationships (see list)
    c0196 ..> c0196 : 4 relationships (see list)
    c0196 ..> c0242 : diagnosticMessage() calls inspect()
    c0199 ..> c0086 : 3 relationships (see list)
    c0199 ..> c0101 : 4 relationships (see list)
    c0199 ..> c0102 : 2 relationships (see list)
    c0199 ..> c0129 : promptExistingProject() calls notify()
    c0199 ..> c0134 : 7 relationships (see list)
    c0199 ..> c0196 : 2 relationships (see list)
    c0199 ..> c0197 : 2 relationships (see list)
    c0199 ..> c0198 : 6 relationships (see list)
    c0199 ..> c0199 : 5 relationships (see list)
    c0199 ..> c0229 : 3 relationships (see list)
    c0200 ..> c0004 : mutate() calls set()
    c0200 ..> c0071 : 4 relationships (see list)
    c0200 ..> c0075 : type in compactJobSnapshot
    c0200 ..> c0084 : type in appendInspections
    c0200 ..> c0101 : type in completeProjectDiscovery
    c0200 ..> c0107 : 2 relationships (see list)
    c0200 ..> c0134 : 2 relationships (see list)
    c0200 ..> c0160 : 4 relationships (see list)
    c0200 ..> c0196 : 2 relationships (see list)
    c0200 ..> c0200 : 97 relationships (see list)
    c0200 ..> c0201 : type in constructor
    c0200 ..> c0202 : 2 relationships (see list)
    c0200 ..> c0204 : 5 relationships (see list)
    c0200 ..> c0205 : 3 relationships (see list)
    c0200 ..> c0206 : 2 relationships (see list)
    c0200 ..> c0207 : 2 relationships (see list)
    c0200 ..> c0208 : 9 relationships (see list)
    c0200 ..> c0209 : 11 relationships (see list)
    c0200 ..> c0210 : type in listJobMetadata
    c0200 ..> c0212 : 9 relationships (see list)
    c0200 ..> c0213 : 5 relationships (see list)
    c0200 ..> c0214 : 3 relationships (see list)
    c0200 ..> c0215 : 6 relationships (see list)
    c0200 ..> c0217 : 2 relationships (see list)
    c0200 ..> c0218 : 70 relationships (see list)
    c0200 ..> c0229 : reusableHistory() calls trim()
    c0200 ..> c0238 : 5 relationships (see list)
    c0204 --> c0084 : field replacement
    c0204 --> c0091 : field replacement
    c0204 --> c0107 : field context
    c0204 --> c0208 : field binding
    c0204 --> c0216 : field supersession
    c0206 --> c0075 : field compactedConversation
    c0206 --> c0084 : field inspectionEntries
    c0206 --> c0211 : field status
    c0206 --> c0216 : field supersession
    c0209 --> c0071 : field snapshot
    c0209 --> c0208 : field binding
    c0209 --> c0211 : field status
    c0209 --> c0216 : field supersession
    c0210 --> c0071 : field snapshot
    c0212 --> c0204 : field conflicts
    c0212 --> c0213 : field watermarks
    c0212 --> c0215 : field jobs
    c0213 --> c0203 : field historyAlternatives
    c0215 --|> c0209 : inherits
    c0218 ..> c0071 : 3 relationships (see list)
    c0218 ..> c0084 : type in validateInspectionEntry
    c0218 ..> c0134 : releaseCompletedArtifacts() calls get()
    c0218 ..> c0196 : scrubDiagnostic() calls sanitizeText()
    c0218 ..> c0200 : nowIso() calls now()
    c0218 ..> c0203 : 2 relationships (see list)
    c0218 ..> c0204 : type in conflictIdentityMatches
    c0218 ..> c0208 : 2 relationships (see list)
    c0218 ..> c0209 : 2 relationships (see list)
    c0218 ..> c0212 : type in normaliseState
    c0218 ..> c0213 : 3 relationships (see list)
    c0218 ..> c0215 : type in releaseCompletedArtifacts
    c0218 ..> c0218 : 6 relationships (see list)
    c0220 --> c0101 : field projects
    c0220 --> c0104 : field scope
    c0220 --> c0107 : field context
    c0222 --> c0084 : field sessionContext
    c0222 --> c0097 : field diagnosticContext
    c0222 --> c0101 : field projects
    c0222 --> c0104 : field scope
    c0222 --> c0107 : field context
    c0222 --> c0221 : field onPlan
    c0223 --> c0104 : field scope
    c0224 ..> c0056 : searchMemories() calls mapConcurrent()
    c0224 ..> c0068 : 3 relationships (see list)
    c0224 --> c0086 : field client
    c0224 ..> c0086 : type in constructor
    c0224 ..> c0089 : 2 relationships (see list)
    c0224 --> c0092 : field model
    c0224 ..> c0092 : type in constructor
    c0224 ..> c0096 : type in recallReadTool
    c0224 ..> c0101 : 2 relationships (see list)
    c0224 ..> c0104 : 7 relationships (see list)
    c0224 ..> c0105 : type in searchRequest
    c0224 ..> c0107 : 3 relationships (see list)
    c0224 ..> c0134 : 3 relationships (see list)
    c0224 ..> c0144 : 2 relationships (see list)
    c0224 --> c0145 : field knowledge
    c0224 ..> c0145 : 2 relationships (see list)
    c0224 ..> c0160 : recallReadTool() calls executeKnowledgeRead()
    c0224 ..> c0192 : recall() calls complete()
    c0224 ..> c0196 : 9 relationships (see list)
    c0224 ..> c0219 : 4 relationships (see list)
    c0224 ..> c0220 : type in deeper
    c0224 ..> c0221 : 5 relationships (see list)
    c0224 ..> c0222 : 7 relationships (see list)
    c0224 ..> c0223 : 7 relationships (see list)
    c0224 ..> c0224 : 34 relationships (see list)
    c0224 ..> c0225 : type in constructor
    c0224 ..> c0226 : finishReview() constructs ReviewValidationError
    c0224 ..> c0227 : 6 relationships (see list)
    c0224 ..> c0228 : type in searchMemories
    c0224 ..> c0229 : 35 relationships (see list)
    c0227 --> c0101 : field project
    c0228 --> c0089 : field memories
    c0229 ..> c0004 : availableProjects() calls set()
    c0229 ..> c0089 : 2 relationships (see list)
    c0229 ..> c0099 : type in recallReviewSubmission
    c0229 ..> c0101 : type in availableProjects
    c0229 ..> c0107 : 3 relationships (see list)
    c0229 ..> c0144 : type in formatRecall
    c0229 ..> c0196 : 11 relationships (see list)
    c0229 ..> c0219 : 2 relationships (see list)
    c0229 ..> c0221 : type in parsePlan
    c0229 ..> c0223 : 4 relationships (see list)
    c0229 ..> c0224 : createDeadlineSignal() calls now()
    c0229 ..> c0229 : 26 relationships (see list)
    c0230 ..> c0229 : repositoryName() calls trim()
    c0232 ..> c0231 : 2 relationships (see list)
    c0233 --|> c0071 : inherits
    c0235 --> c0070 : field mode
    c0235 --> c0104 : field scope
    c0235 --> c0107 : field context
    c0235 --> c0237 : field session
    c0236 --> c0233 : field snapshot
    c0238 ..> c0069 : 2 relationships (see list)
    c0238 ..> c0071 : 4 relationships (see list)
    c0238 ..> c0075 : type in compactCaptureSnapshot
    c0238 ..> c0084 : 3 relationships (see list)
    c0238 ..> c0196 : 9 relationships (see list)
    c0238 ..> c0229 : 2 relationships (see list)
    c0238 ..> c0234 : 3 relationships (see list)
    c0238 ..> c0235 : 3 relationships (see list)
    c0238 ..> c0236 : type in buildCaptureSnapshot
    c0238 ..> c0238 : 27 relationships (see list)
    c0241 --> c0239 : 2 relationships (see list)
    c0242 ..> c0004 : readFile() calls close()
    c0242 ..> c0047 : 3 relationships (see list)
    c0242 ..> c0134 : getUrl() calls get()
    c0242 ..> c0160 : readFile() calls readFile()
    c0242 ..> c0174 : git() calls execute()
    c0242 ..> c0196 : 3 relationships (see list)
    c0242 ..> c0229 : provenance() calls trim()
    c0242 ..> c0240 : type in inspectUrl
    c0242 ..> c0241 : 2 relationships (see list)
    c0242 ..> c0242 : 10 relationships (see list)
    c0242 --> c0243 : field options
    c0242 ..> c0243 : type in constructor
    c0242 ..> c0244 : 11 relationships (see list)
    c0244 ..> c0196 : 4 relationships (see list)
    c0244 ..> c0239 : type in errorDetails
    c0244 ..> c0240 : type in sourceContent
    c0244 ..> c0242 : validateAddress() calls check()
    c0244 ..> c0244 : validateAddress() calls loopback()
```

## Source index

- c0000: `index.ts` — `index.ts`:1
- c0003: `ActivityLoader` — `src/activity.ts`:6
- c0004: `ForgetfulActivity` — `src/activity.ts`:35
- c0005: `CaptureCorrectionCycle` — `src/capture-feedback.ts`:6
- c0006: `CaptureSelectionError` — `src/capture-feedback.ts`:15
- c0007: `src/capture-feedback.ts` — `src/capture-feedback.ts`:1
- c0008: `CaptureLinkReview` — `src/capture-links.ts`:43
- c0009: `ConnectionResult` — `src/capture-links.ts`:61
- c0010: `LinkDecision` — `src/capture-links.ts`:15
- c0011: `PreservationDecision` — `src/capture-links.ts`:25
- c0012: `PreviousConnections` — `src/capture-links.ts`:33
- c0013: `src/capture-links.ts` — `src/capture-links.ts`:1
- c0014: `MergeAccess` — `src/capture-merge.ts`:41
- c0015: `MergeConnections` — `src/capture-merge.ts`:5
- c0016: `MergeExecution` — `src/capture-merge.ts`:47
- c0017: `MergeWriteUncertain` — `src/capture-merge.ts`:16
- c0018: `src/capture-merge.ts` — `src/capture-merge.ts`:1
- c0019: `CandidateExtraction` — `src/capture.ts`:737
- c0020: `CandidateValidation` — `src/capture.ts`:663
- c0021: `CaptureAction` — `src/capture.ts`:76
- c0022: `CaptureActivityPhase` — `src/capture.ts`:174
- c0023: `CaptureAdvanceInput` — `src/capture.ts`:320
- c0024: `CaptureBatchInput` — `src/capture.ts`:135
- c0025: `CaptureBranch` — `src/capture.ts`:201
- c0026: `CaptureCandidate` — `src/capture.ts`:78
- c0027: `CaptureCheckpointOptions` — `src/capture.ts`:206
- c0028: `CaptureCheckpointResult` — `src/capture.ts`:212
- c0029: `CaptureCodeArtifactResource` — `src/capture.ts`:112
- c0030: `CaptureDecision` — `src/capture.ts`:142
- c0031: `CaptureDiagnosticCandidate` — `src/capture.ts`:225
- c0032: `CaptureDiagnosticConflict` — `src/capture.ts`:253
- c0033: `CaptureDiagnosticJob` — `src/capture.ts`:241
- c0034: `CaptureDiagnostics` — `src/capture.ts`:264
- c0035: `CaptureDocumentResource` — `src/capture.ts`:108
- c0036: `CaptureEnqueueResult` — `src/capture.ts`:269
- c0037: `CaptureEntityResource` — `src/capture.ts`:104
- c0038: `CaptureMergePlan` — `src/capture.ts`:159
- c0039: `CaptureNeighborhood` — `src/capture.ts`:127
- c0040: `CaptureOperation` — `src/capture.ts`:362
- c0041: `CapturePause` — `src/capture.ts`:328
- c0042: `CapturePendingConflict` — `src/capture.ts`:315
- c0043: `CaptureProgress` — `src/capture.ts`:352
- c0044: `CaptureRelationshipResource` — `src/capture.ts`:116
- c0045: `CaptureResolveResult` — `src/capture.ts`:309
- c0046: `CaptureResourceReuse` — `src/capture.ts`:120
- c0047: `CaptureService` — `src/capture.ts`:1141
- c0048: `CaptureServiceOptions` — `src/capture.ts`:176
- c0049: `CaptureUncertainWrite` — `src/capture.ts`:350
- c0050: `ConflictResolutionEvidence` — `src/capture.ts`:275
- c0051: `ConflictResolutionTarget` — `src/capture.ts`:292
- c0052: `InvalidCaptureOutput` — `src/capture.ts`:335
- c0053: `MissingCaptureDestination` — `src/capture.ts`:342
- c0054: `ResolveConflictInput` — `src/capture.ts`:298
- c0055: `src/capture.ts` — `src/capture.ts`:1
- c0056: `src/concurrency.ts` — `src/concurrency.ts`:1
- c0057: `ForgetfulConfig` — `src/config.ts`:92
- c0058: `ForgetfulInstanceConfig` — `src/config.ts`:79
- c0059: `JsonReadResult` — `src/config.ts`:147
- c0060: `LoadConfigOptions` — `src/config.ts`:114
- c0061: `ModelSelection` — `src/config.ts`:74
- c0062: `PersistedProjectSettings` — `src/config.ts`:143
- c0063: `PersistedUserSettings` — `src/config.ts`:125
- c0064: `PromptName` — `src/config.ts`:40
- c0065: `PromptOverlays` — `src/config.ts`:86
- c0066: `ScopeSource` — `src/config.ts`:39
- c0067: `Verbosity` — `src/config.ts`:59
- c0068: `src/config.ts` — `src/config.ts`:1
- c0069: `CaptureHistorySummary` — `src/contracts.ts`:315
- c0070: `CaptureMode` — `src/contracts.ts`:2
- c0071: `CaptureSnapshot` — `src/contracts.ts`:326
- c0072: `CodeArtifact` — `src/contracts.ts`:93
- c0073: `CodeArtifactInput` — `src/contracts.ts`:84
- c0074: `CodeArtifactSummary` — `src/contracts.ts`:98
- c0075: `CompactedConversation` — `src/contracts.ts`:320
- c0076: `Document` — `src/contracts.ts`:77
- c0077: `DocumentInput` — `src/contracts.ts`:68
- c0078: `DocumentSummary` — `src/contracts.ts`:82
- c0079: `Entity` — `src/contracts.ts`:53
- c0080: `EntityInput` — `src/contracts.ts`:43
- c0081: `EntityRelationship` — `src/contracts.ts`:64
- c0082: `EntityRelationshipInput` — `src/contracts.ts`:58
- c0083: `EntityType` — `src/contracts.ts`:41
- c0084: `EvidenceEntry` — `src/contracts.ts`:305
- c0085: `FileSummary` — `src/contracts.ts`:100
- c0086: `ForgetfulClient` — `src/contracts.ts`:189
- c0087: `KnowledgeClient` — `src/contracts.ts`:115
- c0088: `LinkedMemory` — `src/contracts.ts`:157
- c0089: `Memory` — `src/contracts.ts`:145
- c0090: `MemoryCreateResult` — `src/contracts.ts`:183
- c0091: `MemoryInput` — `src/contracts.ts`:17
- c0092: `MemoryModelClient` — `src/contracts.ts`:289
- c0093: `MemorySearchResult` — `src/contracts.ts`:163
- c0094: `ModelEvidencePage` — `src/contracts.ts`:245
- c0095: `ModelReadErrorResult` — `src/contracts.ts`:255
- c0096: `ModelReadTool` — `src/contracts.ts`:259
- c0097: `ModelRequest` — `src/contracts.ts`:215
- c0098: `ModelSubmissionError` — `src/contracts.ts`:278
- c0099: `ModelSubmissionTool` — `src/contracts.ts`:269
- c0100: `ModelTaskPause` — `src/contracts.ts`:267
- c0101: `Project` — `src/contracts.ts`:4
- c0102: `ProjectInput` — `src/contracts.ts`:11
- c0103: `Provenance` — `src/contracts.ts`:34
- c0104: `Scope` — `src/contracts.ts`:1
- c0105: `SearchRequest` — `src/contracts.ts`:172
- c0106: `StoredFile` — `src/contracts.ts`:110
- c0107: `WorkContext` — `src/contracts.ts`:295
- c0108: `AutomaticCaptureJobOutcome` — `src/extension.ts`:1046
- c0109: `AutomaticRecall` — `src/extension.ts`:429
- c0110: `BoundedWaitOutcome` — `src/extension.ts`:140
- c0111: `CaptureFeedbackItem` — `src/extension.ts`:1156
- c0112: `CaptureFeedbackState` — `src/extension.ts`:1025
- c0113: `CaptureServicePort` — `src/extension.ts`:285
- c0114: `DiagnosticCandidate` — `src/extension.ts`:882
- c0115: `DiagnosticParts` — `src/extension.ts`:895
- c0116: `ExtensionWorkContext` — `src/extension.ts`:319
- c0117: `ForgetfulExtensionDependencies` — `src/extension.ts`:323
- c0118: `ForgetfulExtensionOptions` — `src/extension.ts`:348
- c0119: `PendingQueuedRecall` — `src/extension.ts`:388
- c0120: `PolicyName` — `src/extension.ts`:276
- c0121: `PreparedRuntime` — `src/extension.ts`:442
- c0122: `RecallActivity` — `src/extension.ts`:390
- c0123: `RecallContextMessage` — `src/extension.ts`:363
- c0124: `RecallJob` — `src/extension.ts`:370
- c0125: `RecallServicePort` — `src/extension.ts`:278
- c0126: `Runtime` — `src/extension.ts`:396
- c0127: `SetupAuthentication` — `src/extension.ts`:226
- c0128: `State` — `src/extension.ts`:431
- c0129: `src/extension.ts` — `src/extension.ts`:1
- c0130: `src/foreground-tools.ts` — `src/foreground-tools.ts`:1
- c0131: `ApiKnowledgeClient` — `src/http-knowledge.ts`:199
- c0132: `KnowledgeRequest` — `src/http-knowledge.ts`:9
- c0133: `src/http-knowledge.ts` — `src/http-knowledge.ts`:1
- c0134: `ApiForgetfulClient` — `src/http.ts`:394
- c0135: `ApiForgetfulClientOptions` — `src/http.ts`:25
- c0136: `ForgetfulAbortError` — `src/http.ts`:59
- c0137: `ForgetfulHttpError` — `src/http.ts`:33
- c0138: `ForgetfulSchemaError` — `src/http.ts`:45
- c0139: `ForgetfulTimeoutError` — `src/http.ts`:52
- c0140: `src/http.ts` — `src/http.ts`:1
- c0141: `Attachments` — `src/knowledge-read.ts`:51
- c0142: `ExpansionContext` — `src/knowledge-read.ts`:39
- c0143: `KnowledgeExpansionRequest` — `src/knowledge-read.ts`:19
- c0144: `KnowledgeExpansionResult` — `src/knowledge-read.ts`:27
- c0145: `KnowledgeReadService` — `src/knowledge-read.ts`:155
- c0146: `KnowledgeReadServiceOptions` — `src/knowledge-read.ts`:63
- c0147: `LinkedMemoryExpansion` — `src/knowledge-read.ts`:49
- c0148: `MemoryReader` — `src/knowledge-read.ts`:58
- c0149: `RelationshipExpansion` — `src/knowledge-read.ts`:43
- c0150: `src/knowledge-read.ts` — `src/knowledge-read.ts`:1
- c0151: `KnowledgeReadContext` — `src/knowledge-tools.ts`:630
- c0152: `KnowledgeReadRequest` — `src/knowledge-tools.ts`:169
- c0153: `KnowledgeToolContext` — `src/knowledge-tools.ts`:23
- c0154: `KnowledgeToolResult` — `src/knowledge-tools.ts`:33
- c0155: `KnowledgeWriteContext` — `src/knowledge-tools.ts`:1272
- c0156: `KnowledgeWriteRequest` — `src/knowledge-tools.ts`:170
- c0157: `ResolvedWriteProject` — `src/knowledge-tools.ts`:445
- c0158: `ToolImage` — `src/knowledge-tools.ts`:32
- c0159: `ToolText` — `src/knowledge-tools.ts`:31
- c0160: `src/knowledge-tools.ts` — `src/knowledge-tools.ts`:1
- c0161: `KnowledgeAttachmentIds` — `src/knowledge-write.ts`:128
- c0162: `KnowledgeCodeArtifactPlan` — `src/knowledge-write.ts`:44
- c0163: `KnowledgeDocumentPlan` — `src/knowledge-write.ts`:38
- c0164: `KnowledgeEntityMemoryLinkPlan` — `src/knowledge-write.ts`:58
- c0165: `KnowledgeEntityPlan` — `src/knowledge-write.ts`:32
- c0166: `KnowledgeMemoryReader` — `src/knowledge-write.ts`:108
- c0167: `KnowledgeRelationshipPlan` — `src/knowledge-write.ts`:50
- c0168: `KnowledgeWriteCheckpoint` — `src/knowledge-write.ts`:102
- c0169: `KnowledgeWriteGuard` — `src/knowledge-write.ts`:106
- c0170: `KnowledgeWritePlan` — `src/knowledge-write.ts`:62
- c0171: `KnowledgeWriteReceipt` — `src/knowledge-write.ts`:79
- c0172: `KnowledgeWriteSave` — `src/knowledge-write.ts`:113
- c0173: `KnowledgeWriteState` — `src/knowledge-write.ts`:86
- c0174: `KnowledgeWriter` — `src/knowledge-write.ts`:264
- c0175: `ResourceSlot` — `src/knowledge-write.ts`:115
- c0176: `WriteClient` — `src/knowledge-write.ts`:18
- c0177: `src/knowledge-write.ts` — `src/knowledge-write.ts`:1
- c0178: `DiagnosticLogger` — `src/logging.ts`:83
- c0179: `FileLogLevel` — `src/logging.ts`:81
- c0180: `FileLogger` — `src/logging.ts`:97
- c0181: `src/logging.ts` — `src/logging.ts`:1
- c0182: `src/memory-context.ts` — `src/memory-context.ts`:1
- c0183: `CompactedMemoryHistory` — `src/model-context.ts`:241
- c0184: `ContextWindowError` — `src/model-context.ts`:30
- c0185: `MemoryHistorySummaryOptions` — `src/model-context.ts`:377
- c0186: `MemoryTaskContext` — `src/model-context.ts`:248
- c0187: `SummaryCompletion` — `src/model-context.ts`:25
- c0188: `src/model-context.ts` — `src/model-context.ts`:1
- c0189: `MemoryModelHeaderTransform` — `src/model.ts`:45
- c0190: `ModelPickerContext` — `src/model.ts`:49
- c0191: `ModelRegistryPort` — `src/model.ts`:36
- c0192: `PiMemoryModel` — `src/model.ts`:319
- c0193: `PiMemoryModelOptions` — `src/model.ts`:59
- c0194: `RequestDeadline` — `src/model.ts`:240
- c0195: `src/model.ts` — `src/model.ts`:1
- c0196: `src/privacy.ts` — `src/privacy.ts`:1
- c0197: `AgentProjectInitInput` — `src/project-init.ts`:8
- c0198: `ProjectInitError` — `src/project-init.ts`:6
- c0199: `src/project-init.ts` — `src/project-init.ts`:1
- c0200: `DurableQueueStore` — `src/queue.ts`:511
- c0201: `DurableQueueStoreOptions` — `src/queue.ts`:193
- c0202: `FileLock` — `src/queue.ts`:225
- c0203: `HistoryCache` — `src/queue.ts`:42
- c0204: `PendingConflict` — `src/queue.ts`:103
- c0205: `QueueBusyError` — `src/queue.ts`:230
- c0206: `QueueCheckpoint` — `src/queue.ts`:179
- c0207: `QueueEnqueueResult` — `src/queue.ts`:163
- c0208: `QueueIdentity` — `src/queue.ts`:36
- c0209: `QueueJob` — `src/queue.ts`:69
- c0210: `QueueJobMetadata` — `src/queue.ts`:99
- c0211: `QueueJobStatus` — `src/queue.ts`:29
- c0212: `QueueState` — `src/queue.ts`:218
- c0213: `QueueWatermark` — `src/queue.ts`:48
- c0214: `SnapshotPayload` — `src/queue.ts`:212
- c0215: `StoredQueueJob` — `src/queue.ts`:207
- c0216: `SupersessionReceipt` — `src/queue.ts`:92
- c0217: `WatermarkAdvance` — `src/queue.ts`:170
- c0218: `src/queue.ts` — `src/queue.ts`:1
- c0219: `DeadlineSignal` — `src/recall.ts`:206
- c0220: `DeeperRecallRequest` — `src/recall.ts`:153
- c0221: `RecallPlan` — `src/recall.ts`:188
- c0222: `RecallRequest` — `src/recall.ts`:136
- c0223: `RecallResult` — `src/recall.ts`:162
- c0224: `RecallService` — `src/recall.ts`:673
- c0225: `RecallServiceOptions` — `src/recall.ts`:198
- c0226: `ReviewValidationError` — `src/recall.ts`:611
- c0227: `ScopeResolution` — `src/recall.ts`:215
- c0228: `SearchOutcome` — `src/recall.ts`:221
- c0229: `src/recall.ts` — `src/recall.ts`:1
- c0230: `src/repository.ts` — `src/repository.ts`:1
- c0231: `SetupHelp` — `src/setup.ts`:3
- c0232: `src/setup.ts` — `src/setup.ts`:1
- c0233: `CaptureSnapshotWithStatus` — `src/snapshot.ts`:39
- c0234: `MessageRecord` — `src/snapshot.ts`:47
- c0235: `SnapshotOptions` — `src/snapshot.ts`:20
- c0236: `SnapshotResult` — `src/snapshot.ts`:43
- c0237: `SnapshotSessionReader` — `src/snapshot.ts`:14
- c0238: `src/snapshot.ts` — `src/snapshot.ts`:1
- c0239: `SourceInspectionError` — `src/source-inspection.ts`:37
- c0240: `SourceInspectionRequest` — `src/source-inspection.ts`:33
- c0241: `SourceInspectionResult` — `src/source-inspection.ts`:43
- c0242: `SourceInspector` — `src/source-inspection.ts`:149
- c0243: `SourceInspectorOptions` — `src/source-inspection.ts`:15
- c0244: `src/source-inspection.ts` — `src/source-inspection.ts`:1

## Relationships

- c0000 ..> c0129: `defaultExtension() calls createForgetfulExtension()`
- c0003 ..> c0004: `setLabel() calls refresh()`
- c0003 ..> c0047: `dispose() calls stop()`
- c0004 --> c0003: `field loader`
- c0004 ..> c0003: `close() calls dispose()`
- c0004 ..> c0003: `refresh() calls dispose()`
- c0004 ..> c0003: `refresh() calls setLabel()`
- c0004 ..> c0003: `refresh() constructs ActivityLoader`
- c0004 ..> c0004: `constructor() calls refresh()`
- c0004 ..> c0004: `notice() calls refresh()`
- c0004 ..> c0004: `set() calls refresh()`
- c0004 ..> c0047: `refresh() calls now()`
- c0007 ..> c0005: `type in initialCorrectionCycle`
- c0007 ..> c0096: `type in captureFailureReport`
- c0007 ..> c0196: `captureFailureReport() calls sanitizeValue()`
- c0008 --> c0009: `field executionResults`
- c0008 --> c0009: `field previousResults`
- c0008 --> c0010: `field decisions`
- c0008 --> c0011: `field preservation`
- c0008 --> c0012: `field previous`
- c0008 --> c0072: `field resources`
- c0008 --> c0076: `field resources`
- c0008 --> c0089: `field memories`
- c0008 --> c0089: `field memory`
- c0012 --> c0072: `field codeArtifacts`
- c0012 --> c0076: `field documents`
- c0012 --> c0079: `field entities`
- c0012 --> c0089: `field memory`
- c0013 ..> c0004: `validateLinkDecisions() calls set()`
- c0013 ..> c0004: `validateLinkReviews() calls set()`
- c0013 ..> c0006: `authorizedMemory() constructs CaptureSelectionError`
- c0013 ..> c0008: `type in applyLinkReview`
- c0013 ..> c0008: `type in executeConnection`
- c0013 ..> c0008: `type in finishLinkExecution`
- c0013 ..> c0008: `type in prepareLinkReview`
- c0013 ..> c0008: `type in preserveConnections`
- c0013 ..> c0008: `type in readSelectedMemory`
- c0013 ..> c0008: `type in validateLinkDecisions`
- c0013 ..> c0008: `type in validateLinkReviews`
- c0013 ..> c0009: `type in executeConnection`
- c0013 ..> c0010: `type in validateLinkDecisions`
- c0013 ..> c0010: `type in validateLinkReviews`
- c0013 ..> c0010: `type in wantsEdge`
- c0013 ..> c0011: `type in validateLinkReviews`
- c0013 ..> c0012: `type in preparePreviousConnections`
- c0013 ..> c0013: `applyLinkReview() calls authorizedMemory()`
- c0013 ..> c0013: `applyLinkReview() calls executeConnection()`
- c0013 ..> c0013: `applyLinkReview() calls finishLinkExecution()`
- c0013 ..> c0013: `executeConnection() calls operationError()`
- c0013 ..> c0013: `prepareLinkReview() calls exclusiveMemory()`
- c0013 ..> c0013: `prepareLinkReview() calls readAttachmentRecords()`
- c0013 ..> c0013: `prepareLinkReview() calls readSelectedMemory()`
- c0013 ..> c0013: `preserveConnections() calls executeConnection()`
- c0013 ..> c0013: `validateLinkDecisions() calls wantsEdge()`
- c0013 ..> c0013: `validateLinkReviews() calls validateLinkDecisions()`
- c0013 ..> c0072: `type in readAttachmentRecords`
- c0013 ..> c0076: `type in readAttachmentRecords`
- c0013 ..> c0086: `type in applyLinkReview`
- c0013 ..> c0086: `type in authorizedMemory`
- c0013 ..> c0086: `type in prepareLinkReview`
- c0013 ..> c0086: `type in preparePreviousConnections`
- c0013 ..> c0086: `type in preserveConnections`
- c0013 ..> c0086: `type in readAttachmentRecords`
- c0013 ..> c0086: `type in readSelectedMemory`
- c0013 ..> c0089: `type in authorizedMemory`
- c0013 ..> c0089: `type in exclusiveMemory`
- c0013 ..> c0089: `type in prepareLinkReview`
- c0013 ..> c0089: `type in preparePreviousConnections`
- c0013 ..> c0089: `type in readAttachmentRecords`
- c0013 ..> c0089: `type in readSelectedMemory`
- c0013 ..> c0104: `type in applyLinkReview`
- c0013 ..> c0104: `type in authorizedMemory`
- c0013 ..> c0104: `type in prepareLinkReview`
- c0013 ..> c0131: `applyLinkReview() calls linkMemories()`
- c0013 ..> c0131: `preparePreviousConnections() calls getCodeArtifact()`
- c0013 ..> c0131: `preparePreviousConnections() calls getDocument()`
- c0013 ..> c0131: `preparePreviousConnections() calls getEntity()`
- c0013 ..> c0131: `preserveConnections() calls linkEntityMemory()`
- c0013 ..> c0131: `preserveConnections() calls updateMemory()`
- c0013 ..> c0131: `readAttachmentRecords() calls getCodeArtifact()`
- c0013 ..> c0131: `readAttachmentRecords() calls getDocument()`
- c0013 ..> c0134: `authorizedMemory() calls get()`
- c0013 ..> c0134: `prepareLinkReview() calls get()`
- c0013 ..> c0134: `preparePreviousConnections() calls get()`
- c0013 ..> c0134: `preparePreviousConnections() calls getMemoryEntityIds()`
- c0013 ..> c0134: `readSelectedMemory() calls get()`
- c0013 ..> c0134: `validateLinkDecisions() calls get()`
- c0013 ..> c0174: `executeConnection() calls execute()`
- c0013 ..> c0196: `operationError() calls errorMessage()`
- c0013 ..> c0196: `prepareLinkReview() calls hasSensitiveData()`
- c0013 ..> c0196: `preparePreviousConnections() calls hasSensitiveData()`
- c0013 ..> c0196: `readAttachmentRecords() calls hasSensitiveData()`
- c0013 ..> c0196: `validateLinkDecisions() calls hasSensitiveData()`
- c0013 ..> c0229: `validateLinkDecisions() calls trim()`
- c0014 --> c0104: `field scope`
- c0016 --|> c0014: `inherits`
- c0018 ..> c0006: `checkMergeEntity() constructs CaptureSelectionError`
- c0018 ..> c0006: `preflightMergeConnections() constructs CaptureSelectionError`
- c0018 ..> c0006: `requireResourceScope() constructs CaptureSelectionError`
- c0018 ..> c0014: `type in checkMergeAttachments`
- c0018 ..> c0014: `type in checkMergeEntity`
- c0018 ..> c0014: `type in preflightMergeConnections`
- c0018 ..> c0014: `type in requireResourceScope`
- c0018 ..> c0015: `type in checkMergeAttachments`
- c0018 ..> c0015: `type in collectMergeConnections`
- c0018 ..> c0015: `type in preflightMergeConnections`
- c0018 ..> c0015: `type in preserveMergeConnections`
- c0018 ..> c0016: `type in preserveMergeConnections`
- c0018 ..> c0018: `checkMergeAttachments() calls requireResourceScope()`
- c0018 ..> c0018: `collectMergeConnections() calls union()`
- c0018 ..> c0018: `preflightMergeConnections() calls checkMergeAttachments()`
- c0018 ..> c0018: `preflightMergeConnections() calls checkMergeEntity()`
- c0018 ..> c0018: `preserveMergeConnections() calls checkMergeAttachments()`
- c0018 ..> c0018: `preserveMergeConnections() calls checkMergeEntity()`
- c0018 ..> c0018: `preserveMergeConnections() calls preflightMergeConnections()`
- c0018 ..> c0018: `preserveMergeConnections() calls union()`
- c0018 ..> c0086: `type in checkMergeAttachments`
- c0018 ..> c0086: `type in checkMergeEntity`
- c0018 ..> c0086: `type in collectMergeConnections`
- c0018 ..> c0086: `type in preflightMergeConnections`
- c0018 ..> c0086: `type in preserveMergeConnections`
- c0018 ..> c0089: `type in collectMergeConnections`
- c0018 ..> c0131: `checkMergeAttachments() calls getCodeArtifact()`
- c0018 ..> c0131: `checkMergeAttachments() calls getDocument()`
- c0018 ..> c0131: `checkMergeAttachments() calls getFile()`
- c0018 ..> c0131: `checkMergeEntity() calls getEntity()`
- c0018 ..> c0131: `preserveMergeConnections() calls linkEntityMemory()`
- c0018 ..> c0131: `preserveMergeConnections() calls linkMemories()`
- c0018 ..> c0131: `preserveMergeConnections() calls updateMemory()`
- c0018 ..> c0134: `collectMergeConnections() calls getMemoryEntityIds()`
- c0018 ..> c0134: `preflightMergeConnections() calls get()`
- c0018 ..> c0174: `preserveMergeConnections() calls execute()`
- c0019 --> c0026: `field candidates`
- c0024 --> c0026: `field candidate`
- c0024 --> c0039: `field neighborhood`
- c0024 --> c0089: `field overlaps`
- c0026 --> c0029: `field codeArtifacts`
- c0026 --> c0035: `field documents`
- c0026 --> c0037: `field entities`
- c0026 --> c0044: `field relationships`
- c0027 --> c0025: `field excludeBranches`
- c0028 --> c0025: `field deferredBranches`
- c0029 --|> c0162: `inherits`
- c0030 --> c0021: `field action`
- c0030 --> c0046: `field reuse`
- c0031 --> c0008: `field linkReview`
- c0031 --> c0021: `field action`
- c0032 --> c0204: `field status`
- c0033 --> c0031: `field candidates`
- c0033 --> c0211: `field status`
- c0034 --> c0032: `field conflicts`
- c0034 --> c0033: `field jobs`
- c0035 --|> c0163: `inherits`
- c0037 --|> c0165: `inherits`
- c0038 --> c0015: `field connections`
- c0038 --> c0026: `field candidate`
- c0038 --> c0089: `field memories`
- c0039 --> c0072: `field codeArtifacts`
- c0039 --> c0076: `field documents`
- c0039 --> c0079: `field entities`
- c0039 --> c0081: `field relationships`
- c0040 --> c0049: `field uncertainWrite`
- c0040 --> c0216: `field supersession`
- c0041 --|> c0100: `inherits`
- c0042 --|> c0204: `inherits`
- c0044 --|> c0167: `inherits`
- c0045 --> c0204: `field conflict`
- c0047 ..> c0004: `activity() calls set()`
- c0047 ..> c0006: `composeMerge() constructs CaptureSelectionError`
- c0047 ..> c0006: `equivalentMemory() constructs CaptureSelectionError`
- c0047 ..> c0006: `finishMerge() constructs CaptureSelectionError`
- c0047 ..> c0006: `processCandidates() constructs CaptureSelectionError`
- c0047 ..> c0006: `readMaintenanceTargets() constructs CaptureSelectionError`
- c0047 ..> c0006: `retireCandidate() constructs CaptureSelectionError`
- c0047 ..> c0006: `supersedeCandidate() constructs CaptureSelectionError`
- c0047 ..> c0006: `supersessionAlreadyApplied() constructs CaptureSelectionError`
- c0047 ..> c0006: `verifyRequestedMerge() constructs CaptureSelectionError`
- c0047 ..> c0007: `executeLinkReview() calls initialCorrectionCycle()`
- c0047 ..> c0007: `migrateLegacyLinkReview() calls initialCorrectionCycle()`
- c0047 ..> c0007: `planLinkReviews() calls captureFailureReport()`
- c0047 ..> c0007: `planLinkReviews() calls initialCorrectionCycle()`
- c0047 ..> c0007: `processOrderedCandidates() calls initialCorrectionCycle()`
- c0047 ..> c0007: `recordCandidateFailure() calls correctableCaptureError()`
- c0047 ..> c0007: `recordCandidateFailure() calls initialCorrectionCycle()`
- c0047 ..> c0007: `recordLinkReviewFailure() calls correctableCaptureError()`
- c0047 ..> c0007: `refreshLinkReview() calls correctableCaptureError()`
- c0047 ..> c0007: `reviewExecutionFailure() calls captureFailureReport()`
- c0047 ..> c0007: `reviewExecutionFailure() calls initialCorrectionCycle()`
- c0047 ..> c0007: `saveCorrectableFailure() calls correctableCaptureError()`
- c0047 ..> c0007: `saveCorrectableFailure() calls initialCorrectionCycle()`
- c0047 ..> c0008: `type in planLinkReviews`
- c0047 ..> c0008: `type in prepareLinkReviews`
- c0047 ..> c0008: `type in previousSupersessionCompleted`
- c0047 ..> c0008: `type in recordLinkReviewFailure`
- c0047 ..> c0008: `type in refreshLinkReview`
- c0047 ..> c0013: `executeLinkReview() calls applyLinkReview()`
- c0047 ..> c0013: `executeLinkReview() calls preserveConnections()`
- c0047 ..> c0013: `refreshLinkReview() calls prepareLinkReview()`
- c0047 ..> c0013: `refreshLinkReview() calls preparePreviousConnections()`
- c0047 ..> c0018: `composeMerge() calls collectMergeConnections()`
- c0047 ..> c0018: `composeMerge() calls preflightMergeConnections()`
- c0047 ..> c0018: `finishMerge() calls collectMergeConnections()`
- c0047 ..> c0018: `finishMerge() calls preserveMergeConnections()`
- c0047 ..> c0018: `mergeCandidate() calls collectMergeConnections()`
- c0047 ..> c0018: `mergeCandidate() calls preflightMergeConnections()`
- c0047 --> c0022: `field activityPhase`
- c0047 ..> c0022: `type in activity`
- c0047 ..> c0023: `type in advance`
- c0047 ..> c0023: `type in advanceWatermark`
- c0047 ..> c0024: `type in prepareOverlapBatch`
- c0047 ..> c0025: `type in checkpointBranch`
- c0047 ..> c0025: `type in checkpointBranches`
- c0047 ..> c0025: `type in runBranchWorker`
- c0047 ..> c0026: `type in addConflict`
- c0047 ..> c0026: `type in applyDecision`
- c0047 ..> c0026: `type in composeMerge`
- c0047 ..> c0026: `type in correctCandidateFailures`
- c0047 ..> c0026: `type in correctedCaptureOutcome`
- c0047 ..> c0026: `type in createMemory`
- c0047 ..> c0026: `type in decideOverlap`
- c0047 ..> c0026: `type in decideOverlapBatch`
- c0047 ..> c0026: `type in destinationProjects`
- c0047 ..> c0026: `type in executeLinkReview`
- c0047 ..> c0026: `type in executeLinkReviews`
- c0047 ..> c0026: `type in existingNeighborhood`
- c0047 ..> c0026: `type in finishMerge`
- c0047 ..> c0026: `type in finishReviewedSupersession`
- c0047 ..> c0026: `type in finishSupersession`
- c0047 ..> c0026: `type in loadCandidates`
- c0047 ..> c0026: `type in loadOverlaps`
- c0047 ..> c0026: `type in mergeCandidate`
- c0047 ..> c0026: `type in neighborhoodEntities`
- c0047 ..> c0026: `type in planConflictReplacement`
- c0047 ..> c0026: `type in planLinkReviews`
- c0047 ..> c0026: `type in prepareDestination`
- c0047 ..> c0026: `type in prepareLinkReviews`
- c0047 ..> c0026: `type in prepareOverlapBatch`
- c0047 ..> c0026: `type in processCandidate`
- c0047 ..> c0026: `type in processCandidates`
- c0047 ..> c0026: `type in processKnowledgeCheckpoint`
- c0047 ..> c0026: `type in processOrderedCandidates`
- c0047 ..> c0026: `type in processReplacementCheckpoint`
- c0047 ..> c0026: `type in recordCandidateFailure`
- c0047 ..> c0026: `type in recordEscalation`
- c0047 ..> c0026: `type in recordLinkReviewFailure`
- c0047 ..> c0026: `type in refreshLinkReview`
- c0047 ..> c0026: `type in resolveDestination`
- c0047 ..> c0026: `type in retireCandidate`
- c0047 ..> c0026: `type in reviewExecutionFailure`
- c0047 ..> c0026: `type in reviewLinks`
- c0047 ..> c0026: `type in saveCorrectableFailure`
- c0047 ..> c0026: `type in skipCandidate`
- c0047 ..> c0026: `type in supersedeCandidate`
- c0047 ..> c0026: `type in validateDecision`
- c0047 ..> c0026: `type in writeKnowledge`
- c0047 ..> c0027: `type in checkpoint`
- c0047 ..> c0027: `type in checkpointBranches`
- c0047 ..> c0027: `type in processPending`
- c0047 ..> c0028: `type in appendCheckpointResult`
- c0047 ..> c0028: `type in checkpoint`
- c0047 ..> c0028: `type in checkpointBranch`
- c0047 ..> c0028: `type in correctCandidateFailures`
- c0047 ..> c0028: `type in pauseCandidate`
- c0047 ..> c0028: `type in processBranchJob`
- c0047 ..> c0028: `type in processCandidates`
- c0047 ..> c0028: `type in processJob`
- c0047 ..> c0028: `type in processOrderedCandidates`
- c0047 ..> c0028: `type in processPending`
- c0047 ..> c0028: `type in recordBranchFailure`
- c0047 ..> c0028: `type in recordCandidateFailure`
- c0047 ..> c0028: `type in runBranchWorker`
- c0047 ..> c0030: `type in addConflict`
- c0047 ..> c0030: `type in applyDecision`
- c0047 ..> c0030: `type in composeMerge`
- c0047 ..> c0030: `type in correctedCaptureOutcome`
- c0047 ..> c0030: `type in decideOverlap`
- c0047 ..> c0030: `type in finishMerge`
- c0047 ..> c0030: `type in finishSupersession`
- c0047 ..> c0030: `type in mergeCandidate`
- c0047 ..> c0030: `type in recordEscalation`
- c0047 ..> c0030: `type in retireCandidate`
- c0047 ..> c0030: `type in skipCandidate`
- c0047 ..> c0030: `type in supersedeCandidate`
- c0047 ..> c0030: `type in validateDecision`
- c0047 ..> c0034: `type in diagnostics`
- c0047 ..> c0036: `type in enqueue`
- c0047 ..> c0036: `type in enqueueSnapshot`
- c0047 ..> c0038: `type in composeMerge`
- c0047 ..> c0038: `type in correctedCaptureOutcome`
- c0047 ..> c0038: `type in finishMerge`
- c0047 ..> c0039: `type in existingNeighborhood`
- c0047 ..> c0039: `type in validateDecision`
- c0047 ..> c0041: `assertWriteAllowedNow() constructs CapturePause`
- c0047 ..> c0041: `decideOverlap() constructs CapturePause`
- c0047 ..> c0041: `ensureModelCallAllowed() constructs CapturePause`
- c0047 ..> c0041: `ensureWriteAllowed() constructs CapturePause`
- c0047 ..> c0041: `evidenceReadTool() constructs CapturePause`
- c0047 ..> c0041: `loadOverlaps() constructs CapturePause`
- c0047 ..> c0041: `neighborhoodEntity() constructs CapturePause`
- c0047 ..> c0041: `neighborhoodMatches() constructs CapturePause`
- c0047 ..> c0041: `neighborhoodRelationships() constructs CapturePause`
- c0047 ..> c0041: `processCandidate() constructs CapturePause`
- c0047 ..> c0041: `processJob() constructs CapturePause`
- c0047 ..> c0041: `stop() constructs CapturePause`
- c0047 ..> c0041: `type in pauseCandidate`
- c0047 ..> c0042: `type in pendingConflicts`
- c0047 ..> c0042: `type in verifyConflictOrigin`
- c0047 ..> c0043: `ensureModelCallAllowed() constructs CaptureProgress`
- c0047 ..> c0045: `type in applyConflictResolution`
- c0047 ..> c0045: `type in markConflictResolved`
- c0047 ..> c0045: `type in rejectConflict`
- c0047 ..> c0045: `type in resolve`
- c0047 ..> c0045: `type in resolveConflict`
- c0047 ..> c0045: `type in resolveConflictOwned`
- c0047 ..> c0047: `activity() calls publishActivity()`
- c0047 ..> c0047: `advanceWatermark() calls advance()`
- c0047 ..> c0047: `applyConflictResolution() calls applySupersession()`
- c0047 ..> c0047: `applyConflictResolution() calls createResolutionReplacement()`
- c0047 ..> c0047: `applyConflictResolution() calls ensureWriteAllowed()`
- c0047 ..> c0047: `applyConflictResolution() calls executeResolutionLinks()`
- c0047 ..> c0047: `applyConflictResolution() calls failConflictResolution()`
- c0047 ..> c0047: `applyConflictResolution() calls markConflictResolved()`
- c0047 ..> c0047: `applyConflictResolution() calls planConflictReplacement()`
- c0047 ..> c0047: `applyConflictResolution() calls updateResolutionReplacement()`
- c0047 ..> c0047: `applyDecision() calls checkpointOutcome()`
- c0047 ..> c0047: `applyDecision() calls createMemory()`
- c0047 ..> c0047: `applyDecision() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `applyDecision() calls equivalentMemory()`
- c0047 ..> c0047: `applyDecision() calls mergeCandidate()`
- c0047 ..> c0047: `applyDecision() calls recordEscalation()`
- c0047 ..> c0047: `applyDecision() calls retireCandidate()`
- c0047 ..> c0047: `applyDecision() calls skipCandidate()`
- c0047 ..> c0047: `applyDecision() calls supersedeCandidate()`
- c0047 ..> c0047: `applyDecision() calls writeKnowledge()`
- c0047 ..> c0047: `applySupersession() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `applySupersession() calls recordSupersession()`
- c0047 ..> c0047: `applySupersession() calls supersessionAlreadyApplied()`
- c0047 ..> c0047: `assertWriteAllowedNow() calls canWriteNow()`
- c0047 ..> c0047: `cancellableClient() calls read()`
- c0047 ..> c0047: `cancellableKnowledge() calls read()`
- c0047 ..> c0047: `checkpoint() calls appendCheckpointResult()`
- c0047 ..> c0047: `checkpoint() calls checkpointBranch()`
- c0047 ..> c0047: `checkpoint() calls checkpointBranches()`
- c0047 ..> c0047: `checkpoint() calls enabled()`
- c0047 ..> c0047: `checkpointBranch() calls runBranchWorker()`
- c0047 ..> c0047: `checkpointOutcome() calls correlation()`
- c0047 ..> c0047: `composeMerge() calls checkpointOutcome()`
- c0047 ..> c0047: `composeMerge() calls correlation()`
- c0047 ..> c0047: `composeMerge() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `composeMerge() calls ensureWriteAllowed()`
- c0047 ..> c0047: `composeMerge() calls readMaintenanceTargets()`
- c0047 ..> c0047: `constructor() calls activity()`
- c0047 ..> c0047: `constructor() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `constructor() calls cancellableClient()`
- c0047 ..> c0047: `constructor() calls read()`
- c0047 ..> c0047: `correctCandidateFailures() calls recordCandidateFailure()`
- c0047 ..> c0047: `correctCandidateFailures() calls reviewExecutionFailure()`
- c0047 ..> c0047: `createMemory() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `createMemory() calls checkpointOutcome()`
- c0047 ..> c0047: `createMemory() calls correlation()`
- c0047 ..> c0047: `createMemory() calls ensureWriteAllowed()`
- c0047 ..> c0047: `createResolutionReplacement() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `createResolutionReplacement() calls ensureWriteAllowed()`
- c0047 ..> c0047: `decideOverlap() calls checkpointOutcome()`
- c0047 ..> c0047: `decideOverlap() calls correlation()`
- c0047 ..> c0047: `decideOverlap() calls enabled()`
- c0047 ..> c0047: `decideOverlap() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `decideOverlap() calls existingNeighborhood()`
- c0047 ..> c0047: `decideOverlap() calls policyFor()`
- c0047 ..> c0047: `decideOverlap() calls validateDecision()`
- c0047 ..> c0047: `decideOverlapBatch() calls correlation()`
- c0047 ..> c0047: `decideOverlapBatch() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `decideOverlapBatch() calls policyFor()`
- c0047 ..> c0047: `decideOverlapBatch() calls prepareOverlapBatch()`
- c0047 ..> c0047: `destinationProjects() calls resolveDestination()`
- c0047 ..> c0047: `enabled() calls getMode()`
- c0047 ..> c0047: `enabled() calls isEnabled()`
- c0047 ..> c0047: `enqueueSnapshot() calls getMode()`
- c0047 ..> c0047: `enqueueSnapshot() calls isEnabled()`
- c0047 ..> c0047: `ensureModelCallAllowed() calls enabled()`
- c0047 ..> c0047: `ensureWriteAllowed() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `ensureWriteAllowed() calls enabled()`
- c0047 ..> c0047: `ensureWriteAllowed() calls getMode()`
- c0047 ..> c0047: `equivalentMemory() calls ensureWriteAllowed()`
- c0047 ..> c0047: `evidenceReadTool() calls canReadNow()`
- c0047 ..> c0047: `evidenceReadTool() calls enabled()`
- c0047 ..> c0047: `executeLinkReview() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `executeLinkReview() calls checkpointOutcome()`
- c0047 ..> c0047: `executeLinkReview() calls ensureWriteAllowed()`
- c0047 ..> c0047: `executeLinkReview() calls finishReviewedSupersession()`
- c0047 ..> c0047: `executeLinkReview() calls previousSupersessionCompleted()`
- c0047 ..> c0047: `executeLinkReview() calls recordLinkReviewFailure()`
- c0047 ..> c0047: `executeLinkReviews() calls executeLinkReview()`
- c0047 ..> c0047: `executeResolutionLinks() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `executeResolutionLinks() calls ensureWriteAllowed()`
- c0047 ..> c0047: `executeResolutionLinks() calls linkResolutionEntity()`
- c0047 ..> c0047: `existingNeighborhood() calls neighborhoodEntities()`
- c0047 ..> c0047: `existingNeighborhood() calls neighborhoodRelationships()`
- c0047 ..> c0047: `finishMerge() calls applySupersession()`
- c0047 ..> c0047: `finishMerge() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `finishMerge() calls checkpointOutcome()`
- c0047 ..> c0047: `finishMerge() calls ensureWriteAllowed()`
- c0047 ..> c0047: `finishMerge() calls readMaintenanceTargets()`
- c0047 ..> c0047: `finishMerge() calls verifyRequestedMerge()`
- c0047 ..> c0047: `finishReviewedSupersession() calls finishSupersession()`
- c0047 ..> c0047: `finishSupersession() calls applySupersession()`
- c0047 ..> c0047: `finishSupersession() calls checkpointOutcome()`
- c0047 ..> c0047: `linkResolutionEntity() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `linkResolutionEntity() calls ensureWriteAllowed()`
- c0047 ..> c0047: `loadCandidates() calls correlation()`
- c0047 ..> c0047: `loadCandidates() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `loadCandidates() calls evidenceReadTool()`
- c0047 ..> c0047: `loadCandidates() calls policyFor()`
- c0047 ..> c0047: `loadCandidates() calls sourceInspectionTool()`
- c0047 ..> c0047: `loadOverlaps() calls checkpointOutcome()`
- c0047 ..> c0047: `loadOverlaps() calls enabled()`
- c0047 ..> c0047: `mergeCandidate() calls checkpointOutcome()`
- c0047 ..> c0047: `mergeCandidate() calls composeMerge()`
- c0047 ..> c0047: `mergeCandidate() calls createMemory()`
- c0047 ..> c0047: `mergeCandidate() calls ensureWriteAllowed()`
- c0047 ..> c0047: `mergeCandidate() calls finishMerge()`
- c0047 ..> c0047: `mergeCandidate() calls readMaintenanceTargets()`
- c0047 ..> c0047: `mergeCandidate() calls writeKnowledge()`
- c0047 ..> c0047: `migrateLegacyLinkReview() calls checkpointOutcome()`
- c0047 ..> c0047: `migrateLegacyLinkReview() calls connectionUncertainty()`
- c0047 ..> c0047: `mutate() calls activity()`
- c0047 ..> c0047: `mutate() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `neighborhoodEntities() calls neighborhoodEntity()`
- c0047 ..> c0047: `neighborhoodEntities() calls neighborhoodMatches()`
- c0047 ..> c0047: `neighborhoodEntity() calls enabled()`
- c0047 ..> c0047: `neighborhoodMatches() calls enabled()`
- c0047 ..> c0047: `neighborhoodRelationships() calls enabled()`
- c0047 ..> c0047: `ownedConflict() calls verifyConflictOrigin()`
- c0047 ..> c0047: `pendingConflicts() calls verifyConflictOrigin()`
- c0047 ..> c0047: `planConflictReplacement() calls ensureWriteAllowed()`
- c0047 ..> c0047: `planConflictReplacement() calls readSavedMemory()`
- c0047 ..> c0047: `planConflictReplacement() calls revisionResources()`
- c0047 ..> c0047: `planLinkReviews() calls correlation()`
- c0047 ..> c0047: `planLinkReviews() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `planLinkReviews() calls ensureWriteAllowed()`
- c0047 ..> c0047: `preflightRetirement() calls confirmedRetirement()`
- c0047 ..> c0047: `preflightRetirement() calls readMaintenanceTargets()`
- c0047 ..> c0047: `prepareDestination() calls checkpointOutcome()`
- c0047 ..> c0047: `prepareDestination() calls destinationProjects()`
- c0047 ..> c0047: `prepareLinkReviews() calls checkpointOutcome()`
- c0047 ..> c0047: `prepareLinkReviews() calls ensureWriteAllowed()`
- c0047 ..> c0047: `prepareLinkReviews() calls migrateLegacyLinkReview()`
- c0047 ..> c0047: `prepareLinkReviews() calls refreshLinkReview()`
- c0047 ..> c0047: `prepareOverlapBatch() calls existingNeighborhood()`
- c0047 ..> c0047: `prepareOverlapBatch() calls loadOverlaps()`
- c0047 ..> c0047: `prepareOverlapBatch() calls prepareDestination()`
- c0047 ..> c0047: `previousSupersessionCompleted() calls ensureWriteAllowed()`
- c0047 ..> c0047: `processBranchJob() calls correlation()`
- c0047 ..> c0047: `processBranchJob() calls processJob()`
- c0047 ..> c0047: `processBranchJob() calls recordBranchFailure()`
- c0047 ..> c0047: `processCandidate() calls applyDecision()`
- c0047 ..> c0047: `processCandidate() calls checkpointOutcome()`
- c0047 ..> c0047: `processCandidate() calls decideOverlap()`
- c0047 ..> c0047: `processCandidate() calls enabled()`
- c0047 ..> c0047: `processCandidate() calls getMode()`
- c0047 ..> c0047: `processCandidate() calls loadOverlaps()`
- c0047 ..> c0047: `processCandidate() calls mergeCandidate()`
- c0047 ..> c0047: `processCandidate() calls prepareDestination()`
- c0047 ..> c0047: `processCandidate() calls processKnowledgeCheckpoint()`
- c0047 ..> c0047: `processCandidate() calls processReplacementCheckpoint()`
- c0047 ..> c0047: `processCandidate() calls retireCandidate()`
- c0047 ..> c0047: `processCandidates() calls correctCandidateFailures()`
- c0047 ..> c0047: `processCandidates() calls processOrderedCandidates()`
- c0047 ..> c0047: `processCandidates() calls recordCandidateFailure()`
- c0047 ..> c0047: `processCandidates() calls saveCorrectableFailure()`
- c0047 ..> c0047: `processJob() calls decideOverlapBatch()`
- c0047 ..> c0047: `processJob() calls enabled()`
- c0047 ..> c0047: `processJob() calls getMode()`
- c0047 ..> c0047: `processJob() calls loadCandidates()`
- c0047 ..> c0047: `processJob() calls processCandidates()`
- c0047 ..> c0047: `processJob() calls reviewLinks()`
- c0047 ..> c0047: `processKnowledgeCheckpoint() calls finishSupersession()`
- c0047 ..> c0047: `processKnowledgeCheckpoint() calls writeKnowledge()`
- c0047 ..> c0047: `processOrderedCandidates() calls checkpointOutcome()`
- c0047 ..> c0047: `processOrderedCandidates() calls processCandidate()`
- c0047 ..> c0047: `processOrderedCandidates() calls processCandidates()`
- c0047 ..> c0047: `processOrderedCandidates() calls recordCandidateFailure()`
- c0047 ..> c0047: `processOrderedCandidates() calls saveCorrectableFailure()`
- c0047 ..> c0047: `processReplacementCheckpoint() calls finishSupersession()`
- c0047 ..> c0047: `processReplacementCheckpoint() calls writeKnowledge()`
- c0047 ..> c0047: `publishActivity() calls onActivity()`
- c0047 ..> c0047: `read() calls activity()`
- c0047 ..> c0047: `read() calls readSignal()`
- c0047 ..> c0047: `readMaintenanceTargets() calls ensureWriteAllowed()`
- c0047 ..> c0047: `recordBranchFailure() calls correlation()`
- c0047 ..> c0047: `recordCandidateFailure() calls candidateUncertainty()`
- c0047 ..> c0047: `recordCandidateFailure() calls checkpointOutcome()`
- c0047 ..> c0047: `recordCandidateFailure() calls correlation()`
- c0047 ..> c0047: `recordCandidateFailure() calls isModelFailure()`
- c0047 ..> c0047: `recordCandidateFailure() calls pauseCandidate()`
- c0047 ..> c0047: `recordEscalation() calls checkpointOutcome()`
- c0047 ..> c0047: `recordLinkReviewFailure() calls checkpointOutcome()`
- c0047 ..> c0047: `recordLinkReviewFailure() calls connectionUncertainty()`
- c0047 ..> c0047: `refreshLinkReview() calls ensureWriteAllowed()`
- c0047 ..> c0047: `resolve() calls resolveConflict()`
- c0047 ..> c0047: `resolveConflict() calls resolveConflictOwned()`
- c0047 ..> c0047: `resolveConflictOwned() calls applyConflictResolution()`
- c0047 ..> c0047: `resolveConflictOwned() calls enabled()`
- c0047 ..> c0047: `resolveConflictOwned() calls ownedConflict()`
- c0047 ..> c0047: `resolveConflictOwned() calls rejectConflict()`
- c0047 ..> c0047: `resolveConflictOwned() calls resolutionTarget()`
- c0047 ..> c0047: `resolveConflictOwned() calls validateResolutionEvidence()`
- c0047 ..> c0047: `retireCandidate() calls applySupersession()`
- c0047 ..> c0047: `retireCandidate() calls checkpointOutcome()`
- c0047 ..> c0047: `retireCandidate() calls confirmedRetirement()`
- c0047 ..> c0047: `retireCandidate() calls ensureWriteAllowed()`
- c0047 ..> c0047: `retireCandidate() calls preflightRetirement()`
- c0047 ..> c0047: `reviewExecutionFailure() calls checkpointOutcome()`
- c0047 ..> c0047: `reviewExecutionFailure() calls correctedCaptureOutcome()`
- c0047 ..> c0047: `reviewExecutionFailure() calls correlation()`
- c0047 ..> c0047: `reviewExecutionFailure() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `reviewLinks() calls executeLinkReviews()`
- c0047 ..> c0047: `reviewLinks() calls planLinkReviews()`
- c0047 ..> c0047: `reviewLinks() calls prepareLinkReviews()`
- c0047 ..> c0047: `revisionResources() calls read()`
- c0047 ..> c0047: `runBranchWorker() calls enabled()`
- c0047 ..> c0047: `runBranchWorker() calls processBranchJob()`
- c0047 ..> c0047: `saveCorrectableFailure() calls candidateUncertainty()`
- c0047 ..> c0047: `saveCorrectableFailure() calls checkpointOutcome()`
- c0047 ..> c0047: `saveCorrectableFailure() calls correlation()`
- c0047 ..> c0047: `saveCorrectableFailure() calls isModelFailure()`
- c0047 ..> c0047: `skipCandidate() calls checkpointOutcome()`
- c0047 ..> c0047: `skipCandidate() calls writeKnowledge()`
- c0047 ..> c0047: `supersedeCandidate() calls checkpointOutcome()`
- c0047 ..> c0047: `supersedeCandidate() calls createMemory()`
- c0047 ..> c0047: `supersedeCandidate() calls ensureModelCallAllowed()`
- c0047 ..> c0047: `supersedeCandidate() calls ensureWriteAllowed()`
- c0047 ..> c0047: `supersedeCandidate() calls finishSupersession()`
- c0047 ..> c0047: `supersedeCandidate() calls writeKnowledge()`
- c0047 ..> c0047: `supersessionAlreadyApplied() calls ensureWriteAllowed()`
- c0047 ..> c0047: `updateResolutionReplacement() calls assertWriteAllowedNow()`
- c0047 ..> c0047: `updateResolutionReplacement() calls ensureWriteAllowed()`
- c0047 ..> c0047: `validateResolutionEvidence() calls selectResolutionEvidence()`
- c0047 ..> c0047: `verifyRequestedMerge() calls ensureWriteAllowed()`
- c0047 ..> c0047: `writeKnowledge() calls checkpointOutcome()`
- c0047 ..> c0047: `writeKnowledge() calls ensureWriteAllowed()`
- c0047 --> c0048: `field onActivity`
- c0047 ..> c0048: `type in constructor`
- c0047 ..> c0049: `applySupersession() constructs CaptureUncertainWrite`
- c0047 ..> c0049: `candidateUncertainty() constructs CaptureUncertainWrite`
- c0047 ..> c0049: `connectionUncertainty() constructs CaptureUncertainWrite`
- c0047 ..> c0049: `createMemory() constructs CaptureUncertainWrite`
- c0047 ..> c0049: `mutate() constructs CaptureUncertainWrite`
- c0047 ..> c0049: `processJob() constructs CaptureUncertainWrite`
- c0047 ..> c0049: `reviewExecutionFailure() constructs CaptureUncertainWrite`
- c0047 ..> c0049: `type in candidateUncertainty`
- c0047 ..> c0049: `type in connectionUncertainty`
- c0047 ..> c0050: `type in applyConflictResolution`
- c0047 ..> c0050: `type in planConflictReplacement`
- c0047 ..> c0050: `type in validateResolutionEvidence`
- c0047 ..> c0051: `type in applyConflictResolution`
- c0047 ..> c0051: `type in resolutionTarget`
- c0047 ..> c0052: `destinationProjects() constructs InvalidCaptureOutput`
- c0047 ..> c0052: `processKnowledgeCheckpoint() constructs InvalidCaptureOutput`
- c0047 ..> c0052: `processReplacementCheckpoint() constructs InvalidCaptureOutput`
- c0047 ..> c0052: `validateDecision() constructs InvalidCaptureOutput`
- c0047 ..> c0053: `resolveDestination() constructs MissingCaptureDestination`
- c0047 ..> c0054: `type in rejectConflict`
- c0047 ..> c0054: `type in resolve`
- c0047 ..> c0054: `type in resolveConflict`
- c0047 ..> c0054: `type in resolveConflictOwned`
- c0047 ..> c0054: `type in selectResolutionEvidence`
- c0047 ..> c0054: `type in validateResolutionEvidence`
- c0047 ..> c0055: `addConflict() calls clone()`
- c0047 ..> c0055: `addConflict() calls sourceEvidence()`
- c0047 ..> c0055: `applyConflictResolution() calls blockedSave()`
- c0047 ..> c0055: `applyConflictResolution() calls conflictResolutionEvidence()`
- c0047 ..> c0055: `applyDecision() calls firstConflictId()`
- c0047 ..> c0055: `applySupersession() calls definitelyRejected()`
- c0047 ..> c0055: `candidateUncertainty() calls record()`
- c0047 ..> c0055: `checkpointBranch() calls scrubError()`
- c0047 ..> c0055: `checkpointOutcome() calls clone()`
- c0047 ..> c0055: `checkpointOutcome() calls record()`
- c0047 ..> c0055: `composeMerge() calls captureWorkMetadata()`
- c0047 ..> c0055: `composeMerge() calls decisionConflictIds()`
- c0047 ..> c0055: `composeMerge() calls record()`
- c0047 ..> c0055: `composeMerge() calls sourceEvidence()`
- c0047 ..> c0055: `correctCandidateFailures() calls isFinalOutcome()`
- c0047 ..> c0055: `correctedCaptureOutcome() calls decisionConflictIds()`
- c0047 ..> c0055: `correctedCaptureOutcome() calls record()`
- c0047 ..> c0055: `correctedCaptureOutcome() calls reusableMergeComposition()`
- c0047 ..> c0055: `createMemory() calls definitelyRejected()`
- c0047 ..> c0055: `createMemory() calls memoryInput()`
- c0047 ..> c0055: `createMemory() calls projectId()`
- c0047 ..> c0055: `createMemory() calls record()`
- c0047 ..> c0055: `createResolutionReplacement() calls definitelyRejected()`
- c0047 ..> c0055: `createResolutionReplacement() calls projectId()`
- c0047 ..> c0055: `decideOverlap() calls appendSubmissionRejection()`
- c0047 ..> c0055: `decideOverlap() calls boundedSubmissionRejections()`
- c0047 ..> c0055: `decideOverlap() calls captureWorkMetadata()`
- c0047 ..> c0055: `decideOverlap() calls decisionConflictIds()`
- c0047 ..> c0055: `decideOverlap() calls overlapCandidate()`
- c0047 ..> c0055: `decideOverlap() calls parseDecision()`
- c0047 ..> c0055: `decideOverlap() calls sourceEvidence()`
- c0047 ..> c0055: `decideOverlapBatch() calls appendSubmissionRejection()`
- c0047 ..> c0055: `decideOverlapBatch() calls boundedSubmissionRejections()`
- c0047 ..> c0055: `decideOverlapBatch() calls captureWorkMetadata()`
- c0047 ..> c0055: `decideOverlapBatch() calls overlapCandidate()`
- c0047 ..> c0055: `decideOverlapBatch() calls record()`
- c0047 ..> c0055: `decideOverlapBatch() calls scrubError()`
- c0047 ..> c0055: `decideOverlapBatch() calls sharedSourceEvidence()`
- c0047 ..> c0055: `diagnostics() calls boundedSubmissionRejections()`
- c0047 ..> c0055: `diagnostics() calls projectId()`
- c0047 ..> c0055: `diagnostics() calls record()`
- c0047 ..> c0055: `diagnostics() calls scrubError()`
- c0047 ..> c0055: `diagnostics() calls stringValue()`
- c0047 ..> c0055: `diagnostics() calls strings()`
- c0047 ..> c0055: `enqueue() calls scrubError()`
- c0047 ..> c0055: `enqueueSnapshot() calls snapshotForPersistence()`
- c0047 ..> c0055: `equivalentMemory() calls projectId()`
- c0047 ..> c0055: `equivalentMemory() calls record()`
- c0047 ..> c0055: `evidenceReadTool() calls record()`
- c0047 ..> c0055: `executeLinkReview() calls record()`
- c0047 ..> c0055: `executeLinkReviews() calls record()`
- c0047 ..> c0055: `finishMerge() calls record()`
- c0047 ..> c0055: `finishSupersession() calls record()`
- c0047 ..> c0055: `loadCandidates() calls appendSubmissionRejection()`
- c0047 ..> c0055: `loadCandidates() calls boundedSubmissionRejections()`
- c0047 ..> c0055: `loadCandidates() calls captureCandidateSubmission()`
- c0047 ..> c0055: `loadCandidates() calls captureWorkMetadata()`
- c0047 ..> c0055: `loadCandidates() calls parseCandidates()`
- c0047 ..> c0055: `loadCandidates() calls record()`
- c0047 ..> c0055: `loadCandidates() calls strings()`
- c0047 ..> c0055: `loadOverlaps() calls record()`
- c0047 ..> c0055: `mergeCandidate() calls projectId()`
- c0047 ..> c0055: `mergeCandidate() calls record()`
- c0047 ..> c0055: `neighborhoodMatches() calls record()`
- c0047 ..> c0055: `pauseCandidate() calls scrubError()`
- c0047 ..> c0055: `planLinkReviews() calls appendSubmissionRejection()`
- c0047 ..> c0055: `planLinkReviews() calls boundedSubmissionRejections()`
- c0047 ..> c0055: `planLinkReviews() calls captureWorkMetadata()`
- c0047 ..> c0055: `planLinkReviews() calls record()`
- c0047 ..> c0055: `planLinkReviews() calls sharedSourceEvidence()`
- c0047 ..> c0055: `preflightRetirement() calls record()`
- c0047 ..> c0055: `prepareLinkReviews() calls record()`
- c0047 ..> c0055: `prepareOverlapBatch() calls isFinalOutcome()`
- c0047 ..> c0055: `prepareOverlapBatch() calls record()`
- c0047 ..> c0055: `processCandidate() calls isFinalOutcome()`
- c0047 ..> c0055: `processCandidate() calls record()`
- c0047 ..> c0055: `processJob() calls isFinalOutcome()`
- c0047 ..> c0055: `processKnowledgeCheckpoint() calls projectId()`
- c0047 ..> c0055: `processKnowledgeCheckpoint() calls record()`
- c0047 ..> c0055: `processOrderedCandidates() calls isFinalOutcome()`
- c0047 ..> c0055: `processOrderedCandidates() calls record()`
- c0047 ..> c0055: `processReplacementCheckpoint() calls projectId()`
- c0047 ..> c0055: `processReplacementCheckpoint() calls record()`
- c0047 ..> c0055: `recordBranchFailure() calls scrubError()`
- c0047 ..> c0055: `recordCandidateFailure() calls record()`
- c0047 ..> c0055: `recordCandidateFailure() calls scrubError()`
- c0047 ..> c0055: `recordLinkReviewFailure() calls record()`
- c0047 ..> c0055: `refreshLinkReview() calls projectId()`
- c0047 ..> c0055: `refreshLinkReview() calls record()`
- c0047 ..> c0055: `resolutionTarget() calls record()`
- c0047 ..> c0055: `resolveDestination() calls currentProjectId()`
- c0047 ..> c0055: `resolveDestination() calls projectId()`
- c0047 ..> c0055: `retireCandidate() calls decisionConflictIds()`
- c0047 ..> c0055: `retireCandidate() calls record()`
- c0047 ..> c0055: `reviewExecutionFailure() calls captureWorkMetadata()`
- c0047 ..> c0055: `reviewExecutionFailure() calls record()`
- c0047 ..> c0055: `reviewLinks() calls record()`
- c0047 ..> c0055: `saveCorrectableFailure() calls record()`
- c0047 ..> c0055: `saveCorrectableFailure() calls scrubError()`
- c0047 ..> c0055: `skipCandidate() calls firstConflictId()`
- c0047 ..> c0055: `skipCandidate() calls record()`
- c0047 ..> c0055: `supersedeCandidate() calls decisionConflictIds()`
- c0047 ..> c0055: `validateResolutionEvidence() calls stringValue()`
- c0047 ..> c0055: `validateResolutionEvidence() calls trustedAdditionalEntries()`
- c0047 ..> c0055: `verifyConflictOrigin() calls record()`
- c0047 ..> c0055: `writeKnowledge() calls captureKnowledgePlan()`
- c0047 ..> c0055: `writeKnowledge() calls record()`
- c0047 --> c0070: `field getMode`
- c0047 ..> c0070: `type in enabled`
- c0047 ..> c0070: `type in ensureWriteAllowed`
- c0047 ..> c0070: `type in refreshLinkReview`
- c0047 ..> c0071: `type in advance`
- c0047 ..> c0071: `type in advanceWatermark`
- c0047 ..> c0071: `type in checkpoint`
- c0047 ..> c0071: `type in checkpointBranches`
- c0047 ..> c0071: `type in enqueue`
- c0047 ..> c0071: `type in enqueueSnapshot`
- c0047 ..> c0071: `type in policyFor`
- c0047 ..> c0079: `type in neighborhoodEntities`
- c0047 ..> c0079: `type in neighborhoodEntity`
- c0047 ..> c0079: `type in neighborhoodMatches`
- c0047 ..> c0079: `type in neighborhoodRelationships`
- c0047 ..> c0081: `type in neighborhoodRelationships`
- c0047 --> c0086: `field client`
- c0047 ..> c0086: `type in cancellableClient`
- c0047 ..> c0087: `type in cancellableKnowledge`
- c0047 --> c0089: `field readSavedMemory`
- c0047 ..> c0089: `type in addConflict`
- c0047 ..> c0089: `type in applyDecision`
- c0047 ..> c0089: `type in applySupersession`
- c0047 ..> c0089: `type in decideOverlap`
- c0047 ..> c0089: `type in equivalentMemory`
- c0047 ..> c0089: `type in finishSupersession`
- c0047 ..> c0089: `type in loadOverlaps`
- c0047 ..> c0089: `type in planConflictReplacement`
- c0047 ..> c0089: `type in readMaintenanceTargets`
- c0047 ..> c0089: `type in recordEscalation`
- c0047 ..> c0089: `type in revisionResources`
- c0047 ..> c0089: `type in skipCandidate`
- c0047 ..> c0089: `type in supersedeCandidate`
- c0047 ..> c0089: `type in validateDecision`
- c0047 ..> c0089: `type in writeKnowledge`
- c0047 ..> c0090: `type in createMemory`
- c0047 --> c0092: `field model`
- c0047 ..> c0094: `evidenceReadTool() constructs ModelEvidencePage`
- c0047 ..> c0095: `sourceInspectionTool() constructs ModelReadErrorResult`
- c0047 ..> c0096: `type in evidenceReadTool`
- c0047 ..> c0096: `type in sourceInspectionTool`
- c0047 ..> c0107: `type in destinationProjects`
- c0047 ..> c0107: `type in planConflictReplacement`
- c0047 ..> c0107: `type in resolveDestination`
- c0047 ..> c0107: `type in watermark`
- c0047 ..> c0131: `cancellableKnowledge() calls createCodeArtifact()`
- c0047 ..> c0131: `cancellableKnowledge() calls createDocument()`
- c0047 ..> c0131: `cancellableKnowledge() calls createEntity()`
- c0047 ..> c0131: `cancellableKnowledge() calls createRelationship()`
- c0047 ..> c0131: `cancellableKnowledge() calls getCodeArtifact()`
- c0047 ..> c0131: `cancellableKnowledge() calls getDocument()`
- c0047 ..> c0131: `cancellableKnowledge() calls getEntity()`
- c0047 ..> c0131: `cancellableKnowledge() calls getEntityMemories()`
- c0047 ..> c0131: `cancellableKnowledge() calls getFile()`
- c0047 ..> c0131: `cancellableKnowledge() calls getRelationships()`
- c0047 ..> c0131: `cancellableKnowledge() calls linkEntityMemory()`
- c0047 ..> c0131: `cancellableKnowledge() calls linkMemories()`
- c0047 ..> c0131: `cancellableKnowledge() calls listCodeArtifacts()`
- c0047 ..> c0131: `cancellableKnowledge() calls listDocuments()`
- c0047 ..> c0131: `cancellableKnowledge() calls listFiles()`
- c0047 ..> c0131: `cancellableKnowledge() calls searchEntities()`
- c0047 ..> c0131: `cancellableKnowledge() calls updateCodeArtifact()`
- c0047 ..> c0131: `cancellableKnowledge() calls updateDocument()`
- c0047 ..> c0131: `cancellableKnowledge() calls updateEntity()`
- c0047 ..> c0131: `cancellableKnowledge() calls updateMemory()`
- c0047 ..> c0131: `executeResolutionLinks() calls linkMemories()`
- c0047 ..> c0131: `existingNeighborhood() calls getCodeArtifact()`
- c0047 ..> c0131: `existingNeighborhood() calls getDocument()`
- c0047 ..> c0131: `existingNeighborhood() calls listCodeArtifacts()`
- c0047 ..> c0131: `existingNeighborhood() calls listDocuments()`
- c0047 ..> c0131: `linkResolutionEntity() calls linkEntityMemory()`
- c0047 ..> c0131: `neighborhoodEntity() calls getEntity()`
- c0047 ..> c0131: `neighborhoodMatches() calls searchEntities()`
- c0047 ..> c0131: `neighborhoodRelationships() calls getRelationships()`
- c0047 ..> c0131: `revisionResources() calls getCodeArtifact()`
- c0047 ..> c0131: `revisionResources() calls getDocument()`
- c0047 ..> c0131: `revisionResources() calls getEntity()`
- c0047 ..> c0131: `revisionResources() calls getFile()`
- c0047 ..> c0131: `updateResolutionReplacement() calls updateMemory()`
- c0047 ..> c0131: `verifyRequestedMerge() calls getEntity()`
- c0047 ..> c0134: `applyConflictResolution() calls get()`
- c0047 ..> c0134: `applySupersession() calls supersede()`
- c0047 ..> c0134: `cancellableClient() calls create()`
- c0047 ..> c0134: `cancellableClient() calls createProject()`
- c0047 ..> c0134: `cancellableClient() calls get()`
- c0047 ..> c0134: `cancellableClient() calls linkProject()`
- c0047 ..> c0134: `cancellableClient() calls listProjects()`
- c0047 ..> c0134: `cancellableClient() calls search()`
- c0047 ..> c0134: `cancellableClient() calls supersede()`
- c0047 ..> c0134: `constructor() calls get()`
- c0047 ..> c0134: `createMemory() calls create()`
- c0047 ..> c0134: `createResolutionReplacement() calls create()`
- c0047 ..> c0134: `decideOverlapBatch() calls get()`
- c0047 ..> c0134: `diagnostics() calls get()`
- c0047 ..> c0134: `equivalentMemory() calls get()`
- c0047 ..> c0134: `executeResolutionLinks() calls get()`
- c0047 ..> c0134: `finishMerge() calls get()`
- c0047 ..> c0134: `linkResolutionEntity() calls getMemoryEntityIds()`
- c0047 ..> c0134: `loadOverlaps() calls search()`
- c0047 ..> c0134: `planLinkReviews() calls get()`
- c0047 ..> c0134: `previousSupersessionCompleted() calls get()`
- c0047 ..> c0134: `read() calls get()`
- c0047 ..> c0134: `readMaintenanceTargets() calls get()`
- c0047 ..> c0134: `resolveDestination() calls listProjects()`
- c0047 ..> c0134: `retireCandidate() calls get()`
- c0047 ..> c0134: `revisionResources() calls get()`
- c0047 ..> c0134: `revisionResources() calls getMemoryEntityIds()`
- c0047 ..> c0134: `skipCandidate() calls get()`
- c0047 ..> c0134: `supersedeCandidate() calls get()`
- c0047 ..> c0134: `supersessionAlreadyApplied() calls get()`
- c0047 ..> c0134: `verifyConflictOrigin() calls get()`
- c0047 ..> c0134: `verifyRequestedMerge() calls get()`
- c0047 --> c0174: `field knowledgeWriter`
- c0047 ..> c0174: `constructor() constructs KnowledgeWriter`
- c0047 ..> c0174: `writeKnowledge() calls execute()`
- c0047 --> c0178: `field logger`
- c0047 ..> c0180: `checkpointBranch() calls emit()`
- c0047 ..> c0180: `checkpointOutcome() calls emit()`
- c0047 ..> c0180: `createMemory() calls emit()`
- c0047 ..> c0180: `decideOverlap() calls emit()`
- c0047 ..> c0180: `emit() calls emit()`
- c0047 ..> c0180: `enqueue() calls emit()`
- c0047 ..> c0180: `enqueueSnapshot() calls emit()`
- c0047 ..> c0180: `enqueueSnapshot() calls enqueue()`
- c0047 ..> c0180: `loadCandidates() calls emit()`
- c0047 ..> c0180: `processBranchJob() calls emit()`
- c0047 ..> c0180: `recordBranchFailure() calls emit()`
- c0047 ..> c0180: `recordCandidateFailure() calls emit()`
- c0047 ..> c0180: `runBranchWorker() calls emit()`
- c0047 ..> c0180: `saveCorrectableFailure() calls emit()`
- c0047 ..> c0182: `createMemory() calls replacementMemoryInput()`
- c0047 ..> c0182: `createResolutionReplacement() calls replacementMemoryInput()`
- c0047 ..> c0182: `planConflictReplacement() calls replacementMemoryInput()`
- c0047 ..> c0182: `updateResolutionReplacement() calls replacementMemoryInput()`
- c0047 ..> c0186: `loadCandidates() calls prepareCapture()`
- c0047 ..> c0196: `addConflict() calls sanitizeText()`
- c0047 ..> c0196: `addConflict() calls sanitizeValue()`
- c0047 ..> c0196: `applySupersession() calls errorMessage()`
- c0047 ..> c0196: `candidateUncertainty() calls errorMessage()`
- c0047 ..> c0196: `createMemory() calls errorMessage()`
- c0047 ..> c0196: `createResolutionReplacement() calls errorMessage()`
- c0047 ..> c0196: `decideOverlap() calls sanitizeValue()`
- c0047 ..> c0196: `diagnostics() calls sanitizeText()`
- c0047 ..> c0196: `emit() calls sanitizeValue()`
- c0047 ..> c0196: `existingNeighborhood() calls hasSensitiveData()`
- c0047 ..> c0196: `failConflictResolution() calls errorMessage()`
- c0047 ..> c0196: `loadCandidates() calls sanitizeText()`
- c0047 ..> c0196: `loadOverlaps() calls sanitizeValue()`
- c0047 ..> c0196: `mutate() calls errorMessage()`
- c0047 ..> c0196: `neighborhoodEntity() calls hasSensitiveData()`
- c0047 ..> c0196: `neighborhoodRelationships() calls hasSensitiveData()`
- c0047 ..> c0196: `recordCandidateFailure() calls errorMessage()`
- c0047 ..> c0196: `recordLinkReviewFailure() calls errorMessage()`
- c0047 ..> c0196: `refreshLinkReview() calls errorMessage()`
- c0047 ..> c0196: `rejectConflict() calls sanitizeText()`
- c0047 ..> c0196: `reviewExecutionFailure() calls errorMessage()`
- c0047 ..> c0196: `saveCorrectableFailure() calls errorMessage()`
- c0047 ..> c0196: `skipCandidate() calls sanitizeValue()`
- c0047 --> c0200: `field queue`
- c0047 ..> c0200: `addConflict() calls addConflict()`
- c0047 ..> c0200: `addConflict() calls now()`
- c0047 ..> c0200: `advance() calls advanceWatermark()`
- c0047 ..> c0200: `applyConflictResolution() calls updateConflict()`
- c0047 ..> c0200: `cancellableClient() calls mutate()`
- c0047 ..> c0200: `cancellableKnowledge() calls mutate()`
- c0047 ..> c0200: `checkpoint() calls hasClaimableWork()`
- c0047 ..> c0200: `checkpointBranch() calls withWorkerLock()`
- c0047 ..> c0200: `checkpointBranches() calls listJobMetadata()`
- c0047 ..> c0200: `checkpointOutcome() calls checkpoint()`
- c0047 ..> c0200: `checkpointOutcome() calls getJob()`
- c0047 ..> c0200: `composeMerge() calls checkpoint()`
- c0047 ..> c0200: `composeMerge() calls complete()`
- c0047 ..> c0200: `constructor() calls complete()`
- c0047 ..> c0200: `createResolutionReplacement() calls updateConflict()`
- c0047 ..> c0200: `decideOverlap() calls checkpoint()`
- c0047 ..> c0200: `decideOverlap() calls complete()`
- c0047 ..> c0200: `decideOverlapBatch() calls checkpoint()`
- c0047 ..> c0200: `decideOverlapBatch() calls complete()`
- c0047 ..> c0200: `diagnostics() calls listJobMetadata()`
- c0047 ..> c0200: `diagnostics() calls pendingConflicts()`
- c0047 ..> c0200: `enqueue() calls enqueueSnapshot()`
- c0047 ..> c0200: `enqueueSnapshot() calls advanceWatermark()`
- c0047 ..> c0200: `executeLinkReviews() calls getJob()`
- c0047 ..> c0200: `executeResolutionLinks() calls updateConflict()`
- c0047 ..> c0200: `failConflictResolution() calls getConflict()`
- c0047 ..> c0200: `failConflictResolution() calls updateConflict()`
- c0047 ..> c0200: `loadCandidates() calls checkpoint()`
- c0047 ..> c0200: `loadCandidates() calls complete()`
- c0047 ..> c0200: `loadCandidates() calls getJob()`
- c0047 ..> c0200: `loadCandidates() calls refreshCaptureHistory()`
- c0047 ..> c0200: `markConflictResolved() calls updateConflict()`
- c0047 ..> c0200: `ownedConflict() calls getConflict()`
- c0047 ..> c0200: `pauseCandidate() calls checkpoint()`
- c0047 ..> c0200: `pauseCandidate() calls getJob()`
- c0047 ..> c0200: `pendingConflicts() calls pendingConflicts()`
- c0047 ..> c0200: `planConflictReplacement() calls complete()`
- c0047 ..> c0200: `planConflictReplacement() calls getJob()`
- c0047 ..> c0200: `planLinkReviews() calls checkpoint()`
- c0047 ..> c0200: `planLinkReviews() calls complete()`
- c0047 ..> c0200: `processBranchJob() calls getJob()`
- c0047 ..> c0200: `processBranchJob() calls now()`
- c0047 ..> c0200: `processBranchJob() calls releaseProgress()`
- c0047 ..> c0200: `processJob() calls checkpoint()`
- c0047 ..> c0200: `processJob() calls complete()`
- c0047 ..> c0200: `processJob() calls getJob()`
- c0047 ..> c0200: `processJob() calls releaseProgress()`
- c0047 ..> c0200: `processPending() calls checkpoint()`
- c0047 ..> c0200: `recordBranchFailure() calls cancel()`
- c0047 ..> c0200: `recordBranchFailure() calls checkpoint()`
- c0047 ..> c0200: `recordBranchFailure() calls getJob()`
- c0047 ..> c0200: `recordBranchFailure() calls now()`
- c0047 ..> c0200: `recordCandidateFailure() calls cancel()`
- c0047 ..> c0200: `recordCandidateFailure() calls checkpoint()`
- c0047 ..> c0200: `recordCandidateFailure() calls getJob()`
- c0047 ..> c0200: `recordEscalation() calls addConflict()`
- c0047 ..> c0200: `recordLinkReviewFailure() calls getJob()`
- c0047 ..> c0200: `recordSupersession() calls checkpoint()`
- c0047 ..> c0200: `recordSupersession() calls updateConflict()`
- c0047 ..> c0200: `rejectConflict() calls updateConflict()`
- c0047 ..> c0200: `resolveConflict() calls getConflict()`
- c0047 ..> c0200: `resolveConflict() calls withWorkerLock()`
- c0047 ..> c0200: `reviewExecutionFailure() calls checkpoint()`
- c0047 ..> c0200: `reviewExecutionFailure() calls complete()`
- c0047 ..> c0200: `runBranchWorker() calls claimNext()`
- c0047 ..> c0200: `saveCorrectableFailure() calls getJob()`
- c0047 ..> c0200: `sourceInspectionTool() calls checkpoint()`
- c0047 ..> c0200: `updateResolutionReplacement() calls updateConflict()`
- c0047 ..> c0200: `verifyConflictOrigin() calls getJob()`
- c0047 ..> c0200: `watermark() calls getWatermark()`
- c0047 ..> c0204: `type in addConflict`
- c0047 ..> c0204: `type in applyConflictResolution`
- c0047 ..> c0204: `type in createResolutionReplacement`
- c0047 ..> c0204: `type in executeResolutionLinks`
- c0047 ..> c0204: `type in linkResolutionEntity`
- c0047 ..> c0204: `type in ownedConflict`
- c0047 ..> c0204: `type in planConflictReplacement`
- c0047 ..> c0204: `type in rejectConflict`
- c0047 ..> c0204: `type in resolutionTarget`
- c0047 ..> c0204: `type in selectResolutionEvidence`
- c0047 ..> c0204: `type in updateResolutionReplacement`
- c0047 ..> c0204: `type in validateResolutionEvidence`
- c0047 ..> c0204: `type in verifyConflictOrigin`
- c0047 --> c0208: `field identity`
- c0047 ..> c0209: `type in addConflict`
- c0047 ..> c0209: `type in applyDecision`
- c0047 ..> c0209: `type in applySupersession`
- c0047 ..> c0209: `type in checkpointOutcome`
- c0047 ..> c0209: `type in composeMerge`
- c0047 ..> c0209: `type in correctCandidateFailures`
- c0047 ..> c0209: `type in correlation`
- c0047 ..> c0209: `type in createMemory`
- c0047 ..> c0209: `type in decideOverlap`
- c0047 ..> c0209: `type in decideOverlapBatch`
- c0047 ..> c0209: `type in ensureModelCallAllowed`
- c0047 ..> c0209: `type in equivalentMemory`
- c0047 ..> c0209: `type in evidenceReadTool`
- c0047 ..> c0209: `type in executeLinkReview`
- c0047 ..> c0209: `type in executeLinkReviews`
- c0047 ..> c0209: `type in existingNeighborhood`
- c0047 ..> c0209: `type in finishMerge`
- c0047 ..> c0209: `type in finishReviewedSupersession`
- c0047 ..> c0209: `type in finishSupersession`
- c0047 ..> c0209: `type in loadCandidates`
- c0047 ..> c0209: `type in loadOverlaps`
- c0047 ..> c0209: `type in mergeCandidate`
- c0047 ..> c0209: `type in migrateLegacyLinkReview`
- c0047 ..> c0209: `type in neighborhoodEntities`
- c0047 ..> c0209: `type in neighborhoodEntity`
- c0047 ..> c0209: `type in neighborhoodMatches`
- c0047 ..> c0209: `type in neighborhoodRelationships`
- c0047 ..> c0209: `type in pauseCandidate`
- c0047 ..> c0209: `type in planLinkReviews`
- c0047 ..> c0209: `type in preflightRetirement`
- c0047 ..> c0209: `type in prepareDestination`
- c0047 ..> c0209: `type in prepareLinkReviews`
- c0047 ..> c0209: `type in prepareOverlapBatch`
- c0047 ..> c0209: `type in previousSupersessionCompleted`
- c0047 ..> c0209: `type in processBranchJob`
- c0047 ..> c0209: `type in processCandidate`
- c0047 ..> c0209: `type in processCandidates`
- c0047 ..> c0209: `type in processJob`
- c0047 ..> c0209: `type in processKnowledgeCheckpoint`
- c0047 ..> c0209: `type in processOrderedCandidates`
- c0047 ..> c0209: `type in processReplacementCheckpoint`
- c0047 ..> c0209: `type in readMaintenanceTargets`
- c0047 ..> c0209: `type in recordBranchFailure`
- c0047 ..> c0209: `type in recordCandidateFailure`
- c0047 ..> c0209: `type in recordEscalation`
- c0047 ..> c0209: `type in recordLinkReviewFailure`
- c0047 ..> c0209: `type in refreshLinkReview`
- c0047 ..> c0209: `type in retireCandidate`
- c0047 ..> c0209: `type in reviewExecutionFailure`
- c0047 ..> c0209: `type in reviewLinks`
- c0047 ..> c0209: `type in saveCorrectableFailure`
- c0047 ..> c0209: `type in skipCandidate`
- c0047 ..> c0209: `type in sourceInspectionTool`
- c0047 ..> c0209: `type in supersedeCandidate`
- c0047 ..> c0209: `type in supersessionAlreadyApplied`
- c0047 ..> c0209: `type in verifyRequestedMerge`
- c0047 ..> c0209: `type in writeKnowledge`
- c0047 ..> c0216: `type in recordSupersession`
- c0047 ..> c0229: `composeMerge() calls trim()`
- c0047 ..> c0229: `neighborhoodMatches() calls trim()`
- c0047 ..> c0229: `retireCandidate() calls trim()`
- c0047 ..> c0238: `composeMerge() calls captureConversation()`
- c0047 ..> c0238: `decideOverlap() calls captureConversation()`
- c0047 ..> c0238: `decideOverlapBatch() calls captureConversation()`
- c0047 ..> c0238: `loadCandidates() calls captureConversation()`
- c0047 ..> c0238: `planConflictReplacement() calls captureConversation()`
- c0047 ..> c0238: `planConflictReplacement() calls sanitizeCaptureConversation()`
- c0047 ..> c0238: `planLinkReviews() calls captureConversation()`
- c0047 ..> c0238: `reviewExecutionFailure() calls captureConversation()`
- c0047 ..> c0242: `sourceInspectionTool() calls inspect()`
- c0047 ..> c0242: `sourceInspectionTool() constructs SourceInspector`
- c0048 --> c0022: `field onActivity`
- c0048 --> c0070: `field getMode`
- c0048 --> c0086: `field client`
- c0048 --> c0092: `field model`
- c0048 --> c0178: `field logger`
- c0048 --> c0200: `field queue`
- c0049 --|> c0041: `inherits`
- c0050 --> c0084: `field selectedAdditionalEntries`
- c0051 --> c0026: `field candidate`
- c0051 --> c0089: `field oldMemory`
- c0051 --> c0209: `field fakeJob`
- c0053 --|> c0006: `inherits`
- c0053 ..> c0026: `type in constructor`
- c0054 --> c0084: `field additionalEntries`
- c0055 ..> c0019: `type in parseCandidates`
- c0055 ..> c0020: `type in eligibleCandidate`
- c0055 ..> c0020: `type in invalidCandidate`
- c0055 ..> c0020: `type in validCandidate`
- c0055 ..> c0026: `type in captureKnowledgePlan`
- c0055 ..> c0026: `type in captureProvenance`
- c0055 ..> c0026: `type in eligibleCandidate`
- c0055 ..> c0026: `type in memoryInput`
- c0055 ..> c0026: `type in overlapCandidate`
- c0055 ..> c0026: `type in sharedSourceEvidence`
- c0055 ..> c0026: `type in sourceEvidence`
- c0055 ..> c0030: `type in applyEnrichmentDecision`
- c0055 ..> c0030: `type in applyEquivalentCandidate`
- c0055 ..> c0030: `type in decisionConflictIds`
- c0055 ..> c0030: `type in firstConflictId`
- c0055 ..> c0030: `type in parseDecision`
- c0055 ..> c0030: `type in reusableMergeComposition`
- c0055 ..> c0038: `type in reusableMergeComposition`
- c0055 ..> c0050: `type in conflictResolutionEvidence`
- c0055 ..> c0052: `applyEnrichmentDecision() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `applyEquivalentCandidate() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `captureResource() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `decisionEvidenceIds() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `decisionMemoryId() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `decisionMemoryIds() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `decisionPartial() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `decisionTargetMemoryId() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `decisionText() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `parseCandidates() constructs InvalidCaptureOutput`
- c0055 ..> c0052: `parseDecision() constructs InvalidCaptureOutput`
- c0055 ..> c0055: `appendSubmissionRejection() calls boundedSubmissionRejections()`
- c0055 ..> c0055: `captureEvidenceError() calls record()`
- c0055 ..> c0055: `captureEvidenceError() calls stringValue()`
- c0055 ..> c0055: `captureKnowledgePlan() calls captureProvenance()`
- c0055 ..> c0055: `captureKnowledgePlan() calls resourceInput()`
- c0055 ..> c0055: `captureResource() calls record()`
- c0055 ..> c0055: `currentProjectId() calls projectId()`
- c0055 ..> c0055: `decisionMemoryId() calls projectId()`
- c0055 ..> c0055: `decisionMemoryIds() calls projectId()`
- c0055 ..> c0055: `decisionTargetMemoryId() calls projectId()`
- c0055 ..> c0055: `eligibleCandidate() calls captureEvidenceError()`
- c0055 ..> c0055: `eligibleCandidate() calls captureResource()`
- c0055 ..> c0055: `eligibleCandidate() calls invalidCandidate()`
- c0055 ..> c0055: `eligibleCandidate() calls record()`
- c0055 ..> c0055: `eligibleCandidate() calls stringValue()`
- c0055 ..> c0055: `eligibleCandidate() calls validCandidate()`
- c0055 ..> c0055: `isFinalOutcome() calls record()`
- c0055 ..> c0055: `memoryInput() calls captureProvenance()`
- c0055 ..> c0055: `parseCandidates() calls eligibleCandidate()`
- c0055 ..> c0055: `parseCandidates() calls record()`
- c0055 ..> c0055: `parseCandidates() calls stringValue()`
- c0055 ..> c0055: `parseDecision() calls applyEnrichmentDecision()`
- c0055 ..> c0055: `parseDecision() calls applyEquivalentCandidate()`
- c0055 ..> c0055: `parseDecision() calls decisionEvidenceIds()`
- c0055 ..> c0055: `parseDecision() calls decisionMemoryId()`
- c0055 ..> c0055: `parseDecision() calls decisionMemoryIds()`
- c0055 ..> c0055: `parseDecision() calls decisionPartial()`
- c0055 ..> c0055: `parseDecision() calls decisionTargetMemoryId()`
- c0055 ..> c0055: `parseDecision() calls decisionText()`
- c0055 ..> c0055: `parseDecision() calls record()`
- c0055 ..> c0055: `resourceInput() calls record()`
- c0055 ..> c0055: `reusableMergeComposition() calls decisionConflictIds()`
- c0055 ..> c0055: `sharedSourceEvidence() calls sourceEvidence()`
- c0055 ..> c0055: `snapshotForPersistence() calls clone()`
- c0055 ..> c0055: `trustedAdditionalEntries() calls record()`
- c0055 ..> c0055: `trustedAdditionalEntries() calls stringValue()`
- c0055 ..> c0071: `type in captureCandidateSubmission`
- c0055 ..> c0071: `type in captureEvidenceError`
- c0055 ..> c0071: `type in captureWorkMetadata`
- c0055 ..> c0071: `type in eligibleCandidate`
- c0055 ..> c0071: `type in parseCandidates`
- c0055 ..> c0071: `type in sharedSourceEvidence`
- c0055 ..> c0071: `type in snapshotForPersistence`
- c0055 ..> c0071: `type in sourceEvidence`
- c0055 ..> c0084: `type in sharedSourceEvidence`
- c0055 ..> c0084: `type in sourceEvidence`
- c0055 ..> c0084: `type in trustedAdditionalEntries`
- c0055 ..> c0089: `type in captureKnowledgePlan`
- c0055 ..> c0091: `type in memoryInput`
- c0055 ..> c0099: `type in captureCandidateSubmission`
- c0055 ..> c0107: `type in captureKnowledgePlan`
- c0055 ..> c0107: `type in captureProvenance`
- c0055 ..> c0107: `type in currentProjectId`
- c0055 ..> c0107: `type in memoryInput`
- c0055 ..> c0134: `captureEvidenceError() calls get()`
- c0055 ..> c0134: `sourceEvidence() calls get()`
- c0055 ..> c0170: `type in captureKnowledgePlan`
- c0055 ..> c0196: `boundedSubmissionRejections() calls sanitizeText()`
- c0055 ..> c0196: `captureEvidenceError() calls isMemoryOperation()`
- c0055 ..> c0196: `captureEvidenceError() calls sanitizeText()`
- c0055 ..> c0196: `captureWorkMetadata() calls isMemoryOperation()`
- c0055 ..> c0196: `scrubError() calls errorMessage()`
- c0055 ..> c0196: `scrubError() calls sanitizeText()`
- c0055 ..> c0196: `strings() calls sanitizeText()`
- c0055 ..> c0196: `trustedAdditionalEntries() calls hasSensitiveData()`
- c0055 ..> c0196: `trustedAdditionalEntries() calls isMemoryOperation()`
- c0055 ..> c0196: `trustedAdditionalEntries() calls sanitizeText()`
- c0055 ..> c0229: `applyEnrichmentDecision() calls trim()`
- c0055 ..> c0229: `applyEquivalentCandidate() calls trim()`
- c0055 ..> c0229: `decisionEvidenceIds() calls trim()`
- c0055 ..> c0229: `eligibleCandidate() calls trim()`
- c0055 ..> c0229: `parseDecision() calls trim()`
- c0055 ..> c0229: `stringValue() calls trim()`
- c0055 ..> c0229: `strings() calls trim()`
- c0055 ..> c0238: `snapshotForPersistence() calls sanitizeCaptureSnapshot()`
- c0055 ..> c0242: `errorMessage() calls inspect()`
- c0057 --> c0058: `field instance`
- c0057 --> c0061: `field model`
- c0057 --> c0065: `field prompts`
- c0057 --> c0066: `field scopeSource`
- c0057 --> c0067: `field verbosity`
- c0057 --> c0070: `field captureMode`
- c0057 --> c0104: `field scope`
- c0057 --> c0179: `field logging`
- c0068 ..> c0047: `resolveLogDirectory() calls resolve()`
- c0068 ..> c0057: `type in loadForgetfulConfig`
- c0068 ..> c0059: `type in readJson`
- c0068 ..> c0059: `type in resolveScope`
- c0068 ..> c0060: `type in loadForgetfulConfig`
- c0068 ..> c0061: `type in modelToString`
- c0068 ..> c0061: `type in parseModel`
- c0068 ..> c0063: `type in resolveVerbosity`
- c0068 ..> c0063: `type in updateUserSettings`
- c0068 ..> c0065: `type in mergePrompts`
- c0068 ..> c0065: `type in readPromptDirectory`
- c0068 ..> c0066: `type in resolveScope`
- c0068 ..> c0067: `type in isVerbosity`
- c0068 ..> c0067: `type in resolveVerbosity`
- c0068 ..> c0068: `loadForgetfulConfig() calls asBoolean()`
- c0068 ..> c0068: `loadForgetfulConfig() calls asPositiveInteger()`
- c0068 ..> c0068: `loadForgetfulConfig() calls asString()`
- c0068 ..> c0068: `loadForgetfulConfig() calls defaultAgentDir()`
- c0068 ..> c0068: `loadForgetfulConfig() calls isFileLogLevel()`
- c0068 ..> c0068: `loadForgetfulConfig() calls isRecord()`
- c0068 ..> c0068: `loadForgetfulConfig() calls mergePrompts()`
- c0068 ..> c0068: `loadForgetfulConfig() calls parseModel()`
- c0068 ..> c0068: `loadForgetfulConfig() calls projectSettingsPath()`
- c0068 ..> c0068: `loadForgetfulConfig() calls readJson()`
- c0068 ..> c0068: `loadForgetfulConfig() calls readPromptDirectory()`
- c0068 ..> c0068: `loadForgetfulConfig() calls resolveCaptureMode()`
- c0068 ..> c0068: `loadForgetfulConfig() calls resolveContextLimit()`
- c0068 ..> c0068: `loadForgetfulConfig() calls resolveLogDirectory()`
- c0068 ..> c0068: `loadForgetfulConfig() calls resolveRecallConcurrency()`
- c0068 ..> c0068: `loadForgetfulConfig() calls resolveScope()`
- c0068 ..> c0068: `loadForgetfulConfig() calls resolveVerbosity()`
- c0068 ..> c0068: `loadForgetfulConfig() calls userSettingsPath()`
- c0068 ..> c0068: `parseModel() calls isRecord()`
- c0068 ..> c0068: `resolveRecallConcurrency() calls isRecallConcurrency()`
- c0068 ..> c0068: `resolveScope() calls isRecord()`
- c0068 ..> c0068: `resolveVerbosity() calls isVerbosity()`
- c0068 ..> c0068: `updateForgetfulConnection() calls isRecord()`
- c0068 ..> c0068: `updateForgetfulConnection() calls readJson()`
- c0068 ..> c0068: `updateForgetfulConnection() calls writeJson()`
- c0068 ..> c0068: `updateUserSettings() calls isRecord()`
- c0068 ..> c0068: `updateUserSettings() calls readJson()`
- c0068 ..> c0068: `updateUserSettings() calls writeJson()`
- c0068 ..> c0068: `userSettingsPath() calls defaultAgentDir()`
- c0068 ..> c0068: `writeProjectScope() calls projectSettingsPath()`
- c0068 ..> c0068: `writeProjectScope() calls writeJson()`
- c0068 ..> c0070: `type in resolveCaptureMode`
- c0068 ..> c0104: `type in resolveScope`
- c0068 ..> c0104: `type in writeProjectScope`
- c0068 ..> c0160: `readJson() calls readFile()`
- c0068 ..> c0160: `readPromptDirectory() calls readFile()`
- c0068 ..> c0179: `type in isFileLogLevel`
- c0068 ..> c0180: `writeJson() calls close()`
- c0068 ..> c0229: `asString() calls trim()`
- c0068 ..> c0229: `parseModel() calls trim()`
- c0068 ..> c0229: `readPromptDirectory() calls trim()`
- c0068 ..> c0229: `resolveLogDirectory() calls trim()`
- c0071 --> c0069: `field historySummary`
- c0071 --> c0070: `field mode`
- c0071 --> c0084: `field entries`
- c0071 --> c0104: `field scope`
- c0071 --> c0107: `field context`
- c0072 --|> c0073: `inherits`
- c0073 --|> c0103: `inherits`
- c0076 --|> c0077: `inherits`
- c0077 --|> c0103: `inherits`
- c0079 --|> c0080: `inherits`
- c0080 --> c0083: `field entity_type`
- c0080 --|> c0103: `inherits`
- c0081 --|> c0082: `inherits`
- c0082 --|> c0103: `inherits`
- c0086 --> c0087: `field knowledge`
- c0086 ..> c0089: `type in get`
- c0086 ..> c0089: `type in search`
- c0086 ..> c0090: `type in create`
- c0086 ..> c0091: `type in create`
- c0086 ..> c0093: `type in queryMemory`
- c0086 ..> c0101: `type in createProject`
- c0086 ..> c0101: `type in linkProject`
- c0086 ..> c0101: `type in listProjects`
- c0086 ..> c0102: `type in createProject`
- c0086 ..> c0105: `type in queryMemory`
- c0086 ..> c0105: `type in search`
- c0087 ..> c0072: `type in createCodeArtifact`
- c0087 ..> c0072: `type in getCodeArtifact`
- c0087 ..> c0072: `type in updateCodeArtifact`
- c0087 ..> c0073: `type in createCodeArtifact`
- c0087 ..> c0073: `type in updateCodeArtifact`
- c0087 ..> c0074: `type in listCodeArtifacts`
- c0087 ..> c0076: `type in createDocument`
- c0087 ..> c0076: `type in getDocument`
- c0087 ..> c0076: `type in updateDocument`
- c0087 ..> c0077: `type in createDocument`
- c0087 ..> c0077: `type in updateDocument`
- c0087 ..> c0078: `type in listDocuments`
- c0087 ..> c0079: `type in createEntity`
- c0087 ..> c0079: `type in getEntity`
- c0087 ..> c0079: `type in searchEntities`
- c0087 ..> c0079: `type in updateEntity`
- c0087 ..> c0080: `type in createEntity`
- c0087 ..> c0080: `type in updateEntity`
- c0087 ..> c0081: `type in createRelationship`
- c0087 ..> c0081: `type in getRelationships`
- c0087 ..> c0082: `type in createRelationship`
- c0087 ..> c0085: `type in listFiles`
- c0087 ..> c0089: `type in updateMemory`
- c0087 ..> c0091: `type in updateMemory`
- c0087 ..> c0106: `type in getFile`
- c0088 --> c0089: `field memory`
- c0089 --|> c0091: `inherits`
- c0092 ..> c0097: `type in complete`
- c0092 ..> c0097: `type in prepareCapture`
- c0093 --> c0088: `field linked_memories`
- c0093 --> c0089: `field primary_memories`
- c0097 --> c0075: `field onConversationCompacted`
- c0097 --> c0096: `field readTools`
- c0097 --> c0099: `field submission`
- c0106 --|> c0085: `inherits`
- c0107 --> c0101: `field project`
- c0111 --> c0108: `field outcome`
- c0111 --> c0112: `field state`
- c0113 ..> c0027: `type in checkpoint`
- c0113 ..> c0028: `type in checkpoint`
- c0113 ..> c0071: `type in enqueue`
- c0113 ..> c0084: `type in resolveConflict`
- c0116 --> c0101: `field projects`
- c0116 --|> c0107: `inherits`
- c0117 --> c0057: `field createCapture`
- c0117 --> c0057: `field createRecall`
- c0117 --> c0086: `field client`
- c0117 --> c0086: `field createCapture`
- c0117 --> c0086: `field createClient`
- c0117 --> c0086: `field createRecall`
- c0117 --> c0113: `field capture`
- c0117 --> c0113: `field createCapture`
- c0117 --> c0116: `field resolveWorkContext`
- c0117 --> c0125: `field createRecall`
- c0117 --> c0125: `field recall`
- c0117 --> c0192: `field createCapture`
- c0117 --> c0192: `field createRecall`
- c0118 --> c0060: `field config`
- c0118 --> c0117: `field dependencies`
- c0118 --> c0120: `field policies`
- c0121 --> c0057: `field config`
- c0121 --> c0086: `field client`
- c0121 --> c0116: `field context`
- c0121 --> c0125: `field recall`
- c0121 --> c0180: `field logger`
- c0121 --> c0192: `field model`
- c0122 --> c0104: `field scope`
- c0124 --> c0126: `field runtime`
- c0124 --> c0223: `field promise`
- c0124 --> c0223: `field result`
- c0125 ..> c0084: `type in recall`
- c0125 ..> c0220: `type in deeper`
- c0125 ..> c0222: `type in recall`
- c0125 ..> c0223: `type in deeper`
- c0125 ..> c0223: `type in recall`
- c0126 --> c0004: `field activity`
- c0126 --> c0025: `field captureDeferrals`
- c0126 --> c0028: `field recoveryResult`
- c0126 --> c0057: `field config`
- c0126 --> c0086: `field client`
- c0126 --> c0112: `field pendingCaptureJobs`
- c0126 --> c0113: `field capture`
- c0126 --> c0116: `field context`
- c0126 --> c0122: `field lastRecall`
- c0126 --> c0125: `field recall`
- c0126 --> c0180: `field logger`
- c0126 --> c0192: `field model`
- c0126 --> c0200: `field queue`
- c0128 --> c0109: `field automaticRecalls`
- c0128 --> c0119: `field pendingQueuedRecall`
- c0128 --> c0124: `field recallJobs`
- c0128 --> c0126: `field loading`
- c0128 --> c0126: `field runtime`
- c0129 ..> c0004: `collectCaptureFeedback() calls set()`
- c0129 ..> c0004: `diagnosticCandidateDetail() calls set()`
- c0129 ..> c0004: `pickMemoryModel() calls refresh()`
- c0129 ..> c0028: `type in captureProcessedJobIds`
- c0129 ..> c0028: `type in readCaptureOutcome`
- c0129 ..> c0047: `log() calls emit()`
- c0129 ..> c0047: `logFailure() calls emit()`
- c0129 ..> c0047: `readCaptureOutcome() calls diagnostics()`
- c0129 ..> c0047: `recordRecallActivity() calls emit()`
- c0129 ..> c0047: `textMessage() calls now()`
- c0129 ..> c0057: `type in log`
- c0129 ..> c0057: `type in logFailure`
- c0129 ..> c0057: `type in makeInstanceId`
- c0129 ..> c0057: `type in policyText`
- c0129 ..> c0057: `type in promptSetupEndpoint`
- c0129 ..> c0061: `type in parseSelection`
- c0129 ..> c0067: `type in log`
- c0129 ..> c0084: `type in recallContextEntries`
- c0129 ..> c0108: `type in automaticCaptureJobOutcome`
- c0129 ..> c0108: `type in readCaptureOutcome`
- c0129 ..> c0108: `type in recordCaptureRetry`
- c0129 ..> c0110: `type in boundedWait`
- c0129 ..> c0111: `type in automaticCaptureFeedback`
- c0129 ..> c0111: `type in collectCaptureFeedback`
- c0129 ..> c0111: `type in recordCaptureRetry`
- c0129 ..> c0113: `type in readCaptureOutcome`
- c0129 ..> c0115: `type in collectDiagnosticParts`
- c0129 ..> c0116: `type in defaultWorkContext`
- c0129 ..> c0116: `type in discoverWorkContext`
- c0129 ..> c0116: `type in snapshotWorkContext`
- c0129 ..> c0118: `type in createForgetfulExtension`
- c0129 ..> c0120: `type in policyText`
- c0129 ..> c0122: `type in recallActivitySummary`
- c0129 ..> c0126: `type in conflictBelongsToActiveBranch`
- c0129 ..> c0126: `type in readCaptureOutcome`
- c0129 ..> c0126: `type in recordRecallActivity`
- c0129 ..> c0127: `type in promptSetupAuthentication`
- c0129 ..> c0129: `automaticCaptureFeedback() calls captureCount()`
- c0129 ..> c0129: `automaticCaptureFeedback() calls captureFeedbackParts()`
- c0129 ..> c0129: `automaticCaptureFeedback() calls collectCaptureFeedback()`
- c0129 ..> c0129: `automaticCaptureJobOutcome() calls boundedErrorDiagnostic()`
- c0129 ..> c0129: `automaticCaptureJobOutcome() calls captureFeedbackReason()`
- c0129 ..> c0129: `automaticRecallTerminalText() calls usefulRecallText()`
- c0129 ..> c0129: `canonicalRepository() calls qualifiedRepository()`
- c0129 ..> c0129: `captureFailurePart() calls captureCount()`
- c0129 ..> c0129: `captureFeedbackParts() calls captureCount()`
- c0129 ..> c0129: `captureFeedbackParts() calls captureFailurePart()`
- c0129 ..> c0129: `captureFeedbackParts() calls skippedReasonBreakdown()`
- c0129 ..> c0129: `collectCaptureFeedback() calls recordCaptureRetry()`
- c0129 ..> c0129: `collectDiagnosticParts() calls diagnosticCandidateDetail()`
- c0129 ..> c0129: `createForgetfulExtension() calls logFailure()`
- c0129 ..> c0129: `createForgetfulExtension() calls notify()`
- c0129 ..> c0129: `createForgetfulExtension() calls sessionKey()`
- c0129 ..> c0129: `diagnosticCandidateDetail() calls diagnosticSourceIds()`
- c0129 ..> c0129: `diagnosticSummary() calls collectDiagnosticParts()`
- c0129 ..> c0129: `discoverWorkContext() calls canonicalRepository()`
- c0129 ..> c0129: `discoverWorkContext() calls defaultWorkContext()`
- c0129 ..> c0129: `latestBranchUserEntry() calls messageContentText()`
- c0129 ..> c0129: `latestContextUserPrompt() calls messageContentText()`
- c0129 ..> c0129: `log() calls notify()`
- c0129 ..> c0129: `logFailure() calls boundedErrorDiagnostic()`
- c0129 ..> c0129: `logFailure() calls log()`
- c0129 ..> c0129: `pickMemoryModel() calls parseSelection()`
- c0129 ..> c0129: `promptSetupAuthentication() calls notify()`
- c0129 ..> c0129: `promptSetupEndpoint() calls notify()`
- c0129 ..> c0129: `promptSetupEndpoint() calls setupEndpointSuggestion()`
- c0129 ..> c0129: `readCaptureOutcome() calls automaticCaptureJobOutcome()`
- c0129 ..> c0129: `recallContextEntries() calls messageContentText()`
- c0129 ..> c0129: `recordRecallActivity() calls log()`
- c0129 ..> c0129: `recordRecallActivity() calls recallActivitySummary()`
- c0129 ..> c0129: `savedRecallResultText() calls usefulRecallText()`
- c0129 ..> c0130: `createForgetfulExtension() calls registerForegroundTool()`
- c0129 ..> c0134: `collectCaptureFeedback() calls get()`
- c0129 ..> c0134: `diagnosticCandidateDetail() calls get()`
- c0129 ..> c0134: `log() calls get()`
- c0129 ..> c0134: `logFailure() calls get()`
- c0129 ..> c0195: `pickMemoryModel() calls availableMemoryModels()`
- c0129 ..> c0195: `pickMemoryModel() calls modelLabel()`
- c0129 ..> c0195: `pickMemoryModel() calls modelSelectionFromModel()`
- c0129 ..> c0196: `automaticCaptureJobOutcome() calls sanitizeText()`
- c0129 ..> c0196: `automaticRecallTerminalText() calls sanitizeText()`
- c0129 ..> c0196: `boundedErrorDiagnostic() calls sanitizeText()`
- c0129 ..> c0196: `captureFeedbackReason() calls sanitizeText()`
- c0129 ..> c0196: `captureJobId() calls sanitizeText()`
- c0129 ..> c0196: `captureProcessedJobIds() calls sanitizeText()`
- c0129 ..> c0196: `diagnosticCandidateDetail() calls sanitizeText()`
- c0129 ..> c0196: `diagnosticSourceIds() calls sanitizeText()`
- c0129 ..> c0196: `log() calls sanitizeText()`
- c0129 ..> c0196: `recallActivitySummary() calls sanitizeText()`
- c0129 ..> c0196: `recallContextEntries() calls sanitizeText()`
- c0129 ..> c0196: `recordRecallActivity() calls sanitizeText()`
- c0129 ..> c0196: `usefulRecallText() calls sanitizeText()`
- c0129 ..> c0223: `type in automaticRecallResultStatus`
- c0129 ..> c0223: `type in automaticRecallTerminalText`
- c0129 ..> c0223: `type in recordRecallActivity`
- c0129 ..> c0223: `type in savedRecallResultText`
- c0129 ..> c0223: `type in usefulRecallText`
- c0129 ..> c0229: `canonicalRepository() calls trim()`
- c0129 ..> c0229: `captureFeedbackReason() calls trim()`
- c0129 ..> c0229: `createForgetfulExtension() calls trim()`
- c0129 ..> c0229: `promptSetupAuthentication() calls trim()`
- c0129 ..> c0229: `promptSetupEndpoint() calls trim()`
- c0129 ..> c0229: `recallContextEntries() calls trim()`
- c0129 ..> c0229: `setupEndpointSuggestion() calls trim()`
- c0129 ..> c0229: `usefulRecallText() calls trim()`
- c0129 ..> c0230: `qualifiedRepository() calls repositoryName()`
- c0131 ..> c0072: `type in createCodeArtifact`
- c0131 ..> c0072: `type in getCodeArtifact`
- c0131 ..> c0073: `type in createCodeArtifact`
- c0131 ..> c0073: `type in updateCodeArtifact`
- c0131 ..> c0074: `type in listCodeArtifacts`
- c0131 ..> c0076: `type in createDocument`
- c0131 ..> c0076: `type in getDocument`
- c0131 ..> c0077: `type in createDocument`
- c0131 ..> c0077: `type in updateDocument`
- c0131 ..> c0078: `type in listDocuments`
- c0131 ..> c0079: `type in createEntity`
- c0131 ..> c0079: `type in getEntity`
- c0131 ..> c0079: `type in searchEntities`
- c0131 ..> c0080: `type in createEntity`
- c0131 ..> c0080: `type in updateEntity`
- c0131 ..> c0081: `type in getRelationships`
- c0131 ..> c0082: `type in createRelationship`
- c0131 ..> c0085: `type in listFiles`
- c0131 ..|> c0087: `implements`
- c0131 --> c0089: `field parseMemory`
- c0131 ..> c0089: `type in constructor`
- c0131 ..> c0091: `type in updateMemory`
- c0131 ..> c0106: `type in getFile`
- c0131 --> c0132: `field request`
- c0131 ..> c0132: `type in constructor`
- c0131 ..> c0133: `createCodeArtifact() calls artifact()`
- c0131 ..> c0133: `createDocument() calls document()`
- c0131 ..> c0133: `createEntity() calls entity()`
- c0131 ..> c0133: `createRelationship() calls relationship()`
- c0131 ..> c0133: `createRelationship() calls requestSegment()`
- c0131 ..> c0133: `getCodeArtifact() calls artifact()`
- c0131 ..> c0133: `getCodeArtifact() calls requestSegment()`
- c0131 ..> c0133: `getDocument() calls document()`
- c0131 ..> c0133: `getDocument() calls requestSegment()`
- c0131 ..> c0133: `getEntity() calls entity()`
- c0131 ..> c0133: `getEntity() calls requestSegment()`
- c0131 ..> c0133: `getEntityMemories() calls id()`
- c0131 ..> c0133: `getEntityMemories() calls object()`
- c0131 ..> c0133: `getEntityMemories() calls records()`
- c0131 ..> c0133: `getEntityMemories() calls requestSegment()`
- c0131 ..> c0133: `getEntityMemories() calls text()`
- c0131 ..> c0133: `getFile() calls fileSummary()`
- c0131 ..> c0133: `getFile() calls object()`
- c0131 ..> c0133: `getFile() calls requestSegment()`
- c0131 ..> c0133: `getFile() calls text()`
- c0131 ..> c0133: `getRelationships() calls records()`
- c0131 ..> c0133: `getRelationships() calls requestSegment()`
- c0131 ..> c0133: `linkEntityMemory() calls object()`
- c0131 ..> c0133: `linkEntityMemory() calls requestSegment()`
- c0131 ..> c0133: `linkMemories() calls ids()`
- c0131 ..> c0133: `linkMemories() calls object()`
- c0131 ..> c0133: `linkMemories() calls requestSegment()`
- c0131 ..> c0133: `listCodeArtifacts() calls projectPath()`
- c0131 ..> c0133: `listCodeArtifacts() calls records()`
- c0131 ..> c0133: `listCodeArtifacts() calls summary()`
- c0131 ..> c0133: `listDocuments() calls projectPath()`
- c0131 ..> c0133: `listDocuments() calls records()`
- c0131 ..> c0133: `listDocuments() calls summary()`
- c0131 ..> c0133: `listFiles() calls projectPath()`
- c0131 ..> c0133: `listFiles() calls records()`
- c0131 ..> c0133: `searchEntities() calls records()`
- c0131 ..> c0133: `unlinkMemories() calls object()`
- c0131 ..> c0133: `unlinkMemories() calls requestSegment()`
- c0131 ..> c0133: `updateCodeArtifact() calls artifact()`
- c0131 ..> c0133: `updateCodeArtifact() calls requestSegment()`
- c0131 ..> c0133: `updateDocument() calls document()`
- c0131 ..> c0133: `updateDocument() calls requestSegment()`
- c0131 ..> c0133: `updateEntity() calls entity()`
- c0131 ..> c0133: `updateEntity() calls requestSegment()`
- c0131 ..> c0133: `updateMemory() calls requestSegment()`
- c0131 ..> c0134: `createCodeArtifact() calls request()`
- c0131 ..> c0134: `createDocument() calls request()`
- c0131 ..> c0134: `createEntity() calls request()`
- c0131 ..> c0134: `createRelationship() calls request()`
- c0131 ..> c0134: `getCodeArtifact() calls request()`
- c0131 ..> c0134: `getDocument() calls request()`
- c0131 ..> c0134: `getEntity() calls request()`
- c0131 ..> c0134: `getEntityMemories() calls request()`
- c0131 ..> c0134: `getFile() calls request()`
- c0131 ..> c0134: `getRelationships() calls request()`
- c0131 ..> c0134: `linkEntityMemory() calls request()`
- c0131 ..> c0134: `linkMemories() calls request()`
- c0131 ..> c0134: `listCodeArtifacts() calls request()`
- c0131 ..> c0134: `listDocuments() calls request()`
- c0131 ..> c0134: `listFiles() calls request()`
- c0131 ..> c0134: `searchEntities() calls request()`
- c0131 ..> c0134: `unlinkMemories() calls request()`
- c0131 ..> c0134: `updateCodeArtifact() calls request()`
- c0131 ..> c0134: `updateDocument() calls request()`
- c0131 ..> c0134: `updateEntity() calls request()`
- c0131 ..> c0134: `updateMemory() calls request()`
- c0131 ..> c0138: `getFile() constructs ForgetfulSchemaError`
- c0131 ..> c0138: `linkEntityMemory() constructs ForgetfulSchemaError`
- c0131 ..> c0138: `linkMemories() constructs ForgetfulSchemaError`
- c0131 ..> c0138: `unlinkMemories() constructs ForgetfulSchemaError`
- c0131 ..> c0140: `linkMemories() calls parseMemory()`
- c0131 ..> c0140: `updateMemory() calls parseMemory()`
- c0133 ..> c0072: `type in artifact`
- c0133 ..> c0073: `type in resourceBody`
- c0133 ..> c0074: `type in summary`
- c0133 ..> c0076: `type in document`
- c0133 ..> c0077: `type in resourceBody`
- c0133 ..> c0078: `type in summary`
- c0133 ..> c0079: `type in entity`
- c0133 ..> c0080: `type in entityBody`
- c0133 ..> c0081: `type in relationship`
- c0133 ..> c0082: `type in relationshipBody`
- c0133 ..> c0085: `type in fileSummary`
- c0133 ..> c0103: `type in provenance`
- c0133 ..> c0133: `artifact() calls id()`
- c0133 ..> c0133: `artifact() calls object()`
- c0133 ..> c0133: `artifact() calls resourceBody()`
- c0133 ..> c0133: `document() calls id()`
- c0133 ..> c0133: `document() calls object()`
- c0133 ..> c0133: `document() calls resourceBody()`
- c0133 ..> c0133: `entity() calls entityBody()`
- c0133 ..> c0133: `entity() calls id()`
- c0133 ..> c0133: `entity() calls object()`
- c0133 ..> c0133: `entityBody() calls ids()`
- c0133 ..> c0133: `entityBody() calls object()`
- c0133 ..> c0133: `entityBody() calls provenance()`
- c0133 ..> c0133: `entityBody() calls strings()`
- c0133 ..> c0133: `entityBody() calls text()`
- c0133 ..> c0133: `fileSummary() calls id()`
- c0133 ..> c0133: `fileSummary() calls object()`
- c0133 ..> c0133: `fileSummary() calls strings()`
- c0133 ..> c0133: `fileSummary() calls text()`
- c0133 ..> c0133: `memoryMetadata() calls ids()`
- c0133 ..> c0133: `memoryMetadata() calls provenance()`
- c0133 ..> c0133: `provenance() calls strings()`
- c0133 ..> c0133: `provenance() calls text()`
- c0133 ..> c0133: `records() calls object()`
- c0133 ..> c0133: `relationship() calls id()`
- c0133 ..> c0133: `relationship() calls object()`
- c0133 ..> c0133: `relationship() calls relationshipBody()`
- c0133 ..> c0133: `relationshipBody() calls id()`
- c0133 ..> c0133: `relationshipBody() calls object()`
- c0133 ..> c0133: `relationshipBody() calls provenance()`
- c0133 ..> c0133: `relationshipBody() calls text()`
- c0133 ..> c0133: `resourceBody() calls id()`
- c0133 ..> c0133: `resourceBody() calls object()`
- c0133 ..> c0133: `resourceBody() calls provenance()`
- c0133 ..> c0133: `resourceBody() calls strings()`
- c0133 ..> c0133: `resourceBody() calls text()`
- c0133 ..> c0133: `summary() calls id()`
- c0133 ..> c0133: `summary() calls object()`
- c0133 ..> c0133: `summary() calls provenance()`
- c0133 ..> c0133: `summary() calls strings()`
- c0133 ..> c0133: `summary() calls text()`
- c0133 ..> c0138: `entityBody() constructs ForgetfulSchemaError`
- c0133 ..> c0138: `fileSummary() constructs ForgetfulSchemaError`
- c0133 ..> c0138: `id() constructs ForgetfulSchemaError`
- c0133 ..> c0138: `ids() constructs ForgetfulSchemaError`
- c0133 ..> c0138: `object() constructs ForgetfulSchemaError`
- c0133 ..> c0138: `records() constructs ForgetfulSchemaError`
- c0133 ..> c0138: `strings() constructs ForgetfulSchemaError`
- c0133 ..> c0138: `text() constructs ForgetfulSchemaError`
- c0133 ..> c0229: `text() calls trim()`
- c0134 ..> c0004: `listProjects() calls set()`
- c0134 ..> c0004: `readResponse() calls set()`
- c0134 ..> c0047: `readResponse() calls read()`
- c0134 ..|> c0086: `implements`
- c0134 ..> c0089: `type in get`
- c0134 ..> c0089: `type in search`
- c0134 ..> c0090: `type in create`
- c0134 ..> c0091: `type in create`
- c0134 ..> c0093: `type in queryMemory`
- c0134 ..> c0101: `type in createProject`
- c0134 ..> c0101: `type in linkProject`
- c0134 ..> c0101: `type in listProjects`
- c0134 ..> c0102: `type in createProject`
- c0134 ..> c0105: `type in queryMemory`
- c0134 ..> c0105: `type in search`
- c0134 ..> c0133: `get() calls requestSegment()`
- c0134 ..> c0133: `getMemoryEntityIds() calls requestSegment()`
- c0134 ..> c0133: `obsolete() calls requestSegment()`
- c0134 ..> c0134: `create() calls request()`
- c0134 ..> c0134: `createProject() calls request()`
- c0134 ..> c0134: `get() calls request()`
- c0134 ..> c0134: `getMemoryEntityIds() calls request()`
- c0134 ..> c0134: `linkProject() calls request()`
- c0134 ..> c0134: `linkProject() calls validId()`
- c0134 ..> c0134: `listProjects() calls endpoint()`
- c0134 ..> c0134: `listProjects() calls request()`
- c0134 ..> c0134: `obsolete() calls request()`
- c0134 ..> c0134: `queryMemory() calls request()`
- c0134 ..> c0134: `readResponse() calls get()`
- c0134 ..> c0134: `request() calls endpoint()`
- c0134 ..> c0134: `request() calls fetchImpl()`
- c0134 ..> c0134: `request() calls readResponse()`
- c0134 ..> c0134: `request() calls responseByteLimit()`
- c0134 ..> c0134: `request() calls throwResponseError()`
- c0134 ..> c0134: `search() calls request()`
- c0134 ..> c0134: `supersede() calls obsolete()`
- c0134 ..> c0134: `throwResponseError() calls readResponse()`
- c0134 ..> c0135: `type in constructor`
- c0134 ..> c0137: `throwResponseError() constructs ForgetfulHttpError`
- c0134 ..> c0138: `create() constructs ForgetfulSchemaError`
- c0134 ..> c0138: `getMemoryEntityIds() constructs ForgetfulSchemaError`
- c0134 ..> c0138: `listProjects() constructs ForgetfulSchemaError`
- c0134 ..> c0138: `obsolete() constructs ForgetfulSchemaError`
- c0134 ..> c0138: `readResponse() constructs ForgetfulSchemaError`
- c0134 ..> c0139: `request() constructs ForgetfulTimeoutError`
- c0134 ..> c0140: `constructor() calls localHost()`
- c0134 ..> c0140: `constructor() calls trimTrailingSlashes()`
- c0134 ..> c0140: `create() calls integerArray()`
- c0134 ..> c0140: `create() calls isObject()`
- c0134 ..> c0140: `create() calls requiredInteger()`
- c0134 ..> c0140: `createProject() calls parseProject()`
- c0134 ..> c0140: `createProject() calls projectText()`
- c0134 ..> c0140: `get() calls parseMemory()`
- c0134 ..> c0140: `getMemoryEntityIds() calls directEntityId()`
- c0134 ..> c0140: `getMemoryEntityIds() calls isObject()`
- c0134 ..> c0140: `linkProject() calls parseProject()`
- c0134 ..> c0140: `listProjects() calls isObject()`
- c0134 ..> c0140: `listProjects() calls parseProject()`
- c0134 ..> c0140: `obsolete() calls isObject()`
- c0134 ..> c0140: `queryMemory() calls defaultWhenOmitted()`
- c0134 ..> c0140: `queryMemory() calls parseSearchPayload()`
- c0134 ..> c0140: `queryMemory() calls searchBody()`
- c0134 ..> c0140: `request() calls makeAbortError()`
- c0134 ..> c0140: `request() calls parseJson()`
- c0134 ..> c0140: `search() calls flattenSearchResult()`
- c0134 ..> c0140: `search() calls parseSearchPayload()`
- c0134 ..> c0140: `search() calls searchBody()`
- c0134 ..> c0200: `readResponse() calls cancel()`
- c0134 ..> c0230: `createProject() calls repositoryName()`
- c0134 ..> c0230: `linkProject() calls repositoryName()`
- c0140 ..> c0004: `uniqueMemories() calls set()`
- c0140 ..> c0088: `type in parseLinkedMemories`
- c0140 ..> c0089: `type in flattenSearchResult`
- c0140 ..> c0089: `type in parseMemory`
- c0140 ..> c0089: `type in uniqueMemories`
- c0140 ..> c0093: `type in flattenSearchResult`
- c0140 ..> c0093: `type in parseSearchPayload`
- c0140 ..> c0101: `type in parseProject`
- c0140 ..> c0105: `type in searchBody`
- c0140 ..> c0133: `parseMemory() calls memoryMetadata()`
- c0140 ..> c0136: `makeAbortError() constructs ForgetfulAbortError`
- c0140 ..> c0136: `type in makeAbortError`
- c0140 ..> c0138: `directEntityId() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `integerArray() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `nonNegativeInteger() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `optionalString() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `parseJson() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `parseLinkedMemories() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `parseMemory() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `parseProject() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `parseSearchPayload() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `requiredInteger() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `requiredString() constructs ForgetfulSchemaError`
- c0140 ..> c0138: `stringArray() constructs ForgetfulSchemaError`
- c0140 ..> c0140: `directEntityId() calls isObject()`
- c0140 ..> c0140: `directEntityId() calls requiredInteger()`
- c0140 ..> c0140: `flattenSearchResult() calls uniqueMemories()`
- c0140 ..> c0140: `parseLinkedMemories() calls isObject()`
- c0140 ..> c0140: `parseLinkedMemories() calls parseMemory()`
- c0140 ..> c0140: `parseLinkedMemories() calls requiredInteger()`
- c0140 ..> c0140: `parseMemory() calls integerArray()`
- c0140 ..> c0140: `parseMemory() calls isObject()`
- c0140 ..> c0140: `parseMemory() calls nonNegativeInteger()`
- c0140 ..> c0140: `parseMemory() calls optionalString()`
- c0140 ..> c0140: `parseMemory() calls requiredInteger()`
- c0140 ..> c0140: `parseMemory() calls requiredString()`
- c0140 ..> c0140: `parseMemory() calls stringArray()`
- c0140 ..> c0140: `parseProject() calls isObject()`
- c0140 ..> c0140: `parseProject() calls optionalString()`
- c0140 ..> c0140: `parseProject() calls requiredInteger()`
- c0140 ..> c0140: `parseProject() calls requiredString()`
- c0140 ..> c0140: `parseSearchPayload() calls isObject()`
- c0140 ..> c0140: `parseSearchPayload() calls nonNegativeInteger()`
- c0140 ..> c0140: `parseSearchPayload() calls parseLinkedMemories()`
- c0140 ..> c0140: `parseSearchPayload() calls parseMemory()`
- c0140 ..> c0140: `parseSearchPayload() calls requiredString()`
- c0140 ..> c0140: `searchBody() calls defaultWhenOmitted()`
- c0140 ..> c0229: `projectText() calls trim()`
- c0141 --> c0072: `field artifacts`
- c0141 --> c0076: `field documents`
- c0141 --> c0085: `field files`
- c0142 --|> c0143: `inherits`
- c0142 --> c0144: `field failures`
- c0143 --> c0089: `field memories`
- c0143 --> c0104: `field scope`
- c0145 ..> c0004: `collectRelationships() calls set()`
- c0145 ..> c0004: `findEntities() calls set()`
- c0145 ..> c0004: `resolveRelationshipEndpoints() calls set()`
- c0145 ..> c0072: `type in appendArtifactLines`
- c0145 ..> c0076: `type in appendDocumentLines`
- c0145 ..> c0079: `type in appendEntityLines`
- c0145 ..> c0079: `type in collectEntityMemories`
- c0145 ..> c0079: `type in collectRelationships`
- c0145 ..> c0079: `type in findEntities`
- c0145 ..> c0079: `type in findEntityMemories`
- c0145 ..> c0079: `type in findRelationships`
- c0145 ..> c0079: `type in formatExpansion`
- c0145 ..> c0079: `type in formatRelationships`
- c0145 ..> c0079: `type in resolveRelationshipEndpoints`
- c0145 ..> c0081: `type in collectRelationships`
- c0145 ..> c0081: `type in formatRelationships`
- c0145 ..> c0081: `type in resolveRelationshipEndpoints`
- c0145 ..> c0085: `type in appendFileLines`
- c0145 --> c0087: `field client`
- c0145 ..> c0087: `type in constructor`
- c0145 ..> c0131: `collectRelationships() calls getRelationships()`
- c0145 ..> c0131: `findAttachments() calls getCodeArtifact()`
- c0145 ..> c0131: `findAttachments() calls getDocument()`
- c0145 ..> c0131: `findAttachments() calls listFiles()`
- c0145 ..> c0131: `findEntities() calls getEntity()`
- c0145 ..> c0131: `findEntities() calls searchEntities()`
- c0145 ..> c0131: `findEntityMemories() calls getEntityMemories()`
- c0145 ..> c0131: `resolveRelationshipEndpoints() calls getEntity()`
- c0145 ..> c0134: `formatRelationships() calls get()`
- c0145 ..> c0141: `type in findAttachments`
- c0145 ..> c0141: `type in formatExpansion`
- c0145 ..> c0142: `type in collectEntityMemories`
- c0145 ..> c0142: `type in collectRelationships`
- c0145 ..> c0142: `type in findAttachments`
- c0145 ..> c0142: `type in findEntities`
- c0145 ..> c0142: `type in findEntityMemories`
- c0145 ..> c0142: `type in findRelationships`
- c0145 ..> c0142: `type in isAllowedEntityMemory`
- c0145 ..> c0142: `type in resolveRelationshipEndpoints`
- c0145 ..> c0143: `type in expand`
- c0145 ..> c0143: `type in formatRelationships`
- c0145 ..> c0144: `type in emptyExpansion`
- c0145 ..> c0144: `type in expand`
- c0145 ..> c0144: `type in formatExpansion`
- c0145 ..> c0145: `collectEntityMemories() calls isAllowedEntityMemory()`
- c0145 ..> c0145: `expand() calls emptyExpansion()`
- c0145 ..> c0145: `expand() calls findAttachments()`
- c0145 ..> c0145: `expand() calls findEntities()`
- c0145 ..> c0145: `expand() calls findEntityMemories()`
- c0145 ..> c0145: `expand() calls findRelationships()`
- c0145 ..> c0145: `expand() calls formatExpansion()`
- c0145 ..> c0145: `findEntityMemories() calls collectEntityMemories()`
- c0145 ..> c0145: `findRelationships() calls collectRelationships()`
- c0145 ..> c0145: `findRelationships() calls formatRelationships()`
- c0145 ..> c0145: `findRelationships() calls resolveRelationshipEndpoints()`
- c0145 ..> c0145: `formatExpansion() calls appendArtifactLines()`
- c0145 ..> c0145: `formatExpansion() calls appendDocumentLines()`
- c0145 ..> c0145: `formatExpansion() calls appendEntityLines()`
- c0145 ..> c0145: `formatExpansion() calls appendFileLines()`
- c0145 ..> c0145: `formatExpansion() calls appendLinkedMemoryLines()`
- c0145 ..> c0145: `formatExpansion() calls appendRelationshipLines()`
- c0145 ..> c0146: `type in constructor`
- c0145 ..> c0147: `type in appendLinkedMemoryLines`
- c0145 ..> c0147: `type in collectEntityMemories`
- c0145 ..> c0147: `type in findEntityMemories`
- c0145 ..> c0147: `type in formatExpansion`
- c0145 --> c0148: `field readMemory`
- c0145 ..> c0148: `type in constructor`
- c0145 ..> c0149: `type in appendRelationshipLines`
- c0145 ..> c0149: `type in findRelationships`
- c0145 ..> c0149: `type in formatExpansion`
- c0145 ..> c0149: `type in formatRelationships`
- c0145 ..> c0150: `appendArtifactLines() calls clean()`
- c0145 ..> c0150: `appendDocumentLines() calls clean()`
- c0145 ..> c0150: `appendEntityLines() calls clean()`
- c0145 ..> c0150: `appendFileLines() calls clean()`
- c0145 ..> c0150: `appendLinkedMemoryLines() calls clean()`
- c0145 ..> c0150: `appendRelationshipLines() calls clean()`
- c0145 ..> c0150: `collectEntityMemories() calls validId()`
- c0145 ..> c0150: `collectRelationships() calls safeCall()`
- c0145 ..> c0150: `collectRelationships() calls validRelationship()`
- c0145 ..> c0150: `expand() calls safeCall()`
- c0145 ..> c0150: `findAttachments() calls inProjectScope()`
- c0145 ..> c0150: `findAttachments() calls safeCall()`
- c0145 ..> c0150: `findAttachments() calls validId()`
- c0145 ..> c0150: `findEntities() calls inEntityScope()`
- c0145 ..> c0150: `findEntities() calls safeCall()`
- c0145 ..> c0150: `findEntities() calls validEntity()`
- c0145 ..> c0150: `findEntityMemories() calls safeCall()`
- c0145 ..> c0150: `formatRelationships() calls inEntityScope()`
- c0145 ..> c0150: `isAllowedEntityMemory() calls safeCall()`
- c0145 ..> c0150: `isAllowedEntityMemory() calls validMemory()`
- c0145 ..> c0150: `resolveRelationshipEndpoints() calls safeCall()`
- c0145 ..> c0150: `resolveRelationshipEndpoints() calls validEntity()`
- c0145 ..> c0196: `expand() calls errorMessage()`
- c0145 ..> c0229: `findEntities() calls trim()`
- c0146 --> c0148: `field readMemory`
- c0147 --> c0079: `field entity`
- c0149 --> c0079: `field source`
- c0149 --> c0079: `field target`
- c0149 --> c0081: `field relationship`
- c0150 ..> c0079: `type in inEntityScope`
- c0150 ..> c0079: `type in validEntity`
- c0150 ..> c0081: `type in validRelationship`
- c0150 ..> c0089: `type in validMemory`
- c0150 ..> c0104: `type in inEntityScope`
- c0150 ..> c0104: `type in inProjectScope`
- c0150 ..> c0142: `type in safeCall`
- c0150 ..> c0150: `inEntityScope() calls validId()`
- c0150 ..> c0150: `inProjectScope() calls validId()`
- c0150 ..> c0150: `validEntity() calls validId()`
- c0150 ..> c0150: `validMemory() calls validId()`
- c0150 ..> c0150: `validRelationship() calls validId()`
- c0150 ..> c0196: `clean() calls sanitizeText()`
- c0150 ..> c0196: `safeCall() calls errorMessage()`
- c0150 ..> c0196: `safeCall() calls sanitizeText()`
- c0150 ..> c0229: `validRelationship() calls trim()`
- c0151 --> c0086: `field client`
- c0151 --> c0087: `field knowledge`
- c0151 --> c0152: `field request`
- c0151 --> c0153: `field context`
- c0153 --> c0104: `field scope`
- c0154 --> c0106: `field file`
- c0154 --> c0158: `field content`
- c0154 --> c0159: `field content`
- c0155 --> c0086: `field client`
- c0155 --> c0087: `field knowledge`
- c0155 --> c0153: `field context`
- c0155 --> c0156: `field request`
- c0160 ..> c0072: `type in page`
- c0160 ..> c0076: `type in page`
- c0160 ..> c0079: `type in assertReadEntity`
- c0160 ..> c0079: `type in entityInProject`
- c0160 ..> c0079: `type in hydrateEntities`
- c0160 ..> c0079: `type in inEntityProject`
- c0160 ..> c0083: `type in isEntityType`
- c0160 ..> c0086: `type in assertReadMemory`
- c0160 ..> c0086: `type in createMemory`
- c0160 ..> c0086: `type in executeKnowledgeRead`
- c0160 ..> c0086: `type in executeKnowledgeWrite`
- c0160 ..> c0086: `type in memoryInProject`
- c0160 ..> c0086: `type in resolveWriteProject`
- c0160 ..> c0086: `type in rich`
- c0160 ..> c0087: `type in assertReadEntity`
- c0160 ..> c0087: `type in createCodeArtifact`
- c0160 ..> c0087: `type in createDocument`
- c0160 ..> c0087: `type in createEntity`
- c0160 ..> c0087: `type in entityInProject`
- c0160 ..> c0087: `type in hydrateEntities`
- c0160 ..> c0087: `type in requireReadKnowledge`
- c0160 ..> c0087: `type in rich`
- c0160 ..> c0087: `type in validateAttachments`
- c0160 ..> c0089: `type in assertReadMemory`
- c0160 ..> c0089: `type in inMemoryProject`
- c0160 ..> c0089: `type in memoryInProject`
- c0160 ..> c0089: `type in replacementMemory`
- c0160 ..> c0103: `type in updateProvenance`
- c0160 ..> c0106: `type in fileContent`
- c0160 ..> c0131: `assertReadEntity() calls getEntity()`
- c0160 ..> c0131: `createCodeArtifact() calls createCodeArtifact()`
- c0160 ..> c0131: `createDocument() calls createDocument()`
- c0160 ..> c0131: `createEntity() calls createEntity()`
- c0160 ..> c0131: `createRelationship() calls createRelationship()`
- c0160 ..> c0131: `entityInProject() calls getEntity()`
- c0160 ..> c0131: `hydrateEntities() calls getEntity()`
- c0160 ..> c0131: `linkEntityMemory() calls linkEntityMemory()`
- c0160 ..> c0131: `linkMemories() calls linkMemories()`
- c0160 ..> c0131: `readCodeArtifact() calls getCodeArtifact()`
- c0160 ..> c0131: `readCodeArtifacts() calls listCodeArtifacts()`
- c0160 ..> c0131: `readDocument() calls getDocument()`
- c0160 ..> c0131: `readDocuments() calls listDocuments()`
- c0160 ..> c0131: `readEntities() calls searchEntities()`
- c0160 ..> c0131: `readEntityMemories() calls getEntityMemories()`
- c0160 ..> c0131: `readFile() calls getFile()`
- c0160 ..> c0131: `readFiles() calls listFiles()`
- c0160 ..> c0131: `readRelationships() calls getEntity()`
- c0160 ..> c0131: `readRelationships() calls getRelationships()`
- c0160 ..> c0131: `updateCodeArtifact() calls getCodeArtifact()`
- c0160 ..> c0131: `updateCodeArtifact() calls updateCodeArtifact()`
- c0160 ..> c0131: `updateDocument() calls getDocument()`
- c0160 ..> c0131: `updateDocument() calls updateDocument()`
- c0160 ..> c0131: `updateEntity() calls updateEntity()`
- c0160 ..> c0131: `updateMemory() calls updateMemory()`
- c0160 ..> c0131: `validateAttachments() calls getCodeArtifact()`
- c0160 ..> c0131: `validateAttachments() calls getDocument()`
- c0160 ..> c0131: `validateAttachments() calls getFile()`
- c0160 ..> c0134: `assertReadMemory() calls get()`
- c0160 ..> c0134: `createMemory() calls create()`
- c0160 ..> c0134: `memoryInProject() calls get()`
- c0160 ..> c0134: `readEntityMemories() calls get()`
- c0160 ..> c0134: `readMemories() calls queryMemory()`
- c0160 ..> c0134: `readProjects() calls listProjects()`
- c0160 ..> c0134: `replacementMemory() calls create()`
- c0160 ..> c0134: `replacementMemory() calls get()`
- c0160 ..> c0134: `resolveWriteProject() calls listProjects()`
- c0160 ..> c0134: `supersedeMemory() calls supersede()`
- c0160 ..> c0151: `type in readCodeArtifact`
- c0160 ..> c0151: `type in readCodeArtifacts`
- c0160 ..> c0151: `type in readDocument`
- c0160 ..> c0151: `type in readDocuments`
- c0160 ..> c0151: `type in readEntities`
- c0160 ..> c0151: `type in readEntity`
- c0160 ..> c0151: `type in readEntityMemories`
- c0160 ..> c0151: `type in readFile`
- c0160 ..> c0151: `type in readFiles`
- c0160 ..> c0151: `type in readMemories`
- c0160 ..> c0151: `type in readMemory`
- c0160 ..> c0151: `type in readProjects`
- c0160 ..> c0151: `type in readRelationships`
- c0160 ..> c0151: `type in requestedReadProject`
- c0160 ..> c0151: `type in requireReadKnowledge`
- c0160 ..> c0152: `type in executeKnowledgeRead`
- c0160 ..> c0152: `type in validateKnowledgeReadRequest`
- c0160 ..> c0153: `type in assertReadEntity`
- c0160 ..> c0153: `type in assertReadMemory`
- c0160 ..> c0153: `type in createCodeArtifact`
- c0160 ..> c0153: `type in createDocument`
- c0160 ..> c0153: `type in createEntity`
- c0160 ..> c0153: `type in createMemory`
- c0160 ..> c0153: `type in currentProject`
- c0160 ..> c0153: `type in effectiveCommit`
- c0160 ..> c0153: `type in executeKnowledgeRead`
- c0160 ..> c0153: `type in executeKnowledgeWrite`
- c0160 ..> c0153: `type in provenance`
- c0160 ..> c0153: `type in resolveWriteProject`
- c0160 ..> c0153: `type in updateProvenance`
- c0160 ..> c0154: `type in createCodeArtifact`
- c0160 ..> c0154: `type in createDocument`
- c0160 ..> c0154: `type in createEntity`
- c0160 ..> c0154: `type in createMemory`
- c0160 ..> c0154: `type in createRelationship`
- c0160 ..> c0154: `type in executeKnowledgeRead`
- c0160 ..> c0154: `type in executeKnowledgeWrite`
- c0160 ..> c0154: `type in linkEntityMemory`
- c0160 ..> c0154: `type in linkMemories`
- c0160 ..> c0154: `type in readCodeArtifact`
- c0160 ..> c0154: `type in readCodeArtifacts`
- c0160 ..> c0154: `type in readDocument`
- c0160 ..> c0154: `type in readDocuments`
- c0160 ..> c0154: `type in readEntities`
- c0160 ..> c0154: `type in readEntity`
- c0160 ..> c0154: `type in readEntityMemories`
- c0160 ..> c0154: `type in readFile`
- c0160 ..> c0154: `type in readFiles`
- c0160 ..> c0154: `type in readMemories`
- c0160 ..> c0154: `type in readMemory`
- c0160 ..> c0154: `type in readProjects`
- c0160 ..> c0154: `type in readRelationships`
- c0160 ..> c0154: `type in readResult`
- c0160 ..> c0154: `type in supersedeMemory`
- c0160 ..> c0154: `type in updateCodeArtifact`
- c0160 ..> c0154: `type in updateDocument`
- c0160 ..> c0154: `type in updateEntity`
- c0160 ..> c0154: `type in updateMemory`
- c0160 ..> c0154: `type in writeResult`
- c0160 ..> c0155: `type in createRelationship`
- c0160 ..> c0155: `type in linkEntityMemory`
- c0160 ..> c0155: `type in linkMemories`
- c0160 ..> c0155: `type in replacementMemory`
- c0160 ..> c0155: `type in supersedeMemory`
- c0160 ..> c0155: `type in updateCodeArtifact`
- c0160 ..> c0155: `type in updateDocument`
- c0160 ..> c0155: `type in updateEntity`
- c0160 ..> c0155: `type in updateMemory`
- c0160 ..> c0156: `type in executeKnowledgeWrite`
- c0160 ..> c0156: `type in validateKnowledgeWriteRequest`
- c0160 ..> c0157: `type in resolveWriteProject`
- c0160 ..> c0158: `type in fileContent`
- c0160 ..> c0159: `type in fileContent`
- c0160 ..> c0160: `assertReadEntity() calls currentProject()`
- c0160 ..> c0160: `assertReadEntity() calls inEntityProject()`
- c0160 ..> c0160: `assertReadMemory() calls currentProject()`
- c0160 ..> c0160: `assertReadMemory() calls inMemoryProject()`
- c0160 ..> c0160: `boundedId() calls optionalId()`
- c0160 ..> c0160: `boundedListPage() calls compactWriteValue()`
- c0160 ..> c0160: `boundedListPage() calls json()`
- c0160 ..> c0160: `boundedListPage() calls listPage()`
- c0160 ..> c0160: `commit() calls optionalText()`
- c0160 ..> c0160: `compactObjectEntry() calls compactWriteValue()`
- c0160 ..> c0160: `compactWriteValue() calls compactObjectEntry()`
- c0160 ..> c0160: `compactWriteValue() calls compactString()`
- c0160 ..> c0160: `createCodeArtifact() calls beforeMutation()`
- c0160 ..> c0160: `createCodeArtifact() calls provenance()`
- c0160 ..> c0160: `createCodeArtifact() calls writeResult()`
- c0160 ..> c0160: `createDocument() calls beforeMutation()`
- c0160 ..> c0160: `createDocument() calls provenance()`
- c0160 ..> c0160: `createDocument() calls writeResult()`
- c0160 ..> c0160: `createEntity() calls beforeMutation()`
- c0160 ..> c0160: `createEntity() calls provenance()`
- c0160 ..> c0160: `createEntity() calls writeResult()`
- c0160 ..> c0160: `createMemory() calls beforeMutation()`
- c0160 ..> c0160: `createMemory() calls provenance()`
- c0160 ..> c0160: `createMemory() calls rich()`
- c0160 ..> c0160: `createMemory() calls validateAttachments()`
- c0160 ..> c0160: `createMemory() calls writeResult()`
- c0160 ..> c0160: `createRelationship() calls beforeMutation()`
- c0160 ..> c0160: `createRelationship() calls entityInProject()`
- c0160 ..> c0160: `createRelationship() calls provenance()`
- c0160 ..> c0160: `createRelationship() calls writeResult()`
- c0160 ..> c0160: `executeKnowledgeRead() calls currentProject()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readCodeArtifact()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readCodeArtifacts()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readDocument()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readDocuments()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readEntities()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readEntity()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readEntityMemories()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readFile()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readFiles()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readMemories()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readMemory()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readProjects()`
- c0160 ..> c0160: `executeKnowledgeRead() calls readRelationships()`
- c0160 ..> c0160: `executeKnowledgeRead() calls validateKnowledgeReadRequest()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls createCodeArtifact()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls createDocument()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls createEntity()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls createMemory()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls createRelationship()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls effectiveCommit()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls linkEntityMemory()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls linkMemories()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls rejectSensitiveInput()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls resolveWriteProject()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls rich()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls supersedeMemory()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls updateCodeArtifact()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls updateDocument()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls updateEntity()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls updateMemory()`
- c0160 ..> c0160: `executeKnowledgeWrite() calls validateKnowledgeWriteRequest()`
- c0160 ..> c0160: `fileContent() calls json()`
- c0160 ..> c0160: `linkEntityMemory() calls beforeMutation()`
- c0160 ..> c0160: `linkEntityMemory() calls entityInProject()`
- c0160 ..> c0160: `linkEntityMemory() calls memoryInProject()`
- c0160 ..> c0160: `linkEntityMemory() calls writeResult()`
- c0160 ..> c0160: `linkMemories() calls beforeMutation()`
- c0160 ..> c0160: `linkMemories() calls memoryInProject()`
- c0160 ..> c0160: `linkMemories() calls writeResult()`
- c0160 ..> c0160: `need() calls requiredText()`
- c0160 ..> c0160: `optionalId() calls requiredId()`
- c0160 ..> c0160: `optionalIds() calls requiredIds()`
- c0160 ..> c0160: `optionalStrings() calls requiredStrings()`
- c0160 ..> c0160: `optionalText() calls requiredText()`
- c0160 ..> c0160: `provenance() calls effectiveCommit()`
- c0160 ..> c0160: `readCodeArtifact() calls page()`
- c0160 ..> c0160: `readCodeArtifact() calls readResult()`
- c0160 ..> c0160: `readCodeArtifact() calls requireReadKnowledge()`
- c0160 ..> c0160: `readCodeArtifacts() calls boundedListPage()`
- c0160 ..> c0160: `readCodeArtifacts() calls readResult()`
- c0160 ..> c0160: `readCodeArtifacts() calls requestedReadProject()`
- c0160 ..> c0160: `readCodeArtifacts() calls requireReadKnowledge()`
- c0160 ..> c0160: `readDocument() calls page()`
- c0160 ..> c0160: `readDocument() calls readResult()`
- c0160 ..> c0160: `readDocument() calls requireReadKnowledge()`
- c0160 ..> c0160: `readDocuments() calls boundedListPage()`
- c0160 ..> c0160: `readDocuments() calls readResult()`
- c0160 ..> c0160: `readDocuments() calls requestedReadProject()`
- c0160 ..> c0160: `readDocuments() calls requireReadKnowledge()`
- c0160 ..> c0160: `readEntities() calls boundedListPage()`
- c0160 ..> c0160: `readEntities() calls hydrateEntities()`
- c0160 ..> c0160: `readEntities() calls inEntityProject()`
- c0160 ..> c0160: `readEntities() calls readResult()`
- c0160 ..> c0160: `readEntities() calls requestedReadProject()`
- c0160 ..> c0160: `readEntities() calls requireReadKnowledge()`
- c0160 ..> c0160: `readEntity() calls assertReadEntity()`
- c0160 ..> c0160: `readEntity() calls readResult()`
- c0160 ..> c0160: `readEntity() calls requireReadKnowledge()`
- c0160 ..> c0160: `readEntityMemories() calls assertReadEntity()`
- c0160 ..> c0160: `readEntityMemories() calls compactWriteValue()`
- c0160 ..> c0160: `readEntityMemories() calls inMemoryProject()`
- c0160 ..> c0160: `readEntityMemories() calls listPage()`
- c0160 ..> c0160: `readEntityMemories() calls readResult()`
- c0160 ..> c0160: `readEntityMemories() calls requireReadKnowledge()`
- c0160 ..> c0160: `readFile() calls fileContent()`
- c0160 ..> c0160: `readFile() calls requireReadKnowledge()`
- c0160 ..> c0160: `readFiles() calls boundedListPage()`
- c0160 ..> c0160: `readFiles() calls readResult()`
- c0160 ..> c0160: `readFiles() calls requestedReadProject()`
- c0160 ..> c0160: `readFiles() calls requireReadKnowledge()`
- c0160 ..> c0160: `readMemories() calls inMemoryProject()`
- c0160 ..> c0160: `readMemories() calls readResult()`
- c0160 ..> c0160: `readMemories() calls requestedReadProject()`
- c0160 ..> c0160: `readMemory() calls assertReadMemory()`
- c0160 ..> c0160: `readMemory() calls readResult()`
- c0160 ..> c0160: `readProjects() calls boundedListPage()`
- c0160 ..> c0160: `readProjects() calls readResult()`
- c0160 ..> c0160: `readRelationships() calls assertReadEntity()`
- c0160 ..> c0160: `readRelationships() calls inEntityProject()`
- c0160 ..> c0160: `readRelationships() calls listPage()`
- c0160 ..> c0160: `readRelationships() calls readResult()`
- c0160 ..> c0160: `readRelationships() calls requireReadKnowledge()`
- c0160 ..> c0160: `readResult() calls json()`
- c0160 ..> c0160: `rejectSensitiveInput() calls containsSensitiveData()`
- c0160 ..> c0160: `replacementMemory() calls beforeMutation()`
- c0160 ..> c0160: `replacementMemory() calls memoryInProject()`
- c0160 ..> c0160: `replacementMemory() calls provenance()`
- c0160 ..> c0160: `replacementMemory() calls validateAttachments()`
- c0160 ..> c0160: `requestedReadProject() calls currentProject()`
- c0160 ..> c0160: `requiredIds() calls requiredId()`
- c0160 ..> c0160: `requiredStrings() calls requiredText()`
- c0160 ..> c0160: `resolveWriteProject() calls currentProject()`
- c0160 ..> c0160: `supersedeMemory() calls beforeMutation()`
- c0160 ..> c0160: `supersedeMemory() calls memoryInProject()`
- c0160 ..> c0160: `supersedeMemory() calls replacementMemory()`
- c0160 ..> c0160: `supersedeMemory() calls writeResult()`
- c0160 ..> c0160: `updateCodeArtifact() calls beforeMutation()`
- c0160 ..> c0160: `updateCodeArtifact() calls updateProvenance()`
- c0160 ..> c0160: `updateCodeArtifact() calls writeResult()`
- c0160 ..> c0160: `updateDocument() calls beforeMutation()`
- c0160 ..> c0160: `updateDocument() calls updateProvenance()`
- c0160 ..> c0160: `updateDocument() calls writeResult()`
- c0160 ..> c0160: `updateEntity() calls beforeMutation()`
- c0160 ..> c0160: `updateEntity() calls entityInProject()`
- c0160 ..> c0160: `updateEntity() calls updateProvenance()`
- c0160 ..> c0160: `updateEntity() calls writeResult()`
- c0160 ..> c0160: `updateMemory() calls beforeMutation()`
- c0160 ..> c0160: `updateMemory() calls memoryInProject()`
- c0160 ..> c0160: `updateMemory() calls updateProvenance()`
- c0160 ..> c0160: `updateMemory() calls validateAttachments()`
- c0160 ..> c0160: `updateMemory() calls writeResult()`
- c0160 ..> c0160: `updateProvenance() calls effectiveCommit()`
- c0160 ..> c0160: `validateEntityFields() calls isEntityType()`
- c0160 ..> c0160: `validateEntityFields() calls optionalText()`
- c0160 ..> c0160: `validateKnowledgeReadRequest() calls checkOperation()`
- c0160 ..> c0160: `validateKnowledgeReadRequest() calls record()`
- c0160 ..> c0160: `validateKnowledgeReadRequest() calls validateReadPagination()`
- c0160 ..> c0160: `validateKnowledgeReadRequest() calls validateReadSearch()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls checkOperation()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls commit()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls need()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls optionalId()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls optionalIds()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls optionalImportance()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls optionalStrings()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls optionalText()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls record()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls requiredId()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls requiredIds()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls requiredStrings()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls requiredText()`
- c0160 ..> c0160: `validateKnowledgeWriteRequest() calls validateEntityFields()`
- c0160 ..> c0160: `validateReadPagination() calls boundedId()`
- c0160 ..> c0160: `writeResult() calls compactWriteValue()`
- c0160 ..> c0160: `writeResult() calls json()`
- c0160 ..> c0182: `replacementMemory() calls replacementMemoryContext()`
- c0160 ..> c0196: `containsSensitiveData() calls hasSensitiveData()`
- c0160 ..> c0229: `requiredText() calls trim()`
- c0160 ..> c0229: `resolveWriteProject() calls trim()`
- c0162 --> c0073: `field input`
- c0163 --> c0077: `field input`
- c0165 --> c0080: `field input`
- c0167 --> c0082: `field input`
- c0170 --> c0162: `field codeArtifacts`
- c0170 --> c0163: `field documents`
- c0170 --> c0164: `field entityMemoryLinks`
- c0170 --> c0165: `field entities`
- c0170 --> c0167: `field relationships`
- c0173 --> c0171: `field codeArtifacts`
- c0173 --> c0171: `field documents`
- c0173 --> c0171: `field entities`
- c0173 --> c0171: `field relationships`
- c0174 ..> c0072: `type in writeCodeArtifact`
- c0174 ..> c0076: `type in writeDocument`
- c0174 ..> c0079: `type in writeEntity`
- c0174 ..> c0081: `type in writeRelationship`
- c0174 ..> c0089: `type in attachmentIds`
- c0174 ..> c0089: `type in attachmentMemory`
- c0174 ..> c0089: `type in attachmentsDiffer`
- c0174 ..> c0131: `writeAttachments() calls updateMemory()`
- c0174 ..> c0131: `writeCodeArtifact() calls createCodeArtifact()`
- c0174 ..> c0131: `writeCodeArtifact() calls getCodeArtifact()`
- c0174 ..> c0131: `writeDocument() calls createDocument()`
- c0174 ..> c0131: `writeDocument() calls getDocument()`
- c0174 ..> c0131: `writeEntity() calls createEntity()`
- c0174 ..> c0131: `writeEntity() calls getEntity()`
- c0174 ..> c0131: `writeEntityMemoryLink() calls linkEntityMemory()`
- c0174 ..> c0131: `writeLinkedMemory() calls linkMemories()`
- c0174 ..> c0131: `writeRelationship() calls createRelationship()`
- c0174 ..> c0134: `createOnce() calls create()`
- c0174 ..> c0145: `attachmentMemory() calls readMemory()`
- c0174 ..> c0161: `type in attachmentIds`
- c0174 ..> c0161: `type in attachmentPatch`
- c0174 ..> c0161: `type in attachmentsDiffer`
- c0174 ..> c0161: `type in requestedAttachmentIds`
- c0174 ..> c0162: `type in writeCodeArtifact`
- c0174 ..> c0163: `type in writeDocument`
- c0174 ..> c0164: `type in writeEntityMemoryLink`
- c0174 ..> c0165: `type in writeEntity`
- c0174 --> c0166: `field readMemory`
- c0174 ..> c0166: `type in constructor`
- c0174 ..> c0167: `type in writeRelationship`
- c0174 ..> c0168: `type in execute`
- c0174 ..> c0169: `type in createOnce`
- c0174 ..> c0169: `type in execute`
- c0174 ..> c0169: `type in writeAttachments`
- c0174 ..> c0169: `type in writeCodeArtifact`
- c0174 ..> c0169: `type in writeCodeArtifacts`
- c0174 ..> c0169: `type in writeConnection`
- c0174 ..> c0169: `type in writeDocument`
- c0174 ..> c0169: `type in writeDocuments`
- c0174 ..> c0169: `type in writeEntities`
- c0174 ..> c0169: `type in writeEntity`
- c0174 ..> c0169: `type in writeEntityMemoryLink`
- c0174 ..> c0169: `type in writeEntityMemoryLinks`
- c0174 ..> c0169: `type in writeLinkedMemories`
- c0174 ..> c0169: `type in writeLinkedMemory`
- c0174 ..> c0169: `type in writeRelationship`
- c0174 ..> c0169: `type in writeRelationships`
- c0174 ..> c0170: `type in attachmentMemory`
- c0174 ..> c0170: `type in createOnce`
- c0174 ..> c0170: `type in execute`
- c0174 ..> c0170: `type in requestedAttachmentIds`
- c0174 ..> c0170: `type in writeAttachments`
- c0174 ..> c0170: `type in writeCodeArtifact`
- c0174 ..> c0170: `type in writeCodeArtifacts`
- c0174 ..> c0170: `type in writeConnection`
- c0174 ..> c0170: `type in writeDocument`
- c0174 ..> c0170: `type in writeDocuments`
- c0174 ..> c0170: `type in writeEntities`
- c0174 ..> c0170: `type in writeEntity`
- c0174 ..> c0170: `type in writeEntityMemoryLink`
- c0174 ..> c0170: `type in writeEntityMemoryLinks`
- c0174 ..> c0170: `type in writeLinkedMemories`
- c0174 ..> c0170: `type in writeLinkedMemory`
- c0174 ..> c0170: `type in writeRelationship`
- c0174 ..> c0170: `type in writeRelationships`
- c0174 ..> c0172: `type in createOnce`
- c0174 ..> c0172: `type in recordCreateFailure`
- c0174 ..> c0172: `type in writeAttachments`
- c0174 ..> c0172: `type in writeCodeArtifact`
- c0174 ..> c0172: `type in writeCodeArtifacts`
- c0174 ..> c0172: `type in writeConnection`
- c0174 ..> c0172: `type in writeDocument`
- c0174 ..> c0172: `type in writeDocuments`
- c0174 ..> c0172: `type in writeEntities`
- c0174 ..> c0172: `type in writeEntity`
- c0174 ..> c0172: `type in writeEntityMemoryLink`
- c0174 ..> c0172: `type in writeEntityMemoryLinks`
- c0174 ..> c0172: `type in writeLinkedMemories`
- c0174 ..> c0172: `type in writeLinkedMemory`
- c0174 ..> c0172: `type in writeRelationship`
- c0174 ..> c0172: `type in writeRelationships`
- c0174 ..> c0173: `type in createOnce`
- c0174 ..> c0173: `type in execute`
- c0174 ..> c0173: `type in recordCreateFailure`
- c0174 ..> c0173: `type in requestedAttachmentIds`
- c0174 ..> c0173: `type in writeAttachments`
- c0174 ..> c0173: `type in writeCodeArtifact`
- c0174 ..> c0173: `type in writeCodeArtifacts`
- c0174 ..> c0173: `type in writeConnection`
- c0174 ..> c0173: `type in writeDocument`
- c0174 ..> c0173: `type in writeDocuments`
- c0174 ..> c0173: `type in writeEntities`
- c0174 ..> c0173: `type in writeEntity`
- c0174 ..> c0173: `type in writeEntityMemoryLink`
- c0174 ..> c0173: `type in writeEntityMemoryLinks`
- c0174 ..> c0173: `type in writeLinkedMemories`
- c0174 ..> c0173: `type in writeLinkedMemory`
- c0174 ..> c0173: `type in writeRelationship`
- c0174 ..> c0173: `type in writeRelationships`
- c0174 ..> c0174: `createOnce() calls recordCreateFailure()`
- c0174 ..> c0174: `execute() calls writeAttachments()`
- c0174 ..> c0174: `execute() calls writeCodeArtifacts()`
- c0174 ..> c0174: `execute() calls writeDocuments()`
- c0174 ..> c0174: `execute() calls writeEntities()`
- c0174 ..> c0174: `execute() calls writeEntityMemoryLinks()`
- c0174 ..> c0174: `execute() calls writeLinkedMemories()`
- c0174 ..> c0174: `execute() calls writeRelationships()`
- c0174 ..> c0174: `writeAttachments() calls attachmentIds()`
- c0174 ..> c0174: `writeAttachments() calls attachmentMemory()`
- c0174 ..> c0174: `writeAttachments() calls attachmentPatch()`
- c0174 ..> c0174: `writeAttachments() calls attachmentsDiffer()`
- c0174 ..> c0174: `writeAttachments() calls requestedAttachmentIds()`
- c0174 ..> c0174: `writeAttachments() calls writeConnection()`
- c0174 ..> c0174: `writeCodeArtifact() calls createOnce()`
- c0174 ..> c0174: `writeCodeArtifacts() calls writeCodeArtifact()`
- c0174 ..> c0174: `writeConnection() calls execute()`
- c0174 ..> c0174: `writeDocument() calls createOnce()`
- c0174 ..> c0174: `writeDocuments() calls writeDocument()`
- c0174 ..> c0174: `writeEntities() calls writeEntity()`
- c0174 ..> c0174: `writeEntity() calls createOnce()`
- c0174 ..> c0174: `writeEntityMemoryLink() calls writeConnection()`
- c0174 ..> c0174: `writeEntityMemoryLinks() calls writeEntityMemoryLink()`
- c0174 ..> c0174: `writeLinkedMemories() calls writeLinkedMemory()`
- c0174 ..> c0174: `writeLinkedMemory() calls writeConnection()`
- c0174 ..> c0174: `writeRelationship() calls createOnce()`
- c0174 ..> c0174: `writeRelationships() calls writeRelationship()`
- c0174 ..> c0175: `type in writeCodeArtifact`
- c0174 ..> c0175: `type in writeDocument`
- c0174 ..> c0175: `type in writeEntity`
- c0174 ..> c0175: `type in writeRelationship`
- c0174 --> c0176: `field client`
- c0174 ..> c0176: `type in constructor`
- c0174 ..> c0177: `attachmentIds() calls uniqueIds()`
- c0174 ..> c0177: `attachmentsDiffer() calls sameIds()`
- c0174 ..> c0177: `createOnce() calls positiveId()`
- c0174 ..> c0177: `execute() calls copyState()`
- c0174 ..> c0177: `execute() calls instructionId()`
- c0174 ..> c0177: `execute() calls normalizedState()`
- c0174 ..> c0177: `recordCreateFailure() calls rejectedCreate()`
- c0174 ..> c0177: `requestedAttachmentIds() calls selectedIds()`
- c0174 ..> c0177: `requestedAttachmentIds() calls uniqueIds()`
- c0174 ..> c0177: `writeCodeArtifacts() calls positiveId()`
- c0174 ..> c0177: `writeCodeArtifacts() calls resourceSlots()`
- c0174 ..> c0177: `writeCodeArtifacts() calls stateId()`
- c0174 ..> c0177: `writeCodeArtifacts() calls stateWithNumber()`
- c0174 ..> c0177: `writeConnection() calls rejectedCreate()`
- c0174 ..> c0177: `writeDocuments() calls positiveId()`
- c0174 ..> c0177: `writeDocuments() calls resourceSlots()`
- c0174 ..> c0177: `writeDocuments() calls stateId()`
- c0174 ..> c0177: `writeDocuments() calls stateWithNumber()`
- c0174 ..> c0177: `writeEntities() calls positiveId()`
- c0174 ..> c0177: `writeEntities() calls resourceSlots()`
- c0174 ..> c0177: `writeEntities() calls stateId()`
- c0174 ..> c0177: `writeEntities() calls stateWithNumber()`
- c0174 ..> c0177: `writeEntityMemoryLink() calls hasValue()`
- c0174 ..> c0177: `writeEntityMemoryLink() calls stateId()`
- c0174 ..> c0177: `writeLinkedMemory() calls hasValue()`
- c0174 ..> c0177: `writeRelationship() calls stateId()`
- c0174 ..> c0177: `writeRelationships() calls positiveId()`
- c0174 ..> c0177: `writeRelationships() calls resourceSlots()`
- c0174 ..> c0177: `writeRelationships() calls stateId()`
- c0174 ..> c0177: `writeRelationships() calls stateWithNumber()`
- c0174 ..> c0196: `createOnce() calls errorMessage()`
- c0174 ..> c0196: `writeConnection() calls errorMessage()`
- c0174 ..> c0242: `createOnce() calls inspect()`
- c0174 ..> c0242: `writeConnection() calls inspect()`
- c0177 ..> c0004: `resourceSlots() calls set()`
- c0177 ..> c0134: `resourceSlots() calls get()`
- c0177 ..> c0170: `type in instructionId`
- c0177 ..> c0171: `type in receipts`
- c0177 ..> c0171: `type in selectedIds`
- c0177 ..> c0171: `type in stateId`
- c0177 ..> c0171: `type in stateWithNumber`
- c0177 ..> c0173: `type in copyState`
- c0177 ..> c0173: `type in normalizedState`
- c0177 ..> c0175: `type in resourceSlots`
- c0177 ..> c0177: `normalizedState() calls receipts()`
- c0177 ..> c0177: `receipts() calls positiveId()`
- c0177 ..> c0177: `selectedIds() calls positiveId()`
- c0177 ..> c0177: `selectedIds() calls resourceSlots()`
- c0177 ..> c0177: `selectedIds() calls stateId()`
- c0177 ..> c0177: `stateWithNumber() calls positiveId()`
- c0180 ..> c0047: `flush() calls resolve()`
- c0180 ..|> c0178: `implements`
- c0180 --> c0179: `field level`
- c0180 --> c0179: `field options`
- c0180 ..> c0179: `type in constructor`
- c0180 ..> c0179: `type in setLevel`
- c0180 ..> c0180: `close() calls flush()`
- c0180 ..> c0180: `emit() calls enqueue()`
- c0180 ..> c0180: `emit() calls warn()`
- c0180 ..> c0180: `enqueue() calls rotate()`
- c0180 ..> c0180: `enqueue() calls warn()`
- c0180 ..> c0180: `flush() calls warn()`
- c0180 ..> c0181: `constructor() calls limit()`
- c0180 ..> c0181: `enqueue() calls excludeCredentials()`
- c0180 ..> c0181: `enqueue() calls pruneDirectory()`
- c0180 ..> c0196: `enqueue() calls sanitizeValue()`
- c0181 ..> c0181: `pruneDirectory() calls listLogFiles()`
- c0181 ..> c0181: `pruneDirectory() calls processExited()`
- c0182 ..> c0091: `type in replacementMemoryInput`
- c0182 ..> c0182: `replacementMemoryInput() calls replacementMemoryContext()`
- c0182 ..> c0196: `storedMemoryContext() calls sanitizeText()`
- c0185 --> c0187: `field complete`
- c0186 ..> c0047: `applySummary() calls now()`
- c0186 --> c0183: `field compactedHistory`
- c0186 ..> c0183: `type in constructor`
- c0186 ..> c0183: `type in getCompactedHistory`
- c0186 ..> c0183: `type in prepare`
- c0186 ..> c0183: `type in prepareCapture`
- c0186 ..> c0183: `type in prepareContext`
- c0186 ..> c0186: `prepare() calls prepareContext()`
- c0186 ..> c0186: `prepareCapture() calls outputAllowance()`
- c0186 ..> c0186: `prepareCapture() calls prepareContext()`
- c0186 ..> c0186: `prepareContext() calls applySummary()`
- c0186 ..> c0186: `prepareContext() calls getCompactedHistory()`
- c0186 ..> c0186: `prepareContext() calls outputAllowance()`
- c0186 ..> c0187: `type in prepare`
- c0186 ..> c0187: `type in prepareCapture`
- c0186 ..> c0187: `type in prepareContext`
- c0186 ..> c0188: `applySummary() calls contextTokens()`
- c0186 ..> c0188: `constructor() calls compactionSettings()`
- c0186 ..> c0188: `constructor() calls privateContextWindow()`
- c0186 ..> c0188: `outputAllowance() calls resolvedOutputAllowance()`
- c0186 ..> c0188: `prepareContext() calls assertImageSupport()`
- c0186 ..> c0188: `prepareContext() calls contextTokens()`
- c0186 ..> c0188: `prepareContext() calls outputCeiling()`
- c0186 ..> c0188: `prepareContext() calls recentCutIndex()`
- c0186 ..> c0188: `prepareContext() calls summarizeMemoryHistory()`
- c0186 ..> c0229: `applySummary() calls trim()`
- c0188 ..> c0047: `summarizeMemoryHistory() calls now()`
- c0188 ..> c0094: `type in evidencePageContent`
- c0188 ..> c0184: `assertFits() constructs ContextWindowError`
- c0188 ..> c0184: `smallerSummaryBatch() constructs ContextWindowError`
- c0188 ..> c0185: `type in summarizeMemoryHistory`
- c0188 ..> c0188: `assertFits() calls contextTokens()`
- c0188 ..> c0188: `contextTokens() calls textTokens()`
- c0188 ..> c0188: `evidenceMessage() calls modelEvidence()`
- c0188 ..> c0188: `evidencePageContent() calls evidenceMessage()`
- c0188 ..> c0188: `modelEvidence() calls objectRecord()`
- c0188 ..> c0188: `outputCeiling() calls validatePositiveSafeInteger()`
- c0188 ..> c0188: `privateContextWindow() calls validatePositiveSafeInteger()`
- c0188 ..> c0188: `recentCutIndex() calls entriesFor()`
- c0188 ..> c0188: `resolvedOutputAllowance() calls assertFits()`
- c0188 ..> c0188: `resolvedOutputAllowance() calls contextTokens()`
- c0188 ..> c0188: `resolvedOutputAllowance() calls outputCeiling()`
- c0188 ..> c0188: `summarizeMemoryHistory() calls assertImageSupport()`
- c0188 ..> c0188: `summarizeMemoryHistory() calls compactionSettings()`
- c0188 ..> c0188: `summarizeMemoryHistory() calls privateContextWindow()`
- c0188 ..> c0188: `summarizeMemoryHistory() calls resolvedOutputAllowance()`
- c0188 ..> c0188: `summarizeMemoryHistory() calls smallerSummaryBatch()`
- c0188 ..> c0188: `summarizeMemoryHistory() calls summaryEvidence()`
- c0188 ..> c0188: `summaryEvidence() calls evidenceMessage()`
- c0188 ..> c0192: `summarizeMemoryHistory() calls complete()`
- c0188 ..> c0196: `evidenceMessage() calls sanitizeValue()`
- c0188 ..> c0196: `summarizeMemoryHistory() calls sanitizeText()`
- c0190 --> c0191: `field modelRegistry`
- c0192 ..> c0047: `complete() calls now()`
- c0192 ..> c0047: `completeAttempt() calls now()`
- c0192 ..> c0047: `completeRequest() calls now()`
- c0192 ..> c0047: `completeWithSubmission() calls now()`
- c0192 ..> c0047: `executeRead() calls now()`
- c0192 ..> c0047: `prepareCapture() calls now()`
- c0192 ..> c0056: `completeWithSubmission() calls mapConcurrent()`
- c0192 --> c0061: `field selection`
- c0192 ..> c0061: `type in constructor`
- c0192 ..> c0068: `completeRequest() calls isRecallConcurrency()`
- c0192 ..|> c0092: `implements`
- c0192 ..> c0096: `type in executeRead`
- c0192 ..> c0097: `type in complete`
- c0192 ..> c0097: `type in completeAttempt`
- c0192 ..> c0097: `type in completeRequest`
- c0192 ..> c0097: `type in completeWithSubmission`
- c0192 ..> c0097: `type in emit`
- c0192 ..> c0097: `type in executeRead`
- c0192 ..> c0097: `type in prepareCapture`
- c0192 ..> c0098: `completeWithSubmission() constructs ModelSubmissionError`
- c0192 ..> c0099: `type in validateSubmission`
- c0192 ..> c0174: `executeRead() calls execute()`
- c0192 --> c0178: `field logger`
- c0192 ..> c0180: `complete() calls emit()`
- c0192 ..> c0180: `completeAttempt() calls emit()`
- c0192 ..> c0180: `completeRequest() calls emit()`
- c0192 ..> c0180: `emit() calls emit()`
- c0192 ..> c0180: `prepareCapture() calls emit()`
- c0192 ..> c0186: `completeRequest() calls prepareCapture()`
- c0192 ..> c0186: `completeRequest() constructs MemoryTaskContext`
- c0192 ..> c0186: `completeWithSubmission() calls prepare()`
- c0192 ..> c0188: `completeRequest() calls evidenceMessage()`
- c0192 ..> c0188: `executeRead() calls evidencePageContent()`
- c0192 --> c0189: `field transformHeaders`
- c0192 --> c0191: `field registry`
- c0192 ..> c0191: `type in constructor`
- c0192 ..> c0192: `complete() calls completeRequest()`
- c0192 ..> c0192: `completeAttempt() calls complete()`
- c0192 ..> c0192: `completeRequest() calls completeWithSubmission()`
- c0192 ..> c0192: `completeWithSubmission() calls completeAttempt()`
- c0192 ..> c0192: `completeWithSubmission() calls executeRead()`
- c0192 ..> c0192: `completeWithSubmission() calls validateSubmission()`
- c0192 ..> c0192: `prepareCapture() calls completeRequest()`
- c0192 ..> c0193: `type in constructor`
- c0192 ..> c0194: `type in completeAttempt`
- c0192 ..> c0194: `type in completeWithSubmission`
- c0192 ..> c0194: `type in executeRead`
- c0192 ..> c0195: `complete() calls rejectionText()`
- c0192 ..> c0195: `completeAttempt() calls rejectionText()`
- c0192 ..> c0195: `completeRequest() calls modelLabel()`
- c0192 ..> c0195: `completeRequest() calls requestDeadline()`
- c0192 ..> c0195: `completeRequest() calls requestOptions()`
- c0192 ..> c0195: `completeRequest() calls requestTimeout()`
- c0192 ..> c0195: `completeRequest() calls serializeInput()`
- c0192 ..> c0195: `completeRequest() calls submissionTool()`
- c0192 ..> c0195: `completeRequest() calls throwRequestFailure()`
- c0192 ..> c0195: `completeWithSubmission() calls appendCallCountCorrection()`
- c0192 ..> c0195: `completeWithSubmission() calls ensureCompletionFinished()`
- c0192 ..> c0195: `completeWithSubmission() calls errorToolResult()`
- c0192 ..> c0195: `completeWithSubmission() calls rejectionText()`
- c0192 ..> c0195: `completeWithSubmission() calls sanitizedAssistantForHistory()`
- c0192 ..> c0195: `completeWithSubmission() calls serializeInput()`
- c0192 ..> c0195: `completeWithSubmission() calls submissionTool()`
- c0192 ..> c0195: `completeWithSubmission() calls toolCalls()`
- c0192 ..> c0195: `constructor() calls modelLabel()`
- c0192 ..> c0195: `executeRead() calls errorToolResult()`
- c0192 ..> c0195: `executeRead() calls rejectionText()`
- c0192 ..> c0195: `executeRead() calls serializeInput()`
- c0192 ..> c0195: `executeRead() calls submissionTool()`
- c0192 ..> c0195: `executeRead() calls textBlock()`
- c0192 ..> c0195: `prepareCapture() calls rejectionText()`
- c0192 ..> c0196: `completeRequest() calls sanitizeText()`
- c0192 ..> c0196: `emit() calls sanitizeValue()`
- c0193 --> c0178: `field logger`
- c0193 --> c0189: `field transformHeaders`
- c0195 ..> c0047: `appendCallCountCorrection() calls now()`
- c0195 ..> c0047: `errorToolResult() calls now()`
- c0195 ..> c0061: `type in modelLabel`
- c0195 ..> c0061: `type in modelSelectionFromModel`
- c0195 ..> c0061: `type in resolveMemoryModel`
- c0195 ..> c0096: `type in submissionTool`
- c0195 ..> c0097: `type in ensureCompletionFinished`
- c0195 ..> c0097: `type in requestDeadline`
- c0195 ..> c0097: `type in requestTimeout`
- c0195 ..> c0097: `type in throwRequestFailure`
- c0195 ..> c0099: `type in submissionTool`
- c0195 ..> c0189: `type in requestOptions`
- c0195 ..> c0190: `type in availableMemoryModels`
- c0195 ..> c0191: `type in resolveMemoryModel`
- c0195 ..> c0192: `requestOptions() calls transformHeaders()`
- c0195 ..> c0192: `resolveMemoryModel() constructs PiMemoryModel`
- c0195 ..> c0192: `type in resolveMemoryModel`
- c0195 ..> c0193: `type in resolveMemoryModel`
- c0195 ..> c0194: `type in requestDeadline`
- c0195 ..> c0195: `appendCallCountCorrection() calls errorToolResult()`
- c0195 ..> c0195: `appendCallCountCorrection() calls rejectionText()`
- c0195 ..> c0195: `appendCallCountCorrection() calls sanitizedAssistantForHistory()`
- c0195 ..> c0195: `errorToolResult() calls textBlock()`
- c0195 ..> c0195: `openCodeSessionHeaders() calls isOpenCodeModel()`
- c0195 ..> c0195: `requestOptions() calls openCodeSessionHeaders()`
- c0195 ..> c0195: `sanitizedAssistantForHistory() calls textBlock()`
- c0195 ..> c0196: `appendCallCountCorrection() calls sanitizeText()`
- c0195 ..> c0196: `ensureCompletionFinished() calls sanitizeText()`
- c0195 ..> c0196: `rejectionText() calls errorMessage()`
- c0195 ..> c0196: `sanitizedAssistantForHistory() calls sanitizeText()`
- c0195 ..> c0196: `sanitizedAssistantForHistory() calls sanitizeValue()`
- c0195 ..> c0196: `serializeInput() calls sanitizeText()`
- c0195 ..> c0196: `serializeInput() calls sanitizeValue()`
- c0195 ..> c0196: `throwRequestFailure() calls sanitizeText()`
- c0196 ..> c0196: `errorMessage() calls diagnosticMessage()`
- c0196 ..> c0196: `errorMessage() calls sanitizeText()`
- c0196 ..> c0196: `hasSensitiveData() calls sanitizeText()`
- c0196 ..> c0196: `sanitizeValue() calls sanitizeText()`
- c0196 ..> c0242: `diagnosticMessage() calls inspect()`
- c0199 ..> c0086: `type in initialiseProject`
- c0199 ..> c0086: `type in initialiseProjectForAgent`
- c0199 ..> c0086: `type in promptExistingProject`
- c0199 ..> c0101: `type in existingMapping`
- c0199 ..> c0101: `type in initialiseProject`
- c0199 ..> c0101: `type in initialiseProjectForAgent`
- c0199 ..> c0101: `type in promptExistingProject`
- c0199 ..> c0102: `type in promptNewProject`
- c0199 ..> c0102: `type in validateAgentProjectDetails`
- c0199 ..> c0129: `promptExistingProject() calls notify()`
- c0199 ..> c0134: `initialiseProject() calls createProject()`
- c0199 ..> c0134: `initialiseProject() calls linkProject()`
- c0199 ..> c0134: `initialiseProject() calls listProjects()`
- c0199 ..> c0134: `initialiseProjectForAgent() calls createProject()`
- c0199 ..> c0134: `initialiseProjectForAgent() calls linkProject()`
- c0199 ..> c0134: `initialiseProjectForAgent() calls listProjects()`
- c0199 ..> c0134: `promptExistingProject() calls listProjects()`
- c0199 ..> c0196: `promptExistingProject() calls sanitizeText()`
- c0199 ..> c0196: `promptNewProject() calls sanitizeText()`
- c0199 ..> c0197: `type in initialiseProjectForAgent`
- c0199 ..> c0197: `type in validateAgentProjectDetails`
- c0199 ..> c0198: `existingMapping() constructs ProjectInitError`
- c0199 ..> c0198: `initialiseProject() constructs ProjectInitError`
- c0199 ..> c0198: `initialiseProjectForAgent() constructs ProjectInitError`
- c0199 ..> c0198: `promptExistingProject() constructs ProjectInitError`
- c0199 ..> c0198: `promptNewProject() constructs ProjectInitError`
- c0199 ..> c0198: `validateAgentProjectDetails() constructs ProjectInitError`
- c0199 ..> c0199: `initialiseProject() calls existingMapping()`
- c0199 ..> c0199: `initialiseProject() calls promptExistingProject()`
- c0199 ..> c0199: `initialiseProject() calls promptNewProject()`
- c0199 ..> c0199: `initialiseProjectForAgent() calls existingMapping()`
- c0199 ..> c0199: `initialiseProjectForAgent() calls validateAgentProjectDetails()`
- c0199 ..> c0229: `promptExistingProject() calls trim()`
- c0199 ..> c0229: `promptNewProject() calls trim()`
- c0199 ..> c0229: `validateAgentProjectDetails() calls trim()`
- c0200 ..> c0004: `mutate() calls set()`
- c0200 ..> c0071: `type in advanceWatermark`
- c0200 ..> c0071: `type in enqueue`
- c0200 ..> c0071: `type in enqueueSnapshot`
- c0200 ..> c0071: `type in reusableHistory`
- c0200 ..> c0075: `type in compactJobSnapshot`
- c0200 ..> c0084: `type in appendInspections`
- c0200 ..> c0101: `type in completeProjectDiscovery`
- c0200 ..> c0107: `type in completeProjectDiscovery`
- c0200 ..> c0107: `type in currentWatermark`
- c0200 ..> c0134: `mutate() calls get()`
- c0200 ..> c0134: `resolveBranchId() calls get()`
- c0200 ..> c0160: `readSnapshot() calls readFile()`
- c0200 ..> c0160: `readState() calls readFile()`
- c0200 ..> c0160: `releaseFileLock() calls readFile()`
- c0200 ..> c0160: `removeAbandonedLock() calls readFile()`
- c0200 ..> c0196: `addConflict() calls sanitizeValue()`
- c0200 ..> c0196: `appendInspections() calls sanitizeValue()`
- c0200 ..> c0200: `acquireFileLock() calls createFileLock()`
- c0200 ..> c0200: `acquireFileLock() calls ensureDirectory()`
- c0200 ..> c0200: `acquireFileLock() calls recoverExistingLock()`
- c0200 ..> c0200: `addConflict() calls mutate()`
- c0200 ..> c0200: `addConflict() calls prune()`
- c0200 ..> c0200: `advanceWatermark() calls mutate()`
- c0200 ..> c0200: `advanceWatermark() calls prune()`
- c0200 ..> c0200: `advanceWatermark() calls updateWatermark()`
- c0200 ..> c0200: `appendInspections() calls readSnapshot()`
- c0200 ..> c0200: `appendInspections() calls storeSnapshot()`
- c0200 ..> c0200: `cancel() calls mutate()`
- c0200 ..> c0200: `checkpoint() calls appendInspections()`
- c0200 ..> c0200: `checkpoint() calls applyCheckpointPatch()`
- c0200 ..> c0200: `checkpoint() calls compactJobSnapshot()`
- c0200 ..> c0200: `checkpoint() calls hydrateJob()`
- c0200 ..> c0200: `checkpoint() calls mutate()`
- c0200 ..> c0200: `checkpoint() calls pruneFailedJobs()`
- c0200 ..> c0200: `checkpoint() calls recordCompletedCapture()`
- c0200 ..> c0200: `checkpoint() calls releaseTerminalSnapshot()`
- c0200 ..> c0200: `claimNext() calls claimJob()`
- c0200 ..> c0200: `claimNext() calls defaultIdentity()`
- c0200 ..> c0200: `claimNext() calls hydrateJob()`
- c0200 ..> c0200: `claimNext() calls matchesBranch()`
- c0200 ..> c0200: `claimNext() calls now()`
- c0200 ..> c0200: `claimNext() calls runningJobCanBeRecovered()`
- c0200 ..> c0200: `collectSnapshots() calls now()`
- c0200 ..> c0200: `collectSnapshots() calls snapshotPath()`
- c0200 ..> c0200: `collectSnapshots() calls syncDirectory()`
- c0200 ..> c0200: `compactJobSnapshot() calls hydrateJob()`
- c0200 ..> c0200: `compactJobSnapshot() calls storeSnapshot()`
- c0200 ..> c0200: `complete() calls checkpoint()`
- c0200 ..> c0200: `completeProjectDiscovery() calls defaultIdentity()`
- c0200 ..> c0200: `completeProjectDiscovery() calls mutate()`
- c0200 ..> c0200: `createFileLock() calls close()`
- c0200 ..> c0200: `createFileLock() calls releaseFileLock()`
- c0200 ..> c0200: `currentWatermark() calls getWatermark()`
- c0200 ..> c0200: `enqueue() calls mutate()`
- c0200 ..> c0200: `enqueue() calls prune()`
- c0200 ..> c0200: `enqueue() calls reusableHistory()`
- c0200 ..> c0200: `enqueue() calls updateWatermark()`
- c0200 ..> c0200: `enqueueSnapshot() calls enqueue()`
- c0200 ..> c0200: `getConflict() calls readState()`
- c0200 ..> c0200: `getJob() calls hydrateJob()`
- c0200 ..> c0200: `getJob() calls mutate()`
- c0200 ..> c0200: `getWatermark() calls readState()`
- c0200 ..> c0200: `hasClaimableWork() calls matchesBranch()`
- c0200 ..> c0200: `hasClaimableWork() calls mutate()`
- c0200 ..> c0200: `hasClaimableWork() calls now()`
- c0200 ..> c0200: `hasClaimableWork() calls runningJobCanBeRecovered()`
- c0200 ..> c0200: `hydrateJob() calls readSnapshot()`
- c0200 ..> c0200: `listJobMetadata() calls mutate()`
- c0200 ..> c0200: `listJobs() calls hydrateJob()`
- c0200 ..> c0200: `listJobs() calls mutate()`
- c0200 ..> c0200: `listPending() calls defaultIdentity()`
- c0200 ..> c0200: `listPending() calls hydrateJob()`
- c0200 ..> c0200: `listPending() calls mutate()`
- c0200 ..> c0200: `listPendingConflicts() calls pendingConflicts()`
- c0200 ..> c0200: `markConflictHandedOff() calls defaultIdentity()`
- c0200 ..> c0200: `markConflictHandedOff() calls getConflict()`
- c0200 ..> c0200: `markConflictHandedOff() calls mutate()`
- c0200 ..> c0200: `markConflictHandedOff() calls withWorkerLock()`
- c0200 ..> c0200: `mutate() calls pruneFailedJobs()`
- c0200 ..> c0200: `mutate() calls readState()`
- c0200 ..> c0200: `mutate() calls withMutationFileLock()`
- c0200 ..> c0200: `mutate() calls writeState()`
- c0200 ..> c0200: `pendingConflicts() calls readState()`
- c0200 ..> c0200: `prune() calls now()`
- c0200 ..> c0200: `readSnapshot() calls close()`
- c0200 ..> c0200: `readSnapshot() calls snapshotPath()`
- c0200 ..> c0200: `recordCompletedCapture() calls hydrateJob()`
- c0200 ..> c0200: `recordCompletedCapture() calls readSnapshot()`
- c0200 ..> c0200: `recordCompletedCapture() calls storeSnapshot()`
- c0200 ..> c0200: `recoverExistingLock() calls removeAbandonedLock()`
- c0200 ..> c0200: `refreshCaptureHistory() calls compactJobSnapshot()`
- c0200 ..> c0200: `refreshCaptureHistory() calls hydrateJob()`
- c0200 ..> c0200: `refreshCaptureHistory() calls mutate()`
- c0200 ..> c0200: `refreshCaptureHistory() calls reusableHistory()`
- c0200 ..> c0200: `releaseProgress() calls mutate()`
- c0200 ..> c0200: `removeAbandonedLock() calls now()`
- c0200 ..> c0200: `resolveBranchId() calls readState()`
- c0200 ..> c0200: `reusableHistory() calls readSnapshot()`
- c0200 ..> c0200: `storeSnapshot() calls close()`
- c0200 ..> c0200: `storeSnapshot() calls readSnapshot()`
- c0200 ..> c0200: `storeSnapshot() calls snapshotPath()`
- c0200 ..> c0200: `storeSnapshot() calls syncDirectory()`
- c0200 ..> c0200: `syncDirectory() calls close()`
- c0200 ..> c0200: `updateConflict() calls mutate()`
- c0200 ..> c0200: `withFileLock() calls acquireFileLock()`
- c0200 ..> c0200: `withMutationFileLock() calls withFileLock()`
- c0200 ..> c0200: `withWorkerLock() calls acquireFileLock()`
- c0200 ..> c0200: `writeState() calls close()`
- c0200 ..> c0200: `writeState() calls collectSnapshots()`
- c0200 ..> c0200: `writeState() calls ensureDirectory()`
- c0200 ..> c0200: `writeState() calls pruneFailedJobs()`
- c0200 ..> c0200: `writeState() calls releaseTerminalSnapshot()`
- c0200 ..> c0200: `writeState() calls storeSnapshot()`
- c0200 ..> c0200: `writeState() calls syncDirectory()`
- c0200 ..> c0201: `type in constructor`
- c0200 ..> c0202: `type in acquireFileLock`
- c0200 ..> c0202: `type in createFileLock`
- c0200 ..> c0204: `type in addConflict`
- c0200 ..> c0204: `type in getConflict`
- c0200 ..> c0204: `type in listPendingConflicts`
- c0200 ..> c0204: `type in pendingConflicts`
- c0200 ..> c0204: `type in updateConflict`
- c0200 ..> c0205: `acquireFileLock() constructs QueueBusyError`
- c0200 ..> c0205: `removeAbandonedLock() constructs QueueBusyError`
- c0200 ..> c0205: `withMutationFileLock() constructs QueueBusyError`
- c0200 ..> c0206: `type in applyCheckpointPatch`
- c0200 ..> c0206: `type in checkpoint`
- c0200 ..> c0207: `type in enqueue`
- c0200 ..> c0207: `type in enqueueSnapshot`
- c0200 ..> c0208: `type in claimNext`
- c0200 ..> c0208: `type in defaultIdentity`
- c0200 ..> c0208: `type in hasClaimableWork`
- c0200 ..> c0208: `type in listJobMetadata`
- c0200 ..> c0208: `type in listJobs`
- c0200 ..> c0208: `type in listPending`
- c0200 ..> c0208: `type in listPendingConflicts`
- c0200 ..> c0208: `type in pendingConflicts`
- c0200 ..> c0208: `type in withWorkerLock`
- c0200 ..> c0209: `type in checkpoint`
- c0200 ..> c0209: `type in claimJob`
- c0200 ..> c0209: `type in claimNext`
- c0200 ..> c0209: `type in complete`
- c0200 ..> c0209: `type in getJob`
- c0200 ..> c0209: `type in hydrateJob`
- c0200 ..> c0209: `type in listJobs`
- c0200 ..> c0209: `type in listPending`
- c0200 ..> c0209: `type in matchesBranch`
- c0200 ..> c0209: `type in refreshCaptureHistory`
- c0200 ..> c0209: `type in runningJobCanBeRecovered`
- c0200 ..> c0210: `type in listJobMetadata`
- c0200 ..> c0212: `type in collectSnapshots`
- c0200 ..> c0212: `type in mutate`
- c0200 ..> c0212: `type in prune`
- c0200 ..> c0212: `type in pruneFailedJobs`
- c0200 ..> c0212: `type in readState`
- c0200 ..> c0212: `type in recordCompletedCapture`
- c0200 ..> c0212: `type in releaseTerminalSnapshot`
- c0200 ..> c0212: `type in updateWatermark`
- c0200 ..> c0212: `type in writeState`
- c0200 ..> c0213: `type in advanceWatermark`
- c0200 ..> c0213: `type in currentWatermark`
- c0200 ..> c0213: `type in getWatermark`
- c0200 ..> c0213: `type in reusableHistory`
- c0200 ..> c0213: `type in updateWatermark`
- c0200 ..> c0214: `type in readSnapshot`
- c0200 ..> c0214: `type in reusableHistory`
- c0200 ..> c0214: `type in storeSnapshot`
- c0200 ..> c0215: `type in appendInspections`
- c0200 ..> c0215: `type in applyCheckpointPatch`
- c0200 ..> c0215: `type in compactJobSnapshot`
- c0200 ..> c0215: `type in hydrateJob`
- c0200 ..> c0215: `type in recordCompletedCapture`
- c0200 ..> c0215: `type in releaseTerminalSnapshot`
- c0200 ..> c0217: `type in advanceWatermark`
- c0200 ..> c0217: `type in updateWatermark`
- c0200 ..> c0218: `addConflict() calls jsonSnapshot()`
- c0200 ..> c0218: `addConflict() calls nowIso()`
- c0200 ..> c0218: `addConflict() calls scrubDiagnostic()`
- c0200 ..> c0218: `advanceWatermark() calls dedupeKey()`
- c0200 ..> c0218: `advanceWatermark() calls jsonSnapshot()`
- c0200 ..> c0218: `appendInspections() calls jsonSnapshot()`
- c0200 ..> c0218: `appendInspections() calls validateInspectionEntry()`
- c0200 ..> c0218: `applyCheckpointPatch() calls jsonSnapshot()`
- c0200 ..> c0218: `applyCheckpointPatch() calls nowIso()`
- c0200 ..> c0218: `applyCheckpointPatch() calls scrubDiagnostic()`
- c0200 ..> c0218: `cancel() calls nowIso()`
- c0200 ..> c0218: `cancel() calls scrubDiagnostic()`
- c0200 ..> c0218: `checkpoint() calls releaseCompletedArtifacts()`
- c0200 ..> c0218: `claimJob() calls nowIso()`
- c0200 ..> c0218: `claimNext() calls identityMatches()`
- c0200 ..> c0218: `claimNext() calls interruptedWrite()`
- c0200 ..> c0218: `collectSnapshots() calls historyCaches()`
- c0200 ..> c0218: `completeProjectDiscovery() calls identityMatches()`
- c0200 ..> c0218: `createFileLock() calls nowIso()`
- c0200 ..> c0218: `enqueue() calls contextKey()`
- c0200 ..> c0218: `enqueue() calls dedupeKey()`
- c0200 ..> c0218: `enqueue() calls jobIdFor()`
- c0200 ..> c0218: `enqueue() calls jsonSnapshot()`
- c0200 ..> c0218: `enqueue() calls nowIso()`
- c0200 ..> c0218: `getConflict() calls jsonSnapshot()`
- c0200 ..> c0218: `getWatermark() calls contextKey()`
- c0200 ..> c0218: `getWatermark() calls jsonSnapshot()`
- c0200 ..> c0218: `getWatermark() calls nowIso()`
- c0200 ..> c0218: `hasClaimableWork() calls identityMatches()`
- c0200 ..> c0218: `hasClaimableWork() calls interruptedWrite()`
- c0200 ..> c0218: `hydrateJob() calls jsonSnapshot()`
- c0200 ..> c0218: `listJobMetadata() calls identityMatches()`
- c0200 ..> c0218: `listJobs() calls identityMatches()`
- c0200 ..> c0218: `listPending() calls identityMatches()`
- c0200 ..> c0218: `markConflictHandedOff() calls conflictIdentityMatches()`
- c0200 ..> c0218: `markConflictHandedOff() calls interruptedWrite()`
- c0200 ..> c0218: `markConflictHandedOff() calls nowIso()`
- c0200 ..> c0218: `pendingConflicts() calls conflictIdentityMatches()`
- c0200 ..> c0218: `pendingConflicts() calls jsonSnapshot()`
- c0200 ..> c0218: `prune() calls clearHistoryCache()`
- c0200 ..> c0218: `prune() calls contextKey()`
- c0200 ..> c0218: `prune() calls historyCaches()`
- c0200 ..> c0218: `prune() calls setHistoryCaches()`
- c0200 ..> c0218: `prune() calls shouldRetain()`
- c0200 ..> c0218: `readState() calls normaliseState()`
- c0200 ..> c0218: `recordCompletedCapture() calls contextKey()`
- c0200 ..> c0218: `recordCompletedCapture() calls cursorComparison()`
- c0200 ..> c0218: `recordCompletedCapture() calls historyCaches()`
- c0200 ..> c0218: `recordCompletedCapture() calls nowIso()`
- c0200 ..> c0218: `recordCompletedCapture() calls orderedSourceEntryIds()`
- c0200 ..> c0218: `recordCompletedCapture() calls setHistoryCaches()`
- c0200 ..> c0218: `recordCompletedCapture() calls summaryCursor()`
- c0200 ..> c0218: `refreshCaptureHistory() calls contextKey()`
- c0200 ..> c0218: `refreshCaptureHistory() calls cursorComparison()`
- c0200 ..> c0218: `refreshCaptureHistory() calls interruptedWrite()`
- c0200 ..> c0218: `refreshCaptureHistory() calls orderedSourceEntryIds()`
- c0200 ..> c0218: `refreshCaptureHistory() calls recordId()`
- c0200 ..> c0218: `releaseProgress() calls nowIso()`
- c0200 ..> c0218: `removeAbandonedLock() calls isProcessAlive()`
- c0200 ..> c0218: `resolveBranchId() calls contextKey()`
- c0200 ..> c0218: `reusableHistory() calls diagnosticError()`
- c0200 ..> c0218: `reusableHistory() calls historyCaches()`
- c0200 ..> c0218: `reusableHistory() calls orderedSourceEntryIds()`
- c0200 ..> c0218: `reusableHistory() calls setHistoryCaches()`
- c0200 ..> c0218: `runningJobCanBeRecovered() calls isProcessAlive()`
- c0200 ..> c0218: `updateConflict() calls jsonSnapshot()`
- c0200 ..> c0218: `updateConflict() calls nowIso()`
- c0200 ..> c0218: `updateWatermark() calls contextKey()`
- c0200 ..> c0218: `updateWatermark() calls nowIso()`
- c0200 ..> c0218: `writeState() calls releaseCompletedArtifacts()`
- c0200 ..> c0229: `reusableHistory() calls trim()`
- c0200 ..> c0238: `compactJobSnapshot() calls compactCaptureSnapshot()`
- c0200 ..> c0238: `enqueue() calls reuseCaptureHistory()`
- c0200 ..> c0238: `enqueue() calls sanitizeCaptureSnapshot()`
- c0200 ..> c0238: `refreshCaptureHistory() calls captureConversation()`
- c0200 ..> c0238: `writeState() calls sanitizeCaptureSnapshot()`
- c0204 --> c0084: `field replacement`
- c0204 --> c0091: `field replacement`
- c0204 --> c0107: `field context`
- c0204 --> c0208: `field binding`
- c0204 --> c0216: `field supersession`
- c0206 --> c0075: `field compactedConversation`
- c0206 --> c0084: `field inspectionEntries`
- c0206 --> c0211: `field status`
- c0206 --> c0216: `field supersession`
- c0209 --> c0071: `field snapshot`
- c0209 --> c0208: `field binding`
- c0209 --> c0211: `field status`
- c0209 --> c0216: `field supersession`
- c0210 --> c0071: `field snapshot`
- c0212 --> c0204: `field conflicts`
- c0212 --> c0213: `field watermarks`
- c0212 --> c0215: `field jobs`
- c0213 --> c0203: `field historyAlternatives`
- c0215 --|> c0209: `inherits`
- c0218 ..> c0071: `type in dedupeKey`
- c0218 ..> c0071: `type in orderedSourceEntryIds`
- c0218 ..> c0071: `type in summaryCursor`
- c0218 ..> c0084: `type in validateInspectionEntry`
- c0218 ..> c0134: `releaseCompletedArtifacts() calls get()`
- c0218 ..> c0196: `scrubDiagnostic() calls sanitizeText()`
- c0218 ..> c0200: `nowIso() calls now()`
- c0218 ..> c0203: `type in historyCaches`
- c0218 ..> c0203: `type in setHistoryCaches`
- c0218 ..> c0204: `type in conflictIdentityMatches`
- c0218 ..> c0208: `type in conflictIdentityMatches`
- c0218 ..> c0208: `type in identityMatches`
- c0218 ..> c0209: `type in identityMatches`
- c0218 ..> c0209: `type in interruptedWrite`
- c0218 ..> c0212: `type in normaliseState`
- c0218 ..> c0213: `type in clearHistoryCache`
- c0218 ..> c0213: `type in historyCaches`
- c0218 ..> c0213: `type in setHistoryCaches`
- c0218 ..> c0215: `type in releaseCompletedArtifacts`
- c0218 ..> c0218: `conflictIdentityMatches() calls identityMatches()`
- c0218 ..> c0218: `interruptedWrite() calls outcomeRecord()`
- c0218 ..> c0218: `releaseCompletedArtifacts() calls outcomeRecord()`
- c0218 ..> c0218: `releaseCompletedArtifacts() calls scrubDiagnostic()`
- c0218 ..> c0218: `setHistoryCaches() calls clearHistoryCache()`
- c0218 ..> c0218: `summaryCursor() calls orderedSourceEntryIds()`
- c0220 --> c0101: `field projects`
- c0220 --> c0104: `field scope`
- c0220 --> c0107: `field context`
- c0222 --> c0084: `field sessionContext`
- c0222 --> c0097: `field diagnosticContext`
- c0222 --> c0101: `field projects`
- c0222 --> c0104: `field scope`
- c0222 --> c0107: `field context`
- c0222 --> c0221: `field onPlan`
- c0223 --> c0104: `field scope`
- c0224 ..> c0056: `searchMemories() calls mapConcurrent()`
- c0224 ..> c0068: `constructor() calls isRecallConcurrency()`
- c0224 ..> c0068: `deeper() calls resolveScope()`
- c0224 ..> c0068: `recall() calls resolveScope()`
- c0224 --> c0086: `field client`
- c0224 ..> c0086: `type in constructor`
- c0224 ..> c0089: `type in memoryInScope`
- c0224 ..> c0089: `type in optionalKnowledge`
- c0224 --> c0092: `field model`
- c0224 ..> c0092: `type in constructor`
- c0224 ..> c0096: `type in recallReadTool`
- c0224 ..> c0101: `type in matchResolution`
- c0224 ..> c0101: `type in resolveScope`
- c0224 ..> c0104: `type in empty`
- c0224 ..> c0104: `type in memoryInScope`
- c0224 ..> c0104: `type in optionalKnowledge`
- c0224 ..> c0104: `type in requestsDifferentProject`
- c0224 ..> c0104: `type in resolveScope`
- c0224 ..> c0104: `type in searchMemories`
- c0224 ..> c0104: `type in searchRequest`
- c0224 ..> c0105: `type in searchRequest`
- c0224 ..> c0107: `type in contextProjectResolution`
- c0224 ..> c0107: `type in resolveScope`
- c0224 ..> c0107: `type in searchRequest`
- c0224 ..> c0134: `deeper() calls search()`
- c0224 ..> c0134: `resolveScope() calls listProjects()`
- c0224 ..> c0134: `searchMemories() calls search()`
- c0224 ..> c0144: `type in optionalKnowledge`
- c0224 ..> c0144: `type in resultWithKnowledge`
- c0224 --> c0145: `field knowledge`
- c0224 ..> c0145: `constructor() constructs KnowledgeReadService`
- c0224 ..> c0145: `optionalKnowledge() calls expand()`
- c0224 ..> c0160: `recallReadTool() calls executeKnowledgeRead()`
- c0224 ..> c0192: `recall() calls complete()`
- c0224 ..> c0196: `deeper() calls sanitizeText()`
- c0224 ..> c0196: `finishReview() calls sanitizeText()`
- c0224 ..> c0196: `optionalKnowledge() calls errorMessage()`
- c0224 ..> c0196: `plannerInput() calls sanitizeText()`
- c0224 ..> c0196: `queryContext() calls sanitizeText()`
- c0224 ..> c0196: `recall() calls sanitizeText()`
- c0224 ..> c0196: `recall() calls sanitizeValue()`
- c0224 ..> c0196: `searchFailure() calls errorMessage()`
- c0224 ..> c0196: `searchFailure() calls sanitizeValue()`
- c0224 ..> c0219: `type in authorizeProjectSelection`
- c0224 ..> c0219: `type in ensureLive`
- c0224 ..> c0219: `type in finishFailure`
- c0224 ..> c0219: `type in searchMemories`
- c0224 ..> c0220: `type in deeper`
- c0224 ..> c0221: `type in authorizeProjectSelection`
- c0224 ..> c0221: `type in queryContext`
- c0224 ..> c0221: `type in requestsDifferentProject`
- c0224 ..> c0221: `type in searchMemories`
- c0224 ..> c0221: `type in searchRequest`
- c0224 ..> c0222: `type in authorizeProjectSelection`
- c0224 ..> c0222: `type in finishFailure`
- c0224 ..> c0222: `type in plannerInput`
- c0224 ..> c0222: `type in recall`
- c0224 ..> c0222: `type in recallReadTool`
- c0224 ..> c0222: `type in requestsDifferentProject`
- c0224 ..> c0222: `type in searchMemories`
- c0224 ..> c0223: `type in deeper`
- c0224 ..> c0223: `type in empty`
- c0224 ..> c0223: `type in finishFailure`
- c0224 ..> c0223: `type in finishReview`
- c0224 ..> c0223: `type in recall`
- c0224 ..> c0223: `type in recallReadTool`
- c0224 ..> c0223: `type in resultWithKnowledge`
- c0224 ..> c0224: `authorizeProjectSelection() calls requestsDifferentProject()`
- c0224 ..> c0224: `circuitOpen() calls now()`
- c0224 ..> c0224: `deeper() calls circuitOpen()`
- c0224 ..> c0224: `deeper() calls empty()`
- c0224 ..> c0224: `deeper() calls memoryInScope()`
- c0224 ..> c0224: `deeper() calls optionalKnowledge()`
- c0224 ..> c0224: `deeper() calls recordFailure()`
- c0224 ..> c0224: `deeper() calls recordSuccess()`
- c0224 ..> c0224: `deeper() calls resultWithKnowledge()`
- c0224 ..> c0224: `finishFailure() calls empty()`
- c0224 ..> c0224: `finishFailure() calls recordFailure()`
- c0224 ..> c0224: `finishReview() calls recordFailure()`
- c0224 ..> c0224: `finishReview() calls recordSuccess()`
- c0224 ..> c0224: `recall() calls authorizeProjectSelection()`
- c0224 ..> c0224: `recall() calls circuitOpen()`
- c0224 ..> c0224: `recall() calls empty()`
- c0224 ..> c0224: `recall() calls ensureLive()`
- c0224 ..> c0224: `recall() calls finishFailure()`
- c0224 ..> c0224: `recall() calls finishReview()`
- c0224 ..> c0224: `recall() calls memoryInScope()`
- c0224 ..> c0224: `recall() calls optionalKnowledge()`
- c0224 ..> c0224: `recall() calls plannerInput()`
- c0224 ..> c0224: `recall() calls recallReadTool()`
- c0224 ..> c0224: `recall() calls recordSuccess()`
- c0224 ..> c0224: `recall() calls resultWithKnowledge()`
- c0224 ..> c0224: `recall() calls searchMemories()`
- c0224 ..> c0224: `recall() calls searchRequest()`
- c0224 ..> c0224: `recordFailure() calls now()`
- c0224 ..> c0224: `resolveScope() calls contextProjectResolution()`
- c0224 ..> c0224: `resolveScope() calls matchResolution()`
- c0224 ..> c0224: `searchMemories() calls ensureLive()`
- c0224 ..> c0224: `searchMemories() calls searchFailure()`
- c0224 ..> c0224: `searchMemories() calls searchRequest()`
- c0224 ..> c0224: `searchRequest() calls queryContext()`
- c0224 ..> c0225: `type in constructor`
- c0224 ..> c0226: `finishReview() constructs ReviewValidationError`
- c0224 ..> c0227: `type in contextProjectResolution`
- c0224 ..> c0227: `type in matchResolution`
- c0224 ..> c0227: `type in recallReadTool`
- c0224 ..> c0227: `type in resolveScope`
- c0224 ..> c0227: `type in searchMemories`
- c0224 ..> c0227: `type in searchRequest`
- c0224 ..> c0228: `type in searchMemories`
- c0224 ..> c0229: `authorizeProjectSelection() calls raceAbort()`
- c0224 ..> c0229: `deeper() calls createDeadlineSignal()`
- c0224 ..> c0229: `deeper() calls failureReason()`
- c0224 ..> c0229: `deeper() calls formatRecall()`
- c0224 ..> c0229: `deeper() calls isForgetfulResponseError()`
- c0224 ..> c0229: `deeper() calls raceAbort()`
- c0224 ..> c0229: `deeper() calls trim()`
- c0224 ..> c0229: `ensureLive() calls abortError()`
- c0224 ..> c0229: `finishFailure() calls failureReason()`
- c0224 ..> c0229: `finishFailure() calls submissionAttemptTrace()`
- c0224 ..> c0229: `finishReview() calls parseReview()`
- c0224 ..> c0229: `finishReview() calls reviewMismatchDirection()`
- c0224 ..> c0229: `finishReview() calls reviewSources()`
- c0224 ..> c0229: `finishReview() calls reviewValidationDebug()`
- c0224 ..> c0229: `finishReview() calls sourceLabels()`
- c0224 ..> c0229: `finishReview() calls submissionAttemptTrace()`
- c0224 ..> c0229: `optionalKnowledge() calls raceAbort()`
- c0224 ..> c0229: `plannerInput() calls availableProjects()`
- c0224 ..> c0229: `recall() calls boundDebugText()`
- c0224 ..> c0229: `recall() calls createDeadlineSignal()`
- c0224 ..> c0229: `recall() calls formatRecall()`
- c0224 ..> c0229: `recall() calls parsePlan()`
- c0224 ..> c0229: `recall() calls raceAbort()`
- c0224 ..> c0229: `recall() calls recallReviewSubmission()`
- c0224 ..> c0229: `recall() calls reviewSources()`
- c0224 ..> c0229: `recall() calls sanitizePolicy()`
- c0224 ..> c0229: `recall() calls submissionAttemptTrace()`
- c0224 ..> c0229: `recall() calls trim()`
- c0224 ..> c0229: `recallReadTool() calls abortError()`
- c0224 ..> c0229: `recallReadTool() calls reviewSources()`
- c0224 ..> c0229: `resolveScope() calls availableProjects()`
- c0224 ..> c0229: `searchMemories() calls exceptionDiagnostic()`
- c0224 ..> c0229: `searchMemories() calls isAbort()`
- c0224 ..> c0229: `searchMemories() calls raceAbort()`
- c0224 ..> c0229: `searchRequest() calls repoAwareQuery()`
- c0227 --> c0101: `field project`
- c0228 --> c0089: `field memories`
- c0229 ..> c0004: `availableProjects() calls set()`
- c0229 ..> c0089: `type in formatRecall`
- c0229 ..> c0089: `type in validateMemory`
- c0229 ..> c0099: `type in recallReviewSubmission`
- c0229 ..> c0101: `type in availableProjects`
- c0229 ..> c0107: `type in availableProjects`
- c0229 ..> c0107: `type in repoAwareQuery`
- c0229 ..> c0107: `type in repositoryIdentity`
- c0229 ..> c0144: `type in formatRecall`
- c0229 ..> c0196: `exceptionDiagnostic() calls sanitizeText()`
- c0229 ..> c0196: `formatRecall() calls sanitizeText()`
- c0229 ..> c0196: `parseReview() calls sanitizeText()`
- c0229 ..> c0196: `plannerString() calls sanitizeText()`
- c0229 ..> c0196: `repoAwareQuery() calls sanitizeText()`
- c0229 ..> c0196: `repositoryIdentity() calls sanitizeText()`
- c0229 ..> c0196: `reviewMismatchDirection() calls sanitizeText()`
- c0229 ..> c0196: `reviewerOutputText() calls sanitizeText()`
- c0229 ..> c0196: `reviewerOutputText() calls sanitizeValue()`
- c0229 ..> c0196: `sanitizePolicy() calls sanitizeText()`
- c0229 ..> c0196: `submissionAttemptTrace() calls sanitizeText()`
- c0229 ..> c0219: `type in createDeadlineSignal`
- c0229 ..> c0219: `type in failureReason`
- c0229 ..> c0221: `type in parsePlan`
- c0229 ..> c0223: `type in parseReview`
- c0229 ..> c0223: `type in recallReviewSubmission`
- c0229 ..> c0223: `type in reviewSources`
- c0229 ..> c0223: `type in reviewValidationDebug`
- c0229 ..> c0224: `createDeadlineSignal() calls now()`
- c0229 ..> c0229: `createDeadlineSignal() calls exceptionDiagnostic()`
- c0229 ..> c0229: `formatRecall() calls trim()`
- c0229 ..> c0229: `parseEntities() calls plannerString()`
- c0229 ..> c0229: `parsePlan() calls isObject()`
- c0229 ..> c0229: `parsePlan() calls parseEntities()`
- c0229 ..> c0229: `parsePlan() calls parseQueries()`
- c0229 ..> c0229: `parsePlan() calls plannerString()`
- c0229 ..> c0229: `parsePlan() calls positiveInteger()`
- c0229 ..> c0229: `parseQueries() calls plannerString()`
- c0229 ..> c0229: `parseReview() calls isObject()`
- c0229 ..> c0229: `parseReview() calls reviewSources()`
- c0229 ..> c0229: `parseReview() calls sourceLabels()`
- c0229 ..> c0229: `parseReview() calls trim()`
- c0229 ..> c0229: `plannerString() calls trim()`
- c0229 ..> c0229: `raceAbort() calls abortError()`
- c0229 ..> c0229: `repoAwareQuery() calls repositoryIdentity()`
- c0229 ..> c0229: `repoAwareQuery() calls trim()`
- c0229 ..> c0229: `repositoryIdentity() calls trim()`
- c0229 ..> c0229: `reviewMismatchDirection() calls isObject()`
- c0229 ..> c0229: `reviewMismatchDirection() calls trim()`
- c0229 ..> c0229: `reviewValidationDebug() calls boundDebugText()`
- c0229 ..> c0229: `reviewValidationDebug() calls reviewSources()`
- c0229 ..> c0229: `reviewValidationDebug() calls reviewerOutputText()`
- c0229 ..> c0229: `reviewValidationDebug() calls sourceLabels()`
- c0229 ..> c0229: `submissionAttemptTrace() calls trim()`
- c0229 ..> c0229: `validateMemory() calls isObject()`
- c0230 ..> c0229: `repositoryName() calls trim()`
- c0232 ..> c0231: `type in buildSetupPrompt`
- c0232 ..> c0231: `type in promptSetupHelp`
- c0233 --|> c0071: `inherits`
- c0235 --> c0070: `field mode`
- c0235 --> c0104: `field scope`
- c0235 --> c0107: `field context`
- c0235 --> c0237: `field session`
- c0236 --> c0233: `field snapshot`
- c0238 ..> c0069: `type in captureSummaryRecord`
- c0238 ..> c0069: `type in reuseCaptureHistory`
- c0238 ..> c0071: `type in captureConversation`
- c0238 ..> c0071: `type in compactCaptureSnapshot`
- c0238 ..> c0071: `type in reuseCaptureHistory`
- c0238 ..> c0071: `type in sanitizeCaptureSnapshot`
- c0238 ..> c0075: `type in compactCaptureSnapshot`
- c0238 ..> c0084: `type in collectEvidence`
- c0238 ..> c0084: `type in evidenceForEntry`
- c0238 ..> c0084: `type in toolEvidence`
- c0238 ..> c0196: `captureSummaryRecord() calls sanitizeText()`
- c0238 ..> c0196: `compactCaptureSnapshot() calls sanitizeText()`
- c0238 ..> c0196: `conversationForEntry() calls isMemoryOperation()`
- c0238 ..> c0196: `safeText() calls sanitizeText()`
- c0238 ..> c0196: `sanitizeCaptureSnapshot() calls sanitizeValue()`
- c0238 ..> c0196: `sanitizeConversation() calls sanitizeText()`
- c0238 ..> c0196: `sanitizeConversation() calls sanitizeValue()`
- c0238 ..> c0196: `toolEvidence() calls isMemoryOperation()`
- c0238 ..> c0196: `toolEvidence() calls sanitizeValue()`
- c0238 ..> c0229: `compactCaptureSnapshot() calls trim()`
- c0238 ..> c0229: `safeText() calls trim()`
- c0238 ..> c0234: `type in asMessage`
- c0238 ..> c0234: `type in lastAssistantEntry`
- c0238 ..> c0234: `type in toolEvidence`
- c0238 ..> c0235: `type in buildCaptureSnapshot`
- c0238 ..> c0235: `type in collectEvidence`
- c0238 ..> c0235: `type in toolEvidence`
- c0238 ..> c0236: `type in buildCaptureSnapshot`
- c0238 ..> c0238: `asMessage() calls isRecord()`
- c0238 ..> c0238: `buildCaptureSnapshot() calls collectEvidence()`
- c0238 ..> c0238: `buildCaptureSnapshot() calls deltaStartIndex()`
- c0238 ..> c0238: `buildCaptureSnapshot() calls lastAssistantEntry()`
- c0238 ..> c0238: `buildCaptureSnapshot() calls rootId()`
- c0238 ..> c0238: `buildCaptureSnapshot() calls snapshotId()`
- c0238 ..> c0238: `captureConversation() calls isRecord()`
- c0238 ..> c0238: `collectEvidence() calls evidenceForEntry()`
- c0238 ..> c0238: `compactCaptureSnapshot() calls captureConversation()`
- c0238 ..> c0238: `compactCaptureSnapshot() calls captureSummaryRecord()`
- c0238 ..> c0238: `compactCaptureSnapshot() calls isRecord()`
- c0238 ..> c0238: `contentText() calls isRecord()`
- c0238 ..> c0238: `conversationForEntry() calls asMessage()`
- c0238 ..> c0238: `conversationForEntry() calls isRecord()`
- c0238 ..> c0238: `conversationForEntry() calls sanitizeConversation()`
- c0238 ..> c0238: `evidenceForEntry() calls asMessage()`
- c0238 ..> c0238: `evidenceForEntry() calls contentText()`
- c0238 ..> c0238: `evidenceForEntry() calls isRecord()`
- c0238 ..> c0238: `evidenceForEntry() calls safeText()`
- c0238 ..> c0238: `evidenceForEntry() calls toolEvidence()`
- c0238 ..> c0238: `lastAssistantEntry() calls asMessage()`
- c0238 ..> c0238: `reuseCaptureHistory() calls captureSummaryRecord()`
- c0238 ..> c0238: `reuseCaptureHistory() calls isRecord()`
- c0238 ..> c0238: `sanitizeCaptureSnapshot() calls sanitizeCaptureConversation()`
- c0238 ..> c0238: `sanitizeConversation() calls isRecord()`
- c0238 ..> c0238: `toolEvidence() calls contentText()`
- c0238 ..> c0238: `toolEvidence() calls safeText()`
- c0241 --> c0239: `field error`
- c0241 --> c0239: `field provenanceError`
- c0242 ..> c0004: `readFile() calls close()`
- c0242 ..> c0047: `getUrl() calls resolve()`
- c0242 ..> c0047: `git() calls resolve()`
- c0242 ..> c0047: `inspect() calls resolve()`
- c0242 ..> c0134: `getUrl() calls get()`
- c0242 ..> c0160: `readFile() calls readFile()`
- c0242 ..> c0174: `git() calls execute()`
- c0242 ..> c0196: `inspect() calls sanitizeValue()`
- c0242 ..> c0196: `inspectUrl() calls sanitizeText()`
- c0242 ..> c0196: `inspectUrl() calls sanitizeValue()`
- c0242 ..> c0229: `provenance() calls trim()`
- c0242 ..> c0240: `type in inspectUrl`
- c0242 ..> c0241: `type in inspect`
- c0242 ..> c0241: `type in inspectUrl`
- c0242 ..> c0242: `getUrl() calls check()`
- c0242 ..> c0242: `git() calls check()`
- c0242 ..> c0242: `inspect() calls check()`
- c0242 ..> c0242: `inspect() calls inspectUrl()`
- c0242 ..> c0242: `inspect() calls provenance()`
- c0242 ..> c0242: `inspect() calls readFile()`
- c0242 ..> c0242: `inspectUrl() calls check()`
- c0242 ..> c0242: `inspectUrl() calls getUrl()`
- c0242 ..> c0242: `provenance() calls git()`
- c0242 ..> c0242: `readFile() calls check()`
- c0242 --> c0243: `field options`
- c0242 ..> c0243: `type in constructor`
- c0242 ..> c0244: `getUrl() calls validateAddress()`
- c0242 ..> c0244: `getUrl() calls validateUrl()`
- c0242 ..> c0244: `git() calls requireInside()`
- c0242 ..> c0244: `inspect() calls errorDetails()`
- c0242 ..> c0244: `inspect() calls requireInside()`
- c0242 ..> c0244: `inspect() calls sourceContent()`
- c0242 ..> c0244: `inspectUrl() calls loopback()`
- c0242 ..> c0244: `inspectUrl() calls sourceContent()`
- c0242 ..> c0244: `inspectUrl() calls validateUrl()`
- c0242 ..> c0244: `provenance() calls errorDetails()`
- c0242 ..> c0244: `readFile() calls requireInside()`
- c0244 ..> c0196: `errorDetails() calls sanitizeText()`
- c0244 ..> c0196: `sourceContent() calls sanitizeText()`
- c0244 ..> c0196: `validateUrl() calls sanitizeText()`
- c0244 ..> c0196: `validateUrl() calls sanitizeValue()`
- c0244 ..> c0239: `type in errorDetails`
- c0244 ..> c0240: `type in sourceContent`
- c0244 ..> c0242: `validateAddress() calls check()`
- c0244 ..> c0244: `validateAddress() calls loopback()`

## Type key

- Type1: `(text: string) => string`
- Type2: `"ready" | "needs-review" | "exhausted"`
- Type3: `"correctable" | "retry"`
- Type4: `{ tool: ModelReadTool; requireObserved: () => void; }`
- Type5: `"pending" | "planned" | "complete" | "partial" | "unsupported"`
- Type6: `Array<{ memoryId: number; reason: string }>`
- Type7: `{ documents: Document[]; codeArtifacts: CodeArtifact[] }`
- Type8: `Array<{ operation: string; error: string }>`
- Type9: `"link" | "unlink" | "attachments" | "entity"`
- Type10: `"started" | "completed" | "failed"`
- Type11: `"keep" | "reject" | "add" | "ignore" | "unresolved"`
- Type12: `"complete" | "unresolved"`
- Type13: `Promise<Memory | undefined>`
- Type14: `NonNullable<CaptureLinkReview["unreviewed"]>`
- Type15: `{ automaticIds?: number[]; beforeRead: () => Promise<void>; includeAttachments?: boolean
  }`
- Type16: `Map<string, boolean>`
- Type17: `Map<string, { decisions: LinkDecision[]; preservation?: PreservationDecision }>`
- Type18: `Array<{ candidateId: string; review: CaptureLinkReview }>`
- Type19: `ConnectionResult["operation"]`
- Type20: `(markDispatched: () => void) => Promise<unknown>`
- Type21: `(review: CaptureLinkReview) => Promise<void>`
- Type22: `() => Promise<void>`
- Type23: `() => void`
- Type24: `Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Type25: `Record<string, { status: "started" | "completed" | "rejected"; error?: string; input?:
  unknown; }>`
- Type26: `(number[] | undefined)[]`
- Type27: `number | null | undefined`
- Type28: `Pick<MergeConnections, "documentIds" | "codeArtifactIds" | "fileIds">`
- Type29: `Array<{ id: string; reason: string }>`
- Type30: `| { valid: true; value: T } | { valid: false; reason: string }`
- Type31: `"create" | "skip" | "supersede" | "escalate" | "retire" | "merge"`
- Type32: `"reviewing" | "saving" | "checking"`
- Type33: `"memory" | "maintenance"`
- Type34: `"userDecision" | "verifiedToolChange" | "observation"`
- Type35: `Array<{ jobId: string; error: string }>`
- Type36: `"ready" | "busy"`
- Type37: `{ status: CaptureLinkReview["status"]; unreviewedCount: number; reason?: string }`
- Type38: `PendingConflict["status"]`
- Type39: `{ error: unknown }`
- Type40: `{ entryId: string; inspectionEntryIds: string[] } | null`
- Type41: `"resolved" | "deferred" | "rejected"`
- Type42: `Array<{ key: string; id: number }>`
- Type43: `(id: number) => Promise<Memory>`
- Type44: `() => boolean | Promise<boolean>`
- Type45: `() => CaptureMode | Promise<CaptureMode>`
- Type46: `() => boolean`
- Type47: `() => Date`
- Type48: `CaptureServiceOptions["onActivity"]`
- Type49: `() => Promise<T>`
- Type50: `(signal: AbortSignal) => Promise<T>`
- Type51: `"reviewing" | "checking"`
- Type52: `"info" | "debug"`
- Type53: `Record<string, unknown>`
- Type54: `"capture" | "overlap" | "overlapBatch"`
- Type55: `Promise<number | undefined>`
- Type56: `"created" | "skipped" | "replacement-created"`
- Type57: `number | undefined`
- Type58: `Promise<"applied" | "already">`
- Type59: `Promise<{ job: QueueJob; destination?: number }>`
- Type60: `Promise< | { status: "ready"; job: QueueJob; outcome: Record<string, unknown> |
  undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob } >`
- Type61: `Record<string, unknown> | undefined`
- Type62: `Promise<Entity | undefined>`
- Type63: `Promise<{ entities: Entity[]; truncated: boolean }>`
- Type64: `Promise<{ relationships: EntityRelationship[]; truncated: boolean }>`
- Type65: `Promise<{ job: QueueJob; inputs: CaptureBatchInput[] }>`
- Type66: `Promise< | { status: "ready"; job: QueueJob; decision: CaptureDecision } | { status:
  "skipped"; job: QueueJob } >`
- Type67: `Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Type68: `Promise<{ job: QueueJob; candidates: CaptureCandidate[]; progress?: boolean }>`
- Type69: `{ candidate: CaptureCandidate; decision?: CaptureDecision }`
- Type70: `CaptureMergePlan | undefined`
- Type71: `Promise<QueueJob | undefined>`
- Type72: `CaptureUncertainWrite | undefined`
- Type73: `Promise<{ job: QueueJob; stopped: boolean }>`
- Type74: `CaptureLinkReview | undefined`
- Type75: `Promise<{ job: QueueJob; inputs: Array<{ candidateId: string; review: CaptureLinkReview
  }> }>`
- Type76: `{ candidate: CaptureCandidate; outcome: Record<string, unknown>; review:
  CaptureLinkReview; operation: string; error: unknown; }`
- Type77: `Promise<{ job: QueueJob; needsCorrection: boolean }>`
- Type78: `Promise<"progress" | void>`
- Type79: `Promise<"advance" | "progress" | "deferred">`
- Type80: `CaptureSnapshot | CaptureCheckpointOptions`
- Type81: `{ sessionId?: string; branchId?: string; jobId?: string; limit?: number; }`
- Type82: `{ sessionId?: string; branchId?: string; }`
- Type83: `{ sessionId?: string; branchId?: string } | string`
- Type84: `Promise<NonNullable<PendingConflict["replacement"]>>`
- Type85: `CaptureAdvanceInput | CaptureSnapshot`
- Type86: `Pick<WorkContext, "sessionId" | "branchId">`
- Type87: `(phase: CaptureActivityPhase | undefined) => void`
- Type88: `{ id: number; name: string }[]`
- Type89: `"supersede" | "skip" | "defer"`
- Type90: `CaptureDecision | undefined`
- Type91: `string | undefined`
- Type92: `(id: string, raw: unknown, reason?: string) => void`
- Type93: `(reason: string) => void`
- Type94: `number[] | undefined`
- Type95: `string[] | undefined`
- Type96: `"reason" | "oldClaim" | "newClaim"`
- Type97: `KnowledgeWritePlan | undefined`
- Type98: `(item: T, index: number) => Promise<R>`
- Type99: `{ userSettings: string; projectSettings: string; }`
- Type100: `"classification" | "recall" | "capture"`
- Type101: `"default" | "project" | "invalid"`
- Type102: `"debug" | "info" | "warning" | "error"`
- Type103: `value is Record<string, unknown>`
- Type104: `ModelSelection | undefined`
- Type105: `{ scope: Scope; scopeSource: ScopeSource }`
- Type106: `Partial< Pick< PersistedUserSettings, | "base_url" | "token_env" | "timeout_ms" |
  "enabled" | "capture_mode" | "debug" | "verbosity" | "logging" | "log_directory" |
  "recall_model_timeout_ms" | "recall_concurrency" | "context_limit_tokens" | "model" > >`
- Type107: `{ baseUrl: string; tokenEnv?: string }`
- Type108: `"auto" | "observe" | "off"`
- Type109: `"complete" | "legacy-partial" | "summarized"`
- Type110: `string | null`
- Type111: `number | null`
- Type112: `Omit<CodeArtifact, "code">`
- Type113: `Omit<Document, "content">`
- Type114: `"Organization" | "Individual" | "Team" | "Device" | "System" | "Other"`
- Type115: `"user" | "assistant" | "toolResult"`
- Type116: `Promise<{ id: number; title: string }[]>`
- Type117: `Promise<"ready" | "progress">`
- Type118: `"classification" | "recall-review" | "capture" | "overlap"`
- Type119: `(view: CompactedConversation) => Promise<void>`
- Type120: `() => unknown`
- Type121: `{ jobId?: string; sessionId?: string; branchId?: string; candidateId?: string; }`
- Type122: `"global" | "project"`
- Type123: `Array<{ key: string; stage: string; reason?: string; count?: number }>`
- Type124: `{ detail: string; retryPending: boolean; key: string }`
- Type125: `| { kind: "completed"; value: T } | { kind: "aborted" } | { kind: "timed-out" } | {
  kind: "failed"; error: unknown }`
- Type126: `"completed"`
- Type127: `"aborted"`
- Type128: `"timed-out"`
- Type129: `"failed"`
- Type130: `{ sessionId: string; branchId: string; entryIds: string[]; finalEntryId?: string;
  snapshotId?: string; }`
- Type131: `void | Promise<void>`
- Type132: `{ action: "supersede" | "skip" | "defer"; reason?: string; evidenceEntryIds?: string[];
  additionalEvidence?: string; additionalEntries?: EvidenceEntry[]; conversation?: readonly
  unknown[]; }`
- Type133: `Map<string, number>`
- Type134: `(options: { baseUrl: string; token?: string; timeoutMs: number; }) => ForgetfulClient`
- Type135: `( client: ForgetfulClient, model: PiMemoryModel, config: ForgetfulConfig, ) =>
  RecallServicePort`
- Type136: `( config: ForgetfulConfig, client: ForgetfulClient | undefined, model: PiMemoryModel |
  undefined, ) => CaptureServicePort | undefined`
- Type137: `( ctx: ExtensionContext, branchId: string, ) => Promise<ExtensionWorkContext> |
  ExtensionWorkContext`
- Type138: `Partial< Pick< LoadConfigOptions, | "userSettingsPath" | "projectSettingsPath" |
  "userPromptDir" | "projectPromptDir" > >`
- Type139: `Partial<Record<PolicyName, string>>`
- Type140: `keyof typeof DEFAULT_MEMORY_POLICIES | "capture" | "overlap"`
- Type141: `"automatic" | "queued"`
- Type142: `"pending" | "retrieval" | "terminal"`
- Type143: `RecallRequest & { sessionContext?: EvidenceEntry[] }`
- Type144: `Map<string, CaptureFeedbackState>`
- Type145: `{ throughTriggerId: number; branches: CaptureBranch[] }`
- Type146: `Map<string, PendingQueuedRecall[]>`
- Type147: `Map<string, AutomaticRecall>`
- Type148: `Map<string, RecallJob>`
- Type149: `readonly (AbortSignal | undefined)[]`
- Type150: `Promise<string | undefined>`
- Type151: `Promise<SetupAuthentication | undefined>`
- Type152: `"context" | "failure" | "no-context"`
- Type153: `{ id: string; prompt: string } | undefined`
- Type154: `Array<{ role: string; content?: unknown }>`
- Type155: `Promise<Model<any> | undefined>`
- Type156: `Model<any> | undefined`
- Type157: `"info" | "warning" | "error"`
- Type158: `"warning" | "error"`
- Type159: `CaptureCheckpointResult | undefined`
- Type160: `AutomaticCaptureJobOutcome | undefined`
- Type161: `Promise<AutomaticCaptureJobOutcome | undefined>`
- Type162: `{ failure?: NonNullable<AutomaticCaptureJobOutcome["failure"]>; recovered: boolean; }`
- Type163: `ReturnType<typeof collectCaptureFeedback>`
- Type164: `{ message?: string; terminalJobIds: string[] }`
- Type165: `(value: unknown) => Memory`
- Type166: `( path: string, method: string, body: unknown, signal: AbortSignal | undefined,
  statuses: number[], ) => Promise<unknown>`
- Type167: `Partial<DocumentInput | CodeArtifactInput>`
- Type168: `DocumentSummary | CodeArtifactSummary`
- Type169: `string | URL`
- Type170: `AbortSignal | undefined`
- Type171: `T | undefined`
- Type172: `NonNullable<KnowledgeExpansionResult["failures"]>`
- Type173: `{ operation: string; message: string }[]`
- Type174: `KnowledgeReadServiceOptions | MemoryReader`
- Type175: `Promise<Map<number, Entity>>`
- Type176: `Map<number, Entity>`
- Type177: `({ id: number; title: string }[] | undefined)[]`
- Type178: `( id: number, signal?: AbortSignal, ) => Promise<Memory>`
- Type179: `Promise<T | undefined>`
- Type180: `Record<string, unknown> & { operation: string }`
- Type181: `{ id: number; name: string }`
- Type182: `Array<ToolText | ToolImage>`
- Type183: `"image"`
- Type184: `"text"`
- Type185: `Array<[string, number]>`
- Type186: `Document | CodeArtifact`
- Type187: `"content" | "code"`
- Type188: `{ items: T[]; offset: number; limit: number; total: number; truncated: boolean }`
- Type189: `{ items: unknown[]; offset: number; limit: number; total: number; truncated: boolean;
  next_offset: number }`
- Type190: `{ content: Array<ToolText | ToolImage>; kind: string }`
- Type191: `{ source_repo?: string; source_files?: string[]; encoding_version?: string; }`
- Type192: `(() => Promise<void>) | undefined`
- Type193: `( state: KnowledgeWriteState, ) => Promise<void>`
- Type194: `{ title: string; content: string }`
- Type195: `{ kind: string; key: string; occurrence: number; input: unknown; error: string }`
- Type196: `{ kind: string; key: string; occurrence: number; input: unknown; create: () =>
  Promise<T>; }`
- Type197: `KnowledgeWriteGuard | undefined`
- Type198: `{ document_ids?: number[]; code_artifact_ids?: number[]; }`
- Type199: `{ kind: string; key: string; input: unknown; execute: () => Promise<unknown> }`
- Type200: `T & { occurrence: number }`
- Type201: `Pick< KnowledgeClient, | "getEntity" | "createEntity" | "getDocument" | "createDocument"
  | "getCodeArtifact" | "createCodeArtifact" | "createRelationship" | "linkEntityMemory" |
  "linkMemories" | "updateMemory" >`
- Type202: `{ key: string }[]`
- Type203: `"off" | "info" | "debug"`
- Type204: `{ directory: string; sessionId: string; level: FileLogLevel; onError?: (error: unknown)
  => void; maxFileBytes?: number; maxFiles?: number; maxEventBytes?: number; }`
- Type205: `CompactedMemoryHistory & { summaryMessage: Message }`
- Type206: `CompactedMemoryHistory | undefined`
- Type207: `(history: CompactedMemoryHistory) => Promise<void>`
- Type208: `Promise<number | "progress">`
- Type209: `( context: Context, options: SimpleStreamOptions, ) => Promise<AssistantMessage>`
- Type210: `ToolResultMessage["content"]`
- Type211: `Promise<{ summary: string; count: number }>`
- Type212: `( headers: ProviderHeaders, ) => ProviderHeaders | Promise<ProviderHeaders>`
- Type213: `ModelRegistryPort & { getAvailable?: () => Model<any>[]; }`
- Type214: `readonly { model: Model<any> }[]`
- Type215: `"task" | "compaction"`
- Type216: `() => Promise<number>`
- Type217: `ProviderHeaders | undefined`
- Type218: `MemoryModelHeaderTransform | undefined`
- Type219: `ModelSubmissionTool | ModelReadTool`
- Type220: `PiMemoryModel | undefined`
- Type221: `Project | undefined`
- Type222: `Promise<ProjectInput | undefined>`
- Type223: `Promise<Project | undefined>`
- Type224: `DurableQueueStoreOptions | string`
- Type225: `( state: QueueState, ) => | Promise<{ value: T; changed?: boolean }> | { value: T;
  changed?: boolean }`
- Type226: `WatermarkAdvance | CaptureSnapshot`
- Type227: `WorkContext & { projects?: Project[] }`
- Type228: `Promise<{ job: QueueJob; historyError?: string }>`
- Type229: `Promise<{ history?: NonNullable<SnapshotPayload["historySummary"]>; historyError?:
  string; }>`
- Type230: `Array<{ sessionId: string; branchId: string }>`
- Type231: `{ sessionId: string; branchId: string }`
- Type232: `(outcomes: Array<{ jobId: string; error: string }>) => void`
- Type233: `{ sessionId: string; branchId: string } | undefined`
- Type234: `QueueCheckpoint | string`
- Type235: `Promise<PendingConflict | undefined>`
- Type236: `"pending" | "handed_off" | "resolved" | "rejected"`
- Type237: `{ // Missing version identifies legacy implicit preservation plans; never execute as
  explicit. planVersion?: 1; requestKey?: string; requestPayload?: string; request?: {
  evidenceEntryIds: string[]; selectedAdditionalEntries: EvidenceEntry[]; reason?: string;
  additionalEvidence?: string; }; // The model's update selection and this plan's actual target are
  distinct from older targets. replacementMemoryId?: number; memoryId?: number; priorMemoryId?:
  number; updateComplete?: boolean; executionError?: string; // Service creation output, separate
  from model-selected manual link operations. autoLinkedMemoryIds?: number[]; completedEntityIds?:
  number[]; completedMemoryIds?: number[]; creationError?: string; input: MemoryInput; candidate:
  unknown; entityIds: number[]; memoryIds: number[]; linksComplete?: boolean; creationAttempted?:
  boolean; knowledgeState?: unknown; }`
- Type238: `Omit<CaptureSnapshot, "entries" | "conversation" | "sourceConversation">`
- Type239: `| "pending" | "running" | "paused" | "complete" | "failed"`
- Type240: `1 | 2`
- Type241: `Record<string, QueueWatermark>`
- Type242: `Pick<CaptureSnapshot, "entries" | "conversation" | "sourceConversation" |
  "historySummary"> & { /** Full source ordering for completed caches; kept outside the bounded
  queue index. */ historyEntryIds?: string[]; }`
- Type243: `"retire"`
- Type244: `{ throughEntryId: string; entryIds: string[]; } | undefined`
- Type245: `{ throughEntryId: string; entryIds: string[] }`
- Type246: `{ throughEntryId?: string; entryIds?: string[] }`
- Type247: `(stage: string, error: unknown) => string`
- Type248: `NonNullable<ModelRequest["diagnosticContext"]>`
- Type249: `(projectId: number, reason: string) => Promise<boolean>`
- Type250: `(plan: RecallPlan) => void`
- Type251: `() => number`
- Type252: `{ stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }`
- Type253: `Promise<KnowledgeExpansionResult | undefined>`
- Type254: `KnowledgeExpansionResult | undefined`
- Type255: `Project[] | undefined`
- Type256: `error is Error & { responseBody: string }`
- Type257: `Memory | undefined`
- Type258: `{ text: string; ids: number[]; knowledgeText: string }`
- Type259: `Record<keyof typeof SOURCE_FIELDS, number[]>`
- Type260: `"Review" | "Planner"`
- Type261: `{ summary: string; reason: string; sources: ReturnType<typeof reviewSources>; }`
- Type262: `(debug: string) => void`
- Type263: `"CLI" | "MCP"`
- Type264: `Promise<SetupHelp | "manual" | undefined>`
- Type265: `(toolName: string, text: string) => boolean`
- Type266: `| { status: "ready"; snapshot: CaptureSnapshotWithStatus } | { status: "skipped";
  reason: string; finalEntryId?: string }`
- Type267: `"ready"`
- Type268: `"skipped"`
- Type269: `MessageRecord | undefined`
- Type270: `string | null | undefined`
- Type271: `EvidenceEntry | undefined`
- Type272: `SnapshotOptions["includeToolEvidence"]`
- Type273: `| ((toolName: string, text: string) => boolean) | undefined`
- Type274: `{ entry: SessionEntry; message: MessageRecord } | undefined`
- Type275: `CaptureHistorySummary | undefined`
- Type276: `Pick< Static<typeof SOURCE_INSPECTION_PARAMETERS>, "offset" | "limit" > & ({ path:
  string; url?: never } | { url: string; path?: never })`
- Type277: `{ status: "ok"; identifier: string; content: string; observedAt: string; /** SHA-256 of
  the complete observed source bytes, before sanitizing or paging. */ contentHash: string;
  sanitized: boolean; page: { offset: number; totalCharacters: number; nextOffset?: number };
  source_repo?: string; source_files?: string[]; source_url?: string; encoding_version?: string; /**
  Describes the observed file bytes, not the repository/index as a whole. */ fileState?: "committed"
  | "modified" | "uncommitted" | "unknown"; provenanceError?: SourceInspectionError; httpStatus?:
  number; } | { status: "error"; observedAt: string; error: SourceInspectionError; source_url?:
  string; httpStatus?: number; httpStatusText?: string; body?: string; }`
- Type278: `"ok"`
- Type279: `{ offset: number; totalCharacters: number; nextOffset?: number }`
- Type280: `"committed" | "modified" | "uncommitted" | "unknown"`
- Type281: `"error"`
- Type282: `{ path: string; dev: number; ino: number }`
- Type283: `SourceInspectionRequest & { url: string }`
- Type284: `Promise<{ bytes: Buffer; status: number; statusText: string; location?: string; }>`

## Signature key

- Signature1: `prepareLinkReview(client: ForgetfulClient, memoryId: number, destination: number,
  scope: Scope, overlaps: Memory[], options: { automaticIds?: number[]; beforeRead: () =>
  Promise<void>; includeAttachments?: boolean }) Promise<CaptureLinkReview>`
- Signature2: `validateLinkDecisions(decisions: LinkDecision[], review: CaptureLinkReview, edges:
  Map<string, boolean>, candidateId: string) void`
- Signature3: `authorizedMemory(client: ForgetfulClient, id: number, destination: number, scope:
  Scope) Promise<Memory>`
- Signature4: `executeConnection(review: CaptureLinkReview, operation:
  ConnectionResult["operation"], targetId: number, execute: (markDispatched: () => void) =>
  Promise<unknown>, save: (review: CaptureLinkReview) => Promise<void>) Promise<void>`
- Signature5: `applyLinkReview(client: ForgetfulClient, destination: number, scope: Scope, initial:
  CaptureLinkReview, save: (review: CaptureLinkReview) => Promise<void>, beforeWrite: () =>
  Promise<void>, assertCanWrite: () => void) Promise<CaptureLinkReview>`
- Signature6: `readAttachmentRecords(client: ForgetfulClient, memory: Memory, beforeRead: () =>
  Promise<void>) Promise<{ documents: Document[]; codeArtifacts: CodeArtifact[] }>`
- Signature7: `preparePreviousConnections(client: ForgetfulClient, expected: Memory, _replacementId:
  number, _destination: number, beforeRead: () => Promise<void>) Promise<PreviousConnections>`
- Signature8: `preserveConnections(client: ForgetfulClient, initial: CaptureLinkReview, beforeWrite:
  () => Promise<void>, save: (review: CaptureLinkReview) => Promise<void>, assertCanWrite: () =>
  void) Promise<CaptureLinkReview>`
- Signature9: `collectMergeConnections(client: ForgetfulClient, memories: Memory[], previous:
  MergeConnections) Promise<MergeConnections>`
- Signature10: `requireResourceScope(id: number, projectId: number | null | undefined, kind: string,
  access: MergeAccess) void`
- Signature11: `checkMergeAttachments(client: ForgetfulClient, plan: Pick<MergeConnections,
  "documentIds" | "codeArtifactIds" | "fileIds">, access: MergeAccess) Promise<void>`
- Signature12: `preflightMergeConnections(client: ForgetfulClient, plan: MergeConnections, access:
  MergeAccess) Promise<void>`
- Signature13: `preserveMergeConnections(client: ForgetfulClient, replacementId: number, plan:
  MergeConnections, options: MergeExecution) Promise<void>`
- Signature14: `-addConflict(job: QueueJob, candidate: CaptureCandidate, destinationProjectId:
  number, decision: CaptureDecision, reason: string, oldMemory: Memory, replacementId: number)
  Promise<PendingConflict>`
- Signature15: `-checkpointOutcome(job: QueueJob, candidateId: string, outcome: unknown)
  Promise<QueueJob>`
- Signature16: `-destinationProjects(candidate: CaptureCandidate, context: WorkContext)
  Promise<number[]>`
- Signature17: `-validateDecision(decision: CaptureDecision, _candidate: CaptureCandidate,
  _overlaps: Memory[], _batch: unknown, _neighborhood: CaptureNeighborhood) void`
- Signature18: `-createMemory(job: QueueJob, candidate: CaptureCandidate, destination: number,
  projectIds: unknown, replacement: unknown) Promise<MemoryCreateResult>`
- Signature19: `-writeKnowledge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  memoryId: number, baseOutcome: Record<string, unknown>, finalStage: "created" | "skipped" |
  "replacement-created", existingMemory: Memory) Promise<QueueJob>`
- Signature20: `-supersessionAlreadyApplied(job: QueueJob, oldMemoryId: number, replacementId:
  number | undefined, destination: number) Promise<boolean>`
- Signature21: `-applySupersession(job: QueueJob, oldMemory: Memory, replacementId: number |
  undefined, reason: string, destination: number) Promise<"applied" | "already">`
- Signature22: `-finishSupersession(job: QueueJob, candidate: CaptureCandidate, destination: number,
  oldMemory: Memory, replacementId: number, reason: string, decision: CaptureDecision)
  Promise<QueueJob>`
- Signature23: `-processReplacementCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature24: `-processKnowledgeCheckpoint(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature25: `-loadOverlaps(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, destination: number) Promise< | { status: "ready"; job: QueueJob; outcome:
  Record<string, unknown> | undefined; overlaps: Memory[]; } | { status: "skipped"; job: QueueJob }
  >`
- Signature26: `-neighborhoodEntities(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<{ entities: Entity[]; truncated: boolean }>`
- Signature27: `-existingNeighborhood(job: QueueJob, candidate: CaptureCandidate, destination:
  number) Promise<CaptureNeighborhood>`
- Signature28: `-decideOverlap(job: QueueJob, candidate: CaptureCandidate, outcome: Record<string,
  unknown> | undefined, overlaps: Memory[], destination: number) Promise< | { status: "ready"; job:
  QueueJob; decision: CaptureDecision } | { status: "skipped"; job: QueueJob } >`
- Signature29: `-recordEscalation(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, reason: string, oldMemory: Memory, outcomeReason: string)
  Promise<QueueJob>`
- Signature30: `-supersedeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature31: `-readMaintenanceTargets(job: QueueJob, ids: number[], destination: number)
  Promise<Memory[]>`
- Signature32: `-preflightRetirement(job: QueueJob, candidateId: string, destination: number, ids:
  number[]) Promise<void>`
- Signature33: `-composeMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<{ job: QueueJob; plan: CaptureMergePlan }>`
- Signature34: `-verifyRequestedMerge(job: QueueJob, outcome: Record<string, unknown> | undefined,
  replacementId: number, destination: number) Promise<void>`
- Signature35: `-finishMerge(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision, plan: CaptureMergePlan, replacementId: number) Promise<QueueJob>`
- Signature36: `-mergeCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature37: `-retireCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  decision: CaptureDecision) Promise<QueueJob>`
- Signature38: `-equivalentMemory(job: QueueJob, candidateId: string, destination: number)
  Promise<Memory>`
- Signature39: `-skipCandidate(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature40: `-applyDecision(job: QueueJob, candidate: CaptureCandidate, destination: number,
  overlaps: Memory[], decision: CaptureDecision) Promise<QueueJob>`
- Signature41: `-processCandidate(job: QueueJob, candidate: CaptureCandidate, outcome: unknown)
  Promise<QueueJob>`
- Signature42: `-correctedCaptureOutcome(outcome: Record<string, unknown>, corrected: { candidate:
  CaptureCandidate; decision?: CaptureDecision }, rejectedMerge: CaptureMergePlan | undefined)
  Record<string, unknown>`
- Signature43: `-saveCorrectableFailure(job: QueueJob, candidate: CaptureCandidate, error: unknown)
  Promise<QueueJob | undefined>`
- Signature44: `-recordCandidateFailure(currentJob: QueueJob, candidate: CaptureCandidate, error:
  unknown, result: CaptureCheckpointResult) Promise<void>`
- Signature45: `-pauseCandidate(job: QueueJob, error: CapturePause, result: CaptureCheckpointResult)
  Promise<void>`
- Signature46: `-correctCandidateFailures(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature47: `-processCandidates(job: QueueJob, candidates: CaptureCandidate[], result:
  CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature48: `-processOrderedCandidates(job: QueueJob, candidates: CaptureCandidate[], ordered:
  CaptureCandidate[], result: CaptureCheckpointResult) Promise<{ job: QueueJob; stopped: boolean }>`
- Signature49: `-refreshLinkReview(current: QueueJob, candidates: CaptureCandidate[], outcome:
  Record<string, unknown>, mode: CaptureMode, prior: CaptureLinkReview | undefined)
  Promise<CaptureLinkReview>`
- Signature50: `-migrateLegacyLinkReview(job: QueueJob, candidateId: string, outcome: Record<string,
  unknown>) Promise<QueueJob>`
- Signature51: `-planLinkReviews(job: QueueJob, candidates: CaptureCandidate[], inputs: Array<{
  candidateId: string; review: CaptureLinkReview }>) Promise<QueueJob>`
- Signature52: `-previousSupersessionCompleted(job: QueueJob, outcome: Record<string, unknown>,
  review: CaptureLinkReview) Promise<boolean>`
- Signature53: `-finishReviewedSupersession(job: QueueJob, candidate: CaptureCandidate, outcome:
  Record<string, unknown>) Promise<QueueJob>`
- Signature54: `-runBranchWorker(branch: CaptureBranch, budget: number, result:
  CaptureCheckpointResult) Promise<void>`
- Signature55: `-recordBranchFailure(job: QueueJob, result: CaptureCheckpointResult, error: unknown,
  started: number) Promise<void>`
- Signature56: `-checkpointBranch(branch: CaptureBranch, budget: number)
  Promise<CaptureCheckpointResult>`
- Signature57: `-appendCheckpointResult(total: CaptureCheckpointResult, result:
  CaptureCheckpointResult) void`
- Signature58: `pendingConflicts(optionsOrSession: { sessionId?: string; branchId?: string } |
  string, branchId: string) Promise<CapturePendingConflict[]>`
- Signature59: `-rejectConflict(conflict: PendingConflict, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature60: `-selectResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput,
  additionalIds: string[]) string[]`
- Signature61: `-validateResolutionEvidence(conflict: PendingConflict, input: ResolveConflictInput)
  ConflictResolutionEvidence`
- Signature62: `-markConflictResolved(conflictId: string, resolution: unknown)
  Promise<CaptureResolveResult>`
- Signature63: `-planConflictReplacement(conflict: PendingConflict, candidate: CaptureCandidate,
  evidence: ConflictResolutionEvidence, context: WorkContext, current: Memory, requestPayload:
  string, conversation: readonly unknown[]) Promise<NonNullable<PendingConflict["replacement"]>>`
- Signature64: `-updateResolutionReplacement(conflict: PendingConflict, replacementId: number)
  Promise<void>`
- Signature65: `-linkResolutionEntity(conflict: PendingConflict, replacementId: number, id: number)
  Promise<void>`
- Signature66: `-applyConflictResolution(conflict: PendingConflict, evidence:
  ConflictResolutionEvidence, target: ConflictResolutionTarget, requestPayload: string,
  conversation: readonly unknown[]) Promise<CaptureResolveResult>`
- Signature67: `-resolveConflictOwned(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature68: `resolveConflict(conflictId: string, input: ResolveConflictInput)
  Promise<CaptureResolveResult>`
- Signature69: `sharedSourceEvidence(candidates: CaptureCandidate[], snapshot: CaptureSnapshot)
  EvidenceEntry[]`
- Signature70: `eligibleCandidate(value: unknown, snapshot: CaptureSnapshot, index: number)
  CandidateValidation<CaptureCandidate>`
- Signature71: `parseCandidates(value: unknown, snapshot: CaptureSnapshot, onCandidate: (id: string,
  raw: unknown, reason?: string) => void) CandidateExtraction`
- Signature72: `captureCandidateSubmission(snapshot: CaptureSnapshot, recordRejection: (reason:
  string) => void) ModelSubmissionTool`
- Signature73: `memoryInput(candidate: CaptureCandidate, projectIds: number[], context: WorkContext)
  MemoryInput`
- Signature74: `captureKnowledgePlan(candidate: CaptureCandidate, destination: number, memoryId:
  number, context: WorkContext, existingMemory: Memory, operationId: unknown, entityMemoryKeys:
  string[]) KnowledgeWritePlan | undefined`
- Signature75: `readPromptDirectory(path: string, trusted: boolean, warnings: string[])
  Promise<PromptOverlays>`
- Signature76: `mergePrompts(globalPrompts: PromptOverlays, projectPrompts: PromptOverlays)
  PromptOverlays`
- Signature77: `resolveScope(projectData: JsonReadResult, projectPath: string, trusted: boolean,
  warnings: string[]) { scope: Scope; scopeSource: ScopeSource }`
- Signature78: `+obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature79: `+supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature80: `+updateEntity(id: number, input: Partial<EntityInput>, signal: AbortSignal)
  Promise<Entity>`
- Signature81: `+createRelationship(input: EntityRelationshipInput, signal: AbortSignal)
  Promise<EntityRelationship>`
- Signature82: `+updateDocument(id: number, input: Partial<DocumentInput>, signal: AbortSignal)
  Promise<Document>`
- Signature83: `+listCodeArtifacts(projectId: number, signal: AbortSignal)
  Promise<CodeArtifactSummary[]>`
- Signature84: `+updateCodeArtifact(id: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) Promise<CodeArtifact>`
- Signature85: `+updateMemory(id: number, input: Partial<MemoryInput>, signal: AbortSignal)
  Promise<Memory>`
- Signature86: `boundedWait(promise: Promise<T>, signals: readonly (AbortSignal | undefined)[],
  timeoutMs: number) Promise<BoundedWaitOutcome<T>>`
- Signature87: `automaticRecallTerminalText(result: RecallResult, kind: "automatic" | "queued",
  resultInHistory: unknown) string`
- Signature88: `recordRecallActivity(runtime: Runtime, result: RecallResult, ctx: ExtensionContext,
  elapsedMs: number) void`
- Signature89: `conflictBelongsToActiveBranch(conflict: Record<string, unknown>, runtime: Runtime,
  ctx: ExtensionContext) boolean`
- Signature90: `discoverWorkContext(pi: ExtensionAPI, ctx: ExtensionContext, branchId: string)
  Promise<ExtensionWorkContext>`
- Signature91: `log(ctx: ExtensionContext, config: ForgetfulConfig, message: string, level:
  Verbosity, fileMessage: unknown) void`
- Signature92: `logFailure(ctx: ExtensionContext, config: ForgetfulConfig, message: string, error:
  unknown, level: "warning" | "error") void`
- Signature93: `readCaptureOutcome(capture: CaptureServicePort, runtime: Runtime, jobId: string,
  checkpointResult: CaptureCheckpointResult) Promise<AutomaticCaptureJobOutcome | undefined>`
- Signature94: `updateDocument(documentId: number, input: Partial<DocumentInput>, signal:
  AbortSignal) unknown`
- Signature95: `updateCodeArtifact(artifactId: number, input: Partial<CodeArtifactInput>, signal:
  AbortSignal) unknown`
- Signature96: `supersede(id: number, replacementId: number, reason: string, signal: AbortSignal)
  Promise<void>`
- Signature97: `obsolete(id: number, reason: string, replacementId: number, signal: AbortSignal)
  Promise<void>`
- Signature98: `-request(pathOrUrl: string | URL, method: string, body: unknown, callerSignal:
  AbortSignal | undefined, expectedStatuses: number[]) Promise<unknown>`
- Signature99: `-throwResponseError(response: Response, method: string, url: URL, signal:
  AbortSignal, maxBytes: number) Promise<never>`
- Signature100: `parseSearchPayload(payload: unknown, fallbackQuery: string, requireMetadata:
  unknown) MemorySearchResult`
- Signature101: `-findRelationships(entities: Entity[], request: ExpansionContext)
  Promise<RelationshipExpansion[]>`
- Signature102: `-collectRelationships(entities: Entity[], request: ExpansionContext)
  Promise<EntityRelationship[]>`
- Signature103: `-resolveRelationshipEndpoints(entities: Entity[], relationships:
  EntityRelationship[], request: ExpansionContext) Promise<Map<number, Entity>>`
- Signature104: `-formatRelationships(entities: Entity[], relationships: EntityRelationship[],
  endpoints: Map<number, Entity>, request: KnowledgeExpansionRequest) RelationshipExpansion[]`
- Signature105: `-findEntityMemories(entities: Entity[], request: ExpansionContext)
  Promise<LinkedMemoryExpansion[]>`
- Signature106: `-collectEntityMemories(entities: Entity[], linked: ({ id: number; title: string }[]
  | undefined)[], request: ExpansionContext) Promise<LinkedMemoryExpansion[]>`
- Signature107: `-formatExpansion(entities: Entity[], relationships: RelationshipExpansion[],
  linkedMemories: LinkedMemoryExpansion[], attachments: Attachments) KnowledgeExpansionResult`
- Signature108: `resolveWriteProject(client: ForgetfulClient, context: KnowledgeToolContext,
  requested: number | undefined, signal: AbortSignal) Promise<ResolvedWriteProject>`
- Signature109: `assertReadMemory(client: ForgetfulClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Memory>`
- Signature110: `assertReadEntity(knowledge: KnowledgeClient, id: number, context:
  KnowledgeToolContext, signal: AbortSignal) Promise<Entity>`
- Signature111: `executeKnowledgeRead(client: ForgetfulClient, rawRequest: KnowledgeReadRequest,
  context: KnowledgeToolContext, signal: AbortSignal) Promise<KnowledgeToolResult>`
- Signature112: `updateProvenance(existing: Provenance, request: Record<string, unknown>, context:
  KnowledgeToolContext, destinationProjectId: number) Provenance`
- Signature113: `memoryInProject(client: ForgetfulClient, memoryId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Memory>`
- Signature114: `entityInProject(knowledge: KnowledgeClient, entityId: number, projectId: number,
  signal: AbortSignal, editable: unknown) Promise<Entity>`
- Signature115: `hydrateEntities(knowledge: KnowledgeClient, candidates: Entity[], signal:
  AbortSignal) Promise<Entity[]>`
- Signature116: `validateAttachments(knowledge: KnowledgeClient, projectId: number, request:
  Record<string, unknown>, signal: AbortSignal) Promise<void>`
- Signature117: `createMemory(client: ForgetfulClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature118: `createEntity(knowledge: KnowledgeClient, request: Record<string, unknown>, context:
  KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite: (() =>
  Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature119: `createDocument(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature120: `createCodeArtifact(knowledge: KnowledgeClient, request: Record<string, unknown>,
  context: KnowledgeToolContext, projectId: number, signal: AbortSignal | undefined, beforeWrite:
  (() => Promise<void>) | undefined, checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature121: `executeKnowledgeWrite(client: ForgetfulClient, rawRequest: KnowledgeWriteRequest,
  context: KnowledgeToolContext, signal: AbortSignal, beforeWrite: () => Promise<void>,
  checkWriteState: () => void) Promise<KnowledgeToolResult>`
- Signature122: `constructor(client: WriteClient, readMemory: KnowledgeMemoryReader, assertCanWrite:
  () => void) unknown`
- Signature123: `-recordCreateFailure(attempt: string, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, error: unknown) Promise<void>`
- Signature124: `-createOnce(operation: { kind: string; key: string; occurrence: number; input:
  unknown; create: () => Promise<T>; }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<T>`
- Signature125: `-writeEntity(resource: ResourceSlot<KnowledgeEntityPlan>, plan: KnowledgeWritePlan,
  state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined,
  beforeWrite: KnowledgeWriteGuard | undefined) Promise<Entity>`
- Signature126: `-writeEntities(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature127: `-writeDocument(resource: ResourceSlot<KnowledgeDocumentPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<Document>`
- Signature128: `-writeDocuments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature129: `-writeCodeArtifact(resource: ResourceSlot<KnowledgeCodeArtifactPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<CodeArtifact>`
- Signature130: `-writeCodeArtifacts(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature131: `-requestedAttachmentIds(plan: KnowledgeWritePlan, state: KnowledgeWriteState)
  KnowledgeAttachmentIds`
- Signature132: `-writeConnection(operation: { kind: string; key: string; input: unknown; execute:
  () => Promise<unknown> }, plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature133: `-writeAttachments(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature134: `-writeRelationship(resource: ResourceSlot<KnowledgeRelationshipPlan>, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<EntityRelationship>`
- Signature135: `-writeRelationships(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature136: `-writeEntityMemoryLink(resource: KnowledgeEntityMemoryLinkPlan, plan:
  KnowledgeWritePlan, state: KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal |
  undefined, beforeWrite: KnowledgeWriteGuard | undefined) Promise<void>`
- Signature137: `-writeEntityMemoryLinks(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature138: `-writeLinkedMemory(linkedMemoryId: number, plan: KnowledgeWritePlan, state:
  KnowledgeWriteState, save: KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite:
  KnowledgeWriteGuard | undefined) Promise<void>`
- Signature139: `-writeLinkedMemories(plan: KnowledgeWritePlan, state: KnowledgeWriteState, save:
  KnowledgeWriteSave, signal: AbortSignal | undefined, beforeWrite: KnowledgeWriteGuard | undefined)
  Promise<void>`
- Signature140: `execute(plan: KnowledgeWritePlan, previous: Partial<KnowledgeWriteState>,
  checkpoint: KnowledgeWriteCheckpoint, signal: AbortSignal, beforeWrite: KnowledgeWriteGuard)
  Promise<KnowledgeWriteState>`
- Signature141: `stateWithNumber(values: KnowledgeWriteReceipt[], key: string, id: number,
  occurrence: number) void`
- Signature142: `constructor(model: Model<any>, task: Message, settings: CompactionSettings,
  contextLimitTokens: unknown, initialHistory: CompactedMemoryHistory & { summaryMessage: Message })
  unknown`
- Signature143: `prepare(context: Context, signal: AbortSignal, sessionId: string | undefined,
  complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) => Promise<void>)
  Promise<number>`
- Signature144: `prepareCapture(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>) Promise<"ready" | "progress">`
- Signature145: `-prepareContext(context: Context, signal: AbortSignal, sessionId: string |
  undefined, complete: SummaryCompletion, onCompacted: (history: CompactedMemoryHistory) =>
  Promise<void>, maxChunks: unknown) Promise<number | "progress">`
- Signature146: `-applySummary(context: Context, summary: string, lastRecord: Message, previousSize:
  number) number`
- Signature147: `assertFits(context: Context, model: Model<any>, output: number, contextWindow:
  number) void`
- Signature148: `outputCeiling(model: Model<any>, settings: typeof DEFAULT_COMPACTION_SETTINGS,
  requestedMaxTokens: unknown) number`
- Signature149: `resolvedOutputAllowance(context: Context, model: Model<any>, contextWindow: number,
  settings: typeof DEFAULT_COMPACTION_SETTINGS, requestedMaxTokens: unknown) number`
- Signature150: `summarizeMemoryHistory(messages: Message[], options: MemoryHistorySummaryOptions,
  previousSummary: string) Promise<{ summary: string; count: number }>`
- Signature151: `+complete(model: Model<any>, context: Context, options: ModelsSimpleStreamOptions)
  Promise<AssistantMessage>`
- Signature152: `constructor(registry: ModelRegistryPort, selection: ModelSelection, options:
  PiMemoryModelOptions) unknown`
- Signature153: `-completeAttempt(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, attempt: number,
  kind: "task" | "compaction") Promise<AssistantMessage>`
- Signature154: `-executeRead(read: ModelReadTool, call: ToolCall, request: ModelRequest, deadline:
  RequestDeadline) Promise<ToolResultMessage>`
- Signature155: `-completeWithSubmission(model: Model<any>, context: Context, options:
  ModelsSimpleStreamOptions, request: ModelRequest, deadline: RequestDeadline, prepare: () =>
  Promise<number>) Promise<unknown>`
- Signature156: `ensureCompletionFinished(response: AssistantMessage, request: ModelRequest,
  timedOut: boolean, allowToolUse: boolean) void`
- Signature157: `requestOptions(model: Model<any>, sessionId: string | undefined, transformHeaders:
  MemoryModelHeaderTransform | undefined, signal: AbortSignal) ModelsSimpleStreamOptions`
- Signature158: `appendCallCountCorrection(context: Context, response: AssistantMessage, calls:
  ToolCall[], submissionName: string, base: string, readNames: string[]) void`
- Signature159: `throwRequestFailure(error: unknown, request: ModelRequest, timedOut: boolean,
  timeoutMs: number) never`
- Signature160: `resolveMemoryModel(registry: ModelRegistryPort, selection: ModelSelection |
  undefined, options: PiMemoryModelOptions) PiMemoryModel | undefined`
- Signature161: `promptExistingProject(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string) Promise<Project | undefined>`
- Signature162: `initialiseProject(client: ForgetfulClient, ctx: ExtensionContext, repoName: string,
  ensureCurrent: () => Promise<void>) Promise<Project | undefined>`
- Signature163: `initialiseProjectForAgent(client: ForgetfulClient, ctx: ExtensionContext, repoName:
  string, input: AgentProjectInitInput, ensureCurrent: () => Promise<void>) Promise<Project>`
- Signature164: `resolveBranchId(sessionId: string, activeEntryIds: readonly string[],
  fallbackBranchId: string) Promise<string>`
- Signature165: `cancel(jobId: string, interruptedModelCall: unknown, uncertainWrite: string)
  Promise<void>`
- Signature166: `-compactJobSnapshot(job: StoredQueueJob, conversation: CompactedConversation)
  Promise<void>`
- Signature167: `pendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature168: `listPendingConflicts(identity: QueueIdentity, sessionId: string, branchId: string)
  Promise<PendingConflict[]>`
- Signature169: `updateConflict(conflictId: string, patch: Partial<PendingConflict>)
  Promise<PendingConflict>`
- Signature170: `constructor(client: ForgetfulClient, model: MemoryModelClient, options:
  RecallServiceOptions) unknown`
- Signature171: `-recallReadTool(request: RecallRequest, resolution: ScopeResolution, candidates:
  RecallResult) ModelReadTool`
- Signature172: `-finishFailure(request: RecallRequest, deadline: DeadlineSignal, error: unknown,
  trace: { stage: string; debugTrace: string; plannerRejections: string[]; reviewRejections:
  string[]; failedReviewDebug: string | undefined; }) RecallResult`
- Signature173: `-finishReview(output: unknown, candidates: RecallResult, recallPolicy: string,
  debugTrace: string, searchFailed: boolean, reviewRejections: string[]) RecallResult`
- Signature174: `-optionalKnowledge(memories: Memory[], entityNames: string[], scope: Scope,
  projectId: number | undefined, signal: AbortSignal) Promise<KnowledgeExpansionResult | undefined>`
- Signature175: `-resultWithKnowledge(result: RecallResult, expansion: KnowledgeExpansionResult |
  undefined, knowledgeText: string) RecallResult`
- Signature176: `-authorizeProjectSelection(request: RecallRequest, deadline: DeadlineSignal, plan:
  RecallPlan) Promise<string | undefined>`
- Signature177: `-requestsDifferentProject(request: RecallRequest, plan: RecallPlan, scope: Scope)
  boolean`
- Signature178: `-searchMemories(request: RecallRequest, plan: RecallPlan, scope: Scope, resolution:
  ScopeResolution, deadline: DeadlineSignal) Promise<SearchOutcome>`
- Signature179: `-searchRequest(query: string, plan: RecallPlan, context: WorkContext, scope: Scope,
  resolution: ScopeResolution) SearchRequest`
- Signature180: `-resolveScope(context: WorkContext, scope: Scope, selectedId: number | undefined,
  supplied: Project[] | undefined, signal: AbortSignal) Promise<ScopeResolution>`
- Signature181: `formatRecall(memories: Memory[], entities: string[], recallPolicy: string,
  expansion: KnowledgeExpansionResult) { text: string; ids: number[]; knowledgeText: string }`
- Signature182: `reviewValidationDebug(value: unknown, candidates: RecallResult, mismatchDirection:
  string | undefined) string`
- Signature183: `recallReviewSubmission(candidates: RecallResult, rejections: string[], setDebug:
  (debug: string) => void) ModelSubmissionTool`
- Signature184: `deltaStartIndex(branch: SessionEntry[], afterEntryId: string | null | undefined,
  baselineEntryId: string | null | undefined) number | undefined`
- Signature185: `compactCaptureSnapshot(snapshot: CaptureSnapshot, view: CompactedConversation)
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
- `Unresolved or out-of-scope base: ProjectInitError -> Error`
- `Unresolved or out-of-scope base: QueueBusyError -> Error`
- `Unresolved or out-of-scope base: QueueJobMetadata -> Omit<QueueJob, "snapshot">`
- `Unresolved or out-of-scope base: ReviewValidationError -> Error`
