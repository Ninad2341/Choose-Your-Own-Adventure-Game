from sqlalchemy.orm import Session

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from core.models import StoryLLMResponse, StoryNodeLLM

from core.prompts import STORY_PROMPT
from models.story import Story, StoryNode
from dotenv import load_dotenv

load_dotenv()

class StoryGenerator:

    @classmethod  #@classmethod is a Python decorator. This method belongs to the class itself, rather than requiring an individual object of the class
    def _get_llm(cls):  # _ at start means private function. It's not truly private. Python still allows you to call it.
        return ChatGoogleGenerativeAI(model="gemini-2.5-flash")

    @classmethod
    def generate_story(cls, db: Session, session_id: str, theme: str = "fantasy") -> Story:
        llm = cls._get_llm()
        story_parser = PydanticOutputParser(pydantic_object=StoryLLMResponse)  #This tells your program what the generated story should look like.

        prompt = ChatPromptTemplate.from_messages([
            (
                "system",  #This is your main instruction to the AI.
                STORY_PROMPT
            ),
            (
                "human",  #This is the user's actual request.
                f"Create the story with this theme: {theme}"
            )
        ]).partial(format_instructions=story_parser.get_format_instructions()) #asks the parser, What instructions should I give the LLM so that its output follows the required format?"
        #Parser → generates instructions explaining that structure.
        #.partial() → puts those instructions into your system prompt.
        #LLM → receives the completed prompt and generates the story.

        raw_response = llm.invoke(prompt.invoke({}))  #invoke llm with this particular prompt

        response_text = raw_response
        if hasattr(raw_response, "content"):  #If the LLM returned an object containing .content, extract the content
            response_text = raw_response.content

        story_structure = story_parser.parse(response_text)  #converts that text into a Pydantic object

        story_db = Story(title=story_structure.title, session_id=session_id)
        db.add(story_db)
        db.flush()

        root_node_data = story_structure.rootNode
        if isinstance(root_node_data, dict):  #instance asks Is this thing an object of this type?
            root_node_data = StoryNodeLLM.model_validate(root_node_data)  #This converts the dictionary into your Pydantic model of StoryNodeLLM.

        cls._process_story_node(db, story_db.id, root_node_data, is_root=True)

        db.commit()
        return story_db

    @classmethod
    def _process_story_node(cls, db: Session, story_id: int, node_data: StoryNodeLLM, is_root: bool= False) -> StoryNode:
      node = StoryNode(
          story_id=story_id,
          content = node_data.content if hasattr(node_data, "content") else node_data["content"], #if we cannot get .content then get "content"
          is_root=is_root,
          is_ending= node_data.isEnding if hasattr(node_data, "isEnding") else node_data["isEnding"],
          is_winning_ending= node_data.isWinningEnding if hasattr(node_data, "isWinningEnding") else node_data["isWinningEnding"],
          options=[]
      )
      db.add(node)
      db.flush()

      if not node.is_ending and (hasattr(node_data, "options") and node_data.options):
          options_list = []
          for option_data in node_data.options:
              next_node =  option_data.nextNode #stores next node

              if isinstance(next_node, dict):
                  next_node = StoryNodeLLM.model_validate(next_node)

              child_node = cls._process_story_node(db, story_id, next_node, is_root=False) #recursion

              options_list.append({  #no need to store all of the node data
                  "text": option_data.text,
                  "node_id": child_node.id
              })

          node.options = options_list

      db.flush()
      return node

