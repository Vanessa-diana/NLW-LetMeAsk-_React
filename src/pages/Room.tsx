import { Button } from '../components/Button';

import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';

import { useParams } from 'react-router';

import '../styles/room.scss';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import { database } from '../services/firebase';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

}

type RoomParms = {
    id: string;
}

export function Room() {

    const params = useParams<RoomParms>();

    const roomId = params.id;

    const { user } = useAuth()

    const [newQuestion, setNewQuestion] = useState('')

    const [title, setTitle] = useState('')

    const [ questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions : FirebaseQuestions = databaseRoom.questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions)
         })

    }, [roomId]);

    async function handleCreateNewQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw new Error('ficar logado')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,

            },

            isHighLighted: false,
            isAnswered: false

        };

        await database.ref(`rooms/${roomId}/questions`).push(question);
        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <Link to='/'>
                        <img src={logoImg} alt="Letmeask" />
                    </Link>
                    <RoomCode code={roomId} />
                </div>
            </header>
            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions?.length > 0 && <span>{questions?.length} perguntas</span>}
                </div>
                <form onSubmit={handleCreateNewQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}

                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ):(
                            <span>Para enviar uma pergunta, <button>Faça seu login</button></span>
                        )}
                        <Button type='submit' disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}