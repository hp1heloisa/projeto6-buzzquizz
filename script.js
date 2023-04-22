axios.defaults.headers.common['Authorization'] = 'vCvQhdKuWXtO3cwYJuvsXTZs';
let promiseQuizzes = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
promiseQuizzes.then(renderQuizzes);
promiseQuizzes.catch(alert);

let cont,right = 0;
let objLevels, idQuiz;

function renderQuizzes(list){
    //console.log(list);
    const all = document.querySelector('.allQuizzes');
    const your = document.querySelector('.yourQuizzes');
    const ownDatas = JSON.parse(localStorage.getItem("dataRecived"));
    console.log(localStorage.getItem("dataRecived"));
    let own;
    for (let j=0;j<ownDatas.length;j++){
        if (ownDatas == null){
            your.classList.add('divCreate');
            your.innerHTML += '<div class="textYour">Você não criou nenhum quizz ainda :(</div>';
            your.innerHTML += '<div class="create" onclick="createQuizz()">Criar Quizz</div>';
        } else{
            if (j==0) { 
                your.innerHTML += '<div class="titleYour"><span>Seus Quizzes</span> <ion-icon name="add-circle" onclick="createQuizz()"></ion-icon></div>';
                your.innerHTML += '<div class="allYourQuizzes"></div>';
            }
            const addYour = document.querySelector('.allYourQuizzes');
            list.data.forEach(element => {
                if (ownDatas[j].id == element.id){
                    addYour.innerHTML += `<div onclick="playQuizz()" class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); background-position:center; background-size:100%;">
                                                <span>${element.title}</span><span class="hidden idImagem">${element.id}</span>
                                            </div>`
            }
        }
        );
    }
    list.data.forEach(element => {
        all.innerHTML += `<div class="caseQuizz" onclick="playQuizz()"> 
                                <div class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); background-position: center; background-size:100%;">
                                <span>${element.title}</span><span class="hidden idImagem">${element.id}</span>
                                </div>
                         </div>`
    });
}
function playQuizz(){
    const screen1 = document.querySelector('.screen1');
    const screen2 = document.querySelector('.screen2');
    screen1.classList.add('hidden');
    screen2.classList.remove('hidden');
}

function playQuizz(selected){
    changeScreen1To2();

    idQuiz = selected.querySelector('.idImagem').textContent;
    console.log(idQuiz);

    const promise = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${idQuiz}`);
    promise.then(renderSelectedQuiz);
    promise.catch(error);
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
let objectToPost = [];
function nextQuestion(div){
    const dad = div.parentNode;
    titleQuizz =  dad.querySelector('.divFirstInputs :nth-child(1)');
    urlCaseQuizz =  dad.querySelector('.divFirstInputs :nth-child(2)');
    const numberQuestions =  dad.querySelector('.divFirstInputs :nth-child(3)');
    level =  dad.querySelector('.divFirstInputs :nth-child(4)');
    dad.innerHTML = '';
    dad.innerHTML += '<div class="titleThird">Crie suas perguntas</div>';
    dad.innerHTML += '<div class ="createDivs"></div>';
    dad.innerHTML += '<div class="button3" onclick="finalQuest(this)">Prosseguir pra criar níveis</div>'
    for (let i=0;i<numberQuestions.value;i++){
        dad.querySelector('.createDivs').innerHTML += `<div class = "eachCreate">
                                                                <div class="screen3-1" onclick="each(this)"><span>Pergunta ${i+1}</span><ion-icon name="create-outline"></ion-icon></div>
                                                                <div class="screen3-2 hidden">
                                                                    <span onclick="each(this)">Pergunta ${i+1}</span>
                                                                    <div class="blockInputs b1">
                                                                        <input type="text" placeholder="Texto da pergunta">
                                                                        <input type="text" placeholder="Cor de fundo da pergunta">
                                                                    </div>
                                                                    <span>Resposta correta</span>
                                                                    <div class="blockInputs b2">
                                                                        <input type="text" placeholder="Resposta correta">
                                                                        <input type="text" placeholder="URL da imagem">
                                                                    </div>
                                                                    <span>Respostas incorretas</span>
                                                                    <div class="allBlocks">
                                                                        <div class="blockInputs b3">
                                                                            <input type="text" placeholder="Resposta incorreta 1">
                                                                            <input type="text" placeholder="URL da imagem 1">
                                                                        </div>
                                                                        <div class="blockInputs b4">
                                                                            <input type="text" placeholder="Resposta incorreta 2">
                                                                            <input type="text" placeholder="URL da imagem 2">
                                                                        </div>
                                                                        <div class="blockInputs b5">
                                                                            <input type="text" placeholder="Resposta incorreta 3">
                                                                            <input type="text" placeholder="URL da imagem 3">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>`;

    }
    objectToPost = [
        {title: titleQuizz.value, image: urlCaseQuizz.value, questions: [], levels: []}
    ];
    console.log(objectToPost);
}

function each(div){
    const dad = div.parentNode;
    if (dad.classList.contains('screen3-2')==true){
        dad.parentNode.querySelector('.screen3-1').classList.toggle('hidden');
        dad.parentNode.querySelector('.screen3-2').classList.toggle('hidden');
    } else{
        dad.querySelector('.screen3-1').classList.toggle('hidden');
        dad.querySelector('.screen3-2').classList.toggle('hidden');
    }
}
function finalQuest(div){
    const dad = div.parentNode;
    const listQuestions = dad.querySelectorAll('.eachCreate .screen3-2');
    for (let i=0; i<listQuestions.length;i++){
        objectToPost.questions.push({title: listQuestions[i].querySelector('.b1 :nth-child(1)').value,
                                    color: listQuestions[i].querySelector('.b1 :nth-child(2)').value,
                                    answers:[
                                            {
                                                text: listQuestions[i].querySelector('.b2 :nth-child(1)').value,
                                                image:listQuestions[i].querySelector('.b2 :nth-child(2)').value,
                                                isCorrectAnswer: true
                                            },
                                            {
                                                text: listQuestions[i].querySelector('.b3 :nth-child(1)').value,
                                                image: listQuestions[i].querySelector('.b3 :nth-child(2)').value,
                                                isCorrectAnswer: false
                                            }
                                        ]
                                    })
                                        
    }
    console.log(objectToPost);
    dad.innerHTML = '';
    dad.innerHTML += '<div class="titleThird">Agora, decida os níveis</div>';
    dad.innerHTML += '<div class ="createDivs"></div>';
    dad.innerHTML += '<div class="button3" onclick="finalQuizz(this)">Finalizar Quizz</div>'
    for (let i=0;i<level.value;i++){
        dad.querySelector('.createDivs').innerHTML += `<div class = "eachCreate">
                                                                <div class="screen3-1" onclick="each(this)"><span>Nível ${i+1}</span><ion-icon name="create-outline"></ion-icon></div>
                                                                <div class="screen3-2 hidden">
                                                                    <span onclick="each(this)">Nível ${i+1}</span>
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
let listSendStorage = {id:"",key:""};
function finalQuizz(div){
    const dad = div.parentNode;
    const listLevels = dad.querySelectorAll('.eachCreate .screen3-2');
    for (let i=0; i<listLevels.length;i++){
        objectToPost.levels.push({
                                        title: listLevels[i].querySelector('.blockInputs :nth-child(1)').value,
                                        image: listLevels[i].querySelector('.blockInputs :nth-child(3)').value,
                                        text: listLevels[i].querySelector('.blockInputs :nth-child(4)').value,
                                        minValue: listLevels[i].querySelector('.blockInputs :nth-child(2)').value
                                    });
                                        
    }
    console.log(objectToPost);
    dad.innerHTML = '';
    dad.innerHTML += '<div class="titleThird">Seu quizz está pronto!</div>';
    dad.innerHTML += `<div class="caseQuizz3" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${urlCaseQuizz.value}); background-position: center; background-size:100%;">
                                <span>${titleQuizz.value}</span>
                        </div>`;
    dad.innerHTML += '<div class="buttonEnd" onclick="acessQuizz(this)">Acessar Quizz</div>'
    dad.innerHTML += '<div class="backHome" onclick="backTo()">Voltar pra home</div>'
}

function acessQuizz(){
    alert();
}

function backTo(){
    window.location.reload();
}
