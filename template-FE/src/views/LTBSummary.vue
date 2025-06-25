<template>

    <CContainer fluid class="mt-4">
        <CRow>
            <CCol>
                <h3>LTB Report Status</h3>
                <p>Problem (>= 120 min)</p>
            </CCol>
        </CRow>
        <CCard class="mt-2 mb-3 px-0 custom-card">
            <CCardHeader>Table Summary</CCardHeader>
            <CRow class="mt-3 mb-3 px-3">
                <CCol xs="12">
                    <LegendStatus class="d-flex justify-content-between align-items-center w-100 mt-1 mb-2" />
                    <CInputGroup size="md" class="mt-5 w-100">
                        <CInputGroupText>Name</CInputGroupText>
                        <CFormInput placeholder="name TL/GL" v-model="findLeader" />
                    </CInputGroup>
                </CCol>
            </CRow>
            <CRow class="px-3">
                <CCol xs="12">
                    <CCard class="mb-4">
                        <CCardBody class="p-0">
                            <CTableContainer class="tableFixHead custom-table w-100"
                                style="max-height: 400px; overflow-x: auto; overflow-y: auto; display: block; padding: 0 4px; box-sizing: border-box;">
                                <CTable class="table table-bordered fixed-table w-100 mt-1 mb-1">
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col" style="width: 5%;">No</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 10%;">Date</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 10%;">Machine</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 25%;">Problem Description
                                            </CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 10%;">Duration
                                            </CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 10%;">TL</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 10%;">GL</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 5%;">TL<br />Check
                                            </CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 5%;">GL<br />Check
                                            </CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 5%;">SH<br />Check
                                            </CTableHeaderCell>
                                            <CTableHeaderCell scope="col" style="width: 5%;">Mgr<br />Check
                                            </CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">1</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">2</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">3</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">4</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">5</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">6</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">7</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">8</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">9</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">10</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">11</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">12</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">13</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">14</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">15</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">16</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">17</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">18</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">19</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell style="width: 5%;">20</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 25%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 10%;">Cell</CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-white" shape="rounded-circle"
                                                    style="width: 20px; height: 20px; border: 1px solid #000;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-warning" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-danger" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                            <CTableDataCell style="width: 5%;">
                                                <CAvatar class="bg-success" shape="rounded-circle"
                                                    style="width: 20px; height: 20px;" />
                                            </CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CTableContainer>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CCard>
        <CCard class="mt-2 mb-3 px-0 custom-card">
            <CCardHeader>Graph Summary</CCardHeader>
            <CRow class="mt-3 mb-3 px-3">
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CChart class="mb-5" height="100px" type="line" :wrapper="false" :data="{
                                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                datasets: [
                                    {
                                        label: 'My First dataset',
                                        backgroundColor: 'rgba(220, 220, 220, 0.2)',
                                        borderColor: 'rgba(220, 220, 220, 1)',
                                        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                                        pointBorderColor: '#fff',
                                        data: [40, 20, 12, 39, 10, 40, 39]
                                    },
                                    {
                                        label: 'My Second dataset',
                                        backgroundColor: 'rgba(151, 187, 205, 0.2)',
                                        borderColor: 'rgba(151, 187, 205, 1)',
                                        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                                        pointBorderColor: '#fff',
                                        data: [50, 12, 28, 29, 7, 25, 12]
                                    }
                                ]
                            }" />

                            <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CCard>
    </CContainer>
</template>

<script>
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CFormCheck,
    CTableContainer
} from '@coreui/vue'
import BarChart from '@/components/BarChart.vue'
import { CChart } from '@coreui/vue-chartjs'
import ApexCharts from 'vue3-apexcharts'
import LegendStatus from '@/components/LegendStatus.vue'
import axios from 'axios'

