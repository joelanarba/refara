# MVP Requirements

## Committed MVP Features

### 1. Authentication & Access Control
- User login with email and password
- JWT-based session management
- Role-based access control (Referring Worker, Receiving Worker, Admin)
- Facility-scoped data isolation
- No self-registration — admins create user accounts

### 2. Facility Management
- CRUD operations for healthcare facilities
- Facility types: CHPS Compound, Health Center, District Hospital, Regional Hospital, Teaching Hospital, Private Clinic
- Each facility has a name, type, and location

### 3. Referral Creation & Submission
- Referring healthcare workers create maternal referrals
- Structured patient information: name, age, gestational weeks, reason for referral
- Referral urgency levels: Routine, Urgent, Emergency
- Select receiving facility
- Referral is immediately submitted upon creation (no draft state)

### 4. Incoming Referral Management
- Receiving facility workers view incoming referrals
- Acknowledge receipt of referral
- Accept or reject referrals (rejection requires reason)
- Record patient arrival
- Mark referral as completed

### 5. Referral Status Tracking
- Real-time status tracking across the referral lifecycle
- Status flow: Submitted → Acknowledged → Accepted → Arrived → Completed
- Terminal states: Rejected, Cancelled
- Cancellation allowed only before acceptance (requires reason)

### 6. Referral History & Audit Trail
- Complete status change history for every referral
- Records who changed the status, when, and why
- Immutable audit trail

### 7. Administrative Dashboard
- System-wide overview for administrators
- Active referral count and status breakdown
- Facility activity summary
- Delayed referral identification (no status change within threshold)

### 8. Basic Statistics
- Referral counts by status
- Referral counts by facility
- Referral counts by urgency

## Referral State Machine

```
SUBMITTED → ACKNOWLEDGED → ACCEPTED → ARRIVED → COMPLETED
                ↘
             REJECTED        (terminal, requires reason)
SUBMITTED/ACKNOWLEDGED → CANCELLED   (terminal, requires reason;
                                      referring worker or admin only,
                                      only before ACCEPTED)
```

## User Roles & Permissions

| Action | Referring Worker | Receiving Worker | Admin |
|--------|:---:|:---:|:---:|
| Create referral | ✓ | | |
| View own facility's referrals | ✓ | ✓ | |
| View all referrals | | | ✓ |
| Acknowledge referral | | ✓ | |
| Accept/Reject referral | | ✓ | |
| Record arrival | | ✓ | |
| Complete referral | | ✓ | |
| Cancel referral | ✓ | | ✓ |
| Manage users | | | ✓ |
| Manage facilities | | | ✓ |
| View dashboard | | | ✓ |

## Out of Scope for MVP

- Ambulance dispatch
- GPS/live location tracking
- Medical diagnosis or AI clinical decision support
- Full electronic medical records
- SMS or push notifications
- DHIS2/OpenMRS integration
- Offline-first synchronization
- Advanced analytics
- Self-registration or password reset
