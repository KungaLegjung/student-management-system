'use client';

import { useEffect, useState } from 'react';
import './student.css';
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getTrashStudents,
  restoreStudent,
  forceDeleteStudent,
} from './api';

type Student = {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

type StudentForm = {
  name: string;
  email: string;
  phone: string;
  course: string;
};

type PageMode = 'active' | 'trash';
type DeleteType = 'soft' | 'force';
type SortField = 'id' | 'name' | 'course' | 'created_at' | 'deleted_at';
type SortDirection = 'asc' | 'desc';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [trashStudents, setTrashStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const [mode, setMode] = useState<PageMode>('active');

  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState<StudentForm>({
    name: '',
    email: '',
    phone: '',
    course: '',
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [forceDeletingId, setForceDeletingId] = useState<number | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<DeleteType | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  function extractStudents(result: any): Student[] {
    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    if (Array.isArray(result?.students)) {
      return result.students;
    }

    if (Array.isArray(result?.data?.data)) {
      return result.data.data;
    }

    return [];
  }

  function extractSingleStudent(result: any): Student | null {
    if (result?.student) {
      return result.student;
    }

    if (result?.data) {
      return result.data;
    }

    if (result?.id) {
      return result;
    }

    return null;
  }

  function formatDate(dateValue?: string) {
    if (!dateValue) {
      return '-';
    }

    return new Date(dateValue).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  function showMessage(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage('');
    }, 3000);
  }

  function validateStudentForm(data: StudentForm): string[] {
    const errors: string[] = [];

    if (data.name.trim() === '') {
      errors.push('Name is required.');
    }

    if (data.email.trim() === '') {
      errors.push('Email is required.');
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(data.email)) {
        errors.push('Enter a valid email address.');
      }
    }

    if (data.phone.trim() === '') {
      errors.push('Phone number is required.');
    } else {
      const phonePattern = /^[0-9]{10}$/;

      if (!phonePattern.test(data.phone)) {
        errors.push('Phone number must be exactly 10 digits.');
      }
    }

    if (data.course.trim() === '') {
      errors.push('Course is required.');
    }

    return errors;
  }

  async function loadActiveStudents() {
    try {
      setLoading(true);

      const result = await getStudents();
      const list = extractStudents(result);

      setStudents(list);
    } catch (error) {
      console.error(error);
      setMessage('Could not load students. Make sure Laravel backend is running.');
    } finally {
      setLoading(false);
    }
  }

  async function loadTrashStudents() {
    try {
      setLoading(true);

      const result = await getTrashStudents();
      const list = extractStudents(result);

      setTrashStudents(list);
    } catch (error) {
      console.error(error);
      setMessage('Could not load trash students.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCurrentModeData(currentMode: PageMode) {
    if (currentMode === 'active') {
      await loadActiveStudents();
    } else {
      await loadTrashStudents();
    }
  }

  useEffect(() => {
    loadCurrentModeData(mode);
  }, [mode]);

  useEffect(() => {
    const source = mode === 'active' ? students : trashStudents;

    let result = Array.isArray(source) ? [...source] : [];

    if (search.trim() !== '') {
      result = result.filter((student) =>
        student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.email?.toLowerCase().includes(search.toLowerCase()) ||
        student.phone?.toLowerCase().includes(search.toLowerCase()) ||
        student.course?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (course !== '') {
      result = result.filter((student) => student.course === course);
    }

    result.sort((a, b) => {
      let valueA: string | number = '';
      let valueB: string | number = '';

      if (sortField === 'id') {
        valueA = a.id;
        valueB = b.id;
      }

      if (sortField === 'name') {
        valueA = a.name?.toLowerCase() || '';
        valueB = b.name?.toLowerCase() || '';
      }

      if (sortField === 'course') {
        valueA = a.course?.toLowerCase() || '';
        valueB = b.course?.toLowerCase() || '';
      }

      if (sortField === 'created_at') {
        valueA = a.created_at ? new Date(a.created_at).getTime() : 0;
        valueB = b.created_at ? new Date(b.created_at).getTime() : 0;
      }

      if (sortField === 'deleted_at') {
        valueA = a.deleted_at ? new Date(a.deleted_at).getTime() : 0;
        valueB = b.deleted_at ? new Date(b.deleted_at).getTime() : 0;
      }

      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });

    setFilteredStudents(result);
  }, [
    search,
    course,
    students,
    trashStudents,
    mode,
    sortField,
    sortDirection,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, course, mode, sortField, sortDirection]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((oldDirection) =>
        oldDirection === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  function sortIcon(field: SortField) {
    if (sortField !== field) {
      return '↕';
    }

    return sortDirection === 'asc' ? '↑' : '↓';
  }

  function exportToCSV() {
    if (filteredStudents.length === 0) {
      showMessage('No data available to export.');
      return;
    }

    const headers =
      mode === 'active'
        ? ['ID', 'Name', 'Email', 'Phone', 'Course', 'Created At', 'Updated At']
        : ['ID', 'Name', 'Email', 'Phone', 'Course', 'Deleted At'];

    const rows = filteredStudents.map((student) => {
      if (mode === 'active') {
        return [
          student.id,
          student.name,
          student.email,
          student.phone,
          student.course,
          formatDate(student.created_at),
          formatDate(student.updated_at),
        ];
      }

      return [
        student.id,
        student.name,
        student.email,
        student.phone,
        student.course,
        formatDate(student.deleted_at),
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download =
      mode === 'active'
        ? 'active-students.csv'
        : 'trash-students.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showMessage('CSV exported successfully.');
  }

  function switchMode(newMode: PageMode) {
    setMode(newMode);
    setSearch('');
    setCourse('');
    setCurrentPage(1);
    setMessage('');

    if (newMode === 'active') {
      setSortField('id');
      setSortDirection('desc');
    } else {
      setSortField('deleted_at');
      setSortDirection('desc');
    }
  }

  function openCreateModal() {
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
    });

    setFormErrors([]);
    setSelectedStudent(null);
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (saving) {
      return;
    }

    setShowCreateModal(false);
    setFormErrors([]);
  }

  function openEditModal(student: Student) {
    setSelectedStudent(student);

    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      course: student.course || '',
    });

    setFormErrors([]);
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (saving) {
      return;
    }

    setShowEditModal(false);
    setSelectedStudent(null);
    setFormErrors([]);
  }

  function openViewModal(student: Student) {
    setSelectedStudent(student);
    setShowViewModal(true);
  }

  function closeViewModal() {
    setShowViewModal(false);
    setSelectedStudent(null);
  }

  function openSoftDeleteModal(student: Student) {
    setStudentToDelete(student);
    setDeleteType('soft');
    setShowDeleteModal(true);
  }

  function openForceDeleteModal(student: Student) {
    setStudentToDelete(student);
    setDeleteType('force');
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    if (deletingId || forceDeletingId) {
      return;
    }

    setShowDeleteModal(false);
    setStudentToDelete(null);
    setDeleteType(null);
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  }

  function getValidationMessages(error: any): string[] {
    if (error?.errors) {
      return Object.values(error.errors).flat() as string[];
    }

    if (error?.message) {
      return [error.message];
    }

    return ['Something went wrong.'];
  }

  async function handleCreateStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateStudentForm(formData);

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setSaving(true);

    try {
      const result = await createStudent(formData);
      const newStudent = extractSingleStudent(result);

      if (newStudent) {
        setStudents((oldStudents) => [newStudent, ...oldStudents]);
      } else {
        await loadActiveStudents();
      }

      showMessage('Student created successfully.');
      closeCreateModal();
    } catch (error: any) {
      console.error(error);
      setFormErrors(getValidationMessages(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedStudent) {
      return;
    }

    const errors = validateStudentForm(formData);

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);
    setSaving(true);

    try {
      const result = await updateStudent(selectedStudent.id, formData);
      const updatedStudent = extractSingleStudent(result);

      if (updatedStudent) {
        setStudents((oldStudents) =>
          oldStudents.map((student) =>
            student.id === updatedStudent.id ? updatedStudent : student
          )
        );
      } else {
        await loadActiveStudents();
      }

      showMessage('Student updated successfully.');
      closeEditModal();
    } catch (error: any) {
      console.error(error);
      setFormErrors(getValidationMessages(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!studentToDelete) {
      return;
    }

    setDeletingId(studentToDelete.id);

    try {
      await deleteStudent(studentToDelete.id);

      setStudents((oldStudents) =>
        oldStudents.filter((student) => student.id !== studentToDelete.id)
      );

      showMessage('Student moved to trash.');
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      setMessage('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRestore(id: number) {
    setRestoringId(id);

    try {
      const result = await restoreStudent(id);
      const restoredStudent = extractSingleStudent(result);

      setTrashStudents((oldStudents) =>
        oldStudents.filter((student) => student.id !== id)
      );

      if (restoredStudent) {
        setStudents((oldStudents) => [restoredStudent, ...oldStudents]);
      }

      showMessage('Student restored successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Restore failed.');
    } finally {
      setRestoringId(null);
    }
  }

  async function handleForceDelete() {
    if (!studentToDelete) {
      return;
    }

    setForceDeletingId(studentToDelete.id);

    try {
      await forceDeleteStudent(studentToDelete.id);

      setTrashStudents((oldStudents) =>
        oldStudents.filter((student) => student.id !== studentToDelete.id)
      );

      showMessage('Student permanently deleted.');
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      setMessage('Permanent delete failed.');
    } finally {
      setForceDeletingId(null);
    }
  }

  const totalStudents = Array.isArray(students) ? students.length : 0;
  const totalTrash = Array.isArray(trashStudents) ? trashStudents.length : 0;

  const showingStudents = Array.isArray(filteredStudents)
    ? filteredStudents.length
    : 0;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Laravel API + Next.js UI</p>
          <h1>Student Management System</h1>
          <p className="subtitle">
            A modern frontend connected to your Laravel backend and PostgreSQL database.
          </p>
        </div>

        <div className="heroActions">
          <button className="exportBtn" onClick={exportToCSV}>
            Export CSV
          </button>

          {mode === 'active' && (
            <button className="primaryBtn" onClick={openCreateModal}>
              + Add Student
            </button>
          )}
        </div>
      </section>

      <section className="statsGrid">
        <div className="statCard">
          <p>Active Students</p>
          <h2>{totalStudents}</h2>
        </div>

        <div className="statCard">
          <p>Trash Students</p>
          <h2>{totalTrash}</h2>
        </div>

        <div className="statCard">
          <p>Showing Results</p>
          <h2>{showingStudents}</h2>
        </div>
      </section>

      <section className="panel">
        <div className="tabs">
          <button
            className={mode === 'active' ? 'tabBtn activeTab' : 'tabBtn'}
            onClick={() => switchMode('active')}
          >
            Active Students
          </button>

          <button
            className={mode === 'trash' ? 'tabBtn activeTab' : 'tabBtn'}
            onClick={() => switchMode('trash')}
          >
            Trash
          </button>
        </div>

        <div className="panelHeader">
          <div>
            <h2>{mode === 'active' ? 'Students' : 'Trash'}</h2>
            <p>
              {mode === 'active'
                ? 'Search, filter, sort, export, and manage active student records.'
                : 'Restore, export, or permanently delete soft-deleted students.'}
            </p>
          </div>
        </div>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <div className="toolbar">
          <input
            type="text"
            placeholder="Search by name, email, phone, or course..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          >
            <option value="">All Courses</option>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
            <option value="B.Tech">B.Tech</option>
          </select>
        </div>

        {loading ? (
          <div className="loadingBox">
            Loading students...
          </div>
        ) : (
          <>
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>
                      <button
                        type="button"
                        className="sortBtn"
                        onClick={() => handleSort('id')}
                      >
                        ID {sortIcon('id')}
                      </button>
                    </th>

                    <th>
                      <button
                        type="button"
                        className="sortBtn"
                        onClick={() => handleSort('name')}
                      >
                        Student {sortIcon('name')}
                      </button>
                    </th>

                    <th>Email</th>
                    <th>Phone</th>

                    <th>
                      <button
                        type="button"
                        className="sortBtn"
                        onClick={() => handleSort('course')}
                      >
                        Course {sortIcon('course')}
                      </button>
                    </th>

                    {mode === 'trash' ? (
                      <th>
                        <button
                          type="button"
                          className="sortBtn"
                          onClick={() => handleSort('deleted_at')}
                        >
                          Deleted At {sortIcon('deleted_at')}
                        </button>
                      </th>
                    ) : (
                      <th>
                        <button
                          type="button"
                          className="sortBtn"
                          onClick={() => handleSort('created_at')}
                        >
                          Created At {sortIcon('created_at')}
                        </button>
                      </th>
                    )}

                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student) => (
                      <tr key={student.id}>
                        <td>#{student.id}</td>

                        <td>
                          <div className="studentName">
                            <div className="avatar">
                              {student.name?.charAt(0).toUpperCase()}
                            </div>

                            <span>{student.name}</span>
                          </div>
                        </td>

                        <td>{student.email}</td>
                        <td>{student.phone}</td>

                        <td>
                          <span className="courseBadge">
                            {student.course}
                          </span>
                        </td>

                        {mode === 'trash' ? (
                          <td>{formatDate(student.deleted_at)}</td>
                        ) : (
                          <td>{formatDate(student.created_at)}</td>
                        )}

                        <td>
                          {mode === 'active' ? (
                            <div className="actions">
                              <button
                                className="viewBtn"
                                onClick={() => openViewModal(student)}
                                disabled={deletingId === student.id}
                              >
                                View
                              </button>

                              <button
                                className="editBtn"
                                onClick={() => openEditModal(student)}
                                disabled={deletingId === student.id}
                              >
                                Edit
                              </button>

                              <button
                                className="deleteBtn"
                                onClick={() => openSoftDeleteModal(student)}
                                disabled={deletingId === student.id}
                              >
                                {deletingId === student.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          ) : (
                            <div className="actions">
                              <button
                                className="restoreBtn"
                                onClick={() => handleRestore(student.id)}
                                disabled={
                                  restoringId === student.id ||
                                  forceDeletingId === student.id
                                }
                              >
                                {restoringId === student.id ? 'Restoring...' : 'Restore'}
                              </button>

                              <button
                                className="deleteBtn"
                                onClick={() => openForceDeleteModal(student)}
                                disabled={
                                  restoringId === student.id ||
                                  forceDeletingId === student.id
                                }
                              >
                                {forceDeletingId === student.id
                                  ? 'Deleting Forever...'
                                  : 'Delete Forever'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="emptyCell"
                      >
                        {mode === 'active'
                          ? 'No students found.'
                          : 'Trash is empty.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredStudents.length > 0 && (
              <div className="paginationBar">
                <div className="paginationInfo">
                  Showing {startIndex + 1} to{' '}
                  {Math.min(endIndex, filteredStudents.length)} of{' '}
                  {filteredStudents.length}
                </div>

                <div className="paginationControls">
                  <select
                    value={itemsPerPage}
                    onChange={(event) => {
                      setItemsPerPage(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>

                  <button
                    type="button"
                    className="pageBtn"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <span className="pageNumber">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    className="pageBtn"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {showCreateModal && (
        <StudentFormModal
          title="Add Student"
          subtitle="Enter student details below."
          formData={formData}
          formErrors={formErrors}
          saving={saving}
          savingText="Saving..."
          buttonText="Save Student"
          onClose={closeCreateModal}
          onSubmit={handleCreateStudent}
          handleInputChange={handleInputChange}
        />
      )}

      {showEditModal && (
        <StudentFormModal
          title="Edit Student"
          subtitle="Update student details below."
          formData={formData}
          formErrors={formErrors}
          saving={saving}
          savingText="Updating..."
          buttonText="Update Student"
          onClose={closeEditModal}
          onSubmit={handleUpdateStudent}
          handleInputChange={handleInputChange}
        />
      )}

      {showViewModal && selectedStudent && (
        <div className="modalOverlay">
          <div className="modalBox">
            <div className="modalHeader">
              <div>
                <h2>Student Details</h2>
                <p>Complete information about this student.</p>
              </div>

              <button className="closeBtn" onClick={closeViewModal}>
                ×
              </button>
            </div>

            <div className="detailsCard">
              <div className="bigAvatar">
                {selectedStudent.name?.charAt(0).toUpperCase()}
              </div>

              <h3>{selectedStudent.name}</h3>
              <p>{selectedStudent.course}</p>
            </div>

            <div className="detailsGrid">
              <div>
                <span>ID</span>
                <strong>#{selectedStudent.id}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedStudent.email}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{selectedStudent.phone}</strong>
              </div>

              <div>
                <span>Course</span>
                <strong>{selectedStudent.course}</strong>
              </div>

              <div>
                <span>Created At</span>
                <strong>{formatDate(selectedStudent.created_at)}</strong>
              </div>

              <div>
                <span>Updated At</span>
                <strong>{formatDate(selectedStudent.updated_at)}</strong>
              </div>
            </div>

            <div className="modalActions">
              <button
                type="button"
                className="cancelBtn"
                onClick={closeViewModal}
              >
                Close
              </button>

              <button
                type="button"
                className="saveBtn"
                onClick={() => {
                  closeViewModal();
                  openEditModal(selectedStudent);
                }}
              >
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && studentToDelete && (
        <div className="modalOverlay">
          <div className="confirmModal">
            <div className="confirmIcon">
              !
            </div>

            <h2>
              {deleteType === 'soft'
                ? 'Move student to trash?'
                : 'Delete student forever?'}
            </h2>

            <p>
              {deleteType === 'soft'
                ? `This will move ${studentToDelete.name} to trash. You can restore later.`
                : `This will permanently delete ${studentToDelete.name}. This action cannot be undone.`}
            </p>

            <div className="confirmActions">
              <button
                type="button"
                className="cancelBtn"
                onClick={closeDeleteModal}
                disabled={
                  deletingId === studentToDelete.id ||
                  forceDeletingId === studentToDelete.id
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="deleteBtn"
                onClick={deleteType === 'soft' ? handleDelete : handleForceDelete}
                disabled={
                  deletingId === studentToDelete.id ||
                  forceDeletingId === studentToDelete.id
                }
              >
                {deleteType === 'soft'
                  ? deletingId === studentToDelete.id
                    ? 'Moving...'
                    : 'Move to Trash'
                  : forceDeletingId === studentToDelete.id
                    ? 'Deleting Forever...'
                    : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StudentFormModal({
  title,
  subtitle,
  formData,
  formErrors,
  saving,
  savingText,
  buttonText,
  onClose,
  onSubmit,
  handleInputChange,
}: {
  title: string;
  subtitle: string;
  formData: StudentForm;
  formErrors: string[];
  saving: boolean;
  savingText: string;
  buttonText: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <div className="modalHeader">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          <button className="closeBtn" onClick={onClose} disabled={saving}>
            ×
          </button>
        </div>

        {formErrors.length > 0 && (
          <div className="errorBox">
            <ul>
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={onSubmit} className="studentForm">
          <StudentFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            disabled={saving}
          />

          <div className="modalActions">
            <button
              type="button"
              className="cancelBtn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="saveBtn"
              disabled={saving}
            >
              {saving ? savingText : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentFormFields({
  formData,
  handleInputChange,
  disabled,
}: {
  formData: StudentForm;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  disabled: boolean;
}) {
  return (
    <>
      <div className="formGroup">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter student name"
          disabled={disabled}
        />
      </div>

      <div className="formGroup">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email"
          disabled={disabled}
        />
      </div>

      <div className="formGroup">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter 10 digit phone number"
          disabled={disabled}
        />
      </div>

      <div className="formGroup">
        <label>Course</label>
        <select
          name="course"
          value={formData.course}
          onChange={handleInputChange}
          disabled={disabled}
        >
          <option value="">Select Course</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="MBA">MBA</option>
          <option value="BBA">BBA</option>
          <option value="B.Tech">B.Tech</option>
        </select>
      </div>
    </>
  );
}