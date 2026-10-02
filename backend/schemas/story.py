from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel

class StoryOptionsSchema(BaseModel):  #This represents one choice/option that the player can select
    text: str
    node_id: Optional[int] = None

class StoryNodeBase(BaseModel):  #This represents the basic information about a story node.
    content: str
    is_ending:bool = False
    is_winning:bool = False


class CompleteStoryNodeResponse(StoryNodeBase):  #complete node including ID and choices
    id: int
    options: List[StoryOptionsSchema] = []  #options is a list containing StoryOptionsSchema objects.

    class Config:
        from_attributes = True

class StoryBase(BaseModel):  #This represents the basic information about a story.
    title: str
    session_id: Optional[str] = None

    class Config:
        from_attributes = True

class CreateStoryRequest(BaseModel):  #This describes what the frontend sends to your API when creating a story.
    theme: str

class CompleteStoryResponse(StoryBase):  #This is the complete response your API sends back after creating a story.
    id: int
    created_at: datetime
    root_node: CompleteStoryNodeResponse
    all_nodes: Dict[int, CompleteStoryNodeResponse]

    class Config:
        from_attributes = True  #You are allowed to get the data from an object's attributes like node.id, node.content, etc."