axios.defaults.headers.common['Authorization'] = 'vCvQhdKuWXtO3cwYJuvsXTZs';
let promiseQuizzes = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
promiseQuizzes.then(renderQuizzes);
promiseQuizzes.catch(alert);
setTimeout(removeLoading,1000);
setTimeout(addScreen1,1000);

function addScreen1() {
    const screen1 = document.querySelector('.screen1');
    screen1.classList.remove('hidden');
}

let cont,right = 0;
let objLevels, idQuiz;
let ownDatas = JSON.parse(localStorage.getItem("dataRecived"));
console.log(ownDatas);
let aux = 0;
function renderQuizzes(list){
    console.log(list);
    const all = document.querySelector('.allQuizzes');
    const your = document.querySelector('.yourQuizzes');
    console.log(localStorage.getItem("dataRecived"));
    if (ownDatas == null){
            your.classList.add('divCreate');
            your.innerHTML += '<div class="textYour">Você não criou nenhum quizz ainda :(</div>';
            your.innerHTML += '<div class="create" onclick="createQuizz()">Criar Quizz</div>';
            list.data.forEach(element => {
                all.innerHTML += `<div class="caseQuizz" onclick="playQuizz(this)">
                                    <div class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); background-position: center; background-size:100%;">
                                    <span>${element.title}</span><span class="hidden idImagem">${element.id}</span>
                                    </div>
                             </div>`
        });
        } else{
            for (let j=0;j<ownDatas.length;j++){
                if (j==0) { 
                    your.innerHTML += '<div class="titleYour"><span>Seus Quizzes</span> <ion-icon name="add-circle" onclick="createQuizz()"></ion-icon></div>';
                    your.innerHTML += '<div class="allYourQuizzes"></div>';
                }
                const addYour = document.querySelector('.allYourQuizzes');
                list.data.forEach(element => {
                    if (ownDatas[j].id == element.id){
                        aux++;
                        addYour.innerHTML += `<div onclick="playQuizz(this)" class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); background-position:center; background-size:100%;">
                                                    <span>${element.title}</span><span class="hidden idImagem">${element.id}</span>
                                                    <div class="options-quiz"> <ion-icon name="create-outline" onclick="editQuiz(this)"></ion-icon> <ion-icon name="trash-outline" onclick="deleteQuiz(this)"></ion-icon> </div>                                           
                                                </div>`
                    }
                }
                );
                list.data.forEach(element => {
                all.innerHTML += `<div class="caseQuizz" onclick="playQuizz(this)"> 
                                    <div class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image}); background-position: center; background-size:100%;">
                                        <span>${element.title}</span><span class="hidden idImagem">${element.id}</span>
                                    </div>
                                </div>`
                });
            }
            if (aux == 0){ 
                your.classList.add('divCreate');
                your.innerHTML = '';
                your.innerHTML += '<div class="textYour">Você não criou nenhum quizz ainda :(</div>';
                your.innerHTML += '<div class="create" onclick="createQuizz()">Criar Quizz</div>';
            };
        }
}

function editQuiz(selected){

}
function deleteQuiz(selected){
    const dadDiv = selected.parentNode.parentNode;
    const idDelete = dadDiv.querySelector('.idImagem').textContent;
    let keyDelete;
    let ownDatasNew = [];
    for (let i=0; i<ownDatas.length; i++){
        console.log(keyDelete);
        if (idDelete == ownDatas[i].id){
            keyDelete = ownDatas[i].key;
        } else{
            ownDatasNew.push(ownDatas[i]);
        }
    }
    const linkDelete = `https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${idDelete}`
    let objDelete = {headers: {'Secret-Key': keyDelete }};
    const conf = confirm("Tem certeza que deseja excluir este Quiz?");
    if (conf){
        const promise = axios.delete(linkDelete, objDelete);
        promise.then(element => {
            localStorage.setItem("dataRecived", JSON.stringify(ownDatasNew));
            window.location.reload();
        }
        );
        promise.catch(error);
    }
}

function scrollNextQuestion(clickedDiv) {

    console.log(clickedDiv)
    const listAnswers = document.querySelectorAll('.container-answers');
    for(let i = 0; i<listAnswers.length; i++){
        if(listAnswers[i].classList.contains('correct-answer') || listAnswers[i].classList.contains('incorrect-answer')){
            console.log(listAnswers[i+1].parentNode)
            listAnswers[i+1].parentNode.scrollIntoView({behavior:"smooth"});
        }
    }
}

