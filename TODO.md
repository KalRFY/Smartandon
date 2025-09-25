# TODO for Adding Five Why Comments Display Below DPH Section

## Current Work
Adding a read-only display section for Five Why comments (TL, LH/GL, SH) below the Department Head (DPH) approval status in EditProblemModal.vue. This will show role labels on the left and the comment text in a textarea on the right, only if the comment exists.

## Key Technical Concepts
- Vue 3 Composition API with CoreUI components (CCard, CRow, CCol, CFormTextarea).
- Conditional rendering with v-if for each comment field.
- Using existing localSubmit reactive data (fiveWhyTlFeedback, fiveWhyLhFeedback, fiveWhyShFeedback).
- Read-only display to prevent editing.
- No new dependencies or backend changes.

## Relevant Files and Code
- template-FE/src/views/ProblemHistory/EditProblemModal.vue
  - Template section: Approval status blocks (around lines 1200-1500).
  - Script: localSubmit ref contains the feedback fields.
  - No changes to script needed; only template addition.

## Problem Solving
- Ensure insertion point is after the DPH status circle row but before the "Last Report File" section to maintain layout.
- Use exact SEARCH/REPLACE for edit_file to avoid disrupting other parts.
- Style matching: Use fw-bold for labels, mt-2 for spacing between rows.

## Pending Tasks and Next Steps
- [ ] Create TODO.md (current step - just created).
- [x] Use edit_file to insert the new comments section in the template of EditProblemModal.vue.
  - SEARCH for the unique closing of DPH section and insert the new CRow/CCard block before the Last Report File CRow.
  - Exact quote from recent conversation: "Add a new CCard section below the DPH approval row titled 'Five Why Comments'. For each role (TL, LH/GL, SH), add a CRow: Left CCol with bold label, Right CCol with readonly CFormTextarea displaying the corresponding feedback if it exists."
- [x] Added separate "Countermeasure Comments" CCard below Five Why Comments, displaying cmTlFeedback, cmLhFeedback, cmShFeedback, cmDhFeedback with role labels.
- [ ] After successful edit (wait for user confirmation), execute `npm run dev` to start the dev server.
- [ ] Use browser_action to launch the app, navigate to ProblemHistory, open EditProblemModal, simulate adding comments (if needed via dev tools), and verify the section displays correctly below DPH.
- [ ] Close browser, update TODO.md with [x] for completed steps.
- [ ] If issues found (e.g., layout breaks), use edit_file to fix and retest.
- [ ] Once verified, use attempt_completion to finalize.
