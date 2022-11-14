import quiz from '../data/quiz';
import { useCallback, useEffect, useMemo, useState } from 'react';

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export default function Home({ randomQuiz }) {
    const [index, setIndex] = useState(0);
    const [wrongAnswer, setWrongAnswer] = useState(null);
    const [rightAnswer, setRightAnswer] = useState(null);
    const [disableButtons, setDisableButtons] = useState(false);

    const [rights, setRights] = useState(0);
    const [wrongs, setWrongs] = useState(0);

    const handleClick = useCallback(() => {
        document.removeEventListener('click', handleClick);
        setIndex(index + 1);
        setRightAnswer(null);
        setWrongAnswer(null);
        setDisableButtons(false);
    }, [index]);

    const handleAnswer = (question, answer) => {
        setRightAnswer(question.rightAnswerIndex);
        setDisableButtons(true);
        if (question.rightAnswerIndex !== answer) {
            setWrongAnswer(answer);
            setWrongs(wrongs + 1);
        } else {
            setRights(rights + 1);
        }

        setTimeout(() => {
            document.addEventListener('click', handleClick);
        }, 0);
    };

    const current = randomQuiz[index];

    return (
        <div
            style={{
                width: '100vw', height: '100vh', display: 'flex',
            }}
        >
            <div
                style={{
                    maxWidth: 400, maxHeight: 500, margin: 'auto', flexGrow: 1,
                }}
            >
                <p style={{ textAlign: 'center' }}>{`${index} / ${randomQuiz.length}`}</p>
                <p style={{ textAlign: 'center', color: '#96be25' }}>{rights}</p>
                <p style={{ textAlign: 'center', color: '#be4d25' }}>{wrongs}</p>

                <p
                    style={{
                        textAlign: 'center', fontWeight: 700, fontSize: 30,
                    }}
                >
                    {current?.word}
                </p>
                <p style={{ textAlign: 'center', fontSize: 20 }}>
                    {current?.translate}
                </p>
                {disableButtons && <p style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: current.sentence }} />}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {current?.answers.map((el, i) => (
                        <button
                            key={i}
                            disabled={disableButtons}
                            onClick={() => handleAnswer(current, i)}
                            style={{
                                marginTop: 20, padding: 20, background: i === rightAnswer ? '#96be25' : (i === wrongAnswer ? '#be4d25': '#bee0ec'),
                            }}
                        >
                            {el}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
export async function getServerSideProps(context) {
    const randomQuiz = shuffle(quiz);
    return { props: { randomQuiz } };
}