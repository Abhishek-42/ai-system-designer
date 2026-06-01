from fastapi import APIRouter, HTTPException

from app.domain.design.models import ApplyOperationsRequest, ApplyOperationsResponse
from app.services.design_service import design_service


router = APIRouter(prefix="/design", tags=["design"])


@router.get("/state")
async def get_design_state():
    try:
        return design_service.load_document()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to load design state: {str(e)}")


@router.post("/operations", response_model=ApplyOperationsResponse)
async def update_design_state(request: ApplyOperationsRequest):
    try:
        document = design_service.apply_operations(request)
        return ApplyOperationsResponse(
            document=document,
            applied_operations=len(request.operations),
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to update design state: {str(e)}")
