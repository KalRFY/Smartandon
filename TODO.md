# TODO: Add Download Functionality for LTB Reports in Problems Table

## Completed Tasks
- [x] Modified ProblemsTable.vue to add a "Download LTB Report" button next to the "View LTB Report" button
- [x] Added 'downloadLtbReport' event to ProblemsTable.vue emits array
- [x] Added downloadLtbReport method in ProblemHistory.vue to handle download functionality
- [x] Added @downloadLtbReport event listener in ProblemHistory.vue template
- [x] Verified backend has /smartandon/download-report endpoint that accepts fid and problem query parameters

## Next Steps
- [ ] Test the download functionality by running the application and clicking the download button
- [ ] Ensure the downloaded file has the correct filename and content
- [ ] Handle any potential errors or edge cases (e.g., missing files, network issues)

## Notes
- The download URL uses: `${process.env.VUE_APP_API_URL}/smartandon/download-report?fid=${encodeURIComponent(problem.fid)}&problem=${encodeURIComponent(problem.ferror_name)}`
- Backend logic first checks for file_report in database, then falls back to latest file in reports/Uploads/{fid}_{problem} folder
- Frontend creates a download link and triggers the download programmatically