function playAgain(){

    document.querySelector('.container-screen2').innerHTML = '';
    document.querySelector('.quizz-end').classList.add('hidden')
    document.querySelector('.buttons-screen2').classList.add('hidden')

    const promise = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${idQuiz}`);
    promise.then(renderSelectedQuiz);
    promise.catch(error);
}

function showEndQuiz(){
    document.querySelector('.buttons-screen2').classList.remove('hidden');
    document.querySelector('.quizz-end').classList.remove('hidden')

    document.querySelector('.buttons-screen2').scrollIntoView({behavior:"smooth"});
}

function isFinished(){

    const listQuestions = document.querySelectorAll('.container-answers');

    for(let i = 0; i<listQuestions.length; i++){

        if(listQuestions[i].classList.contains('incorrect-answer') || listQuestions[i].classList.contains('correct-answer')){
            cont++
            console.log(cont)
            if(listQuestions[i].classList.contains('correct-answer')){
                right++
            }
        }
    }
    
    if(cont===listQuestions.length){
        setTimeout(showEndQuiz, 2000);

        const hitPercentage = Math.round((right/cont)*100);
        let levelImage, levelText, levelTitle;

        objLevels.forEach(level => {
            if(hitPercentage >= level.minValue){
                levelImage = level.image;
                levelText = level.text;
                levelTitle = level.title
            }
        })

        document.querySelector('.header-quizz-end p').innerHTML = `${hitPercentage}% de acerto: ${levelTitle}`
        document.querySelector('.body-end img').src = `${levelImage}`;
        document.querySelector('.body-end div p').innerHTML = `${levelText}`
    }
    cont=0;
    right=0;
}

function verifyAnswer(clicked){

    if (clicked.parentNode.classList.contains('correct-answer') || clicked.parentNode.classList.contains('incorrect-answer')){
        return;
    }

    clickedNode = clicked.parentNode;
    const result = clicked.querySelector('span').textContent;
    if (result == "true"){
        clickedNode.classList.add('correct-answer');
        clicked.classList.add('right-answer');
    }
    else {
        clickedNode.classList.add('incorrect-answer');
        clicked.classList.add('clicked-answer');
        const wrongSpans = clickedNode.querySelectorAll('span');
        wrongSpans.forEach(span => {
            if(span.textContent === "true"){
                span.parentNode.classList.add('right-answer')
            }
            else {
                span.parentNode.classList.add('wrong-answer')
            }
        })
    }
    setTimeout(scrollNextQuestion,2000,clickedNode);
    isFinished();
}

function renderQuestion(question){
    const questionAnswers = question.answers;
    question.answers.sort(() => Math.random()-0.5)
    const containerScreen2 = document.querySelector('.container-screen2');
    
    containerScreen2.innerHTML +=   `<div class="container-question" data-test="question">
                                        <div class="question" style="background-color:${question.color}" data-test="question-title">
                                            <div>
                                                <p>${question.title}</p>
                                            </div>
                                        </div>
                                        <div class="container-answers">
                                        </div>
                                    </div>`;
    
    for(let i = 0; i<question.answers.length; i++){

        let thisAnswers = question.answers[i];

        const containerAnswers = document.querySelectorAll('.container-answers');
        const lastQuestion = containerAnswers[containerAnswers.length - 1];

        lastQuestion.innerHTML +=  `<div class="answer" onclick="verifyAnswer(this)" data-test="answer">
                                        <img
                                            src=${question.answers[i].image}
                                            alt="resposta"
                                        />
                                        <p data-test="answer-text">${question.answers[i].text}</p>
                                        <span class="hidden">${question.answers[i].isCorrectAnswer}</span>
                                    </div>`
    }
}

function renderSelectedQuiz(response){
    console.log(response);
    const headerScreen2 = document.querySelector('.header-screen2');
    headerScreen2.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${response.data.image})`;

    const titleScreen2 = headerScreen2.querySelector('p');
    titleScreen2.innerHTML = `${response.data.title}`; //problema com a cor do titulo

    const question = response.data.questions;
    objLevels = response.data.levels;

    question.forEach(renderQuestion);
}

function error() {
    alert('Desculpe, aconteceu algum erro com o servidor.');
    backTo();
}

