export const PERMISSIONS = Object.freeze({
  // Citizen
  CREATE_COMPLAINT: "create_complaint",
  VIEW_OWN_COMPLAINT: "view_own_complaint",
  EDIT_OWN_COMPLAINT: "edit_own_complaint",
  DELETE_OWN_COMPLAINT: "delete_own_complaint",
  ADD_COMPLAINT_COMMENT: "add_complaint_comment",
  UPLOAD_COMPLAINT_PROOF: "upload_complaint_proof",

  // Officer
  VIEW_ASSIGNED_COMPLAINTS: "view_assigned_complaints",
  UPDATE_COMPLAINT_STATUS: "update_complaint_status",
  ADD_OFFICER_REMARK: "add_officer_remark",
  REQUEST_MORE_INFO: "request_more_info",
  UPLOAD_ACTION_PROOF: "upload_action_proof",
  

  // Admin
  VIEW_ALL_OFFICERS: "view_all_officers",
  VIEW_ALL_COMPLAINTS: "view_all_complaints",
  ASSIGN_COMPLAINT: "assign_complaint",
  REASSIGN_COMPLAINT: "reassign_complaint",
  UPDATE_OFFICER_DEPARTMENT: "update_officer_department",
  CLOSE_COMPLAINT: "close_complaint",
  DELETE_ANY_COMPLAINT: "delete_any_complaint",
  VIEW_ANALYTICS: "view_complaint_analytics",

  // User Management
  CREATE_OFFICER: "create_officer",
  DELETE_OFFICER: "delete_officer",
  VIEW_ALL_USERS: "view_all_users",
  CHANGE_USER_ROLE: "change_user_role"
});
