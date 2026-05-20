const API_URL = process.env.NEXT_PUBLIC_API_URL; // This will connect to the backend API URL defined in the .env file

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.errors = data.errors || null;
    throw error;
  }

  return data;
}

export async function getStudents() {
  const response = await fetch(`${API_URL}/students`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse(response);
}

export async function getStudent(id) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse(response);
}

export async function createStudent(studentData) {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  return handleResponse(response);
}

export async function updateStudent(id, studentData) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  return handleResponse(response);
}

export async function deleteStudent(id) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  return handleResponse(response);
}

export async function getTrashStudents() {
  const response = await fetch(`${API_URL}/students-trash`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse(response);
}

export async function restoreStudent(id) {
  const response = await fetch(`${API_URL}/students/${id}/restore`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  return handleResponse(response);
}

export async function forceDeleteStudent(id) {
  const response = await fetch(`${API_URL}/students/${id}/force-delete`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  return handleResponse(response);
}