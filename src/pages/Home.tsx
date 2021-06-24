import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImage from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'

export function Home() {
    return (
        <div id='page-auth'>
            <aside>
                <img src={ilustrationImg} alt="Ilustração de perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire suas dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="letmeask" />
                    <button className='create-room'>
                        <img src={googleIconImage} alt="logo do google" />
                        Crie sua sala com google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form action="">
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}