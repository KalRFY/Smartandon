# Sparepart Implementation TODO

## Completed ✅
- [x] Fixed sparepart table to loop over `sparepartList` instead of `sparepartOptions`
- [x] Added form to add/edit spareparts with Treeselect, price, vendor, and status fields
- [x] Added "Tambah Sparepart" button when no spareparts exist
- [x] Added "Tambah Sparepart" button when spareparts already exist
- [x] Updated table to display: No, Sparepart Name, Price, Vendor, Status, Actions
- [x] Added edit and remove functionality for spareparts
- [x] Updated save function to include sparepart data
- [x] Added sparepart data loading from existing records
- [x] Exposed sparepart functions and variables to template

## Next Steps 🔄
- [ ] Test the sparepart functionality in the browser
- [ ] Verify data is properly saved to backend
- [ ] Check if backend needs updates to handle sparepart data
- [ ] Test loading existing sparepart data when editing problems
- [ ] Add validation for required sparepart fields

## Notes 📝
- Sparepart form includes: Treeselect for sparepart selection, price input, vendor input, status dropdown
- Status options: Available, Ordered, Not Available
- Form follows the same pattern as countermeasure forms
- Data is saved as `sparepartList` in the submit data
