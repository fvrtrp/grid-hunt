import React, { useEffect, useState } from 'react'
import sha256 from 'js-sha256'
import { questions, finalHash } from './questions'

export default function Hunt(props) {

    const [ userInput, setUserInput] = useState("")
    const [currentQuestion, setQuestion] = useState(null)
    const [completed, setCompleted] = useState(false)
    const [startTime, setStartTime] = useState(new Date().getTime())
    const [totalTime, setTotalTime] = useState('')
    const [skipped, setSkipped] = useState(0)
    const [answered, setAnswered] = useState(0)

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
            setAnswered(i=>(i+1))
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
        setSkipped(i => (i+1))
        const targetQuestion = questions.find(i=>i.title === currentQuestion.title)
        const targetHash = sha256.create().update(targetQuestion.solution).hex()
        if(targetHash === finalHash) {
            const currentTime = new Date().getTime()
            setTotalTime((currentTime - startTime)/1000)
            setCompleted(true)
            return
        }
        const nextQuestion = questions.find(i=>i.key === targetHash)
        setQuestion(nextQuestion)
        setUserInput('')
    }

    if(!currentQuestion)
    return null;

    if(completed) {
        return (
            <div className="container">
                <h1 className="header">You have<br/>finished.</h1>
                You took <b>{totalTime}</b> seconds to complete.<br/>
                You solved <b>{answered}</b> puzzles, and skipped <b>{skipped}</b> puzzles.
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
            <div onClick={skipQuestion} className="skipButton">SKIP</div>
        </div>
    )
}