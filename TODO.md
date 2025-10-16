# Task Completed: Make Line Duration Cards Clickable to Open Problems Modal

## Summary of Changes:
- Added modal functionality for displaying today's problems per line
- Fixed API calls to use line_id instead of line name
- Added detailed console logging for debugging
- Commented out old OEE section as requested
- All line duration cards are now clickable and open a modal showing today's problems for that line

## Implementation Details:
- Modal displays problems with columns: No, Machine, Line, Problem, Duration, Status, Action
- API filters problems by today's date and specific line ID
- Added cursor pointer styling for better UX
- Modal closes properly and resets data on close
