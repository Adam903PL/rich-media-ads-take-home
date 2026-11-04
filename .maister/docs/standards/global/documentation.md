## Documentation

### Decision Log Entries
Record every decision in `DECISIONS.md` as one line, newest at the bottom, grouped by stage: `**D-XXX Topic:** decision — why`. Number decisions sequentially. Significant choices (e.g. game rendering, background source, collision, scaling, audio) also get a detailed record that the line links to.

### Detailed Decision Records
A detailed record lives at `docs/decisions/D-XXX-topic.md` and follows `docs/decisions/_template.md`: header with date, stage step and status (proposed | accepted | superseded by D-YYY), then Context (with linked evidence), Options (pros/cons), Decision (choice and main reason) and Consequences (weight, accuracy vs design, follow-up work).

### Questions Have Defaults
Document every open question or asset/design conflict in `docs/questions.md` before building it, with a default that is built if no answer arrives, the roadmap steps it blocks and a status. When an answer arrives, add date, answer and resulting change to the Answers log, mark the row `answered` and link the decision it affected.

### Stage Logs and Roadmap
When a roadmap step is done, tick it in `.maister/docs/project/roadmap.md` with planned/actual hours and update its entry in `docs/stages/`: Status, Commit, What was done, and where relevant Decisions (D-XXX), Findings that change the plan, Verification and AI corrections. The doc update goes into the same commit as the step's code.

### AI Log
Every case where AI output was wrong and had to be corrected is added to `docs/ai-log.md` when it happens (date, stage, what the AI did, what was wrong, how it was caught/fixed). Stage logs reference the entry; the README AI note is picked from this log.

### Docs Follow the Code
Keep project docs in sync as each stage lands: update `architecture.md` and the present/planned markers in `tech-stack.md` when something is built or changes. The final README and DECISIONS are assembled from `docs/`, not written from memory.
