axios.defaults.headers.common['Authorization'] = 'vCvQhdKuWXtO3cwYJuvsXTZs';
let promiseQuizzes = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
promiseQuizzes.then(renderQuizzes);
promiseQuizzes.catch(alert);

function renderQuizzes(list){
    const all = document.querySelector('.allQuizzes');
    const your = document.querySelector('.yourQuizzes');
    const ownId = localStorage.getItem("id");
    if (ownId == undefined){
        your.classList.add('divCreate');
        your.innerHTML += '<div class="textYour">Você não criou nenhum quizz ainda :(</div>';
        your.innerHTML += '<div class="create" onclick="createQuizz()">Criar Quizz</div>';
    } else{
        your.innerHTML += '<div class="titleYour"><span>Seus Quizzes</span> <ion-icon name="add-circle" onclick="createQuizz()"></ion-icon></div>';
        your.innerHTML += '<div class="allYourQuizzes"></div>';
        const addYour = document.querySelector('.allYourQuizzes');
        console.log(list.data);
        list.data.forEach(element => {
            if (ownId == element.id){
                addYour.innerHTML += `<div class="caseQuizz" onclick="playQuizz()"> 
                                            <div class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); background-position:center; background-size:100%;">
                                                <span>${element.title}</span>
                                            </div>
                                        </div>`
            }
        }
        );
    }
    list.data.forEach(element => {
        console.log(element);
        all.innerHTML += `<div class="caseQuizz" onclick="playQuizz()"> 
                                <div class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); background-position: center; background-size:100%;">
                                <span>${element.title}</span>
                                </div>
                         </div>`
    });
}
function playQuizz(){
    alert();
}
function createQuizz(){
    const screen1 = document.querySelector('.screen1');
    const screen3 = document.querySelector('.screen3');
    screen1.classList.add('hidden');
    screen3.classList.remove('hidden');

}
let titleQuizz;
let urlCaseQuizz;
let level;
function nextQuestion(div){
    const dad = div.parentNode;
    console.log(dad);
    titleQuizz =  dad.querySelector('.divFirstInputs :nth-child(1)');
    urlCaseQuizz =  dad.querySelector('.divFirstInputs :nth-child(2)');
    const numberQuestions =  dad.querySelector('.divFirstInputs :nth-child(3)');
    level =  dad.querySelector('.divFirstInputs :nth-child(4)');
    console.log(titleQuizz.value);
    dad.innerHTML = '';
    dad.innerHTML += '<div class="titleThird">Crie suas perguntas</div>';
    dad.innerHTML += '<div class ="createDivs"></div>';
    dad.innerHTML += '<div class="button3" onclick="finalQuest(this)">Prosseguir pra criar níveis</div>'
    for (let i=0;i<numberQuestions.value;i++){
        dad.querySelector('.createDivs').innerHTML += `<div class = "eachCreate">
                                                                <div class="screen3-1" onclick="each(this)"><span>Pergunta ${i+1}</span><ion-icon name="create-outline"></ion-icon></div>
                                                                <div class="screen3-2 hidden" onclick="each(this)">
                                                                    <span>Pergunta ${i+1}</span>
                                                                    <div class="blockInputs">
                                                                        <input type="text" placeholder="Texto da pergunta">
                                                                        <input type="text" placeholder="Cor de fundo da pergunta">
                                                                    </div>
                                                                    <span>Resposta correta</span>
                                                                    <div class="blockInputs">
                                                                        <input type="text" placeholder="Resposta correta">
                                                                        <input type="text" placeholder="URL da imagem">
                                                                    </div>
                                                                    <span>Respostas incorretas</span>
                                                                    <div class="allBlocks">
                                                                        <div class="blockInputs">
                                                                            <input type="text" placeholder="Resposta incorreta 1">
                                                                            <input type="text" placeholder="URL da imagem 1">
                                                                        </div>
                                                                        <div class="blockInputs">
                                                                            <input type="text" placeholder="Resposta incorreta 2">
                                                                            <input type="text" placeholder="URL da imagem 2">
                                                                        </div>
                                                                        <div class="blockInputs">
                                                                            <input type="text" placeholder="Resposta incorreta 3">
                                                                            <input type="text" placeholder="URL da imagem 3">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>`;

    }
    const listQuestionScreen3 = dad.querySelector('.questionScreen3');
    console.log(dad);
}

function each(div){
    const dad = div.parentNode;
    dad.querySelector('.screen3-1').classList.toggle('hidden');
    dad.querySelector('.screen3-2').classList.toggle('hidden');
}
function finalQuest(div){
    const dad = div.parentNode;
    dad.innerHTML = '';
    dad.innerHTML += '<div class="titleThird">Agora, decida os níveis</div>';
    dad.innerHTML += '<div class ="createDivs"></div>';
    dad.innerHTML += '<div class="button3" onclick="finalQuizz(this)">Finalizar Quizz</div>'
    for (let i=0;i<level.value;i++){
        dad.querySelector('.createDivs').innerHTML += `<div class = "eachCreate">
                                                                <div class="screen3-1" onclick="each(this)"><span>Nível ${i+1}</span><ion-icon name="create-outline"></ion-icon></div>
                                                                <div class="screen3-2 hidden" onclick="each(this)">
                                                                    <span>Nível ${i+1}</span>
                                                                    <div class="blockInputs">
                                                                        <input type="text" placeholder="Título do nível">
                                                                        <input type="text" placeholder="% de acerto mínima">
                                                                        <input type="text" placeholder="URL da imagem do nível">
                                                                        <input type="text" placeholder="Descrição do nível">
                                                                    </div>                                         
                                                                </div>
                                                        </div>`;
    }
}

function finalQuizz(div){
    const dad = div.parentNode;
    dad.innerHTML = '';
    dad.innerHTML += '<div class="titleThird">Seu quizz está pronto!</div>';
    dad.innerHTML += `<div class="caseQuizz3" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${urlCaseQuizz.value}); background-position:center; background-size:100%;">
                                <span>${titleQuizz.value}</span>
                        </div>`;
    dad.innerHTML += '<div class="button3" onclick="acessQuizz(this)">Acessar Quizz</div>'
    dad.innerHTML += '<div class="backHome" onclick="backTo()">Voltar pra home</div>'
}

function acessQuizz(){

}

function backTo(){
    
}