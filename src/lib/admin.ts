import type { Locale } from "./portfolio";

export const adminDirectoryCopy = {
  en: {
    navLabel: "Admin",
    eyebrow: "Operations",
    title: "Contact inquiries admin workspace",
    description:
      "Review contact submissions, inspect inquiry details, and generate follow-up summaries from the in-repo admin tools.",
    backToPortfolioLabel: "Back to portfolio",
    authPanelLabel: "admin://session",
    authTitle: "Admin sign in",
    authDescription:
      "Sign in with your admin email and password. The browser receives a database-backed HTTP-only session for this admin workspace.",
    emailLoginLabel: "Admin email",
    emailLoginPlaceholder: "admin@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    signInLabel: "Sign in",
    signingInLabel: "Signing in...",
    signOutLabel: "Sign out",
    signingOutLabel: "Signing out...",
    signedInMessage: "Admin session is active.",
    signedOutMessage: "Admin session signed out.",
    authRequiredMessage: "Sign in to load inquiries.",
    authInvalidMessage: "The admin password or session was rejected.",
    authCheckingLabel: "Checking session...",
    loadLabel: "Load inquiries",
    loadingLabel: "Loading...",
    inquiriesLabel: "Recent inquiries",
    listControlsLabel: "List controls",
    searchLabel: "Search",
    searchPlaceholder: "Search by name, email, company, subject, or message",
    statusFilterLabel: "Filter status",
    statusAllLabel: "All",
    pageLabel: "Page",
    previousPageLabel: "Previous",
    nextPageLabel: "Next",
    resultsLabel: "results",
    currentUserLabel: "Signed in as",
    roleLabel: "Role",
    roleAdminLabel: "Admin",
    roleEditorLabel: "Editor",
    roleViewerLabel: "Viewer",
    permissionsReadOnlyLabel: "Read only",
    permissionsWriteLabel: "Can update inquiries",
    permissionsManageUsersLabel: "Can manage users and roles",
    detailsLabel: "Inquiry details",
    workflowLabel: "Workflow",
    sessionsLabel: "Sessions",
    sessionsEmptyLabel: "No active sessions found.",
    sessionsCurrentLabel: "Current",
    revokeSessionLabel: "Revoke",
    revokingSessionLabel: "Revoking...",
    logoutEverywhereLabel: "Logout everywhere",
    loggingOutEverywhereLabel: "Logging out...",
    sessionsUpdatedMessage: "Sessions updated.",
    usersLabel: "Users",
    usersEmptyLabel: "No users found.",
    saveRoleLabel: "Save role",
    savingRoleLabel: "Saving role...",
    roleUpdatedMessage: "User role updated.",
    historyLabel: "Activity history",
    historyEmptyLabel: "No activity recorded yet.",
    historyCreatedLabel: "Inquiry created",
    historyStatusUpdatedLabel: "Status updated",
    historyNoteUpdatedLabel: "Internal note updated",
    historyStatusAndNoteUpdatedLabel: "Status and note updated",
    historyFromLabel: "From",
    historyToLabel: "To",
    historyByLabel: "By",
    historyNoteBeforeLabel: "Previous note",
    historyNoteAfterLabel: "Current note",
    summaryLabel: "AI follow-up summary",
    emptyLabel: "No contact inquiries found yet.",
    summaryEmptyLabel: "Pick an inquiry to generate a follow-up summary.",
    generateSummaryLabel: "Generate summary",
    generatingSummaryLabel: "Generating...",
    saveChangesLabel: "Save changes",
    savingChangesLabel: "Saving...",
    savedChangesMessage: "Inquiry updated.",
    nameLabel: "Name",
    emailLabel: "Email",
    companyLabel: "Company",
    subjectLabel: "Subject",
    localeLabel: "Locale",
    deliveryLabel: "Delivery",
    statusLabel: "Status",
    internalNoteLabel: "Internal note",
    internalNotePlaceholder:
      "Add context for the next follow-up, owner handoff, or important details.",
    handledAtLabel: "Handled",
    createdAtLabel: "Created",
    messageLabel: "Message",
    summaryPromptLabel: "Prompt",
    summaryResultLabel: "Summary",
    statusNewLabel: "New",
    statusInProgressLabel: "In progress",
    statusHandledLabel: "Handled",
    requestFailedLabel: "The admin request could not be completed right now.",
  },
  th: {
    navLabel: "หลังบ้าน",
    eyebrow: "Operations",
    title: "พื้นที่หลังบ้านสำหรับข้อความติดต่อ",
    description:
      "ดูรายการข้อความติดต่อ ตรวจรายละเอียดของแต่ละ inquiry และสร้าง summary สำหรับ follow-up จากเครื่องมือ admin ที่อยู่ใน repo เดียวกัน",
    backToPortfolioLabel: "กลับสู่พอร์ตโฟลิโอ",
    authPanelLabel: "admin://session",
    authTitle: "เข้าสู่ระบบหลังบ้าน",
    authDescription:
      "เข้าสู่ระบบด้วยอีเมลและรหัสผ่านของ admin แล้ว browser จะได้รับ HTTP-only session ที่ผูกกับฐานข้อมูลสำหรับหน้า admin นี้",
    emailLoginLabel: "อีเมล admin",
    emailLoginPlaceholder: "admin@example.com",
    passwordLabel: "รหัสผ่าน",
    passwordPlaceholder: "กรอกรหัสผ่านของคุณ",
    signInLabel: "เข้าสู่ระบบ",
    signingInLabel: "กำลังเข้าสู่ระบบ...",
    signOutLabel: "ออกจากระบบ",
    signingOutLabel: "กำลังออกจากระบบ...",
    signedInMessage: "เปิดใช้งาน admin session แล้ว",
    signedOutMessage: "ออกจาก admin session แล้ว",
    authRequiredMessage: "เข้าสู่ระบบก่อนเพื่อโหลด inquiries",
    authInvalidMessage: "รหัสผ่านหรือ session ของ admin ไม่ถูกต้อง",
    authCheckingLabel: "กำลังตรวจ session...",
    loadLabel: "โหลด inquiries",
    loadingLabel: "กำลังโหลด...",
    inquiriesLabel: "รายการ inquiries ล่าสุด",
    listControlsLabel: "การควบคุมรายการ",
    searchLabel: "ค้นหา",
    searchPlaceholder: "ค้นหาจากชื่อ อีเมล บริษัท หัวข้อ หรือข้อความ",
    statusFilterLabel: "กรองสถานะ",
    statusAllLabel: "ทั้งหมด",
    pageLabel: "หน้า",
    previousPageLabel: "ก่อนหน้า",
    nextPageLabel: "ถัดไป",
    resultsLabel: "รายการ",
    currentUserLabel: "ผู้ใช้ที่เข้าสู่ระบบ",
    roleLabel: "สิทธิ์",
    roleAdminLabel: "Admin",
    roleEditorLabel: "Editor",
    roleViewerLabel: "Viewer",
    permissionsReadOnlyLabel: "ดูข้อมูลอย่างเดียว",
    permissionsWriteLabel: "อัปเดต inquiry ได้",
    permissionsManageUsersLabel: "จัดการผู้ใช้และ role ได้",
    detailsLabel: "รายละเอียด inquiry",
    workflowLabel: "Workflow",
    sessionsLabel: "Sessions",
    sessionsEmptyLabel: "ไม่พบ session ที่ใช้งานอยู่",
    sessionsCurrentLabel: "ปัจจุบัน",
    revokeSessionLabel: "ยกเลิก session",
    revokingSessionLabel: "กำลังยกเลิก...",
    logoutEverywhereLabel: "ออกจากระบบทุกอุปกรณ์",
    loggingOutEverywhereLabel: "กำลังออกจากทุกอุปกรณ์...",
    sessionsUpdatedMessage: "อัปเดต sessions แล้ว",
    usersLabel: "ผู้ใช้",
    usersEmptyLabel: "ยังไม่พบผู้ใช้",
    saveRoleLabel: "บันทึก role",
    savingRoleLabel: "กำลังบันทึก role...",
    roleUpdatedMessage: "อัปเดต role ของผู้ใช้แล้ว",
    historyLabel: "ประวัติกิจกรรม",
    historyEmptyLabel: "ยังไม่มีประวัติกิจกรรม",
    historyCreatedLabel: "สร้าง inquiry",
    historyStatusUpdatedLabel: "อัปเดตสถานะ",
    historyNoteUpdatedLabel: "อัปเดตโน้ตภายใน",
    historyStatusAndNoteUpdatedLabel: "อัปเดตสถานะและโน้ตภายใน",
    historyFromLabel: "จาก",
    historyToLabel: "เป็น",
    historyByLabel: "โดย",
    historyNoteBeforeLabel: "โน้ตก่อนหน้า",
    historyNoteAfterLabel: "โน้ตปัจจุบัน",
    summaryLabel: "AI follow-up summary",
    emptyLabel: "ยังไม่มีข้อความติดต่อในระบบ",
    summaryEmptyLabel: "เลือก inquiry ก่อนเพื่อสร้าง follow-up summary",
    generateSummaryLabel: "สร้าง summary",
    generatingSummaryLabel: "กำลังสร้าง...",
    saveChangesLabel: "บันทึกการเปลี่ยนแปลง",
    savingChangesLabel: "กำลังบันทึก...",
    savedChangesMessage: "อัปเดต inquiry แล้ว",
    nameLabel: "ชื่อ",
    emailLabel: "อีเมล",
    companyLabel: "บริษัท",
    subjectLabel: "หัวข้อ",
    localeLabel: "ภาษา",
    deliveryLabel: "การส่งต่อ",
    statusLabel: "สถานะ",
    internalNoteLabel: "โน้ตภายใน",
    internalNotePlaceholder:
      "บันทึก context สำหรับการ follow-up ครั้งถัดไป การส่งต่องาน หรือรายละเอียดสำคัญ",
    handledAtLabel: "เวลาปิดงาน",
    createdAtLabel: "เวลาสร้าง",
    messageLabel: "ข้อความ",
    summaryPromptLabel: "Prompt",
    summaryResultLabel: "Summary",
    statusNewLabel: "ใหม่",
    statusInProgressLabel: "กำลังดำเนินการ",
    statusHandledLabel: "จัดการแล้ว",
    requestFailedLabel: "ไม่สามารถเรียกใช้งาน admin request ได้ในขณะนี้",
  },
} as const satisfies Record<
  Locale,
  {
    navLabel: string;
    eyebrow: string;
    title: string;
    description: string;
    backToPortfolioLabel: string;
    authPanelLabel: string;
    authTitle: string;
    authDescription: string;
    emailLoginLabel: string;
    emailLoginPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signInLabel: string;
    signingInLabel: string;
    signOutLabel: string;
    signingOutLabel: string;
    signedInMessage: string;
    signedOutMessage: string;
    authRequiredMessage: string;
    authInvalidMessage: string;
    authCheckingLabel: string;
    loadLabel: string;
    loadingLabel: string;
    inquiriesLabel: string;
    listControlsLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    statusFilterLabel: string;
    statusAllLabel: string;
    pageLabel: string;
    previousPageLabel: string;
    nextPageLabel: string;
    resultsLabel: string;
    currentUserLabel: string;
    roleLabel: string;
    roleAdminLabel: string;
    roleEditorLabel: string;
    roleViewerLabel: string;
    permissionsReadOnlyLabel: string;
    permissionsWriteLabel: string;
    permissionsManageUsersLabel: string;
    detailsLabel: string;
    workflowLabel: string;
    sessionsLabel: string;
    sessionsEmptyLabel: string;
    sessionsCurrentLabel: string;
    revokeSessionLabel: string;
    revokingSessionLabel: string;
    logoutEverywhereLabel: string;
    loggingOutEverywhereLabel: string;
    sessionsUpdatedMessage: string;
    usersLabel: string;
    usersEmptyLabel: string;
    saveRoleLabel: string;
    savingRoleLabel: string;
    roleUpdatedMessage: string;
    historyLabel: string;
    historyEmptyLabel: string;
    historyCreatedLabel: string;
    historyStatusUpdatedLabel: string;
    historyNoteUpdatedLabel: string;
    historyStatusAndNoteUpdatedLabel: string;
    historyFromLabel: string;
    historyToLabel: string;
    historyByLabel: string;
    historyNoteBeforeLabel: string;
    historyNoteAfterLabel: string;
    summaryLabel: string;
    emptyLabel: string;
    summaryEmptyLabel: string;
    generateSummaryLabel: string;
    generatingSummaryLabel: string;
    saveChangesLabel: string;
    savingChangesLabel: string;
    savedChangesMessage: string;
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    subjectLabel: string;
    localeLabel: string;
    deliveryLabel: string;
    statusLabel: string;
    internalNoteLabel: string;
    internalNotePlaceholder: string;
    handledAtLabel: string;
    createdAtLabel: string;
    messageLabel: string;
    summaryPromptLabel: string;
    summaryResultLabel: string;
    statusNewLabel: string;
    statusInProgressLabel: string;
    statusHandledLabel: string;
    requestFailedLabel: string;
  }
>;
