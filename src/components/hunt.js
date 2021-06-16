import React, { useEffect, useState } from 'react'
import sha256 from 'js-sha256'
import { questions } from './questions'

export default function Hunt(props) {

    const [ userInput, setUserInput] = useState("")
    const [currentQuestion, setQuestion] = useState(null)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        const nextQuestion = questions.find(i=>i.key === 0)
        setQuestion(nextQuestion)
    }, [])

    const checkPassword = (e) => {
        e.preventDefault();
        const key = currentQuestion.solution;
        let hash = sha256.create().update(userInput.toLowerCase()).hex();
        const isCorrect = hash===key;
        console.log(isCorrect);
        if(isCorrect) {
            const nextHash = sha256.create().update(hash).hex();
            const nextQuestion = questions.find(i=>i.key === nextHash);
            console.log(nextHash, nextQuestion);
            if(!nextQuestion) {
                //throw error
                console.log(`couldn't find next question`);
            }
            else {
                setQuestion(nextQuestion);
                setUserInput('');
            }
        }
        else {
            //prompt to try again
        }
    }

    if(!currentQuestion)
    return null;

    if(completed) {
        return (
            <div className="container">
                <h1 className="header">You have<br/>finished.</h1>
                <div className="winPrompt">
                    SHARE THIS SCREEN ON SLACK<br/>TO MARK COMPLETION.<br/>CONGRATS!
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <h1 className="header">
                hunt 2021
            </h1>
            <h3 className="prompt" aria-label="iamapuzzle">
                {currentQuestion.title}
            </h3>
            {
                currentQuestion.body &&
                <h5 className="promptBody">
                    {currentQuestion.body}
                </h5>
            }
            <form onSubmit={checkPassword}>
                <input
                    placeholder={"TYPE HERE"}
                    value={userInput}
                    onChange={(e)=>setUserInput(e.target.value)}
                    autoFocus
                />
            </form>
        </div>
    )
}