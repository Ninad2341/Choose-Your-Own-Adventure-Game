import {useState} from "react"

function ThemeInput({onSubmit}){
    const [theme, setTheme] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) =>{  {/*The e is the event object. React will give you this event when the form is submitted.*/}
        e.preventDefault();
        {/*Normally, submitting an HTML form causes the browser to perform its default behavior, often refreshing/navigating the page.
You don't want that in a React application.*/}

        if(!theme.trim()){  //check whether theme is empty, trim removes the spaces from input and An empty string is considered falsey in JavaScript.
            setError("please enter a theme name");
            return
        }
        onSubmit(theme);
    }

    return <div className="theme-input-container">
        <h2>Generate Your Adventure</h2>
        <p> Enter a theme for your interactive story</p>

        <form onSubmit={handleSubmit}>
            <div className="input-group">
                {/*e.target.value gets the exact text currently sitting inside the input box at that exact split second. this is an inline arrow function*/}
                {/*if error exists then className= error otherwise "" */}
                <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Enter a theme (e.g.pirates, space, medieval...)"
                    className={error ? 'error' : ''}
                />
                {error && <p className="error-text">{error}</p>}
                   {/* If error exists, display the <p>.*/}
            </div>
            <button type="submit" className='generate-btn'>
                Generate story
            </button>
        </form>
    </div>
}

export default ThemeInput;