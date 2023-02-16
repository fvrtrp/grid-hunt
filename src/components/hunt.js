import React, { useEffect, useState } from 'react'
import sha256 from 'js-sha256'
import { questions, finalHash } from './questions'
import logo from '../grid-hunt.png'
import Background from './background'

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
        console.log(`wrong answer, fool`)
        if(isCorrect) {
            const nextHash = sha256.create().update(hash).hex();

            //end condition - player has finished the last question
            if(nextHash === finalHash) {
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

    if(!currentQuestion)
    return null;

    if(completed) {
        return (
            <>
                <Background />
                <div className="container">
                    <h1 className="header">You have<br/>finished.</h1>
                    <div className="winPrompt">
                        SHARE THIS SCREEN ON SLACK<br/>TO MARK COMPLETION.<br/>CONGRATS!
                        <br/>
                        But...it's not over yet.
                        Check your dm ;)
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Background />
            <div className="container">
                <h1 className="header">
                    <img src={logo} alt="logo" />
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
        </>
    )
}