

from services.database import (
    get_all_complaints,
    get_complaint_by_id,
    get_metrics,
    create_complaint,
    update_complaint_status,
    init_db
)

# Ensure database is initialized
init_db()