function removeLoading(){
    const loading = document.querySelector('.loading-page');
    loading.classList.add('hidden')
}

function loadingPageTo2(){
    const screen2 = document.querySelector('.screen2');
    screen2.classList.remove('hidden');

    removeLoading()
}

function changeScreen1To2 (){
    const screen1 = document.querySelector('.screen1');
    screen1.classList.add('hidden');

    const loading = document.querySelector('.loading-page');
    loading.classList.remove('hidden');

    setTimeout(loadingPageTo2,1000);
}

function playQuizz(selected){
    changeScreen1To2();

    idQuiz = selected.querySelector('.idImagem').textContent;
    console.log(idQuiz);

    const promise = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${idQuiz}`);
    promise.then(renderSelectedQuiz);
    promise.catch(error);
}

function playQuizz(selected){
    changeScreen1To2();

    idQuiz = selected.querySelector('.idImagem').textContent;
    console.log(idQuiz);

    const promise = axios.get(`https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes/${idQuiz}`);
    promise.then(renderSelectedQuiz);
    promise.catch(error);
}

function loadingTo3(){
    const screen3 = document.querySelector('.screen3');
    screen3.classList.remove('hidden');

    removeLoading();
}



function createQuizz(){
    const screen1 = document.querySelector('.screen1');
    screen1.classList.add('hidden');

    const loading = document.querySelector('.loading-page');
    loading.classList.remove('hidden');

    setTimeout(loadingTo3,1000);

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
    if (titleQuizz.value.length<20 || titleQuizz.value.length>65 || 
        !urlCaseQuizz.value.includes('http') || !urlCaseQuizz.value.includes('https') ||
        level.value<2 || numberQuestions.value<3){
        alert(`Dados incorretos, verifique se:
        - Título do quizz tem no mínimo 20 e no máximo 65 caracteres.
        - URL da Imagem tem formato de URL.
        - Tem no mínimo 3 perguntas.
        - Tem no mínimo 2 níveis.`);
    }else{
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
        objectToPost = {title: titleQuizz.value, image: urlCaseQuizz.value, questions: [], levels: []};
        console.log(objectToPost);
    }
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
    let first = false;
    let second = false;
    let third = false;
    const dad = div.parentNode;
    const listQuestions = dad.querySelectorAll('.eachCreate .screen3-2');
    for (let i=0; i<listQuestions.length;i++){
        if (listQuestions[i].querySelector('.b1 :nth-child(1)').value.length<20 ||
            (listQuestions[i].querySelector('.b1 :nth-child(2)').value.length!=7 || !listQuestions[i].querySelector('.b1 :nth-child(2)').value.includes('#')) ||
            (listQuestions[i].querySelector('.b2 :nth-child(1)').value.length==0 || listQuestions[i].querySelector('.b3 :nth-child(1)').value==0) ||
            (!listQuestions[i].querySelector('.b2 :nth-child(2)').value.includes('http') || !listQuestions[i].querySelector('.b2 :nth-child(2)').value.includes('https')) ||
            (!listQuestions[i].querySelector('.b3 :nth-child(2)').value.includes('http') || !listQuestions[i].querySelector('.b3 :nth-child(2)').value.includes('https'))
            ){
                first = true;
        } else{ 
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
                                        });
            if (listQuestions[i].querySelector('.b4 :nth-child(1)').value!="" || listQuestions[i].querySelector('.b4 :nth-child(2)').value!=""){
                console.log('aqui');
                console.log(listQuestions[i].querySelector('.b4 :nth-child(2)').value.includes('https'));
                if (!listQuestions[i].querySelector('.b4 :nth-child(2)').value.includes('http') || !listQuestions[i].querySelector('.b4 :nth-child(2)').value.includes('https')){
                    second = true;
                } else{
                    objectToPost.questions[i].answers.push({
                        text: listQuestions[i].querySelector('.b4 :nth-child(1)').value,
                        image: listQuestions[i].querySelector('.b4 :nth-child(2)').value,
                        isCorrectAnswer: false
                    });
                }
            };
            if (listQuestions[i].querySelector('.b5 :nth-child(1)').value!="" || listQuestions[i].querySelector('.b5 :nth-child(2)').value!=""){
                if (!listQuestions[i].querySelector('.b5 :nth-child(2)').value.includes('http') || !listQuestions[i].querySelector('.b5 :nth-child(2)').value.includes('https')){
                    third = true;
                } else{
                    objectToPost.questions[i].answers.push({
                        text: listQuestions[i].querySelector('.b5 :nth-child(1)').value,
                        image: listQuestions[i].querySelector('.b5 :nth-child(2)').value,
                        isCorrectAnswer: false
                    });
                }
            };
        };                                  
    };
    if (first || second || third){
        alert(`Dados incorretos, verifique se:
        - Texto da pergunta tem no mínimo 20 caracteres.
        - A cor de fundo é uma cor em hexadecimal (começar em "#", seguida de 6 caracteres hexadecimais, ou seja, números ou letras de A a F).
        - Textos das respostas não está vazio.
        - URL das imagens de resposta está no formato de URL.
        Obs: É obrigatória a inserção da resposta correta e de pelo menos 1 resposta errada. Portanto, é permitido existirem perguntas com só 2 ou 3 respostas em vez de 4.
        `);
        first = false;
        second = false;
        third = false;
    }else{
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
}
let listSendStorage = {id:"",key:""};
function finalQuizz(div){
    let num = 0 
    let forth = false;
    const dad = div.parentNode;
    const listLevels = dad.querySelectorAll('.eachCreate .screen3-2');
    for (let i=0; i<listLevels.length;i++){
        if(listLevels[i].querySelector('.blockInputs :nth-child(2)').value == 0){ 
            num++;
        }
        if (listLevels[i].querySelector('.blockInputs :nth-child(1)').value.length<10 || 
            !listLevels[i].querySelector('.blockInputs :nth-child(3)').value.includes('http') ||
            !listLevels[i].querySelector('.blockInputs :nth-child(3)').value.includes('https') ||
            listLevels[i].querySelector('.blockInputs :nth-child(4)').value<30 ||
            listLevels[i].querySelector('.blockInputs :nth-child(2)').value>100 ||
            listLevels[i].querySelector('.blockInputs :nth-child(2)').value<0 ||
            listLevels[i].querySelector('.blockInputs :nth-child(2)').value==""
        ){ 
            forth = false;
        }else if (num!=0){
            objectToPost.levels.push({
                                        title: listLevels[i].querySelector('.blockInputs :nth-child(1)').value,
                                        image: listLevels[i].querySelector('.blockInputs :nth-child(3)').value,
                                        text: listLevels[i].querySelector('.blockInputs :nth-child(4)').value,
                                        minValue: listLevels[i].querySelector('.blockInputs :nth-child(2)').value
                                    });
            forth = true;
        }                             
    }
    if (forth){
        console.log(objectToPost);
        let datasToSend;
        let promisePost = axios.post("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes",objectToPost);
        promisePost.then(element => {
            console.log('deu bom');
            listSendStorage.id = element.data.id;
            listSendStorage.key = element.data.key;
            if (localStorage.getItem("dataRecived") != null){
                let teste = JSON.parse(localStorage.getItem("dataRecived"));
                teste.push(listSendStorage);
                datasToSend = JSON.stringify(teste);
                localStorage.setItem("dataRecived", datasToSend);
            } else{
                datasToSend = JSON.stringify([listSendStorage]);
                localStorage.setItem("dataRecived", datasToSend);
            }
        });
        promisePost.catch(alert);
        dad.innerHTML = '';
        dad.innerHTML += '<div class="titleThird">Seu quizz está pronto!</div>';
        dad.innerHTML += `<div class="caseQuizz3" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${urlCaseQuizz.value}); background-position: center; background-size:100%;">
                                <span>${titleQuizz.value}</span>
                            </div>`;
        dad.innerHTML += '<div class="buttonEnd" onclick="acessQuizz(this)">Acessar Quizz</div>'
        dad.innerHTML += '<div class="backHome" onclick="backTo()">Voltar pra home</div>'
    }
    else{
        alert(`Dados incorretos, verique se:
        - Título do nível tem no mínimo 10 caracteres.
        - % de acerto mínima é um número entre 0 e 100.
        - URL da imagem do nível tem formato de URL.
        - Descrição do nível tem no mínimo 30 caracteres.
        - Tem pelo menos 1 nível cuja % de acerto mínima é 0%.`);
    }
}

function acessQuizz(){
    alert();
}

function backTo(){
    window.location.reload();
}