export default {
    name: 'SummaryWeekly',
    data() {
        return {

            types: [],
            lines: [],
            linesOptions: [],
            machines: [],
            machineOptions: [],

            visibleLiveDemo: false,
            submit: {
                machineName: null, // initialize as null to avoid showing [object Object]
            },

            series: [{
                name: 'Income',
                type: 'column',
                data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
            }, {
                name: 'Cashflow',
                type: 'column',
                data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
            }, {
                name: 'Revenue',
                type: 'line',
                data: [20, 29, 37, 36, 44, 45, 50, 58]
            }],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'line',
                    stacked: false
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: [1, 1, 4]
                },
                xaxis: {
                    categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
                },
                yaxis: [
                    {
                        seriesName: 'Income',
                        axisTicks: {
                            show: true,
                        },
                        axisBorder: {
                            show: true,
                            color: '#008FFB'
                        },
                        labels: {
                            style: {
                                colors: '#008FFB',
                            }
                        },
                        title: {
                            text: "Income (thousand crores)",
                            style: {
                                color: '#008FFB',
                            }
                        },
                        tooltip: {
                            enabled: true
                        }
                    },
                    {
                        seriesName: 'Cashflow',
                        opposite: true,
                        axisTicks: {
                            show: true,
                        },
                        axisBorder: {
                            show: true,
                            color: '#00E396'
                        },
                        labels: {
                            style: {
                                colors: '#00E396',
                            }
                        },
                        title: {
                            text: "Operating Cashflow (thousand crores)",
                            style: {
                                color: '#00E396',
                            }
                        },
                    },
                    {
                        seriesName: 'Revenue',
                        opposite: true,
                    }
                ],
            },

            containerDataA: [],
            containerDataB: [],
            containerDataC: [],
            containerProblemFup: [],
            datacollection: {
                labels: ['A', 'B', 'C', 'D'],
                datasets: [
                    { label: 'Blm Close', backgroundColor: '#f75492', data: [0, 0, 0, 0] },
                    { label: 'Sudah Close', backgroundColor: '#5954f7', data: [0, 0, 0, 0] }
                ]
            },
            options: {
                responsive: true,
                legend: { display: true },
                scales: {
                    yAxes: [{
                        ticks: { fontSize: 12, min: 0 },
                        stacked: true,
                        scaleLabel: { display: true, labelString: 'Jumlah' }
                    }],
                    xAxes: [{
                        ticks: { fontSize: 12, min: 0 },
                        stacked: true
                    }]
                }
            },
            containerTl: [],
            containerGl: [],
            tableProblemFup: [],
            isLoading: false,
            findLeader: null,
            windowWidth: window.innerWidth,
            isMobile: false
        };
    },

    components: {
        ApexCharts,
        CContainer,
        CRow,
        CCol,
        CCard,
        CCardHeader,
        CCardBody,
        CChart,
        CInputGroup,
        CInputGroupText,
        CFormInput,
        CFormCheck,
        CTableContainer,
        BarChart,
        LegendStatus,
    },

    watch: {
        findLeader(val) {
            const leader = val ? val.toUpperCase() : ''
            this.tableProblemFup = this.containerProblemFup.filter(item =>
                (item.glName || '').toUpperCase().includes(leader) ||
                (item.tlName || '').toUpperCase().includes(leader)
            )
        }
    },

    methods: {
        onResize() {
            this.windowWidth = window.innerWidth
            this.isMobile = this.windowWidth < 650
        },
        checkStatus(state) {
            if (state === 1) return 'dotApprove'
            if (state === 2) return 'dotDelay'
            if (state === 3) return 'dotComment'
            return 'dot'
        }
    },

    async mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()

        this.isLoading = true
        try {
            const result = await axios.get(`${process.env.VUE_APP_HOST}/delayProblemCm`)
            const data = result.data.data

            this.containerDataA = data[0]
            this.containerDataB = data[1]
            this.containerDataC = data[2]

            const combine = [...data[8], ...data[9]].sort((a, b) =>
                new Date(a.fstart_time) - new Date(b.fstart_time)
            )
            const mapped = combine.map(item => {
                const idxTl = this.containerTl.findIndex(x =>
                    x.line.toUpperCase() === item.fline.toUpperCase() && x.shift === item.fshift
                )
                const idxGl = this.containerGl.findIndex(x =>
                    x.line.toUpperCase() === item.fline.toUpperCase() && x.shift === item.fshift
                )
                item.tlName = this.containerTl[idxTl]?.name || ''
                item.glName = this.containerGl[idxGl]?.name || ''

                item.tlCheck = this.checkStatus(
                    item.fpermanet_cm === '[]' && item.fpermanet_cm_lama === '[]' ? 2 : 1
                )
                const daysSince = d => (Date.now() - new Date(d).getTime()) / (1000 * 3600 * 24)
                if (item.cmLhApprove === 0) {
                    item.lhCheck = daysSince(item.fstart_time) >= 1 && !item.cmLhFeedback
                        ? this.checkStatus(2)
                        : item.cmLhFeedback
                            ? this.checkStatus(3)
                            : this.checkStatus(4)
                } else item.lhCheck = this.checkStatus(1)
                if (item.cmShApprove === 0) {
                    item.shCheck = daysSince(item.fstart_time) >= 2 && !item.cmShFeedback
                        ? this.checkStatus(2)
                        : item.cmShFeedback
                            ? this.checkStatus(3)
                            : this.checkStatus(4)
                } else item.shCheck = this.checkStatus(1)
                if (item.cmDhApprove === 'null') item.cmDhApprove = 0
                if (item.cmDhApprove === 0) {
                    item.dhCheck = daysSince(item.fstart_time) >= 3 && !item.cmDhFeedback
                        ? this.checkStatus(2)
                        : item.cmDhFeedback
                            ? this.checkStatus(3)
                            : this.checkStatus(4)
                } else item.dhCheck = this.checkStatus(1)

                return item
            })

            this.containerProblemFup = mapped
            this.tableProblemFup = mapped
            this.datacollection = {
                labels: ['A', 'B', 'C', 'D'],
                datasets: [
                    { label: 'Blm Close', backgroundColor: '#f75492', data: result.data.count },
                    { label: 'Sudah Close', backgroundColor: '#5954f7', data: result.data.countFin }
                ]
            }
        } catch (err) {
            console.error('Error fetching data:', err)
        } finally {
            this.isLoading = false
        }
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    }
}
</script>

<style scoped>
.tableFixHead {
    max-height: 400px;
    overflow-y: auto;
    overflow: hidden;
}

.tableFixHead>.table {
    border-collapse: separate !important;
    border-spacing: 0 !important;
    width: 100%;
}

.fixed-table thead th {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #ffffff;
    border-bottom: 1px solid #dee2e6;
}

.fixed-table th,
.fixed-table td {
    border: 1px solid #dee2e6;
    padding: 8px;
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fixed-table tbody tr:hover {
    background-color: #f2f2f2;
}

.tableFixHead::-webkit-scrollbar {
    width: 8px;
}

.tableFixHead::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.tableFixHead::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.tableFixHead::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>