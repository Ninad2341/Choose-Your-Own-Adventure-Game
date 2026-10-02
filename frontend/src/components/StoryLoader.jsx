import {useState, useEffect} from 'react';
import {useParams, useNavigate} from "react-router-dom";  {/*useParams Gets parameters from the URL. useNavigate Allows your JavaScript code to move to another page.*/}
import axios from 'axios';  {/*Axios is used to make HTTP requests.*/}
import LoadingStatus from "./LoadingStatus.jsx"
import StoryGame from "./StoryGame.jsx"
import {API_BASE_URL} from "../util.js"

function StoryLoader() {  {/*The StoryLoader component gets the story ID from the URL, fetches that story from your FastAPI backend,*/}
    const {id} = useParams();  {/*gets id from url*/}
    const navigate = useNavigate();
    const [story,setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {  {/*Run loadStory(id) when this component loads, and whenever id changes.*/}
       loadStory(id)
    },[id]);  {/*[id] this tells react this effect depends on id*/}

    const loadStory = async (storyId) =>{
        setLoading(true);
        setError(null);  {/*You don't want the old error to remain on the screen. So you reset it*/}

        try{
            const response = await axios.get(`${API_BASE_URL}/stories/${storyId}/complete`); {/*make api request to backend*/}
            setStory(response.data);  {/*Await means Wait for Axios to finish this request, then give me the response.*/}
            setLoading(false);
        } catch (err) {  {/*err contains information about what went wrong.*/}
            if (err.response?.status === 404){
                setError("Story is not found."); {/* ? means If response exists, get status. If it doesn't exist, don't crash."*/}
            } else {
                setError("Failed to load story");
            }
        } finally {
            setLoading(false);
        }
    }

    const createNewStory = () =>{
        navigate("/");  {/*navigates to homepage */}
    }

    if(loading) {
        return <LoadingStatus theme={"story"} />
    }

    if(error) {
        return <div className="story-loader">
            <div className="error-message">
                <h2>Story not found</h2>
                <p>{error}</p>
                <button onClick={createNewStory}>Go to Story Generator</button>
            </div>
        </div>
    }

    if (story) {
        return <div className="story-loader">
          <StoryGame story = {story} onNewStory={createNewStory} />
        </div>
    }
}

export default StoryLoader;