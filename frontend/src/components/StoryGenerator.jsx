import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ThemeInput from "./ThemeInput.jsx";
import LoadingStatus from "./LoadingStatus.jsx";
import {API_BASE_URL} from "../util.js"


function StoryGenerator() {
    const navigate  = useNavigate()
    const [theme , setTheme] = useState( "")
    const [jobId, setJobId] = useState(null)
    const [jobStatus, setJobStatus] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState( false)

    useEffect( () => {
       let pollInterval;

       if  (jobId && jobStatus === "processing"){
           pollInterval = setInterval( () => {  {/*pollInterval stores the timer ID/handle returned by setInterval().*/}
               pollJobStatus(jobId)
           },5000)
       }

       return() => {  {/*This is React's cleanup function.*/}
           if (pollInterval) {  {/*When the useEffect needs to stop/restart, React runs the return function.*/}
               clearInterval(pollInterval)
           }
       }
    },[jobId,jobStatus])

    const generateStory = async (theme) => {
       setLoading(true)
        setError(null)
        setTheme(theme)

        try{
           const response = await axios.post(`${API_BASE_URL}/stories/create`, {theme})
            const {job_id, status} = response.data
            setJobId(job_id)
            setJobStatus(status)

            pollJobStatus(job_id)
        } catch (e) {
           setLoading(false)
            setError(`Failed to generate story: ${e.message}`)
        }
    }

    const pollJobStatus = async(id) =>{  {/*This function is basically a job-status checker for your story generation.*/}
        try{
           const response = await axios.get(`${API_BASE_URL}/jobs/${id}`)
            const {status, story_id, error: jobError} = response.data;  {/*equivalent to const jobError = response.data.error*/}
            setJobStatus(status)

            if(status === "completed" && story_id){
                fetchStory(story_id)
            } else if (status === "failed" || jobError){
                setError( jobError || "Failed to generate story")
                setLoading(false)
            }
        } catch (e) {
            if (e.response?.status !== 404) {
                setError(`Failed ro check story status: ${e.message}`)
                setLoading(false)
            }
        }
    }


    const fetchStory = async (id) =>{  {/* when story is completed we use this to navigate to the story page*/}
        try{
            setLoading(false)
            setJobStatus("completed")
            navigate(`/story/${id}`)
        } catch(e) {
            setError(`Failed to load story: ${e.message}`)
            setLoading(false)

        }
    }

    const reset = () =>{  {/* in case of an error we reset all values*/}
        setJobId(null)
        setJobStatus(null)
        setError(null)
        setTheme("")
        setLoading(false)
    }

    return <div className="story-generator">
        {error && <div className="error-message">
            <p>{error}</p>
            <button onClick={reset}>Try again</button>
        </div>}

        {!jobId && !error && !loading && <ThemeInput onSubmit={generateStory}/>}

        {loading && <LoadingStatus theme={theme}/>}

    </div>
}

export default StoryGenerator;