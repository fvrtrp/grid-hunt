import React, { useEffect, useState } from 'react'
import sha256 from 'js-sha256'
import { questions, finalHash } from './questions'

export default function Hunt(props) {

    const [ userInput, setUserInput] = useState("")
    const [currentQuestion, setQuestion] = useState(null)
    const [completed, setCompleted] = useState(false)
    const [startTime, setStartTime] = useState(new Date().getTime())
    const [totalTime, setTotalTime] = useState('')

    useEffect(() => {
        const nextQuestion = questions.find(i=>i.key === 0)
        setQuestion(nextQuestion)
    }, [])

    const checkPassword = (e) => {
        e.preventDefault();
        const key = currentQuestion.solution;
        let hash = sha256.create().update(userInput.toLowerCase()).hex();
        const isCorrect = hash===key;
        console.log(`wrong answer, fool`)
        if(isCorrect) {
            const nextHash = sha256.create().update(hash).hex();

            //end condition - player has finished the last question
            if(nextHash === finalHash) {
                const currentTime = new Date().getTime()
                setTotalTime((currentTime - startTime)/1000)
                setCompleted(true)
                return
            }

            const nextQuestion = questions.find(i=>i.key === nextHash);
            if(!nextQuestion) {
                //throw error
                alert(`couldn't find next question, please contact admin`);
            }
            else {
                setQuestion(nextQuestion);
                setUserInput('');
            }
        }
    }

    const skipQuestion = () => {

    }

    if(!currentQuestion)
    return null;

    if(completed) {
        return (
            <div className="container">
                <h1 className="header">You have<br/>finished.</h1>
                You took {totalTime} seconds to complete.
                <div className="winPrompt">
                    TAKE A SCREENSHOT OF THE PAGE<br/>TO MARK COMPLETION.<br/>CONGRATS!
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <h1 className="header">
                grid hunt
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
            {/* <div onClick={skipQuestion} className="skipButton">SKIP</div> */}
        </div>
    )
}