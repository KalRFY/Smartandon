# TODO List for Robot Inspection Page Fix

## Completed Tasks
- [x] Add guards in computed properties to check if inspections is an array
- [x] Map selectedStatus from '0'/'1' to 'pending'/'approved' in fetchInspections
- [x] Add null checks for ai_results in template
- [x] Ensure inspections is set to array in fetchInspections
- [x] Import Op from sequelize in controller
- [x] Update getInspections to handle startDate and endDate filters
- [x] Remove unused modal (Add/Edit Item Modal)
- [x] Remove unused data properties (showModal, modalMode, selectedProblem, newItem, members, memberOption)
- [x] Remove unused methods (formatTime, isProblemHour, openAddModal, openEditModal, closeModal, saveNewItem, updateItem, formatDateForInput, getLineLabel, fetchMembers)
- [x] Remove unused computed property (rejectedCount)
- [x] Remove unused watch ('newItem.fmc')
- [x] Remove fetchMembers from created()
- [x] Remove unused components (Edit icon)
- [x] Add camera card with 5 camera placeholders
- [x] Replace filter card with AI Camera Selection card containing 5 camera placeholders with Inspect buttons

## Pending Tasks
- [ ] Test the Robot Inspection page to confirm the error is fixed and layout works
- [ ] Implement line and machine filters in BE (requires model changes or robot_id mapping)
- [ ] Add rejected status option in FE filter if needed
- [ ] Verify AI results display in details modal has null checks

## Notes
- Line and machine filters are not fully implemented in BE as they require additional logic (e.g., mapping robot_id to line/machine).
- If line/machine filters are critical, consider adding line and machine fields to the RobotInspection model.
- Camera placeholders are static; can be enhanced with live feeds later.
