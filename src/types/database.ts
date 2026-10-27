export type UserRole = 'teacher' | 'student' | 'admin';
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  code: string;
  teacher_id?: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  lesson_id: string;
  student_id: string;
  status: AttendanceStatus;
  marked_at: string;
  student?: Profile;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  due_date: string;
  max_score: number;
  created_at?: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url?: string;
  submission_text?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  graded_at?: string;
}